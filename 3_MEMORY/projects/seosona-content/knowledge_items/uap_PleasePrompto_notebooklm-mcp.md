# KI: PleasePrompto/notebooklm-mcp

## Overview
This repository contains a server for Google NotebookLM, designed to enable chat with Gemini models and provide features like session management, stealth browsing, and tool integration via the Model Context Protocol (MCP). The project aims to create a human-like interaction experience by simulating typing and mouse movements. It's built as an MCP server, facilitating communication between LLMs and browser automation tools.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **Framework/Runtime:** Node.js (`package.json`: `"name": "notebooklm-mcp", "type": "module"`, `src/index.ts`: `#!/usr/bin/env node`)
- **Build System:**  `tsc` (TypeScript compiler, referenced in `package.json` scripts: `"build": "tsc"`)
- **MCP SDK:** `@modelcontextprotocol/sdk` (imported in `src/index.ts`, `src/tools/definitions.ts`, etc.)

## Public API / Exports
Based on the limited code provided, it's difficult to definitively list all public APIs. However, based on imports and usage:
- **`Server`:** From `@modelcontextprotocol/sdk/server/index.js`. Used in `src/index.ts` to create the MCP server instance.
- **`StdioServerTransport`:** From `@modelcontextprotocol/sdk/server/stdio.js`.  Used for standard input/output transport in `src/index.ts`.
- **`ToolHandlers`:** Defined in `src/tools/handlers.ts`, appears to be the primary handler for MCP tools.
- **`buildToolDefinitions`:** Function from `src/tools/definitions.ts` used to construct tool definitions.

## Dependencies
Based on `package.json`:
- `@modelcontextprotocol/sdk`: "^1.0.0"
- dotenv: "^16.4.0"
- env-paths: "^3.0.0"
- globby: "^14.1.0"
- patchright: "^1.48.2"
- zod: "^3.22.0"
- @types/node: "^20.11.0"
- eslint: "^10.2.1"
- prettier: "^3.8.3"
- tsx: "^4.7.0"
- typescript: "^5.3.3"
- typescript-eslint: "^8.59.1"

## Architecture Patterns
- **MCP Server:** The core architecture revolves around implementing an MCP server, adhering to the Model Context Protocol specifications.  (`src/index.ts`, imports from `@modelcontextprotocol/sdk`)
- **Modular Tooling:** Tools are defined and handled in separate modules (`src/tools`), promoting code organization and reusability. (`src/tools/definitions.ts`, `src/tools/handlers.ts`).
- **Configuration via Environment Variables:** The project heavily relies on environment variables for configuration, allowing flexibility without modifying source code directly (`src/config.ts`).
- **Session Management:** A session management system is implemented to maintain context across multiple interactions. (`src/session/session-manager.ts`)

## Relevance to SEOSONA OS
The MCP architecture and tool handling capabilities of this project could be beneficial for SEOSONA OS in several ways:
- **Integration with LLMs:** The MCP server provides a standardized interface for integrating various LLMs (Gemini, Claude) into the operating system.
- **Automated Tasks:**  The tool definitions and handlers demonstrate a framework for automating tasks within the OS using LLMs, such as managing files or interacting with applications.
- **Browser Automation:** The project's focus on browser automation could be leveraged to automate web-based workflows within SEOSONA OS.


## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `seo-metadata` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `metadata`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
