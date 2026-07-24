# KI: lumina-ai-inc/chunkr

## Overview
Chunkr appears to be a platform for processing and managing documents, likely leveraging large language models (LLMs). The codebase includes components for OCR, segmentation, and integration with various LLM providers like OpenAI, Google AI Studio, and potentially self-hosted models.  The project utilizes a microservices architecture, as evidenced by the Docker Compose configuration and separate services for tasks such as server logic, document segmentation, and OCR processing.

## Tech Stack (from code)
- **Rust:** The core backend appears to be written in Rust (`core/Cargo.toml` shows dependencies like `actix-web`, `diesel`, `tokio`).
- **TypeScript/React:**  The web application frontend is built using TypeScript and React (`apps/web/package.json` lists `@types/react`, `react`, `react-dom`, `vite.config.ts`).
- **Node.js/JavaScript:** Several supporting scripts and configurations utilize Node.js and JavaScript (e.g., `apps/web/copyPdfWorker.js`, `packages/config-eslint/index.js`).
- **Docker:** The project is containerized using Docker, with Dockerfiles for various services defined in the root directory (`docker/server/Dockerfile`, `docker/segmentation/Dockerfile`).
- **PostgreSQL:**  The database used is PostgreSQL (`core/Cargo.toml` includes `diesel` and `deadpool-postgres`).

## Public API / Exports
Due to the nature of this analysis (reading only source code), it's difficult to definitively determine a public API without more context. However, based on the configuration files and service definitions:

*   **Server API:** The server exposes an API at `http://localhost:8000` as defined in `compose.yaml`.
*   **OCR Backend API:** The OCR backend is accessible via `http://localhost:8002` (defined in `compose.yaml`).
*   **Segmentation Backend API:**  The segmentation backend is exposed on port 8001 (`compose.yaml`).

## Dependencies
Based on the identified configuration files:

*   **Rust (core/Cargo.toml):** `actix-web`, `diesel`, `tokio`, `serde`, `serde_json`, `reqwest`, `jsonwebtoken`, `urlencoding` and many more.
*   **Node.js (apps/web/package.json):** `react`, `@emotion/react`, `@mui/material`, `@tanstack/react-query`, `axios`, `class-variance-authority`, `lucide-react`, `material-react-table` and many more.
*   **JavaScript (packages/config-eslint/package.json):** `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-config-prettier`.

## Architecture Patterns
*   **Microservices:** The project is structured as a collection of independent services (server, task, web, segmentation, ocr) each with its own Dockerfile and deployment configuration. This promotes modularity and scalability.  (`compose.yaml`)
*   **Configuration Management:** Environment variables are heavily used for configuring the application (`.env.example`, `docker-compose.yaml`).
*   **API Integration:** The system integrates with external APIs, particularly LLM providers (OpenAI, Google AI Studio) as defined in `models.example.yaml`.



## Relevance to SEOSONA OS
Chunkr's code could benefit SEOSONA OS in the following ways:

*   **Document Processing Pipeline:**  The OCR and segmentation components could be integrated into SEOSONA OS to enhance document understanding capabilities, particularly for unstructured data.
*   **LLM Integration Framework:** The existing framework for integrating with various LLMs can serve as a foundation for incorporating similar functionality into SEOSONA OS. This would allow SEOSONA OS to leverage different models based on specific needs and cost considerations.
*   **Microservices Architecture:**  The microservices approach used in Chunkr aligns well with the principles of distributed systems, which is likely important for SEOSONA OS's scalability and resilience.

## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `motion` · **Fit:** 66/100 · **Auto-apply:** True
- **Evidence:** `framer-motion`, `motion`, `animation`
- **All scores:** {'seosona-os': 41, 'seosona-video': 22, 'seosona-content': 28, 'seosona-ux-ui': 66, 'seosona-flow': 0}
