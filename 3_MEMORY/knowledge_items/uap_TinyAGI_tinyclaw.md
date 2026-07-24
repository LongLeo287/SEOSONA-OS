# KI: TinyAGI/tinyclaw

## Overview
TinyAGI is a multi-agent, multi-team, multi-channel AI assistant designed for persistent operation and proactive message handling. It allows users to define agents with specific roles and responsibilities, enabling automated task execution and communication across various channels like Discord, Telegram, and WhatsApp. The project emphasizes agent routing, team collaboration, and monitoring through heartbeats.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json` references `.ts` and `.tsx` files).
- **Framework:** Hono ([packages/server/package.json](https://github.com/TinyAGI/tinyclaw/blob/main/packages/server/package.json) lists `@hono/node-server` and `hono` as dependencies), React (`packages/visualizer/package.json` lists react).
- **Build System:**  TypeScript compiler (referenced in `tsconfig.json`, `packages/core/package.json`, `packages/teams/package.json`, etc.). npm is used for package management ([package.json](https://github.com/TinyAGI/tinyclaw/blob/main/package.json)).
- **Database:** SQLite (`packages/core/package.json` lists `better-sqlite3`).

## Public API / Exports
Due to the nature of TypeScript and modular design, directly identifying "public" APIs is challenging without more context. However, based on export statements in files like `packages/core/src/index.ts`, some exported items include:

*   `MessageJobData`: A type definition (likely an interface or class) within `@tinyagi/core`.
*   `getSettings()`:  A function from `@tinyagi/core` to retrieve settings.
*   `log()`: A logging utility function from `@tinyagi/core`.
*   `invokeAgent()`: Function for invoking agents, found in `packages/core/src/index.ts`.

The server exposes API endpoints as defined in the Hono routes (e.g., `/api/status`, `/api/agents`).  These are not directly exported but accessible via HTTP requests.

## Dependencies
Based on `package.json` and related files:

*   `@tinyagi/core`: Core functionalities of TinyAGI.
*   `@tinyagi/teams`: Team management and communication features.
*   `@tinyagi/server`: API server implementation using Hono.
*   `@tinyagi/channels`: Integrations for Discord, Telegram, WhatsApp.
*   `@hono/node-server`: Node.js runtime for the Hono web framework.
*   `hono`:  The Hono web framework itself.
*   `discord.js`: Library for interacting with Discord API.
*   `grammy`: Telegram bot framework.
*   `whatsapp-web.js`: WhatsApp client library.
*   `better-sqlite3`: SQLite database driver.
*   `croner`:  Cron job scheduler.
*   `dotenv`: Environment variable management.

## Architecture Patterns
*   **Modular Design:** The project is heavily structured into packages (`packages/core`, `packages/teams`, etc.), promoting code reusability and separation of concerns.
*   **Plugin System:** There's a mention of plugins in the core package, suggesting an extensible architecture where functionality can be added without modifying core components.
*   **Event-Driven Architecture:** The use of SSE (Server-Sent Events) for real-time updates ([SSE-EVENTS.md](https://github.com/TinyAGI/tinyclaw/blob/main/docs/SSE-EVENTS.md)) indicates an event-driven communication pattern.
*   **Agent-Based System:**  The core functionality revolves around agents, each with defined roles and responsibilities, demonstrating a clear agent-based architecture.

## Relevance to SEOSONA OS
TinyAGI's code could benefit SEOSONA OS in several ways:

*   **Automated Task Execution:** The agent framework can be adapted to automate repetitive tasks within SEOSONA OS, such as data processing or system monitoring.
*   **Multi-Channel Communication:**  The integration with various messaging platforms (Discord, Telegram, WhatsApp) could be leveraged for SEOSONA OS's communication needs.
*   **Modular Design & Extensibility:** The modular architecture allows for easy integration of new functionalities and extensions into the SEOSONA OS ecosystem. Specifically, the plugin system would allow for adding custom integrations without modifying core components.
*   **Persistent Operation & Monitoring:**  The heartbeat monitoring mechanism could be incorporated to ensure the stability and availability of critical SEOSONA OS services.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
