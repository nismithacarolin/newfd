from server import app, db, LoginCredential

def show_data():
    with app.app_context():
        print("\n--- CONTENT OF login_credential TABLE ---")
        creds = LoginCredential.query.all()
        if not creds:
            print("Table is empty!")
        else:
            print(f"{'ID':<5} {'Username':<15} {'Password':<15} {'Role':<10}")
            print("-" * 50)
            for c in creds:
                print(f"{c.id:<5} {c.username:<15} {c.password:<15} {c.role:<10}")
        print("-" * 50)

if __name__ == "__main__":
    show_data()
