from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from datetime import datetime
from db_config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, SECRET_KEY

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///college_cms.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = SECRET_KEY

db = SQLAlchemy(app)

# --- Models ---
class Faculty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100))
    type = db.Column(db.String(20))  # Aided / Self Finance
    shift = db.Column(db.String(20))
    joined_date = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True)
    phone_number = db.Column(db.String(20), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'department': self.department,
            'specialization': self.specialization,
            'type': self.type,
            'shift': self.shift,
            'joinedDate': self.joined_date,
            'email': self.email,
            'phoneNumber': self.phone_number
        }

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), nullable=False)
    hod = db.Column(db.String(100))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'hod': self.hod
        }

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    date = db.Column(db.String(20))

    def to_dict(self):
        return {'id': self.id, 'text': self.text, 'date': self.date}

# --- Routes ---

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

# API Routes
@app.route('/api/faculty', methods=['GET'])
def get_faculty():
    faculty = Faculty.query.all()
    return jsonify([f.to_dict() for f in faculty])

@app.route('/api/faculty', methods=['POST'])
def add_faculty():
    data = request.json
    new_faculty = Faculty(
        first_name=data.get('firstName'),
        last_name=data.get('lastName'),
        department=data.get('department'),
        specialization=data.get('specialization'),
        type=data.get('type'),
        shift=data.get('shift'),
        joined_date=data.get('joinedDate'),
        email=data.get('email'),
        phone_number=data.get('phoneNumber')
    )
    db.session.add(new_faculty)
    db.session.commit()
    return jsonify(new_faculty.to_dict()), 201

@app.route('/api/departments', methods=['GET'])
def get_departments():
    depts = Department.query.all()
    return jsonify([d.to_dict() for d in depts])

@app.route('/api/departments', methods=['POST'])
def add_department():
    data = request.json
    new_dept = Department(
        name=data.get('name'),
        code=data.get('code'),
        hod=data.get('hod')
    )
    db.session.add(new_dept)
    db.session.commit()
    return jsonify(new_dept.to_dict()), 201

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    anns = Announcement.query.all()
    return jsonify([a.to_dict() for a in anns])

@app.route('/api/announcements', methods=['POST'])
def add_announcement():
    data = request.json
    new_ann = Announcement(
        text=data.get('text'),
        date=datetime.now().strftime('%Y-%m-%d')
    )
    db.session.add(new_ann)
    db.session.commit()
    return jsonify(new_ann.to_dict()), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    print(f"Login attempt: {data}") # Debug print
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    # Simple logic mimicking the original mock
    if role == 'admin':
        if username == 'admin' and password == '123':
            return jsonify({'success': True, 'user': {'name': 'Administrator', 'role': 'admin'}})
    elif role == 'faculty':
        # Login Logic: Username = First Name, Password = Last 4 digits of Phone Number
        print(f"DEBUG: Checking faculty login for '{username}'")
        faculty = Faculty.query.filter(Faculty.first_name.ilike(username)).first()
        
        if faculty:
            print(f"DEBUG: Found faculty '{faculty.first_name} {faculty.last_name}'. Phone: '{faculty.phone_number}'")
            # Check password (last 4 digits)
            if faculty.phone_number and len(faculty.phone_number) >= 4:
                last_4_digits = faculty.phone_number.strip()[-4:]
                print(f"DEBUG: Expected password (last 4 digits): '{last_4_digits}'. Received: '{password}'")
                if password == last_4_digits:
                    return jsonify({'success': True, 'user': {'name': f"{faculty.first_name} {faculty.last_name}", 'role': 'faculty', 'id': faculty.id}})
            else:
                print(f"DEBUG: Phone number invalid or too short: {faculty.phone_number}")
            
            # Fallback (Safety)
            if password == '123':
                 return jsonify({'success': True, 'user': {'name': f"{faculty.first_name} {faculty.last_name}", 'role': 'faculty', 'id': faculty.id}})
        else:
            print(f"DEBUG: No faculty found with first name '{username}'")

        return jsonify({'success': False, 'message': 'Invalid credentials. Use First Name and Last 4 digits of phone.'}), 401
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# Initialize Database with specific Mock Data if empty
def init_db():
    with app.app_context():
        # Clean start for schema update (since we added phone_number)
        # db.drop_all() # Uncomment to reset DB completely if needed
        db.create_all()
        if not Faculty.query.first():
            print("Initializing DB with mock data...")
            # Faculty
            f1 = Faculty(first_name="John", last_name="Doe", department="Computer Science", specialization="AI/ML", type="Aided", shift="Shift I", joined_date="2023-01-15", email="john.doe@college.edu")
            f2 = Faculty(first_name="Jane", last_name="Smith", department="Information Technology", specialization="Cloud Computing", type="Self Finance", shift="Shift II", joined_date="2023-03-10", email="jane.smith@college.edu")
            db.session.add_all([f1, f2])
            
            # Departments
            d1 = Department(name="Computer Science", code="CS", hod="Dr. Alan Turing")
            d2 = Department(name="Information Technology", code="IT", hod="Dr. Grace Hopper")
            db.session.add_all([d1, d2])

            # Announcements
            a1 = Announcement(text="Faculty meeting scheduled for next Friday at 10 AM.", date="2025-12-20")
            db.session.add(a1)

            db.session.commit()
            print("Database initialized!")

if __name__ == '__main__':
    # Ensure database exists
    # Note: Creating the DB itself might require manual step in MySQL unless root has diff privileges. 
    # We assume 'college_cms' database is created or we let SQLAlchemy try.
    # Usually easier to ask user to create the DB "college_cms" first.
    try:
        init_db()
    except Exception as e:
        print(f"Database error (make sure 'college_cms' exists): {e}")
        
    app.run(debug=True, port=5000)
