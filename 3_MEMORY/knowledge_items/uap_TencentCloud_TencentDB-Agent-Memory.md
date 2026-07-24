# KI: TencentCloud/TencentDB-Agent-Memory

## Overview
This project, `@tencentdb-agent-memory/memory-tencentdb`, implements a four-layer local memory system plugin for OpenClaw. It focuses on automatically capturing conversations, structuring them into memories using an LLM, and managing personas to enhance conversational context. The core functionality revolves around building a pipeline (L0→L1→L2→L3) for processing conversational knowledge locally without external API dependencies.

## Tech Stack (from code)
- **Language:** TypeScript (`index.ts`, `src/config.ts`)
- **Framework:**  Utilizes OpenClaw plugin SDK (`import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";`).
- **Build System:** tsdown (`"build:plugin": "tsdown"` in package.json), TypeScript compiler (`tsc` in `package.json`)
- **Testing Framework:** Vitest (`vitest.config.ts`, `vitest.e2e.config.ts`)

## Public API / Exports
Based on the `index.ts` file, the following are exported:

- `Logger`: An interface for logging functionality.
- `RuntimeContext`:  An interface defining runtime context information.
- `LLMRunParams`, `LLMRunner`, `LLMRunnerCreateOptions`, `LLMRunnerFactory`: Types and interfaces related to LLM execution.
- `HostAdapter`: An abstract class representing a host adapter.
- `TdaiCore`: The core service facade for the memory system.
- `TdaiCoreOptions`: Options for configuring the TdaiCore.

## Dependencies
Based on `package.json`, key dependencies include:

- `"openclaw"`:  The OpenClaw plugin SDK.
- `"tsdown"`: A TypeScript build tool.
- `"vitest"`: A testing framework.
- Node.js builtins (e.g., `node:path`, `node:module`)

## Architecture Patterns
- **Plugin Architecture:** The project is designed as an OpenClaw plugin, adhering to a plugin SDK.  This is evident from the import of `OpenClawPluginApi`.
- **Modular Design:** Code is organized into modules like `src/core`, `src/adapters`, and `scripts` for distinct functionalities (core logic, host interaction, utility scripts).
- **Abstracted Host Interaction:** The use of a `HostAdapter` interface suggests an abstraction layer to allow the core memory logic (`TdaiCore`) to be independent of the specific host environment.
- **Pipeline Pattern:**  The system implements a pipeline (L0→L1→L2→L3) for processing conversational data, with dedicated components and runners for each stage.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **Local LLM Integration:** The focus on local LLM usage aligns with a potential goal of running AI models offline within SEOSONA OS, reducing reliance on external services and improving privacy.
- **Conversational Memory Management:**  The memory pipeline (L0→L1→L2→L3) provides a framework for managing conversational context, which could be valuable for enhancing user interactions within the OS.
- **Plugin Architecture:** The plugin architecture allows for modular extension of SEOSONA OS functionality, enabling integration of custom memory management capabilities.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `embedding`, `rag`, `vector`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
