# KI: pbakaus/impeccable

## Overview
This repository contains a collection of design skills, commands, and anti-pattern detection tools for AI coding agents. The project aims to provide standardized design guidance and automated checks for various frontend development tasks, with a focus on accessibility and user experience. It leverages a modular architecture and integrates with multiple platforms including Claude, Cursor, Gemini, GitHub Copilot, Kiro, OpenCode, Pi, and Rovode.

## Tech Stack (from code)
- **JavaScript/TypeScript:** The project is primarily written in JavaScript and TypeScript (`.mjs`, `.js`, `.ts` files).  The `package.json` file confirms this: `"type": "module"`.
- **Bun:** Used as the build system and runtime environment, indicated by the presence of `bun.lock` and commands like `bun run`. The `package.json` also specifies `"engines": { "node": ">=24" }`, suggesting Bun is preferred over Node.
- **Astro:**  Used for building a website (`astro.config.mjs`, `npx astro build`).
- **Cloudflare Pages:** Used for deployment, as indicated by the `wrangler.toml` file and the `deploy` script in `package.json`.

## Public API / Exports
The project exposes several modules and functions through its exports:
-  `./cli/engine/detect-antipatterns.mjs`: The main entry point for the anti-pattern detection functionality, as specified in `"main": "./cli/engine/detect-antipatterns.mjs"` within `package.json`.
- `./browser`: Exports browser related code, specifically  `./cli/engine/detect-antipatterns-browser.js`, as defined by the `"exports": { ".\\browser": "./cli/engine/detect-antipatterns-browser.js" }` section in `package.json`.

## Dependencies
Based on the `package.json` file, key dependencies include:
- **astro:** For website building.
- **node:**  As an engine requirement.
- Various testing libraries and utilities (identified by examining script commands).

## Architecture Patterns
- **Modular Design:** The project is highly modular, with distinct directories for CLI tools (`cli/`), browser extensions (`extension/`), website content (`site/`), and design skills (`skill/`).
- **Plugin-Based System:**  The use of `.agents/` and similar folders suggests a plugin or extension architecture where different platforms can integrate with the core Impeccable functionality.
- **Configuration-Driven:** The project relies heavily on configuration files like `SKILL.src.md`, `reference/*.md`, `command-metadata.json`, and `PRODUCT.md` to define design rules, commands, and behavior.
- **Command Pattern:**  The structure within the `skill/` directory (especially `SKILL.src.md` and related files) indicates a command pattern where users invoke specific actions (`audit`, `polish`) through a central skill.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Design System Integration:** The anti-pattern detection capabilities could be integrated into SEOSONA OS’s design system to automatically identify and correct accessibility or UX issues during development.
- **AI Agent Enhancement:**  The skill architecture and command pattern could serve as a model for building AI agents within SEOSONA OS, allowing users to invoke specific design tasks through natural language commands.
- **Code Quality Assurance:** The modularity and configuration-driven approach could be adapted to create reusable components for code quality assurance and automated testing within the SEOSONA OS environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `openai`, `rag`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
