# KI: yazinsai/town

## Overview
This project, "claude-town," is a visual orchestrator for the Claude Agent SDK, presenting an AI agent environment as a pixel art western town. The application allows users to manage buildings, spawn agents, and interact with them within this simulated town setting.  It appears designed for development and debugging of AI agents.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`, `*.tsx` files)
- **Framework:** React (`App.tsx`, `*.tsx` files, `@vitejs/plugin-react`)
- **Build System:** Vite (`vite.config.ts`)
- **Styling:** Tailwind CSS (`vite.config.ts`, `index.css`)
- **Server Framework**: Hono (`package.json`)

## Public API / Exports
Due to the nature of this application (a frontend orchestrator), there are no explicitly documented public APIs. However, based on the server code and client-side usage, we can infer some key endpoints:

- `/api/auth/login`:  Used for authentication via POST request with a password in the body (`src/lib/api.ts`).
- `/buildings`: Returns a list of buildings (GET), creates a new building (POST). (`src/lib/api.ts`)
- `/buildings/:id`: Retrieves details of a specific building (GET), deletes a building (DELETE). (`src/lib/api.ts`)
- `/buildings/:buildingId/agents`: Spawns an agent on a building (POST). (`src/lib/api.ts`)
- `/agents/:id`: Retrieves details of a specific agent. (`src/lib/api.ts`)

## Dependencies
Based on `package.json`:

- `@anthropic-ai/claude-agent-sdk`:  Used for interacting with the Claude Agent SDK.
- `hono`: Server framework.
- `qrcode`: Likely used for displaying QR codes related to agent connections or authentication.
- `react`, `react-dom`: Core React libraries.
- `tailwindcss`, `@tailwindcss/vite`: Styling and build tools.
- `typescript`:  TypeScript compiler and type definitions.
- `vite`: Build tool.
- `concurrently`: Runs multiple commands concurrently.

## Architecture Patterns
- **Component-Based UI:** The application heavily utilizes React components for building the user interface (e.g., `BuildingDetail.tsx`, `TownScene.tsx`).
- **Hooks for State Management & Side Effects:** Custom hooks like `useAgent.ts`, `useBuildings.ts`, and `useWebSocket.ts` manage state, data fetching, and side effects within components.
- **API Abstraction Layer:** The `src/lib/api.ts` file provides an abstraction layer for interacting with the backend API, encapsulating authentication and request handling logic.
- **Centralized Configuration:**  Vite's configuration (`vite.config.ts`) manages build settings, aliases, and proxy configurations.

## Relevance to SEOSONA OS
This project’s code could benefit SEOSONA OS in several ways:

- **UI Component Library Inspiration:** The pixel art UI components (e.g., `PixelButton`, `PixelText`) offer a unique visual style that could be adapted for SEOSONA OS interfaces, providing an alternative to standard widget sets.
- **Agent Orchestration Patterns:**  The architecture for managing and interacting with AI agents within the town environment provides valuable patterns for building agent orchestration tools within SEOSONA OS. The `src/lib/api.ts` file's API abstraction could be a useful template.
- **WebSocket Integration Example:** The use of WebSockets (`useWebSocket.ts`, Vite proxy configuration) demonstrates how to establish real-time communication channels, which is crucial for many SEOSONA OS features requiring live data updates.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
