# KI: jacob-bd/notebooklm-mcp-cli

## Overview
This repository contains a command-line interface (CLI) and Model Context Protocol (MCP) server for Google NotebookLM, providing programmatic access to its features. The project aims to enable AI agents and developers to interact with NotebookLM notebooks, sources, and generated artifacts.  The CLI provides commands for various tasks like downloading, exporting, and managing notebooks.

## Tech Stack (from code)
- **Language:** Python 3.11+ (as specified in `pyproject.toml`: `requires-python = ">=3.11"`)
- **Build System:** Hatchling (`pyproject.toml`: `[build-system] requires = ["hatchling"] build-backend = "hatchling.build"`)
- **Frameworks/Libraries:** Typer (for CLI), httpx, pydantic, rich, websocket-client, fastmcp, pyyaml, pytest (for testing) - evident from `pyproject.toml`'s dependencies section.

## Public API / Exports
Based on the structure of `src/notebooklm_tools/cli/main.py`, the CLI exposes a command-line interface with subcommands.  The `nlm` script is defined as `notebooklm_tools.cli.main:cli_main` in `pyproject.toml`. The MCP server exposes an HTTP endpoint, configurable via `--transport http --port 8000` (as shown in the CLAUDE.md file).  Specific exported functions and classes within the core libraries are not readily apparent without deeper inspection of the source code.

## Dependencies
From `pyproject.toml`:
- httpx[socks]>=0.27.0,<1.0
- pydantic>=2.0.0,<3.0
- typer>=0.9.0,<1.0
- rich>=13.0.0,<15.0
- websocket-client>=1.6.0,<2.0
- platformdirs>=4.0.0,<5.0
- fastmcp>=2.0.0,<4.0
- pyyaml>=6.0,<7.0
- typing_extensions>=4.4.0; python_version < '3.12'
- pytest>=8.0.0 (dev dependency)
- pytest-asyncio>=0.23.0 (dev dependency)
- ruff>=0.1.0 (dev dependency)
- mypy>=1.0.0 (dev dependency)

## Architecture Patterns
- **Modular Design:** The codebase is structured into modules (`src/notebooklm_tools/cli`, `src/notebooklm_tools/core`, `src/notebooklm_tools/mcp`) suggesting a modular design with distinct responsibilities.
- **CLI Command Structure:**  The CLI utilizes Typer, which enforces a command structure with subcommands (e.g., `nlm download`, `nlm export`). This promotes discoverability and organization of commands.
- **Configuration Management:** The project uses environment variables (`NOTEBOOKLM_COOKIES`, etc.) for configuration, allowing customization without modifying code.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Integration with AI Services:**  The MCP server and CLI provide a framework for interacting with NotebookLM, which can be leveraged to integrate AI capabilities into SEOSONA OS.
- **CLI Development Patterns:** The Typer-based CLI demonstrates good practices for building command-line tools that could be adopted in other SEOSONA OS components.
- **Dependency Management:**  The use of Hatchling and a well-defined dependency list provides a model for managing dependencies within SEOSONA OS projects, ensuring reproducibility and consistency.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 56}
