from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import (
    Path, Module, Lesson,
    MitreTactic, MitreTechnique,
    UserProgress, NavBotLog,
    LessonTechniqueMap
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
    # lookup_field = 'slug' - Removed to allow lookup by ID (pk) which frontend uses

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
        # For 'explain' calls, payload might be { "query": "..." }
        query = data.get("query", cmd_raw).strip() 
        context = data.get("context", {})

        # 1. Navigation Flow (Client often handles this, but backend can suggest)
        # If the input is just "navigate", we return the root paths
        if query.lower() == "navigate":
            paths = Path.objects.all().values("id", "title")
            options = [{"label": p["title"], "value": f"path_id:{p['id']}", "type": "path"} for p in paths]
            return Response({
                "type": "options", 
                "message": "Select a learning path:", 
                "options": options
            })

        # 2. Explanation Flow
        # Checks if the user is asking about a technique (e.g., "Explain T1059")
        # Or if the request explicitly asks for it via "query" param
        if query:
            # Try to match a MITRE technique by ID or Name
            # Improve search: Case insensitive, partial match
            tech = MitreTechnique.objects.filter(mitre_id__iexact=query).first()
            if not tech:
                tech = MitreTechnique.objects.filter(name__icontains=query).first()
            
            if tech:
                # Found a technique! Resolve the linked Lesson UUID
                # Look for a LessonTechniqueMap linking this technique
                lesson_link = LessonTechniqueMap.objects.filter(technique=tech).first()
                
                # Default link fallback
                link_url = f"/library" 

                if lesson_link:
                   link_url = f"/lessons/{lesson_link.lesson.id}"
                
                payload = {
                    "id": str(tech.id),
                    "mitre_id": tech.mitre_id,
                    "name": tech.name,
                    "description": tech.description[:500] + "..." if tech.description else "No description available.",
                    "link": link_url
                }
                return Response({
                    "type": "technique_detail", 
                    "message": f"Here is what I found for {tech.mitre_id}:",
                    "payload": payload
                })
            
            # If no technique found, maybe it's a general question? 
            # For now, we fallback to a generic message.
            return Response({
                "type": "message", 
                "message": f"I couldn't find a technique matching '{query}'. Try searching by ID (e.g., T1059) or Name."
            })

        return Response({"type": "message", "message": "How can I help you? You can say 'Navigate' or ask about a technique."})

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