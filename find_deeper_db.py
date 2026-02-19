import sqlite3
import os

def check_db_file(path, name):
    full_path = os.path.abspath(path)
    if not os.path.exists(full_path):
        print(f"[{name}] NOT FOUND: {full_path}")
        return

    try:
        conn = sqlite3.connect(full_path)
        cur = conn.cursor()
        cur.execute("SELECT id, first_name, last_name, email FROM faculty")
        rows = cur.fetchall()
        print(f"\n--- CONTENTS OF {name} ({full_path}) ---")
        if not rows:
            print("  (Empty)")
        else:
            for r in rows:
                print(f"  ID: {r[0]}, Name: {r[1]} {r[2]}, Email: {r[3]}")
        conn.close()
    except Exception as e:
        print(f"[{name}] Error: {e}")

check_db_file("new fd/instance/college_cms.db", "DEEP_DB_1")
check_db_file("new fd/new fd/instance/college_cms.db", "DEEP_DB_2")
