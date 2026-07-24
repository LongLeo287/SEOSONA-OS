# KI: huytranvan2010/AI-auto-generate-video

## Overview
This project aims to automatically generate Vietnamese short news videos from URLs or text using HyperFrames templates and a TTS (Text-to-Speech) service, specifically OmniVoice. The pipeline leverages Claude Code for content generation and integrates with local TTS servers.  The primary entry point is a command-line interface that processes scripts defining video creation parameters.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"target": "ES2022"`, `src/cli.ts`: `typescript` file).
- **Framework:**  Uses standard Node.js modules and a custom rendering pipeline.
- **Build System:** Vitest for testing, and `tsx` for running scripts (package.json: `"test": "vitest run --passWithNoTests"`, `"sfx:download": "tsx scripts/download-sfx.ts"`).
- **Configuration:** Uses `.env.local` files and the `dotenv` package (`package.json`: `"dependencies": {"dotenv": "^17.4.2"}`, `src/cli.ts`: `import { config } from "dotenv";`).

## Public API / Exports
Based on the provided code snippets, it's difficult to determine a formal public API. However, the following functions appear to be central:

- `runTemplatePipeline` (from `src/render/template-pipeline.ts` - not shown): This function is called from `src/cli.ts` and appears to orchestrate the video generation process.
- `loadConfig` (from `src/config.ts`):  Loads configuration settings, including TTS provider and endpoint details.

## Dependencies
Based on `package.json`:
- `"axios": "^1.15.2"`: For making HTTP requests.
- `"dotenv": "^17.4.2"`: For managing environment variables.
- `"p-limit": "^7.3.0"`:  Likely used for rate limiting or concurrency control.
- `"zod": "^4.3.6"`: Used for schema validation (likely in configuration).
- `@vitest/coverage-v8`: For test coverage reporting.
- `nock`: For HTTP request mocking during testing.
- `tsx`:  A tool to execute TypeScript files directly with Node.js.
- `@types/node`: Type definitions for Node.js.

## Architecture Patterns
- **Command-Line Interface (CLI):** The project provides a CLI (`src/cli.ts`) that accepts script paths as arguments and triggers the video generation pipeline.
- **Configuration Management:**  Uses environment variables and `dotenv` to manage configuration settings, allowing for customization without modifying code.
- **Modular Design:** Code is structured into modules (e.g., `render`, `tts`, `utils`), promoting separation of concerns.
- **Test Driven Development (TDD):** The presence of test files (`*.test.ts`) suggests a TDD approach to development, with tests for configuration loading and other core components.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **TTS Integration:**  The `omnivoice-client.ts` file demonstrates integration with a local TTS server. This pattern could be adapted to integrate SEOSONA OS with various TTS services, enhancing its accessibility and content creation capabilities.
- **Video Generation Pipeline:** The overall pipeline architecture for automated video generation (script processing, template rendering, audio integration) provides a valuable example that can inform the design of similar features within SEOSONA OS.  The use of HyperFrames templates suggests a flexible approach to video customization.
- **Configuration Management:** The robust configuration management system using environment variables and `dotenv` is a best practice that could be adopted by SEOSONA OS for managing various settings and integrations.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `tts` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `tts`, `omnivoice`
- **All scores:** {'seosona-os': 22, 'seosona-video': 44, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 22}
