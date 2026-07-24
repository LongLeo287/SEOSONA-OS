# KI: YishenTu/claudian

This project, "Claudian," is an Obsidian plugin designed to embed provider-backed coding agents within the Obsidian environment. It provides a sidebar interface and inline editing capabilities for interacting with these agents, primarily focusing on Claude but also supporting other providers like Codex, OpenCode, and Pi. The code demonstrates a modular architecture allowing for extensibility through different agent providers.

## Tech Stack (from code)
- **TypeScript:**  The primary language used throughout the codebase (`tsconfig.json`: `{"include": ["src/**/*.ts", "src/**/*.d.ts", "tests/**/*.ts"]}`).
- **JavaScript/ES6+:** Used in conjunction with TypeScript, evidenced by files like `scripts/rendererSafeUnref.js` and ESNext module target in `tsconfig.json`.
- **Obsidian API:** The plugin heavily utilizes the Obsidian API for integration within the Obsidian environment (`src/main.ts`: `import { Plugin } from 'obsidian';`).
- **esbuild:** Used as a build tool, indicated by the presence of `esbuild.config.mjs` and related scripts in `package.json`.
- **Jest:**  Used for testing, with configuration defined in `jest.config.js`.

## Public API / Exports
Due to the large codebase, listing all exports is impractical. However, some notable exports include:
- `ClaudianPlugin`: The main plugin class extending Obsidian's Plugin class (`src/main.ts`).
- `registerBuiltInProviders`: Function used to register built in providers (`src\providers\index.ts`).
- `getBuiltInProviderDefaultConfigs`: Function that returns default provider configurations (`src\providers\defaultProviderConfigs.ts`).

## Dependencies
Based on the `package.json` file:
- `@anthropic-ai/claude-agent-sdk`:  For interacting with Claude agents.
- `@codemirror/state`, `@codemirror/view`: For code editing functionality.
- `@modelcontextprotocol/sdk`: A SDK for model context protocol.
- `obsidian`: The core Obsidian API library.
- `tslib`: Utility functions for TypeScript.

## Architecture Patterns
- **Provider Pattern:**  The codebase is heavily structured around a provider pattern, allowing for different coding agents (Claude, Codex, OpenCode, Pi) to be plugged in and used with the same plugin interface (`src/providers/*`, `AGENTS.md`). This promotes modularity and extensibility.
- **Modular CSS:** The project uses modular CSS built into `styles.css` as mentioned in `AGENTS.md`.
- **Layered Architecture**:  The code is organized into layers such as core, providers, features, and app, promoting separation of concerns (`src/core/*`, `src/providers/*`, `src/features/*`).

## Relevance to SEOSONA OS
This project's architecture could benefit SEOSONA OS in the following ways:
- **Plugin Architecture:** The plugin structure demonstrates a good pattern for integrating external services or functionalities into a larger system.  SEOSONA OS could adopt similar patterns for extending its capabilities.
- **Provider Pattern:** The provider pattern used for coding agents is highly valuable. SEOSONA OS could leverage this pattern to support different AI models, data sources, or other external services in a modular and extensible manner.
- **Modular UI Components**:  The use of reusable UI components would be beneficial for building consistent user interfaces within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 22, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 0}
