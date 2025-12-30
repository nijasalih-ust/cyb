import json
import os
import sys
import django

# 1. SETUP DJANGO ENVIRONMENT
# ---------------------------------------------------------
# Add the backend folder to sys.path so we can find 'backend' module
# Adjusted to point to the project root (backend/) correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
django.setup()
# ---------------------------------------------------------

from api.models import Path, Module, Lesson, MitreTechnique, LessonTechniqueMap

INPUT_FILE = "curriculum_data.json"

def seed_db():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, INPUT_FILE)

    print(f"📂 Reading {file_path}...")
    
    if not os.path.exists(file_path):
        print("❌ Error: JSON file not found. Run the generator script first.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("🚀 Seeding Database...")

    for path_item in data:
        # 1. Create Path
        path_obj, created = Path.objects.update_or_create(
            slug=path_item['slug'],
            defaults={
                'title': path_item['title'], 
                'type': path_item['type']
            }
        )
        status = "Created" if created else "Updated"
        print(f"[{status}] Path: {path_obj.title}")

        for mod_item in path_item['modules']:
            # 2. Create Module
            mod_obj, _ = Module.objects.update_or_create(
                path=path_obj,
                order_index=mod_item['order'],
                defaults={'title': mod_item['title']}
            )
            print(f"   -> Module: {mod_obj.title}")

            for lesson_item in mod_item['lessons']:
                # 3. Create Lesson
                lesson_obj, _ = Lesson.objects.update_or_create(
                    module=mod_obj,
                    order_index=lesson_item['order'],
                    defaults={
                        'title': lesson_item['title'],
                        'description': lesson_item['description'],
                        'content': lesson_item.get('content', ''),
                        'key_indicators': lesson_item['key_indicators'],
                        'router_link': lesson_item['router_link'],
                        'content_type': 'text'
                    }
                )

                # 4. Link to MITRE Technique
                mitre_id = lesson_item.get('mitre_id_link')
                if mitre_id:
                    # Find the technique in DB
                    tech = MitreTechnique.objects.filter(mitre_id=mitre_id).first()
                    if tech:
                        LessonTechniqueMap.objects.get_or_create(
                            lesson=lesson_obj,
                            technique=tech
                        )
                        # print(f"      Linked to {mitre_id}")
                    else:
                        print(f"      ⚠️ Warning: Technique {mitre_id} not found in DB")

    print("✅ Seeding Complete!")

if __name__ == "__main__":
    seed_db()
