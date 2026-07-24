# KI: AgentSeal/codeburn

## Overview
CodeBurn is a tool designed for tracking and analyzing AI agent usage, specifically focusing on costs associated with different models, tasks, and projects. It aims to provide observability into AI spending by aggregating data from various providers like Claude, Gemini, and others, presenting it in dashboards and exportable formats. The project includes a CLI, a web dashboard, and Gnome shell extension for monitoring.

## Tech Stack (from code)
- **TypeScript/JavaScript:**  The primary language is TypeScript, evidenced by the `tsconfig.json` file:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    ...
    "strict": true,
    ...
  },
  "include": ["src/**/*"],
  ...
}
```
- **React:** The `package.json` lists React as a dependency and the `src/dash/App.tsx` file indicates its use for the dashboard UI:
```json
{
  "dependencies": {
    "react": "^19.2.5",
    ...
  }
}
```
- **Node.js:** The project uses Node.js as a runtime environment, with scripts defined in `package.json` and the presence of files like `dist/cli.js`.
- **Vite:** Used for building the dashboard UI, indicated by `vite.config.ts` in the `dash` directory:
```typescript
// dash/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```
- **Tsup:** Used as a build tool, defined in `tsup.config.ts`:
```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/cli.ts'],
  outDir: 'dist',
  ...
})
```
- **Vitest:** Used for testing, as indicated by the `test` script in `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    ...
  }
}
```

## Public API / Exports
Based on the `src/main.ts` file and CLI usage, here's a list of exported functions:
- `aggregateModelEfficiency`: Aggregates model efficiency data (from `src/model-efficiency.js`).
- `buildPeriodData`: Builds period data for usage aggregation (from `src/usage-aggregator.js`).
- `buildMenubarPayloadForRange`: Constructs payload for the menubar application (from `src/usage-aggregator.js`).
- `renderDashboard`: Renders the dashboard UI (from `src/dashboard.js`).
- `renderOverview`: Renders an overview of AI usage (from `src/overview.js`).
- `runWebDashboard`: Runs the web dashboard server (from `src/web-dashboard.js`).
- `installMenubarApp`: Installs the menubar application (from `src/menubar-installer.js`).
- `exportCsv`, `exportJson`: Export usage data in CSV and JSON formats (from `src/export.js`).

## Dependencies
Based on `package.json`:
- `@modelcontextprotocol/sdk`: SDK for interacting with the Model Context Protocol.
- `bonjour-service`: For service discovery.
- `chalk`:  For terminal output styling.
- `commander`: Command-line argument parsing.
- `ink`: React-based CLI framework.
- `react`: JavaScript library for building user interfaces.
- `selfsigned`:  For generating TLS certificates.
- `strip-ansi`: Removes ANSI escape codes from strings.
- `undici`: HTTP client.
- `zod`: Schema validation library.

## Architecture Patterns
- **Provider Abstraction:** The project utilizes a provider abstraction pattern, as demonstrated by the `src/providers` directory containing implementations for various AI services (e.g., Claude, Codex, Cursor). This allows CodeBurn to aggregate data from different sources in a consistent manner.  Each provider implements a `Provider` interface with methods like `discoverSessions` and `createSessionParser`.
- **Configuration Driven:** The project relies heavily on configuration files (`tsconfig.json`, `package.json`) for build settings, dependencies, and scripts. This promotes modularity and maintainability.
- **CLI Command Structure:**  The CLI uses a command structure (likely driven by `commander`), allowing users to interact with the tool through various commands and flags.

## Relevance to SEOSONA OS
CodeBurn's architecture could be beneficial for SEOSONA OS in several ways:
- **AI Cost Monitoring Integration:** The core functionality of tracking AI usage costs can be integrated directly into SEOSONA OS, providing users with real-time insights into their spending on AI services.
- **Provider Extensibility:**  The provider abstraction pattern allows for easy integration of new AI providers as they emerge, ensuring that SEOSONA OS remains compatible with a wide range of AI tools.
- **Dashboard Customization:** The dashboard component (built with React) could be customized to display AI usage data in a way that is tailored to the specific needs of SEOSONA OS users.  The modular design allows for easy adaptation and extension.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 28, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
