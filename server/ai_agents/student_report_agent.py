import os
from dotenv import load_dotenv
from groq import Groq
from sqlalchemy import MetaData, Table
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine

# Loading .env file from a specific path/folder
load_dotenv(dotenv_path = "C:/Users/shoai/Downloads/Smart-Edu-Knowletive-Project/server/api/.env")

# Getting URL from .env file
DATABASE_URL = os.getenv("DATABASE_URL")

# Creating an engine & a connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind = engine)
session = SessionLocal()

# Reflecting existing tables
Base = automap_base()
Base.prepare(engine, reflect = True)

# Access existing tables as ORM classes
Student = Base.classes.students
Marks = Base.classes.marks

# Accessing groq_api_key
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Fetching data from DB
students = session.query(Student).all()

student_data = {
    "Batch" : "Math Batch A",
    "Students" : []
}

for s in students:
    marks = [m.score for m in session.query(Marks).filter(Marks.student_id == s.student_id).all()]
    student_data['Students'].append({"name" : s.student_name, "marks": marks})

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
