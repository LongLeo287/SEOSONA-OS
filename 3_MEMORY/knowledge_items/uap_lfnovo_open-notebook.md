# KI: lfnovo/open-notebook

## Overview
lfnovo/open-notebook is an open-source research assistant designed to provide privacy-focused AI capabilities for content analysis, note generation, and podcast creation. The system allows users to upload various content types (PDFs, audio, video, web pages) and interact with them using AI models.  It's built as a self-hosted solution with support for multiple AI providers.

## Tech Stack (from code)
- **Programming Languages:** Python, TypeScript (api/main.py, frontend/)
- **Frameworks:** FastAPI (api/main.py), Next.js (frontend/), React (frontend/)
- **Build System:**  `pyproject.toml` specifies `setuptools` as the build backend and lists dependencies like `fastapi`, `uvicorn`, and `pydantic`. The frontend uses npm for package management, with a `package.json` file defining dependencies and build scripts. Dockerfile utilizes multistage builds.
- **Database:** SurrealDB (docker-compose.yml, api/models_service.py)
- **State Management:** Zustand (frontend/)
- **Data Fetching:** TanStack Query (frontend/)

## Public API / Exports
Based on the `api/main.py` file and its imports, here's a list of exposed endpoints:

*   `/auth/*`: Authentication related routes (api/routers/auth.py)
*   `/chat/*`: Chat-related operations (api/routers/chat.py)
*   `/config/*`: Configuration management (api/routers/config.py)
*   `/context/*`: Context retrieval (api/routers/context.py)
*   `/credentials/*`: Credential management (api/routers/credentials.py)
*   `/embedding/*`: Embedding operations (api/routers/embedding.py)
*   `/notebooks/*`: Notebook related operations (api/routers/notebooks.py)
*   `/notes/*`: Note related operations (api/routers/notes.py)
*   `/podcasts/*`: Podcast creation and management (api/routers/podcasts.py)
*   `/search/*`: Search functionality (api/routers/search.py)
*   `/settings/*`: Settings management (api/routers/settings.py)
*   `/sources/*`: Source related operations (api/routers/sources.py)
*   `/transformations/*`: Transformation-related endpoints (api/routers/transformations.py)

## Dependencies
Based on `pyproject.toml` and `frontend/package.json`, the project has the following dependencies:

**Python:**

*   fastapi
*   uvicorn
*   pydantic
*   loguru
*   langchain
*   langgraph
*   tiktoken
*   surrealdb
*   podcast-creator
*   surreal-commands
*   numpy
*   pycountry
*   babel

**Frontend (JavaScript/TypeScript):**

*   react
*   next
*   zustand
*   tanstack-query
*   shadcn-ui
*   tailwindcss

## Architecture Patterns
- **Three-Tier Architecture:** The project follows a clear three-tier architecture: Frontend (React/Next.js), API (FastAPI), and Database (SurrealDB). This is documented in the `CLAUDE.md` file.
- **Service Layer:**  The API code utilizes a service layer pattern, with dedicated services like `ChatService`, `NotebookService`, etc., encapsulating business logic. For example, `api/chat_service.py`.
- **Asynchronous Operations:** The use of `async` and `await` throughout the codebase (e.g., in `api/chat_service.py`) indicates a focus on asynchronous operations for improved performance and scalability.
- **Configuration via Environment Variables:**  The project heavily relies on environment variables for configuration, as demonstrated in `.env.example`.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

*   **AI Integration:** The modular AI provider support (Esperanto) and API design can be leveraged to integrate various LLMs into SEOSONA OS, enabling features like intelligent document processing or conversational interfaces.
*   **Data Management:** SurrealDB's graph database capabilities could be useful for managing complex relationships between data entities within SEOSONA OS.
*   **Asynchronous Task Processing:** The asynchronous programming patterns used in the project can inform how SEOSONA OS handles long-running tasks and improves responsiveness.
*   **Privacy Focus:**  The emphasis on privacy and self-hosting aligns with potential requirements for secure and controlled data processing within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `openai`, `anthropic`, `ollama`, `embedding`, `rag`
- **All scores:** {'seosona-os': 100, 'seosona-video': 20, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
