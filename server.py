from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
import os
import time
from datetime import datetime
from db_config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, SECRET_KEY

from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='.', static_url_path='')
# Enable CORS for everyone and all routes
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = SECRET_KEY

db = SQLAlchemy(app)

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# --- Models ---
# --- Models ---
class ChangeRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    faculty_id = db.Column(db.Integer, nullable=False)
    faculty_name = db.Column(db.String(100), nullable=False)
    request_text = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Pending') # Pending, Resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'facultyId': self.faculty_id,
            'facultyName': self.faculty_name,
            'requestText': self.request_text,
            'status': self.status,
            'createdAt': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

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
    # Core System Fields
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    type = db.Column(db.String(20))  # Aided / Self Finance
    shift = db.Column(db.String(20)) # Shift I / II
    
    # Profile Fields (New)
    profile_image = db.Column(db.String(500)) # URL to profile image
    designation = db.Column(db.String(100)) # e.g. Assistant Professor
    specialization = db.Column(db.String(200)) # Area of Specialisation
    education = db.Column(db.String(200)) # M.Sc., M.Phil., Ph.D.
    other_qualifications = db.Column(db.String(200)) # NET / SET
    
    # Experience (in years)
    exp_teaching = db.Column(db.String(50))
    exp_research = db.Column(db.String(50))
    exp_industry = db.Column(db.String(50))
    
    # Contact
    mobile = db.Column(db.String(20))
    irins_link = db.Column(db.String(300))
    linkedin_link = db.Column(db.String(300))
    
    # Research Supervision
    res_mphil = db.Column(db.String(100))
    res_phd_completed = db.Column(db.String(100))
    res_phd_progress = db.Column(db.String(100))
    
    # Publications - Articles
    pub_ugc = db.Column(db.String(50)) # Number or details
    pub_scopus = db.Column(db.String(50))
    pub_peer_reviewed = db.Column(db.String(50))
    pub_proceedings = db.Column(db.String(50))
    
    # Publications - Books
    book_author = db.Column(db.String(50))
    book_co_author = db.Column(db.String(50))
    book_chapters = db.Column(db.String(50))
    
    # Journal
    journal_editor = db.Column(db.String(50)) # Yes/No or Count
    journal_reviewer = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'department': self.department,
            'email': self.email,
            'type': self.type,
            'shift': self.shift,
            'profileImage': self.profile_image,
            'designation': self.designation,
            'specialization': self.specialization,
            'education': self.education,
            'otherQualifications': self.other_qualifications,
            'expTeaching': self.exp_teaching,
            'expResearch': self.exp_research,
            'expIndustry': self.exp_industry,
            'mobile': self.mobile,
            'irinsLink': self.irins_link,
            'linkedinLink': self.linkedin_link,
            'resMphil': self.res_mphil,
            'resPhdCompleted': self.res_phd_completed,
            'resPhdProgress': self.res_phd_progress,
            'pubUgc': self.pub_ugc,
            'pubScopus': self.pub_scopus,
            'pubPeerReviewed': self.pub_peer_reviewed,
            'pubProceedings': self.pub_proceedings,
            'bookAuthor': self.book_author,
            'bookCoAuthor': self.book_co_author,
            'bookChapters': self.book_chapters,
            'journalEditor': self.journal_editor,
            'journalReviewer': self.journal_reviewer
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

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

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
    # Handle Form Data (Multipart) or JSON
    if request.content_type.startswith('multipart/form-data'):
        data = request.form
        files = request.files
    else:
        data = request.json
        files = {}
    
    print(f"--- ADD FACULTY HIT: {data} ---")
    
    # Strip whitespace from critical fields
    first_name = data.get('firstName', '').strip()
    mobile = data.get('mobile', '').strip()
    
    # Handle Profile Image Upload
    profile_image_path = data.get('profileImage', '') # Default to what was sent if text
    
    if 'profileImageFile' in files:
        file = files['profileImageFile']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Make filename unique
            filename = f"{int(time.time())}_{filename}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            profile_image_path = f"/uploads/{filename}"

    new_faculty = Faculty(
        first_name=first_name,
        last_name=data.get('lastName', '').strip(),
        department=data.get('department'),
        email=data.get('email', '').strip(),
        type=data.get('type'),
        shift=data.get('shift'),
        profile_image=profile_image_path,
        designation=data.get('designation'),
        specialization=data.get('specialization'),
        education=data.get('education'),
        other_qualifications=data.get('otherQualifications'),
        exp_teaching=data.get('expTeaching'),
        exp_research=data.get('expResearch'),
        exp_industry=data.get('expIndustry'),
        mobile=mobile,
        irins_link=data.get('irinsLink'),
        linkedin_link=data.get('linkedinLink'),
        res_mphil=data.get('resMphil'),
        res_phd_completed=data.get('resPhdCompleted'),
        res_phd_progress=data.get('resPhdProgress'),
        pub_ugc=data.get('pubUgc'),
        pub_scopus=data.get('pubScopus'),
        pub_peer_reviewed=data.get('pubPeerReviewed'),
        pub_proceedings=data.get('pubProceedings'),
        book_author=data.get('bookAuthor'),
        book_co_author=data.get('bookCoAuthor'),
        book_chapters=data.get('bookChapters'),
        journal_editor=data.get('journalEditor'),
        journal_reviewer=data.get('journalReviewer')
    )
    db.session.add(new_faculty)

    # --- HOD ASSIGNMENT LOGIC ---
    if data.get('isHod'):
        dept_entry = Department.query.filter_by(name=data.get('department')).first()
        if dept_entry:
            print(f"Assigning {new_faculty.first_name} as HOD for {dept_entry.name}")
            dept_entry.hod = f"{new_faculty.first_name} {new_faculty.last_name}"
    # ----------------------------

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
        if new_faculty.first_name and new_faculty.mobile:
            # Generate username/password logic
            import re
            
            # Logic to clean username: "Dr.K.Manimegalai" -> "Manimegalai"
            raw_name = new_faculty.first_name
            # Remove titles (Dr., Mr., etc.)
            clean_name = re.sub(r'^(dr|mr|mrs|ms|prof|er)\.?\s*', '', raw_name, flags=re.IGNORECASE)
            # Split by non-alphanumeric (dots, spaces, etc)
            parts = re.split(r'[\s.]+', clean_name)
            # Filter out initials (single letters) and empty strings
            valid_parts = [p for p in parts if len(p) > 1]
            
            if valid_parts:
                # Use the longest part as the username (likely the full name)
                username = max(valid_parts, key=len)
            else:
                # Fallback
                username = raw_name.replace(" ", "")

            # Sanitize just in case
            username = re.sub(r'[^a-zA-Z0-9]', '', username)

            # Safely get first 4 digits
            phone_str = str(new_faculty.mobile).strip()
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
    
    return jsonify(new_faculty.to_dict()), 201

