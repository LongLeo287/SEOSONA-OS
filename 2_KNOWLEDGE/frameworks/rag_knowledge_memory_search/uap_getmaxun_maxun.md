# KI: getmaxun/maxun

## Overview
Based on the source code, `getmaxun/maxun` appears to be a web application designed for automating tasks and interacting with various online services like Airtable, Claude, GSheets, Langchain, and others. The application provides features for scraping data, running workflows, managing browser instances, and integrating with external APIs.  It seems to have both frontend (React) and backend (Node.js/Express) components.

## Tech Stack (from code)
- **Frontend:** React (src/App.tsx imports `react` and `react-router-dom`), TypeScript (many `.ts`/`.tsx` files), styled-components (dependency in package.json).  Vite is used as the build system (vite.config.js).
- **Backend:** Node.js, Express (based on API routes in server/src/api/* and dependencies in package.backend.json), TypeScript (many `.ts` files), PostgreSQL (docker-compose.yml defines a postgres service), MinIO (docker-compose.yml defines a minio service).
- **Build System:** Vite (vite.config.js) for the frontend, npm scripts defined in `package.json` and `package.backend.json`.

## Public API / Exports
Due to the nature of this project being a full application, it's difficult to definitively list "public" exports without more context. However, based on the API routes exposed by the backend (server/src/api/*), here are some notable endpoints:
- `/auth/user/:userId` (GET) - Retrieves user information. (src/api/auth.ts)
- `/integration/upload-credentials` (POST) - Handles credential uploads. (src/api/integration.ts)
- `/proxy/config` (POST, GET, DELETE) - Manages proxy configurations. (src/api/proxy.ts)
- `/record/start` (GET) - Starts a recording session. (src/api/recording.ts)
- `/storage/recordings/scrape` (POST) - Creates a scrape robot. (src/api/storage.ts)

## Dependencies
Based on `package.json`, key dependencies include:
- React, ReactDOM
- Axios for HTTP requests (used extensively in src/api/* files).
- Bcrypt for password hashing.
- Express for the backend framework.
- Sequelize and PostgreSQL for database interaction.
- Playwright for browser automation.
- I18next for internationalization.
- Various AI SDKs like Anthropic's SDK (@anthropic-ai/sdk) and OpenAI (via axios calls).

## Architecture Patterns
- **API Gateway:** The backend appears to act as an API gateway, handling requests from the frontend and interacting with external services.
- **Microservices-like Structure:**  The presence of separate Docker containers for the backend, frontend, browser, PostgreSQL, and MinIO suggests a microservices-inspired architecture, although they are likely deployed together.
- **Modular Design:** The code is organized into modules (e.g., `src/api`, `server/src/browser-management`) which promotes reusability and maintainability.
- **Context Provider Pattern:**  The frontend uses a `GlobalInfoProvider` (src/App.tsx) to manage global application state, likely using React Context API.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Browser Automation Capabilities:** The extensive use of Playwright for browser automation can be integrated into SEOSONA OS to automate tasks like data extraction and web interaction.  The `browser/Dockerfile` and related files provide a foundation for building robust browser automation pipelines.
- **API Integration Framework:** The backend's API integration patterns (using Axios, handling authentication) could serve as examples or templates for integrating with other services within SEOSONA OS.
- **Workflow Management System:**  The workflow management features (src/api/workflow.ts and related files) can be adapted to build a flexible task scheduling and execution engine for SEOSONA OS.
- **Internationalization Support:** The i18n implementation provides a good starting point for adding multilingual support to SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`, `router`
- **All scores:** {'seosona-os': 89, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
