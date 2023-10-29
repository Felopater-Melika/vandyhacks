import asyncio
import os
import dotenv
import logging
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Connect
from twilio.http.async_http_client import AsyncTwilioHttpClient

dotenv.load_dotenv()

account_sid = os.environ['TWILIO_ACCOUNT_SID']
auth_token = os.environ['TWILIO_AUTH_TOKEN']
def build_client():
  logging.basicConfig()
  twilio_http = AsyncTwilioHttpClient() 
  client = Client(account_sid, auth_token, http_client=twilio_http)
  twilio_http.logger.setLevel(logging.INFO)
  return client
base_url = os.environ.get('BASE_URL', "dee5-129-59-122-134.ngrok-free.app")

async def call_number(number):
  client = build_client()
  response = VoiceResponse()
  connect = Connect()
  connect.stream(
    # name='Conversation', # needs to be unique
    # track='both_tracks',
    url=f'wss://{base_url}/twilio/call_stream'
  )
  # response.pause(60)
  # response.say("HELLO WORLD!")
  response.say("hello")
  response.append(connect)
  create_res = await client.calls.create_async(
    twiml=response,
    to=number,
    from_='+18559767970'
  )
  print(create_res)

if __name__ == "__main__":
  async def main():
    await call_number('+16156179292')
    await asyncio.sleep(10)
  asyncio.run(main())
