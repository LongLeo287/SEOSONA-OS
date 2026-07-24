# KI: mksglu/context-mode

## Overview
This repository contains a plugin for managing context windows, primarily aimed at large language models like Claude and Gemini. The plugin focuses on saving context window space by indexing data, executing code in a sandbox, and providing search capabilities. It appears to be designed to work with multiple platforms including Claude Code, Gemini CLI, VS Code Copilot, OpenCode, and Codex CLI.

## Tech Stack (from code)
- **Languages:** TypeScript (`tsconfig.json`: `{"include": ["src"]}`), JavaScript (multiple `.mjs` files).
- **Frameworks/Libraries:**  `better-sqlite3`, `@modelcontextprotocol/sdk`, `zod`. This is evidenced by imports in various source files like `src/db-base.ts` and `src/store.ts`.
- **Build System:** Vite (`vitest.config.ts`: `import { defineConfig } from "vitest/config";`),  TypeScript compiler (referenced in `package.json`'s build script).
- **Module Bundler:** Rollup (implied by the use of `.bundle.mjs` files and scripts that generate them).

## Public API / Exports
Based on the `exports` section of `package.json`, the following are exported:
- `"."`: `./build/adapters/opencode/plugin.js` - The main plugin entry point.
- `"./plugin"`: `./build/adapters/opencode/plugin.js` -  Another entry point for the plugin.
- `"./openclaw"`: `./build/adapters/openclaw/plugin.js` - Entry point specifically for OpenClaw integration.
- `"./cli"`: `./cli.bundle.mjs` - The command-line interface bundle.

## Dependencies
Based on `package.json`:
- `@clack/prompts`
- `better-sqlite3`
- `picocolors`
- `node:child_process` (and other built-in Node modules)
- `zod`
- `@modelcontextprotocol/sdk`

## Architecture Patterns
- **Plugin Architecture:** The project is structured as a plugin, with adapters for different platforms (Claude Code, Gemini CLI, etc.). This is evident in the directory structure (`.claude-plugin`, `.codex-plugin`, `.openclaw-plugin`) and the `package.json`'s `exports`.
- **Sandboxed Execution:** The code heavily emphasizes sandboxed execution of user-provided code using `ctx_execute` functions (seen in `CLAUDE.md`). This suggests a security-focused design.
- **FTS5 Indexing:**  The project utilizes SQLite’s FTS5 full-text search engine for indexing and searching content, as mentioned in the description and various source files (`src/store.ts`, `src/db-base.ts`).
- **Configuration Driven:** The plugin uses configuration files (e.g., `mcp_config.json`) to customize behavior, indicating a flexible design.

## Relevance to SEOSONA OS
The context-mode project's code could benefit SEOSONA OS in the following ways:
- **Sandboxed Code Execution:**  The sandboxing techniques used for executing user code could be adapted to create secure environments for running untrusted scripts within SEOSONA OS.
- **FTS5 Indexing and Search:** The FTS5 indexing implementation can be leveraged to build efficient search capabilities for various data sources within the operating system, improving information retrieval.
- **Plugin Architecture:**  The plugin architecture could serve as a model for extending SEOSONA OS functionality with modular components that integrate seamlessly into the core system.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
