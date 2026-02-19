import sqlite3
import os

def check_db(path, name):
    if not os.path.exists(path):
        print(f"[{name}] File not found: {path}")
        return

    try:
        conn = sqlite3.connect(path)
        cur = conn.cursor()
        cur.execute("SELECT id, first_name, last_name, email FROM faculty")
        rows = cur.fetchall()
        print(f"\n--- CONTENTS OF {name} ({path}) ---")
        if not rows:
            print("  (Empty)")
        else:
            for r in rows:
                print(f"  ID: {r[0]}, Name: {r[1]} {r[2]}, Email: {r[3]}")
        conn.close()
    except Exception as e:
        print(f"[{name}] Error: {e}")

check_db("instance/college_cms.db", "OLD_DB")
check_db("instance/college_cms_backup.db", "BACKUP_DB")
check_db("instance/college_cms_v2.db", "CURRENT_DB")
