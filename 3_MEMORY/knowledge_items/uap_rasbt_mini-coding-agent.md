# KI: rasbt/mini-coding-agent

## Overview
This project, "mini-coding-agent-ollama," aims to create a minimal standalone coding agent powered by Ollama. The core functionality involves managing a workspace context, shaping prompts, and providing tools for code manipulation, all while maintaining session history and memory.  The agent appears designed to be interactive, with commands like `/help`, `/memory`, and `/exit`.

## Tech Stack (from code)
- **Language:** Python 3.10+ (`pyproject.toml`: `requires-python = ">=3.10"`)
- **Build System:** Setuptools (`pyproject.toml`: `build-backend = "setuptools.build_meta"`)
- **Dependency Management:** Poetry (`pyproject.toml` contains a `[project]` and `[tool.setuptools]` section, characteristic of Poetry projects)

## Public API / Exports
Based on the provided code snippet from `mini_coding_agent.py`, the following functions/classes are defined:

- `now()`:  Returns an ISO formatted timestamp.
- `clip(text, limit)`: Truncates text if it exceeds a given length.
- `middle(text, limit)`: Returns the middle portion of a string with ellipsis padding.
- `WorkspaceContext`: A class representing the workspace context. It has attributes like `cwd`, `repo_root`, `branch`, etc.

## Dependencies
The following dependencies are listed in `pyproject.toml`:

- `pytest` (>=9.0.2) - Listed under `dependencies`.
- `pytest` (>=8.3.5) - Listed under `dev` dependency group.
- `ruff` (>=0.4.4) - Listed under `dev` dependency group.

## Architecture Patterns
- **Modular Design:** The code explicitly outlines six "agent components" with clear responsibilities: Live Repo Context, Prompt Shaping, Tools Management, Context Reduction, Transcripts/Memory, and Delegation. This suggests a modular architecture where each component can be developed and potentially modified independently.  The comments `#### Six Agent Components ####` and the subsequent sectioning highlight this design intention.
- **Context Object:** The `WorkspaceContext` class encapsulates information about the workspace, demonstrating the use of context objects to manage state.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Code Generation/Automation:**  The core functionality of a coding agent aligns with potential automation tasks within SEOSONA OS, such as generating boilerplate code or automating repetitive development workflows.
- **Modular Design Principles:** The modular design approach used in the mini-coding-agent can serve as an example for structuring other components within SEOSONA OS to improve maintainability and scalability.
- **Context Management:**  The `WorkspaceContext` class provides a pattern for managing context information that could be adapted for various tasks within SEOSONA OS, such as tracking user sessions or project states.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `agent`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
