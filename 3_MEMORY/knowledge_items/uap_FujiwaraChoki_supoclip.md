# KI: FujiwaraChoki/supoclip

## Overview
... because good video clips shouldn't come with ugly watermarks or platform lock-in.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 124 files across 23 directories
- **File types:** .py: 64, .ttf: 21, .md: 16, .sql: 7, .sh: 3, .example: 2, .yml: 2

## Documentation Sections
- Fuck OpusClip.
- Why SupoClip Exists
- The OpusClip Problem
- The SupoClip Solution
- Quick Start
- Prerequisites
- 1. Clone and Configure
- Required: Video transcription
- Required: Choose ONE LLM provider and set its API key
- Option A: Google Gemini (recommended - fast & cost-effective)
- Option B: OpenAI GPT-5.2 (best reasoning)
- LLM=openai:gpt-5.2
- OPENAI_API_KEY=your_openai_api_key
- Option C: Anthropic Claude
- LLM=anthropic:claude-4-sonnet
- ANTHROPIC_API_KEY=your_anthropic_api_key
- Option D: Ollama (local/self-hosted)
- LLM=ollama:gpt-oss:20b
- OLLAMA_BASE_URL=  # Optional; defaults to localhost locally, host.docker.internal in Docker
- OLLAMA_API_KEY=your_ollama_api_key  # Optional (Ollama Cloud)
- Optional: Auth secret (change in production)
- Optional: DataFast analytics
- Track your deployed domain in DataFast
- NEXT_PUBLIC_DATAFAST_WEBSITE_ID=dfid_xxxxx
- NEXT_PUBLIC_DATAFAST_DOMAIN=your-domain.com

## Core Structure
```
  .env.example
  .gitignore
  AGENTS.md
  CLAUDE.md
  LICENSE
  Makefile
  QUICKSTART.md
  README.md
  docker-compose.yml
  init.sql
  install_cron.sh
  start.sh
  .github/
    workflows/
      tests.yml
  assets/
    banner.png
  backend/
    .dockerignore
    .env.example
    .python-version
    Dockerfile
    README.md
    REFACTORING_GUIDE.md
    pyproject.toml
    temp_tiktok_font_urls.css
    uv.lock
    bin/
      start.sh
    fonts/
      Anton-Regular.ttf
      ArchivoBlack-Regular.ttf
      Bangers-Regular.ttf
      BarlowCondensed-Bold.ttf
      BebasNeue-Regular.ttf
      DMSans.ttf
      Inter.ttf
      LeagueSpartan.ttf
      Montserrat-Variable-wght.ttf
      NunitoSans.ttf
      OpenSans.ttf
      Oswald-Variable-wght.ttf
      Poppins-ExtraBold.ttf
      README.md
      Raleway-Variable-wght.ttf
      Roboto.ttf
      Rubik.ttf
      SOURCES.md
      Sora.ttf
      THEBOLDFONT.ttf
      TikTokSans-Regular.ttf
      Urbanist.ttf
      WorkSans.ttf
    migrations/
      001_add_progress_fields.sql
      002_add_completion_notification_fields.sql
    src/
      admin_auth.py
      ai.py
      apify_youtube_downloader.py
      auth_headers.py
      broll.py
      caption_templates.py
      clip_cleanup.py
      clip_editor.py
      clip_source_map.py
      config.py
      database.py
      emoji_captions.py
      font_registry.py
      main.py
      main_refactored.py
      models.py
      observability.py
      runtime_settings.py
      video_utils.py
      worker_main.py
      youtube_utils.py
      api/
        __init__.py
        routes/
          __init__.py
          admin.py
          billing.py
          feedback.py
          media.py
          tasks.py
      migrations/
        sql/
          20260302_0001_performance_schema.sql
          20260503_0001_app_settings.sql
          20260503_0002_app_settings_preference.sql
          20260507_0001_task_processing_columns.sql
      repositories/
        __init__.py
        cache_repository.py
        clip_repository.py
        source_repository.py
        task_repository.py
      services/
        __init__.py
        billing_service.py
        email_service.py
        subscription_email_service.py
        task_completion_email_service.py
        task_service.py
        video_service.py
      utils/
        __init__.py
        async_helpers.py
      workers/
        __init__.py
        job_queue.py
        progress.py
        tasks.py
    tests/
      conftest.py
      test_video_utils_diar
```

## Quick Start
```bash
git clone https://github.com/FujiwaraChoki/supoclip.git
cd supoclip
This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000 (docs at /docs)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
First-time startup takes a few minutes. Check progress with:
Wait until you see health checks passing for all services.
Open http://localhost:3000 in your browser, create an account, and start clipping!
```

## Agent Configuration

--- AGENTS.md ---
# Repository Guidelines

## Project Structure & Module Organization
This repository is a monorepo with three apps:
- `backend/`: FastAPI + async worker code (`src/api`, `src/services`, `src/repositories`, `src/workers`).
- `frontend/`: main Next.js app (`src/app`, `src/components`, `src/lib`, `prisma/`).
- `waitlist/`: separate Next.js marketing/waitlist app.

Infra and bootstrap files live at the root: `docker-compose.yml`, `init.sql`, `.env.example`, and `start.sh`.

## Build, Test, and Development Commands
Use Docker for full-stack development:
- `docker-compose up -d --build`: start frontend, backend, worker, Postgres, and Redis.
- `docker-compose logs -f`: stream service logs.
- `docker-compose down`: stop everything.

Local app commands:
- `cd frontend && npm run dev` (or `waitlist`): run Next.js in dev mode.
- `cd frontend && npm run build && npm run start`: production build + serve.
- `cd frontend && npm run lint` (same in `waitlist`): run ESLint.
- `cd backend && uv sync && uvicorn src.main:app --reload --host 0.0.0.0 --port 8000`: run API locally.
- `cd backend && .venv/bin/arq src.workers.tasks.WorkerSettings`: run the worker.

## Coding Style & Naming Conventions
- Python: 4-space indentation, type hints where practical, `snake_case` for functions/modules.
- TypeScript/React: 2-space indentation, `PascalCase` for component names, `camelCase` for variables/functions, route files in Next.js App Router conventions (`app/.../page.tsx`, `route.ts`).
- Linting: Next.js ESLint configs in `frontend/eslint.config.mjs` and `waitlist/eslint.config.mjs`.
- Imports: use the `@/*` alias in Next.js apps when possible.

## Testing Guidelines
There is no mature automated test suite yet. Treat linting plus manual verification as the current baseline:
- Run `npm run lint` in both Next.js apps.
- Smoke test core flows with `docker-compose` (create task, process clips, view task page).

When adding tests, place them near code or under `tests/` with clear names (`test_*.py`, 

--- CLAUDE.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SupoClip is an open-source alternative to OpusClip — an AI-powered video clipping tool that transforms long-form content into viral short clips. AGPL-3.0 licensed.

## Development Commands

### Docker (recommended)

```bash
docker-compose up -d              # Start all 5 services
docker-compose up -d --build      # Rebuil

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
