# KI: renezander030/capcut-cli

## Overview
This project, `capcut-cli`, is a command-line interface (CLI) tool designed for creating and editing CapCut projects. It allows users to build drafts from scratch, add video, audio, text, subtitles, timing, speed, volume, and templates without requiring the official CapCut API. The CLI aims to provide automation capabilities for CapCut project creation and modification.

## Tech Stack (from code)
- **TypeScript:**  The primary language used, evidenced by the `.ts` file extensions throughout the `src/` directory (e.g., `src/index.ts`, `src/ass.ts`).
- **Node.js:** The runtime environment for executing the CLI, as indicated in the `package.json` (`"engines": { "node": ">=18" }`) and the Dockerfile (`FROM node:20-alpine`).
- **Biome:** Used for linting and formatting ( `biome.json`, `"lint": "biome check --error-on-warnings src/ test/"`).
- **esbuild / TypeScript Compiler:**  The build system, as defined in the `package.json` script `"build": "tsc && node -e \"import('node:fs').then(fs=>fs.copyFileSync('src/enums.json','dist/enums.json'))\""` and `tsconfig.json`.

## Public API / Exports
The project exposes a public API through the `lib.ts` file, which is referenced in `package.json`: `"main": "./dist/lib.js"`,  and exported via `exports`. Some key functions include:

- `loadDraft(path: string): { draft: Draft; filePath: string }`: Loads a CapCut draft from a given path (src/draft.ts).
- `saveDraft(filePath: string, draft: Draft)`: Saves a CapCut draft to a file path (src/draft.ts).
- `lintDraft(draft: Draft, opts?: LintOptions): LintIssue[]`: Lints a CapCut draft and returns issues (src/lint.ts).
- `addAudio(draft: Draft, options: AddAudioOptions)`: Adds audio to a draft (src/factory.ts)
- `exportBatch(opts: ExportBatchOptions)`: Exports drafts in batch mode (src/export-batch.ts)

## Dependencies
Based on the `package.json` file:

- `@biomejs/biome`: For linting and formatting.
- `@types/node`: TypeScript type definitions for Node.js.
- husky: Git hooks.
- lint-staged:  For running linters on staged files.
- tsx: Execute TypeScript code directly.
- typescript: The TypeScript compiler.

## Architecture Patterns
- **Command-Line Interface (CLI):** The project is structured as a CLI tool, with commands and options defined in `command-specs.ts`.
- **Declarative Draft Compilation:**  The `compile.ts` file introduces a declarative approach to draft creation using specification files. This promotes consistency and testability.
- **Decorator Pattern:** The `decorators.ts` file utilizes decorators to add functionality to CapCut draft segments, promoting code reusability and separation of concerns.
- **Modular Design:**  The codebase is divided into modules (e.g., `ass.ts`, `caption.ts`, `chroma.ts`) with well-defined responsibilities.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **Video Editing Automation:** The core functionality of automating CapCut project creation and editing can be integrated into SEOSONA OS workflows for content generation or processing.
- **Media Processing Pipeline:**  The `probeMedia` function (src/probe.js) could be incorporated into SEOSONA's media processing pipeline to extract metadata or perform preliminary analysis on video files.
- **CLI Tooling Framework:** The project demonstrates a well-structured CLI application, which can serve as a template for developing other command-line tools within the SEOSONA OS ecosystem.  The use of TypeScript and Biome promotes code quality and maintainability.


## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `srt` · **Fit:** 99/100 · **Auto-apply:** True
- **Evidence:** `srt`, `subtitle`, `caption`
- **All scores:** {'seosona-os': 82, 'seosona-video': 84, 'seosona-content': 99, 'seosona-ux-ui': 22, 'seosona-flow': 28}
