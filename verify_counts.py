import sqlite3
import os

NEW_DB_PATH = "instance/college_cms_v2.db"
if os.path.exists(NEW_DB_PATH):
    print(f"--- INSPECTING NEW DB: {NEW_DB_PATH} ---")
    try:
        conn = sqlite3.connect(NEW_DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM faculty")
        print(f"NEW FACULTY COUNT: {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM department")
        print(f"NEW DEPARTMENT COUNT: {cur.fetchone()[0]}")
        conn.close()
    except Exception as e:
        print(f"Error inspecting NEW DB: {e}")


OLD_DB_PATH = "instance/college_cms.db"

if os.path.exists(OLD_DB_PATH):
    print(f"\n--- INSPECTING OLD DB: {OLD_DB_PATH} ---")
    try:
        conn = sqlite3.connect(OLD_DB_PATH)
        cur = conn.cursor()
        
        # Get column names
        cur.execute("PRAGMA table_info(faculty)")
        columns = [info[1] for info in cur.fetchall()]
        print(f"OLD FACULTY COLUMNS: {columns}")
        
        cur.execute("SELECT * FROM faculty LIMIT 1")
        row = cur.fetchone()
        if row:
            print(f"SAMPLE ROW (raw): {row}")
            
        cur.execute("SELECT COUNT(*) FROM faculty")
        print(f"OLD FACULTY COUNT: {cur.fetchone()[0]}")
        
        conn.close()
    except Exception as e:
        print(f"Error inspecting OLD DB: {e}")

