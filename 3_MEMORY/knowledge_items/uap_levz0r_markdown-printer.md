# KI: levz0r/markdown-printer

## Overview
This repository contains a browser extension, "Markdown Printer," designed to save web pages as Markdown files while preserving formatting. The core functionality involves capturing webpage content and converting it into Markdown format, with support for multiple languages (English, French, Hebrew, Hindi).  The project includes native host components for interacting with the operating system.

## Tech Stack (from code)
- **JavaScript:** The primary language used throughout the codebase (e.g., `src/background.js`, `src/popup.js`).
- **Node.js:** Used for build scripts and testing (`build.js`, `jest.config.js`, `package.json`'s "scripts" section).
- **pnpm:** Package manager used for dependency management (e.g., `pnpm-lock.yaml`, `pnpm-workspace.yaml`).
- **Jest:** Testing framework, configured in `jest.config.js`.
- **ESLint:** Linter, configured in `eslint.config.js` to enforce code style and best practices.
- **Turndown:** A JavaScript library for converting HTML to Markdown (imported in `src/turndown.js`).

## Public API / Exports
Due to the nature of this project as a browser extension, there isn't a traditional public API exposed directly. However, several functions are exported within modules:

- `sanitizeFilename` from `utils.js`:  This function sanitizes filenames (e.g., `if (typeof module !== 'undefined' && module.exports) { module.exports = { sanitizeFilename }; }`).
- `mdpRatingPolicy` from `rating-policy.js`: This object contains functions related to rating prompt logic and store detection (e.g., `(function (root, factory) { const mod = factory(); ... })`).
- `mdpLogBuffer` from `log-buffer.js`:  Provides ring buffer utilities for logging.

## Dependencies
Based on the `package.json` file:

- `@types/jest`: Type definitions for Jest.
- eslint: Linter.
- jest: Testing framework.
- prettier: Code formatter.
- publish-browser-extension: Utility for publishing browser extensions.
- Unrs-resolver (added via pnpm workspace):  A dependency required by the build process, likely related to native module compilation.

## Architecture Patterns
- **Modular Design:** The codebase is organized into modules (`background.js`, `popup.js`, `log-buffer.js`, etc.), each responsible for specific functionalities.
- **Event-Driven Programming:**  The extension utilizes browser API events like `runtime.onInstalled` and `contextMenus.onClicked` to trigger actions.
- **Internationalization (i18n):** The project supports multiple languages using `browserAPI.i18n.getMessage()` for localized strings, with separate description files (`description-fr.md`, `description-he.md`, etc.).
- **Native Messaging:**  The inclusion of `native-host` directory and related scripts (e.g., `host-wrapper.sh`, `host.js`) indicates the use of native messaging to communicate between the browser extension and a separate, native application.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Markdown Conversion Library:** The Turndown library used for HTML to Markdown conversion can be integrated into SEOSONA OS’s text processing tools or content creation workflows.
- **Native Messaging Pattern:**  The `native-host` directory demonstrates a pattern for interacting with native applications, which could be adapted for other SEOSONA OS features requiring system-level access.
- **Internationalization Framework:** The i18n implementation provides a good example of how to support multiple languages within an application, useful for SEOSONA OS’s global user base.
- **Logging and Diagnostics:**  The `log-buffer.js` and `logger.js` modules demonstrate a robust logging system that could be adapted for debugging and monitoring SEOSONA OS components.

## UAP Routing (auto-classified)
- **System:** `seosona-flow` · **Function:** `browser-extension` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `background.js`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 33}
