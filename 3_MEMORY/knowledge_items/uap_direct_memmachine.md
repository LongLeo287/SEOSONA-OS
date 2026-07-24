# KI: direct_memmachine

## Overview
The `direct_memmachine` repository appears to be a project focused on building and deploying a long-term memory layer for AI agents, specifically leveraging large language models (LLMs). It provides functionalities like episodic memory, profile memory, and working memory. The code includes components for both server-side logic and client interaction, along with infrastructure setup using Docker Compose and related tools.

## Tech Stack (from code)
- **Programming Languages:** Python (primarily), TypeScript (for the REST client) - evidenced by `pyproject.toml` and `packages/ts-client/package.json`.
- **Frameworks/Libraries:** FastAPI (server framework, evident in `packages/server/src/memmachine_server/server/app.py`), Docker (containerization, evident in `Dockerfile`, `docker-compose.yml`), Alembic (database migration tool, evident in `alembic.ini`).
- **Build System:**  uv (evident in `pyproject.toml` and the `Dockerfile`'s build process).
- **Database:** PostgreSQL with pgvector extension (evidenced by `docker-compose.yml`), Neo4j (graph database, also in `docker-compose.yml`).

## Public API / Exports
Based on `packages/ts-client/src/index.ts`, the following are exported:
- `MemMachineClient`: The main client class for interacting with the MemMachine server.
- `Project`: A class representing a project within MemMachine.
- `Memory`:  A class related to memory management in MemMachine.
- `MemMachineAPIError`: An error class for handling API errors.

## Dependencies
- **Python (from `pyproject.toml`):** pydantic, regex, alembic, asyncpg, aiosqlite, fastapi, langchain-core, neo4j, nltk, openai, pgvector, prometheus-client, pyyaml, rank-bm25, sqlalchemy, usearch, uvicorn
- **TypeScript (from `packages/ts-client/package.json`):** axios, axios-retry

## Architecture Patterns
- **Microservices:** The project utilizes Docker Compose to orchestrate multiple services (PostgreSQL, Neo4j, MemMachine server) which suggests a microservice architecture.  The `docker-compose.yml` file explicitly defines these separate containers.
- **Layered Architecture:** Within the Python code, there's evidence of layered design with packages like `packages/server`, `packages/common`, and `packages/client`. This indicates separation of concerns between server logic, shared utilities, and client interaction.
- **RESTful API:** The TypeScript client strongly suggests a RESTful API for communication between clients and the MemMachine server.

## Relevance to SEOSONA OS
The project's focus on long-term memory management could be highly beneficial to SEOSONA OS.  Specifically:
- **Persistent State Management:**  MemMachine’s episodic and profile memory capabilities can provide a robust mechanism for SEOSONA OS to maintain persistent state across reboots or system updates, enabling more complex and adaptive behavior.
- **Agentic Capabilities:** The architecture supports agentic workflows, which aligns with the potential need for autonomous agents within SEOSONA OS to perform tasks and learn from experience.  The `AGENTS.md` file highlights this aspect.
- **Data Storage & Retrieval:** Utilizing PostgreSQL and Neo4j provides a flexible solution for storing and retrieving structured data related to system state, user preferences, or learned knowledge – crucial for an operating system.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `rag`, `vector`, `ollama`, `embedding`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 6}
