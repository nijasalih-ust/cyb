import requests
import json

# Test login
login_url = "http://localhost:8000/api/token/"
login_data = {
    "username": "analyst",
    "password": "password"
}

response = requests.post(login_url, json=login_data)
token_data = response.json()
access_token = token_data.get('access')

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

print("\n" + "="*70)
print("TESTING LESSONS WITH TECHNIQUES")
print("="*70)

lessons_response = requests.get("http://localhost:8000/api/lessons/", headers=headers)
if lessons_response.status_code == 200:
    lessons = lessons_response.json()
    
    for lesson in lessons:
        techniques = lesson.get('techniques', [])
        if techniques:  # Only show lessons that have techniques
            print(f"\n📚 Lesson: {lesson.get('title')}")
            print(f"   Description: {lesson.get('description', 'N/A')[:80]}...")
            print(f"   Techniques: {len(techniques)}")
            
            for technique in techniques:
                print(f"     - {technique.get('name')} ({technique.get('mitre_id')})")
                print(f"       Tactic: {technique.get('tactic_name')}")

print("\n" + "="*70)
