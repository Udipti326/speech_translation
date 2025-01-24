from gtts import gTTS
from pydub import AudioSegment
import subprocess
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts.prompt import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from transformers import pipeline


def translate_text():
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
        api_key="AIzaSyD0g0psx7fU7rfAGgp3uD5fKnKN7Df3zeU"
    )
    chain = prompt_template | llm | StrOutputParser()

    # Extract text from audio
    whisper = pipeline('automatic-speech-recognition', model = 'openai/whisper-medium', device = 0)
    text = whisper('english.mp3')['text']
    return_timestamps=True

    # Translate text
    # language = input("Enter the target language (e.g., French, Spanish): ")
    language = "Hindi"
    res = chain.invoke({"language": language, "sentence": text})
    return res

def text_to_speech(text, output_mp3_path, language='en'):
    tts = gTTS(text=text, lang=language)
    tts.save(output_mp3_path)

def adjust_audio_length(input_audio_path, target_audio_path, output_audio_path):
    input_duration = len(AudioSegment.from_file(input_audio_path)) / 1000.0
    target_duration = len(AudioSegment.from_file(target_audio_path)) / 1000.0
    speed_change_factor = input_duration / target_duration
    if abs(speed_change_factor - 1) < 0.01:
        AudioSegment.from_file(input_audio_path).export(output_audio_path, format="mp3")
        return
    subprocess.run(["ffmpeg", "-y", "-i", input_audio_path, "-filter:a", f"atempo={speed_change_factor:.2f}", "-vn", output_audio_path])

def replace_audio(video_path, audio_path, output_video_path):
    command = ['ffmpeg', '-y', '-i', video_path, '-i', audio_path, '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', output_video_path]
    subprocess.run(command)

text = translate_text()
text_to_speech(text, "output.mp3","hi")
adjust_audio_length("english.mp3","output.mp3","hindi.mp3")
replace_audio("Video_English.mp4", "output.mp3", "Video_Hindi.mp4")