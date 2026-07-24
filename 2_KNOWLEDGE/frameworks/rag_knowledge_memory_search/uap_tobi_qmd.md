# KI: tobi/qmd

## Overview
The `tobi/qmd` repository contains a tool for indexing and searching markdown files, combining full-text search (BM25), vector embeddings, and LLM reranking. It's designed to be used on-device and supports various platforms including macOS with native SQLite builds. The project includes components for data preparation, model training/finetuning, and evaluation.

## Tech Stack (from code)
- **TypeScript:**  `tsconfig.json` (`{ "compilerOptions": { "target": "ESNext", ... }}`) and numerous `.ts` files demonstrate TypeScript usage.
- **Bun:** `package.json` ("bin": { "qmd": "bin/qmd" }, scripts: ["bun install", "bun test"]) indicates the project is built with Bun, a JavaScript runtime environment.
- **SQLite:**  The existence of `src/db.ts` and imports from `"bun:sqlite"` confirms SQLite database usage.
- **Node.js (fallback):** The conditional logic in `src/db.ts` demonstrates that Node.js is used as a fallback if Bun isn't available.
- **Web Tree Sitter:**  Import statements like `import { createRequire } from "node:module"` and the presence of grammar files suggest usage for AST parsing.
- **YAML:** The existence of `example-index.yml` and imports from `"yaml"` indicate YAML configuration file processing.

## Public API / Exports
Based on `src/index.ts`, the following are exported as part of the public SDK:

- `createStore`:  A function for creating a QMD store instance (`/** @typedef {import("./store.js").Store} InternalStore */`).
- `hybridQuery`: A function to perform hybrid search (BM25 + vector).
- `structuredSearch`: A function for structured search.
- `extractSnippet`: Function to extract code snippets.
- `addLineNumbers`:  Function to add line numbers to text.
- Various functions related to collection management (`listCollections`, `syncConfigToDb`).
- Functions for embedding generation (`generateEmbeddings`).

## Dependencies
Based on `package.json`:

- `@modelcontextprotocol/sdk`: Version 1.29.0
- `better-sqlite3`: Version 12.10.0
- `fast-glob`: Version 3.3.3
- `node-llama-cpp`: Version 3.18.1
- `picomatch`: Version 4.0.4
- `sqlite-vec`: Version 0.1.9
- `tree-sitter-go`: Version 0.25.0
- `tree-sitter-python`: Version 0.25.0
- `tree-sitter-rust`: Version 0.24.0
- `tree-sitter-typescript`: Version 0.23.2
- `web-tree-sitter`: Version 0.26.8
- `yaml`: Version 2.9.0
- `zod`: Version 4.2.1

## Architecture Patterns
- **Layered Architecture:** The code demonstrates a layered architecture with modules for database interaction (`src/db.ts`), LLM integration (`src/llm.ts`), collection management (`src/collections.ts`), and core search logic (`src/store.ts`).
- **Configuration-Driven:**  The use of YAML configuration files (e.g., `example-index.yml`) indicates a design that allows for flexible customization without code changes.
- **Cross-Runtime Abstraction:** The `src/db.ts` file demonstrates an abstraction layer to support both Bun and Node.js environments.

## Relevance to SEOSONA OS
The `tobi/qmd` project's on-device search capabilities could be valuable for SEOSONA OS in several ways:

- **Local Knowledge Base Search:**  SEOSONA OS could integrate QMD to enable users to quickly search through local documents, code repositories, or other data stored directly on the device.
- **Privacy-Focused Search:** The on-device nature of QMD aligns with privacy concerns, as user data doesn't need to be sent to external servers for processing.
- **Offline Functionality:**  QMD’s ability to function without an internet connection makes it suitable for scenarios where connectivity is limited or unavailable.
- **Customizable Indexing:** The YAML configuration allows SEOSONA OS developers to tailor the indexing process to specific data formats and content types.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
