# KI: carlrannaberg/claudekit

## Overview
This repository contains a CLI toolkit named "Claudekit" designed for Claude Code development workflows. It provides custom commands, hooks, and utilities to enhance Claude Code's functionality, including git checkpointing, code quality checks, and AI assistant configuration management. The project aims to be project-agnostic and improve developer productivity when working with Claude Code.

## Tech Stack (from code)
- **TypeScript:**  The primary language used for development, evidenced by numerous `.ts` files throughout the repository and the `tsconfig.json` file: `{"compilerOptions": {"target": "ES2022", "lib": ["ES2022"], ...}}`.
- **Node.js:** The runtime environment for the CLI tools, as indicated by the `engines` field in `package.json`: `"node": ">=20.0.0"` and build configurations targeting `node20`.
- **esbuild:** Used as a bundler and compiler, specified in the `build.config.ts` file: `import { build, type BuildOptions } from 'esbuild';`
- **Vitest:**  The testing framework used for unit and integration tests, defined in `vitest.config.ts`: `import { defineConfig } from 'vitest/config';`.
- **Zod:** Used for schema validation, as seen in the `cclint.config.js` file: `import { z } from 'zod';`.

## Public API / Exports
Based on the `package.json`, the following are exposed:

- **`claudekit` CLI command:**  Defined in the `bin` section of `package.json`: `"bin": { "claudekit": "./bin/claudekit" }`. This suggests a primary entry point for interacting with the toolkit.
- **`claudekit-hooks` CLI command:** Also defined in the `bin` section: `"bin": { "claudekit-hooks": "./bin/claudekit-hooks" }`.  This likely provides functionality related to Git hooks.
- **Main module export (`dist/index.cjs`)**: The `main` field in `package.json`: `"main": "./dist/index.cjs"` indicates the primary JavaScript module exported by the package.
- **Type definitions (`dist/index.d.ts`)**:  The `types` field in `package.json`: `"types": "./dist/index.d.ts"` specifies the location of TypeScript type definition files.

## Dependencies
Based on `package.json`, key dependencies include:

- `@eslint/js`: For JavaScript linting.
- `@typescript-eslint/eslint-plugin`:  TypeScript ESLint plugin.
- `@typescript-eslint/parser`: TypeScript parser for ESLint.
- esbuild: Bundler and compiler.
- vitest: Testing framework.
- zod: Schema validation library.

## Architecture Patterns
- **CLI Tooling:** The project follows a CLI tooling architecture, with commands defined in `cli/` and executed via Node.js scripts.  The `bin` section of `package.json` defines the executable entry points.
- **Hooks System:** A hook system is implemented to extend functionality, as evidenced by files in `cli/hooks/` and references in configuration files like `cclint.config.js`.
- **Configuration Driven:** The toolkit appears to be configurable through JSON files (e.g., `.claudekit/config.json`), allowing users to customize behavior.
- **Modular Design:**  The codebase is structured into modules within the `cli/` directory, suggesting a modular design approach.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Code Quality Enforcement:** The linting and testing infrastructure (ESLint, Vitest) can be integrated into SEOSONA’s build pipelines to enforce coding standards and improve overall code quality.  The `cclint.config.js` file provides a starting point for customizing these rules.
- **CLI Tooling Framework:** The CLI architecture demonstrated in Claudekit could serve as a template or inspiration for building custom command-line tools within SEOSONA OS, particularly for tasks related to development and deployment.
- **Hook System Integration:**  The hook system provides a mechanism for extending functionality; this pattern can be adapted to integrate with SEOSONA's existing workflows and automate repetitive tasks.
- **AI Assistant Configuration Management:** The toolkit’s focus on AI assistant configuration could inform the design of similar systems within SEOSONA, allowing for more granular control over AI behavior and integration.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`
- **All scores:** {'seosona-os': 66, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 28}
