# KI: jarrodwatts/claude-hud

## Overview
This repository contains a plugin for Claude Code that displays a real-time statusline HUD, showing context health, tool activity, agent status, and todo progress. The plugin parses JSON data from Claude Code's stdin and transcript files to render this information as a multi-line output.  The core functionality revolves around parsing Claude Code's input, rendering the status line, and interacting with configuration files.

## Tech Stack (from code)
- **Language:** TypeScript (`src/claude-config-dir.ts`: `import * as path from 'node:path';`)
- **Framework:**  The project appears to be built using Node.js modules. The presence of `package.json` and the use of `import` statements confirm this.
- **Build System:** TypeScript (`tsconfig.json`: `"compilerOptions": { "target": "ES2022", ... }`) is used for compilation, with a build script defined in `package.json`.

## Public API / Exports
Based on the `src/index.ts` file, the following are exported:

- `isHudDisabled`:  A function to check if the HUD is disabled based on environment variables (`src/index.ts`: `export function isHudDisabled(...)`)
- `main`: The main entry point of the application (`src/index.ts`: `export async function main(...)`)
- `getUsageFromExternalSnapshot`, `writeExternalUsageSnapshot` (re-exported from `./external-usage.js`)

## Dependencies
Based on `package.json`:

- `@types/node`:  TypeScript definitions for Node.js (`package.json`: `"devDependencies": { "@types/node": "^25.9.3", ... }`)
- `c8`: Code coverage tool (`package.json`: `"devDependencies": { "c8": "^11.0.0", ... }`)
- `typescript`: TypeScript compiler (`package.json`: `"devDependencies": { "typescript": "^6.0.3", ... }`)

## Architecture Patterns
- **Configuration Driven:** The plugin reads configuration from files (e.g., MCP settings) and environment variables, influencing its behavior.  (`src/config-reader.ts`, `src/config.ts`).
- **Data Parsing & Rendering Pipeline:** A clear pipeline exists for receiving data from Claude Code (stdin), parsing it (`src/stdin.ts`, `src/transcript.ts`), processing the data, and rendering the output to stdout (`src/render/index.ts`).
- **Modular Design:** The codebase is structured into modules like `config`, `git`, `cost`, and `render`, promoting separation of concerns.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **Statusline Integration:**  The plugin’s core functionality – displaying real-time status information – is directly applicable to enhancing SEOSONA OS's user experience by providing a rich, informative statusline.
- **Configuration Management:** The robust configuration handling demonstrated in this project could be adapted for managing various aspects of the SEOSONA OS environment and its integrations.
- **Data Parsing Techniques:**  The parsing logic used for Claude Code’s JSON input (`src/stdin.ts`, `src/transcript.ts`) can serve as a template for parsing other structured data sources within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
