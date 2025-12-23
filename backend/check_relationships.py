import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import (
    Path, Module, Lesson, 
    MitreTactic, MitreTechnique, KillChainPhase,
    LessonTechniqueMap, TacticPhaseMap
)

print("\n" + "="*70)
print("DATABASE RELATIONSHIP CHECK")
print("="*70)

# Check Paths
print("\n1. PATHS")
paths = Path.objects.all()
print(f"   Total: {paths.count()}")
for path in paths:
    print(f"   - {path.title} ({path.slug})")

# Check Modules
print("\n2. MODULES")
modules = Module.objects.all()
print(f"   Total: {modules.count()}")
for module in modules[:5]:
    print(f"   - {module.title} (Path: {module.path.title if module.path else 'N/A'})")

# Check Lessons
print("\n3. LESSONS")
lessons = Lesson.objects.all()
print(f"   Total: {lessons.count()}")
for lesson in lessons[:5]:
    print(f"   - {lesson.title} (Module: {lesson.module.title if lesson.module else 'N/A'})")

# Check MITRE Tactics
print("\n4. MITRE TACTICS")
tactics = MitreTactic.objects.all()
print(f"   Total: {tactics.count()}")
for tactic in tactics[:5]:
    print(f"   - {tactic.name} ({tactic.mitre_id})")

# Check MITRE Techniques
print("\n5. MITRE TECHNIQUES")
techniques = MitreTechnique.objects.all()
print(f"   Total: {techniques.count()}")
for technique in techniques[:5]:
    print(f"   - {technique.name} ({technique.mitre_id}) -> Tactic: {technique.tactic.name}")

# Check Lesson-Technique Mappings
print("\n6. LESSON-TECHNIQUE MAPPINGS")
lesson_technique_maps = LessonTechniqueMap.objects.all()
print(f"   Total: {lesson_technique_maps.count()}")
for ltm in lesson_technique_maps[:5]:
    print(f"   - {ltm.lesson.title} -> {ltm.technique.name}")

# Check Tactic-Phase Mappings
print("\n7. TACTIC-PHASE MAPPINGS")
tactic_phase_maps = TacticPhaseMap.objects.all()
print(f"   Total: {tactic_phase_maps.count()}")
for tpm in tactic_phase_maps[:5]:
    print(f"   - {tpm.tactic.name} -> {tpm.phase.name}")

# Deep dive: Check specific lesson connections
print("\n8. DETAILED LESSON ANALYSIS")
print("   Sample lessons with their connected techniques:")
lessons_with_techniques = Lesson.objects.filter(technique_links__isnull=False).distinct()
print(f"   Lessons with techniques: {lessons_with_techniques.count()}")
for lesson in lessons_with_techniques[:3]:
    techniques = lesson.technique_links.all()
    print(f"\n   Lesson: {lesson.title}")
    print(f"   Connected techniques: {techniques.count()}")
    for tech in techniques:
        print(f"     - {tech.technique.name} ({tech.technique.mitre_id})")

print("\n" + "="*70)
