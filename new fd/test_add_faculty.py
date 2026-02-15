
import requests
import json

url = "http://127.0.0.1:5000/api/faculty"

payload = {
    "firstName": "Test",
    "lastName": "User",
    "department": "Computer Science",
    "specialization": "Testing",
    "type": "Aided",
    "shift": "Shift I",
    "joinedDate": "2023-01-01",
    "email": "test.user@example.com",
    "phoneNumber": "9876543210"
}

try:
    print(f"Sending POST request to {url}...")
    response = requests.post(url, json=payload, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
