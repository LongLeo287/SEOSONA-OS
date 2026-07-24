# KI: warengonzaga/tinyclaw

## Overview
TinyClaw is a monorepo for an autonomous AI companion, designed with layered conversation compaction and security-focused architecture. The codebase demonstrates modularity through the use of multiple packages handling specific functionalities like configuration management, agent runtime, delegation, and message routing. It emphasizes self-configuration and proactive messaging across various channels.

## Tech Stack (from code)
- **Language:** TypeScript (`packages/compactor/tsconfig.json`: `"typescript": "^5.0.0"`, `package.json`: `"devDependencies": { "typescript": "^5.7.0" }`)
- **Framework:** Bun (`Dockerfile`: `FROM oven/bun:1.3.9`, `package.json`: `"engines": { "node": ">=18"` )
- **Build System:** Bun (as evidenced by the build scripts in `package.json` and usage within the Dockerfile)

## Public API / Exports
Based on the code, here's a sampling of public APIs:

*   **`@tinyclaw/compactor`**: `createCompactor`, `compressContext`, `buildCodebook`. (packages/compactor/src/index.ts)
*   **`@tinyclaw/config`**: `ConfigManager`, `createConfigTools`. (packages/config/src/index.ts)
*   **`@tinyclaw/core`**: `createDatabase`, `agentLoop`. (packages/core/src/index.ts)
*   **`@tinyclaw/delegation`**: `createBackgroundRunner`, `createLifecycleManager`, `runSubAgent`. (packages/delegation/src/index.ts)
*   **`@tinyclaw/gateway`**: `createGateway`. (packages/gateway/src/index.ts)
*   **`@tinyclaw/heartware`**: `HeartwareManager`, `loadHeartwareContext`. (packages/heartware/src/index.ts)
*   **`@tinyclaw/intercom`**: `createIntercom`. (packages/intercom/src/index.ts)
*   **`@tinyclaw/learning`**:  `createLearningEngine`, `analyze`. (packages/learning/src/index.ts)

## Dependencies
Based on the `package.json`:

*   `@biomejs/biome`: For linting and formatting.
*   `@types/bun`: TypeScript definitions for Bun runtime.
*   `@types/node`: TypeScript definitions for Node.js APIs.
*   `husky`: Git hooks for code quality enforcement.
*   `typescript`:  TypeScript compiler.
*   `@wgtechlabs/log-engine`: For structured logging.
*   Various `@tinyclaw/*` packages (internal dependencies within the monorepo).

## Architecture Patterns
*   **Monorepo:** The project is organized as a monorepo, with multiple packages for different functionalities. This promotes code sharing and modularity.
*   **Layered Architecture:**  The `compactor` package demonstrates a layered architecture for conversation processing (rule-based pre-compression, deduplication, summarization).
*   **Plugin System:** The gateway uses a plugin system to route messages based on prefixes, suggesting extensibility for new channels.
*   **Configuration Management:** A dedicated `@tinyclaw/config` package handles persistent configuration using SQLite and Zod validation.

## Relevance to SEOSONA OS
TinyClaw's code could benefit SEOSONA OS in several ways:

*   **Context Compression & Summarization:** The `compactor` package’s layered compression techniques (especially the tiered summaries) could be adapted for efficient storage and retrieval of large conversation histories within SEOSONA.
*   **Security Practices:**  The heartware package's emphasis on security, including backup mechanisms and content validation, aligns with SEOSONA's security requirements. The audit logging functionality is particularly valuable.
*   **Modular Design:** The monorepo structure and modular packages could serve as a model for organizing SEOSONA’s components, promoting code reuse and maintainability.
*   **Proactive Messaging:**  The gateway package’s proactive messaging capabilities could be leveraged to implement automated notifications and task management within the OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `router`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
