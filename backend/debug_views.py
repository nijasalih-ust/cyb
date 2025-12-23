import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

try:
    print("Attempting to import api.views...")
    from api import views
    print("Import SUCCESS")
except Exception:
    print("Import FAILED")
    with open('debug_out_utf8.txt', 'w', encoding='utf-8') as f:
        traceback.print_exc(file=f)
    print("Traceback written to debug_out_utf8.txt")
