# KI: ooples/token-optimizer-mcp

## Overview
This repository contains a tool designed for optimizing context windows, specifically targeting Claude Code models. It aims to reduce the token count within prompts by employing techniques like caching and compression, allowing more content to be processed within the available context window. The project provides both a server component and command-line interface (CLI) tools for managing this optimization process.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json` includes `*.ts` files).
- **Framework:**  Node.js (evident from `package.json`, `cli-wrapper.mjs`, and numerous `.js`/`.cjs` files).
- **Build System:**  TypeScript compiler (`tsc` in `package.json` scripts, `tsconfig.json`).
- **Linting/Formatting:** ESLint (`.eslintrc.json`, `eslint.config.js`) and Prettier (`.prettierrc`).

## Public API / Exports
Based on the `bin` section of `package.json`, the following commands are exposed:
- `token-optimizer-mcp`:  Likely the primary server component. (File path: `dist/server/index.js`)
- `token-optimizer-daemon`: A daemon process for context optimization. (File path: `dist/server/daemon.js`)

The code also exposes several tools via CLI, as evidenced by files in the `src/tools` directory and their usage within scripts like `install-hooks.ps1`. Examples include:
- `ContextDeltaTool`:  Calculates context deltas for file changes. (File path: `src/tools/context-delta-tool.ts`)
- `OptimizationStorageTool`: Stores and retrieves optimization results. (File path: `src/tools/optimization-storage-tool.ts`)

## Dependencies
Based on the `package.json` file, key dependencies include:
- `@typescript-eslint/eslint-plugin`: For TypeScript linting.
- `@typescript-eslint/parser`:  For parsing TypeScript code.
- `better-sqlite3`:  For database interactions (File path: `src/core/cache-engine.ts`).
- `lru-cache`: For in-memory caching (`src/core/cache-engine.ts`).
- `zod`: For schema validation (`src/core/config.ts`).
- `tiktoken`:  For token counting (File path: `src/core/token-counter.ts`).

## Architecture Patterns
- **Modular Design:** The codebase is structured into modules like `analysis`, `analytics`, `core`, `dashboard`, and `tools`, suggesting a modular architecture.
- **Plugin System (Tokenizers & Summarizers):**  The `TokenCounter` and the optimization pipeline utilize interfaces (`ITokenizer`, `ISummarizer`) to allow for pluggable implementations, promoting flexibility and extensibility. This is evident in files like `src/core/token-counter.ts` and `src/services/MarkerBasedOptimizer.ts`.
- **Configuration-Driven:**  The system relies heavily on configuration files (`config.ts`, `tsconfig.json`) to control behavior and parameters, enabling customization without code changes.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Context Window Optimization:** The token optimization techniques can be integrated into SEOSONA OS to improve efficiency when interacting with large language models (LLMs), reducing costs and latency.
- **File Change Tracking:**  The `ContextDeltaTool`'s ability to calculate deltas for file changes could be adapted to track modifications in SEOSONA OS’s data stores, enabling more efficient updates and synchronization.
- **Modular Design Principles:** The modular architecture of the project provides a good example of how to structure complex systems with clear separation of concerns, which can inform the design of new components within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `llm`, `embedding`, `rag`, `vector`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 0}
