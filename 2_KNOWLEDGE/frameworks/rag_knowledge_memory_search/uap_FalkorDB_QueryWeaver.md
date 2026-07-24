# KI: FalkorDB/QueryWeaver

## Overview
QueryWeaver is an open-source Text2SQL tool that transforms natural language into SQL queries using graph-powered schema understanding, backed by the FalkorDB database. It's a full-stack application with a Python/FastAPI backend and a React/TypeScript frontend. The project aims to provide a user interface for interacting with databases through natural language prompts.

## Tech Stack (from code)
- **Backend:** Python 3.12, FastAPI, Uvicorn (api/app_factory.py: `from fastapi import FastAPI`, api/index.py: `from api.app_factory import create_app`), Redis (api/extensions.py: `from falkordb.asyncio import FalkorDB`).
- **Frontend:** React 18, TypeScript 5.8, Vite 7, Tailwind CSS (app/package.json).
- **Graph Database:** FalkorDB (api/extensions.py: `from falkordb.asyncio import FalkorDB`).
- **LLM Integration:** LiteLLM (api/config.py: `from litellm import completion`), OpenAI, Gemini, Anthropic, Cohere, Azure, Ollama (api/config.py).
- **Authentication:** OAuth 2.0 via Authlib (server dependencies in pyproject.toml).
- **Package Management:** uv (Python), npm (Node) (pyproject.toml, app/package.json).
- **Testing:** pytest (unit tests), Playwright (E2E) (dev dependencies in pyproject.toml).

## Public API / Exports
Due to the nature of this project being a full stack application with both backend and frontend components, it's difficult to determine all public APIs without further investigation. However, some exposed endpoints can be identified from the `api/routes` directory:

- `/auth/*`: Authentication related routes (api/routes/auth.py).
- `/database/*`: Database management routes (api/routes/database.py).
- `/graphs/*`: Graph interaction routes (api/routes/graphs.py).
- `/meta`: Metadata endpoints (api/routes/meta.py).
- `/tokens/*`: Token management routes (api/routes/tokens.py).
- `/settings/*`: Settings configuration routes (api/routes/settings.py).

## Dependencies
Based on `pyproject.toml` and `app/package.json`, the following dependencies are used:

**Python:**
- litellm>=1.83.0
- falkordb~=1.6.1
- psycopg2-binary~=2.9.12
- pymysql~=1.2.0
- jsonschema~=4.26.0
- tqdm~=4.67.3
- pydantic>=2.0
- python-dotenv~=1.2.2

**Node:**
- queryweaver-app (version depends on local app)
- @playwright/test "^1.56.1"
- @types/node "^22.10.2"
- playwright "^1.56.1"

## Architecture Patterns
- **Microservices-like Structure:** The backend is organized into distinct modules (agents, auth, core, loaders, memory, routes, sql_utils), suggesting a modular design.
- **Graph Database Integration:**  The application heavily relies on FalkorDB for schema understanding and query execution, indicating a graph database-centric architecture.
- **FastAPI Framework:** The use of FastAPI promotes asynchronous operations and API development best practices.
- **Frontend Component-Based Architecture:** The React frontend utilizes components (e.g., `SuggestionCards`, `ChatInterface`) to build the user interface.

## Relevance to SEOSONA OS
QueryWeaver's code could benefit SEOSONA OS in several ways:

- **Natural Language Database Interaction:**  The Text2SQL functionality can enable users to query databases using natural language, simplifying data access for non-technical users within SEOSONA OS.
- **Graph Schema Understanding:** The graph database integration and schema understanding capabilities can be leveraged to improve data discovery and relationship analysis within the operating system's data management tools.
- **Modular Design:** The modular backend architecture provides a foundation for integrating specific components into existing SEOSONA OS services, such as data analytics or reporting modules.
- **Authentication Integration:**  The OAuth 2.0 integration can be adapted to enhance security and user authentication within the operating system's ecosystem.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `serp`, `keyword`, `robots`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 28}
