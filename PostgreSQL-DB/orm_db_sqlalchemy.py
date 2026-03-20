import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import MetaData, Table

load_dotenv(dotenv_path='C:/Users/shoai/Downloads/Smart-Edu-Knowletive-Project/server/api/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind = engine)
session = SessionLocal()

metadata = MetaData()
students = Table("students", metadata, autoload_with = engine)

with engine.connect() as conn:
    result = conn.execute(students.select())
    for row in result:
        print(row)
