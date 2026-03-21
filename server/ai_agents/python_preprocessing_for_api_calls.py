from sqlalchemy import Column, String, Integer, ForeignKey, Date, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base
import uuid
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from groq import Groq

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    student_id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)
    student_name = Column(String, nullable = False)

    marks = relationship("Marks", back_populates = "students")

class Tests(Base):
    __tablename__ = "tests"

    test_id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)
    subject = Column(String, nullable = False)
    test_date = Column(Date, nullable = False)

    marks = relationship("Marks", back_populates = "tests")

class Marks(Base):
    __tablename__ = "marks"

    marks_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.student_id"))
    test_id = Column(UUID(as_uuid=True), ForeignKey("tests.test_id"))
    score = Column(Integer, nullable=False)

    student = relationship("Student", back_populates="marks")
    test = relationship("Test", back_populates="marks")

# Loading .env file from a specific path/folder
load_dotenv(dotenv_path = "C:/Users/shoai/Downloads/Smart-Edu-Knowletive-Project/server/api/.env")

# Getting URL from .env file
DATABASE_URL = os.getenv("DATABASE_URL")

# Creating an engine & a connection
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind = engine)
session = Session()

# Query from Database
students = session.query(Student).all()

for student in students:
    print(student.student_name, [mark.score for mark in student.marks])

batch_summary = {
    "Batch Average": 0,
    "Top Performers": [],
    "At Risk Students": []
}

all_scores = []

for student in students:
    score = [mark.score for mark in student.marks]

    if score:
        avg_scores = sum(score) / len(score)
        all_scores.append(avg_scores)

        if avg_scores >= 85:
            batch_summary["Top Performers"].append(student.student_name)
        elif avg_scores < 60:
            batch_summary["At Risk Students"].append(student.student_name)

batch_summary['Batch Average'] = sum(all_scores) / len(all_scores)

print(batch_summary)

prompt = f"""
You are an education assistant. Analyze the following batch summary:
{batch_summary}

Generate a tutor report that includes:
1. Overall performance insights.
2. Suggestions for syllabus coverage.
3. Where should the student improve performance (in which subject or topic) ??
"""
# Accessing groq_api_key
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

response = client.chat.completions.create(
    model = "llama-3.3-70b-versatile",
    messages = [{"role": "user", "content": prompt}]
)

print(response.choices[0].message.content)
