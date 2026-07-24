# KI: OpenCut-app/OpenCut

## Overview
Based on the source code, OpenCut appears to be a web application built with modern JavaScript technologies. The `apps/api` directory contains an API server using Elysia, while the `apps/web` directory houses the frontend components and routing logic for the user interface.  The project utilizes Cloudflare Workers for deployment and edge functions.

## Tech Stack (from code)
- **TypeScript:** Used extensively in both the API (`apps/api/src/index.ts`) and web application (`apps/web/src/*.tsx`).
- **React:** The frontend components are written using React (`apps/web/src/router.tsx`, `apps/web/src/components/ui/button.tsx`).
- **Elysia:**  The API server utilizes Elysia for routing and request handling (`apps/api/src/index.ts`).
- **Vite:** The web application uses Vite as its build tool (`apps/web/vite.config.ts`, `apps/web/package.json`).
- **Tailwind CSS:**  Used for styling the UI components (`apps/web/tailwind.config.js`).
- **TanStack Router:** Used for routing in the web application (`apps/web/package.json`).

## Public API / Exports
- The API exposes a GET endpoint at `/` which returns `{ status: "ok" }`.  (`apps/api/src/index.ts`)
- The API exposes a GET endpoint at `/health` which returns health information. (`apps/api/src/index.ts`)
- The API exposes a POST endpoint at `/echo` that echoes back the request body. (`apps/api/src/index.ts`)

## Dependencies
Based on `package.json` files:
- **apps/api:** Elysia, @cloudflare/workers-types, wrangler
- **apps/web:**  @base-ui/react, @cloudflare/vite-plugin, @fontsource-variable/inter, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, @tailwindcss/vite, @tanstack/react-devtools, @tanstack/react-router, @tanstack/react-router-devtools, @tanstack/react-start, @tanstack/router-plugin, class-variance-authority, cmdk, date-fns, embla-carousel-react, input-otp, lucide-react, next-themes, radix-ui, react, react-day-picker, react-dom, react-hook-form, react-resizable-panels, recharts, shadcn, sonner, tailwind-merge, tailwindcss, tw-animate-css, vaul, zod.

## Architecture Patterns
- **Component-Based UI:** The web application heavily utilizes a component-based architecture with numerous components defined in `apps/web/src/components/ui`.
- **Microservices (Potential):**  The separation of the API into its own directory (`apps/api`) suggests a potential microservice architecture, although further investigation would be needed to confirm this.
- **Edge Functions:** The use of Cloudflare Workers and Wrangler indicates deployment targeting edge locations for improved performance and reduced latency.

## Relevance to SEOSONA OS
- **Modern Web Frameworks:**  The project's use of React, TypeScript, Vite, and Tailwind CSS aligns with current web development best practices and could inform the technology choices for new SEOSONA OS components.
- **Edge Computing:** The adoption of Cloudflare Workers demonstrates an understanding of edge computing principles which could be leveraged to optimize SEOSONA OS services.
- **Component Library:**  The extensive component library in `apps/web/src/components/ui` provides a valuable resource for reusable UI elements that could potentially be adapted or integrated into the SEOSONA OS user interface.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 0}
