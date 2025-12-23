from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import (
    UserSerializer, PathSerializer, ModuleSerializer, LessonSerializer,
    KillChainPhaseSerializer, MitreTacticSerializer, MitreTechniqueSerializer,
    LessonTechniqueMapSerializer, TacticPhaseMapSerializer,
    UserProgressSerializer, NavBotLogSerializer
)
from .models import (
    Path, Module, Lesson,
    KillChainPhase, MitreTactic, MitreTechnique,
    LessonTechniqueMap, TacticPhaseMap,
    UserProgress, NavBotLog
)

User = get_user_model()


# class ToolList(generics.ListCreateAPIView): - REMOVED
#     queryset = Tool.objects.all()
#     serializer_class = ToolSerializer
#     permission_classes = [IsAuthenticated]



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class PathListCreate(generics.ListCreateAPIView):
    queryset = Path.objects.all()
    serializer_class = PathSerializer
    permission_classes = [IsAuthenticated]


class PathDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Path.objects.all()
    serializer_class = PathSerializer
    permission_classes = [IsAuthenticated]


class ModuleListCreate(generics.ListCreateAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]


class ModuleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]


class LessonListCreate(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]


class LessonDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

class KillChainPhaseList(generics.ListAPIView):
    queryset = KillChainPhase.objects.all()
    serializer_class = KillChainPhaseSerializer
    permission_classes = [IsAuthenticated]


class MitreTacticList(generics.ListAPIView):
    queryset = MitreTactic.objects.all()
    serializer_class = MitreTacticSerializer
    permission_classes = [IsAuthenticated]


class MitreTechniqueList(generics.ListAPIView):
    queryset = MitreTechnique.objects.all()
    serializer_class = MitreTechniqueSerializer
    permission_classes = [IsAuthenticated]


class LessonTechniqueMapListCreate(generics.ListCreateAPIView):
    queryset = LessonTechniqueMap.objects.all()
    serializer_class = LessonTechniqueMapSerializer
    permission_classes = [IsAuthenticated]


class TacticPhaseMapListCreate(generics.ListCreateAPIView):
    queryset = TacticPhaseMap.objects.all()
    serializer_class = TacticPhaseMapSerializer
    permission_classes = [IsAuthenticated]


class UserProgressListCreate(generics.ListCreateAPIView):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]


class NavBotLogListCreate(generics.ListCreateAPIView):
    queryset = NavBotLog.objects.all()
    serializer_class = NavBotLogSerializer
    permission_classes = [IsAuthenticated]

'''
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
'''
class DashboardStatsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        # Calculate stats
        mastered_techniques = UserProgress.objects.filter(user=user, status='mastered').count()
        labs_completed = UserProgress.objects.filter(user=user, status='completed').count()
        
        # Calculate XP (Mock calculation)
        xp = (mastered_techniques * 50) + (labs_completed * 100)
        
        # Calculate Level
        level = 1 + (xp // 500)

        data = {
            "xp": xp,
            "level": level,
            "techniques_mastered": mastered_techniques,
            "labs_completed": labs_completed,
            "streak": 0  # Placeholder
        }
        return Response(data)

class FrameworkTacticsView(generics.ListAPIView):
    queryset = MitreTactic.objects.all()
    serializer_class = MitreTacticSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Augment data with technique counts if needed, but for now standard serializer
        # Or using a custom response format as expected by frontend
        data = []
        for tactic in queryset:
            data.append({
                "id": tactic.id,
                "mitre_id": tactic.mitre_id,
                "name": tactic.name,
                "description": f"Tactics for {tactic.name}", # Placeholder description if not in model
                "technique_count": MitreTechnique.objects.filter(tactic=tactic).count()
            })
        return Response(data)


class TechniquesByTacticList(generics.ListAPIView):
    serializer_class = MitreTechniqueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tactic_id = self.kwargs['tactic_id']
        return MitreTechnique.objects.filter(tactic__id=tactic_id)


from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404

class NavigatorCommandView(APIView):
    """Simple navigator command endpoint used by the frontend Navigator component.
    It accepts POST JSON with `input` (string) and optional `context` and
    returns a small structured response that the frontend understands.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data or {}
        cmd_raw = data.get("input", "")
        cmd = (cmd_raw or "").strip()
        context = data.get("context", {})

        # simple navigation command: "navigate /some/url"
        if cmd.lower().startswith("navigate "):
            url = cmd.split(" ", 1)[1]
            return Response({"type": "action", "payload": {"action": "navigate", "url": url}})

        # technique detail: "technique T1190" or "show technique T1190"
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

        # stats command
        if cmd.lower() == "stats":
            total = MitreTechnique.objects.count()
            mastered = 0
            if request.user and request.user.is_authenticated:
                mastered = request.user.userprogress_set.filter(status="mastered").count()
            pct = int((mastered / total) * 100) if total else 0
            payload = {
                "percentage": pct,
                "techniques_mastered": mastered,
                "techniques_total": total,
                "current_path": context.get("current_page", ""),
            }
            return Response({"type": "stats", "payload": payload})

        # default
        return Response({"type": "options", "payload": {"message": f"Unrecognized command: {cmd_raw}", "options": []}})

class LessonCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        lesson = get_object_or_404(Lesson, pk=pk)
        # Check if already completed
        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            defaults={'status': 'completed'}
        )
        if not created and progress.status != 'completed':
            progress.status = 'completed'
            progress.save()
            
        return Response({"status": "success", "message": "Lesson marked as completed."}, status=status.HTTP_200_OK)
