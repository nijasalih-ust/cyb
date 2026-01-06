import time
import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from api.models import (
    Path, Module, Lesson, MitreTactic, MitreTechnique,
    LessonTechniqueMap, UserProgress, NavBotLog
)

User = get_user_model()


@pytest.mark.django_db
class TestCurriculumHierarchy:
    def test_path_creation(self):
        path = Path.objects.create(title="SOC Fundamentals", slug="soc-fundamentals")
        assert path.title == "SOC Fundamentals"
        assert path.is_active is True

    def test_module_order_uniqueness(self):
        path = Path.objects.create(title="Path", slug="path")
        Module.objects.create(path=path, title="Mod1", order_index=1)
        with pytest.raises(IntegrityError):
            Module.objects.create(path=path, title="Mod2", order_index=1)

    def test_lesson_router_link_uniqueness(self):
        path = Path.objects.create(title="Test", slug="test")
        module = Module.objects.create(path=path, title="Module", order_index=1)
        Lesson.objects.create(module=module, title="Lesson 1", router_link="lesson-1")
        with pytest.raises(IntegrityError):
            Lesson.objects.create(module=module, title="Lesson 2", router_link="lesson-1")

    def test_path_total_lessons_property(self):
        path = Path.objects.create(title="Path", slug="path")
        module = Module.objects.create(path=path, title="Module", order_index=1)
        Lesson.objects.create(module=module, title="L1", router_link="l1", order_index=1)
        Lesson.objects.create(module=module, title="L2", router_link="l2", order_index=2)
        
        assert path.total_lessons == 2

   # Around line 142 (add import at top: import time)
    def test_ordering(self):
        import time
        NavBotLog.objects.create(command_used="first")
        time.sleep(0.01)
        NavBotLog.objects.create(command_used="second")
        logs = list(NavBotLog.objects.all())
        assert logs[0].command_used == "second"
        assert logs[1].command_used == "first"

    def test_path_total_lessons_property(self):
        path = Path.objects.create(title="Path", slug="path")
        module = Module.objects.create(path=path, title="Module", order_index=1)
        Lesson.objects.create(module=module, title="L1", router_link="l1", order_index=1)
        Lesson.objects.create(module=module, title="L2", router_link="l2", order_index=2)
        
        assert path.total_lessons == 2



@pytest.mark.django_db
class TestLessonTechniqueMap:
    def test_mapping_creation(self):
        tactic = MitreTactic.objects.create(mitre_id="TA0001", name="Test")
        technique = MitreTechnique.objects.create(mitre_id="T1001", name="Tech", tactic=tactic)
        path = Path.objects.create(title="P", slug="p")
        module = Module.objects.create(path=path, title="M", order_index=1)
        lesson = Lesson.objects.create(module=module, title="L", router_link="l")
        
        mapping = LessonTechniqueMap.objects.create(
            lesson=lesson,
            technique=technique,
            relevance="primary"
        )
        assert mapping.lesson == lesson
        assert mapping.technique == technique

    def test_mapping_uniqueness(self):
        tactic = MitreTactic.objects.create(mitre_id="TA0002", name="T")
        technique = MitreTechnique.objects.create(mitre_id="T1002", name="Tech", tactic=tactic)
        path = Path.objects.create(title="P2", slug="p2")
        module = Module.objects.create(path=path, title="M2", order_index=1)
        lesson = Lesson.objects.create(module=module, title="L2", router_link="l2")
        
        LessonTechniqueMap.objects.create(lesson=lesson, technique=technique)
        with pytest.raises(IntegrityError):
            LessonTechniqueMap.objects.create(lesson=lesson, technique=technique)

    def test_reverse_lookups(self):
        tactic = MitreTactic.objects.create(mitre_id="TA0003", name="T")
        tech = MitreTechnique.objects.create(mitre_id="T1003", name="Tech", tactic=tactic)
        path = Path.objects.create(title="P3", slug="p3")
        module = Module.objects.create(path=path, title="M3", order_index=1)
        lesson = Lesson.objects.create(module=module, title="L3", router_link="l3")
        
        LessonTechniqueMap.objects.create(lesson=lesson, technique=tech)
        
        assert lesson.techniques.count() == 1
        assert tech.lessons.count() == 1


@pytest.mark.django_db
class TestUserProgress:
    def test_progress_creation(self):
        user = User.objects.create_user(email="progress@test.com", password="pass")
        path = Path.objects.create(title="P", slug="p")
        module = Module.objects.create(path=path, title="M", order_index=1)
        lesson = Lesson.objects.create(module=module, title="L", router_link="l")
        
        progress = UserProgress.objects.create(
            user=user,
            lesson=lesson,
            status="in_progress"
        )
        assert progress.status == "in_progress"
        assert progress.progress_percent == 0

    def test_completion_auto_fields(self):
        user = User.objects.create_user(email="complete@test.com", password="pass")
        path = Path.objects.create(title="P4", slug="p4")
        module = Module.objects.create(path=path, title="M4", order_index=1)
        lesson = Lesson.objects.create(module=module, title="L4", router_link="l4")
        
        progress = UserProgress.objects.create(
            user=user,
            lesson=lesson,
            status="completed"
        )
        progress.refresh_from_db()
        assert progress.progress_percent == 100
        assert progress.completed_at is not None

    def test_user_lesson_uniqueness(self):
        user = User.objects.create_user(email="unique@test.com", password="pass")
        path = Path.objects.create(title="P5", slug="p5")
        module = Module.objects.create(path=path, title="M5", order_index=1)
        lesson = Lesson.objects.create(module=module, title="L5", router_link="l5")
        
        UserProgress.objects.create(user=user, lesson=lesson, status="not_started")
        with pytest.raises(IntegrityError):
            UserProgress.objects.create(user=user, lesson=lesson, status="completed")


@pytest.mark.django_db
class TestNavBotLog:
    def test_log_with_user(self):
        user = User.objects.create_user(email="log@test.com", password="pass")
        log = NavBotLog.objects.create(
            user=user,
            command_used="navigate",
            query_term="T1059"
        )
        assert log.user == user

    def test_log_without_user(self):
        log = NavBotLog.objects.create(
            command_used="search",
            query_term="pathway"
        )
        assert log.user is None

    def test_ordering(self):
        NavBotLog.objects.create(command_used="first")
        NavBotLog.objects.create(command_used="second")
        logs = list(NavBotLog.objects.all())
        assert logs[0].created_at > logs[1].created_at
