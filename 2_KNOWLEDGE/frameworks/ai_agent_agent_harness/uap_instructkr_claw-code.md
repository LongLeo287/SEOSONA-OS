# KI: instructkr/claw-code

## Overview
This project appears to be a Python porting workspace for the Claude Code rewrite effort, focusing on migrating functionality and creating a command-line interface (CLI). The codebase includes components for managing sessions, executing commands, auditing parity between different codebases, and building manifests.  It leverages Rust for core logic and utilizes Docker containers for development and deployment.

## Tech Stack (from code)
- **Language:** Python (`src/main.py`, `src/__init__.py`)
- **Framework:** No explicit framework is detected in the source code. The project uses standard Python libraries and modules.
- **Build System:** Docker, as defined by the `docker-compose.yml` file.  The Rust workspace utilizes Cargo (`rust/Cargo.toml`).

## Public API / Exports
Based on `src/__init__.py`, the following are exported:
- `ParityAuditResult` (dataclass)
- `PortManifest` (dataclass)
- `PortRuntime` (dataclass)
- `QueryEnginePort` (dataclass)
- `RuntimeSession` (dataclass)
- `StoredSession` (dataclass)
- `TurnResult` (dataclass)
- `PORTED_COMMANDS` (tuple of PortingModule objects)
- `PORTED_TOOLS` (tuple of PortingModule objects)
- `build_command_backlog` (function)
- `build_port_manifest` (function)
- `build_system_init_message` (function)
- `build_tool_backlog` (function)
- `load_session` (function)
- `run_parity_audit` (function)
- `save_session` (function)

## Dependencies
The dependencies are primarily managed within the Rust workspace (`rust/Cargo.toml`) and Docker environment (`docker-compose.yml`).  Specific Python dependencies are not explicitly listed in a requirements file, but the `docker-compose.yml` suggests usage of Qdrant.

## Architecture Patterns
- **Modular Design:** The codebase is structured into modules (e.g., `commands`, `tools`, `runtime`) with clear responsibilities.
- **Data Class Heavy:**  Extensive use of Python dataclasses (`@dataclass`) for defining data structures and immutable objects, promoting code clarity and conciseness.
- **Configuration Driven:** The project uses configuration files like `.claude.json` and Docker environment variables to manage settings and behavior.
- **Archive/Snapshot Pattern**:  The `src\_archive_helper.py` file and references to snapshot data suggest a pattern of comparing the current state against archived versions for parity checks or historical analysis.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **CLI Development:** The CLI structure and command processing logic within `src/commands.py` and related files can be adapted for building custom tools and interfaces for SEOSONA OS.
- **Session Management:**  The session management components (`src/session_store.py`, `src/runtime.py`) could provide a foundation for managing user sessions or persistent state within the operating system.
- **Parity Auditing:** The parity auditing framework (`src/parity_audit.py`) can be used to ensure consistency and compatibility between different SEOSONA OS components or versions.
- **Docker Integration:**  The Docker setup demonstrates containerization best practices that could be applied to package and deploy SEOSONA OS services.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `openai`, `anthropic`, `rag`
- **All scores:** {'seosona-os': 61, 'seosona-video': 22, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
