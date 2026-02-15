from server import app, db, LoginCredential, Faculty

def cleaner():
    with app.app_context():
        print("Cleaning LoginCredential...")
        creds = LoginCredential.query.all()
        count_c = 0
        for c in creds:
            old = c.username
            c.username = c.username.strip()
            if old != c.username:
                print(f"Update: '{old}' -> '{c.username}'")
                count_c += 1
        
        print("Cleaning Faculty...")
        facs = Faculty.query.all()
        count_f = 0
        for f in facs:
            old = f.first_name
            f.first_name = f.first_name.strip()
            if old != f.first_name:
                print(f"Update: '{old}' -> '{f.first_name}'")
                count_f += 1
        
        db.session.commit()
        print(f"Done. Updated {count_c} credentials and {count_f} faculty records.")

if __name__ == "__main__":
    cleaner()
