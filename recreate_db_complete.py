import os
import time
from server import app, db, init_db, LoginCredential, Faculty

def recreate_fresh():
    print("Attempting to recreate database completely...")
    
    # Path to DB file
    db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
    if os.path.exists(db_path):
        print(f"Found existing DB at {db_path}")
        try:
            # Try to close any open connections from this process
            db.session.remove()
            db.engine.dispose()
            
            # Delete file
            os.remove(db_path)
            print("Deleted old database file.")
        except Exception as e:
            print(f"FAILED to delete database file: {e}")
            print("Please STOP the running server first!")
            return

    # Initialize Fresh
    try:
        print("Initializing new database...")
        init_db()
        print("Database initialized.")
    except Exception as e:
        print(f"Error during init_db: {e}")
        return

    # User Creation Verify
    with app.app_context():
        try:
            admin = LoginCredential.query.filter_by(username='admin').first()
            if admin:
                print("Admin user verified.")
            else:
                print("Warning: Admin user not found after init!")
                
            faculty_count = Faculty.query.count()
            print(f"Faculty table ready (count: {faculty_count})")
            
        except Exception as e:
            print(f"Verification failed: {e}")

if __name__ == "__main__":
    recreate_fresh()
