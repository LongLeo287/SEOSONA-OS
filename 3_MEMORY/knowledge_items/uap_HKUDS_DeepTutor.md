# KI: HKUDS/DeepTutor

## Overview
DeepTutor is an agent-native intelligent learning companion designed for personalized education and research. It leverages large language models (LLMs) and a plugin architecture to provide interactive learning experiences, web search capabilities, and code execution within a sandboxed environment. The system emphasizes multi-agent collaboration and retrieval augmented generation (RAG) techniques.

## Tech Stack (from code)
- **Python:**  The primary language for the backend, evidenced by `pyproject.toml` which lists Python dependencies like `openai`, `fastapi`, and `uvicorn`. (`pyproject.toml`)
- **TypeScript/React:** Used for the frontend, as indicated by the presence of `.tsx` files within the `web/` directory and the `node:22-slim` base image in the Dockerfile.  (`Dockerfile`)
- **FastAPI:** The backend framework used to build the API endpoints, confirmed by the dependency listed in `pyproject.toml`. (`pyproject.toml`)
- **Next.js:** Used for building the frontend application, as evidenced by the directory structure under `web/` and the `npm run build` command in the Dockerfile. (`Dockerfile`)
- **Node.js:**  Used for the frontend development and build process. (`Dockerfile`)
- **Docker:** Utilized for containerization and deployment, with multiple `docker-compose.yml`, `docker-compose.dev.yml`, and `Dockerfile` files defining the application's environment. (`docker-compose.yml`)

## Public API / Exports
Due to the large codebase, identifying all public APIs is not feasible without further analysis. However, the following indicates exposed functionality:
- **WebSocket API:** The architecture diagram in `AGENTS.md` explicitly mentions a WebSocket API at `/api/v1/ws`. (`AGENTS.md`)
- **CLI:**  The `pyproject.toml` file defines a script named `deeptutor`, indicating a command-line interface is available. (`pyproject.toml`)

## Dependencies
Based on `requirements.txt` and `pyproject.toml`:
- Python: PyYAML, Jinja2, OpenAI, Tiktoken, AIOHTTP, Requests, DDGS, Nest Asyncio, Pydantic, Aiosqlite, Typer, Rich, Prompt Toolkit, Anthropic, Dashscope, PerplexityAI, LlamaIndex, Faiss, PyMuPDF, NumPy, Arxiv, Python-Docx, Openpyxl, Python-PPTX, PyPDF, PDFPlumber, Reportlab, DefusedXML, FastAPI, Uvicorn, WebSockets, Python-Multipart, Bcrypt, Python-Jose, Pocketbase, Loguru, JSON Repair.
- JavaScript: React, Prettier

## Architecture Patterns
- **Plugin Architecture:** The system utilizes a plugin architecture for both Tools and Capabilities, as described in `AGENTS.md`. This allows for modularity and extensibility. (`AGENTS.md`)
- **Microservices (loosely coupled):**  The use of Docker Compose suggests a microservice approach, with separate containers for the backend, frontend, and PocketBase.
- **Retrieval Augmented Generation (RAG):** The project heavily relies on RAG techniques, as evidenced by dependencies like `llama-index` and integrations with knowledge bases.
- **Agent-Native Design:**  The architecture is centered around agents and their interactions, with a focus on tool selection and capability orchestration.

## Relevance to SEOSONA OS
DeepTutor's code could benefit SEOSONA OS in several ways:
- **Personalized Learning Modules:** The agent-native design and RAG capabilities can be adapted to create personalized learning modules within SEOSONA OS, tailoring content and difficulty based on user progress.
- **Knowledge Base Integration:**  The system’s knowledge base management features could be integrated with SEOSONA OS's existing data repositories to enhance information retrieval and analysis.
- **Code Execution Sandbox:** The sandboxed code execution environment can provide a secure platform for running user-submitted scripts or experiments within the SEOSONA OS ecosystem.
- **Plugin Architecture:**  The plugin architecture allows for easy integration of new features and functionalities into SEOSONA OS, promoting extensibility and customization.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `rag`, `vector`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 28}
