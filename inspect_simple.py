from server import app, db, LoginCredential

def inspect():
    with app.app_context():
        users = LoginCredential.query.all()
        for u in users:
            print(f"'{u.username}'")

if __name__ == "__main__":
    inspect()
