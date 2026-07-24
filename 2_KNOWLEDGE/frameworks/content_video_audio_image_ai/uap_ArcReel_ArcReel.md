# KI: ArcReel/ArcReel

## Overview
ArcReel is an AI video generation platform that converts novels into short videos. The system utilizes a three-tier architecture involving a React frontend, a FastAPI backend, and a core library for agent interaction and project management.  The codebase demonstrates a focus on asynchronous task queues and integration with various AI models (Claude, Gemini, Ark).

## Tech Stack (from code)
- **Python:** `pyproject.toml` lists Python as the primary language: `requires-python = ">=3.12"`
- **FastAPI:**  The backend is built using FastAPI, evident from files like `server/app.py` and dependencies listed in `pyproject.toml`: `"fastapi>=0.135.1"`
- **React (with TypeScript):** The frontend uses React with TypeScript as indicated by the presence of `.tsx` files and dependencies in a presumed frontend package.json file (not directly accessible).
- **Pnpm:**  The Dockerfile utilizes `pnpm` for dependency management: `RUN pnpm install --frozen-lockfile`.
- **Alembic:** Alembic is used for database migrations, indicated by the presence of `alembic.ini` and related files.
- **SQLAlchemy:** SQLAlchemy is listed as a dependency in `pyproject.toml`: `"sqlalchemy[asyncio]>=2.0.48"`

## Public API / Exports
Due to limited code visibility, identifying definitive public APIs is challenging. However, based on the routing structure within `server/routers`, potential endpoints include:
- `/api/v1/projects` (Project CRUD) -  `server/routers/projects.py`
- `/api/v1/generate` (Video generation tasks) - `server/routers/generate.py`
- `/api/v1/assistant` (Claude Agent SDK sessions) - `server/routers/assistant.py`

## Dependencies
Based on `pyproject.toml`:
- `"claude-agent-sdk"`:  For interacting with Claude agents.
- `"ffmpeg-python"`: For video processing.
- `"fastapi"`: The web framework.
- `"google-genai"`: Integration with Google's generative AI models.
- `"Pillow"`: Image manipulation library.
- `"uvicorn"`: ASGI server for running the FastAPI application.
- `"sqlalchemy"`: Database ORM.
- `"pytest"`: Testing framework.

## Architecture Patterns
- **Three-Tier Architecture:** The codebase clearly separates frontend, backend (API), and core library responsibilities.
- **Asynchronous Task Queue:**  The `lib/generation_queue.py` module indicates a system for managing asynchronous video generation tasks.
- **Configuration-Driven Routing:** The asset types are dynamically generated based on configuration in `lib/asset_types.ASSET_SPECS`.
- **Plugin Architecture (Potential):** The use of providers and the ability to resolve them suggests a plugin architecture for integrating with different AI models or services.

## Relevance to SEOSONA OS
- **AI Video Generation Capabilities:** ArcReel's core functionality could be integrated into SEOSONA OS to provide users with automated video creation tools from text prompts or other data sources.
- **Asynchronous Task Management:** The task queue implementation in `lib/generation_queue.py` provides a robust solution for managing long-running processes, which is valuable for any operating system handling background tasks.
- **Plugin Architecture:**  The provider architecture could be leveraged to extend SEOSONA OS with support for various AI models and services without modifying the core codebase.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `planner`
- **All scores:** {'seosona-os': 66, 'seosona-video': 44, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 28}
