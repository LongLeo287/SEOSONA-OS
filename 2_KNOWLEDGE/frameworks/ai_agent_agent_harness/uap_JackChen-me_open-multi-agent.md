# KI: JackChen-me/open-multi-agent

## Overview
This repository, `open-multi-agent`, provides a TypeScript framework for building and orchestrating multi-agent systems. It allows developers to define agents, teams of agents, and tools that these agents can use to achieve complex goals. The project emphasizes ease of use with features like automatic task decomposition and parallel execution of LLM jobs.

## Tech Stack (from code)
- **Language:** TypeScript (`packages/core/src/index.ts` contains `.ts` files).
- **Framework:**  The core framework is built using TypeScript modules, leveraging ES module syntax (`packages/core/package.json`: `"type": "module"`).
- **Build System:** `tsc` (TypeScript Compiler) is used for building the project (`packages/core/package.json`: `"build": "tsc"`).  Vitest is used for testing (`packages/core/package.json`: `"test": "vitest run"`).
- **Package Manager:** npm (`package.json`).

## Public API / Exports
Based on `packages\core\src\index.ts`, the following are exported:
- `OpenMultiAgent` (class) - Orchestrator class.
- `executeWithRetry` (function) - Function for retrying operations.
- `computeRetryDelay` (function) - Function to calculate retry delay.
- `Scheduler` (class) - Class responsible for scheduling tasks.
- `renderTeamRunDashboard` (function) - Function to render a dashboard.
- `Agent` (class) - Represents an individual agent.
- `LoopDetector` (class) - Detects loops in agent execution.
- `buildStructuredOutputInstruction`, `extractJSON`, `validateOutput` (functions) - Functions related to structured output processing.
- `AgentPool`, `Semaphore` (classes) - Classes for managing agents and concurrency.

## Dependencies
Based on `packages\core\package.json`:
- `@anthropic-ai/sdk`: "^0.52.0"
- openai: "^4.73.0"
- zod: "^3.23.0"
Peer dependencies (optional):
- `@aws-sdk/client-bedrock-runtime`: "^3.700.0"
- `@google/genai`: "^1.48.0"
- `@modelcontextprotocol/sdk`: "^1.18.0"
- ai: "^5.0.0 || ^6.0.0 || ^7.0.0"

## Architecture Patterns
- **Monorepo:** The project is structured as a monorepo, with multiple packages (`packages/*`) managed within the root repository (seen in `package.json`: `"workspaces": ["packages/*"]`).
- **Layered Architecture:**  The code appears to follow a layered architecture, separating concerns into distinct modules like "Orchestrator", "Agent layer," and "Tool layer" as described in `CLAUDE.md`.
- **Plugin/Extension Pattern (Peer Dependencies):** The use of peer dependencies suggests a plugin or extension pattern where external providers can be integrated without being direct dependencies (`packages\core\package.json`: `"peerDependencies"`).

## Relevance to SEOSONA OS
The multi-agent framework in `open-multi-agent` could benefit SEOSONA OS by providing a structured way to automate complex tasks and workflows. The ability to define agents, tools, and teams allows for the creation of intelligent systems that can adapt to changing conditions and achieve specific goals.  Specifically:
- **Automated Task Orchestration:** SEOSONA OS could use this framework to orchestrate various automated processes, such as data analysis, content generation, or system monitoring.
- **Modular Design:** The layered architecture promotes modularity, making it easier to integrate new functionalities and adapt the system to evolving requirements.
- **Extensibility:**  The peer dependency model allows for easy integration of external services and tools, expanding the capabilities of SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `gemini`, `rag`
- **All scores:** {'seosona-os': 100, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
