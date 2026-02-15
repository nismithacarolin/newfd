from server import app, db, Faculty
import sys

def debug_error():
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f"CREATE_ALL_ERROR: {e}")
        
        try:
            cnt = Faculty.query.count()
            print(f"COUNT_SUCCESS: {cnt}")
        except Exception as e:
            print(f"COUNT_ERROR: {e}")

debug_error()
