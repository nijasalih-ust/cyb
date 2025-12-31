# Client Demo: Cyb.Lib Technical Overview
**Audience:** Senior Developers & Stakeholders
**Tone:** Professional, Technical, Minimalistic
**Duration:** ~20-30 Minutes

---

## Slide 1: Title Slide
- **Title:** Cyb.Lib Platform Overview
- **Subtitle:** Next-Gen Cybersecurity Education & MITRE mapping
- **Presenter:** [Your Name/Team Name]
- **Visual:** Clean logo or code-monogram on dark background (Matrix/Cyber theme).

## Slide 2: High-Level Architecture
*Objective: Show the robust stack choice.*
- **Frontend:** React (Vite) - Single Page Application (SPA).
- **Backend:** Django Rest Framework (DRF) - Robust API Layer.
- **Database:** PostgreSQL - Relational Data Integrity.
- **AI Integration:** Local LLM (Ollama) for dynamic content generation.
- **Visual:** Simple Block Diagram:
    `[React Client] <--> [Django API] <--> [PostgreSQL] + [Ollama AI Service]`

## Slide 3: The Core Engine: Data Pipeline
*Objective: Explain how we handle complex cybersecurity data.*
- **Source of Truth:** MITRE Enterprise ATT&CK (STIX JSON).
- **Ingestion Process:**
    - Custom Management Command (`seed_mitre_from_file`).
    - Maps STIX Objects -> Relational Models (Tactics, Techniques).
- **Key Insight:** "We don't just display static text; we ingest structured threat intelligence."

## Slide 4: AI-Driven Curriculum
*Objective: Highlight the "Smart" feature.*
- **Problem:** Static content becomes outdated.
- **Solution:** AI-Assisted Lesson Generation.
    - **Process:** Tactic/Technique Metadata + Ollama Prompt -> Structured Lesson JSON.
    - **Result:** Dynamic curriculum scaling without manual writing overhead.

## Slide 5: Frontend Experience (UX/UI)
*Objective: Show modern standards.*
- **Design System:** Glassmorphism, Dark Mode native (Cyber-aesthetic).
- **State Management:** React Context API (`AuthContext` for secure session handling).
- **Security:**
    - Protected Routes (HOC wrapper).
    - JWT Authentication (Access/Refresh flow).

## Slide 6: Key Functional Modules
*Objective: What can the user actually DO?*
- **The Dashboard:** Stats & Progress Tracking.
- **The Navigator:** Interactive visualization of the ATT&CK Matrix.
- **Navigator Bot:** Context-aware assistant for student queries.
- **SIEM Simulator:** (If active) Simulated log environment for practical analysis.

## Slide 7: Live Demo Flow (The "Show", not "Tell")
*Guide for the presenter's screen share sequence:*
1.  **Authentication:** Cold start -> Sign up -> Login (Show simple, fast auth).
2.  **Dashboard Land:** Show clean state, welcome message.
3.  **Explore Curriculum:**
    - Browse "Initial Access" Tactic.
    - Open "Drive-by Compromise" Lesson.
    - *Tech Note:* Mention the dynamic routing (`/lessons/:id`).
4.  **Bot Interaction:** Ask the Navigator Bot a question about the technique.
5.  **MITRE Reference:** Show the deep-link to the official MITRE ID.

## Slide 8: Future Roadmap & Technical Debt
*Objective: Transparency with Senior Devs.*
- **Immediate:** Refactoring legacy "Tool Arsenal" (Removed/Cleaned).
- **Planned:** Dockerization for one-click deploy.
- **Scaling:** Moving AI generation to async queues (Celery) for performance.

## Slide 9: Q&A
- Open floor for architectural or functional questions.
