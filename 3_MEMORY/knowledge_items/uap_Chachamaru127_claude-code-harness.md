# KI: Chachamaru127/claude-code-harness

## Overview
This repository, `Chachamaru127/claude-code-harness`, contains the source code for a plugin designed to facilitate autonomous operation of Claude Code in a "Plan → Work → Review" workflow. The project aims to enable solo developers ("Vibecoders") to handle full-cycle contract development using Claude and related tools.  The system incorporates safety checks, review processes (including Codex integration), and breezing agents for parallel task execution.

## Tech Stack (from code)
- **Go:** The `go/` directory contains a significant portion of the codebase, indicating Go is used for core engine functionality. (`go.work` file exists).
- **TypeScript:**  The `src/` directory suggests TypeScript is used for implementation logic.
- **JSON:** Configuration files like `.claude-code-harness.config.yaml`, `.claude-plugin/hooks.json`, and various plugin manifests utilize JSON format.
- **Bash:** Shell scripts are present in the `scripts/` and `.githooks/` directories, indicating Bash is used for automation tasks. (`.sh` files)
- **TOML:** The `harness.toml` file indicates TOML is used for project configuration.

## Public API / Exports
Due to the nature of this repository (a plugin), identifying a clear public API from source code alone is difficult. However, based on the `.claude-plugin/hooks.json` and `.codex/hooks.json` files, it appears that hooks are exposed for interaction with Claude Code.  The `hosts.toml` file also suggests an API for interacting with different agents (Claude, Codex, Cursor). The specific exported functions or endpoints within the TypeScript code in `src/` cannot be determined without further analysis of compiled artifacts.

## Dependencies
Dependencies are not explicitly listed in a single file. However, based on the presence of `package.json` and related scripts, we can infer dependencies:

- **npm:**  The existence of `package.json` implies usage of npm for JavaScript package management. (No content provided)
- **Go Modules:** The `go.work` file indicates Go modules are used for dependency management in the Go code. (No content provided)

## Architecture Patterns
- **Plugin Architecture:** The project is structured as a plugin, with manifest files (`.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`) defining its capabilities and integration points.
- **Agent-Based Workflow:**  The "Plan → Work → Review" workflow suggests an agent-based architecture where different agents handle specific tasks within the development process. The `agents/` directory contains definitions for advisor, reviewer, and worker agents.
- **Configuration-Driven:**  The use of configuration files (`.claude-code-harness.config.yaml`, `harness.toml`) indicates a design that allows customization through external configuration rather than hardcoded behavior.
- **Layered Architecture**: The project appears to have layers such as "app", "frontend" and "go/native engine".

## Relevance to SEOSONA OS
The Claude Code Harness's architecture, particularly its plugin structure and agent-based workflow, could be beneficial for SEOSONA OS.  Specifically:

- **Extensibility:** The plugin design allows integration with SEOSONA OS as a modular component, extending its capabilities without modifying core system code.
- **Automation:** The automated "Plan → Work → Review" process can be adapted to automate various tasks within the SEOSONA OS development lifecycle.
- **Customization:**  The configuration-driven nature of the harness allows tailoring its behavior to meet specific requirements and workflows within SEOSONA OS.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
