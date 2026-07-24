# KI: pablodelucca/pixel-agents

## Overview
Pixel Agents is a VS Code extension and standalone CLI tool that allows users to manage AI coding agents as animated characters within a virtual office environment. The system provides features for agent lifecycle management, layout persistence, and communication with AI models like Claude.  The architecture emphasizes strict layering and modularity.

## Tech Stack (from code)
- **TypeScript:** Extensive use of `.ts` and `.tsx` files throughout the codebase (e.g., `adapters/vscode/extension.ts`, `core/src/index.ts`).
- **JavaScript:**  Some JavaScript files exist, particularly in scripts (`scripts/assemble-vercel-output.mjs`) and bundled hook scripts (`server/dist/hooks/claude-hook.js`).
- **Node.js:** The project uses Node.js as its runtime environment (e.g., `tsconfig.json`: `"module": "Node16"`).
- **esbuild:** Used for bundling JavaScript code (`esbuild.js`).
- **Vite:**  Used in the webview UI build process (`webview-ui/vite.config.ts`).
- **Fastify:** The server utilizes Fastify, a Node.js web framework (implied by `server/package.json` and directory structure).

## Public API / Exports
Due to the size of the project, it's difficult to enumerate all public APIs without further analysis. However, some notable exported elements include:

- **VS Code Extension Commands:** The `package.json` file defines commands like `"pixel-agents.showPanel"` and `"pixel-agents.exportDefaultLayout"`.
- **CLI Binary:**  The `package.json` file specifies a binary named "pixel-agents" located at `./dist/cli.js`, suggesting a command-line interface.
- **AsyncAPI Contract:** The `core/asyncapi.yaml` defines the public API for communication between the server and clients, including message formats and operations.

## Dependencies
Based on `package.json`:

- `"@asyncapi/modelina"`: Used for AsyncAPI processing.
- `"esbuild"`:  Used as a build tool.
- `"fastify"`: A web framework used in the server.
- `"npm-run-all"`: For running multiple scripts concurrently.
- `"tsx"`: TypeScript execution environment.

## Architecture Patterns
- **Layered Architecture:** The `core/`, `server/`, and `adapters/` directories suggest a layered architecture, with clear separation of concerns.  The `CLAUDE.md` file explicitly mentions this layering.
- **Provider Pattern:** The use of "providers" (e.g., `PixelAgentsViewProvider`, `HookProvider`) indicates the application of the Provider pattern for extensibility and abstraction.
- **Event-Driven Architecture:** The system appears to be event-driven, with components reacting to events related to agent lifecycle, tool activity, and layout changes.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Agent Management Framework:**  The core logic for managing AI agents (lifecycle, state persistence) could be adapted as a foundational component within SEOSONA OS.
- **Communication Protocol:** The AsyncAPI contract provides a well-defined communication protocol that could be leveraged for integrating various AI tools and services into the operating system.
- **UI Framework:**  The webview UI framework demonstrates techniques for building interactive user interfaces, which could inform the development of SEOSONA OS's graphical components.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `router`
- **All scores:** {'seosona-os': 44, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
