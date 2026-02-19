import sqlite3
import os

def dump_db(path):
    print(f"\n--- DUMPING {path} ---")
    if not os.path.exists(path):
        print("File not found.")
        return

    try:
        conn = sqlite3.connect(path)
        cur = conn.cursor()
        cur.execute("SELECT * FROM faculty")
        rows = cur.fetchall()
        if not rows:
            print("No rows found.")
        else:
            for r in rows:
                print(r)
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

dump_db("instance/college_cms.db")
dump_db("instance/college_cms_backup.db")
dump_db("instance/college_cms_v2.db")
dump_db("new fd/instance/college_cms.db")
