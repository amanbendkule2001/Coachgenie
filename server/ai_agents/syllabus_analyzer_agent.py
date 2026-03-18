from dotenv import load_dotenv
import os
from google import genai

# Load .env file from a specific folder
load_dotenv(dotenv_path="C:/Users/shoai/Downloads/Smart-Edu-Knowletive-Project/server/api's/.env")

# Access Gemini API key
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# List available models
# models = client.models.list()

# for model in models:
#     print(model.name)

# This data will also come from the DataBase
# Example data
syllabus_data = {
    "Course": "Physics Class 10",
    "Topics": ["Kinematics", "Laws of Motion", "Gravitation", "Work & Energy"],
    "Completed": ["Kinematics", "Laws of Motion"]
}

prompt = f"""
Analyze this syllabus data:
{syllabus_data}

Generate a tutor-facing report:
1. Percentage completed.
2. Remaining topics.
3. Suggested timeline to finish before exams.
"""

response = client.models.generate_content(
    model = "gemini-2.5-flash",
    contents = prompt
)
print(response.text)
