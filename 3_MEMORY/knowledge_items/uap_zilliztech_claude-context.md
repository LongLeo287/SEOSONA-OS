# KI: zilliztech/claude-context

## Overview
This repository, `zilliztech/claude-context`, contains a codebase for an indexing tool designed to work with large language models (LLMs), specifically focusing on providing context retrieval capabilities. The project includes components for Chrome and VS Code extensions, as well as a Model Context Protocol (MCP) server implementation.  It appears to be built for multi-platform support, allowing users to index codebases and search them semantically.

## Tech Stack (from code)
- **TypeScript:** Used extensively throughout the codebase (`tsconfig.json`, `.ts` files). The `tsconfig.json` file specifies TypeScript compiler options.
- **JavaScript:**  Used in conjunction with TypeScript, particularly within the Chrome extension (`packages/chrome-extension`).
- **Node.js:**  The project uses Node.js as a runtime environment (package.json: `"engines": { "node": ">=20.0.0" }`) and for building tools.
- **Webpack:** Used as a module bundler, especially within the Chrome extension (`packages/chrome-extension/webpack.config.js`).
- **pnpm:** Package manager used to manage dependencies (package.json: `"engines": { "pnpm": ">=10.0.0" }`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`).

## Public API / Exports
Based on the `packages/core/src/index.ts` file, the following are exported from the core library:
- `Context`: A class representing the context indexing and retrieval functionality. (`packages/core/src/index.ts`)
- `MilvusVectorDatabase`:  A class for interacting with a Milvus vector database. (`packages/core/src/index.ts`)
- `splitter`: An object containing functions related to code splitting. (`packages/core/src/index.ts`)
- `embedding`: An object containing functions related to embedding generation. (`packages/core/src/index.ts`)
- `vectordb`:  An object likely related to vector database interactions. (`packages/core/src/index.ts`)
- `types`: An object containing type definitions. (`packages/core/src/index.ts`)
- `context`: An object probably containing context management utilities. (`packages/core/src/index.ts`)
- `sync/synchronizer`:  A module for synchronizing codebases. (`packages/core/src/index.ts`)
- `utils`: A module likely containing utility functions. (`packages/core/src/index.ts`)

## Dependencies
Based on the `package.json` and `pnpm-lock.yaml` files, key dependencies include:
- `@zilliz/milvus2-sdk-node`:  For interacting with Milvus vector database.
- `langchain`: A framework for building LLM applications.
- `openai`: The OpenAI Python library.
- `faiss-node`: For efficient similarity search.
- `@google/genai`: Google's Gemini API client library.
- `ollama`:  Client for interacting with Ollama language models.
- `tree-sitter`: A parser generator tool.

## Architecture Patterns
- **Modular Design:** The project is structured into multiple packages (`core`, `chrome-extension`, `mcp`), suggesting a modular architecture where each package has specific responsibilities. This is evident in the `tsconfig.json` file with its references to these packages.
- **Configuration-Driven:**  The `.env.example` file indicates that much of the tool's behavior (embedding provider, API keys) is configurable through environment variables.
- **Plugin/Extension Architecture:** The Chrome extension demonstrates a plugin architecture, extending functionality within a browser environment.

## Relevance to SEOSONA OS
This project’s code could benefit SEOSONA OS in several ways:
- **Enhanced Code Search:**  The semantic search capabilities of Claude Context can be integrated into SEOSONA OS to provide more intelligent and context-aware code search, improving developer productivity.
- **LLM Integration:** The integration with various LLMs (OpenAI, VoyageAI, Gemini, Ollama) allows SEOSONA OS to leverage these models for tasks like code completion, documentation generation, or automated bug fixing.
- **Vector Database Support:**  The use of Milvus and Faiss demonstrates a focus on efficient vector search, which could be valuable for SEOSONA OS's own data indexing and retrieval needs.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `ollama`, `gemini`, `embedding`, `rag`, `vector`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 28}
