"""
Link lessons to MITRE techniques automatically.

Usage:
    python manage.py link_lessons_techniques

Algorithm:
 - For each Lesson, aggregate text fields (title, description, key_indicators, router_link)
 - Regex-extract MITRE IDs (e.g., T1566, T1059.001) and link matching MitreTechnique objects
 - Additionally, do case-insensitive substring matching of technique names (word-boundary check)
 - Create LessonTechniqueMap entries if they don't exist and report counts
"""
import re
from django.core.management.base import BaseCommand
from api.models import Lesson, MitreTechnique, LessonTechniqueMap

MITRE_ID_RE = re.compile(r"\bT\d{4}(?:\.\d+)?\b", re.IGNORECASE)

class Command(BaseCommand):
    help = 'Automatically link Lesson objects to MitreTechnique objects'

    def handle(self, *args, **options):
        lessons = Lesson.objects.all()
        total_created = 0
        report = []

        # Preload techniques into dicts for faster lookup
        techniques_by_id = {t.mitre_id.upper(): t for t in MitreTechnique.objects.all()}
        techniques_list = list(MitreTechnique.objects.all())

        for lesson in lessons:
            texts = ' '.join(filter(None, [getattr(lesson, 'title', ''), getattr(lesson, 'description', ''), getattr(lesson, 'key_indicators', ''), getattr(lesson, 'router_link', '')]))
            if not texts.strip():
                continue
            texts_lower = texts.lower()

            created_for_lesson = 0
            linked = set()

            # 1) Extract MITRE IDs
            for match in MITRE_ID_RE.findall(texts):
                mid = match.upper()
                tech = techniques_by_id.get(mid)
                if tech and tech.id not in linked:
                    obj, created = LessonTechniqueMap.objects.get_or_create(lesson=lesson, technique=tech)
                    if created:
                        created_for_lesson += 1
                    linked.add(tech.id)

            # 2) Name-based matching (careful: require word-boundary and min length)
            for tech in techniques_list:
                name = (tech.name or '').lower()
                if len(name) < 6:
                    continue
                # require names longer than 5 chars and check word boundary
                # normalize punctuation in name
                name_tokens = re.split(r"\W+", name)
                for token in name_tokens:
                    if not token or len(token) < 4:
                        continue
                    if re.search(r"\b" + re.escape(token) + r"\b", texts_lower):
                        if tech.id not in linked:
                            obj, created = LessonTechniqueMap.objects.get_or_create(lesson=lesson, technique=tech)
                            if created:
                                created_for_lesson += 1
                            linked.add(tech.id)
                        break

            if created_for_lesson:
                report.append((lesson.router_link or lesson.title, created_for_lesson))
                total_created += created_for_lesson

        self.stdout.write(self.style.SUCCESS(f'Linking complete: {total_created} new LessonTechniqueMap entries created'))
        if report:
            for item, count in report:
                self.stdout.write(f'  {item}: {count} new links')
        else:
            self.stdout.write('  No new links created')
