import requests
import json

# Test login
login_url = "http://localhost:8000/api/token/"
login_data = {
    "username": "analyst",
    "password": "password"
}

print("Testing login endpoint...")
response = requests.post(login_url, json=login_data)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 200:
    token_data = response.json()
    access_token = token_data.get('access')
    
    # Test with token
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    print("\n" + "="*50)
    print("Testing API endpoints with token...")
    print("="*50)
    
    # Test paths
    print("\nTesting /api/paths/")
    paths_response = requests.get("http://localhost:8000/api/paths/", headers=headers)
    print(f"Status: {paths_response.status_code}")
    data = paths_response.json()
    if isinstance(data, list):
        print(f"Found {len(data)} paths")
        for path in data[:2]:
            print(f"  - {path.get('title')}")
    else:
        print(data)
    
    # Test modules
    print("\nTesting /api/modules/")
    modules_response = requests.get("http://localhost:8000/api/modules/", headers=headers)
    print(f"Status: {modules_response.status_code}")
    data = modules_response.json()
    if isinstance(data, list):
        print(f"Found {len(data)} modules")
        for module in data[:2]:
            print(f"  - {module.get('title')}")
    else:
        print(data)
    
    # Test lessons
    print("\nTesting /api/lessons/")
    lessons_response = requests.get("http://localhost:8000/api/lessons/", headers=headers)
    print(f"Status: {lessons_response.status_code}")
    data = lessons_response.json()
    if isinstance(data, list):
        print(f"Found {len(data)} lessons")
        for lesson in data[:2]:
            print(f"  - {lesson.get('title')}")
    else:
        print(data)
