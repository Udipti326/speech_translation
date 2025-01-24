import os
from spleeter.separator import Separator
from pydub import AudioSegment
from google.cloud import speech, translate_v2 as translate
from gtts import gTTS

# Paths
input_audio_path = "english.mp3"  # Input audio file
output_dir = "output"  # Directory to store output files
os.makedirs(output_dir, exist_ok=True)

# Step 1: Separate vocals and background music using Spleeter
separator = Separator('spleeter:2stems')
separator.separate_to_file(input_audio_path, output_dir)
vocals_path = os.path.join(output_dir, "input_audio/vocals.wav")
music_path = os.path.join(output_dir, "input_audio/accompaniment.wav")

# Step 2: Convert vocals to text using Google Cloud Speech-to-Text
def transcribe_audio(file_path):
    client = speech.SpeechClient()
    with open(file_path, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)
    return " ".join([result.alternatives[0].transcript for result in response.results])

transcribed_text = transcribe_audio(vocals_path)

# Step 3: Translate text using Google Cloud Translation
def translate_text(text, target_language="es"):
    client = translate.Client()
    result = client.translate(text, target_language=target_language)
    return result["translatedText"]

translated_text = translate_text(transcribed_text, target_language="es")

# Step 4: Convert translated text to speech using gTTS
def text_to_speech(text, output_path):
    tts = gTTS(text, lang="es")  # Target language for TTS
    tts.save(output_path)

translated_audio_path = os.path.join(output_dir, "translated_vocals.mp3")
text_to_speech(translated_text, translated_audio_path)

# Step 5: Merge translated vocals with background music
def merge_audio(vocals_path, music_path, output_path):
    vocals = AudioSegment.from_file(vocals_path)
    music = AudioSegment.from_file(music_path)
    merged = music.overlay(vocals)
    merged.export(output_path, format="mp3")

final_audio_path = os.path.join(output_dir, "final_output.mp3")
merge_audio(translated_audio_path, music_path, final_audio_path)

print(f"Final audio saved at: {final_audio_path}")
