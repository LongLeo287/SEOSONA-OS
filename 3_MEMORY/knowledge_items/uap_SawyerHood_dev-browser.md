# KI: SawyerHood/dev-browser

## Overview
This repository contains a CLI tool (`dev-browser`) for controlling browsers and executing JavaScript scripts within a sandboxed environment, leveraging Playwright and QuickJS. The project includes both a Rust-based command-line interface (CLI) and a Node.js daemon to manage browser instances and execute the sandboxed code.  The `install-dev.sh` script suggests this is intended for development workflows.

## Tech Stack (from code)
- **Rust:** Used for the CLI tool, as evidenced by the presence of `cli/Cargo.toml` and `cli/src/main.rs`.
- **TypeScript:**  Used extensively in the daemon component, with files like `daemon/src/browser-manager.ts` and a `tsconfig.json` file (`daemon/tsconfig.json`).
- **Node.js:** The daemon is built using Node.js, as indicated by the `daemon/package.json` and `daemon/pnpm-lock.yaml` files.
- **Playwright:** A dependency used for browser automation, listed in `package.json`.
- **QuickJS:**  Used within a sandbox environment, referenced in multiple file names (e.g., `quickjs-sandbox.ts`, `script-runner-quickjs.ts`) and the project description in `package.json`.
- **pnpm**: Used as package manager for the daemon (`daemon/pnpm-lock.yaml`).

## Public API / Exports
Due to the nature of this being a CLI tool with a daemon, identifying a clear public API solely from code is difficult without execution context. However, based on file names and structure:

- **CLI:** The `cli/src/main.rs` likely exposes commands related to browser control and script execution.  The `bin/dev-browser.js` file suggests an entry point for the CLI.
- **Daemon:** The `daemon/src/protocol.ts` file implies a protocol definition for communication between the CLI and the daemon.  Files like `daemon/src/browser-manager.ts` suggest functionality related to browser management.

## Dependencies
Based on `package.json`:
- `playwright`: "1.58.2"
- `playwright-core`: "1.58.2"
- `quickjs-emscripten`: "^0.32.0"

Based on `cli/Cargo.toml` (partial listing - full list would require more analysis):
-  Dependencies are not immediately apparent without deeper Cargo.toml parsing.

## Architecture Patterns
- **CLI with Daemon:** The project follows a client-server architecture, where the Rust CLI acts as a client and the Node.js daemon provides server-side functionality (browser management, sandboxed execution).
- **Bundling:**  The `daemon/scripts/bundle-sandbox-client.ts` script indicates that parts of the daemon are bundled for inclusion in the Rust binary. This is confirmed by the comment in `AGENTS.md`: "`cli/src/daemon.rs` embeds `daemon/dist/daemon.bundle.mjs` and `daemon/dist/sandbox-client.js` via `include_str!`".
- **Sandboxed Execution:** The project utilizes a QuickJS sandbox, suggesting a focus on security and isolation when executing JavaScript code within the browser environment.

## Relevance to SEOSONA OS
The `dev-browser` project's architecture could be beneficial for SEOSONA OS in several ways:

- **Automated Testing/Integration:**  Playwright integration allows for automated testing of web applications, which is crucial for a robust operating system.
- **Sandboxed Scripting:** The QuickJS sandbox provides a secure environment for executing user-provided scripts, potentially enabling safe and isolated extensions or plugins within SEOSONA OS. This aligns with the principle of least privilege.
- **Browser Automation:**  The ability to control browsers programmatically can be used for various tasks such as web scraping, data extraction, or automated workflows within the operating system. The CLI design allows integration into existing automation pipelines.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
