from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router handles the standard CRUD endpoints automatically
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'paths', views.PathViewSet)
router.register(r'modules', views.ModuleViewSet)
router.register(r'lessons', views.LessonViewSet)
router.register(r'tactics', views.MitreTacticViewSet)
router.register(r'techniques', views.MitreTechniqueViewSet)
router.register(r'progress', views.UserProgressViewSet, basename='user-progress')
router.register(r'logs', views.NavBotLogViewSet)

urlpatterns = [
    # 1. Standard Router URLs
    path('', include(router.urls)),

    # 2. Auth Endpoints
    path("register/", views.CreateUserView.as_view(), name="register"),

    # 3. Custom Endpoints (Preserved & Updated)
    
    # Dashboard & Stats
    path("dashboard/", views.DashboardStatsView.as_view(), name="dashboard-stats"),
    path("frameworks/tactics/", views.FrameworkTacticsView.as_view(), name="framework-tactics"),
    
    # Specific Technique Lookup (Preserved for compatibility)
    path(
        "frameworks/tactics/<uuid:tactic_id>/techniques/",
        views.TechniquesByTacticList.as_view(),
        name="techniques-by-tactic",
    ),

    # Navigator Bot
    path("navigator/command", views.NavigatorCommandView.as_view(), name="navigator-command"),

    # Manual Lesson Completion (Alternative to ViewSet)
    path("lessons/<uuid:pk>/complete/", views.LessonCompleteView.as_view(), name="lesson-complete"),
]