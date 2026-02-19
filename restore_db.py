import sqlite3
from server import app, db, Faculty, Department, Announcement, LoginCredential, ChangeRequest

OLD_DB = "instance/college_cms.db"
NEW_DB = "instance/college_cms_v2.db"

def migrate_data():
    print(f"Migrating data from {OLD_DB} to {NEW_DB}...")
    
    # Connect to Old DB
    try:
        conn_old = sqlite3.connect(OLD_DB)
        conn_old.row_factory = sqlite3.Row
        cur_old = conn_old.cursor()
    except Exception as e:
        print(f"Failed to connect to old DB: {e}")
        return

    with app.app_context():
        # Clear current data in new DB to avoid duplicates (Optional, safer to just append if empty)
        # db.drop_all()
        # db.create_all() 

        # 1. Departments
        print("Migrating Departments...")
        try:
            cur_old.execute("SELECT * FROM department")
            rows = cur_old.fetchall()
            for row in rows:
                if not Department.query.get(row['id']):
                    new_dept = Department(
                        id=row['id'],
                        name=row['name'],
                        code=row['code'],
                        hod=row['hod']
                    )
                    db.session.add(new_dept)
            db.session.commit()
            print(f"Departments migrated: {len(rows)}")
        except Exception as e:
            print(f"Error migrating departments: {e}")

        # 2. Faculty
        print("Migrating Faculty...")
        try:
            cur_old.execute("SELECT * FROM faculty")
            rows = cur_old.fetchall()
            for row in rows:
                data = dict(row) # Convert to safe dict
                if not Faculty.query.get(data['id']):
                    new_fac = Faculty(
                        id=data['id'],
                        first_name=data.get('first_name', ''),
                        last_name=data.get('last_name', ''),
                        department=data.get('department', ''),
                        email=data.get('email', ''),
                        type=data.get('type', 'Aided'),
                        shift=data.get('shift', 'Shift I'),
                        # profile_image = None (New field, leave empty)
                        designation=data.get('designation', ''),
                        specialization=data.get('specialization', ''),
                        education=data.get('education', ''),
                        other_qualifications=data.get('other_qualifications', ''),
                        exp_teaching=data.get('exp_teaching', ''),
                        exp_research=data.get('exp_research', ''),
                        exp_industry=data.get('exp_industry', ''),
                        mobile=data.get('mobile', ''),
                        irins_link=data.get('irins_link', ''),
                        linkedin_link=data.get('linkedin_link', ''),
                        res_mphil=data.get('res_mphil', ''),
                        res_phd_completed=data.get('res_phd_completed', ''),
                        res_phd_progress=data.get('res_phd_progress', ''),
                        pub_ugc=data.get('pub_ugc', ''),
                        pub_scopus=data.get('pub_scopus', ''),
                        pub_peer_reviewed=data.get('pub_peer_reviewed', ''),
                        pub_proceedings=data.get('pub_proceedings', ''),
                        book_author=data.get('book_author', ''),
                        book_co_author=data.get('book_co_author', ''),
                        book_chapters=data.get('book_chapters', ''),
                        journal_editor=data.get('journal_editor', ''),
                        journal_reviewer=data.get('journal_reviewer', '')
                    )
                    db.session.add(new_fac)
            db.session.commit()
            print(f"Faculty migrated: {len(rows)}")
        except Exception as e:
            print(f"Error migrating faculty: {e}")
            db.session.rollback()

        # 3. Credentials
        print("Migrating Credentials...")
        try:
            cur_old.execute("SELECT * FROM login_credential")
            rows = cur_old.fetchall()
            for row in rows:
                data = dict(row)
                if not LoginCredential.query.get(data['id']):
                    # Skip if admin already exists (created by init_db)
                    if data['username'] == 'admin' and LoginCredential.query.filter_by(username='admin').first():
                        continue
                        
                    new_cred = LoginCredential(
                        id=data['id'],
                        username=data.get('username', ''),
                        password=data.get('password', ''),
                        role=data.get('role', 'faculty')
                    )
                    db.session.add(new_cred)
            db.session.commit()
            print(f"Credentials migrated: {len(rows)}")
        except Exception as e:
            print(f"Error migrating credentials: {e}")

        # 4. Announcements
        print("Migrating Announcements...")
        try:
            cur_old.execute("SELECT * FROM announcement")
            rows = cur_old.fetchall()
            for row in rows:
                if not Announcement.query.get(row['id']):
                    new_ann = Announcement(
                        id=row['id'],
                        text=row['text'],
                        date=row['date']
                    )
                    db.session.add(new_ann)
            db.session.commit()
            print(f"Announcements migrated: {len(rows)}")
        except Exception as e:
            print(f"Error migrating announcements: {e}")

    conn_old.close()
    print("Migration Complete.")

if __name__ == "__main__":
    migrate_data()
