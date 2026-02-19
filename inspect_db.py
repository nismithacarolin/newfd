from server import app, db, LoginCredential, Faculty

def inspect_admin():
    with app.app_context():
        print("--- INSPECTING ADMIN CREDENTIALS ---")
        print("--- INSPECTING FACULTY ---")
        faculty = Faculty.query.all()
        for f in faculty:
            print(f"ID: {f.id}, Name: {f.first_name} {f.last_name}, Email: {f.email}")
            print(f"   Image: {f.profile_image}")

if __name__ == "__main__":
    inspect_admin()
