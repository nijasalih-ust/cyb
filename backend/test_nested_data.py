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

# Test Path with nested modules and lessons
print("\n" + "="*70)
print("TESTING NESTED DATA STRUCTURE")
print("="*70)

print("\n1. Testing /api/paths/ with nested data:")
paths_response = requests.get("http://localhost:8000/api/paths/", headers=headers)
if paths_response.status_code == 200:
    paths = paths_response.json()
    for path in paths[:1]:  # Show first path
        print(f"\n   Path: {path.get('title')}")
        print(f"   Slug: {path.get('slug')}")
        modules = path.get('modules', [])
        print(f"   Modules: {len(modules)}")
        
        for module in modules[:1]:  # Show first module
            print(f"\n     Module: {module.get('title')}")
            lessons = module.get('lessons', [])
            print(f"     Lessons: {len(lessons)}")
            
            for lesson in lessons[:1]:  # Show first lesson
                print(f"\n       Lesson: {lesson.get('title')}")
                print(f"       Description: {lesson.get('description', 'N/A')[:100]}...")
                techniques = lesson.get('techniques', [])
                print(f"       Techniques: {len(techniques)}")
                
                for technique in techniques[:2]:  # Show first 2 techniques
                    print(f"         - {technique.get('name')} ({technique.get('mitre_id')})")

print("\n" + "="*70)
print("✅ NESTED DATA STRUCTURE VERIFICATION COMPLETE")
print("="*70)
