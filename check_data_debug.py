from server import app, db, Faculty, Department

with app.app_context():
    # Check Departments
    print("--- Departments ---")
    depts = Department.query.all()
    for d in depts:
        print(f"ID: {d.id}, Name: '{d.name}', HOD: '{d.hod}'")
    
    # Check Faculty mentioning 'Beula' or 'Sophia'
    print("\n--- Specific Faculty Check ---")
    faculty = Faculty.query.filter(
        (Faculty.first_name.ilike('%Beula%')) | 
        (Faculty.first_name.ilike('%Sophia%')) |
        (Faculty.last_name.ilike('%Beula%')) |
        (Faculty.last_name.ilike('%Sophia%'))
    ).all()
    
    for f in faculty:
        print(f"ID: {f.id}, Name: {f.first_name} {f.last_name}")
        print(f"  Dept: '{f.department}', Desig: '{f.designation}'")
