import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from .managers import CustomUserManager


# =============================================================================
# USER & AUTHENTICATION
# =============================================================================

class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model using email as the primary identifier."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    role = models.CharField(max_length=50, default="student")
    is_verified = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = "users"
    
    def __str__(self):
        return self.email


class RefreshToken(models.Model):
    """JWT Refresh token storage for token rotation/revocation."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="refresh_tokens"
    )
    token_hash = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    revoked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "refresh_tokens"
        indexes = [
            models.Index(fields=['token_hash']),
            models.Index(fields=['user', 'revoked']),
        ]


# =============================================================================
# MITRE ATT&CK FRAMEWORK
# =============================================================================

class MitreTactic(models.Model):
    """MITRE ATT&CK Tactic (e.g., Initial Access, Execution, Persistence)."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mitre_id = models.CharField(max_length=20, unique=True, db_index=True)  # e.g., TA0001
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    
    class Meta:
        db_table = "mitre_tactics"
        ordering = ['mitre_id']
    
    def __str__(self):
        return f"{self.mitre_id} - {self.name}"


class MitreTechnique(models.Model):
    """MITRE ATT&CK Technique (e.g., T1059 - Command and Scripting Interpreter)."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mitre_id = models.CharField(max_length=20, unique=True, db_index=True)  # e.g., T1059.001
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    tactic = models.ForeignKey(
        MitreTactic, 
        on_delete=models.CASCADE, 
        related_name="techniques"
    )
    
    # Optional: Track if this is a sub-technique
    is_subtechnique = models.BooleanField(default=False)
    parent_technique = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subtechniques'
    )
    
    class Meta:
        db_table = "mitre_techniques"
        ordering = ['mitre_id']
    
    def __str__(self):
        return f"{self.mitre_id} - {self.name}"
    
    def save(self, *args, **kwargs):
        # Auto-detect sub-technique based on ID format (T1059.001)
        self.is_subtechnique = '.' in self.mitre_id
        super().save(*args, **kwargs)


# =============================================================================
# CURRICULUM STRUCTURE
# =============================================================================

class Path(models.Model):
    """Learning Path (e.g., SOC Fundamentals, Threat Hunting)."""
    
    PATH_TYPES = (
        ('standard', 'Standard'),
        ('campaign', 'Campaign'),
        ('certification', 'Certification'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    type = models.CharField(max_length=50, choices=PATH_TYPES, default='standard')
    order_index = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "paths"
        ordering = ['order_index', 'title']
    
    def __str__(self):
        return self.title
    
    @property
    def total_lessons(self):
        return Lesson.objects.filter(module__path=self).count()


class Module(models.Model):
    """Module within a Learning Path."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    path = models.ForeignKey(
        Path, on_delete=models.CASCADE, related_name="modules"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    order_index = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = "modules"
        unique_together = (("path", "order_index"),)
        ordering = ['path', 'order_index']
    
    def __str__(self):
        return f"{self.path.title} - {self.title}"


class Lesson(models.Model):
    """Individual Lesson within a Module."""
    
    CONTENT_TYPES = (
        ('text', 'Text/Article'),
        ('video', 'Video'),
        ('lab', 'Hands-on Lab'),
        ('quiz', 'Quiz'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, related_name="lessons"
    )
    title = models.CharField(max_length=255)
    router_link = models.SlugField(max_length=255, unique=True)  # FIX: Added missing field!
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPES, default='text')
    order_index = models.PositiveIntegerField(default=0)
    
    description = models.TextField(blank=True, default="")
    content = models.TextField(blank=True, default="")  # Markdown content
    key_indicators = models.TextField(blank=True, default="")
    
    # Metadata
    estimated_time_minutes = models.PositiveIntegerField(default=15)
    difficulty = models.CharField(max_length=20, default='beginner')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Direct relationship to techniques (convenience accessor)
    techniques = models.ManyToManyField(
        MitreTechnique,
        through='LessonTechniqueMap',
        related_name='lessons'
    )
    
    class Meta:
        db_table = "lessons"
        unique_together = (("module", "order_index"),)
        ordering = ['module', 'order_index']
    
    def __str__(self):
        return self.title


class LessonTechniqueMap(models.Model):
    """Maps Lessons to MITRE Techniques with optional context."""
    
    RELEVANCE_TYPES = (
        ('primary', 'Primary Focus'),
        ('secondary', 'Secondary/Related'),
        ('mentioned', 'Mentioned'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="technique_links"
    )
    technique = models.ForeignKey(
        MitreTechnique, on_delete=models.CASCADE, related_name="lesson_links"
    )
    relevance = models.CharField(max_length=20, choices=RELEVANCE_TYPES, default='primary')
    notes = models.TextField(blank=True, default="")  # Why this technique is relevant
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "lesson_technique_map"
        unique_together = (("lesson", "technique"),)
    
    def __str__(self):
        return f"{self.lesson.title} -> {self.technique.mitre_id}"


# =============================================================================
# USER PROGRESS & ANALYTICS
# =============================================================================

class UserProgress(models.Model):
    """Tracks user progress through lessons."""
    
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
    
    # Progress tracking
    progress_percent = models.PositiveIntegerField(default=0)
    time_spent_seconds = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = "user_progress"
        unique_together = (("user", "lesson"),)
        indexes = [
            models.Index(fields=['user', 'status']),
        ]
    
    def save(self, *args, **kwargs):
        if self.status == 'completed' and not self.completed_at:
            self.completed_at = timezone.now()
            self.progress_percent = 100
        super().save(*args, **kwargs)


class NavBotLog(models.Model):
    """Logs navigation bot interactions for analytics."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nav_logs",
    )
    command_used = models.CharField(max_length=255, blank=True, default="")
    query_term = models.CharField(max_length=255, blank=True, default="")
    result_type = models.CharField(max_length=50, blank=True, default="")  # success, no_match, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "nav_bot_logs"
        ordering = ['-created_at']

