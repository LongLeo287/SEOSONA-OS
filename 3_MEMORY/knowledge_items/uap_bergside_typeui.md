# KI: bergside/typeui

## Overview
This project, `typeui.sh`, is a command-line interface (CLI) tool designed to generate design system specifications and style guides in a format suitable for AI coding providers like Claude, Codex, and others. It allows users to create or update these "skills" files, which are essentially structured markdown documents containing design information. The project aims to simplify the process of creating AI-compatible design documentation.

## Tech Stack (from code)
- **TypeScript:**  The primary language used for most of the codebase. `tsconfig.json` confirms this: `"compilerOptions": { "target": "ES2022", "module": "CommonJS", ... , "strict": true, "skipLibCheck": true, "forceConsistentCasingInFileNames": true, "resolveJsonModule": true }`.  The `src/cli.ts` file is the entry point for the CLI application.
- **Node.js:** The runtime environment for the TypeScript code. This is evident from the `package.json`'s `"main": "dist/cli.js"` and `"bin": { "typeui.sh": "dist/cli.js" }`.
- **Commander.js:** Used for parsing command-line arguments.  This is a dependency listed in `package.json`: `"dependencies": { "commander": "^14.0.3", ...}`. The `src\cli.ts` file imports and uses it: `import { Command } from "commander";`.
- **Zod:** Used for schema validation, particularly within the design system definition process.  This is a dependency in `package.json`: `"dependencies": { "zod": "^4.3.6"}`. It's used to validate input and data structures.

## Public API / Exports
Due to the nature of this project being a CLI tool, there are no readily apparent public APIs or endpoints exposed directly. The primary interface is through command-line arguments passed to `typeui.sh`.  However, based on the code structure, some key functions appear to be used internally and could potentially be extracted for reuse:

- `slugifySkillName` (from `src/skillMetadata.ts`): Converts a skill name into a URL-friendly slug.
- `buildDefaultSkillMetadata` (from `src/skillMetadata.ts`): Creates default metadata for a skill.
- Functions within the `prompt...` files in `src/prompts`: These functions handle user interaction and data gathering, suggesting a modular approach to prompting logic.

## Dependencies
Based on `package.json`, key dependencies include:

- **commander:**  For command-line argument parsing.
- **inquirer:** For interactive prompts (user input).
- **zod:** For schema validation.
- **tsx:** A TypeScript execution environment.
- **typescript:** The TypeScript compiler itself.
- **vitest:** A testing framework.

## Architecture Patterns
- **CLI Application:**  The project follows a standard CLI architecture, with a main entry point (`src/cli.ts`) that parses arguments and orchestrates the core logic.
- **Modular Design:** The code is organized into modules (e.g., `prompts`, `generation`, `registry`), suggesting a modular design approach for different functionalities.
- **Configuration-Driven:**  The use of configuration files (`tsconfig.json`, `package.json`) indicates a reliance on external configuration to control build processes and dependencies.
- **Plugin Architecture (Implied):** The directory structure, particularly the presence of subdirectories like `plugins/antigravity/typeui/` suggests a plugin architecture where different AI providers or integrations can extend the core functionality.

## Relevance to SEOSONA OS
The code from `bergside/typeui` could be beneficial for SEOSONA OS in several ways:

- **Skill Generation Automation:** The core functionality of generating design system skills could be integrated into SEOSONA OS's workflow, automating the creation of AI-compatible documentation.
- **Plugin Framework Adaptation:**  The plugin architecture hints at a flexible extension model that could be adapted to allow SEOSONA OS users to create custom integrations or providers.
- **Design System Standardization:** The project promotes standardization in design system representation, which aligns with SEOSONA OS's goals of consistent user experience across different platforms and AI agents.  The `SKILL.md` files generated are a concrete example of this standardization effort.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
