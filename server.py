from flask import Flask, request, jsonify
from gtts import gTTS
from pydub import AudioSegment
import subprocess
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts.prompt import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from transformers import pipeline
import ffmpeg
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = Flask(__name__)

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Function to extract audio from a video file
def extract_audio(video_file, audio_file):
    ffmpeg.input(video_file).output(audio_file, map='a').run(cmd='C:\\ffmpeg\\bin\\ffmpeg.exe')
    return f"Audio extracted and saved as '{audio_file}'"

# Function to translate text
def translate_text(audio_file):
    prompt = (
        "Translate the following sentence into {language} as literally as possible, "
        "preserving structure and meaning without adding interpretations: {sentence}"
    )
    prompt_template = PromptTemplate(
        input_variables=["language", "sentence"],
        template=prompt
    )
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        api_key=os.getenv("GEMINI_API_KEY")
    )
    chain = prompt_template | llm | StrOutputParser()

    # Extract text from audio
    whisper = pipeline('automatic-speech-recognition', model='openai/whisper-medium', device=0)
    text = whisper(audio_file)['text']

    # Translate text
    language = "French"
    res = chain.invoke({"language": language, "sentence": text})
    return res

# Function to generate speech from text
def text_to_speech(text, output_mp3_path, language='en'):
    tts = gTTS(text=text, lang=language)
    tts.save(output_mp3_path)

# Function to adjust audio length
def adjust_audio_length(input_audio_path, target_audio_path, output_audio_path):
    input_duration = len(AudioSegment.from_file(input_audio_path)) / 1000.0
    target_duration = len(AudioSegment.from_file(target_audio_path)) / 1000.0
    speed_change_factor = input_duration / target_duration
    if abs(speed_change_factor - 1) < 0.01:
        AudioSegment.from_file(input_audio_path).export(output_audio_path, format="mp3")
        return
    subprocess.run(["ffmpeg", "-y", "-i", input_audio_path, "-filter:a", f"atempo={speed_change_factor:.2f}", "-vn", output_audio_path])

# Function to replace audio in a video file
def replace_audio(video_path, audio_path, output_video_path):
    command = ['ffmpeg', '-y', '-i', video_path, '-i', audio_path, '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', output_video_path]
    subprocess.run(command)

# Function to upload video to Cloudinary
def upload_to_cloudinary(file_path):
    response = cloudinary.uploader.upload(file_path, resource_type="video")
    return response['url']

# Flask route for processing video
@app.route('/process-video', methods=['POST'])
def process_video():
    data = request.json
    video_url = data['video_url']

    # Download the video from the provided URL
    video_file = "input_video.mp4"
    audio_file = "extracted_audio.mp3"
    translated_audio_file = "translated_audio.mp3"
    output_video_file = "output_video.mp4"

    subprocess.run(["curl", "-o", video_file, video_url])

    # Extract audio from the video
    extract_audio(video_file, audio_file)

    # Translate the text from audio
    translated_text = translate_text(audio_file)

    # Convert translated text to speech
    text_to_speech(translated_text, translated_audio_file, language="fr")

    # Adjust audio length to match original
    adjust_audio_length(audio_file, translated_audio_file, translated_audio_file)

    # Replace audio in the video
    replace_audio(video_file, translated_audio_file, output_video_file)

    # Upload the final video to Cloudinary
    video_url = upload_to_cloudinary(output_video_file)

    return jsonify({"video_url": video_url})

if __name__ == '__main__':
    app.run(debug=True)