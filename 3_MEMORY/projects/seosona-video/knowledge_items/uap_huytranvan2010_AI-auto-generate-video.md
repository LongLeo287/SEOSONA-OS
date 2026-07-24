# KI: huytranvan2010/AI-auto-generate-video

## Overview
This project is designed to automatically generate Vietnamese short news videos from a script or URL, utilizing HyperFrames templates and OmniVoice TTS (text-to-speech). The pipeline appears to be command-line driven, taking a script path as input and generating video output.  The system leverages Claude Code for AI capabilities and integrates with a local TTS server.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"target": "ES2022"`, `src/cli.ts`: `import { config } from "dotenv";`)
- **Build System:**  `vitest` and `tsx` are used for testing and running scripts respectively (package.json). The project uses a standard TypeScript compilation setup (`tsconfig.json`).
- **Framework:** No explicit framework is apparent, but it appears to be structured around modular TS files.

## Public API / Exports
Based on the provided code snippets, there aren't readily identifiable public APIs or endpoints exposed directly.  The primary entry point seems to be `src/cli.ts`, which executes a pipeline. The `loadConfig` function in `src/config.ts` is exported and used internally for configuration loading.

## Dependencies
Based on `package.json`:
- `axios`: "^1.15.2" - For making HTTP requests (likely to fetch data or interact with APIs).
- `dotenv`: "^17.4.2" -  For managing environment variables.
- `p-limit`: "^7.3.0" - For rate limiting asynchronous operations.
- `zod`: "^4.3.6" - For schema validation (likely used for input data).
- `@types/node`: "^25.6.0" - TypeScript definitions for Node.js.
- `@vitest/coverage-v8`: "^4.1.5" - Vitest coverage reporter.
- `nock`: "^14.0.13" - For HTTP request mocking during testing.
- `tsx`: "^4.21.0" - To execute TypeScript files directly with Node.js.
- `typescript`: "^6.0.3" - The TypeScript compiler.
- `vitest`: "^4.1.5" - A Vite-powered test framework.

## Architecture Patterns
- **Configuration Management:**  The project uses environment variables (`.env.local`) and a configuration loading function (`src/config.ts`) to manage settings, demonstrating a common pattern for configurable applications.
- **Modular Design:** The code is organized into modules (e.g., `cli.ts`, `render/template-pipeline.ts`, `utils/logger.ts`), suggesting a modular architecture.
- **Command-Line Interface (CLI):**  The project provides a CLI (`src/cli.ts`) for executing the video generation pipeline, indicating an intended usage pattern of running from the command line.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **TTS Integration:** The OmniVoice TTS integration demonstrates a practical approach to local text-to-speech functionality that could be adapted for SEOSONA OS’s own voice capabilities.  The configuration management of the TTS endpoint and concurrency is also valuable.
- **Video Generation Pipeline:** The `runTemplatePipeline` function in `src/render/template-pipeline.ts` represents a reusable video generation pipeline, which could potentially be integrated into SEOSONA OS for creating automated content or tutorials.
- **Configuration Management Best Practices:**  The use of environment variables and the `loadConfig` function provide a solid foundation for managing configuration within SEOSONA OS applications. The validation logic in `src/config.ts` is particularly useful for ensuring correct configurations.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `render`, `hyperframe`
- **All scores:** {'seosona-os': 41, 'seosona-video': 44, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
