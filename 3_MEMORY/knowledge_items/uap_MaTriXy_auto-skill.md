# KI: MaTriXy/auto-skill

## Overview
The `MaTriXy/auto-skill` repository provides a system for automatically generating coding agent skills by observing workflow patterns and codifying them into reusable SKILL.md files. It aims to enable AI agents to learn from interactions and create skills autonomously, supporting multiple coding agents like Claude Code, Cursor, and others. The project's core functionality revolves around capturing events, detecting patterns, and forging skills based on these observations.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **Framework:**  Hono (`package.json`: `dependencies: {"hono": "^4.0.0", "@hono/node-server": "^1.0.0"}`) is used for web server functionality.
- **Build System:** TypeScript compiler (`tsconfig.json`, `package.json` scripts include `"build": "tsc"`)
- **Database:** SQLite (`src/core/db.ts`: uses `better-sqlite3` and handles Bun compatibility)

## Public API / Exports
Based on the exports from `src/index.ts`:

*   `openDatabase`: Function to open a database connection.
*   `createEventStore`: Function to create an event store instance.
*   `createSkillStore`: Function to create a skill store instance.
*   `createLockFile`: Function to create a lock file instance.
*   `createPatternDetector`: Function to create a pattern detector instance.
*   `createSequenceMatcher`: Function to create a sequence matcher instance.
*   `createSessionAnalyzer`: Function to create a session analyzer instance.
*   `createSkillGenerator`: Function to create a skill generator instance.
*   `createGraduationManager`: Function to create a graduation manager instance.
*   `createAgentRegistry`: Function to create an agent registry instance.
*   `track`: Function for telemetry tracking.
*   `createProviderManager`, `createLocalProvider`, `createWellKnownProvider`: Functions related to skill providers.
*   `sanitizeName`: Function to sanitize names.
*   `loadConfig`: Function to load configuration.
*   `validateSkillMd`: Function to validate SKILL.md files.
*   `atomicWrite`: Function for atomic file writes.
*   `ulid`: Function for generating ULIDs (Universally Unique Lexicographically Sortable Identifiers).
*   Formatter functions: `formatTable`, `formatJson`, etc.
*   `createCli`: Function to create a command-line interface.
*   `startMcpServer`: Function to start an MCP server.
*   `createApp`, `startWebServer`: Functions for web application creation and startup.

## Dependencies
Based on `package.json`:

*   `better-sqlite3`: SQLite database driver.
*   `commander`: Command-line argument parsing.
*   `hono`: Web framework.
*   `@hono/node-server`: Node.js server for Hono.
*   `yaml`: YAML parser.
*   `sqlite-vec`:  For vector search within SQLite (optional).
*   Development dependencies: `@types/better-sqlite3`, `@types/node`, `eslint`, `@typescript-eslint/*`, `typescript`, `vitest`.

## Architecture Patterns
*   **Plugin Architecture:** The system is designed as a plugin for coding agents, allowing it to hook into their workflows (`CLAUDE.md`: "Implementation: `src/hooks/observer.ts`").
*   **Pipeline Pattern:**  The skill generation process follows a pipeline with distinct stages: observation (event capture), detection (pattern recognition), and forging (skill generation) (`CLAUDE.md`).
*   **Factory Pattern**: The use of `create...` functions to instantiate core components suggests the factory pattern for object creation (`src/index.ts`, e.g., `createEventStore`, `createPatternDetector`).
*   **Strategy Pattern:**  The system supports multiple coding agents and skill providers, indicating a strategy pattern for interchangeable implementations.

## Relevance to SEOSONA OS
`auto-skill`'s code could benefit SEOSONA OS in several ways:

*   **Automated Skill Generation**: The core functionality of automatically generating skills from workflow patterns aligns with the goal of improving agent capabilities and reducing manual effort.  SEOSONA OS could integrate this system to learn from user interactions and create custom agents or workflows.
*   **Cross-Agent Learning:** The ability to share skills across different coding agents is valuable for SEOSONA OS, which may utilize a variety of AI tools. This promotes knowledge transfer and reduces redundancy.
*   **Contextual Understanding**:  The session analysis component (`src/core/session-analyzer.ts`) could be adapted to improve SEOSONA OS's understanding of user intent and context, leading to more relevant suggestions and automated actions.
*   **SQLite Database Integration:** The use of SQLite for event storage provides a lightweight and portable database solution that can be easily integrated into SEOSONA OS’s infrastructure.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
