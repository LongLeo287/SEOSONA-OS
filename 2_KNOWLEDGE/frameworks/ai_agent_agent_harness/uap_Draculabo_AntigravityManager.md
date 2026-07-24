# KI: Draculabo/AntigravityManager

## Overview
This project, "Antigravity Manager," is an Electron application designed for managing and interacting with AI agents. The codebase demonstrates a focus on modularity, observability, and secure data handling, likely targeting advanced users or developers needing fine-grained control over AI workflows. It appears to be under active development, incorporating modern web technologies and practices.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `lib": ["dom", "ESNext"]`, `src/app.tsx`)
- **Framework:** React (`src/app.tsx`: `import { createRoot } from 'react-dom/client'`), NestJS (`src/server/main.ts`: `bootstrapNestServer`), TanStack Router (`src/routes/__root__`, `src/app.tsx`: `<RouterProvider router={router} />`)
- **Build System:** Vite (`vite.main.config.mts`, `vite.renderer.config.mts`, `forge.config.ts`: `VitePlugin`), Electron Forge (`package.json`: `"scripts": { "package": "electron-forge package" }`, `forge.config.ts`)
- **State Management:** TanStack Query (`src/app.tsx`: `<QueryClientProvider client={queryClient}>`)
- **UI Library**: Radix UI, Lucide React, Simple Icons (`AGENTS.md` mentions these)
- **Database:** Better-SQLite3 (`nativeModules` in `forge.config.ts`), Drizzle ORM / Raw SQL (`src/main.ts`)

## Public API / Exports
Due to the nature of this project (Electron app), direct public APIs are less apparent from the provided code snippets. However, based on the observed IPC communication:

- **`electron` object in Preload Script:**  The `preload.ts` file exposes an `electron` object with methods like `getObservabilityConfig`, `changeLanguage`, and `checkForUpdates`. These appear to be intended for communication between the renderer process (UI) and the main process.
- **ORPC endpoints**: The project uses ORPC, but specific endpoint definitions are not visible in the provided code snippets.

## Dependencies
Based on `package.json`:
- `@electron-forge/cli`
- `@electron-forge/maker-deb`
- `@electron-forge/maker-dmg`
- `@electron-forge/plugin-vite`
- `@playwright/test`
- `react`
- `typescript`
- `undici`

## Architecture Patterns
- **Electron Main Process / Renderer Process Separation:** The code clearly separates concerns between the main process (handling system interactions, database) and the renderer process (UI).  (`src/main.ts`, `src/preload.ts`, `src/app.tsx`)
- **Modular Component Structure:** The UI components are organized into modules (`src/components/*`), suggesting a component-based architecture for maintainability and reusability.
- **Observability Integration:** Sentry is integrated for error reporting, indicating a focus on monitoring and debugging in production (`src/instrument.ts`).  OpenTelemetry is also used.
- **IPC Communication:** Inter-process communication (IPC) between the renderer and main processes is heavily utilized for functionality like language changes and updates (`src/preload.ts`, `src/main.ts`).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Electron Expertise:** The extensive use of Electron demonstrates expertise in building cross-platform desktop applications, which aligns with SEOSONA’s goals.
- **AI Agent Management Framework:**  The core functionality of managing AI agents can be adapted to create a robust agent management interface within SEOSONA OS.
- **Observability Practices:** The integration of Sentry and OpenTelemetry provides valuable insights into error handling and performance monitoring, which are crucial for maintaining a stable operating system.
- **Secure Data Handling:**  The use of `keytar` and ORPC suggests an emphasis on secure data storage and communication, important considerations for SEOSONA OS's security posture.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 56, 'seosona-flow': 28}
