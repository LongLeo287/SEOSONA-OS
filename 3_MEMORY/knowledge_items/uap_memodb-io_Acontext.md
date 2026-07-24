# KI: memodb-io/Acontext

## Overview
Based on the `AGENTS.md` file, Acontext appears to be a platform for "Agent Skills as a Memory Layer for production AI Agents." It provides SDKs (Python and TypeScript), a CLI tool, an API, and a dashboard, with core functionality involving AI/LLM/Agent processing. The project seems focused on enabling the development and deployment of AI agents with memory capabilities.

## Tech Stack (from code)
- **Go:**  The `AGENTS.md` file indicates that the API is built using Go (`src/server/api/`).
- **TypeScript/React:** The dashboard directory contains `.tsx` files, indicating a TypeScript and React based frontend (`dashboard/app/*.tsx`). The presence of `tsconfig.json` confirms TypeScript usage (`dashboard/tsconfig.json`).
- **Python:**  The `AGENTS.md` file mentions a Python SDK (`src/client/acontext-py/`) suggesting Python is used for client development.
- **Gin (Go framework):** While not explicitly stated in a config file, the API description in `AGENTS.md` refers to Gin, implying its use within the Go backend.
- **Next.js:** The dashboard directory contains files like `next.config.ts`, `open-next.config.ts`, and `app/` structure which are characteristic of a Next.js application (`dashboard/`).
- **PostgreSQL:**  The API description in `AGENTS.md` mentions GORM/PostgreSQL, indicating PostgreSQL is used as the database.
- **RabbitMQ:** The API description in `AGENTS.md` mentions RabbitMQ, suggesting its use for message queuing.

## Public API / Exports
Due to the large number of files and lack of a central API definition file, identifying public APIs directly from code is difficult without deeper analysis. However, based on the directory structure:

- **API Endpoints:** The `src/server/api/` directory likely contains API endpoints implemented in Go.  The dashboard's `app/api/dashboard-group/route.ts` suggests API routes are also exposed from the frontend.
- **SDK Exports:** The Python (`src/client/acontext-py/`) and TypeScript (`src/client/acontext-ts/`) SDK directories likely contain exported functions and classes for interacting with the Acontext platform.

## Dependencies
Without analyzing all `package.json`, `requirements.txt` or similar files, a complete dependency list is not possible. However, based on file extensions and descriptions:

- **React:** Used in the dashboard frontend (`dashboard/components.json`).
- **Node Packages:** The presence of `pnpm-lock.yaml` indicates usage of Node Package Manager (PNPM).
- **PostgreSQL Driver:** Likely a Go driver for PostgreSQL is used within the API.
- **RabbitMQ Client:** A RabbitMQ client library is likely used in the API.

## Architecture Patterns
- **Microservices:** The separation into "API" and "CORE" modules, connected by a message queue (RabbitMQ), suggests a microservice architecture.
- **Client-Server:**  The presence of SDKs (Python & TypeScript) and an API indicates a client-server pattern.
- **Layered Architecture:** The `src/server/api/` and `src/server/core/` directories suggest a layered architecture, separating presentation logic from core business logic.

## Relevance to SEOSONA OS
The Acontext platform's focus on AI agent memory management could be beneficial to SEOSONA OS in several ways:

- **Agent Integration:**  SEOSONA OS could integrate with the Acontext API and SDKs to enhance its own AI agents, providing them with persistent memory capabilities.
- **Memory Layer Abstraction:** The platform's "memory layer" abstraction could simplify the development of AI agent applications within SEOSONA OS.
- **Scalable Agent Infrastructure:**  The microservice architecture used by Acontext suggests a scalable and robust infrastructure that could be leveraged by SEOSONA OS for its own agents.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
