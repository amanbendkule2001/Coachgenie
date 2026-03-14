import time
import google.generativeai as genai
from gtts import gTTS

genai.configure(api_key="AIzaSyDTiynmbqvwIqPCEtSefurfb0zBs0ZB4KA")

video_path = r"C:\Users\shoai\Downloads\Smart-Edu-Knowletive-Project\translations-for-videos\videos-input\Translation-Video-3.mp4"

# Upload file
video_file = genai.upload_file(path=video_path)

# Wait until file becomes ACTIVE
while video_file.state.name != "ACTIVE":
    print("Processing video...")
    time.sleep(5)
    video_file = genai.get_file(video_file.name)

print("Video ready!")

# Load model
model = genai.GenerativeModel("gemini-2.5-flash")

# Generate summary
response = model.generate_content([
    video_file,
    "Summarize this video in Marathi in 10 short and simple sentences."
])

summary_text = response.text
print(summary_text)

# Convert to speech
tts = gTTS(summary_text, lang="mr")
tts.save("summary_audio-video-3-10-sent-marathi.mp3")

print("Audio saved as summary_audio.mp3")
