import mysql.connector
conn = mysql.connector.connect(
	host="localhost",
	user="your_mysql_user",
	password="your_mysql_password",
	database="college_cms"
)
cur = conn.cursor()
cur.execute("SELECT COUNT(*) FROM faculty")
print(f"FACULTY COUNT: {cur.fetchone()[0]}")
conn.close()
