# KI: Ngxba/claude-code-agents-ui

## Overview
This project, `agents-ui`, is a visual dashboard built with Nuxt 3 for managing Claude Code agents, commands, skills, and plugins. It provides a GUI layer on top of the user's `~/.claude` directory, allowing users to configure AI assistants without directly editing markdown files. The application includes features like workflow building, terminal emulation, and integration with GitHub repositories.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The project is written primarily in TypeScript (`tsconfig.json`: `"extends": "./.nuxt/tsconfig.json"`).
- **Nuxt 3:** The core framework for the application (`nuxt.config.ts`: `modules: ['@nuxt/ui']`).
- **Vue 3:** Nuxt 3 uses Vue 3 as its underlying UI framework (evident from component file extensions `.vue`).
- **Bun:**  The project utilizes Bun as a JavaScript runtime and package manager (`package.json`: `"type": "module"`, `bin`: `"agents-ui": "./bin/start.mjs"`). Dockerfile uses `FROM oven/bun:1.1-slim`.
- **CSS:** The project includes CSS styling, referencing `~/assets/css/main.css` in the Nuxt configuration (`nuxt.config.ts`).

## Public API / Exports
Due to the size of the repository and lack of clear public API documentation within the code itself, identifying a comprehensive list of exported functions or endpoints is difficult without further analysis. However, some notable files suggest potential areas:

- **`app/composables/*.ts`:** These files contain composable functions likely used throughout the application (e.g., `useAgents.ts`, `useChat.ts`).
- **`server/api/*.ts`:**  These files define API endpoints for the backend server, potentially exposing functionality to external clients (e.g., `/api/chat.post.ts` mentioned in CLAUDE.md).
- **Components directory (`app/components/*.vue`)**: These components are likely exported and used within the application's UI.

## Dependencies
Based on `package.json`:
- `@anthropic-ai/claude-agent-sdk`:  For interacting with Claude Code agents.
- `@modelcontextprotocol/sdk`: Likely for integration with Model Context Protocol.
- `@nuxt/ui`: Nuxt UI components library.
- `@vue-flow/core`, `@vue-flow/controls`, `@vue-flow/minimap`: For visual workflow building.
- `@xterm/xterm`, `@xterm/addon-*`:  For terminal emulation functionality.
- `chokidar`: For file system monitoring.
- `marked`: Markdown parsing library.
- `node-pty`: Provides pseudo-terminal support.
- `nuxt`: The Nuxt framework itself.
- `shiki`: Syntax highlighting library.
- `ws`: WebSocket implementation for real-time communication.
- `yaml`: YAML parsing library.

## Architecture Patterns
- **Composable Functions:**  The use of composables (`app/composables/`) suggests a pattern of reusable logic and state management, promoting modularity and maintainability.
- **Nuxt Server API Routes:** The backend utilizes Nuxt's server API routes (`server/api/*.ts`), providing a structured way to handle HTTP requests and responses.
- **SSE Streaming for Chat:**  The chat functionality leverages Server-Sent Events (SSE) for streaming responses from the backend, enabling real-time updates in the UI.
- **Component-Based Architecture:** The application follows a component-based architecture using Vue 3 components (`app/components/*.vue`), which promotes code reusability and modularity.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **AI Agent Management UI:**  The visual agent management interface could be adapted for managing AI agents within the SEOSONA OS environment, providing a user-friendly way to configure and monitor their behavior.
- **Terminal Emulation Integration:** The `xterm` integration provides a robust terminal emulator that could be incorporated into SEOSONA OS for command-line interaction with various services or tools.
- **Workflow Visualization:**  The workflow building component (`@vue-flow`) could be used to create visual representations of complex processes within SEOSONA OS, improving understanding and collaboration.
- **Composable Functionality:** The composable functions demonstrate a modular design pattern that can be applied to other areas of SEOSONA OS development for improved code reusability and maintainability.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`
- **All scores:** {'seosona-os': 66, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 66, 'seosona-flow': 28}
