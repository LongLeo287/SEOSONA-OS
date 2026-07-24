# KI: staticpayload/oh-my-codex

## Overview
This repository, `oh-my-codex`, provides a runtime environment for OpenAI Codex, enabling orchestration of agents and tasks. It appears to be structured as a monorepo with multiple packages including a CLI tool, core functionality, and an MCP (Model Context Protocol) server. The project facilitates the creation, execution, and management of AI-powered workflows.

## Tech Stack (from code)
- **TypeScript:**  The primary language for most source files (`packages/cli/src/*.ts`, `packages/core/src/*.ts`, `packages\mcp-server\src\index.ts`). This is evidenced by the presence of `tsconfig.json` and `package.json` files in various packages, as well as `.ts` file extensions.
- **Node.js:** The project uses Node.js for its runtime environment (evident from `engines: { "node": ">=20"}` in `package.json`).  The CLI tool (`packages/cli/package.json`) specifies `"type": "module"` indicating ES modules are used.
- **Rust:** A portion of the codebase is written in Rust, specifically for the `omx-explore` crate (defined in `Cargo.toml` and containing files like `crates/omx-explore/src/lib.rs`).
- **npm / yarn:** Package management is handled by npm (`package.json`, `package-lock.json`).
- **cargo:** Rust package management is handled by cargo (`Cargo.toml`).

## Public API / Exports
Based on the code, here's a sampling of exported elements:

*   **`packages/core/src/index.ts`**:  Exports numerous functions and classes including `agents`, `codex`, `doctor`, `explore`, `hooks`, `plugins`, `runtime`, `session`, `state`, `team`. For example, `export * from "./agents.js";`
*   **`packages/cli/src/index.ts`**: Exports functions like `main`, `defaultIo`, and commands such as `runSetup`, `runDoctorCommand`, `runTeamCommand`.  For instance: `export async function main(args: string[], io: CliIo = defaultIo): Promise<number> { ... }`
*   **`packages/mcp-server/src/index.ts`**: Exports functions like `toolDefinitions`. For example, `export const toolDefinitions: ToolSchema[] = [ ... ]`

## Dependencies
Based on the `package.json` and `Cargo.toml` files:

*   **npm dependencies:** `@types/node`, `typescript`, `@oh-my-codex/core` (in packages/cli), `@iarna/toml` (in packages/core), `@modelcontextprotocol/sdk` (in packages/mcp-server)
*   **Rust dependencies:**  None explicitly listed in `Cargo.toml`.

## Architecture Patterns
*   **Monorepo:** The project utilizes a monorepo structure, as evidenced by the `workspaces` property in `package.json`: `"workspaces": [ "packages/*" ]`. This allows for shared code and dependencies across multiple packages.
*   **Plugin System:**  The presence of directories like `plugins/omx-product` and references to plugin loading (`loadPluginManifest`) suggest a plugin architecture, allowing extensibility.
*   **Command-Line Interface (CLI):** The `packages/cli` directory contains the code for a CLI tool, with commands defined in `src/commands/*.ts`.
*   **Modular Design:**  The core functionality is split into multiple modules within the `packages/core` directory, promoting separation of concerns.

## Relevance to SEOSONA OS
This project's codebase could benefit SEOSONA OS in several ways:

*   **Agent Orchestration Framework:** The agent orchestration framework and runtime environment could be adapted for managing AI agents within SEOSONA OS.  The `agents` module in `packages/core` is a key component here.
*   **Plugin Architecture:** The plugin architecture allows for extending SEOSONA OS functionality with custom modules, similar to how OMX extends Codex.
*   **CLI Tooling:** The CLI tool provides a command-line interface for managing and interacting with AI agents and workflows, which could be integrated into SEOSONA OS's management tools.
*   **Rust Integration (omx-explore):**  The Rust crate `omx-explore` demonstrates the use of Rust for performance-critical tasks like repository indexing; this pattern could be applied to other areas of SEOSONA OS where Rust would be beneficial.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `tool-use`, `mcp`, `planner`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
