# KI: HKUDS/OpenHarness

## Overview
OpenHarness is a Python-based CLI coding assistant, described as an open-source port of Claude Code. It appears designed to interact with AI models like Anthropic and OpenAI, providing features such as code generation and potentially automated workflows. The project includes a frontend component built using TypeScript/React for terminal interaction.

## Tech Stack (from code)
- **Language:** Python (evident from the `.py` file extensions and `pyproject.toml`)
  - File: `pyproject.toml`: `requires-python = ">=3.10"`
- **Build System:** Hatchling (defined in `pyproject.toml`)
  - File: `pyproject.toml`: `[build-system] requires = ["hatchling"]`
- **Frontend:** TypeScript/React (evident from `.tsx`, `.ts`, and `package.json` files within the `frontend/terminal` and `autopilot-dashboard` directories)
  - File: `frontend/terminal/package.json`: Contains standard React dependencies.
  - File: `autopilot-dashboard/package.json`: Contains standard React dependencies.
- **CLI Framework:** Typer (used for defining command-line interfaces).
  - File: `pyproject.toml`: `typer>=0.12.0` is listed as a dependency.

## Public API / Exports
Due to the size of the repository, identifying all public APIs definitively without executing the code is impossible. However, based on the `pyproject.toml` file and directory structure, we can identify some key entry points:

- **`openharness.cli:app`**: This appears to be the main CLI application defined in the `openharness` package.
  - File: `pyproject.toml`: `[project.scripts] openharness = "openharness.cli:app"`
- **`ohmo.cli:app`**: A separate CLI application within the `ohmo` package.
  - File: `pyproject.toml`: `[project.scripts] ohmo = "ohmo.cli:app"`

## Dependencies
The following dependencies are listed in `pyproject.toml`:

- **Core AI Models:** Anthropic, OpenAI
- **CLI & UI Tools:** Rich, Prompt Toolkit, Textual, Typer, Pydantic, httpx, Websockets, mcp, pyperclip, pyyaml, questionary, watchfiles, croniter, slack-sdk, python-telegram-bot, discord.py, lark-oapi
- **Development Dependencies:** pexpect, pytest, pytest-asyncio, pytest-cov, ruff, mypy

## Architecture Patterns
- **Modular Design:** The project is structured into several modules (`openharness`, `ohmo`, `gateway`) suggesting a modular design approach.  The `ohmo/gateway` directory indicates a potential architecture involving API gateways or service routing.
  - File: Directory structure shows distinct packages and subdirectories.
- **CLI Application with Frontend:** The project combines a Python CLI application (`openharness`, `ohmo`) with a separate frontend component (likely for terminal UI). This suggests a separation of concerns between the backend logic and user interface.
  - Files: `frontend/terminal/*` and `pyproject.toml` scripts indicate this pattern.

## Relevance to SEOSONA OS
OpenHarness's code could benefit SEOSONA OS in several ways:

- **AI Integration:** The project’s interaction with AI models (Anthropic, OpenAI) provides a foundation for integrating similar capabilities into SEOSONA OS.  The `ohmo/gateway` module might be adaptable for managing API calls to various AI services within the OS.
- **CLI Tooling:** The use of Typer demonstrates a robust approach to building CLI tools. This pattern could inform the development of new command-line utilities for SEOSONA OS.
- **Frontend UI Components:** The frontend component built with React/TypeScript offers reusable components (e.g., `components/CommandPicker`, `components/ConversationView`) that could be adapted for various user interfaces within SEOSONA OS, particularly if a terminal or code editor integration is desired.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 28}
