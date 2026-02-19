import sqlite3
import os

DB_PATH = "instance/college_cms_v2.db"

def print_db_report():
    if not os.path.exists(DB_PATH):
        print("Database not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Get list of tables
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cur.fetchall()

    print("========================================")
    print("      COLLEGE CMS DATABASE REPORT       ")
    print("========================================")
    print(f"Database File: {DB_PATH}\n")

    for table_name in tables:
        table = table_name[0]
        if table == 'sqlite_sequence': continue

        print(f"TABLE: {table}")
        print("-" * (len(table) + 7))

        # Get Columns
        cur.execute(f"PRAGMA table_info({table})")
        columns = cur.fetchall()
        print("Schema (Columns):")
        for col in columns:
            # col[1] is name, col[2] is type
            print(f"  - {col[1]} ({col[2]})")

        # Get Data Count
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        count = cur.fetchone()[0]
        print(f"\nTotal Records: {count}")

        # Get Sample Data (First 3 rows)
        if count > 0:
            print("\nSample Data (First 3 rows):")
            cur.execute(f"SELECT * FROM {table} LIMIT 3")
            rows = cur.fetchall()
            # Get column names for display
            col_names = [description[0] for description in cur.description]
            print(f"  {col_names}")
            for row in rows:
                print(f"  {row}")
        
        print("\n" + "="*40 + "\n")

    conn.close()

if __name__ == "__main__":
    print_db_report()
