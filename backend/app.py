import asyncio
import os
import dotenv
import json
import audioop
import base64
from quart import Quart, request, websocket
from quart import copy_current_websocket_context
from speech_recognizer import start_audio_recognizer, synth_speech
import call

dotenv.load_dotenv()

app = Quart(__name__)

# I'm going to need some way to say "hey it's been x amount of time since
# speech was recognized"

async def respond_to_packet(push_stream, write):
  while True:
    message = await websocket.receive()
    packet = json.loads(message)
    # print("recieved new message")
    if packet['event'] == 'stop':
      print("Call audio streaming stopped")
    elif packet['event'] == 'media' and packet['media']['track'] == 'inbound':
      audio = base64.b64decode(packet['media']['payload'])
      audio = audioop.ulaw2lin(audio, 2)
      audio = audioop.ratecv(audio, 2, 1, 8000, 16000, None)[0]
      # json_str = json.dumps({
      #   "event": "media",
      #   "streamSid":packet['streamSid'],
      #   "media":{
      #     "payload":packet['media']['payload']
      #   },
      # })
      # await websocket.send(json_str)
      push_stream.write(audio)
      # print("wrote message to audio")
    # else:
      # raise ValueError(f"unknown event {packet['event']}")

async def wait_for_start():
  """returns callSid"""
  while True:
    msg = await websocket.receive()
    packet = json.loads(msg)
    print(packet['event'])
    if packet['event'] == 'start':
      return packet['start']['streamSid'], packet['start']['callSid']

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
  try:
    print("recieved websocket thing")
    stream_sid, call_sid = await wait_for_start()
    print("recieved first message", call_sid)
    @copy_current_websocket_context
    async def write_to_socket(raw):
      print("write_to_socket start")
      # audio = audioop.lin2ulaw(raw, 2)
      audio = raw
      encoded = str(base64.b64encode(audio))
      json_str = json.dumps({
        "event": "media",
        "streamSid":stream_sid,
        "media":{
          "payload":encoded
        },
      })
      await websocket.send(json_str)

    async def send_msg(msg):
      print("send msg start")
      audio_data = await synth_speech(msg)
      await write_to_socket(audio_data)
      # audio_data = await asyncio.to_thread(generate_speech, msg)
      #await write_to_socket(audio_data)

    push_stream, recognizer = start_audio_recognizer(send_msg)
    await asyncio.sleep(0)

    print("started audio recognizer")
    await asyncio.create_task(respond_to_packet(push_stream, write_to_socket))
  except asyncio.CancelledError:
    # Handle here
    print("socket disconnected")
    raise

@app.route("/api/make_call")
async def start_call():
  await call.call_number("+16156179292")
  return "Called!"

if __name__ == "__main__":
  app.run(debug=True,port=8000)
