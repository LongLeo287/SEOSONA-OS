# KI: anthropics/claude-plugins-official

## Overview
This repository appears to be a collection of official plugins for Claude, an AI assistant developed by Anthropic. The plugins are designed to extend Claude’s capabilities by allowing it to interact with external services and data sources.  The structure suggests these are packaged as individual plugin projects, often including server components and skill definitions.

## Tech Stack (from code)
- **Python:** Found in `plugins/agent-sdk-dev` directory; the presence of `.py` files indicates Python usage. Example: `plugins/agent-sdk-dev/agents/agent-sdk-verifier-py.md`.
- **TypeScript:**  Used within several plugin directories, particularly those with server components (e.g., Discord, iMessage, Telegram). Evidence is found in the presence of `.ts` files and associated build configurations. Example: `discord/server.ts`.
- **Node.js / Bun:** The existence of `package.json` and `bun.lock` files within plugin directories like Discord, iMessage, and Telegram indicates usage of Node.js or Bun for server-side JavaScript development.  Example: `telegram/.npmrc`, `telegram/bun.lock`.
- **JSON:** Used extensively for configuration and data serialization across all plugins. Example: `.claude-plugin/plugin.json` in multiple plugin directories.

## Public API / Exports
Due to the nature of this repository as a collection of individual plugin projects, there isn't a single, unified public API. Each plugin defines its own API through its `plugin.json` file and associated server code (where applicable).  The structure within `.claude-plugin/plugin.json` suggests a common pattern for defining capabilities and endpoints, but the specifics vary by plugin. For example, in the Discord plugin:

```json
// discord/.claude-plugin/plugin.json
{
  "schema_version": "1.0",
  "name_slug": "discord",
  "display_name": "Discord",
  "logo_url": "https://www.anthropic.com/wp-content/uploads/2024/01/Discord-Plugin-Logo.png",
  "description": "Connect to Discord servers and channels.",
  "capabilities": [
    {
      "name": "get_channels",
      "description": "Get a list of available Discord channels.",
      "type": "internal",
      "parameters": {}
    },
    // ... other capabilities
  ]
}
```

This `plugin.json` defines the plugin's name, description, logo URL and its capabilities (e.g., `get_channels`). The actual implementation of these capabilities is found in the server code (`discord/server.ts`).

## Dependencies
Dependencies are managed within each plugin’s individual project files (primarily `package.json` for Node.js/Bun projects).  A comprehensive list would require parsing all those files, but examples include:

```json
// telegram/.npmrc
@types/node:^18.0.0
bun: ^1.0.0
```

This shows that the `telegram` plugin uses `@types/node` and Bun as dependencies.  Similar dependency lists can be found in other plugins using Node.js or Bun.

## Architecture Patterns
- **Plugin-Based Architecture:** The entire repository is structured around a plugin architecture, with each directory representing an independent plugin project. This promotes modularity and reusability.
- **Skill Definitions:** Many plugins utilize "skills" (e.g., in Discord, iMessage, Telegram) which appear to be specific functionalities or tasks the plugin can perform. These skills are often defined using Markdown files (`SKILL.md`) and associated configuration.
- **Server Components:** Several plugins include server components written in TypeScript/JavaScript (e.g., `server.ts` in Discord, iMessage, Telegram) that handle communication with external services and process requests from Claude.
- **`.mcp.json` Configuration:** The presence of `.mcp.json` files suggests a mechanism for managing plugin metadata or configuration specific to Anthropic's Claude platform.

## Relevance to SEOSONA OS
The plugin architecture employed in this repository could be beneficial to SEOSONA OS by providing a modular and extensible framework for integrating external services.  The skill definition pattern, particularly, offers a structured way to define and manage functionalities that can be leveraged within the operating system's user interface or automation workflows. The use of TypeScript and Node.js/Bun also aligns with common web development practices, making it easier to integrate these plugins into SEOSONA OS’s existing infrastructure.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
