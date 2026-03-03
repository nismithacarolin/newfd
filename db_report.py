import mysql.connector
import os
from db_config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB

def print_db_report():
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB
        )
        cur = conn.cursor()
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")
        return

    # Get list of tables
    cur.execute("SHOW TABLES;")
    tables = cur.fetchall()

    print("========================================")
    print("      COLLEGE CMS DATABASE REPORT       ")
    print("========================================")
    print(f"Database: {MYSQL_DB} (MySQL)\n")

    for table_name in tables:
        table = table_name[0]

        print(f"TABLE: {table}")
        print("-" * (len(table) + 7))

        # Get Columns in MySQL
        cur.execute(f"DESCRIBE {table}")
        columns = cur.fetchall()
        print("Schema (Columns):")
        for col in columns:
            # col[0] is Field, col[1] is Type
            print(f"  - {col[0]} ({col[1]})")

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
