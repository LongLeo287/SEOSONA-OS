# KI: nghyane/ampcode-connector

## Overview
This project, `ampcode-connector`, acts as a proxy for AmpCode CLI requests through local OAuth subscriptions (Claude Code, Codex, Gemini CLI, Antigravity). It intercepts and routes these requests to the appropriate provider or falls back to the upstream AmpCode service. The application is designed to provide a secure and localized environment for interacting with AI models while managing authentication and access.

## Tech Stack (from code)
- **Language:** TypeScript (`src/index.ts` contains `import type { OAuthConfig } from "./auth/oauth.ts"`)
- **Framework:** Bun runtime (`Dockerfile`: `FROM oven/bun:1.2-alpine`, `CMD ["bun", "run", "src/index.ts"]`)
- **Build System:** Bun (package.json contains `"scripts": { ... "dev": "bun run --watch src/index.ts"}`)
- **Configuration:** YAML (`config.example.yaml` and `docker-compose.yml`), loaded via Bun's YAML parser (`src/config/config.ts`)

## Public API / Exports
Based on the `bin` section in `package.json`, the following commands are exposed:
- `ampcode-connector`:  The main entry point, accessible after installation. (`package.json`: `"bin": { "ampcode-connector": "src/index.ts" }`)
- `setup`: A CLI command for initial configuration. (`package.json`: `"scripts": { ... "setup": "bun run src/index.ts setup"}`)
- `login`: A CLI command to initiate the OAuth login flow. (`package.json`: `"scripts": { ... "login": "bun run src/index.ts login"}`)

## Dependencies
Based on `package.json`, the project's dependencies include:
- `@anthropic-ai/sdk`:  Version 0.74.0 (for Anthropic integration)
- `@google/genai`: Version 1.42.0 (for Google Gemini integration)
- `exa-js`: Version 2.4.0 (likely for web search functionality)
- `turndown`: Version 7.2.2 (for Markdown conversion)
- `turndown-plugin-gfm`: Version 1.0.2 (a plugin for Turndown to handle GitHub Flavored Markdown)
- `@biomejs/biome`: Version 2.4.2 (for code formatting and linting)
- `@types/bun`: Version 1.3.9 (TypeScript definitions for Bun)
- `@types/turndown`: Version 5.0.6 (TypeScript definitions for Turndown)

## Architecture Patterns
- **Provider Pattern:** The application utilizes a provider pattern to abstract the integration logic for different AI models (Anthropic, Codex, Google).  Each provider implements a `Provider` interface (`src\providers\base.ts`) and handles specific authentication and request forwarding details.
- **Configuration-Driven:**  The application's behavior is heavily influenced by configuration settings loaded from YAML files (`src/config/config.ts`). This allows for customization of ports, API keys, and provider configurations.
- **Streaming Proxying:** The code includes mechanisms for proxying streaming responses (SSE) from AI models to the client (`src\providers\codex-sse.ts`, `src\utils\streaming.ts`).
- **Error Handling & Fallback:**  The application incorporates error handling and fallback mechanisms, such as retries and forwarding requests to an upstream AmpCode service when local providers are unavailable or encounter errors (`src/providers/forward.ts`).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Local AI Model Integration:** The provider pattern can be adapted to integrate other LLMs into SEOSONA OS, providing users with a variety of options for local AI processing.
- **Secure Authentication Management:**  The OAuth authentication flow and token management mechanisms can be leveraged to secure access to external APIs within the SEOSONA OS environment.
- **Streaming Response Handling:** The SSE proxying code could be useful for handling streaming data from various services within SEOSONA OS, improving responsiveness and user experience.
- **Configuration Management:**  The YAML configuration system provides a flexible way to manage settings and customize behavior in SEOSONA OS modules.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `openai`, `anthropic`, `gemini`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
