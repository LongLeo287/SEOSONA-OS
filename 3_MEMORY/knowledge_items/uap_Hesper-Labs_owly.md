# KI: Hesper-Labs/owly

## Overview
Owly is an AI-powered customer support agent platform designed for businesses. The codebase demonstrates features including conversation management, ticket handling, knowledge base integration, automation rules, and team collaboration tools.  It appears to be built as a Next.js application with a focus on providing both a web interface and API integrations.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"paths": { "@/*": ["./src/*"] }`, multiple `.ts` and `.tsx` files)
- **Framework:** Next.js (`next.config.ts`, `package.json`: `"dependencies": {"next": "16.2.2"}`)
- **Build System:** Vite (`vitest.config.ts`, `package.json`: `"devDependencies": {"vite-tsconfig-paths": "^6.1.1", "vitest": "^4.1.2"}`)
- **Database:** PostgreSQL (`.env.example`: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/owly?schema=public"`, `prisma/schema.prisma`)
- **UI Library**: Radix UI (multiple imports in `.tsx` files, e.g., `@radix-ui/react-alert-dialog`)

## Public API / Exports
Due to the nature of this codebase as a full application, identifying a clear public API is difficult without further context. However, based on file structure and import statements, some potential areas for external interaction include:

- **`/api` routes:** Next.js API routes are likely defined within the `src/pages/api` directory (not listed in provided files).
- **Prisma Client:** The Prisma client (`src/lib/prisma.ts`) provides an interface to interact with the database, but this is primarily for internal use.
- **Webhooks:**  The presence of a `WEBHOOK_SECRET` environment variable and related code suggests webhook functionality (`src/lib/automation.ts`).

## Dependencies
Based on `package.json`:
- `@prisma/adapter-pg`: "^7.6.0"
- `@prisma/client`: "^7.6.0"
- `bcryptjs`: "^3.0.3"
- `clsx`: "^2.1.1"
- `elevenlabs`: "^1.59.0"
- `imap`: "^0.8.19"
- `jsonwebtoken`: "^9.0.3"
- `lucide-react`: "^1.7.0"
- `mailparser`: "^3.9.6"
- `next`: "16.2.2"
- `nodemailer`: "^8.0.4"
- `openai`: "^6.33.0"
- `pg`: "^8.20.0"
- `prisma`: "^7.6.0"
- `qrcode`: "^1.5.4"
- `react`: "19.2.4"
- `react-dom`: "19.2.4"
- `tailwind-merge`: "^3.5.0"
- `twilio`: "^5.13.1"
- `whatsapp-web.js`: "^1.34.6"
- `zod`: "^4.3.6"
- `zustand`: "^5.0.12"

## Architecture Patterns
- **Modular Design:** The codebase is organized into distinct modules (e.g., `lib/auth`, `src/lib/conversation-engine`) suggesting a modular architecture.
- **Plugin System:**  The `src/lib/plugins.ts` file indicates the presence of a plugin system, allowing for extensibility and customization.
- **Event-Driven Architecture:** The use of hooks (`src/lib/plugins.ts`) suggests an event-driven approach to handling certain actions or data modifications.
- **Layered Architecture**:  The separation of concerns is evident with layers such as `lib` (business logic), `pages/api` (API endpoints), and components within the `src` directory.

## Relevance to SEOSONA OS
Owly's code could benefit SEOSONA OS in several ways:
- **AI Integration:** The integration of OpenAI (`openai`: "^6.33.0") demonstrates capabilities that can be leveraged for AI-powered features within SEOSONA OS, such as automated content generation or intelligent search.
- **Customer Communication Management:**  The platform's focus on customer communication (email, WhatsApp, SMS) could inform the development of similar functionalities in SEOSONA OS. The `src/lib/campaigns.ts` file provides a good starting point for understanding proactive messaging strategies.
- **RBAC Implementation**: The role-based access control system (`src/lib/rbac.ts`) offers a robust model that can be adapted and integrated into SEOSONA OS to manage user permissions and access levels.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `openai`, `rag`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 28, 'seosona-flow': 0}
