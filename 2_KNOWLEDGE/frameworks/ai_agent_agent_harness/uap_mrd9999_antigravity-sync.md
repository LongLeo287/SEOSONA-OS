# KI: mrd9999/antigravity-sync

## Overview
This is a VS Code extension designed for automating AI coding workflows, specifically focusing on auto-retry and synchronization of context across machines using Git. The extension aims to reduce manual intervention in AI agent interactions by automatically handling acceptance or retry prompts and keeping codebases synchronized. It leverages Chrome DevTools Protocol (CDP) for automation and Git for version control.

## Tech Stack (from code)
*   **TypeScript:**  The primary language, evidenced by the numerous `.ts` files (`src/extension.ts`, `src/services/*.ts`, `webview/src/index.ts`). The `tsconfig.json` file confirms TypeScript compilation settings.
*   **JavaScript:** Used in conjunction with TypeScript, particularly within the webpack configuration (`webpack.config.js`) and for some build scripts.
*   **Node.js:**  The extension's core logic runs on Node.js, as indicated by the `target: 'node'` setting in the `webpack.config.js` file.
*   **Webpack:** Used as a module bundler to package the extension (`webpack.config.js`).
*   **VS Code API:** The extension utilizes the VS Code API for integration with the editor, demonstrated by imports like `import * as vscode from 'vscode';`.
*   **Simple Git:** A Node.js library used for interacting with Git repositories (`src/services/GitService.ts`).
*   **Chokidar:**  A file system watcher library used to monitor changes in the Gemini folder (`src/services/WatcherService.ts`).

## Public API / Exports
Due to the nature of a VS Code extension, direct public APIs are limited. However, the following commands are exposed through `package.json`:

*   `antigravitySync.configure`: Configures the repository URL and other settings.
*   `antigravitySync.syncNow`: Manually triggers a synchronization process.
*   `antigravitySync.push`: Pushes changes to the remote Git repository.
*   `antigravitySync.pull`: Pulls changes from the remote Git repository.
*   `antigravitySync.showStatus`: Displays the current status of the sync.
*   `antigravitySync.openPanel`: Opens a side panel for monitoring and configuration.

## Dependencies
Based on `package.json`, key dependencies include:

*   `vscode`: The VS Code API library.
*   `simple-git`:  For Git operations.
*   `chokidar`: For file system watching.
*   `ws`: WebSocket client for CDP communication (dynamically imported).
*   `ts-loader`: TypeScript loader for webpack.
*   `copy-webpack-plugin`: Copies files to the webview build directory.

## Architecture Patterns
*   **Service Layer:** The code is organized around a service layer (`src/services`), with dedicated services for Auto Retry, CDP handling, Configuration, Git operations, File Filtering, Notifications, and Relaunching. This promotes modularity and separation of concerns.
*   **Configuration-Driven:**  The extension relies heavily on configuration settings stored in VS Code's workspace settings (`vscode.workspace.getConfiguration('antigravitySync')`).
*   **Event-Driven (File Watching):** The `WatcherService` uses chokidar to react to file system events, triggering synchronization actions based on changes.
*   **Asynchronous Operations:**  The code utilizes asynchronous functions and promises extensively for non-blocking operations, particularly when interacting with Git and the CDP.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

*   **Automation of repetitive tasks:** The core functionality of automating AI agent interactions (auto-retry/accept) can be adapted for other repetitive tasks within SEOSONA OS, improving efficiency and reducing manual effort.
*   **Git integration expertise:**  The robust Git integration demonstrated by the `GitService` could serve as a template or component for managing code repositories and synchronization in SEOSONA OS projects.
*   **CDP interaction patterns:** The use of Chrome DevTools Protocol (CDP) to automate browser actions provides valuable insights into how to interact with web-based applications programmatically, which could be useful for automating various tasks within the SEOSONA OS ecosystem.
*   **Modular design principles:**  The service-oriented architecture and configuration-driven approach used in this extension can serve as a model for building modular and extensible components within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `agent`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
