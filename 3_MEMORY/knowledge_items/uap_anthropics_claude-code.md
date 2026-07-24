# KI: anthropics/claude-code

## Overview
This repository appears to be a development platform for "Claude Code," an AI coding assistant, likely focused on plugin and agent development. The codebase contains numerous `.md` files describing commands, agents, and skills, alongside Python (`.py`) and JSON configuration files that define the functionality of these components.  The project emphasizes extensibility through plugins and provides tools for developing and testing them.

## Tech Stack (from code)
- **Python:** Numerous `.py` files exist within the `hookify/core` directory (e.g., `config_loader.py`, `rule_engine.py`). This indicates Python is a core language used in the project.
- **JSON:**  Extensive use of `.json` files throughout the repository, particularly within plugin directories (`.claude-plugin/plugin.json`), hooks (`hooks.json`), and configuration (`hooks-handlers/session-start.sh`) suggests JSON is heavily utilized for configuration and data serialization.
- **PowerShell:** The `Script/run_devcontainer_claude_code.ps1` file indicates the use of PowerShell, likely for development environment setup or automation tasks.

## Public API / Exports
Due to the nature of this repository as a development platform rather than a standalone application, identifying a clear public API is difficult based solely on code inspection. However, within the `hookify/core` directory, several Python files suggest internal APIs:
- `config_loader.py`:  Likely contains functions for loading and managing configuration data. While specific function names are not visible without further analysis, its existence implies an API for accessing configurations.
- `rule_engine.py`: Suggests a rule engine with potentially exposed methods or classes for defining and executing rules.

## Dependencies
Dependencies cannot be definitively determined from the provided file listing alone.  The presence of `.json` files like `marketplace.json` and plugin configuration files suggests dependencies on external services or libraries, but without package manifests (e.g., `package.json`, `requirements.txt`), these are speculative.

## Architecture Patterns
- **Plugin-Based Architecture:** The directory structure heavily emphasizes plugins.  Each feature area (`code-review`, `commit-commands`, `hookify`, etc.) contains a `.claude-plugin/plugin.json` file, indicating a modular design where functionality is encapsulated within reusable plugin components.
- **Agent and Skill Framework:** The presence of "agents" (e.g., in `feature-dev/agents`) and "skills" (e.g., in `plugins/claude-opus-4-5-migration/skills`) suggests a framework for defining AI agents with specific capabilities, which are then composed into skills to perform tasks.
- **Hook-Based System:** The `hookify` directory contains files like `posttooluse.py`, `pretooluse.py`, and `userpromptsubmit.py`, indicating a system where code can be executed at various points in the workflow (e.g., before or after using a tool, upon user prompt submission).

## Relevance to SEOSONA OS
The plugin-based architecture and agent/skill framework within this repository could be beneficial for SEOSONA OS:
- **Extensible Functionality:** The plugin system allows for easy integration of new features and capabilities into SEOSONA OS without modifying core components.  This aligns with a modular design principle.
- **Customizable AI Agents:** The agent and skill framework provides a foundation for building custom AI agents tailored to specific tasks within the SEOSONA OS environment, enhancing automation and intelligence.
- **Hook System for Workflow Integration:** The hook system allows for seamless integration of code into existing workflows within SEOSONA OS, enabling automated actions based on events or user interactions.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
