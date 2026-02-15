from server import app, db, LoginCredential

def check_user():
    with app.app_context():
        print("--- CHECKING SPECIFIC USER 'Dr.R.Manimegalai' ---")
        # 1. Search by exact username
        u1 = LoginCredential.query.filter_by(username='Dr.R.Manimegalai').first()
        print(f"Exact match found: {u1}")

        # 2. Search by ilike
        u2 = LoginCredential.query.filter(LoginCredential.username.ilike('Dr.R.Manimegalai')).first()
        print(f"Ilike match found: {u2}")

        # 3. List all users to see what's actually there
        all_users = LoginCredential.query.all()
        for u in all_users:
            print(f"User: '{u.username}' | Len: {len(u.username)} | Role: '{u.role}'")

if __name__ == "__main__":
    check_user()
