import mysql.connector
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="", 
        database="college_cms"
    )
    if conn.is_connected():
        print("CONNECTION_SUCCESS")
        conn.close()
except Exception as e:
    print(f"CONNECTION_FAILED: {e}")
