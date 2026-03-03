from server import app, db, LoginCredential

def verify():
    with app.app_context():
        print("--- VERIFYING ADMIN ---")
        admin = LoginCredential.query.filter_by(username='admin').first()
        if admin:
            print(f"Admin found! Username: '{admin.username}', Password: '{admin.password}', Role: '{admin.role}'")
        else:
            print("Admin NOT found in LoginCredential table.")
            
        print("\nAll credentials in DB:")
        all_creds = LoginCredential.query.all()
        for c in all_creds:
            print(f"'{c.username}' (role: {c.role}) - pass: {c.password}")

if __name__ == '__main__':
    verify()
