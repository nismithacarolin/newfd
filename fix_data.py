from server import app, db, Department, Faculty

def fix_data():
    with app.app_context():
        print("Starting data fix...")

        # 1. Beula Princy - Remove HOD status from IT (or wherever she is)
        # Find department where she is HOD
        beula_depts = Department.query.filter(Department.hod.ilike('%Beula%')).all()
        for d in beula_depts:
            print(f"Removing Beula Princy as HOD from department: {d.name}")
            d.hod = None # Or empty string if your model requires it, usually None is fine for nullable fields
        
        # 2. Sophia Reena - Move to IT, Remove from CS HOD if present
        sophia = Faculty.query.filter(Faculty.first_name.ilike('%Sophia%')).first()
        if sophia:
            print(f"Found Sophia: {sophia.first_name} {sophia.last_name}")
            if sophia.department != 'Information Technology':
                print(f"Moving Sophia from '{sophia.department}' to 'Information Technology'")
                sophia.department = 'Information Technology'
        
        # Remove Sophia as HOD from any department
        sophia_depts = Department.query.filter(Department.hod.ilike('%Sophia%')).all()
        for d in sophia_depts:
            print(f"Removing Sophia Reena as HOD from department: {d.name}")
            d.hod = None
            
        db.session.commit()
        print("Database commited successfully.")

if __name__ == "__main__":
    fix_data()
