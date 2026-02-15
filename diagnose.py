from server import app, db, LoginCredential, Faculty

def diagnose():
    with app.app_context():
        print("--- DIAGNOSTIC REPORT ---")
        
        # Check Admin
        print("\n[LOGIN CREDENTIALS]")
        creds = LoginCredential.query.all()
        if not creds:
            print("❌ No login credentials found!")
        for c in creds:
            print(f"ID: {c.id} | User: '{c.username}' | Pass: '{c.password}' | Role: '{c.role}'")
            
        # Check Faculty
        print("\n[FACULTY]")
        faculty = Faculty.query.all()
        if not faculty:
            print("❌ No faculty found!")
        for f in faculty:
            phone = f.phone_number if f.phone_number else "N/A"
            if len(phone) >= 4:
                expected_pass = phone.strip()[:4]
            else:
                expected_pass = "Invalid Phone"
            print(f"ID: {f.id} | Name: '{f.first_name}' | Phone: '{phone}' | Expected Pass (1st 4): '{expected_pass}'")

if __name__ == "__main__":
    try:
        diagnose()
    except Exception as e:
        print(f"Diagnostic failed: {e}")
