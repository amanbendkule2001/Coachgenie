import os
from dotenv import load_dotenv
from groq import Groq

# Loading .env file from a specific path/folder
load_dotenv(dotenv_path = "C:/Users/shoai/Downloads/Smart-Edu-Knowletive-Project/server/api's/.env")

# Accessing groq_api_key
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Later the data will come from the DataBase & will be fetched from there
# Example student marks data
student_data = {
    "Batch": "Math Batch A",
    "Students": [
        {"name": "Ravi", "marks": [78, 85, 90]},
        {"name": "Ananya", "marks": [55, 60, 58]},
        {"name": "Suresh", "marks": [92, 88, 95]}
    ]
}

prompt = f"""
You are an education assistant. Analyze the following student marks data:
{student_data}

Generate a tutor report that includes:
1. Average performance of the batch.
2. Top performers.
3. Students at risk (below 60%).
4. Suggestions for syllabus coverage.
"""

response = client.chat.completions.create(
    model = "llama-3.3-70b-versatile",
    messages = [{"role": "user", "content": prompt}]
)

print(response.choices[0].message.content)
