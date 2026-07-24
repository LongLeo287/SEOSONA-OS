# KI: darkamenosa/openzalo

## Overview
This repository contains a plugin for OpenClaw, designed to integrate with Zalo personal accounts via the openzca CLI. The plugin facilitates communication and actions within Zalo using the openzca infrastructure. It appears to be focused on providing a bridge between the OpenClaw framework and the functionality offered by the openzca tool.

## Tech Stack (from code)
- **Language:** TypeScript (`.ts` files throughout the `src/` directory).  Evidence: `src/account-id.ts` - `export const DEFAULT_ACCOUNT_ID = "default";`
- **Framework:** OpenClaw plugin SDK, as evidenced by imports like `openclaw/plugin-sdk/core`. Evidence: `index.ts` - `import { defineChannelPluginEntry } from "openclaw/plugin-sdk/core";`
- **Build System:**  esbuild and tsx are used for building and testing. Evidence: `package.json` - `"build": "esbuild index.ts setup-entry.ts --bundle ..."` and `"test": "node --import tsx ..."`

## Public API / Exports
Based on the `index.ts` file, the following are exported:
- `defineChannelPluginEntry`: From `openclaw/plugin-sdk/core`. Evidence: `index.ts` - `export default defineChannelPluginEntry({...});`
- `openzaloPlugin`: Defined in `src/channel.js`. Evidence: `index.ts` - `import { openzaloPlugin } from "./src/channel.js";`
- `setOpenzaloRuntime`: Defined in `src/runtime.js`. Evidence: `index.ts` - `import { setOpenzaloRuntime } from "./src/runtime.js";`
- `registerOpenzaloSubagentHooks`: Defined in `src/subagent-hooks.js`. Evidence: `index.ts` - `import { registerOpenzaloSubagentHooks } from "./src/subagent-hooks.js";`

## Dependencies
Based on the `package.json` file:
- `"zod": "^4.3.6"`:  A schema declaration library. Evidence: `package.json` - `"dependencies": { "zod": "^4.3.6" }`
- `"esbuild": "^0.27.3"`: A JavaScript bundler. Evidence: `package.json` - `"devDependencies": { "esbuild": "^0.27.3" }`
- `"tsx": "^4.20.5"`:  A TypeScript execution environment. Evidence: `package.json` - `"devDependencies": { "tsx": "^4.20.5" }`
- `"openclaw": ">=2026.3.23"`: The core OpenClaw framework. Evidence: `package.json` - `"peerDependencies": { "openclaw": ">=2026.3.23" }`

## Architecture Patterns
- **Plugin Architecture:**  The code heavily utilizes the OpenClaw plugin SDK, indicating a plugin-based architecture where functionality is modular and extensible. Evidence: `index.ts` - `defineChannelPluginEntry({...});`
- **Configuration-Driven:** The plugin appears to be highly configurable through JSON configuration files (e.g., `config-schema.ts`, `OpenzaloConfigSchema`).  Evidence: `src/config-schema.ts` - `export const OpenzaloChannelConfigSchema = buildChannelConfigSchema(OpenzaloConfigSchema);`
- **Command Line Interface Integration:** The plugin integrates with the openzca CLI, suggesting a command-line driven workflow for certain operations. Evidence:  `package.json` - `"manifest:channel-schema:sync": "node --import tsx ./scripts/sync-manifest-channel-config.ts"` and `src/inbound-command.ts`.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Messaging Integration:** The plugin demonstrates integration with a messaging platform (Zalo), which could be adapted for integrating SEOSONA OS with other communication channels.
- **CLI Tooling:**  The reliance on openzca CLI provides an example of how to build command-line tools that interact with the operating system and external services, potentially informing SEOSONA OS tooling development.
- **Plugin Architecture:** The plugin architecture could serve as a model for developing modular extensions and features within SEOSONA OS itself.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
