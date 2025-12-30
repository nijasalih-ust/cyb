# Project Structure & Cleanup Log

## Core Directories

### `backend/`
- **`api/`**: Contains the Django app logic (Models, Serializers, Views).
  - `models.py`: Defines `User`, `Path`, `Module`, `Lesson`, and MITRE mappings.
  - `serializers.py`: API data transformation.
  - `views.py`: API endpoints.
- **`scripts/`**: Critical maintenance scripts.
  - `generate_curriculum.py`: Uses local AI (Ollama) to generate rich curriculum data.
  - `seed_curriculum.py`: Populates the database from the generated JSON.
  - `seed_framework.py`: Ingests raw MITRE STIX data.
- **`requirements.txt`**: Python dependencies.

### `frontend/`
- **`src/pages/`**: React components for each page.
  - `Login/`: Enhanced auth UI with Login/Register toggle.
  - `PathDetail/` & `LessonDetail/`: Displays the curriculum.
- **`src/context/`**: State management (e.g., `AuthContext`).

---

## Cleaned Files (Removed)
The following single-use or temporary scripts were removed to declutter the codebase:

1.  `backend/check_users.py` - Temp script for debugging user creation.
2.  `backend/scripts/create_admin.py` - One-off superuser creation (use `python manage.py createsuperuser` instead).
3.  `backend/scripts/debug_jwt.py` - Token debugging.
4.  `backend/scripts/debug_seed.py` - Seeding debug.
5.  `backend/scripts/drop_quizzes.py` - Schema cleanup helper.
6.  `backend/scripts/reset_db.py` - Hard reset script (use migrations or manual flush).
7.  `backend/scripts/test_login.py` - Auth testing.

8.  `backend/check_relationships.py` - Database relationship debugger.
9.  `backend/codebase_exporter.py` - Analysis tool.
10. `backend/debug_out_utf8.txt` - Debug log.
11. `backend/debug_output.txt` - Debug log.
12. `backend/debug_seed_output.txt` - Seeding log.
13. `backend/debug_views.py` - Temporary view debugger.
14. `backend/seed_error.log` - Error log.
15. `backend/test_api.py` - Standalone API test.
16. `backend/test_lessons_with_techniques.py` - Relationship test.
17. `backend/test_navigator.py` - Bot unit test.
18. `backend/test_nested_data.py` - Serializer test.

## How to Run
1.  **Backend**: `cd backend && python manage.py runserver`
2.  **Frontend**: `cd frontend && npm run dev`
