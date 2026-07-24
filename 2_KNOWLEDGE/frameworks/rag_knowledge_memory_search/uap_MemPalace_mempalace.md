# KI: MemPalace/mempalace

MemPalace is a system designed to provide AI with persistent memory by storing and indexing user-provided data locally. It aims for verbatim recall of conversations and information, organizing them into searchable "palaces" using techniques inspired by the method of loci and Zettelkasten. The project emphasizes local-first operation and avoids reliance on external APIs by default.

## Tech Stack (from code)

*   **Python:**  The primary language, evidenced by numerous `.py` files throughout the repository (e.g., `mempalace/cli.py`, `mempalace.backends.chroma.py`).
*   **Chromadb:** Used as a vector database backend, indicated in `pyproject.toml`: `"chromadb>=1.5.4,<2"` and the existence of files like `mempalace/backends/chroma.py`.
*   **PyYAML:**  Used for YAML parsing, shown in `pyproject.toml`: `"pyyaml>=6.0,<7"` and usage within various configuration files (e.g., `docker-compose.yml`).
*   **uv:** A fast dependency installer used during the build process, as described in the Dockerfile and referenced by `COPY --from=ghcr.io/astral-sh/uv:0.5 /uv /uvx /bin/`.
*   **Dockerfile**: Used for containerization of the application, with separate configurations for CPU and GPU environments.

## Public API / Exports

Due to the nature of this project (primarily a CLI tool and backend service), identifying a formal public API is difficult based solely on code inspection. However, some observable exports include:

*   **`mempalace-mcp`**:  The main entry point for the MCP server, defined in `pyproject.toml`: `mempalace-mcp = "mempalace.mcp_server:main"`.
*   **`mempalace` CLI**: The primary command-line interface, defined in `pyproject.toml`: `mempalace = "mempalace.cli:main"` and used for commands like `search`, `mine`, etc. (as seen in `docker-entrypoint.sh`).
*   **Backend Interfaces:**  The project defines interfaces for different vector database backends, as evidenced by the `mempalace.backends` package and entries in `pyproject.toml`: `"chroma = "mempalace.backends.chroma:ChromaBackend"`.

## Dependencies

Based on `pyproject.toml`, key dependencies include:

*   **Chromadb:** Version >=1.5.4,<2 (for vector database functionality)
*   **PyYAML:** Version >=6.0,<7 (for YAML parsing)
*   **Hugging Face Hub:**  Version >=0.20 (likely for model management and downloading)
*   **Tokenizers:** For text processing and tokenization.
*   **NumPy:** For numerical operations.
*   **python-dateutil:** For date parsing, as noted in the comments within `pyproject.toml`.

## Architecture Patterns

*   **Plugin System:** The project utilizes a plugin system for extending functionality (e.g., `.antigravity-plugin`, `.claude-plugin`, `.codex-plugin`).  This is evident from the directory structure and files like `plugin.json` within these directories.
*   **Modular Design:** The codebase appears modular, with distinct components for CLI interaction (`mempalace/cli.py`), MCP server (`mempalace/mcp_server.py`), and backend integrations (`mempalace/backends/*`).
*   **Configuration-Driven:**  The system relies heavily on configuration files (e.g., `docker-compose.yml`, `.mcp.json`) to control behavior and settings.



## Relevance to SEOSONA OS

MemPalace's focus on local, persistent memory could be highly beneficial for SEOSONA OS in several ways:

*   **Enhanced Contextual Awareness:**  Integrating MemPalace would allow SEOSONA agents to maintain a more comprehensive understanding of user interactions and project contexts, leading to more relevant responses and actions.
*   **Reduced Reliance on External Services:** The local-first design aligns with the principles of data privacy and autonomy that are likely important for SEOSONA OS.  This reduces dependency on external APIs and potential vendor lock-in.
*   **Customizable Memory Architecture:** The plugin system allows for tailoring the memory storage and retrieval mechanisms to specific needs within SEOSONA OS, potentially optimizing performance or incorporating specialized knowledge domains.
*   **Verbatim Data Retention**: This is crucial for auditability and ensuring accurate record keeping of user interactions with SEOSONA agents.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `llm`, `embedding`, `rag`, `vector`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
