# KI: dinhlinh86/claw_code

## Overview
This repository contains a bridge plugin for OpenClaw, designed to extend its functionality with daily surface actions, session visibility, and maintainer helpers. The plugin provides compatibility tools and unified actions accessible through a command-line interface. It appears to be modular and extensible, allowing for the integration of new features and capabilities.

## Tech Stack (from code)
- **Language:** TypeScript (`src/**/*.ts` in `tsconfig.json`)
- **Framework/Build System:**  OpenClaw plugin SDK (import statements like `openclaw/plugin-sdk/plugin-entry`), Node.js (package.json: `"type": "module"` and usage of `node:` imports)
- **Bundler/Transpiler:** TypeScript (`tsconfig.json`)

## Public API / Exports
Based on the `src/index.ts` file, the primary public export is a default object defining the OpenClaw plugin entry point:

```typescript
// src/index.ts
export default definePluginEntry({ ... });
```

Within this exported object, the following functions are registered with the OpenClaw API:

- `claw_code` tool (defined in `src/index.ts`, uses `executeUnifiedAction`)
- Compatibility tools (registered by `registerCompatibilityTools` in `src/compat-tools.ts`)

## Dependencies
From `package.json`:

- `@sinclair/typebox`: Version 0.34.49 - Used for type validation and schema definition.
- `openclaw`: Version 2026.3.28 - The core OpenClaw library.
- `@types/node`:  Version 22.0.0 - TypeScript definitions for Node.js APIs.

## Architecture Patterns
- **Plugin Architecture:** The code adheres to an OpenClaw plugin architecture, with a defined entry point and registration of tools via the `api` object.
- **Unified Action Pattern:** A central `executeUnifiedAction` function (in `src/action-registry.ts`) handles execution based on action parameters, suggesting a unified interface for various actions.
- **Configuration Driven:** The plugin uses a configuration object (`PluginConfig`) to control behavior and access resources, as seen in multiple files like `src/index.ts`, `src/config.ts`.
- **Workspace Abstraction:**  The code heavily utilizes functions from `src/workspace-paths.ts` (e.g., `resolveExistingFilePath`, `resolveExistingDirectoryPath`) to abstract workspace paths and ensure they are valid within the OpenClaw environment.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Enhanced Tooling:** The plugin architecture allows for easy integration of custom tools and actions into SEOSONA OS, extending its capabilities beyond core functionality.  The `registerCompatibilityTools` function specifically highlights this extensibility.
- **Workspace Management:** The robust workspace path resolution logic (in `src/workspace-paths.ts`) could be adapted to improve SEOSONA OS's own workspace management and file access security.
- **Command-Line Interface Extension:**  The unified action pattern provides a model for creating a consistent command-line interface within SEOSONA OS, allowing users to interact with various system components through a single entry point. The `executeUnifiedAction` function could be adapted for this purpose.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
