from server import app, db, LoginCredential

def create_table():
    with app.app_context():
        print("Creating database tables...")
        try:
            db.create_all()
            print("Tables created successfully.")
        except Exception as e:
            print(f"Error creating tables: {e}")

        # specific check for LoginCredential
        try:
            # Check if admin exists, if not create with 1233
            admin = LoginCredential.query.filter_by(username='admin').first()
            if not admin:
                print("Creating default admin user...")
                new_admin = LoginCredential(username='admin', password='123', role='admin')
                db.session.add(new_admin)
                db.session.commit()
                print("Default admin created: admin/123")
            else:
                # Update to 1233 if needed, or ensure it exists
                if admin.password != '1233':
                     print("Updating admin password to 1233...")
                     admin.password = '1233'
                     db.session.commit()
                print("Admin user already exists.")
        except Exception as e:
            print(f"Error seeding admin: {e}")

if __name__ == "__main__":
    create_table()
