# KI: weaiw/trove-ai

## Overview
This project appears to be a self-hosted AI knowledge management and research tool, likely designed for personal or small team use. It integrates with various services like Postgres, Redis, OpenAI (potentially), and includes features such as article management, concept mapping, and Wechat bot integration. The application is structured around both a backend API and a frontend web interface built using modern JavaScript frameworks.

## Tech Stack (from code)
- **Backend:** Python 3 with FastAPI (`app/main.py`: `from fastapi import FastAPI`), utilizing asyncpg for PostgreSQL interaction (`DATABASE_URL: postgresql+asyncpg://...`).  The backend is containerized via Dockerfile in the `backend` directory.
- **Frontend:** TypeScript and React (JSX) as evidenced by `.tsx` files throughout the `frontend/src/app` directory, along with a `tsconfig.json` file. The frontend uses Next.js (`next.config.js`, `package.json`).  The frontend is also containerized via Dockerfile in the `frontend` directory.
- **Database:** PostgreSQL with pgvector extension (docker-compose.yml: `image: pgvector/pgvector:pg16`)
- **Build System:** npm / yarn (based on `package.json` and `package-lock.json` in the frontend directory)

## Public API / Exports
Due to the limited code provided, it's difficult to definitively list all public APIs. However, based on `app/routers/__init__.py`, the backend appears to expose REST endpoints through FastAPI routers including:
- `/articles`: (from `app/routers/articles.py`) - likely for article management operations.
- `/assistant`: (from `app/routers/assistant.py`) - potentially related to AI assistant functionality.
- `/auth`: (from `app/routers/auth.py`) - for authentication and authorization.
- `/concepts`: (from `app/routers/concepts.py`) - likely for concept management operations.
- `/knowledge`: (from `app/routers/knowledge.py`) - related to knowledge base functionality.

The frontend exports components like `ClientLayout` (`frontend/src/app/ClientLayout.tsx`).  More comprehensive API discovery would require examining the full codebase.

## Dependencies
Based on the provided files:
- **Backend:** (from `backend/requirements.txt`)
    - `fastapi`
    - `uvicorn`
    - `asyncpg`
    - `python-dotenv`
    - `SQLAlchemy`
    - `pydantic`
    - Other dependencies listed in the file.
- **Frontend:** (from `frontend/package.json`)
    - `next`
    - `react`
    - `tailwindcss`
    - `typescript`
    - Numerous other frontend dependencies.

## Architecture Patterns
- **FastAPI Routers:** The backend utilizes FastAPI routers for modular API endpoint definition (`app/routers/*`).
- **Layered Architecture (Backend):**  The backend code shows a layered structure with `app/models`, `app/schemas`, and `app/services` directories, suggesting separation of concerns.
- **Containerization:** Both the frontend and backend are containerized using Dockerfiles, promoting portability and reproducibility.
- **Configuration Management:** The application uses environment variables (`.env` file) for configuration, which is a common practice for managing secrets and settings in deployed environments.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Knowledge Graph Integration:**  The concept of knowledge graphs and graph algorithms (evident from `backend/app/services/graph_algorithms.py` and `backend/app/services/graph_retrieval.py`) aligns with potential needs for semantic understanding within SEOSONA OS. The pgvector integration suggests a focus on vector embeddings, which could be useful for similarity search and knowledge retrieval.
- **AI Agent Framework:**  The presence of AI service components (`backend/app/services/ai_service.py`, `backend/app/services/research_agent.py`) demonstrates an existing framework for integrating with AI models, potentially adaptable to SEOSONA OS's own AI capabilities.
- **Modular API Design:** The FastAPI router structure provides a good example of how to build a modular and maintainable backend API, which could inform the design of SEOSONA OS APIs.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`, `router`
- **All scores:** {'seosona-os': 66, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
