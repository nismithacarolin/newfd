from server import app, db, LoginCredential

def inspect_admin():
    with app.app_context():
        print("--- INSPECTING ADMIN CREDENTIALS ---")
        admin = LoginCredential.query.filter_by(username='admin').first()
        if admin:
            print(f"ID: {admin.id}")
            print(f"Username: '{admin.username}' (len={len(admin.username)})")
            print(f"Password: '{admin.password}' (len={len(admin.password)})")
            print(f"Role:     '{admin.role}' (len={len(admin.role)})")
            
            # Check byte representation to find hidden chars
            print(f"Password Bytes: {admin.password.encode('utf-8')}")
        else:
            print("Admin user not found in DB!")

if __name__ == "__main__":
    inspect_admin()
