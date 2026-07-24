# KI: vas3k/TaxHacker

## Overview
TaxHacker is a self-hosted AI-powered personal finance and tax preparation tool. It allows users to import financial data, categorize transactions, generate invoices, and leverage LLMs for analysis and assistance with tax filing. The application utilizes Next.js for its frontend and Prisma as an ORM interacting with a PostgreSQL database.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`, `.tsx` & `.ts` files)
- **Framework:** Next.js (`next.config.ts`, `app/`, `pages/`)
- **Build System:**  npm / Node Package Manager (`package.json`, `scripts`)
- **Database ORM:** Prisma (`prisma/schema.prisma`, `lib/db.ts`, `@prisma/client` dependency)
- **UI Library:** Radix UI (multiple imports in components like `app/(app)/apps/email/components/*`)
- **CSS Framework:** Tailwind CSS (`tailwind.config.ts`, `globals.css`)

## Public API / Exports
Due to the large codebase, a comprehensive list is impractical.  However, several key exports are evident:

- `authClient` from `lib/auth-client.ts`: Used for authentication operations.
- `getSession` and `getCurrentUser` from `lib/auth.ts`: Functions related to user session management.
- `PoorManCache` class from `lib/cache.ts`: A simple in-memory caching mechanism.
- `resend` object from `lib/email.ts`:  Used for sending emails via Resend.
- `encryptSecret` and `decryptSecret` functions from `lib/encryption.ts`: Functions to encrypt and decrypt secrets, likely related to database credentials or API keys.

## Dependencies
Based on `package.json`, key dependencies include:

- `@prisma/adapter-pg`:  Prisma adapter for PostgreSQL.
- `@sentry/nextjs`: Sentry integration for error tracking.
- `next`: Next.js framework.
- `react`: React library.
- `react-dom`: React DOM.
- `langchain`: LangChain framework for LLM interactions.
- `resend`:  Email sending service.
- `tailwind-merge`: Utility for merging Tailwind CSS class names.

## Architecture Patterns
- **Server Actions:** Utilizes Next.js Server Actions (`experimental.serverActions` in `next.config.ts`) to execute server-side logic directly from components.
- **App Router:**  Employs the Next.js App Router (`app/` directory) for routing and layout management.
- **Component-Based Architecture:** Heavily relies on reusable React components, particularly within the Radix UI ecosystem.
- **Modular Design:** The codebase is structured into modules (e.g., `ai/`, `app/`, `lib/`) to promote code organization and reusability.
- **Environment Configuration:**  Uses `.env` files and a schema (`lib/config.ts`) for managing environment variables, with an example provided in `.env.example`.

## Relevance to SEOSONA OS
TaxHacker's codebase demonstrates several aspects potentially valuable to SEOSONA OS:

- **LLM Integration:** The extensive use of LangChain and integrations with OpenAI, Google, and Mistral demonstrate a robust approach to LLM integration that could be adapted for various SEOSONA OS features.  The modular design of the LLM provider selection (`lib/llm-providers.ts`) is particularly noteworthy.
- **Data Management & Security:** The encryption routines in `lib/encryption.ts` and the use of Prisma for database interaction highlight a focus on data security, which aligns with SEOSONA OS's principles.  The handling of secrets via environment variables and configuration files provides a good pattern to follow.
- **Component-Based UI Development:** The reliance on Radix UI and component-based architecture could inform the development of reusable UI components for SEOSONA OS applications.
- **Self-Hosting Capabilities**: The project's design allows for self-hosting, which is a valuable feature that aligns with SEOSONA OS’s goals of providing customizable and decentralized solutions.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`
- **All scores:** {'seosona-os': 41, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
