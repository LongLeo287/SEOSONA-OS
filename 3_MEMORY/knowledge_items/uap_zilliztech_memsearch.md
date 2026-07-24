# KI: zilliztech/memsearch

## Overview
Memsearch is a semantic memory search engine designed for markdown knowledge bases, built on top of Milvus. It allows users to index and query markdown files using embeddings, enabling retrieval based on semantic similarity rather than keyword matching. The system aims to be particularly useful for AI agents working with code.

## Tech Stack (from code)
- **Language:** Python (specified in `pyproject.toml`: `requires-python = ">=3.10"`)
- **Framework/Libraries:** Click (`dependencies = ["click>=8.1"]` in `pyproject.toml`), PyMilvus (`dependencies = ["pymilvus>=2.5.0"]` in `pyproject.toml`), Milvus Lite (`dependencies = ["milvus-lite>=2.5.0"]` in `pyproject.toml`), OpenAI (`dependencies = ["openai>=1.0"]` in `pyproject.toml`), Watchdog (`dependencies = ["watchdog>=4.0"]` in `pyproject.toml`).
- **Build System:** Hatchling (`[build-system] requires = ["hatchling"]` in `pyproject.toml`)

## Public API / Exports
Based on the `cli.py` and `core.py` files, the public API appears to revolve around the `MemSearch` class.  Evidence from `CLAUDE.md`: "All commands resolve config via `resolve_config()` then instantiate `MemSearch`." The core functions exposed are:
- `index()` (implied by `CLAUDE.md`)
- `search()` (implied by `CLAUDE.md`)
- `compact()` (implied by `CLAUDE.md`)
- `watch()` (implied by `CLAUDE.md`)

## Dependencies
From `pyproject.toml`:
- pymilvus>=2.5.0,!=2.6.10
- milvus-lite>=2.5.0; sys_platform != 'win32'
- click>=8.1
- watchdog>=4.0
- setuptools>=78.1.1,<81
- tomli_w>=1.0
- tomli>=2.0; python_version < '3.11'
- openai>=1.0
- google-genai>=1.0 (optional)
- voyage>=0.3 (optional)
- jina (optional)
- httpx>=0.27 (optional)
- mistralai>=1.0 (optional)
- ollama>=0.4 (optional)
- einops>=0.8.2 (optional)
- sentence-transformers>=3.0 (optional)
- anthropic>=0.40 (optional)
- onnxruntime>=1.17,<1.24; python_version == '3.10' (optional)
- tokenizers>=0.15 (optional)
- huggingface-hub>=0.20 (optional)

## Architecture Patterns
- **Layered Configuration:** The system uses a layered configuration approach, drawing settings from defaults, a user TOML file (`~/.memsearch/config.toml`), a project-level TOML file (`.memsearch.toml`), and CLI flags (`pyproject.toml` & `CLAUDE.md`).
- **Plugin Architecture:** The system has plugin architecture for Claude Code, Codex, OpenClaw, and Opencode. Each plugin directory contains similar structure of prompts, scripts, hooks, and skills. This suggests a modular design allowing for extension and customization. (e.g., `plugins/claude-code/`, `plugins/codex/`)
- **Hybrid Search:** The search functionality combines dense vector similarity search with sparse BM25 and RRF reranking (`CLAUDE.md`).
- **Chunking & Hashing:** Markdown files are split into chunks, and a composite hash is generated for each chunk to enable deduplication and efficient indexing (`chunker.py`, `CLAUDE.md`).

## Relevance to SEOSONA OS
Memsearch's architecture could be beneficial to SEOSONA OS in several ways:
- **Knowledge Management:** The semantic search capabilities would allow SEOSONA OS to index and retrieve information from markdown documentation, code repositories, or other knowledge bases more effectively than traditional keyword searches.
- **AI Agent Integration:**  The plugin architecture makes it relatively easy to integrate Memsearch with AI agents running within SEOSONA OS, providing them with a powerful tool for accessing and reasoning about relevant information. The existing Claude Code plugin demonstrates this potential.
- **Code Understanding:** The ability to chunk code and index it semantically could be used to improve code understanding and analysis tools within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `openai`, `anthropic`, `ollama`, `embedding`, `rag`
- **All scores:** {'seosona-os': 100, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
