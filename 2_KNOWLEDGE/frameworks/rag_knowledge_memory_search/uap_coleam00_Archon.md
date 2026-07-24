# KI: coleam00/Archon

## Overview
Archon is a self-hostable, governed agentic automation engine designed for remote coding and potentially broader business operations. It allows users to control AI coding assistants (like Claude Code) from various platforms (Slack, Telegram, GitHub). The architecture prioritizes simplicity, flexibility, governance, and user control with a single-tenant deployment model.

## Tech Stack (from code)
- **Languages:** TypeScript, JavaScript (evidence: `.ts`, `.tsx`, `.js`, `.jsx` files throughout the repository)
- **Frameworks/Libraries:** React (evidence: `packages/web/package.json` includes `@types/react`, `react`, `react-dom`), Vite (`packages/web/scripts` contains build scripts using vite), Hono (`packages/server/package.json` lists `hono`), Tailwind CSS (`packages/web/package.json` includes tailwindcss)
- **Build System:** Bun (evidence: `bunfig.toml`, `package.json` specifies `"engines": { "bun": "^1.3.0" }`, Dockerfile uses `FROM oven/bun`)
- **Database:** SQLite and PostgreSQL are supported (evidence: `Dockerfile` mentions both, `.env.example` provides configuration for PostgreSQL)

## Public API / Exports
Based on the `packages/core/src/index.ts` file, some exported types and functions include:
- `ConversationNotFoundError`: A class indicating a conversation was not found.
- `IPlatformAdapter`: An interface defining the contract for platform adapters.
- `syncWorkspace`: Function to synchronize a workspace with a Git repository (located in `packages/git/src/repo.ts`).
- `getArchonHome`:  Function to determine the Archon home directory (`packages/paths/src/archon-paths.ts`).

## Dependencies
Based on `package.json` and individual package's `package.json` files, key dependencies include:
- `@anthropic-ai/claude-agent-sdk`: For interacting with Claude Code (evidence: `packages/providers/package.json`)
- `@slack/bolt`:  For Slack integration (`packages/adapters/package.json`)
- `grammy`: For Telegram integration (`packages/adapters/package.json`)
- `discord.js`: For Discord integration (`packages/adapters/package.json`)
- `hono`: A web framework used in the server (`packages/server/package.json`)
- `zod`:  For schema validation (`packages/server/package.json`)

## Architecture Patterns
- **Modular Monorepo:** The project is structured as a monorepo with multiple packages (e.g., `@archon/core`, `@archon/adapters`, `@archon/web`), promoting code reuse and modularity.  (evidence: `package.json`'s `workspaces` array).
- **Plugin Architecture:** The use of platform adapters (`IPlatformAdapter`) suggests a plugin architecture, allowing for easy integration with different communication platforms. (evidence: `packages/adapters/src/index.ts`).
- **Configuration-Driven:**  The project relies heavily on configuration files (e.g., `.env`, `docker-compose.yml`, `config.yaml` in `.archon`) to customize behavior and connect to external services. (evidence: multiple references throughout the code).

## Relevance to SEOSONA OS
Archon's architecture could be valuable for SEOSONA OS in several ways:
- **Automation of repetitive tasks:** The agentic automation engine can automate various operational workflows within SEOSONA OS, reducing manual effort and improving efficiency.
- **Integration with external services:**  The plugin architecture allows seamless integration with existing SEOSONA OS components and third-party services.
- **Customizable governance:** Archon's emphasis on governance and user control aligns with the need for secure and auditable automation within a complex operating system environment. The single-tenant design is particularly relevant for security isolation.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `workflow`, `mcp`, `router`
- **All scores:** {'seosona-os': 100, 'seosona-video': 22, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 56}
