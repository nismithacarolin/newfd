import os


# Database Configuration for MySQL
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# MySQL connection details
MYSQL_USER = "root"
MYSQL_PASSWORD = ""
MYSQL_HOST = "localhost"
MYSQL_DB = "college_cms"

SQLALCHEMY_DATABASE_URI = f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = "your_secret_key_here"
