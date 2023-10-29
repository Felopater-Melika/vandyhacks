import aiohttp
import asyncio
import os
import json
import datetime

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

async def get_patients_to_call(session):
  """Get a list of patients we need to call."""
  api_url = os.environ['API_URL']
  async with session.post(f"{api_url}/callNeeded") as res:
    if res.status != 200:
      raise ValueError(await res.text())
    body = json.loads(await res.text())
    return body['patients']

async def missed_call(session, patientId):
  """notify the api about a call that wasn't answered.

  Returns a boolean for if the caretaker needs to be called, and the number
  to call."""
  api_url = os.environ['API_URL']
  async with session.post(f"{api_url}/missedCall", {
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

async def patient_call_iteration(session):
  patients = await get_patients_to_call(session)
  print(patients)
  for patient in patients:
    patient_id = patient['id']
    success = await call.call_number(patient['phone'], patient_id, patient['name'])
    # If it was a success the endpoint will call successful_call
    if not success:
      await missed_call(session, patient_id)

async def start_patient_call_loop(session):
  while True:
    await patient_call_iteration(session)
    # Every ten minutes make the call.
    await asyncio.sleep(10*60)

if __name__ == "__main__":
  async def main():
    async with aiohttp.ClientSession() as session:
      patients = await get_patients_to_call(session)
      print(patients)
  asyncio.run(main())
