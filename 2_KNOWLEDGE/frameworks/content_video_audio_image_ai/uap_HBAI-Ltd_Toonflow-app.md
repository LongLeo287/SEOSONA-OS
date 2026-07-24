# KI: HBAI-Ltd/Toonflow-app

## Overview
This project, "Toonflow," is an AI short drama/animation tool designed to automatically convert novels into scripts and generate images and videos using AI technology for efficient short drama creation. The application appears to be built as a desktop application with backend server functionality, likely intended for creative content generation workflows.  The code suggests it's targeted towards Chinese language users based on comments and file names.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"target": "ESNext"`, `*.ts` files throughout the codebase).
- **Framework:** Express (`src/app.ts`: `import express from "express";`).
- **Build System:** Yarn (`package.json`: `"packageManager": "yarn@1.0.0"`),  TypeScript compiler (referenced in `tsconfig.json`).
- **Electron:** The application is built as an Electron app (`electron-builder.yml`, `src/app.ts`: `const { dialog, app } = require("electron");`).

## Public API / Exports
Based on the `src/router.ts` file (which appears to be a central routing configuration), several routes are exposed:
- `/api/agents/clearMemory`
- `/api/agents/getMemory`
- `/api/artStyle/addArtStyle`
- `/api/artStyle/editArtStyle`
- `/api/assets/addAssets`
- `/api/assets/batchDelete`
- `/api/cornerScape/batchBindAudio`

This is not an exhaustive list, but represents some of the publicly accessible endpoints.  The `src/router.ts` file dynamically generates these routes based on modules found in the `src/routes` directory.

## Dependencies
Based on `package.json`:
- `@ai-sdk/anthropic`: "^3.0.35"
- `@ai-sdk/deepseek`: "^2.0.17"
- `@ai-sdk/devtools`: "^0.0.11"
- `@ai-sdk/google`: "^3.0.20"
- `@ai-sdk/openai`: "^3.0.25"
- `@ai-sdk/openai-compatible`: "^2.0.27"
- `@ai-sdk/xai`: "^3.0.47"
- `@huggingface/transformers`: "^3.8.1"
- `axios`: "^1.13.2"
- `better-sqlite3`: "^12.9.0"
- `compressing`: "^2.1.0"
- `cors`: "^2.8.5"
- `dotenv`: "^17.2.3"
- `express`: "^5.2.1"
- `express-ws`: "^5.0.2"
- `fast-glob`: "^3.3.3"
- `form-data`: "^4.0.5"
- `graphlib`: "^2.1.8"
- `is-path-inside`: "^4.0.0"
- `js-md5`: "^0.8.3"
- `jsonwebtoken`: "^9.0.3"
- `knex`: "^3.2.5"
- `lodash`: "^4.17.23"
- `morgan`: "^1.10.1"
- `p-limit`: "^7.3.0"
- `qwen-ai-provider-v5`: "^2.1.0"
- `serialize-error`: "^13.0.1"
- `sharp`: "^0.34.5"
- `socket.io`: "^4.8.3"
- `sqlite3`: "^6.0.1"
- `sucrase`: "^3.35.1"
- `uuid`: "^13.0.0"
- `vercel-minimax-ai-provider`: "^0.0.2"
- `vm2`: "^3.10.5"
- `zhipu-ai-provider`: "^0.2.2"
- `zod`: "^4.3"

## Architecture Patterns
- **Modular Design:** The use of `fast-glob` and dynamic route generation in `src/router.ts` suggests a modular architecture where routes are dynamically loaded from the `src/routes` directory.
- **Layered Architecture:**  The code separates concerns into layers such as data access (`knex`), API handling (Express), and UI components (Electron).
- **Configuration Driven:** The application relies heavily on configuration files like `package.json`, `tsconfig.json`, and `electron-builder.yml` to manage dependencies, build settings, and deployment configurations.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **AI Integration:** The extensive use of AI SDKs (Anthropic, DeepSeek, OpenAI, etc.) demonstrates a strong focus on AI integration. This expertise can be leveraged for enhancing SEOSONA OS’s AI capabilities.
- **Content Generation Tools:**  The core functionality revolves around automated content generation (scripts, images, videos). These tools could be adapted to create specialized content pipelines within the SEOSONA OS ecosystem.
- **Desktop Application Framework:** The Electron application framework provides a foundation for building cross-platform desktop applications, which is valuable if SEOSONA OS aims to offer native desktop clients.
- **Database Interaction:**  The use of `better-sqlite3` and `knex` demonstrates experience with database management, which could be useful for managing data within the SEOSONA OS environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `router`
- **All scores:** {'seosona-os': 44, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 0}
