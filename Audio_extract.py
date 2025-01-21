import ffmpeg

video_file = "Video_English.mp4"
audio_file = "english.mp3"

ffmpeg.input(video_file).output(audio_file, map='a').run(cmd='C:\\ffmpeg\\bin\\ffmpeg.exe')

print(f"Audio extracted and saved as '{audio_file}'")