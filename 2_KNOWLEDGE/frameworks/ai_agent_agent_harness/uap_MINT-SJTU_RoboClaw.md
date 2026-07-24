# KI: MINT-SJTU/RoboClaw

## Overview
RoboClaw is a lightweight personal AI assistant framework designed for agent orchestration and task automation. The codebase demonstrates an emphasis on modularity, with components for communication channels (e.g., Slack, Telegram), data handling, and embodied agents interacting with hardware.  The project utilizes Python alongside Node.js for specific functionalities like the WhatsApp bridge.

## Tech Stack (from code)
- **Python:** Primary language, evidenced by 189 `.py` files (e.g., `roboclaw/agent/__init__.py`, `roboclaw/bus/events.py`).
- **Node.js/TypeScript:** Used for the WhatsApp bridge component, as indicated by `bridge/package.json` and `bridge/tsconfig.json`.  The `Dockerfile` explicitly installs Node.js.
- **FastAPI:** Listed as a dependency in `pyproject.toml`, suggesting its use for building APIs (`dependencies = ["fastapi>=0.115.0,<1.0.0"]`).
- **uv**: Used as the build system, specified in `pyproject.toml` (`[build-system] requires = ["hatchling"]`) and used to install dependencies (`RUN uv pip install --system --no-cache .`).

## Public API / Exports
Due to the scope of analysis (321 files), a comprehensive list is impractical. However, some notable exports can be identified:
- `roboclaw.cli.commands`:  The entry point for the CLI application, specified in `pyproject.toml` (`[project.scripts] roboclaw = "roboclaw.cli.commands:app"`). This suggests an exposed command-line interface.
- Modules within `roboclaw/channels/*`: These modules (e.g., `roboclaw/channels/slack.py`, `roboclaw/channels/telegram.py`) likely expose classes or functions for interacting with respective messaging platforms.  The existence of a `registry.py` in each channel directory suggests a registration mechanism for these channels.
- Modules within `roboclaw/agent/*`: These modules (e.g., `roboclaw/agent/context.py`, `roboclaw/agent/loop.py`) likely expose classes or functions related to agent lifecycle and execution.

## Dependencies
Based on `pyproject.toml`:
- `typer`
- `litellm`
- `pydantic` & `pydantic-settings`
- `websockets` & `websocket-client`
- `httpx`
- `ddgs`
- `oauth-cli-kit`
- `loguru`
- `readability-lxml`
- `rich`
- `croniter`
- `dingtalk-stream`
- `python-telegram-bot`
- `lark-oapi`
- `socksio` & `python-socketio`
- `msgpack`
- `slack-sdk` & `slackify-markdown`
- `qq-botpy`
- `python-socks`
- `prompt-toolkit`
- `mcp`
- `json-repair`
- `chardet`
- `openai` & `tiktoken`
- `uvicorn`
- `lerobot`
- `pyserial`

## Architecture Patterns
- **Modular Design:** The codebase is heavily organized into modules (e.g., `agent`, `bus`, `channels`, `config`) indicating a modular architecture.  Each module appears to have its own `__init__.py` file, signifying Python packages.
- **Plugin/Registry Pattern:** The presence of "registry" files within the channels directory (`roboclaw/channels/*/registry.py`) suggests a plugin or registration pattern for integrating different communication channels.
- **Embodied Agent Architecture:**  The `roboclaw/embodied/` directory indicates an architecture focused on embodied agents, with subdirectories like `board`, `calibration`, and `command`. This implies interaction with physical hardware.

## Relevance to SEOSONA OS
- **Agent Orchestration Framework:** RoboClaw's agent framework could be adapted for managing tasks within SEOSONA OS, providing a structured way to define and execute automated processes.
- **Communication Channel Integration:** The existing channel integrations (Slack, Telegram, etc.) can serve as a foundation for integrating SEOSONA OS with various communication platforms.  The registry pattern would allow easy addition of new channels.
- **Hardware Interaction Abstraction:** The embodied agent architecture and `lerobot` dependency suggest potential for abstracting hardware interactions within SEOSONA OS, enabling modular control of physical devices.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 0}
