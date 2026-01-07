import pytest
from api.models import Path, Module, Lesson, MitreTactic, MitreTechnique, LessonTechniqueMap
from api.serializers import PathSerializer, ModuleSerializer, LessonSerializer


@pytest.mark.django_db
class TestLessonSerializer:
    def test_lesson_includes_techniques_via_through_model(self):
        """Lesson should serialize techniques from LessonTechniqueMap"""
        path = Path.objects.create(title="Path", slug="path")
        module = Module.objects.create(path=path, title="Module", order_index=1)
        lesson = Lesson.objects.create(module=module, title="Lesson", router_link="lesson-1")
        
        tactic = MitreTactic.objects.create(mitre_id="TA0001", name="Test")
        tech = MitreTechnique.objects.create(mitre_id="T1059", name="PowerShell", tactic=tactic)
        LessonTechniqueMap.objects.create(lesson=lesson, technique=tech, relevance="primary")
        
        data = LessonSerializer(lesson).data
        
        assert "techniques" in data
        assert len(data["techniques"]) == 1
        assert data["techniques"][0]["technique"]["mitre_id"] == "T1059"

    def test_lesson_with_no_techniques(self):
        """Lesson without techniques should return empty array"""
        path = Path.objects.create(title="P", slug="p")
        module = Module.objects.create(path=path, title="M", order_index=1)
        lesson = Lesson.objects.create(module=module, title="L", router_link="l")
        
        data = LessonSerializer(lesson).data
        
        assert data["techniques"] == []

    def test_lesson_all_content_fields_present(self):
        """Lesson should include content, key_indicators, description"""
        path = Path.objects.create(title="P", slug="p")
        module = Module.objects.create(path=path, title="M", order_index=1)
        lesson = Lesson.objects.create(
            module=module,
            title="Test Lesson",
            router_link="test",
            content="# Markdown content",
            key_indicators="IOC data",
            description="Lesson description"
        )
        
        data = LessonSerializer(lesson).data
        
        assert data["content"] == "# Markdown content"
        assert data["key_indicators"] == "IOC data"
        assert data["description"] == "Lesson description"


@pytest.mark.django_db
class TestModuleSerializer:
    def test_module_nests_lessons(self):
        """Module should include nested lessons array"""
        path = Path.objects.create(title="P", slug="p")
        module = Module.objects.create(path=path, title="Module", order_index=1)
        Lesson.objects.create(module=module, title="L1", router_link="l1", order_index=1)
        Lesson.objects.create(module=module, title="L2", router_link="l2", order_index=2)
        
        data = ModuleSerializer(module).data
        
        assert "lessons" in data
        assert len(data["lessons"]) == 2


@pytest.mark.django_db
class TestPathSerializer:
    def test_path_full_nested_structure(self):
        """Path should nest modules → lessons → techniques"""
        path = Path.objects.create(title="SOC Path", slug="soc", type="standard")
        module = Module.objects.create(path=path, title="Intro", order_index=1)
        lesson = Lesson.objects.create(module=module, title="Basics", router_link="basics", order_index=1)
        
        tactic = MitreTactic.objects.create(mitre_id="TA0001", name="Test")
        tech = MitreTechnique.objects.create(mitre_id="T1001", name="Tech", tactic=tactic)
        LessonTechniqueMap.objects.create(lesson=lesson, technique=tech)
        
        data = PathSerializer(path).data
        
        assert data["title"] == "SOC Path"
        assert data["type"] == "standard"
        assert len(data["modules"]) == 1
        assert data["modules"][0]["title"] == "Intro"
        assert len(data["modules"][0]["lessons"]) == 1
        assert data["modules"][0]["lessons"][0]["title"] == "Basics"
        assert len(data["modules"][0]["lessons"][0]["techniques"]) == 1
