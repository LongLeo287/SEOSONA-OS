# KI: Memento-Teams/Memento-Skills

## Overview
This project, "memento-s," appears to be an agent or application focused on skills management and potentially document processing (specifically .docx files). The `bootstrap.py` file indicates it handles system initialization, configuration migration, database setup, and skill system initialization.  The presence of modules like `weixin_sdk`, `media/transcode.py`, and schemas for Office Open XML formats suggests capabilities related to interacting with WeChat, media processing, and document manipulation.

## Tech Stack (from code)
- **Python:** The primary language, evident from the `.py` file extensions (488 files).
- **Typer:** Used as a CLI framework (`pyproject.toml`: `"typer"`).
- **Pydantic & Pydantic Settings:**  Used for data validation and configuration management (`pyproject.toml`: `"pydantic", "pydantic-settings"`).
- **Flet:** A cross-platform UI framework, indicated by the `[tool.flet]` section in `pyproject.toml` and the existence of a `gui` module.
- **SQLAlchemy & aiosqlite:** Used for database interaction (`pyproject.toml`: `"sqlalchemy", "aiosqlite"`).
- **Hatchling:** The build backend used for packaging (`pyproject.toml`).

## Public API / Exports
Due to the limited code provided, it's difficult to definitively list public APIs. However, `bootstrap.py` defines a function `_init_logging`, which is likely intended for internal use but demonstrates a potential entry point.  The `version.py` file exports `__version__` and `version`. The CLI script is exposed via `memento = "cli.main:memento_entry"` in `pyproject.toml`, suggesting `cli/main.py` contains the `memento_entry` function which serves as the entry point for the command-line interface.

## Dependencies
Based on `pyproject.toml`:
- typer
- rich
- pydantic
- pydantic-settings
- python-dotenv
- watchdog
- anthropic
- openai
- litellm>=1.81.10
- mcp>=1.27.0
- tiktoken>=0.7.0,<0.12.0
- httpx
- beautifulsoup4
- markdownify
- aiohttp
- requests
- aiofiles
- anyio
- pyyaml
- python-frontmatter>=1.0.0
- google_search_results
- crawl4ai
- camel-ai
- nltk
- jieba>=0.42.1
- rank-bm25
- flet==0.82.0
- platformdirs>=4.0.0
- loguru>=0.7.0
- sqlalchemy>=2.0.0
- aiosqlite>=0.19.0
- sqlite-vec>=0.1.0
- alembic>=1.12.0
- inflection>=0.5.1
- websockets>=12.0
- lark-oapi>=1.0.0



## Architecture Patterns
- **Singleton Pattern:** The `ConfigManager` and `DatabaseManager` are described as singletons in `bootstrap.py`, suggesting a global, unique instance for configuration and database management respectively.
- **Modular Design:**  The project is organized into modules like `weixin_sdk`, `media`, `messaging`, `storage`, and `auth`, indicating a modular architecture with distinct responsibilities.
- **Configuration Management:** The use of `.env` files loaded by `python-dotenv` and the `ConfigManager` class suggests a configuration management system for managing application settings.

## Relevance to SEOSONA OS
The project's capabilities in document processing (specifically .docx) and media handling could be valuable for SEOSONA OS. The integration with WeChat via `weixin_sdk` might also provide useful communication or data retrieval functionalities.  Furthermore, the skill management aspects of the system could be adapted to manage and execute tasks within a broader operating system context. The use of SQLite suggests lightweight database needs which is appropriate for embedded systems.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `rag`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
