# KI: every-app/open-seo

## Overview
Open-SEO appears to be a self-hosted SEO tool designed for managing websites and content, potentially with AI-powered features. The codebase includes components for authentication, database management (using Drizzle ORM), and integration with various APIs like DataForSEO and Google Search Console. It leverages Cloudflare Workers for deployment and incorporates elements of an agent-based architecture.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"include": ["**/*.ts", "**/*.tsx"]`)
- **Framework:** React, Vite (`vite.config.ts`, `package.json`: `"@vitejs/plugin-react"`)
- **Build System:** Vite (`vite.config.ts`, `package.json`: `"scripts": { "build": "vite build"`),  esbuild (implied by vite)
- **Database ORM:** Drizzle ORM (`drizzle-pg.config.ts`, `drizzle.config.ts`)
- **State Management:** TanStack Router (`@tanstack/react-router` import in `src\router.tsx`)
- **Authentication:** Better Auth (`cli-auth.ts`, `src\lib\auth.ts`)

## Public API / Exports
Due to the nature of this project (likely a self-hosted application), identifying a clear public API solely from code is challenging. However, based on routes and configuration files, we can infer some potential endpoints:

- `/api/auth/*`: Authentication related endpoints (from `src\router.tsx` and `cli-auth.ts`)
- `/mcp/*`:  Likely an admin or management panel endpoint (from `src\lib\oauth-resource.ts`, `src\server.ts`).
- `/api/autumn/$`: Autumn webhook endpoint (`src\server.ts`)

## Dependencies
Based on the `package.json` file:

- `@cloudflare/workers`: For Cloudflare Workers deployment.
- `@tanstack/react-router`:  For routing within the application.
- "@tanstack/react-start": For development tooling and hot module replacement.
- "better-auth": Authentication library.
- "drizzle-kit": Drizzle ORM for database migrations.
- "vite": Build tool.
- "playwright": End-to-end testing framework.
- "@posthog/cli": PostHog client integration.

## Architecture Patterns
- **Agent-Based Architecture:** The presence of `.agents/` directory and references to `portless run vite dev` suggests an agent-based architecture, where independent agents handle specific tasks.
- **Modular Design:**  The codebase is organized into numerous directories (e.g., `src/lib`, `src/db`, `cli-auth`) indicating a modular design approach.
- **Configuration-Driven:** The application relies heavily on environment variables for configuration (`.env.example`, `vite.config.ts`).
- **Drizzle ORM Integration**: Drizzle is used to manage database interactions, abstracting away the underlying SQL dialect (PostgreSQL or SQLite).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Authentication System:** The "Better Auth" implementation provides a robust authentication system that could be adapted for SEOSONA OS user management.
- **Database Abstraction:** Drizzle ORM offers a flexible database abstraction layer, simplifying database interactions and potentially allowing SEOSONA OS to support multiple database backends.
- **Agent Architecture**:  The agent architecture used in Open-SEO can inspire the design of modular and scalable components for SEOSONA OS tasks like keyword research or content analysis.
- **API Integrations:** The integration with DataForSEO demonstrates a pattern for integrating external SEO APIs that could be leveraged by SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `seo`, `backlink`, `keyword`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
