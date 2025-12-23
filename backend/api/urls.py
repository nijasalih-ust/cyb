# api/urls.py
from django.urls import path
from . import views

 # Notes, (if you want to use the /notes put the following commented code into the urlpatterns )
'''
path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path(
        "notes/<uuid:pk>/",
        views.NoteRetrieveUpdateDestroy.as_view(),
        name="note-detail",
    ),
''' 
urlpatterns = [
 
    # Paths / Modules / Lessons
    path("paths/", views.PathListCreate.as_view(), name="path-list"),
    path("paths/<uuid:pk>/", views.PathDetail.as_view(), name="path-detail"),

    path("modules/", views.ModuleListCreate.as_view(), name="module-list"),
    path("modules/<uuid:pk>/", views.ModuleDetail.as_view(), name="module-detail"),

    path("lessons/", views.LessonListCreate.as_view(), name="lesson-list"),
    path("lessons/<uuid:pk>/", views.LessonDetail.as_view(), name="lesson-detail"),
    path("lessons/<uuid:pk>/complete/", views.LessonCompleteView.as_view(), name="lesson-complete"),


    # Framework data
    path(
        "kill-chain-phases/",
        views.KillChainPhaseList.as_view(),
        name="kill-chain-phase-list",
    ),
    path(
        "mitre-tactics/",
        views.MitreTacticList.as_view(),
        name="mitre-tactic-list",
    ),
    path(
        "mitre-techniques/",
        views.MitreTechniqueList.as_view(),
        name="mitre-technique-list",
    ),
    path(
        "frameworks/tactics/<uuid:tactic_id>/techniques/",
        views.TechniquesByTacticList.as_view(),
        name="techniques-by-tactic",
    ),

    # Mappings
    path(
        "lesson-techniques/",
        views.LessonTechniqueMapListCreate.as_view(),
        name="lesson-technique-map-list",
    ),
    path(
        "tactic-phases/",
        views.TacticPhaseMapListCreate.as_view(),
        name="tactic-phase-map-list",
    ),

    # User progress & logs
    path(
        "user-progress/",
        views.UserProgressListCreate.as_view(),
        name="user-progress-list",
    ),
    path(
        "nav-logs/",
        views.NavBotLogListCreate.as_view(),
        name="nav-bot-log-list",
    ),
    # Navigator command endpoint used by the frontend navigator component
    path("navigator/command", views.NavigatorCommandView.as_view(), name="navigator-command"),
    # path(
    #     "tools/",
    #     views.ToolList.as_view(),
    #     name="tool-list",
    # ),
    path(
        "dashboard/",
        views.DashboardStatsView.as_view(),
        name="dashboard-stats",
    ),
    path(
        "frameworks/tactics/",
        views.FrameworkTacticsView.as_view(),
        name="framework-tactics",
    ),
]
