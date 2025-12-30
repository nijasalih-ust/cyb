# api/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# ============================================================================
# 1. Identity & Auth
# ============================================================================

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


# ============================================================================
# 2. Framework (MITRE ATT&CK)
# ============================================================================

class MitreTactic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mitre_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "mitre_tactics"

    def __str__(self):
        return f"{self.mitre_id} - {self.name}"


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

    def __str__(self):
        return f"{self.mitre_id} - {self.name}"


# ============================================================================
# 3. Learning Content Hierarchy (Path -> Module -> Lesson)
# ============================================================================

class Path(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    type = models.CharField(max_length=50)  # e.g., 'offensive', 'defensive'

    class Meta:
        db_table = "paths"

    def __str__(self):
        return self.title


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    path = models.ForeignKey(
        Path, on_delete=models.CASCADE, related_name="modules"
    )
    title = models.CharField(max_length=255)
    order_index = models.IntegerField()

    class Meta:
        db_table = "modules"
        unique_together = (("path", "order_index"),)
        ordering = ['order_index']

    def __str__(self):
        return f"{self.path.title} - {self.title}"


class Lesson(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, related_name="lessons"
    )
    title = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50, default='text')  # e.g., 'text', 'video', 'lab'
    router_link = models.CharField(max_length=255, blank=True, null=True)
    order_index = models.IntegerField(default=0)
    
    # Optional content details
    description = models.TextField(blank=True, null=True)
    key_indicators = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "lessons"
        unique_together = (("module", "order_index"),)
        ordering = ['order_index']

    def __str__(self):
        return self.title


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


# ============================================================================
# 4. User Progress & Logs
# ============================================================================

class UserProgress(models.Model):
    STATUS_CHOICES = (
        ("not_started", "Not Started"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="progress"
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="user_progress"
    )
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="not_started"
    )
    
    # Timestamps for analytics
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "user_progress"
        unique_together = (("user", "lesson"),)

    def save(self, *args, **kwargs):
        # Auto-set completed_at when status changes to completed
        if self.status == 'completed' and not self.completed_at:
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)


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