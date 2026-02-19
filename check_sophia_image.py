import sqlite3
import os

DB_PATH = "instance/college_cms_v2.db"

def check_sophia():
    if not os.path.exists(DB_PATH):
        print("DB not found")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT id, first_name, last_name, profile_image FROM faculty WHERE first_name LIKE '%Sophia%'")
        rows = cur.fetchall()
        print(f"--- FACULTY DATA for Sophia ---")
        if not rows:
            print("No faculty found matching 'Sophia'")
        else:
            for r in rows:
                print(f"ID: {r[0]}, Name: {r[1]} {r[2]}")
                print(f"Profile Image: '{r[3]}'")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

check_sophia()
