# KI: moazbuilds/claudeclaw

## Overview
ClaudeClaw is a daemon designed to augment Claude AI with additional functionality, such as plugin support and integrations with messaging platforms like Discord and Telegram. The codebase demonstrates a focus on managing sessions, executing commands, and interacting with external services through APIs. It appears to be built for extensibility, allowing users to add custom plugins and modify behavior via configuration files.

## Tech Stack (from code)
- **Language:** TypeScript (`.ts` file extensions are prevalent throughout the `src/` directory).
- **Framework:**  The project utilizes Bun as its runtime environment (indicated by `tsconfig.json`: `"types": ["bun"]` and `package.json`: `"name": "claudeclaw"` and scripts using `bun run`).
- **Build System:** Bun is also used for building the project, as evidenced by the build scripts in `package.json`.

## Public API / Exports
Due to the nature of this being a daemon, there's no immediately obvious public HTTP API. However, based on the command execution logic in `src/index.ts`, the following commands are exposed:

- `--stop-all`: Stops all running ClaudeClaw daemons.
- `--stop`: Stops the current ClaudeClaw daemon.
- `--clear`: Clears the active session.
- `start`: Starts the ClaudeClaw daemon (or resumes from a paused state).
- `status`: Displays the status of the daemon.
- `telegram`: Executes actions related to Telegram integration.
- `discord`: Executes actions related to Discord integration.
- `slack`: Executes actions related to Slack integration.
- `send`: Sends a message through ClaudeClaw, potentially via Telegram or Discord.

## Dependencies
Based on `package.json`, the project has the following dependencies:

- `"ogg-opus-decoder": "^1.7.3"`:  Likely used for audio processing related to Whisper integration (see `src/whisper.ts`).
- `@types/bun`: TypeScript type definitions for Bun.

## Architecture Patterns
- **Command Pattern:** The `src/commands` directory demonstrates a command pattern, where different actions are encapsulated in separate modules (`clear.ts`, `discord.ts`, etc.).  The main entry point (`src/index.ts`) dispatches commands based on arguments passed to the daemon.
- **Plugin Architecture:** The presence of `plugins.ts` and related files suggests a plugin architecture, allowing for extensibility via custom plugins (see PluginManager class).
- **Configuration-Driven Design:**  The project relies heavily on configuration files (`settings.json`, `plugin manifest files`) to control behavior and integrations.

## Relevance to SEOSONA OS
- **Messaging Integration:** The Discord and Telegram integration capabilities could be leveraged for SEOSONA OS notifications or interactions with external services.
- **Plugin System:**  The plugin architecture provides a mechanism for extending SEOSONA OS functionality without modifying core system components. This aligns well with the modular design principles of SEOSONA OS.
- **Daemonization:** The daemon structure allows ClaudeClaw to run in the background, providing persistent and automated services that could be integrated into SEOSONA OS's backend processes.  The PID file management is a key aspect for reliable daemon operation.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 24, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
