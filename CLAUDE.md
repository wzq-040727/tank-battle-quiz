# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tank battle browser game with integrated Java interview quiz system. Defeating enemies triggers quiz questions; correct answers boost attack, wrong answers deduct HP and persist to backend for review via 错题本 (notebook).

## Build & Run

**Backend (Spring Boot 3.2.5, Java 17, Maven):**
```bash
cd backend
mvn compile                    # build
mvn spring-boot:run            # start on port 8080
mvn test                       # run tests
```
H2 console: `http://localhost:8080/h2-console` (user: `sa`, no password)

**Frontend (vanilla JS, no build step):**
```bash
cd frontend
python -m http.server 8000     # serve static files
```
Open `http://localhost:8000` in browser. Backend must be running for quiz/notebook API.

## Architecture

**Backend** — `backend/src/main/java/com/tankquiz/`
- Layered: `entity/` → `repository/` → `service/` → `controller/`
- 3 JPA entities: `Question`, `WrongAnswer` (→Question), `Notebook` (→WrongAnswer)
- 3 REST controllers: `/api/questions`, `/api/wrong-answers`, `/api/notebook`
- `config/CorsConfig.java` — allows all origins
- `data.sql` — seeds 50 Java interview questions (7 categories, 3 difficulties)

**Frontend** — `frontend/js/`
- `engine/` — GameEngine (requestAnimationFrame loop, GameState enum), InputMgr (keyboard), CollisionMgr (AABB)
- `entities/` — Tank (base) → PlayerTank, EnemyTank; Bullet, QuizItem
- `map/` — maps.js (3 preset 16×12 grids, CELL_SIZE=40), MapGen (load/spawn/collision queries)
- `quiz/` — QuizModule (API + built-in fallback, 30s timer), questions.js (50 questions)
- `ui/` — Renderer (canvas draw), NotebookUI (错题本 overlay)
- `main.js` — wires everything: movement (WASD/arrows), shooting (space), enemy AI, collision resolution, quiz triggers, game over/win

**Frontend ↔ Backend contract:** `QuizModule.js` and `Notebook.js` hardcode `API_BASE = 'http://localhost:8080/api'`. Quiz tries backend first, falls back to built-in questions.

## Key Design Decisions

- Hybrid question bank: frontend built-in `questions.js` mirrors backend `data.sql`. Backend is optional — game works offline with built-in questions only.
- Two quiz triggers: enemy kill (hard difficulty for elite, random for normal) and map item pickup (random).
- Two enemy types: Normal (random patrol, hp=30, atk=5) and Elite (player-tracking, hp=60, atk=10).
- H2 in-memory DB with `create-drop` — data resets on restart. Switch to MySQL for persistence (change `application.yml`).

## Conventions

- Backend: standard Spring Boot patterns, constructor injection, `@Query` for custom SQL
- Frontend: ES6 modules (`type="module"`), no bundler, canvas 2D rendering only (no images/assets)
- Canvas size: 640×480 (16 cols × 12 rows × 40px cells)
