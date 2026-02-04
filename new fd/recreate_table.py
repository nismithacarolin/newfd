from server import app, db, LoginCredential
from sqlalchemy import text

def recreate_login_table():
    with app.app_context():
        print("Connecting to database...")
        
        # 1. Drop the table if it exists to ensure a clean slate
        try:
            print("Dropping old login_credential table if exists...")
            LoginCredential.__table__.drop(db.engine)
            print("Table dropped.")
        except Exception as e:
            print(f"Drop failed (might not exist): {e}")

        # 2. Create the table
        try:
            print("Creating login_credential table...")
            LoginCredential.__table__.create(db.engine)
            print("Table created successfully.")
        except Exception as e:
            print(f"Create failed: {e}")
            return

        # 3. Insert Admin Data
        try:
            print("Inserting Admin user (admin / 1233)...")
            admin_user = LoginCredential(username="admin", password="1233", role="admin")
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Admin user created successfully.")
        except Exception as e:
            print(f"Insert failed: {e}")

        # 4. Verify
        count = LoginCredential.query.count()
        print(f"Total rows in login_credential: {count}")

if __name__ == "__main__":
    recreate_login_table()
