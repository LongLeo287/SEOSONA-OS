# KI: ComposioHQ/open-claude-cowork

## Overview
This project, "Open Claude Cowork," is an Electron application designed for chat interactions leveraging the Anthropic Claude Agent SDK and Opencode SDK. It appears to provide a user interface for interacting with these AI models, potentially facilitating collaborative workflows ("cowork"). The application includes a backend server component for managing chats and API requests.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The primary language is JavaScript, evidenced by files like `main.js`, `preload.js`, `renderer/renderer.js`.
- **Electron:** Used as the framework for building desktop applications, confirmed by the presence of `package.json` and `main.js`.
- **Node.js:**  The backend server utilizes Node.js, indicated by the `server/` directory containing JavaScript files and a `server/package.json` file.
- **Express.js:** The backend framework for handling API requests, as seen in `server/server.js` which includes `const express = require('express');`.
- **HTML/CSS:** Used for the user interface within the renderer process, with files like `renderer/index.html` and `renderer/style.css`.

## Public API / Exports
Due to the limited code provided, it's difficult to definitively list public APIs. However, based on `preload.js`, the following are exposed from the main process to the renderer:

- **electronAPI.abortCurrentRequest():**  Allows the renderer process to abort ongoing requests (File: `preload.js`).
- **electronAPI.stopQuery(chatId, provider):** Allows stopping a query on the backend server (File: `preload.js`).
- **electronAPI.sendMessage(message, chatId, provider, model):**  Sends messages to the backend for processing (File: `preload.js`).

The backend exposes an API at `http://localhost:3001` with endpoints like `/api/chat` and `/api/abort`, as used in `preload.js`.

## Dependencies
Based on `package.json`:

- `@anthropic-ai/claude-agent-sdk`:  For interacting with the Anthropic Claude Agent SDK (File: `package.json`).
- `@opencode-ai/sdk`: For interacting with Opencode AI SDK (File: `package.json`).
- `cors`: Enables Cross-Origin Resource Sharing for the backend API (File: `package.json`).
- `dotenv`:  For managing environment variables (File: `package.json`).
- `express`: A Node.js web application framework (File: `package.json`).
- `electron`: The Electron framework itself (File: `package.json`).
- `electron-reload`: For live reloading during development (File: `package.json`).

## Architecture Patterns
- **Electron Main/Renderer Process Separation:**  The code clearly separates the main process (`main.js`) responsible for application lifecycle and window management from the renderer process (`renderer/index.html`, `preload.js`) handling UI logic.
- **ContextBridge for Inter-Process Communication (IPC):** The `preload.js` file utilizes a context bridge to securely expose specific functions from the main process to the renderer process, limiting direct access and enhancing security.
- **Backend API with Express:** A Node.js backend server is implemented using Express.js to handle chat requests and potentially other application logic.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **AI Integration Framework:** The existing integration with Claude Agent SDK and Opencode SDK provides a foundation for incorporating similar AI capabilities into SEOSONA OS, allowing users to leverage these models within the operating system.
- **Electron Application Template:**  The Electron application structure can serve as a template for developing other desktop applications for SEOSONA OS, promoting consistency in development practices.
- **Secure IPC Implementation:** The context bridge implementation demonstrates best practices for secure inter-process communication, which is crucial for building robust and secure applications within SEOSONA OS.
- **Backend API Design:**  The Express.js backend provides a reference point for designing APIs for other services that may need to interact with SEOSONA OS components.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `remotion`, `render`
- **All scores:** {'seosona-os': 41, 'seosona-video': 44, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 0}
