import psycopg2

conn = psycopg2.connect(
    database = "Tutors_DB",
    user = "postgres",
    password = "lokesh123",
    host = "localhost",
    port = "5432"
)

cursor = conn.cursor()

cursor.execute("select * from tutors")
cursor.execute('select * from students')

data = cursor.fetchall()

for d in data:
    print(d)

cursor.close()
