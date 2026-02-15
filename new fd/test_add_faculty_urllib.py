
import urllib.request
import json
import urllib.error

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

data = json.dumps(payload).encode('utf-8')
headers = {'Content-Type': 'application/json'}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')

try:
    print(f"Sending POST request to {url}...")
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.status}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Error Content: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
