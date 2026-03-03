import requests

url = 'http://127.0.0.1:5000/api/faculty/5'  # Assumed ID for Sophia Reena based on previous context
data = {
    'firstName': 'Dr.G.SOPHIA REENA',
    'lastName': 'TEST_UPDATE', 
    'department': 'Information Technology',
    'email': 'sophiareena@psgrkcw.ac.in',
    'designation': 'Assistant Professor',
    'mobile': '9843087474',
    'staffType': 'Aided',
    'shift': 'Shift I'
}

print(f"Sending update to {url}")
try:
    response = requests.put(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
