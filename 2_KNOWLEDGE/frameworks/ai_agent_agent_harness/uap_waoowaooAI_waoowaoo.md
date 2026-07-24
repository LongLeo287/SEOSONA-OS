# KI: waoowaooAI/waoowaoo

## Overview
Waoowaoo appears to be a platform for collaborative novel creation, incorporating AI-assisted writing and image generation features. The codebase demonstrates functionality for managing characters, locations, episodes, and storyboards, with support for both English and Chinese languages. It leverages various external services like MySQL, Redis, MinIO (object storage), and potentially OpenAI or other LLM providers through an abstraction layer.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"lib": ["dom", "dom.iterable", "esnext"],`)
- **Framework:** Next.js (`next.config.ts`, `package.json`: `"dev:next"`, `"build:turbo"`).  The presence of `next.config.ts` and related scripts confirms its use.
- **Build System:** npm/Node.js (`package.json`, `Dockerfile`). The `package.json` file defines build scripts, and the Dockerfile uses Node.js for building.
- **Database:** MySQL (`docker-compose.yml`: `image: mysql:8.0`)
- **State Management:** Redis (`docker-compose.yml`: `image: redis:7-alpine`)
- **Object Storage:** MinIO (`docker-compose.yml`: `image: minio/minio`)

## Public API / Exports
Due to the sheer size of the codebase, identifying all public APIs is impractical. However, based on file structure and imports, some notable exported elements include:

- `src/lib/api-auth.ts`:  Exports functions related to authentication and authorization (`AuthSession`, `bindAuthLogContext`).
- `src/lib/ark-llm.ts`: Exports functions for interacting with the Ark LLM service (e.g., `ArkResponsesResult`).
- `src/lib/async-poll.ts`:  Exports functions related to asynchronous task polling (`PollResult`).
- `src/lib/config-service.ts`: Exports functions for retrieving configuration data and parsing model keys (`parseModelKey`, `composeModelKey`).

## Dependencies
Based on `package.json`, key dependencies include:

- `@next-auth/prisma-adapter`: For authentication with Prisma.
- `bcryptjs`:  For password hashing.
- `concurrently`: To run multiple development servers concurrently.
- `cross-env`: To set environment variables for cross-platform compatibility.
- `next`: The Next.js framework itself.
- `prisma`: A database ORM.
- `tsx`: For running TypeScript files directly.

## Architecture Patterns
- **Microservices/Containerization:**  The `docker-compose.yml` file indicates a microservice architecture, with separate containers for MySQL, Redis, MinIO, and the application itself.
- **Configuration Management:** The `.env.example` file suggests an environment variable configuration approach.
- **Abstraction Layers:** Code like `src/lib/ark-llm.ts` demonstrates abstraction layers to interact with external services (Ark LLM).  This allows for potential swapping of providers or implementations without significant code changes.
- **Internationalization (i18n):** The presence of files like `character_image_to_description.en.txt`, `character_image_to_description.zh.txt` and the use of `next-intl/plugin` in `next.config.ts` indicates support for multiple languages, specifically English and Chinese.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **AI-Assisted Content Creation:** The AI integration aspects (image generation, text expansion) could be adapted to enhance content creation within SEOSONA OS.  The modular design of the LLM interaction layer (`src/lib/ark-llm.ts`) would facilitate integration with different LLMs that might be used by SEOSONA OS.
- **Collaborative Workflow:** The platform's focus on collaborative novel writing could inspire features for collaborative content creation within SEOSONA OS, potentially including shared workspaces and version control.
- **Multilingual Support:**  The robust i18n implementation can serve as a reference for implementing multilingual support in SEOSONA OS.
- **Microservice Architecture:** The containerized architecture provides a good example of how to structure complex applications into manageable microservices, which could be beneficial for scaling and maintaining SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `llm`, `rag`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
