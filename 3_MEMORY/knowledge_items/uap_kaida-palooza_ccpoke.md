# KI: kaida-palooza/ccpoke

## Overview
This project, `ccpoke`, is a CLI tool designed to poke users via various AI agent integrations (Claude Code, Cursor, Codex, Gemini CLI, OpenCode) through channels like Telegram, Discord, and Slack. It aims to provide zero-configuration notifications when these agents complete tasks, acting as an automation bridge for developer workflows. The project includes features for managing configurations, setting up agents, and handling channel communication.

## Tech Stack (from code)
- **TypeScript:**  The primary language used extensively throughout the codebase (`src` directory contains 115 `.ts` and 5 `.tsx` files). `tsconfig.json` confirms this: `"compilerOptions": { "target": "ES2022", ... }`.
- **Node.js:** The project is built for Node.js, as evidenced by the `#!/usr/bin/env node` shebang in `src/index.ts` and the `package.json`: `"type": "module"` and `"engines": { "node": ">=20" }`.
- **Astro:**  The existence of a `web` directory, along with files like `web/astro.config.mjs`, indicates that Astro is used for building web components or a website associated with the project.
- **pnpm:** Package manager used as indicated by `"packageManager": "pnpm@10.28.2"` in `package.json`.

## Public API / Exports
Based on the `src/index.ts` file, the main exported function is:
- `startBot()`: This appears to be the entry point for running the bot functionality.  It's called when no command line arguments are provided.

Other notable exports include:
- `AgentHandler`: Exported from `src/agent/agent-handler.ts`
- `ConfigManager`: Exported from `src/config-manager.ts`
- `runChannel`: Exported from `src/commands/channel.ts`
- `runHelp`: Exported from `src/commands/help.ts`

## Dependencies
Based on the `package.json`, key dependencies include:
- `@clack/prompts`: For interactive prompts in the CLI.
- `@ngrok/ngrok`:  For creating tunnels.
- `@slack/web-api`: For Slack integration.
- `discord.js`: For Discord integration.
- `node-telegram-bot-api`: For Telegram integration.
- `pino` and `pino-pretty`: For logging.

## Architecture Patterns
- **Modular Design:** The project is structured into modules (e.g., `agent`, `channel`, `config-manager`, `hooks`) with clear responsibilities, promoting code reusability and maintainability.
- **Provider Pattern:**  The agent integrations follow a provider pattern (`src/agent`), where each AI service has its own provider class responsible for installation, parsing events, and interacting with the service. This allows for easy addition of new agents without modifying core logic.
- **Command Pattern:** The `commands` directory suggests a command pattern, where different actions (e.g., setup, channel management, bug reporting) are encapsulated as separate commands.
- **Configuration Management:**  The project utilizes a configuration file (`src/config-manager.ts`) to store and manage settings, allowing for customization and persistence of user preferences.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Integration with AI Agents:** The agent provider pattern can be adapted to integrate various AI agents into SEOSONA OS, enabling automated workflows and task completion.
- **Cross-Platform Communication:**  The channel integration modules (Discord, Slack, Telegram) demonstrate robust cross-platform communication capabilities that could be leveraged for SEOSONA OS notifications and interactions.
- **CLI Tooling Framework:** The CLI structure and command handling logic can serve as a template for building other command-line tools within the SEOSONA OS ecosystem.
- **Configuration Management Best Practices:**  The configuration management approach provides valuable insights into how to handle user settings and preferences in a scalable and maintainable manner.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
