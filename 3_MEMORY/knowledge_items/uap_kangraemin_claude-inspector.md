# KI: kangraemin/claude-inspector

## Overview
This project, "Claude Inspector," is a desktop application designed to visualize and debug interactions with Claude AI models. It appears to focus on analyzing proxy requests and responses related to Claude's API, allowing users to inspect the communication flow and potentially identify issues or understand internal mechanisms. The application also includes features for Aiflow analysis and chat functionality.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The presence of `package.json` with dependencies like `@playwright/test`, `electron`, and `electron-builder` indicates JavaScript is the primary language, with TypeScript used in `playwright.config.ts`.
- **Electron:** The `main.js`, `preload.js`, and `package.json` (with `"name": "electron"`) confirm Electron is used for building a desktop application.
- **Node.js:**  The use of Node.js modules like `fs`, `os`, `path`, `http`, and `https` within `main.js` demonstrates server-side JavaScript execution.
- **Playwright:** The presence of `@playwright/test` in `devDependencies` and the `playwright.config.ts` file indicates Playwright is used for end-to-end testing.

## Public API / Exports
Based on the provided code snippets, it's difficult to definitively list all public APIs. However, we can identify some exposed functionalities through the preload script:

- **electronAPI:** This object, exposed via `contextBridge`, provides a set of functions accessible from the renderer process (UI).  Functions include:
    - `proxyStart`: Starts a proxy server.
    - `proxyStop`: Stops a proxy server.
    - `proxyStatus`: Retrieves the status of the proxy server.
    - `aiflowAnalyze`: Initiates an Aiflow analysis.
    - `aiflowChat`: Sends data to initiate an Aiflow chat session.
    - `trackEvent`:  Sends analytics events.

## Dependencies
Based on `package.json`, key dependencies include:

- `@sentry/electron`: For error tracking and reporting.
- `dotenv`: For managing environment variables.
- `electron`: The core Electron framework.
- `electron-builder`: For building distribution packages (macOS, Windows).
- `@playwright/test`:  For end-to-end testing.

## Architecture Patterns
- **Electron Application Structure:** The code follows the standard Electron architecture with separate main and renderer processes. `main.js` handles application logic and inter-process communication, while `preload.js` facilitates secure communication between the renderer process and the main process.
- **IPC (Inter-Process Communication):**  The use of `ipcMain.handle` and `contextBridge.exposeInMainWorld` demonstrates a reliance on IPC for communication between the main and renderer processes.
- **Event Handling:** The application uses event listeners (`ipcRenderer.on`) to handle events such as proxy requests, responses, Aiflow progress updates, and update notifications.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Debugging Tools for AI Interactions:**  The core functionality of Claude Inspector – visualizing and debugging API interactions – is applicable to any system interacting with large language models (LLMs). This could be integrated into a broader SEOSONA OS development or troubleshooting workflow.
- **Proxying and Interception Capabilities:** The proxy server implementation within the application provides a mechanism for intercepting and analyzing network traffic, which could be useful for security auditing, performance monitoring, or debugging purposes within SEOSONA OS.
- **Electron Expertise:**  The project demonstrates expertise in building cross-platform desktop applications using Electron, which is valuable if SEOSONA OS aims to provide similar functionality.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
