from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import (
    Path, Module, Lesson,
    MitreTactic, MitreTechnique, LessonTechniqueMap,
    UserProgress, NavBotLog
)

User = get_user_model()

# ==========================================
# 1. User & Auth (Preserved Custom Logic)
# ==========================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "role", "is_verified", "date_joined"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "date_joined": {"read_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ==========================================
# 2. MITRE Framework
# ==========================================
class MitreTacticSerializer(serializers.ModelSerializer):
    class Meta:
        model = MitreTactic
        fields = ["id", "mitre_id", "name"]


class MitreTechniqueSerializer(serializers.ModelSerializer):
    tactic = MitreTacticSerializer(read_only=True)
    
    class Meta:
        model = MitreTechnique
        fields = ["id", "mitre_id", "name", "description", "tactic"]


# ==========================================
# 3. Learning Content (Nested Hierarchy)
# ==========================================
class LessonTechniqueSerializer(serializers.ModelSerializer):
    # Serializes the technique details inside a lesson
    technique = MitreTechniqueSerializer(read_only=True)
    
    class Meta:
        model = LessonTechniqueMap
        fields = ["technique"]

class LessonSerializer(serializers.ModelSerializer):
    # Nested techniques to show what this lesson covers
    techniques = LessonTechniqueSerializer(source='technique_links', many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            "id", "module", "title", "content_type", 
            "router_link", "order_index", "description", 
            "key_indicators", "techniques"
        ]

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ["id", "path", "title", "order_index", "lessons"]

class PathSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Path
        fields = ["id", "title", "slug", "type", "modules"]


# ==========================================
# 4. User Progress & Logs
# ==========================================
class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ["id", "user", "lesson", "status", "created_at", "updated_at", "completed_at"]
        read_only_fields = ["created_at", "updated_at", "completed_at"]


class NavBotLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavBotLog
        fields = ["id", "user", "command_used", "query_term", "created_at"]