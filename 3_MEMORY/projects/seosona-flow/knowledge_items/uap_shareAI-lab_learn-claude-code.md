# KI: shareAI-lab/learn-claude-code

This repository provides a series of harness implementations and examples for interacting with large language models, specifically Claude, focusing on agent capabilities like tool use, task management, and autonomous operation. The code demonstrates how to build agents that can execute commands, manage tasks, and communicate with other agents in a team setting.  The project aims to teach users how to construct complex AI agents using Python and the Anthropic API.

## Tech Stack (from code)

*   **Language:** Python 3 (shebang lines: `#!/usr/bin/env python3` found throughout, e.g., in `agents/s01_agent_loop.py`)
*   **Libraries:**  Anthropic SDK (`anthropic`), `dotenv`, `subprocess`, `threading`, `json`, `yaml`. These are imported in various files (e.g., `agents/s01_agent_loop.py`: `from anthropic import Anthropic`).
*   **Build System:** No explicit build system is defined in the code provided.  The presence of a `requirements.txt` file suggests that pip is used for dependency management.

## Public API / Exports

Due to the nature of the project as a collection of harness scripts, there's no formal public API. However, each script within the `agents/` directory is designed to be runnable directly:  `# Each file is self-contained and runnable: python agents/s01_agent_loop.py` (from `agents/__init__.py`).

Functions like `run_bash`, `run_read`, `run_write` are defined within the agent scripts, but these aren't intended as a public API; they are internal to the agent's operation.  The `TaskManager` class in `agents/s07_task_system.py` provides methods for creating and managing tasks, but this is part of the internal implementation rather than an exported API.

## Dependencies

From `requirements.txt`:

*   `anthropic>=0.25.0`
*   `python-dotenv>=1.0.0`
*   `pyyaml>=6.0`

## Architecture Patterns

*   **Agent Loop:** The core agent logic follows a consistent loop pattern: receive input, interact with tools, and provide output (e.g., `agents/s01_agent_loop.py`).
*   **Tool-Based Interaction:** Agents interact with the environment through defined tools, promoting modularity and control (e.g., `agents/s02_tool_use.py`).
*   **Task Management:**  Tasks are managed as JSON files in a dedicated directory (`.tasks`), enabling persistence and coordination between agents (e.g., `agents/s07_task_system.py`).
*   **Background Processing:** Long-running operations are executed in background threads to avoid blocking the main agent loop (e.g., `agents/s08_background_tasks.py`).
*   **Team Communication:** Agents communicate through message queues, facilitating collaboration and coordination within a team (e.g., `agents/s09_agent_teams.py`).
*   **Context Compression:** Mechanisms are implemented to compress the agent's context over time, preventing memory exhaustion during long sessions (e.g., `agents/s06_context_compact.py`).

## Relevance to SEOSONA OS

This project’s code could benefit SEOSONA OS in several ways:

*   **Autonomous Task Execution:** The task management and background processing components (`agents/s07_task_system.py`, `agents/s08_background_tasks.py`) can be adapted to automate repetitive tasks within the OS, improving efficiency.
*   **Agent-Based Automation:**  The agent loop pattern and tool interaction framework provide a foundation for building specialized agents that can perform specific system administration or user support functions.
*   **Team Collaboration:** The team communication mechanisms (`agents/s09_agent_teams.py`) could be leveraged to enable distributed OS components to collaborate on complex tasks.
*   **Context Management:**  The context compression techniques (`agents/s06_context_compact.py`) are valuable for managing the state of long-running processes within the OS, preventing memory leaks and ensuring stability.
*   **Secure Tool Execution:** The `run_bash` function includes safety checks to prevent dangerous commands from being executed, which is crucial for security in an operating system environment.  This could be adapted for a more robust sandboxing approach.

## UAP Routing (auto-classified)
- **System:** `seosona-flow` · **Function:** `workflow-automation` · **Fit:** 56/100 · **Auto-apply:** True
- **Evidence:** `dag`, `pipeline`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 56}
