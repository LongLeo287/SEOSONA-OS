# KI: JohnRiceML/clawport-ui

## Overview
ClawPort is a dashboard for managing, monitoring, and chatting with OpenClaw AI agents. It provides an organization chart (Org Map), direct agent chat, cron monitoring, and a cost dashboard. The application leverages the OpenClaw gateway to route all AI calls.

## Tech Stack (from code)
- **Next.js 16:**  `next.config.mjs` contains configurations specific to Next.js version 16.
- **React 19:** `package.json` lists `"react": "19.2.3"` as a dependency and `.tsx` files are used extensively throughout the project.
- **TypeScript 5:**  `tsconfig.json` specifies compiler options for TypeScript, including target ES2017 and strict type checking.
- **Tailwind CSS 4:** `package.json` lists `"tailwindcss": "^4"` as a dependency and `postcss.config.mjs` is used for Tailwind configuration.
- **Vitest:**  `package.json` includes `"test": "vitest run"` script, indicating Vitest is the testing framework.

## Public API / Exports
Due to the large number of files, a comprehensive list isn't feasible. However, some notable exports include:

- `lib/agents-registry.ts`:  Exports `loadRegistry` and `clearRegistryCache`.
- `lib/agents.ts`: Exports `getAgents` and `getAgent`.
- `lib/anthropic.ts`: Exports `hasImageContent`, `extractImageAttachments`, `buildTextPrompt`, `sendViaOpenClaw`, and `execCli`.
- `lib/api-error.ts`: Exports `apiErrorResponse`.
- `lib/audio-recorder.ts`: Exports `formatDuration` and `blobToDataUrl`.
- `lib/claude-usage.ts`: Exports `getKeychainToken` and `fetchClaudeCodeUsage`.

## Dependencies
Based on `package.json`, key dependencies include:

- `@xyflow/react`: For the Org Map visualization.
- `openai`:  For interacting with OpenAI models (routed through OpenClaw).
- `radix-ui`: A set of unstyled UI primitives.
- `lucide-react`: React icons.
- `class-variance-authority`: Utility for styling components.
- `tailwind-merge`: Utility for merging Tailwind CSS class names.

## Architecture Patterns
- **App Router (Next.js):** The directory structure under `app/` indicates the use of Next.js's App Router, with routes defined as `.tsx` files.
- **API Routes:**  The `api/` directory contains API endpoints implemented using Next.js API routes (`route.ts` files).
- **Component-Based Architecture (React):** The code is heavily structured around reusable React components located in the `components/` directory.
- **Environment Variable Configuration:** `.env.example` provides a template for environment variable configuration, demonstrating a reliance on external settings.

## Relevance to SEOSONA OS
This project's architecture and functionality could benefit SEOSONA OS in several ways:

- **Agent Management Dashboard:** The core ClawPort dashboard design can be adapted to provide a centralized interface for managing AI agents within the SEOSONA ecosystem.
- **Cost Monitoring & Optimization:**  The cost analysis components (e.g., `costs/ClaudeUsageRow.tsx`, `costs/DailyCostChart.tsx`) could be integrated to track and optimize resource consumption in SEOSONA's AI infrastructure.
- **OpenClaw Gateway Integration:** The existing integration with the OpenClaw gateway demonstrates a pattern for routing requests through a centralized service, which could be valuable for managing access control and monitoring within SEOSONA.
- **Org Chart Visualization:**  The Org Map component (`components/OrgMap.tsx`) provides a visual representation of agent relationships that could be adapted to represent other hierarchical structures within SEOSONA.

## UAP Routing (auto-classified)
- **System:** `seosona-flow` · **Function:** `workflow-automation` · **Fit:** 56/100 · **Auto-apply:** True
- **Evidence:** `dag`, `pipeline`
- **All scores:** {'seosona-os': 41, 'seosona-video': 24, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 56}
