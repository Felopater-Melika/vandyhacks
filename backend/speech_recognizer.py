from langchain.docstore.document import Document
import os
import asyncio
import quart
from quart import copy_current_websocket_context
import azure.cognitiveservices.speech as speech
import azure.cognitiveservices.speech.audio as saudio
from dotenv import load_dotenv
from google.cloud import texttospeech_v1


async def synth_speech(msg):
  # Create a client
  client = texttospeech_v1.TextToSpeechAsyncClient()

  # Initialize request argument(s)
  input = texttospeech_v1.SynthesisInput()
  input.text = msg

  print("setup input")
  voice = texttospeech_v1.VoiceSelectionParams()
  voice.language_code = "en-US"
  print("setup voice")

  audio_config = texttospeech_v1.AudioConfig()
  audio_config.audio_encoding = "MULAW"
  audio_config.sample_rate_hertz = 8000
  print("setup audio")

  request = texttospeech_v1.SynthesizeSpeechRequest(
    input=input,
    voice=voice,
    audio_config=audio_config,
  )
  print("setup request")

  # Make the request
  response = await client.synthesize_speech(request=request)
  print("got response")

  # Handle the response
  return response.audio_content


def generate_speech(text):
  # asyncio.to_thread if I need to
  try:
    print("generating speech")
    speech_key = os.environ.get('SPEECH_KEY')
    speech_region = os.environ.get('SPEECH_REGION')
    speech_config = speech.SpeechConfig(speech_key, speech_region)
    speech_config.set_property(speech.PropertyId.Speech_LogFilename, "./logfile.txt")
    speech_config.speech_synthesis_voice_name='en-US-JennyNeural'
    audio_format = saudio.AudioStreamFormat(
      bits_per_sample=16, channels=1, samples_per_second=16000)
    print("creating callback")
    # callback = StreamCallback(loop, send_audio)
    # push_stream = saudio.PushAudioOutputStream(callback)
    # audio_config = saudio.AudioConfig(stream = push_stream)
    print("creating speech synth")
    synthesizer = speech.SpeechSynthesizer(speech_config=speech_config)
    print("created synthesizer")
      # audio_config=audio_config)
    # Speech futures are different than asyncio futures
    result = synthesizer.speak_text(text)
    print("synthd text")
    return result.audio_data
  except Exception as err:
    print(f"error: {err}")

def start_audio_recognizer(handle_event):
  print("entered start_audio_recognizer")
  speech_key = os.environ.get('SPEECH_KEY')
  speech_region = os.environ.get('SPEECH_REGION')
  logfile_path = os.environ.get('SPEECH_LOG_FILE')
  speech_config = speech.SpeechConfig(speech_key, speech_region)
  if logfile_path:
    speech_config.set_property(speech.PropertyId.Speech_LogFilename, logfile_path)
  speech_config.speech_recognition_language="en-US"
  # Set up the format for the audio stream
  audio_format = saudio.AudioStreamFormat(
    bits_per_sample=16, channels=1, samples_per_second=16000)
  # We use a push audio stream that maintains an internal buffer we can write
  # to from elsewhere. I don't know if we need a lock for it.
  push_stream = saudio.PushAudioInputStream(audio_format)
  audio_config = speech.audio.AudioConfig(stream=push_stream)
  recognizer = speech.SpeechRecognizer(
    speech_config=speech_config, audio_config=audio_config)
  # We start the speech recognizer here.
  recognizer.start_continuous_recognition_async()
  print("STARTED SPEECH RECOGNITION")
  # I'm not sure why we need to do this when it's already having a session
  # stopped or canceled event, but the docs say to do so.
  def stop_cb():
    nonlocal recognizer
    end_recognition(recognizer)

  # Recognizing is basically each word in a sentence as it's figuring out what
  # someone is saying.
  def recognizing_text(event):
    print("recognizing: {}".format(event.result.text))
  # Recognized is when it's settled down exactly what someone is saying and can
  # format it all. This is what we'll be adding to the transcript logs.
  # We get the 
  loop = asyncio.get_running_loop()

  async def test(msg):
    print(f"other {msg}")

  def recognized_text(event):
    print("recognized: {}".format(event.result.text))
    # This callback runs in a different thread, so we call a method to tell the
    # event loop the server is running on to schedule send_recognized_event
    # to happen soon.
    if event.result.reason == speech.ResultReason.RecognizedSpeech:
        msg = event.result.text
    elif event.result.reason == speech.ResultReason.NoMatch:
        msg = "Unable to Transcribe"
    else:
        msg = ''
    coro = handle_event(msg)
    future = asyncio.run_coroutine_threadsafe(coro, loop)
    # res = future.result()
    # print(f"waited for result {res}")

  # We don't need the partial recognition events right now.
  # We could send them to the website and have them show up live as people are
  # talking, which could be cool.
  # recognizer.recognizing.connect(recognizing_text)
  recognizer.recognized.connect(recognized_text)
  recognizer.session_stopped.connect(stop_cb)
  recognizer.canceled.connect(stop_cb)
  print("FINISHED AUDIO SETUP")
  return push_stream, recognizer

def end_recognition(recognizer):
  recognizer.stop_continuous_recognition()

if __name__ == "__main__":
  load_dotenv()
  async def handler(msg):
    pass
  start_audio_recognizer(handler)
