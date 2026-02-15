from server import app, db, LoginCredential

def inspect_user():
    with app.app_context():
        print("--- INSPECTING CREDENTIALS ---")
        users = LoginCredential.query.all()
        for u in users:
            print(f"ID: {u.id}")
            print(f"Username: '{u.username}' (len={len(u.username)})")
            print(f"Password: '{u.password}'")
            print(f"Role:     '{u.role}' (len={len(u.role)})")
            print("-" * 20)

if __name__ == "__main__":
    inspect_user()
