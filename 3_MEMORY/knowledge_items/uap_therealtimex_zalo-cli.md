# KI: therealtimex/zalo-cli

## Overview
This is a command-line interface (CLI) tool for automating tasks related to the Zalo messaging platform, including multi-account management, proxy support, and interaction with the Official Account API v3.0. The tool aims to provide automation capabilities for Zalo users, particularly those needing to manage multiple accounts or interact programmatically with Zalo's services. It leverages unofficial Zalo APIs (zca-js) which carries a risk of account bans.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The project is structured using JavaScript modules (`import` statements are prevalent throughout the codebase, e.g., `src/index.js`: `import { readFileSync } from "node:fs";`). The presence of `.tsx` files (`src/outro.tsx`, `src/root.tsx`, `src/index.tsx`) indicates TypeScript usage.
- **Node.js:**  The project is designed to run within a Node.js environment, as evidenced by the use of Node.js built-in modules (e.g., `fs`, `path`, `os`), and the presence of a `package.json` file defining dependencies and scripts for Node.js.
- **Commander.js:** Used for command-line argument parsing (`src/index.js`: `import { Command } from "commander";`).
- **Better SQLite3:** Utilized for local database storage (`src/core/db.js`: `import Database from "better-sqlite3";`).
- **undici & node-fetch:** Used for making HTTP requests, particularly to Zalo's APIs (`src/core/oa-client.js`: `import nodefetch from "node-fetch";`).

## Public API / Exports
Based on the code, the primary public entry point is:

- `zalo-agent`:  The binary executable registered in `package.json`'s `bin` section (`"zalo-agent": "src/index.js"`). This exposes a CLI with various subcommands (e.g., `account`, `oa`, `msg`).
- Functions within modules like `src/core/zalo-client.js`:  Functions such as `loginWithQR`, `getApi`, and others are likely exposed internally for use by the CLI commands.

## Dependencies
Based on `package.json`:

- `@modelcontextprotocol/sdk`: "^1.27.1"
- `better-sqlite3`: "^12.10.0"
- `chalk`: "^5.3.0"
- `commander`: "^14.0.3"
- `express`: "^5.2.1"
- `https-proxy-agent`: "^8.0.0"
- `node-fetch`: "^3.3.0"
- `undici`: "^7.24.6"
- `zca-js`: "^2.1.2"
- `zod`: "^4.3.6"

## Architecture Patterns
- **Modular Design:** The codebase is organized into modules (`src/commands`, `src/core`, `src/utils`) with clear responsibilities, promoting code reusability and maintainability.
- **Command Pattern:**  The CLI structure follows the command pattern, where commands are registered and executed based on user input (using Commander.js).
- **Database Abstraction:** The use of Better SQLite3 suggests a local database for storing account information, messages, and other persistent data.
- **Proxy Handling:** The code explicitly supports proxy configuration, indicating an awareness of network limitations and the need to route requests through proxies.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Zalo Integration:**  The `zalo-cli` provides a foundation for integrating Zalo functionality into SEOSONA OS, allowing users to manage their accounts and automate tasks directly from the operating system.
- **Automation Framework:** The CLI's architecture (command registration, modular design) could serve as an example or inspiration for building other automation tools within SEOSONA OS.
- **Proxy Management:**  The proxy handling logic in `zalo-cli` could be adapted to provide a more robust and configurable proxy management system for SEOSONA OS users.
- **Database Interaction Patterns:** The way the project interacts with its local database (Better SQLite3) demonstrates patterns that can be applied to other applications requiring persistent storage within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
