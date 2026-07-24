# KI: EverMind-AI/EverOS

## Overview
EverOS is a Python framework designed for local-first markdown memory extraction, targeting AI agents and user chats. It emphasizes lightweight operation and suitability for small teams, utilizing a layered architecture to manage data extraction, search, and evolution. The project aims to provide a developer-friendly environment with configurable components and adherence to specific engineering practices.

## Tech Stack (from code)
- **Language:** Python 3.12+ (`pyproject.toml`: `requires-python = ">=3.12"`)
- **Framework:** FastAPI (`pyproject.toml`: `"fastapi>=0.104.0"`) and Typer (`pyproject.toml`: `"typer>=0.12.0`) for API and CLI functionality respectively.
- **Build System:**  `uv` (based on `pyproject.toml` content) is used for dependency management, running commands, and pre-commit hooks.
- **Database:** SQLite (`pyproject.toml`: `"aiosqlite>=0.20.0"`) with SQLAlchemy and LanceDB (`pyproject.toml`: `"lancedb>=0.13.0"`) for vector storage and BM25 search.

## Public API / Exports
Due to the large codebase, identifying all public APIs is not feasible without more context. However, based on file structure and imports, some key components appear to have exported functionality:
- `everos/component/config/loader.py`:  Likely provides functions for loading configuration data.
- `everos/llm/client.py`: Provides a client interface for interacting with LLMs.
- `everos/rerank/_errors.py`: Defines custom error types related to reranking functionality.
- `everos/utils/datetime.py`:  Exports datetime utilities, as enforced by the project's coding standards.

## Dependencies
Based on `pyproject.toml`, key dependencies include:
- pydantic (for data validation)
- lancedb (vector database)
- openai (LLM provider interface)
- fastapi and uvicorn (API framework)
- structlog (observability)
- jieba (Chinese tokenizer)

## Architecture Patterns
- **Layered Architecture:**  The `CLAUDE.md` file explicitly describes a five-layer architecture: entrypoints, service, memory, infra, and component/core/config. This is reinforced by the directory structure (`src/everos/`).
- **Component-Based Design:** The `component/` directory suggests a modular design with injectable providers for LLMs, embeddings, configuration, and utilities.
- **Configuration Management:**  The project utilizes multiple layers of configuration (default TOML file, user config file, environment variables) with defined priority rules (`.env.example`).
- **Convention over Configuration**: The `Makefile` and `.pre-commit-config.yaml` files demonstrate a strong emphasis on automated checks and formatting conventions.

## Relevance to SEOSONA OS
EverOS's focus on local-first memory extraction, markdown parsing, and integration with vector databases could be beneficial for SEOSONA OS in the following ways:
- **Local Data Storage:** The use of SQLite and LanceDB provides a foundation for storing and querying data locally within SEOSONA OS.
- **Markdown Processing:**  The framework's ability to parse and extract information from markdown documents aligns with potential needs for processing user documentation or knowledge bases.
- **LLM Integration:** The modular LLM integration allows for easy swapping of different language models, which could be valuable for experimentation and optimization within SEOSONA OS.
- **Engineering Practices**:  The project's emphasis on automated checks, code formatting, and architectural guidelines can contribute to improved code quality and maintainability in SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `embedding`, `rag`, `vector`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
