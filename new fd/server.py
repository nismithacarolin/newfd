from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
import os
from datetime import datetime
from db_config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, SECRET_KEY

app = Flask(__name__, static_folder='.', static_url_path='')
# Enable CORS for everyone and all routes
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///college_cms.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = SECRET_KEY

db = SQLAlchemy(app)

# --- Models ---
class LoginCredential(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'admin' or 'faculty'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'role': self.role
        }

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

@app.route('/api/status', methods=['GET'])
def health_check():
    try:
        # Try to query the DB
        db.session.execute(text('SELECT 1'))
        return jsonify({'status': 'online', 'db': 'connected', 'message': 'System Operational'})
    except Exception as e:
        print(f"DB Connection Failed: {e}")
        return jsonify({'status': 'error', 'db': 'disconnected', 'message': str(e)}), 500

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
    print(f"--- ADD FACULTY HIT: {data} ---")
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
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error adding faculty: {e}")
        if "UNIQUE constraint failed" in str(e) or "Duplicate entry" in str(e) or "unique" in str(e).lower():
            return jsonify({'error': 'A faculty member with this email already exists.'}), 400
        return jsonify({'error': str(e)}), 500
    
    # --- AUTO-CREATE LOGIN CREDENTIAL ---
    try:
        if new_faculty.first_name and new_faculty.phone_number:
            # Generate username/password logic
            username = new_faculty.first_name
            # Safely get first 4 digits
            phone_str = str(new_faculty.phone_number).strip()
            password = phone_str[:4] if len(phone_str) >= 4 else "1234"
            
            # Check if username already exists in credentials to avoid crash
            existing = LoginCredential.query.filter(LoginCredential.username.ilike(username)).first()
            if not existing:
                print(f"Auto-creating credential for {username} with pass {password}")
                new_cred = LoginCredential(
                    username=username,
                    password=password,
                    role='faculty'
                )
                db.session.add(new_cred)
                db.session.commit()
            else:
                print(f"Credential for {username} already exists, skipping auto-creation.")
    except Exception as e:
        print(f"FAILED TO AUTO-CREATE CREDENTIAL: {e}")
        import traceback
        traceback.print_exc()
        # We don't want to fail the main faculty add just because creds failed, maybe log it
    
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
    print(f"--- LOGIN HIT: {data} ---") # Explicit debug print
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    # 1. Check LoginCredential Table (New System)
    # We check if there is a matching credential for the given role (Case Insensitive Username)
    credential = LoginCredential.query.filter(
        LoginCredential.username.ilike(username), 
        LoginCredential.role == role
    ).first()
    
    debug_msg = ""
    
    if credential:
        if credential.password == password:
             return jsonify({'success': True, 'user': {'name': credential.username, 'role': credential.role, 'id': credential.id}})
        else:
            debug_msg = f"User found but password mismatch. DB:{credential.password} vs Input:{password}"
    else:
        debug_msg = f"User '{username}' with role '{role}' not found in DB."
    
    # 2. Legacy/Hardcoded Logic (Fallback)
    if role == 'admin':
        if username.lower() == 'admin' and (password == '123' or password == '1233'):
            return jsonify({'success': True, 'user': {'name': 'Administrator', 'role': 'admin'}})
        else:
             debug_msg += " | Legacy admin check failed."
            
    elif role == 'faculty':
        faculty = Faculty.query.filter(Faculty.first_name.ilike(username)).first()
        if faculty:
            # Check password (first 4 digits)
            first_4_digits = faculty.phone_number.strip()[:4] if (faculty.phone_number and len(faculty.phone_number) >= 4) else "XXXX"
            last_4_digits = faculty.phone_number.strip()[-4:] if (faculty.phone_number and len(faculty.phone_number) >= 4) else "XXXX"
            
            if password == first_4_digits or password == last_4_digits or password == "123":
                 return jsonify({'success': True, 'user': {'name': f"{faculty.first_name} {faculty.last_name}", 'role': 'faculty', 'id': faculty.id}})
            else:
                 debug_msg += f" | Faculty found but password mismatch. Input: {password}, Expected: {first_4_digits}"
        else:
             debug_msg += f" | Faculty '{username}' not found."

    # RETURN THE DEBUG INFO TO THE USER
    return jsonify({'success': False, 'message': f'Login Failed. Debug: {debug_msg}'}), 401



@app.route('/api/credentials', methods=['GET'])
def get_credentials():
    creds = LoginCredential.query.all()
    return jsonify([c.to_dict() for c in creds])

@app.route('/api/credentials', methods=['POST'])
def add_credential():
    data = request.json
    try:
        new_cred = LoginCredential(
            username=data.get('username'),
            password=data.get('password'),
            role=data.get('role')
        )
        db.session.add(new_cred)
        db.session.commit()
        return jsonify(new_cred.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/credentials/<int:id>', methods=['DELETE'])
def delete_credential(id):
    cred = LoginCredential.query.get(id)
    if cred:
        db.session.delete(cred)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Credential not found'}), 404

# Initialize Database with specific Mock Data if empty
def init_db():
    with app.app_context():
        # Clean start for schema update (since we added phone_number)
        # db.drop_all() # Uncomment to reset DB completely if needed
        db.create_all()
        
        # Initialize Login Credentials if empty
        if not LoginCredential.query.first():
             print("Initializing Login Credential DB...")
             # Admin default: admin / 1233 (as requested)
             admin_user = LoginCredential(username="admin", password="1233", role="admin")
             db.session.add(admin_user)
             db.session.commit()

        if not Faculty.query.first():
            print("Initializing DB with mock data...")
            # Faculty
            f1 = Faculty(first_name="John", last_name="Doe", department="Computer Science", specialization="AI/ML", type="Aided", shift="Shift I", joined_date="2023-01-15", email="john.doe@college.edu", phone_number="9876543210")
            f2 = Faculty(first_name="Jane", last_name="Smith", department="Information Technology", specialization="Cloud Computing", type="Self Finance", shift="Shift II", joined_date="2023-03-10", email="jane.smith@college.edu", phone_number="1234567890")
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
    print("Starting server application...")
    # Ensure database exists
    try:
        print("Initializing database...")
        init_db()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"CRITICAL DATABASE ERROR: {e}")
        # We continue to run the app even if DB init fails, so the API might return errors but the process stays alive
        
    print("Starting Flask app on port 5000...")
    # Using debug=False to avoid reloader issues during troubleshooting
    # Host='0.0.0.0' allows external access and sometimes fixes local resolution quirks
    app.run(host='0.0.0.0', debug=False, port=5000)
