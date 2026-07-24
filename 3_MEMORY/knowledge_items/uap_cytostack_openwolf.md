# KI: cytostack/openwolf

## Overview
Openwolf is a tool designed for token-conscious AI brain management, specifically targeting Claude Code projects. It appears to provide functionality for scanning, tracking, and managing tokens used by AI models, along with features like design quality control (designqc) and cron job scheduling. The project includes a command-line interface (CLI), a daemon process, and a dashboard for visualization and interaction.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"target": "ES2022"`, `src/**/*.ts` in `tsconfig.json`)
- **Framework:** React (`package.json`: `react`, `react-dom`, `@vitejs/plugin-react`), Vue (`src/dashboard/app/components/HeroLanding.vue`)
- **Build System:** Vite (`package.json`: `"build:dashboard": "cd src/dashboard/app && npx vite build --outDir ../../../dist/dashboard"`, `vite.config.ts` in `src/dashboard/app`)
- **Module Bundler:**  ES Modules (indicated by `package.json`: `"type": "module"`)
- **CSS Preprocessor**: Tailwind CSS (`@tailwindcss/vite` in `devDependencies`, `tailwind.css` in `docs/.vitepress/theme`)

## Public API / Exports
Due to the large codebase, a comprehensive list is impractical. However, some notable exports include:

- **CLI Commands:** The `cli/` directory contains files like `bug-cmd.ts`, `cron-cmd.ts`, and `scan.ts`, suggesting command-line functionality for bug tracking, cron job management, and project scanning respectively.
- **Daemon Functions:**  The `daemon/` directory includes `wolf-daemon.ts`, indicating a core daemon process with functions related to file watching (`file-watcher.ts`) and health checks (`health.ts`).
- **Dashboard Components:** The `src/dashboard/app/components/` directory contains React components like `Header.tsx`, `Layout.tsx`, `Sidebar.tsx`, `BugLog.tsx`, and `AnatomyBrowser.tsx`. These suggest a user interface for interacting with the system.
- **Hooks:**  The `hooks/` directory in `src/` defines hooks such as `post-read.ts`, `pre-write.ts`, and `session-start.ts`, likely used to intercept and modify actions within the Openwolf environment.

## Dependencies
Based on `package.json`:
- Chalk: For terminal output styling.
- Chokidar: For file system watching.
- Commander:  For building command-line interfaces.
- Express: A web application framework (likely for the dashboard).
- Node-cron: For scheduling tasks.
- Open: For opening URLs.
- Puppeteer-core: Headless browser automation (potentially used for scraping or testing).
- WS: WebSockets library

## Architecture Patterns
- **Modular Design:** The codebase is structured into distinct modules (`cli`, `daemon`, `dashboard`, `designqc`, `scanner`, `tracker`) suggesting a modular architecture.
- **Command-Line Interface (CLI):**  A significant portion of the code focuses on building and managing a CLI tool using Commander.
- **Daemon Process:** The presence of a daemon process (`wolf-daemon.ts`) indicates background processing capabilities, likely for continuous monitoring or scheduled tasks.
- **Plugin/Hook System:** The `hooks/` directory suggests a plugin or hook system that allows extending the functionality of Openwolf.

## Relevance to SEOSONA OS
The following aspects of Openwolf's code could be beneficial to SEOSONA OS:

- **File Watching (Chokidar):**  SEOSONA OS might leverage Chokidar for real-time monitoring of file system changes, enabling reactive behavior and automated tasks.
- **Cron Job Scheduling (Node-cron):** The Node-cron library used in Openwolf could be integrated into SEOSONA OS to schedule recurring tasks or processes.
- **CLI Framework (Commander):**  The Commander framework provides a robust foundation for building command-line tools, which could be adapted for managing and interacting with SEOSONA OS components.
- **Token Management:** The core functionality of Openwolf around token management might provide valuable insights into resource usage optimization within SEOSONA OS, particularly if it involves AI or language models.

## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `component` · **Fit:** 66/100 · **Auto-apply:** True
- **Evidence:** `.vue`, `component`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 66, 'seosona-flow': 0}
