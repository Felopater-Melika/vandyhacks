import asyncio
import os
import dotenv
import json
import audioop
import base64
import aiohttp
from datetime import datetime
from quart import Quart, request, websocket
from quart import copy_current_websocket_context, copy_current_app_context
from speech_recognizer import start_audio_recognizer, synth_speech
import call
import ai
import api

dotenv.load_dotenv()

app = Quart(__name__)

#   # TODO: write a handler to call app.client.close() when app ends
#   app.client = session
#   print('startup')
  # asyncio.create_task(api.start_patient_call_loop(session))

# I'm going to need some way to say "hey it's been x amount of time since
# speech was recognized"

async def respond_to_packet(push_stream, patient_id, start_time):
  while True:
    message = await websocket.receive()
    packet = json.loads(message)
    # print("recieved new message")
    if packet['event'] == 'stop':
      end_time = datetime.now()
      print("end of call")
      complaint = await ai.generate_report(patient_id)
      print(f"complaint: {complaint}")
      await api.successful_call(app.client, patient_id, start_time,
        end_time, [complaint])
    elif packet['event'] == 'media' and packet['media']['track'] == 'inbound':
      audio = base64.b64decode(packet['media']['payload'])
      audio = audioop.ulaw2lin(audio, 2)
      audio = audioop.ratecv(audio, 2, 1, 8000, 16000, None)[0]
      push_stream.write(audio)

async def wait_for_start():
  """returns streamSid, callSid, patientId"""
  while True:
    msg = await websocket.receive()
    packet = json.loads(msg)
    print(packet['event'])
    if packet['event'] == 'start':
      stream_sid = packet['start']['streamSid']
      call_sid = packet['start']['callSid']
      params = packet['start']['customParameters']
      patient_id = params['patientId']
      patient_name = params['patientName']
      return stream_sid, call_sid, patient_id, patient_name

# Encode audio for twilio:
# https://www.twilio.com/docs/voice/twiml/stream#message-media-to-twilio
# Actually don't need this because I'm using the say trick

msg_queue = asyncio.Queue()

@app.route('/twilio/respond', methods=['GET','POST'])
async def redirect():
  print("starting redirect!")
  # target_num = request.args.get('To')
  # if target_num in queues and not queues[target_num].empty():
  if msg_queue.empty():
    msg = await msg_queue.get()
    print("got a message!")
    return call.make_respond(msg)
  else:
    return call.make_respond(None)

@app.websocket("/twilio/call_stream")
async def call_socket():
  async with aiohttp.ClientSession() as client:
    try:
      app.client = client
      print("recieved websocket thing")
      stream_sid, call_sid, patient_id, patient_name = await wait_for_start()
      start_time = datetime.now()
      print("recieved first message", call_sid, "at", start_time)

      # @copy_current_websocket_context
      async def write_to_socket(raw):
        print("write_to_socket start")
        # audio = audioop.lin2ulaw(raw, 2)
        # header_end_index = raw.find(bytes([64, 61, 74, 61]))
        # print(f"header end {header_end_index}")
        print(raw[0:4].decode())
        data_section = raw.find(bytes("data", 'utf-8'))
        print(f"data section {data_section}")
        if data_section != -1:
          audio = raw[data_section+8:]
        else:
          audio = raw
        print(f"channels: {raw[23:25]}")
        encoded = base64.b64encode(audio).decode('utf-8')
        print(encoded)
        json_str = json.dumps({
          "event": "media",
          "streamSid":stream_sid,
          "media":{
            "payload":encoded
          },
        })
        await websocket.send(json_str)

      @copy_current_websocket_context
      async def send_msg(msg):
        try:
          print("send msg start")
          if msg != '':
            res = await ai.process_response(msg, 'einar')
            print(f"GOT AI response! {res}")
            audio_data = await synth_speech(res)
            await write_to_socket(audio_data)
            await websocket.send(json.dumps({
              "event":"mark",
              "streamSid":stream_sid,
              "mark":{
                "name":"send_mark",
              },
            }))
            print('end write_to_socket')
        except Exception as err:
          print(f"send_msg error: {err}")
        # audio_data = await asyncio.to_thread(generate_speech, msg)
        #await write_to_socket(audio_data)

      push_stream, recognizer = start_audio_recognizer(send_msg)
      await asyncio.sleep(0)

      print("started audio recognizer")
      await asyncio.create_task(respond_to_packet(push_stream,
        patient_id, start_time))
    except asyncio.CancelledError:
      # Handle here
      print("socket disconnected")
      raise

@app.route("/call_api/make_call")
async def start_call():
  await call.call_number("+16156179292")
  return "Called!"

if __name__ == "__main__":
  async def main():
    await asyncio.gather(
      app.run_task(debug=True,port=8000),
      api.start_patient_call_loop()
    )
  asyncio.run(main())
