import os

# Database Configuration
# Using a new database file to avoid locking issues with the old one
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# Renamed from college_cms.db to ensure clean slate
DB_NAME = "college_cms_v2.db"
# Use forward slashes for compatibility
DB_PATH = os.path.join(BASE_DIR, 'instance', DB_NAME).replace('\\', '/')

# Ensure instance directory exists
if not os.path.exists(os.path.join(BASE_DIR, 'instance')):
    os.makedirs(os.path.join(BASE_DIR, 'instance'))

SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = "your_secret_key_here"
