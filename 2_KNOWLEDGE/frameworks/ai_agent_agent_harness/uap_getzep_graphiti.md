# KI: getzep/graphiti

## Overview
Graphiti is a Python framework designed for building temporally-aware knowledge graphs, enabling real-time incremental updates without batch recomputation. It supports integration with graph databases like Neo4j and FalkorDB and includes features such as hybrid retrieval and LLM integration. The project provides both a core library and a FastAPI server for interacting with the knowledge graph.

## Tech Stack (from code)
- **Language:** Python (evident from numerous `.py` files, e.g., `graphiti_core/graphiti.py`)
- **Framework:** FastAPI (indicated by `server/graph_service/main.py`: `from fastapi import FastAPI`)
- **Build System:** Hatchling and uv (defined in `pyproject.toml`, e.g., `[build-system] requires = ["hatchling"]` and usage of `uv` commands in Makefile)
- **Dependency Management:** Poetry (used via `pyproject.toml`)

## Public API / Exports
Based on a cursory review, it's difficult to definitively list all public APIs without deeper analysis. However, the following are evident:
- The `Graphiti` class within `graphiti_core/graphiti.py` appears to be a central entry point for interacting with the graph.
- FastAPI endpoints defined in `server/graph_service/main.py` expose API functionality (e.g., `/healthcheck`).
- Database driver classes reside in `graphiti_core/driver/`, suggesting public interfaces for database interaction.

## Dependencies
From `pyproject.toml`:
- pydantic (version >=2.11.5)
- neo4j (version >=5.26.0)
- openai (version >=1.91.0)
- tenacity (version >=9.0.0)
- numpy (version >=1.0.0)
- python-dotenv (version >=1.0.1)
- posthog (version >=3.0.0)

## Architecture Patterns
- **Modular Design:** The codebase is organized into distinct modules within `graphiti_core/` (e.g., `nodes`, `edges`, `driver`), suggesting a modular architecture.
- **Driver Pattern:**  The `graphiti_core/driver/` directory implements the driver pattern, providing database-specific implementations for interacting with different graph databases.
- **Layered Architecture:** The separation of concerns between core library (`graphiti_core/`) and server components (`server/`) suggests a layered architecture.

## Relevance to SEOSONA OS
Graphiti's ability to build and update knowledge graphs incrementally could be valuable for SEOSONA OS in several ways:
- **Real-time Data Integration:**  SEOSONA OS can integrate real-time data streams into its knowledge graph without requiring full recomputation, enabling more responsive decision-making.
- **Temporal Reasoning:** The framework's support for temporal data allows SEOSONA OS to reason about events and relationships over time, improving understanding of complex situations.
- **LLM Integration:**  The existing integration with LLMs (OpenAI, Anthropic) could be leveraged to enhance SEOSONA OS’s natural language processing capabilities.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `gemini`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
