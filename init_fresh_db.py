from server import app, init_db, LoginCredential

def run_init():
    with app.app_context():
        print("Running init_db()...")
        init_db()
        print("init_db() completed.")
        
        admin = LoginCredential.query.filter_by(username='admin').first()
        if admin:
            print("Admin user verified successfully.")
        else:
            print("WARNING: Admin user not found despite init_db()!")

if __name__ == "__main__":
    run_init()
