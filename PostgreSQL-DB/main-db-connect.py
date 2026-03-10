import psycopg2

conn = psycopg2.connect(
    database = 'postgres',
    user = 'postgres',
    password = 'lokesh123',
    host = 'localhost',
    port = "5432"
)

cursor = conn.cursor()

cursor.execute("select * from users")

data = cursor.fetchall()

for d in data:
    print(d)

cursor.close()
