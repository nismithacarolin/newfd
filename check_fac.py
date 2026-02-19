import sqlite3
conn = sqlite3.connect("instance/college_cms_v2.db")
cur = conn.cursor()
cur.execute("SELECT COUNT(*) FROM faculty")
print(f"FACULTY COUNT: {cur.fetchone()[0]}")
conn.close()
