import json
import os
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import Path, Module, Lesson, MitreTechnique, LessonTechniqueMap
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Seeds the curriculum from data/curriculum_data.json'

    def handle(self, *args, **options):
        file_path = os.path.join(settings.BASE_DIR, 'data', 'curriculum_data.json')

        self.stdout.write(f"📂 Reading {file_path}...")

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"❌ Error: File not found at {file_path}"))
            return

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f"❌ Invalid JSON format: {e}"))
            return

        self.stdout.write("🚀 Seeding Curriculum Database...")

        try:
            with transaction.atomic():
                total_paths = 0
                total_modules = 0
                total_lessons = 0
                total_links = 0

                for path_item in data:
                    # 1. Create/Update Path
                    path_obj, created = Path.objects.update_or_create(
                        slug=path_item['slug'],
                        defaults={
                            'title': path_item['title'],
                            'type': path_item.get('type', 'standard'),
                            'order_index': path_item.get('order', 0)
                        }
                    )
                    status = "Created" if created else "Updated"
                    self.stdout.write(f"[{status}] Path: {path_obj.title}")
                    total_paths += 1

                    for mod_item in path_item.get('modules', []):
                        # 2. Create/Update Module
                        mod_obj, _ = Module.objects.update_or_create(
                            path=path_obj,
                            order_index=mod_item['order'],
                            defaults={
                                'title': mod_item['title'],
                                'description': mod_item.get('description', '')
                            }
                        )
                        self.stdout.write(f"   -> Module: {mod_obj.title}")
                        total_modules += 1

                        for lesson_item in mod_item.get('lessons', []):
                            # 3. Create/Update Lesson
                            
                            # Handle router_link generation/cleaning
                            raw_link = lesson_item.get('router_link')
                            if not raw_link:
                                router_link = slugify(lesson_item['title'])
                            else:
                                router_link = raw_link.strip()

                            # KEY FIX: Lookup by the UNIQUE field (router_link)
                            # This prevents the unique constraint violation.
                            lesson_obj, _ = Lesson.objects.update_or_create(
                                router_link=router_link,
                                defaults={
                                    'module': mod_obj, # Assign to current module
                                    'order_index': lesson_item['order'],
                                    'title': lesson_item['title'],
                                    'description': lesson_item.get('description', ''),
                                    'content': lesson_item.get('content', ''),
                                    'key_indicators': lesson_item.get('key_indicators', ''),
                                    'content_type': 'text'
                                }
                            )
                            total_lessons += 1

                            # 4. Link to MITRE Technique
                            mitre_id = lesson_item.get('mitre_id_link')
                            
                            if mitre_id:
                                tech = MitreTechnique.objects.filter(mitre_id=mitre_id).first()
                                if tech:
                                    LessonTechniqueMap.objects.get_or_create(
                                        lesson=lesson_obj,
                                        technique=tech,
                                        defaults={'relevance': 'primary'}
                                    )
                                    total_links += 1
                                else:
                                    # Optional: Warn only if verbose
                                    # self.stdout.write(self.style.WARNING(f"      ⚠️ Technique {mitre_id} not found"))
                                    pass

            self.stdout.write(self.style.SUCCESS("-" * 40))
            self.stdout.write(self.style.SUCCESS("✅ Seeding Complete!"))
            self.stdout.write(f"   Paths: {total_paths}")
            self.stdout.write(f"   Modules: {total_modules}")
            self.stdout.write(f"   Lessons: {total_lessons}")
            self.stdout.write(f"   Links: {total_links}")

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ An error occurred during seeding: {str(e)}"))