@app.route('/api/faculty/<int:id>', methods=['PUT'])
def update_faculty(id):
    faculty = Faculty.query.get(id)
    if not faculty:
        return jsonify({'error': 'Faculty not found'}), 404
    
     # Handle Form Data (Multipart) or JSON
    if request.content_type.startswith('multipart/form-data'):
        data = request.form
        files = request.files
    else:
        data = request.json
        files = {}

    try:
        # Handle Profile Image Upload
        if 'profileImageFile' in files:
            file = files['profileImageFile']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filename = f"{int(time.time())}_{filename}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                faculty.profile_image = f"/uploads/{filename}"

        # Update fields
        faculty.first_name = data.get('firstName', faculty.first_name)
        faculty.last_name = data.get('lastName', faculty.last_name)
        faculty.department = data.get('department', faculty.department)
        faculty.email = data.get('email', faculty.email)
        faculty.type = data.get('type', faculty.type)
        faculty.shift = data.get('shift', faculty.shift)
        # faculty.profile_image is handled above via file upload
        
        faculty.designation = data.get('designation', faculty.designation)
        faculty.specialization = data.get('specialization', faculty.specialization)
        faculty.education = data.get('education', faculty.education)
        faculty.other_qualifications = data.get('otherQualifications', faculty.other_qualifications)
        faculty.exp_teaching = data.get('expTeaching', faculty.exp_teaching)
        faculty.exp_research = data.get('expResearch', faculty.exp_research)
        faculty.exp_industry = data.get('expIndustry', faculty.exp_industry)
        faculty.mobile = data.get('mobile', faculty.mobile)
        faculty.irins_link = data.get('irinsLink', faculty.irins_link)
        faculty.linkedin_link = data.get('linkedinLink', faculty.linkedin_link)
        faculty.res_mphil = data.get('resMphil', faculty.res_mphil)
        faculty.res_phd_completed = data.get('resPhdCompleted', faculty.res_phd_completed)
        faculty.res_phd_progress = data.get('resPhdProgress', faculty.res_phd_progress)
        faculty.pub_ugc = data.get('pubUgc', faculty.pub_ugc)
        faculty.pub_scopus = data.get('pubScopus', faculty.pub_scopus)
        faculty.pub_peer_reviewed = data.get('pubPeerReviewed', faculty.pub_peer_reviewed)
        faculty.pub_proceedings = data.get('pubProceedings', faculty.pub_proceedings)
        faculty.book_author = data.get('bookAuthor', faculty.book_author)
        faculty.book_co_author = data.get('bookCoAuthor', faculty.book_co_author)
        faculty.book_chapters = data.get('bookChapters', faculty.book_chapters)
        faculty.journal_editor = data.get('journalEditor', faculty.journal_editor)
        faculty.journal_reviewer = data.get('journalReviewer', faculty.journal_reviewer)

        # HOD Update Logic
        if data.get('isHod'):
             dept_entry = Department.query.filter_by(name=faculty.department).first()
             if dept_entry:
                 dept_entry.hod = f"{faculty.first_name} {faculty.last_name}"

        db.session.commit()
        return jsonify(faculty.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/faculty/<int:id>', methods=['DELETE'])
def delete_faculty(id):
    faculty = Faculty.query.get(id)
    if faculty:
        db.session.delete(faculty)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Faculty not found'}), 404

# --- Departments ---
@app.route('/api/departments', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    return jsonify([d.to_dict() for d in departments])

@app.route('/api/departments', methods=['POST'])
def add_department():
    data = request.json
    try:
        new_dept = Department(
            name=data['name'], 
            code=data['code'],
            hod=data.get('hod', '')
        )
        db.session.add(new_dept)
        db.session.commit()
        return jsonify(new_dept.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/departments/<int:id>', methods=['PUT'])
def update_department(id):
    dept = Department.query.get(id)
    if not dept:
        return jsonify({'error': 'Department not found'}), 404
    
    data = request.json
    try:
        dept.name = data.get('name', dept.name)
        dept.code = data.get('code', dept.code)
        dept.hod = data.get('hod', dept.hod)
        
        db.session.commit()
        return jsonify(dept.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/departments/<int:id>', methods=['DELETE'])
def delete_department(id):
    dept = Department.query.get(id)
    if dept:
        db.session.delete(dept)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Department not found'}), 404

# --- Announcements ---
@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    announcements = Announcement.query.all()
    return jsonify([a.to_dict() for a in announcements])

@app.route('/api/announcements', methods=['POST'])
def add_announcement():
    data = request.json
    new_announcement = Announcement(text=data['text'], date=datetime.now().strftime("%Y-%m-%d"))
    db.session.add(new_announcement)
    db.session.commit()
    return jsonify(new_announcement.to_dict()), 201

# --- Requests ---
@app.route('/api/requests', methods=['GET'])
def get_requests():
    requests = ChangeRequest.query.order_by(ChangeRequest.created_at.desc()).all()
    return jsonify([r.to_dict() for r in requests])

@app.route('/api/requests', methods=['POST'])
def add_request():
    data = request.json
    new_req = ChangeRequest(
        faculty_id=data.get('facultyId'),
        faculty_name=data.get('facultyName'),
        request_text=data.get('requestText')
    )
    db.session.add(new_req)
    db.session.commit()
    return jsonify(new_req.to_dict()), 201

@app.route('/api/requests/<int:id>', methods=['PUT'])
def update_request(id):
    req = ChangeRequest.query.get(id)
    if not req:
        return jsonify({'error': 'Request not found'}), 404
    
    data = request.json
    req.status = data.get('status', req.status)
    db.session.commit()
    return jsonify(req.to_dict())

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    print(f"--- LOGIN HIT: {data} ---") # Explicit debug print
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
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
             # If role is faculty, find the corresponding Faculty ID
             faculty_id = None
             if credential.role == 'faculty':
                 # Try exact match first
                 fac = Faculty.query.filter(Faculty.first_name.ilike(credential.username)).first()
                 if fac:
                     faculty_id = fac.id
                 else:
                     # Fallback fuzzy search if username has different spacing
                     fac = Faculty.query.filter(Faculty.first_name.ilike(f"%{credential.username.strip()}%")).first()
                     if fac:
                        faculty_id = fac.id

             return jsonify({
                 'success': True, 
                 'user': {
                     'name': credential.username, 
                     'role': credential.role, 
                     'id': credential.id,
                     'facultyId': faculty_id # New field for linking
                 }
             })
        else:
            debug_msg = f"User found but password mismatch. DB:{credential.password} vs Input:{password}"
    else:
        # Fallback: Try cleaning DB side whitespace in query if not cleaned yet
        # (Though we ran data_cleaner, this is a safety net)
        credential_lax = LoginCredential.query.filter(
             LoginCredential.username.ilike(f"%{username}%"),
             LoginCredential.role == role
        ).first()

        if credential_lax and credential_lax.username.strip().lower() == username.lower():
             # Found it with whitespace mismatch
             if credential_lax.password == password:
                 # Fetch Faculty ID logic for fallback
                 faculty_id = None
                 profile_image = None
                 if credential_lax.role == 'faculty':
                     fac = Faculty.query.filter(Faculty.first_name.ilike(credential_lax.username)).first()
                     if fac: 
                         faculty_id = fac.id
                         profile_image = fac.profile_image

                 return jsonify({
                     'success': True, 
                     'user': {
                         'name': credential_lax.username, 
                         'role': credential_lax.role, 
                         'id': credential_lax.id,
                         'facultyId': faculty_id,
                         'profileImage': profile_image
                     }
                 })
             else:
                 debug_msg = f"User found (fuzzy) but password mismatch. DB:{credential_lax.password} vs Input:{password}"
        else:
            debug_msg = f"User '{username}' with role '{role}' not found in DB."
    
    # 2. Legacy/Hardcoded Logic (Fallback)
    if role == 'admin':
        if username.lower() == 'admin' and (password == '123' or password == '1233'):
            return jsonify({'success': True, 'user': {'name': 'Administrator', 'role': 'admin', 'id': 0, 'facultyId': None, 'profileImage': None}})
        else:
             debug_msg += " | Legacy admin check failed."
            
    elif role == 'faculty':
        faculty = Faculty.query.filter(Faculty.first_name.ilike(username)).first()
        if faculty:
            # Check password (first 4 digits) - NOW USING MOBILE
            first_4_digits = faculty.mobile.strip()[:4] if (faculty.mobile and len(faculty.mobile) >= 4) else "XXXX"
            last_4_digits = faculty.mobile.strip()[-4:] if (faculty.mobile and len(faculty.mobile) >= 4) else "XXXX"
            
            if password == first_4_digits or password == last_4_digits or password == "123":
                 return jsonify({'success': True, 'user': {'name': f"{faculty.first_name} {faculty.last_name}", 'role': 'faculty', 'id': faculty.id, 'facultyId': faculty.id, 'profileImage': faculty.profile_image}})
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
            username=data.get('username', '').strip(),
            password=data.get('password', '').strip(),
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
            print("Database initialized (Empty)!")
            # Mock data removed as per user request
            # Departments
            # Announcements
            # db.session.commit()

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
    app.run(host='0.0.0.0', debug=True, port=5000)
