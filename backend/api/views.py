from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import (
    Path, Module, Lesson,
    MitreTactic, MitreTechnique,
    UserProgress, NavBotLog
)
from .serializers import (
    UserSerializer, PathSerializer, ModuleSerializer, LessonSerializer,
    MitreTacticSerializer, MitreTechniqueSerializer,
    UserProgressSerializer, NavBotLogSerializer
)

User = get_user_model()

# ==========================================
# 1. User Management
# ==========================================

# Preserved: Public registration endpoint
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


# ==========================================
# 2. Content ViewSets (Standard CRUD)
# ==========================================

class PathViewSet(viewsets.ModelViewSet):
    queryset = Path.objects.all()
    serializer_class = PathSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class MitreTacticViewSet(viewsets.ModelViewSet):
    queryset = MitreTactic.objects.all()
    serializer_class = MitreTacticSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class MitreTechniqueViewSet(viewsets.ModelViewSet):
    queryset = MitreTechnique.objects.all()
    serializer_class = MitreTechniqueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UserProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NavBotLogViewSet(viewsets.ModelViewSet):
    queryset = NavBotLog.objects.all()
    serializer_class = NavBotLogSerializer
    permission_classes = [permissions.IsAuthenticated]


# ==========================================
# 3. Custom / Legacy Views (Preserved)
# ==========================================

# Preserved: Used for frontend visualizations
class FrameworkTacticsView(generics.ListAPIView):
    queryset = MitreTactic.objects.all()
    serializer_class = MitreTacticSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        for tactic in queryset:
            data.append({
                "id": tactic.id,
                "mitre_id": tactic.mitre_id,
                "name": tactic.name,
                "description": f"Tactics for {tactic.name}", 
                "technique_count": tactic.techniques.count()
            })
        return Response(data)

# Preserved: For specific tactic lookups
class TechniquesByTacticList(generics.ListAPIView):
    serializer_class = MitreTechniqueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tactic_id = self.kwargs['tactic_id']
        return MitreTechnique.objects.filter(tactic__id=tactic_id)

# Preserved: Dashboard logic (Updated status check to 'completed')
class DashboardStatsView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        # Logic update: 'mastered' -> 'completed'
        completed_lessons = UserProgress.objects.filter(user=user, status='completed').count()
        
        # Simple XP Calculation
        xp = (completed_lessons * 100)
        level = 1 + (xp // 500)

        data = {
            "xp": xp,
            "level": level,
            "techniques_mastered": completed_lessons, # Using lessons as proxy for now
            "labs_completed": completed_lessons,
            "streak": 0 
        }
        return Response(data)

# Preserved: Bot Logic
class NavigatorCommandView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data or {}
        cmd_raw = data.get("input", "")
        cmd = (cmd_raw or "").strip()
        context = data.get("context", {})

        if cmd.lower().startswith("navigate "):
            url = cmd.split(" ", 1)[1]
            return Response({"type": "action", "payload": {"action": "navigate", "url": url}})

        if cmd.lower().startswith("technique ") or cmd.lower().startswith("show technique "):
            term = cmd.split(" ", 1)[1]
            try:
                tech = MitreTechnique.objects.filter(mitre_id__iexact=term).first()
                if not tech:
                    tech = MitreTechnique.objects.filter(name__icontains=term).first()
                if tech:
                    payload = {
                        "id": str(tech.id),
                        "mitre_id": tech.mitre_id,
                        "name": tech.name,
                        "description": tech.description,
                    }
                    return Response({"type": "technique_detail", "payload": payload})
            except Exception:
                pass
            return Response({"type": "options", "payload": {"message": "Technique not found", "options": []}})

        if cmd.lower() == "stats":
            total = MitreTechnique.objects.count()
            # Logic update: 'mastered' -> 'completed'
            completed = request.user.progress.filter(status="completed").count()
            pct = int((completed / total) * 100) if total else 0
            payload = {
                "percentage": pct,
                "techniques_mastered": completed,
                "techniques_total": total,
                "current_path": context.get("current_page", ""),
            }
            return Response({"type": "stats", "payload": payload})

        return Response({"type": "options", "payload": {"message": f"Unrecognized command: {cmd_raw}", "options": []}})

# Preserved: Simple completion endpoint
class LessonCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        lesson = get_object_or_404(Lesson, pk=pk)
        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            defaults={'status': 'completed'}
        )
        if not created and progress.status != 'completed':
            progress.status = 'completed'
            progress.save()
            
        return Response({"status": "success", "message": "Lesson marked as completed."}, status=status.HTTP_200_OK)