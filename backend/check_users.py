import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User

users = User.objects.all()
print("\n=== CURRENT USERS IN DATABASE ===\n")
if users.exists():
    for user in users:
        print(f"ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Is Staff: {user.is_staff}")
        print(f"Is Superuser: {user.is_superuser}")
        print(f"Date Joined: {user.date_joined}")
        print("-" * 40)
else:
    print("No users found in the database.")
