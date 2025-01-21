from transformers import pipeline

whisper = pipeline('automatic-speech-recognition', model = 'openai/whisper-medium', device = 0)

text = whisper('english.mp3')
return_timestamps=True
print(text)