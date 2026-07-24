# KI: okx/agent-trade-kit

## Overview
This project, named "okx-hub," appears to be a command-line interface (CLI) and core library for interacting with the OKX exchange platform. It provides tools for managing accounts, market data retrieval, trading execution, and potentially bot automation via the Model Context Protocol (MCP). The code suggests it's designed to be modular and extensible, supporting various functionalities through different modules.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.base.json`, `packages/cli/tsconfig.json`, `packages/core/tsconfig.json`)
- **Framework:**  Utilizes Node.js for runtime environment. The CLI uses undici for HTTP requests (`packages/cli/package.json`).
- **Build System:** pnpm and tsup are used for package management and building the project (`package.json`, `packages/cli/package.json`, `packages/core/package.json`)

## Public API / Exports
Based on `packages/core/src/index.ts`:
- `OkxRestClient`: A class for interacting with the OKX exchange API.
- `buildTools`:  A function to build tools (likely related to MCP).
- `createToolRunner`: A function to create a tool runner.
- `allToolSpecs`: An array of tool specifications.
- `loadConfig`: Function to load configuration.
- `checkForUpdates`: Checks for updates.
- `TradeLogger`:  A class for logging trades.
- `runSetup`: Runs the setup process.
- `downloadSkillZip`, `extractSkillZip`, etc.: Functions related to skill management and downloading.

Based on `packages/cli/src/index.ts`:
- Several command functions like `handleAuthCommand`, `cmdMarketTicker`, `cmdAccountBalance` are exported, indicating the CLI's public interface.

## Dependencies
From `package.json` and its dependencies:
- `@modelcontextprotocol/sdk`:  Version 1.26.0 (used for MCP functionality)
- `@types/node`: Version 25.2.2 (TypeScript type definitions)
- c8: Version 10.1.3 (code coverage tool)
- tsup: Version 8.5.1 (build tool)
- undici: Version 6.0.0 (HTTP client)
- yauzl: Version 3.2.1 (ZIP file reader)

## Architecture Patterns
- **Modular Design:** The project is structured into `packages` (cli, core, mcp), suggesting a modular architecture where different functionalities are separated into distinct packages.  The use of modules and submodules within the CLI (`cmdMarketTicker`, `cmdAccountBalance`) further reinforces this pattern.
- **Command-Line Interface (CLI):** The `packages/cli` directory contains code for building a command-line tool, with commands defined in separate files (`account.ts`, `auth.ts`, etc.).  The parser module (`./src/parser.ts`) handles argument parsing.
- **Model Context Protocol (MCP) Integration:** The project heavily integrates with the Model Context Protocol, as evidenced by dependencies on `@modelcontextprotocol/sdk` and code related to server setup and tool execution.

## Relevance to SEOSONA OS
This project's modular design and focus on automation could be beneficial for SEOSONA OS in several ways:
- **Automated Trading Strategies:** The bot modules and MCP integration can be leveraged to develop automated trading strategies within the SEOSONA ecosystem.
- **Data Integration:**  The `OkxRestClient` and market data retrieval functions can be used to integrate real-time OKX market data into SEOSONA's dashboards or analytics tools.
- **Skill Management:** The skill management functionality (downloading, extracting, verifying) could potentially be adapted for managing custom integrations or extensions within the SEOSONA platform.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
