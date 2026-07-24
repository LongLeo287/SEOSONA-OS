# KI: psycho-prince/claw-cli

## Overview
This project, `claw-cli`, is a command-line interface and server for an AI agent designed for browser automation and security tasks. It allows users to execute tasks through the CLI or via a ClawCloud server mode, with features including task planning, policy enforcement, and execution within a sandboxed environment. The code demonstrates a focus on secure autonomous agent operation, incorporating elements of policy-driven control and restricted execution environments.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **Framework:** Commander.js for CLI argument parsing (`src/index.ts`: `import { Command } from 'commander';`) and Express.js for the server component (`src/server.ts`: `import express from 'express';`)
- **Build System:**  `tsc` (TypeScript compiler) as defined in `package.json`: `"scripts": { "build": "tsc" }`
- **Database:** SQLite3 (`package.json`: `"dependencies": { "better-sqlite3": "^11.1.2" }`, `src/server.ts`: `import BetterSqlite3 from 'better-sqlite3';`)

## Public API / Exports
Based on the `src/index.ts` file, the primary public functions and commands exposed are:

- **`claw do <task>`**: Executes a task with the autonomous agent (`src/index.ts`: `.command('do')`).
- **`claw doctor`**: Checks for configuration issues (`src/index.ts`: `.command('doctor')`).
- **`claw init`**: Initializes Claw CLI configuration (`src/index.ts`: `.command('init')`).
- **`--server` flag:** Enables server mode, which triggers the execution of `src/server.js`.

The `src/agent.ts` file exports:
- **`Agent` class**: The core agent responsible for planning and executing tasks.

## Dependencies
Based on `package.json`:

- `@sinclair/typebox`: `"0.34.48"` - For defining and validating data schemas.
- `better-sqlite3`: `"^11.1.2"` - SQLite database driver.
- `commander`: `"^14.0.3"` - Command-line argument parsing.
- `dotenv`: `"^16.4.5"` - Environment variable management.
- `express`: `"^4.19.2"` - Web framework for the server.
- `express-rate-limit`: `"^7.3.1"` - Rate limiting middleware.
- `helmet`: `"^7.1.0"` - Security headers middleware.
- `jsonwebtoken`: `"^9.0.2"` - JSON Web Token generation and verification.
- `playwright`: `"^1.45.0"` - Browser automation framework.
- `zod`: `"^3.23.8"` - Schema validation library.
- `chalk`: `"^5.3.0"` - Console output styling.

## Architecture Patterns
- **Command-Line Interface (CLI):** Utilizes Commander.js to define and manage CLI commands and options (`src/index.ts`).
- **Modular Design:** The application is structured into modules like `agent.ts`, `doctor.ts`, `executor.ts`, and `policy.ts`, each responsible for specific functionalities.
- **Policy Enforcement:**  A `Policy` class enforces security constraints on agent actions (`src/policy.ts`). Actions are explicitly whitelisted, demonstrating a "fail-closed" approach to security.
- **Sandboxed Execution:** The `Executor` class is designed to execute actions within a restricted environment (`src/executor.ts`), with placeholder comments indicating the intended implementation of secure sandboxing mechanisms.
- **Server Mode:**  The application can operate in server mode, providing an API for ClawCloud functionality (`src/server.ts`, `docker-compose.yml`).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Secure Automation Framework:** The policy enforcement and sandboxed execution mechanisms within `claw-cli` provide a foundation for building secure automation tasks within SEOSONA OS, preventing unauthorized actions.
- **CLI Tooling:**  The CLI structure using Commander.js can be adapted to create custom tools for managing and interacting with SEOSONA OS components.
- **API Server:** The Express.js server implementation demonstrates how to build a secure API endpoint for controlling and monitoring automated tasks within the operating system.
- **Dependency Management:** The project's use of TypeScript, Playwright, and other modern dependencies can inform best practices for building robust and maintainable SEOSONA OS components.  The focus on security through libraries like `helmet` is also valuable.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 24/100 · **Auto-apply:** False
- **Evidence:** `sqlite`
- **All scores:** {'seosona-os': 24, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
