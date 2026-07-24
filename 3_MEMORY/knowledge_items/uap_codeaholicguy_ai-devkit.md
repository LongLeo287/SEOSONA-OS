# KI: codeaholicguy/ai-devkit

## Overview
This repository, `ai-devkit`, provides a command-line interface and supporting libraries for developing AI coding agents. It focuses on establishing repeatable engineering workflows with features like memory management, verification, skills, and multi-agent setup. The project aims to simplify the creation and management of AI agents interacting with various platforms.

## Tech Stack (from code)
- **TypeScript:**  The primary language is TypeScript as evidenced by numerous `.ts` and `.tsx` files throughout the repository (e.g., `packages\agent-manager\src\index.ts`).
- **Node.js:** The project uses Node.js, confirmed by the `engines` field in `package.json`: `"engines": { "node": ">=20.20.0" }`.
- **Nx:**  The project utilizes Nx as a build system and monorepo tool, indicated by the presence of `nx.json` at the root and references to `nx run-many` in `package.json` scripts.
- **SWC:** SWC (Speedy Web Compiler) is used for compiling TypeScript code, seen in various `package.json` files within packages (e.g., `packages\agent-manager\package.json`: `"build": "swc src -d dist --strip-leading-paths && tsc --emitDeclarationOnly"`).
- **Vitest:** Vitest is used for testing, as shown in the `test` scripts of several packages (e.g., `packages\agent-manager\package.json`: `"test": "vitest run"`).
- **React:** React is a dependency and appears to be used within some components (`packages/task-manager/package.json`).

## Public API / Exports
Based on the `index.ts` files in several packages, here are some exported items:

*   **`packages\agent-manager\src\index.ts`**:  Exports classes like `AgentManager`, and adapters for ClaudeCodeAdapter, CodexAdapter, CopilotAdapter, GeminiCliAdapter, GrokCliAdapter, OpenCodeAdapter, PiAdapter.
*   **`packages\channel-connector\src\index.ts`**: Exports the `ChannelManager` class and related types.
*   **`packages\cli\src\index.ts`**:  Exports `ConfigManager` and `TemplateManager`.
*   **`packages\memory\src\index.ts`**: Exports functions for interacting with a database, including `runServer`.
*   **`packages\memory-dashboard\src\index.ts`**: Exports the `register` function.
*   **`packages\task-manager\src\index.ts`**:  Exports types and classes related to task management, including `TaskRepository`, `TaskService`, and various Task-related data structures.

## Dependencies
Based on `package.json`:

*   `@nx/js`: Version 22.4.0 (Nx tooling)
*   `husky`: Version 9.1.7 (Git hooks)
*   `vitest`: Version 4.1.8 (Testing framework)
*   `better-sqlite3`: Version 12.11.1 (SQLite database driver - used in multiple packages)
*   `uuid`: Version 14.0.0 (UUID generation library)
*   `marked`:  Version 15.0.12 (Markdown parser, used by `channel-connector`)
*   `telegraf`: Version 4.16.3 (Telegram bot framework, used by `channel-connector`)

## Architecture Patterns
- **Monorepo:** The project is structured as a monorepo using Nx workspaces (`workspaces` field in `package.json`). This allows for code sharing and coordinated development across multiple packages.
- **Plugin/Adapter Pattern:**  The agent manager uses an adapter pattern, with classes like `ClaudeCodeAdapter`, `CodexAdapter`, etc., suggesting a plugin architecture for supporting different AI models or services.
- **Modular Design:** The project is broken down into distinct packages (e.g., `agent-manager`, `channel-connector`, `memory`), each responsible for specific functionality, promoting modularity and reusability.

## Relevance to SEOSONA OS
The `ai-devkit`'s focus on agent management, memory, and task tracking could be beneficial to SEOSONA OS in several ways:

*   **AI Agent Integration:** The adapter pattern allows for easy integration of AI agents into the SEOSONA OS ecosystem.  Adapters can be created to interface with specific AI services or models used by SEOSONA OS.
*   **Memory Management:** The memory management capabilities could be leveraged to store and retrieve context-specific information, improving the efficiency and effectiveness of various SEOSONA OS components.
*   **Task Automation:** The task manager provides a framework for automating repetitive tasks within SEOSONA OS, potentially streamlining workflows and reducing manual intervention.
*   **CLI Tooling:**  The CLI tools could be adapted to provide convenient interfaces for managing AI agents, memory stores, and other related resources within the SEOSONA OS environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 28, 'seosona-flow': 28}
