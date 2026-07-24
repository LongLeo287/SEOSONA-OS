# KI: qwibitai/nanoclaw

## Overview
Nanoclaw is a personal AI assistant, designed as a lightweight and secure alternative to existing solutions like Claude. It utilizes containerization for agent execution and focuses on message-based communication between the host and containers. The project emphasizes customization and aims to provide a modular architecture for extending functionality through skills.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **Framework:** Node.js (`package.json`: `"type": "module"`), Vitest (`vitest.config.ts`),  `@clack/core`, `@onecli-sh/sdk`
- **Build System:** `pnpm` (`package.json`: `"packageManager": "pnpm@10.33.0"`) and `tsc` (`package.json`: `"scripts": { "build": "tsc" }`)

## Public API / Exports
Based on the limited code provided, it's difficult to definitively list all public APIs. However, some notable exports include:

- `enforceStartupBackoff()` from `src/circuit-breaker.ts` -  A function for managing startup delays based on previous failures.
- `composeGroupClaudeMd()` from `src/claude-md-compose.ts` - A function responsible for composing the CLAUDE.md file for agent groups.
- `gateCommand()` from `src/command-gate.ts` -  A function that filters and authorizes commands before they reach containers.

## Dependencies
Based on `package.json`:
- `@clack/core`: "^1.2.0"
- `@clack/prompts`: "^1.2.0"
- `@onecli-sh/sdk`: "2.2.1"
- `better-sqlite3`: "11.10.0"
- `chat`: "4.29.0"
- `cron-parser`: "5.5.0"
- `kleur`: "^4.1.5"
- TypeScript: "^5.7.0"
- Vitest: "^4.0.18"

## Architecture Patterns
- **Containerization:** The project heavily relies on container technology, as evidenced by the `container-runner.ts` file and references to Docker in configuration files.  This suggests a microservices architecture where agents run within isolated containers.
- **Message Passing:** Communication between the host and agent containers is primarily message-based, with sessions acting as a central communication hub (`src/index.ts`).
- **Plugin Architecture (Skills):** The project utilizes a plugin system ("skills") that allows for extending functionality by adding new capabilities to agents. This is evident in the directory structure under `.agents/skills` and references to skill management within configuration files.
- **Configuration Management:**  The use of environment variables (`src/config.ts`) and configuration files (e.g., `container.json`) indicates a focus on flexible and configurable deployments.

## Relevance to SEOSONA OS
- **Containerization for Microservices:** Nanoclaw's containerized architecture aligns well with the microservice design principles that could be adopted in SEOSONA OS, enabling modularity and scalability.
- **Message-Based Communication:** The message passing pattern used by Nanoclaw can inform the design of inter-process communication mechanisms within SEOSONA OS.
- **Plugin Architecture for Extensibility:**  The skill system provides a valuable model for creating an extensible platform in SEOSONA OS, allowing developers to add new features and integrations without modifying core components.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
