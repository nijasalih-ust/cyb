# Project Startup Guide

Welcome to **cyb.lib**. Follow these instructions to set up the project on a new machine.

## Prerequisites
- **Python 3.10+**
- **Node.js 16+** & **npm**
- **PostgreSQL** (Ensure it is running and you have a DB created, e.g., `cyblib`)
- **Ollama** (Optional, for generating new AI curriculum content)
- version 9.8 of pgAdmin 4
---

## 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure Environment Variables:
    - Ensure you have a `.env` file in `backend/` with your DB credentials.
    - Example:
        ```
        DB_NAME=cyblib
        DB_USER=postgres
        DB_PASSWORD=yourpassword
        DB_HOST=localhost
        DB_PORT=5432
        ```

5.  Run Database Migrations:
    ```bash
    python manage.py migrate
    ```

6.  (Optional) Generate Curriculum Data:
    - **IMPORTANT**: If moving to a machine WITHOUT AI/Ollama, ensure you copy `backend/scripts/curriculum_data.json` from the source machine.
    - If the JSON exists, you can SKIP this step.
    - If `curriculum_data.json` is missing and you have Ollama:
    ```bash
    python scripts/generate_curriculum.py
    ```

7.  Seed the Database:
    ```bash
    python scripts/seed_curriculum.py
    ```

8.  Start the Server:
    ```bash
    python manage.py runserver
    ```

---

## 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Development Server:
    ```bash
    npm run dev
    ```

4.  Access the App:
    - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Troubleshooting
- **Missing Data?**: Ensure you ran `seed_curriculum.py`.
- **Login Issues?**: Create a superuser via `python manage.py createsuperuser` if no users exist.
