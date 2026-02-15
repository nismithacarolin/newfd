from server import app, db, LoginCredential, Faculty
import re

def clean_username(raw_name):
    # Remove titles (Dr., Mr., etc.)
    clean = re.sub(r'^(dr|mr|mrs|ms|prof|er)\.?\s*', '', raw_name, flags=re.IGNORECASE)
    # Split by non-alphanumeric (dots, spaces, etc)
    parts = re.split(r'[\s.]+', clean)
    # Filter out initials (single letters) and empty strings
    valid_parts = [p for p in parts if len(p) > 1]
    
    if valid_parts:
        # Use the longest part as the username
        return max(valid_parts, key=len)
    return raw_name

with app.app_context():
    creds = LoginCredential.query.all()
    print(f"Checking {len(creds)} credentials...")
    count = 0
    for cred in creds:
        # We want to reset the username based on the FACULTY name if possible, 
        # or just clean the existing username if we can't find the faculty.
        
        # Try to find the faculty member this credential belongs to
        # matches by fuzzy name since that's how we created them
        # checking by mobile (password) first is safer if we can
        
        # Actually, let's just look at the Faculty table and sync credentials from there
        # This is safer to ensure consistency with the new logic
        
        # Strategy: Iterate Faculty, find or create credential, update username.
        pass

    # Better Strategy: Just clean the existing usernames in the credential table 
    # This preserves the link if the user manually changed it, but here we want to enforce the rule.
    # But wait, looking at the screenshot, the usernames ARE the first names from Faculty table usually.
    
    faculty_list = Faculty.query.all()
    for fac in faculty_list:
        # Generate the target username
        target_username = clean_username(fac.first_name)
        
        # Find the credential
        # We rely on the fact that currently they are "Dr. Name"
        # We search for a credential that looks like the faculty name
        
        # Try exact match on old name
        cred = LoginCredential.query.filter_by(username=fac.first_name).first()
        if not cred:
             # Try match on the name in valid formats
             cred = LoginCredential.query.filter(LoginCredential.username.ilike(fac.first_name)).first()
        
        if cred:
            if cred.username != target_username:
                print(f"Updating {cred.username} -> {target_username}")
                cred.username = target_username
                count += 1
        else:
            # Maybe the credential doesn't exist or is already changed?
            # Let's check if the target username already exists
            cred_new = LoginCredential.query.filter_by(username=target_username).first()
            if cred_new:
                # Already good?
                continue
                
            print(f"Warning: No credential found for {fac.first_name}")

    if count > 0:
        db.session.commit()
        print(f"Successfully updated {count} credentials.")
    else:
        print("No credentials needed updating.")
