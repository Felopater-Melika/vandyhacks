import aiohttp
import asyncio
import os
import json
import datetime
import call
from dotenv import load_dotenv

# Get the session
# async with aiohttp.ClientSession() as session:

async def create_day_checkins(session):
  api_url = os.environ['API_URL']
  async with session.post(f"{api_url}/MidnightCreate") as res:
    if res.status != 200:
      raise ValueError(await res.text())

def make_checkins():
  """The thing we'll call from a scheduler or whatever"""
  async def body():
    async with aiohttp.ClientSession() as session:
      await create_day_checkins(session)
  asyncio.run(body())

async def get_patients_to_call(s):
  """Get a list of patients we need to call."""
  api_url = os.environ['API_URL']
  print(f"api_url {api_url}")
  loop = asyncio.get_running_loop()
  print("before")
  async with aiohttp.ClientSession(loop=loop) as session:
    print("after")
    async with session.get(f"{api_url}/callNeeded") as res:
      if res.status != 200:
        raise ValueError(await res.text())
      body = json.loads(await res.text())
      return body['patients']

async def missed_call(session, patientId):
  """notify the api about a call that wasn't answered.

  Returns a boolean for if the caretaker needs to be called, and the number
  to call."""
  api_url = os.environ['API_URL']
  async with session.post(f"{api_url}/missedCall", data={
    "patientID": patientId
  }) as res:
    if res.status != 200:
      raise ValueError(await res.text())
    body = json.loads(await res.text())
    return body['callCaretaker'], body['caretakerNumber']

async def successful_call(session, patientId, startTime, endTime, complaints):
  """Notify the api of a successful call.

  complaints is a list of strings.
  """
  async with session.post(f"{api_url}/successfulCall", {
    "patientId": patientId,
    "startTime": startTime.isoformat(),
    "endTime": endTime.isoformat(),
    "complaints": complaints
  }) as res:
    if res.status != 200:
      raise ValueError(await res.text())
    body = json.loads(await res.text())

async def patient_call_iteration(ses):
  print("patient call iter")
  patients = await get_patients_to_call(ses)
  print(patients)
  for patient in patients:
    patient_id = patient['id']
    success = await call.call_number(patient['phone'], patient_id, patient['name'])
    # If it was a success the endpoint will call successful_call
    # if not success:
    #   await missed_call(ses, patient_id)

async def start_patient_call_loop():
  print("start patient call loop")
  session = None
  async with aiohttp.ClientSession() as session:
    while True:
      try:
        await patient_call_iteration(session)
      except Exception as err:
        print(f"error: {err}")
      # Every ten minutes make the call.
      await asyncio.sleep(1*60)

if __name__ == "__main__":
  load_dotenv()
  start_patient_call_loop()
