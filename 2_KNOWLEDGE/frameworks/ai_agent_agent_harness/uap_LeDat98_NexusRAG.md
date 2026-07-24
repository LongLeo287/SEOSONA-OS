# KI: LeDat98/NexusRAG

## Overview
NexusRAG is a Retrieval-Augmented Generation (RAG) application designed for knowledge management and chat functionality, likely aimed at enterprise use cases. The codebase demonstrates a layered architecture with distinct backend and frontend components, utilizing Python for the server-side logic and TypeScript/React for the user interface. It integrates with various LLMs (Gemini, Ollama), vector databases (ChromaDB), and document parsing techniques to provide intelligent search and conversational capabilities.

## Tech Stack (from code)
- **Backend:** Python 3.10+ (verified by `setup.sh` script: `python3 -m venv venv`), FastAPI (`app/main.py`: `from fastapi import FastAPI`), SQLAlchemy (`backend/requirements.txt`: `sqlalchemy==2.0.28`), Alembic (`backend/alembic.ini`).
- **Frontend:** TypeScript, React (`frontend/src/App.tsx`, `frontend/vite.config.ts`), Vite (`frontend/vite.config.ts`), pnpm (package manager).
- **Build System:**  `pnpm` for frontend, Dockerfiles and docker-compose files define build and deployment processes.

## Public API / Exports
Based on the limited code provided, it's difficult to definitively list all public APIs. However, the following can be inferred:
- **Backend FastAPI endpoints:** The `app/main.py` file imports from other modules within the `api/` directory (e.g., `chat_agent.py`, `router.py`), suggesting REST API endpoints are defined there.  The Dockerfile.backend also indicates that the server runs on port 8080 (`uvicorn app.main:app --reload --port 8080`).
- **Frontend components:** The frontend directory contains numerous `.tsx` files within `src/components`, indicating React components are exported and used for UI rendering (e.g., `AppShell.tsx`, `ChatPanel.tsx`, `DocumentViewer.tsx`).

## Dependencies
- **Backend:** Listed in `backend/requirements.txt`: `fastapi`, `uvicorn`, `sqlalchemy`, `asyncpg`, `chromadb`, `python-dotenv`, `pydantic`, `langchain`, and many more related to LLMs, vector databases, document parsing, etc.
- **Frontend:** Listed in `frontend/package.json`:  `react`, `react-dom`, `vite`, `@types/react`, `@types/react-dom`, and various UI libraries.

## Architecture Patterns
- **Layered Architecture:** The backend is structured into distinct layers: `app` (main application logic), `api` (API endpoints), `core` (business logic), `models` (data models), `schemas` (database schemas), and `services` (specific RAG functionalities like chunking, embedding, retrieval).
- **Service-Oriented:** The backend utilizes a service-oriented approach with modules dedicated to specific tasks such as document loading (`document_loader.py`), embedding generation (`embedder.py`), and knowledge graph management (`knowledge_graph_service.py`).
- **Configuration Management:** Environment variables are heavily used for configuration (e.g., database URLs, LLM provider keys) as defined in `.env.example` and utilized by the Docker Compose setup.

## Relevance to SEOSONA OS
- **RAG Capabilities:** The core RAG functionality within NexusRAG could be adapted to enhance SEOSONA's knowledge retrieval and question answering capabilities.  The modular design allows for customization of document parsing, embedding models, and LLMs to suit SEOSONA’s specific data sources and requirements.
- **LLM Integration:** The project demonstrates integration with multiple LLMs (Gemini, Ollama), which could be valuable for experimenting with different language models within the SEOSONA ecosystem.
- **Frontend Components:**  The reusable React components in the frontend (e.g., `DocumentCard`, `ResultCard`) could potentially inspire or inform UI development for SEOSONA's user interfaces.
- **Dockerized Deployment:** The Docker Compose setup provides a reproducible environment, which aligns with modern DevOps practices and simplifies deployment of SEOSONA services.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `ollama`, `gemini`, `rag`, `vector`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
