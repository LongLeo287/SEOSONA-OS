# KI: modelcontextprotocol/servers

## Overview
This repository contains implementations of Model Context Protocol servers, encompassing both TypeScript and Python projects. The codebase is structured as an npm workspaces monorepo, hosting seven distinct server packages with varying functionalities like file system operations, memory management, sequential thinking, web content fetching, and git repository interactions.  The project aims to provide reference server implementations for the MCP.

## Tech Stack (from code)
- **TypeScript:** Used extensively in `src/` directories (`everything`, `filesystem`, `memory`, `sequentialthinking`) as evidenced by numerous `.ts` files and the `tsconfig.json` file:
  ```typescript
  // tsconfig.json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "Node16",
      ...
    },
    "include": ["src/**/*"],
    ...
  }
  ```
- **JavaScript:** Used alongside TypeScript, as indicated by the `type: "module"` in `package.json`.
  ```json
  // package.json
  {
    "type": "module",
    ...
  }
  ```
- **Python:** Utilized for the `fetch`, `git`, and `time` servers, as shown by the `.py` files within those directories and the presence of `pyproject.toml` files:
  ```toml
  // src/fetch/pyproject.toml
  [build-system]
  requires = ["hatchling"]
  build-backend = "hatchling.plugin.meta"
  ```
- **npm:** Package manager for the TypeScript projects, as defined in `package.json`.
  ```json
  // package.json
  {
    "name": "@modelcontextprotocol/servers",
    ...
    "workspaces": [
      "src/*"
    ],
    ...
  }
  ```
- **uv:** Package manager for the Python projects, as indicated by `pyproject.toml` and build scripts in `CLAUDE.md`.
   ```text
   # CLAUDE.md
   - Build system: hatchling (`uv build`)
   - Package manager: uv (not pip)
   ```
- **Vitest:** Testing framework for TypeScript projects, as mentioned in the build commands within `CLAUDE.md`.
  ```text
  // CLAUDE.md
  # Tests: vitest with @vitest/coverage-v8 (required for new tests)
  ```
- **Pytest:** Testing framework for Python projects, as indicated by the build scripts in `CLAUDE.md`.
   ```text
   # CLAUDE.md
   # Run tests (if tests/ or test/ directory exists)
   uv run pytest
   ```

## Public API / Exports
Due to the large codebase and lack of explicit documentation, identifying a comprehensive public API is difficult without further investigation. However, based on file structure and naming conventions:

- **`src/everything/index.ts`**: Likely serves as an entry point for the main server implementation.  The presence of `index.ts` in several directories suggests these are modules intended to be imported and used by other parts of the system.
- **Tools within `src/everything/tools/`**: These `.ts` files (e.g., `get-resource-links.ts`, `trigger-sampling-request.ts`) likely expose functions or utilities for interacting with resources, triggering requests, etc.  The naming convention suggests they are designed to be callable from other parts of the system.
- **Resources within `src/everything/resources/`**: Files like `files.ts`, `session.ts`, and `templates.ts` likely define data structures or functions related to resource management, session handling, and template generation.

## Dependencies
- **TypeScript Projects:**
  ```json
  // package.json
  {
    "dependencies": {
      "@modelcontextprotocol/server-everything": "*",
      "@modelcontextprotocol/server-memory": "*",
      "@modelcontextprotocol/server-filesystem": "*",
      "@modelcontextprotocol/server-sequential-thinking": "*"
    }
  }
  ```
- **Python Projects:** Dependencies are managed within the `pyproject.toml` files for each server (fetch, git, time). Specific dependencies would need to be extracted from those individual files.

## Architecture Patterns
- **Monorepo Structure:** The project utilizes a monorepo structure with npm workspaces, suggesting code sharing and potentially coordinated releases across different server implementations.
  ```json
  // package.json
  {
    "workspaces": [
      "src/*"
    ]
  }
  ```
- **Modular Design:** The division into separate directories (`everything`, `filesystem`, `memory`, etc.) indicates a modular design, with each directory representing a distinct server component or functionality.
- **Tooling Abstraction:** The `tools/` directory within the TypeScript servers suggests an abstraction layer for common tasks and operations, promoting code reuse and maintainability.

## Relevance to SEOSONA OS
- **Resource Management (Filesystem Server):**  The `server-filesystem` component's focus on file operations with access control could be valuable for SEOSONA OS's data storage and security features. The path validation and utility functions (`path-validation.ts`, `roots-utils.ts`) are particularly relevant.
- **Memory Management (Memory Server):**  The `server-memory` component, dealing with knowledge graph persistence, could inform SEOSONA OS’s approaches to long-term data storage and retrieval for its AI models.
- **Asynchronous Request Handling (Fetch Server):** The Python `fetch` server's use of asynchronous programming (`async/await`) in conjunction with pytest-asyncio demonstrates efficient handling of network requests, which could be adapted for SEOSONA OS’s web scraping or data ingestion tasks.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
