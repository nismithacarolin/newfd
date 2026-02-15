from server import app, db, LoginCredential, Faculty

def report():
    with app.app_context():
        with open("creds_report.txt", "w", encoding="utf-8") as f:
            f.write("=== ADMIN CREDENTIALS ===\n")
            creds = LoginCredential.query.all()
            for c in creds:
                f.write(f"User: {c.username}, Pass: {c.password}, Role: {c.role}\n")
            
            f.write("\n=== FACULTY CREDENTIALS ===\n")
            faculty = Faculty.query.all()
            for fac in faculty:
                phone = fac.phone_number if fac.phone_number else "N/A"
                expected = phone.strip()[:4] if len(phone) >= 4 else "Invalid Phone"
                f.write(f"Name: {fac.first_name} {fac.last_name}, Phone: {phone}, Expected Password: {expected}\n")

if __name__ == "__main__":
    report()
