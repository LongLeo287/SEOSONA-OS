# KI: vercel-labs/agent-browser

## Overview
The `agent-browser` repository provides a command-line interface (CLI) and associated tooling for browser automation, specifically designed to be used by AI agents. It leverages Rust for the core CLI functionality and integrates with JavaScript/TypeScript for UI components and scripting capabilities. The project also includes a dashboard component built using Next.js.

## Tech Stack (from code)
- **JavaScript/TypeScript:** Used extensively in the `docs` directory, as well as within the `packages/dashboard` directory (`package.json`: `"dependencies": { ... "react": "^19.1.0", ... }`).  Also used for scripting and tooling like `scripts/sync-version.js`.
- **Rust:** The core CLI functionality is written in Rust, evidenced by the presence of `cli/Cargo.toml` and `cli/src/*.rs` files.
- **Next.js:** Used to build the dashboard UI (`packages/dashboard/package.json`: `"dependencies": { "next": "16.1.1", ... }`).
- **pnpm:** The package manager used for JavaScript dependencies (`package.json`: `"packageManager": "pnpm@11.1.3"`).
- **Node.js:** Used as a runtime environment for the CLI scripts and build processes (`package.json`: `"engines": { "node": ">=24.0.0" }`).

## Public API / Exports
Due to the size of the codebase, identifying all public APIs is not feasible within this analysis scope. However, some notable exports can be observed:

- **CLI Binary:** The `package.json` file defines a binary entry point: `"bin": { "agent-browser": "./bin/agent-browser.js" }`. This suggests the primary interface for interacting with the system is through this executable.
- **Dashboard Components:** Within the `packages/dashboard` directory, React components are likely exported (though specific exports cannot be determined without deeper inspection). The presence of files like `src/app/globals.css` and other app related files suggest a NextJS application structure.

## Dependencies
Based on `package.json`, key dependencies include:
- `@ai-sdk/react`:  A library for AI-related components (version 3.0.148).
- `next`: The Next.js framework (version 16.1.1).
- `react`: React JavaScript library (version 19.1.0).
- `radix-ui/react-popover`: A UI component library (version 1.1.15)
- `ai`: AI related functionality (version 6.0.146)

The `pnpm-lock.yaml` file provides a more comprehensive list of dependencies and their versions, including transitive dependencies.  For example, it lists `@upstash/ratelimit`, `shiki`, and many others. The Rust side has its own dependencies managed in `cli/Cargo.toml`.

## Architecture Patterns
- **Modular CLI:** The project uses a modular architecture for the CLI, with separate modules for different functionalities (e.g., `chat.rs`, `color.rs`, `commands.rs` within `cli/src`).
- **Rust Native Components:**  The core functionality is implemented in Rust and exposed as native components, likely interacting with browser automation APIs via Chrome DevTools Protocol (CDP). The `cdp/` directory within the `cli/src/` folder strongly suggests this.
- **Separation of Concerns:** There's a clear separation between the CLI logic (`cli/`), the dashboard UI (`packages/dashboard/`), and documentation (`docs/`).

## Relevance to SEOSONA OS
The `agent-browser` project could benefit SEOSONA OS in several ways:

- **Automated Browser Interaction:** The core functionality of automating browser actions using Rust and CDP can be integrated into SEOSONA OS for tasks like web scraping, data extraction, or automated testing.
- **AI Agent Integration:**  The design specifically caters to AI agents, making it a potential building block for integrating AI capabilities directly into the operating system's user interface or backend processes. The `AGENTS.md` file highlights this focus.
- **Dashboard UI Components:** The Next.js dashboard could be adapted and reused within SEOSONA OS to provide users with visualizations and controls related to browser automation tasks.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
