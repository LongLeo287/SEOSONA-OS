# KI: poco-ai/poco-claw

## Overview
This repository, `poco-ai/poco-claw`, implements a cloud-based AI agent execution platform named Poco. It orchestrates Claude AI agents to perform autonomous tasks such as file organization, document writing, and data analysis within a distributed cloud environment. The project includes frontend (Next.js), backend (FastAPI), executor, and executor manager components.

## Tech Stack (from code)
- **Python:**  The backend, executor, and executor manager are written in Python, evidenced by the `pyproject.toml` file: `[project] name = "Poco"` and numerous `.py` files within the `backend`, `executor`, and `executor_manager` directories.
- **TypeScript/JavaScript:** The frontend is built using TypeScript and JavaScript, as indicated by the presence of `.tsx`, `.ts`, and `.js` files in the `frontend` directory and the `pnpm.lock` file containing dependencies like `next`.
- **Next.js:**  The frontend utilizes Next.js framework, confirmed by the `frontend/eslint.config.mjs` file: `"extends": ["next"]` and references to Next.js APIs in the frontend code.
- **FastAPI:** The backend, executor, and executor manager utilize FastAPI for their API servers, as seen in files like `backend/app/main.py`: `from fastapi import FastAPI`.
- **PostgreSQL:**  The project uses PostgreSQL as its database, evidenced by the `docker-compose.yml` file defining a `postgres` service and environment variables related to PostgreSQL configuration.
- **Neo4j:** The project utilizes Neo4j graph database, seen in the `docker-compose.r2.yml` file defining a `mem0-neo4j` service.
- **Rustfs:**  The project uses Rustfs for object storage, as defined in the `docker-compose.yml` and `docker-compose.r2.yml` files.
- **Uvicorn:** The Python services use Uvicorn as an ASGI server, seen in the `start-dev.sh` script: `uv run python -m app.main`.

## Public API / Exports
Due to the large codebase and lack of clear documentation beyond the `AGENTS.md`, it's difficult to definitively list public APIs without further investigation. However, based on file structure and naming conventions, potential endpoints include:
- **Backend:**  FastAPI routes defined in `backend/app/api`. The health check endpoint is explicitly mentioned as `/api/v1/health` (from `docker-compose.yml`).
- **Executor:**  Likely exposes API endpoints for task submission and status retrieval, although specific URLs are not readily apparent without deeper code analysis.

## Dependencies
Based on the `pyproject.toml` file in the backend directory:
- Python >=3.12 (specified in `requires-python`)
- Ruff (for linting)
- Pyrefly (for type checking)

The frontend's dependencies are listed in its `pnpm.lock` file, including but not limited to:
- Next.js
- React
- TypeScript

## Architecture Patterns
- **Microservices:** The system is clearly designed as a microservice architecture with distinct Frontend, Backend, Executor, and Executor Manager components, each deployed independently (as evidenced by the `docker-compose.yml` file).
- **Event-Driven Communication:**  The workflow described in `AGENTS.md` suggests an event-driven communication pattern between services, where callbacks are used to update task status.
- **Plugin/Hook Architecture:** The Executor component is designed with a hook-based extensibility mechanism, allowing for customization of agent execution behavior (mentioned in `AGENTS.md`).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Agent Orchestration Framework:**  The executor and executor manager components provide a robust framework for orchestrating AI agents, which could be adapted for use within SEOSONA OS to automate various tasks.
- **Distributed Task Execution:** The architecture’s distributed nature is well suited for scaling agent workloads across multiple machines or cloud regions, aligning with SEOSONA OS's potential scalability requirements.
- **API Design Patterns:**  The FastAPI backend and the described API interactions provide valuable examples of designing scalable and maintainable APIs for AI services within SEOSONA OS.
- **Rustfs Integration**: The use of Rustfs demonstrates a practical implementation of object storage, which could be leveraged by SEOSONA OS for managing large datasets or agent artifacts.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `capability`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
