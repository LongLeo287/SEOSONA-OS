# KI: mmethodz/dreamgraph

## Overview
Dreamgraph is a graph-first cognitive daemon with tools for managing and interacting with knowledge graphs, including a CLI, dashboard, Explorer, and VS Code integration. The system appears to be designed for building and operating complex AI systems involving structured data and reasoning capabilities. It leverages PostgreSQL as its database and incorporates features like plugin support and automated entity enrichment.

## Tech Stack (from code)
- **TypeScript:**  The primary language used throughout the codebase, evident from numerous `.ts` and `.tsx` files (e.g., `src/index.ts`, `packages/host/src/index.ts`). The `tsconfig.json` file confirms TypeScript compilation:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

- **Node.js:** The project uses Node.js as a runtime environment, indicated by the `#!/usr/bin/env node` shebang in `src/index.ts` and the presence of Node.js modules like `fs`, `path`, and `process`.
- **Express.js:** Used for building web APIs, as seen in `src/server/routes.ts`:

```typescript
import express from "express";
// ... other imports
const router = express.Router();
```

- **React:**  Used for the dashboard component, evident from the import statement:

```typescript
import React from 'react';
```

## Public API / Exports
Based on `src/tools/*` and `packages/*/src/index.ts`, here's a sampling of public APIs (exposed as tools):

- `bootstrap_instance`:  For bootstrapping DreamGraph instances. (`src/tools/bootstrap-instance.ts`)
- `code_senses`: Provides code analysis capabilities. (`src/tools/code-senses.ts`)
- `db_senses`: Allows querying the database schema. (`src/tools/db-senses.ts`)
- `enrich_parser_nodes`: Enriches parser-discovered nodes with semantic information. (`src/tools/enrich-parser-nodes.ts`)
- `get_workflow`: Retrieves workflow details by ID. (`src/tools/get-workflow.ts`)

## Dependencies
From `package.json`:

- `@dreamgraph/host`:  Core host functionality.
- `@dreamgraph/sdk`: SDK for plugin development.
- `@modelcontextprotocol/sdk`: MCP protocol implementation.
- Express: Web framework.
- React: UI library.
- Zod: Schema validation.
- Vitest: Testing framework

## Architecture Patterns
- **Plugin System:**  The project utilizes a plugin architecture, as evidenced by the `packages/host` directory and references to plugins in various files (e.g., `tsconfig.json`).
- **Modular Design:** The codebase is structured into multiple packages (`packages/token-economy`, `packages/sdk`, `packages/host`), promoting modularity and separation of concerns.
- **Data-Driven Architecture:**  The system heavily relies on data files like `adr_log.json` (ADR history), `api_surface.json` (API surface information), and `data_model.json` (entity data). These files are read and written to by various tools, indicating a data-driven approach.
- **CLI Tooling:**  The project provides a command-line interface (`dg`) for interacting with the system.

## Relevance to SEOSONA OS
Dreamgraph's architecture could benefit SEOSONA OS in several ways:

- **Knowledge Graph Management:** Dreamgraph’s core functionality aligns well with SEOSONA OS's need to manage and reason over complex knowledge graphs, particularly those derived from structured data sources.
- **Plugin Architecture:** The plugin system allows for extending SEOSONA OS's capabilities without modifying the core codebase.  Custom plugins could be developed to integrate with specific data sources or AI models.
- **Automated Enrichment:** Dreamgraph’s automated entity enrichment features (e.g., `enrich_parser_nodes`) can improve the quality and completeness of knowledge graphs within SEOSONA OS, reducing manual effort.
- **API Surface Discovery:** The `code_senses` tool could be adapted to automatically discover and document APIs exposed by SEOSONA OS components, improving maintainability and developer productivity.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `workflow`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
