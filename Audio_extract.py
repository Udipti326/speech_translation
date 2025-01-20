import ffmpeg

video_file = "SampleVideo_640x360_2mb.mp4"
audio_file = "output_audio.mp3"

ffmpeg.input(video_file).output(audio_file, map='a').run(cmd='C:\\ffmpeg\\bin\\ffmpeg.exe')

print(f"Audio extracted and saved as '{audio_file}'")