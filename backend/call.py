import asyncio
import os
import dotenv
import logging
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Connect, Start
from twilio.http.async_http_client import AsyncTwilioHttpClient


def build_client():
  account_sid = os.environ['TWILIO_ACCOUNT_SID']
  auth_token = os.environ['TWILIO_AUTH_TOKEN']
  logging.basicConfig()
  twilio_http = AsyncTwilioHttpClient() 
  client = Client(account_sid, auth_token, http_client=twilio_http)
  twilio_http.logger.setLevel(logging.INFO)
  return client
base_url = os.environ.get('BASE_URL', "4a2e-129-59-122-134.ngrok-free.app")

async def call_caretaker(number, patientName):
  if number != "6156179292":
    return
  else:
    number = "+16156179292"
  client = build_client()
  res = VoiceResponse()
  res.say(f"""
This is Max, the automatic wellness check in service. We're calling you to
inform you that we haven't been able to get ahold of {patientName} after calling
three times. You may want to check in on them to make sure that they're okay.
""")
  created = await client.calls.create_async(
    twiml=res,
    to=number,
    from_='+18559767970'
  )
  print(created)

async def call_number(number, patientId, patientName):
  if number != "6156179292":
    return
  else:
    number = "+16156179292"
  client = build_client()
  response = VoiceResponse()
  connect = Connect()
  stream = connect.stream(
    # name='Conversation', # needs to be unique
    # track='both_tracks',
    url=f'wss://{base_url}/twilio/call_stream'
  )
  stream.parameter(name="patientId", value=patientId)
  stream.parameter(name="patientName", value=patientName)
  # response.pause(60)
  # response.say("HELLO WORLD!")
  response.say("hello")
  response.append(connect)
  print("getting ready to call", number)
  # response.redirect(f'https://{base_url}/twilio/respond', method='POST')
  create_res = await client.calls.create_async(
    twiml=response,
    to=number,
    from_='+18559767970'
  )
  return True
  # print(f"call status: {create_res['status']}")
  # return create_res['status'] == 'completed'

if __name__ == "__main__":
  dotenv.load_dotenv()
  async def main():
    await call_caretaker('+16156179292', 'Brandon Peters')
  asyncio.run(main())
