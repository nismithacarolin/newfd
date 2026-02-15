import os

# Database Configuration
# Replace these values with your actual MySQL database credentials
DB_HOST = "localhost"
DB_USER = "root"      # Default XAMPP/MySQL user
DB_PASSWORD = ""      # Default XAMPP password is empty
DB_NAME = "college_cms"

SQLALCHEMY_DATABASE_URI = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = "your_secret_key_here"
