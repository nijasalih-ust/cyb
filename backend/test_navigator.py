import requests

BASE = "http://localhost:8000"
resp = requests.post(BASE + "/api/token/", json={"username":"analyst","password":"password"})
print("Login status:", resp.status_code)
try:
    login = resp.json()
except Exception:
    print("Login response not JSON:\n", resp.text)
    raise

access = login.get('access')
headers = {"Authorization": f"Bearer {access}", "Content-Type": "application/json"}

for cmd in ["stats", "technique T1190", "navigate /library"]:
    r = requests.post(BASE + "/api/navigator/command", json={"input": cmd, "context": {"current_page": "/library"}}, headers=headers)
    print('\nCommand:', cmd)
    print('Status:', r.status_code)
    try:
        print('Response JSON:', r.json())
    except Exception:
        print('Response text:', r.text)
