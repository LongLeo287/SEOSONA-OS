# KI: numman-ali/openskills

## Overview
This project, `openskills`, is a command-line tool designed for AI coding agents. It allows users to install and load skills in the Anthropic SKILL.md format, providing specialized capabilities to these agents. The core functionality revolves around managing skill installations, reading skill content, syncing skill lists, and updating installed skills from their source repositories.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **Framework/Libraries:** Commander.js for command-line argument parsing (`package.json`: `commander: "^12.1.0"`), Inquirer.js for interactive prompts (`package.json`: `@inquirer/prompts: "^7.9.0"`), Chalk for terminal styling (`package.json`: `chalk: "^5.6.2"`), Ora for loading spinners (`package.json`: `ora: "^9.0.0"`)
- **Build System:** Tsup (`tsup.config.ts`, `package.json`: `"scripts": { "build": "tsup" }`)
- **Testing Framework:** Vitest (`vitest.config.ts`, `package.json`: `vitest: "^4.0.3"`)

## Public API / Exports
Based on the `src/cli.ts` file, the public API consists of the following commands accessible via the `openskills` CLI:

- `list`: Lists installed skills (`src/commands/list.ts`, `src/cli.ts`: `.command('list')`)
- `install <source>`: Installs a skill from a source (GitHub, Git URL, or local path) (`src/commands/install.ts`, `src/cli.ts`: `.command('install')`)
- `read <skill-names...>`: Reads the content of specified skills to standard output (`src/commands/read.ts`, `src/cli.ts`: `.command('read')`)
- `update [skill-names...]`: Updates installed skills from their source (`src/commands/update.ts`, `src/cli.ts`: `.command('update')`)
- `sync`: Synchronizes the list of installed skills with an AGENTS.md file (`src/commands/sync.ts`, `src/cli.ts`: `.command('sync')`)
- `manage`: Interactively manages (removes) installed skills (`src/commands/manage.ts`, `src/cli.ts`: `.command('manage')`)

## Dependencies
Based on the `package.json` file:

- `@inquirer/prompts`: "^7.9.0"
- `chalk`: "^5.6.2"
- `commander`: "^12.1.0"
- `ora`: "^9.0.0"
- `@types/node`: "^24.9.1"
- `tsup`: "^8.5.0"
- `typescript`: "^5.9.3"
- `vitest`: "^4.0.3"

## Architecture Patterns
- **Command-Line Interface (CLI):** The project utilizes Commander.js to define and handle command-line arguments, providing a structured CLI experience.  (`src/cli.ts`)
- **Modular Design:** Commands are separated into individual files within the `src/commands` directory (`src/commands/*`), promoting code organization and reusability.
- **Configuration-Driven:** Skill metadata is read from YAML files (as evidenced by `src/utils/yaml.ts` and usage in commands), allowing for flexible skill configuration.

## Relevance to SEOSONA OS
The project's ability to manage skills for AI agents could be beneficial to SEOSONA OS, particularly if the OS incorporates agent-based functionality.  Specifically:

- **Skill Management:** The `install`, `list`, `update`, and `remove` commands provide a robust system for managing specialized capabilities within the OS.
- **Agent Extensibility:** The SKILL.md format provides a standardized way to extend the functionality of agents, allowing developers to easily add new skills without modifying core OS components.
- **AGENTS.md Synchronization:**  The `sync` command ensures that the agent configuration (skills) is consistently reflected in any documentation or deployment scripts used by SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `anthropic`, `rag`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
