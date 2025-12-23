from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import (
    Path, Module, Lesson,
    KillChainPhase, MitreTactic, MitreTechnique,
    LessonTechniqueMap, TacticPhaseMap,
    UserProgress, NavBotLog
)
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "role", "is_verified"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class KillChainPhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = KillChainPhase
        fields = ["id", "step_number", "name", "description"]


class MitreTacticSerializer(serializers.ModelSerializer):
    class Meta:
        model = MitreTactic
        fields = ["id", "mitre_id", "name"]


class MitreTechniqueSerializer(serializers.ModelSerializer):
    tactic_name = serializers.CharField(source='tactic.name', read_only=True)
    
    class Meta:
        model = MitreTechnique
        fields = ["id", "mitre_id", "name", "description", "tactic", "tactic_name"]


class LessonTechniqueMapSerializer(serializers.ModelSerializer):
    technique = MitreTechniqueSerializer(read_only=True)
    
    class Meta:
        model = LessonTechniqueMap
        fields = ["id", "lesson", "technique"]


class LessonSerializer(serializers.ModelSerializer):
    techniques = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = ["id", "module", "title", "router_link", "description", "key_indicators", "techniques"]
    
    def get_techniques(self, obj):
        technique_links = obj.technique_links.all()
        return MitreTechniqueSerializer([link.technique for link in technique_links], many=True).data


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ["id", "path", "order_index", "title", "lessons"]


class PathSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Path
        fields = ["id", "title", "slug", "type", "modules"]


class TacticPhaseMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = TacticPhaseMap
        fields = ["id", "tactic", "phase"]


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ["id", "user", "lesson", "status"]


class NavBotLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavBotLog
        fields = ["id", "user", "command_used", "query_term", "created_at"]