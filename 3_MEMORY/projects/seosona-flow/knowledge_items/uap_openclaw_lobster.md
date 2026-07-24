# KI: openclaw/lobster

Lobster is a workflow runtime for AI agents, designed to execute deterministic pipelines with approval gates. It provides tools and infrastructure for managing and running complex workflows involving LLMs and other external services. The codebase demonstrates a focus on modularity, extensibility, and safety in handling user input and shell commands within these workflows.

## Tech Stack (from code)

*   **Language:** TypeScript - evidenced by the `.ts` file extensions and `tsconfig.json` configuration (`"include": ["src/**/*.ts", "test/**/*.ts"]`).
*   **Framework/Runtime Environment:** Node.js - indicated by `package.json`'s `"type": "module"` and usage of Node.js APIs (e.g., `NodeJS.ReadableStream`, `node:crypto`).
*   **Build System:** pnpm -  evident from the presence of `pnpm-lock.yaml` and build scripts in `package.json` using `pnpm clean` and `tsgo`.
*   **Validation Library**: Ajv - declared as a dependency in `package.json` and used for schema validation (`import { Ajv, type AnySchema, type ValidateFunction } from "ajv";`).

## Public API / Exports

Based on the `src/core/index.ts` file:

*   `createDefaultRegistry`: Function to create a default command registry.
*   `parsePipeline`: Function for parsing pipeline definitions.
*   `runPipeline`:  Function to execute a pipeline.
*   `runWorkflowFile`: Function to run a workflow from a file.
*   `decodeResumeToken`: Function to decode resume tokens.
*   `runToolRequest`: Function to execute a tool request within a pipeline.
*   `resumeToolRequest`: Function to resume a tool request.
*   `createToolContext`: Function to create a context for tool execution.

## Dependencies

Based on `package.json`:

*   `ajv`: Version 8.20.0 - Used for JSON schema validation.
*   `yaml`: Version 2.9.0 - Used for YAML parsing.
*   `@types/node`: Version 25.9.2 - TypeScript definitions for Node.js APIs.
*   `@typescript/native-preview`: Version 7.0.0-dev.20260609.1 -  TypeScript preview compiler.
*   `oxfmt`: Version 0.54.0 - Code formatting tool.
*   `oxlint`: Version 1.69.0 - Linter for code quality.
*   `typescript`: Version 6.0.3 - TypeScript compiler.

## Architecture Patterns

*   **Command Pattern:** The `src/commands` directory and the `createDefaultRegistry` function suggest a command pattern, where functionality is encapsulated in reusable commands registered within a central registry.  The `LobsterCommand` interface defines the structure of these commands.
*   **Plugin-like architecture**: The use of registries and extensible components (e.g., LLM adapters) suggests a plugin-like architecture allowing for easy addition of new features or integrations.
*   **State Management:**  The code includes mechanisms for resuming workflows (`resume.ts`, `pipeline_resume_state.ts`), indicating state management is a core concern, likely involving storing and restoring workflow progress.
*   **Sandboxing/Security**: The `shell.ts` file demonstrates an effort to safely execute shell commands by resolving inline commands and controlling the execution environment.

## Relevance to SEOSONA OS

Lobster's architecture could be beneficial for SEOSONA OS in several ways:

*   **Automated Task Orchestration:**  The workflow runtime can automate complex tasks within SEOSONA OS, such as data processing pipelines or system maintenance routines.
*   **Modular Design:** The command pattern and plugin-like architecture would allow for easy integration of new features and services into SEOSONA OS.
*   **Safe Shell Execution**: Lobster's approach to shell execution can be adapted to enhance the security of scripts run within SEOSONA OS, mitigating potential vulnerabilities from untrusted input.
*   **Stateful Workflows:** The resume functionality could enable long-running or interrupted tasks in SEOSONA OS to be reliably resumed without data loss.

## UAP Routing (auto-classified)
- **System:** `seosona-flow` · **Function:** `workflow-automation` · **Fit:** 56/100 · **Auto-apply:** True
- **Evidence:** `workflow`, `pipeline`
- **All scores:** {'seosona-os': 44, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 56}
