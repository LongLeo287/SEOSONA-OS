# KI: giancarloerra/SocratiCode

## Overview
Socraticode is a server for indexing local codebases, enabling semantic search and dependency graph visualization. It leverages Docker containers for Qdrant (vector database) and Ollama (language model inference). The project aims to provide a private, local alternative to cloud-based code intelligence tools.

## Tech Stack (from code)
- **Language:** TypeScript (`src/index.ts`, `tsconfig.json`)
- **Framework:** Node.js (`package.json`: `"main": "dist/index.js"`)
- **Build System:**  `tsc` (TypeScript compiler, referenced in `package.json` scripts: `"build": "tsc"` and `tsconfig.json`)
- **Package Manager:** npm (`package.json`)
- **Vector Database:** Qdrant (`docker-compose.yml`, `src/services/qdrant.ts`)
- **Language Model:** Ollama (`docker-compose.yml`, `src/services/ollama.ts`)

## Public API / Exports
Based on the limited code provided, it's difficult to definitively list a public API. However, based on the tools and commands referenced in `CLAUDE.md`, `GEMINI.md` and `AGENTS.md`, we can infer some exposed functionality:

- `codebase_search`: Hybrid semantic + keyword search
- `codebase_graph_query`:  Graph query tool to explore dependencies.
- `codebase_impact`: Impact analysis of code changes.
- `codebase_flow`: Code flow tracing.
- `codebase_symbol`: Symbol context view.
- `codebase_symbols`: List symbols in a file or search by name.

These commands are likely exposed through an MCP (Model Context Protocol) interface, as evidenced by the `@modelcontextprotocol/sdk` dependency and references to "MCP tools" throughout the documentation files.

## Dependencies
Based on `package.json`, key dependencies include:

- `@modelcontextprotocol/sdk`: For MCP server implementation.
- `@qdrant/js-client-rest`:  Qdrant client library.
- `@google/generative-ai`: Google's generative AI SDK (likely for embedding generation).
- `zod`: For schema validation.
- `biome`: For linting and formatting.
- `vitest`: For testing.

## Architecture Patterns
- **Microservices:** The architecture appears to be based on microservices, with separate Docker containers for Qdrant and Ollama.
- **Plugin/Extension System:**  The presence of `.claude-plugin`, `.codex-plugin` and `.cursor-plugin` directories suggests a plugin or extension system allowing integration with other tools.
- **Command-Line Interface (CLI):** The `#!/usr/bin/env node` shebang in `src/index.ts` indicates the project provides a CLI tool.

## Relevance to SEOSONA OS
Socraticode's focus on local code analysis and semantic search could be highly beneficial for SEOSONA OS:

- **Offline Code Intelligence:**  SEOSONA OS developers could use Socraticode for code understanding, refactoring, and debugging even without an internet connection.
- **Private Data Security:** The local nature of the system ensures that sensitive codebase information remains within the secure environment of the SEOSONA OS infrastructure.
- **Customizable Code Analysis:**  The plugin architecture allows for tailoring the code analysis process to meet specific needs of SEOSONA OS projects and technologies.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `ollama`, `gemini`, `embedding`, `rag`, `vector`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 28}
