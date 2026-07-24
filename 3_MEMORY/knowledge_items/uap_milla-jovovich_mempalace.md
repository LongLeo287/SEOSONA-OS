# KI: milla-jovovich/mempalace

## Overview
Mempalace is a system designed for AI memory, allowing users to store and search projects and conversations with verbatim recall. It aims to provide local-first data storage and processing, avoiding reliance on external APIs by default. The project emphasizes incremental data updates and entity-centric organization of information.

## Tech Stack (from code)
- **Python:**  The primary language, evidenced by the numerous `.py` files throughout the repository and specified in `pyproject.toml`: `requires-python = ">=3.9"`
- **uv:** Used as a fast dependency installer, referenced in the Dockerfile: `COPY --from=ghcr.io/astral-sh/uv:0.5 /uv /uvx /bin/` and `pyproject.toml`.
- **ChromaDB:**  A vector database used for storing embeddings, specified as a project dependency in `pyproject.toml`: `chromadb>=1.5.4,<2`.
- **PyYAML:** Used for YAML parsing, declared as a dependency in `pyproject.toml`: `pyyaml>=6.0,<7`
- **Docker:**  Used for containerization, with Dockerfiles present (`Dockerfile`, `Dockerfile.gpu`) and `docker-compose.yml` defining service configurations.

## Public API / Exports
Due to the nature of this project (a CLI tool and server), it's difficult to definitively list a public API without more context. However, based on the code:

- **`mempalace` CLI:** The `pyproject.toml` file defines an entry point for a CLI application: `[project.scripts] mempalace = "mempalace.cli:main"`. This suggests a command-line interface accessible via the `mempalace` executable.
- **MCP Server API:**  The `docker-compose.yml` file and `docker-entrypoint.sh` script indicate an MCP (Memory Control Protocol) server, likely exposing a JSON-RPC API over standard input/output. The entry point is defined as: `[project.scripts] mempalace-mcp = "mempalace.mcp_server:main"`
- **Plugin APIs:**  The presence of `.json` and `.sh` files within the `.agents`, `.antigravity-plugin`, `.claude-plugin`, and `.codex-plugin` directories suggests plugin architectures with defined hooks and commands.

## Dependencies
Based on `pyproject.toml`:
- chromadb (>=1.5.4,<2)
- pyyaml (>=6.0,<7)
- tomli (<3.11)
- huggingface_hub (>=0.20)
- tokenizers (>=0.15)
- numpy (>=1.24)
- python-dateutil (>=2.8)

## Architecture Patterns
- **Plugin Architecture:** The presence of plugin directories (`.agents`, `.antigravity-plugin`, etc.) indicates a modular design allowing for extensions and customizations.  Each plugin directory contains `plugin.json` files defining their functionality.
- **Local-First Design:** The Dockerfile and `docker-compose.yml` emphasize local data storage and processing, minimizing reliance on external services.
- **Command-Line Interface (CLI):** A significant portion of the code appears to be dedicated to a CLI tool for interacting with the memory palace system.  The `docker-entrypoint.sh` script handles dispatching commands to either the MCP server or the CLI.



## Relevance to SEOSONA OS
Mempalace's architecture and focus on local data storage could benefit SEOSONA OS in several ways:

- **Privacy-Preserving AI Integration:**  The local-first design aligns with SEOSONA’s privacy principles, allowing for AI features without sending user data externally.
- **Customizable Memory Management:** The plugin architecture allows SEOSONA to extend Mempalace's functionality and tailor it to specific OS needs (e.g., integrating with system logs or application data).
- **Offline Functionality:**  The local storage capabilities enable offline access to AI-powered memory features, crucial for environments with limited connectivity.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `llm`, `embedding`, `rag`, `vector`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
