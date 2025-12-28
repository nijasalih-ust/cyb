# api/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

'''
# notes

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title'''

# 1. Identity & Auth
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, default="student")
    is_verified = models.BooleanField(default=False)

    # username, password, etc. come from AbstractUser

    class Meta:
        db_table = "users"


class RefreshToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="refresh_tokens"
    )
    token_hash = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    revoked = models.BooleanField(default=False)

    class Meta:
        db_table = "refresh_tokens"


# 2. Framework (static data)
class KillChainPhase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    step_number = models.IntegerField(unique=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "kill_chain_phases"


class MitreTactic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mitre_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "mitre_tactics"


class TacticPhaseMap(models.Model):
    tactic = models.ForeignKey(
        MitreTactic, on_delete=models.CASCADE, related_name="phase_links"
    )
    phase = models.ForeignKey(
        KillChainPhase, on_delete=models.CASCADE, related_name="tactic_links"
    )

    class Meta:
        db_table = "tactic_phase_map"
        unique_together = (("tactic", "phase"),)


class MitreTechnique(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mitre_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    tactic = models.ForeignKey(
        MitreTactic, on_delete=models.CASCADE, related_name="techniques"
    )

    class Meta:
        db_table = "mitre_techniques"


# 3. Learning Content
class Path(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    type = models.CharField(
        max_length=50,
        choices=(("standard", "Standard"), ("campaign", "Campaign")),
    )

    class Meta:
        db_table = "paths"


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    path = models.ForeignKey(
        Path, on_delete=models.CASCADE, related_name="modules"
    )
    order_index = models.IntegerField()
    title = models.CharField(max_length=255)

    class Meta:
        db_table = "modules"
        unique_together = (("path", "order_index"),)

class Lesson(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, related_name="lessons"
    )
    title = models.CharField(max_length=255, blank=True, null=True)
    router_link = models.CharField(max_length=255, blank=True, null=True)

    # NEW FIELDS
    description = models.TextField(blank=True, null=True)
    key_indicators = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "lessons"

class LessonTechniqueMap(models.Model):
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="technique_links"
    )
    technique = models.ForeignKey(
        MitreTechnique, on_delete=models.CASCADE, related_name="lesson_links"
    )

    class Meta:
        db_table = "lesson_technique_map"
        unique_together = (("lesson", "technique"),)

# Arsenal / Tools
# Arsenal / Tools - REMOVED
# class Tool(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     name = models.CharField(max_length=255)
#     description = models.TextField(blank=True, null=True)
#     category = models.CharField(max_length=100, blank=True, null=True)
#     link = models.URLField(blank=True, null=True)
#     
#     class Meta:
#         db_table = "tools"
# quiz module
class Quiz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.OneToOneField(
        Module, on_delete=models.CASCADE, related_name="quiz"
    )
    title = models.CharField(max_length=255)

    class Meta:
        db_table = "quizzes"

class QuizQuestion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE, related_name="questions"
    )
    question_text = models.TextField()
    options = models.JSONField()
    correct_answer = models.CharField(max_length=255)

    class Meta:
        db_table = "quiz_questions"

# 4. User Progress & Navigator Logs
class UserProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="progress"
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="user_progress"
    )
    status = models.CharField(
        max_length=50,
        choices=(("completed", "Completed"),),
    )

    class Meta:
        db_table = "user_progress"


class NavBotLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nav_logs",
    )
    command_used = models.CharField(max_length=255, blank=True, null=True)
    query_term = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "nav_bot_logs"
