# KI: santifer/career-ops

## Overview
This repository contains a pipeline for AI-assisted job searching and application management, designed to be highly customizable and adaptable to individual user needs. It leverages large language models (LLMs) like Gemini, Claude, and OpenAI's models to automate tasks such as CV generation, cover letter writing, and recruiter outreach. The system emphasizes a clear separation between core functionality and user-specific customizations.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The primary language for the project, evidenced by files like `add-entry.mjs`, `analyze-patterns.mjs`, `.tsx` files in various directories, and the `package.json` file.
- **Node.js:** Used as the runtime environment, confirmed by the presence of `package.json` and numerous `.mjs` files.
- **Playwright:**  A browser automation library used for web scraping and testing, indicated by the `Dockerfile`: `FROM mcr.microsoft.com/playwright:v1.61.1-jammy` and the `postinstall` script in `package.json`: `"npx playwright install chromium --with-deps"`.
- **Go:** Used for the dashboard TUI, as shown by the `Dockerfile`: `ARG GO_VERSION=1.23.4` and the `serve:dashboard` script in `package.json`:  `"cd dashboard && go run . --path .."`
- **Docker:** The project is containerized using Docker, evidenced by the `Dockerfile` and `docker-compose.yml`.

## Public API / Exports
Due to the nature of this project (primarily a CLI tool and automation pipeline), there isn't a traditional public API in the sense of HTTP endpoints. However, several scripts appear to be designed for command-line execution:

- `doctor.mjs`:  `"doctor": "node doctor.mjs"` - Likely performs system checks or diagnostics.
- `scan.mjs`: `"scan": "node scan.mjs"` -  Performs a job search scan.
- `add-entry.mjs`: `"add": "node add-entry.mjs"` - Adds an entry to the tracker.
- `generate-pdf.mjs`: `"pdf": "node generate-pdf.mjs"` - Generates a PDF document (likely a CV).

These scripts are invoked via command line and likely have internal flags or arguments for configuration, but their specific exported functions/classes aren't directly exposed in the code.

## Dependencies
Based on `package.json`:

- **playwright:** Version 1.58.1 - For browser automation.
- **npm:**  (Implicitly) Used as a package manager.
- Numerous other dependencies are listed in `package.json`, including libraries for data processing, LLM interaction (OpenAI, Gemini), and testing.

## Architecture Patterns
- **Plugin System:** The project utilizes a plugin system, allowing for extensibility and customization. This is evident from the `plugins.mjs` file and the `renovate.json` configuration.  Plugins are enabled/disabled via `config/plugins.yml`.
- **Layered Architecture (Data Contract):** A clear separation between user customizations (`User Layer`) and core system files (`System Layer`) is enforced, as described in `DATA_CONTRACT.md` and `AGENTS.md`. This promotes maintainability and prevents accidental overwrites of user configurations during updates.
- **Modular Design:** The codebase appears to be modular, with numerous `.mjs` scripts handling specific tasks (e.g., CV generation, recruiter outreach).
- **Configuration-Driven:**  The system relies heavily on configuration files (`config/profile.yml`, `portals.yml`) to control behavior and customize workflows.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **LLM Integration Patterns:** The codebase demonstrates practical patterns for integrating with various LLMs (Gemini, Claude, OpenAI), which can be adapted for use within SEOSONA OS’s AI capabilities.  The `openrouter-runner.mjs` script provides a good example of abstracting over different API providers.
- **Customizable Automation Pipelines:** The plugin system and modular design could inspire similar approaches in SEOSONA OS to allow users to extend and customize its functionality.
- **Data Contract Enforcement:** The strict data contract enforced between user customizations and core system files is a valuable pattern for managing configuration and preventing conflicts, which can be applied to any component within SEOSONA OS that allows user customization.
- **Browser Automation Techniques:**  The use of Playwright for web scraping and automation could provide useful techniques for tasks such as data extraction or automated testing within the SEOSONA OS ecosystem.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `openai`, `ollama`, `gemini`, `rag`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 28}
