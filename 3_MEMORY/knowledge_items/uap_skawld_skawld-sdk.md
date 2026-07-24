# KI: skawld/skawld-sdk

## Overview
This repository contains a TypeScript SDK for building agents, specifically designed for software engineering tasks. The SDK provides tools and infrastructure for managing sessions, interacting with language models (LLMs), and orchestrating agent behavior. It appears to be built around the concept of modularity, allowing for custom providers, skills, and subagents.

## Tech Stack (from code)
- **Language:** TypeScript (`src/**/*.ts` files throughout the codebase).
- **Build System:** Bun (`package.json`: `"build": "bun run clean && bun run gen:version && bun run build:js && bun run build:types"`) and `tsconfig.json`.
- **Framework/Libraries:**  The project utilizes libraries like `@anthropic-ai/sdk`, OpenAI's SDK, `better-sqlite3`, and `fast-glob` (from `package.json`).

## Public API / Exports
Based on the `src/core/index.ts` file:
- `Agent`: A core class for managing agent execution (`src/core/agent.ts`).
- `Session`:  A class representing an agent session (`src/core/session.ts`).
- `CompactionStrategy`, `defaultCompaction`: Related to message compaction within sessions (`src/core/compaction.ts`).
- Types: Various types related to agents, sessions, and tools are exported (`src/core/types.js`).
- Events:  Event types emitted during agent execution (`src/core/events.js`).
- Errors: Custom error classes for handling specific scenarios (`src/core/errors.js`).

The `package.json` also defines exports for modules like providers, tools, sessions and permissions. For example: `"./providers": { "types": "./dist/providers/index.d.ts", "import": "./dist/providers/index.js" }`.

## Dependencies
Based on the `package.json`:
- `@anthropic-ai/sdk`:  SDK for interacting with Anthropic's models (`^0.40.0`).
- `@modelcontextprotocol/sdk`: SDK for Model Context Protocol (`^1.29.0`).
- `better-sqlite3`: SQLite database driver (`^11.0.0`).
- `fast-glob`:  Fast globbing library (`^3.3.0`).
- `ignore`:  Ignore file pattern matcher (`^7.0.0`).
- `openai`: OpenAI's SDK (`^5.0.0`).
- `picomatch`: Picosecond match for JavaScript regular expressions (`^4.0.0`).
- `tree-kill`:  Tree killing utility (`1.2.2`).
- `yaml`: YAML parsing library (`^2`).

## Architecture Patterns
- **Modular Design:** The SDK is structured into modules (providers, sessions, skills, tools) with clear separation of concerns.
- **Plugin/Extension Points:** The architecture seems to allow for extending functionality through custom providers and skills.
- **Event-Driven:**  The agent's lifecycle appears to be driven by events (`events.ts`), allowing for hooks and interception points.
- **Configuration-driven**: The SDK uses configuration files (e.g., `tsconfig.json`, `package.json`) to define build settings, dependencies, and exports.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Agent Framework:**  The agent framework provides a foundation for building intelligent agents that can automate tasks within SEOSONA OS.
- **LLM Integration:** The SDK’s integration with LLMs like Anthropic and OpenAI could be leveraged to enhance SEOSONA OS's natural language processing capabilities.
- **Skill System:** The skill system allows for extending SEOSONA OS functionality through custom tools and integrations, enabling automation of specific workflows.
- **Modular Design:**  The modular design promotes code reusability and maintainability within the SEOSONA OS ecosystem.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
