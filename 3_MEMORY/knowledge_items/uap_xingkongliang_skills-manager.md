# KI: xingkongliang/skills-manager

## Overview
This repository contains a "Skills Manager" application, likely designed for managing and interacting with various software tools or agents. The codebase utilizes React for the frontend and TypeScript for type safety and development.  The project also appears to integrate with Tauri, suggesting it's packaged as a desktop application.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  `tsconfig.json` confirms TypeScript usage (`"compilerOptions": { "target": "es2015", "module": "ESNext", ... }`). `package.json` lists `@types/react`, `@types/node`, and `typescript` as dev dependencies.
- **React:** `src/App.tsx` imports from `react` and `react-router-dom`.  `vite.config.ts` uses the `@vitejs/plugin-react` plugin.
- **Vite:** `vite.config.ts` configures Vite for bundling.
- **Tailwind CSS:** `tailwind.config.js` defines Tailwind configuration, and `index.css` likely imports it.
- **Tauri:**  The presence of `src-tauri/tauri.dev.conf.json` and scripts like `"tauri:dev"` and `"tauri:build"` in `package.json` indicates Tauri is used for desktop application packaging.

## Public API / Exports
Due to the nature of TypeScript and React, it's difficult to definitively list all public APIs without a full understanding of module visibility. However, based on imports within `src/App.tsx`, we can identify some components that are likely part of the public interface:

- `Dashboard` (from `views/Dashboard`)
- `MySkills` (from `views/MySkills`)
- `WorkspaceView` (from `views/WorkspaceView`)
- `InstallSkills` (from `views/InstallSkills`)
- `Settings` (from `views/Settings`)
- `ProjectDetail` (from `views/ProjectDetail`)
- `Backup` (from `views/Backup`)

## Dependencies
Based on `package.json`:

- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`: For drag and drop functionality.
- `@hello-pangea/dnd`: Another library for drag and drop.
- `@tauri-apps/api`, `@tauri-apps/cli`, `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-clipboard-manager`, `@tauri-apps/plugin-opener`, `@tauri-apps/plugin-shell`, `@tauri-apps/plugin-updater`:  Tauri related dependencies.
- `clsx`, `tailwind-merge`: Utility libraries for class name manipulation.
- `i18next`, `react-i18next`: Internationalization library.
- `lucide-react`: React icons.
- `react`, `react-dom`: Core React libraries.
- `react-markdown`, `remark-gfm`: Markdown rendering.
- `react-router-dom`: Routing for the application.
- `sonner`: Notification library.

## Architecture Patterns
- **Component-Based Architecture:** The codebase heavily utilizes React components (e.g., `AddProjectDialog.tsx`, `AgentIcon.tsx`).
- **Context API:**  `AppProvider` and `ThemeProvider` suggest usage of the React Context API for managing application state.
- **Modular Design:** The project is structured into directories like `components`, `views`, and `lib`, indicating a modular approach to development.
- **Configuration Driven:**  The use of configuration files (e.g., `vite.config.ts`, `tailwind.config.js`) suggests a design that allows for easy customization and modification.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Agent Management UI:** The Skills Manager provides a functional user interface for managing software agents, which aligns with SEOSONA OS’s focus on AI agent integration.  The `ToolInfo` type and related components demonstrate the structure needed to represent and interact with agents.
- **Desktop Application Framework:** The Tauri integration demonstrates how to build cross-platform desktop applications using web technologies – a valuable pattern for SEOSONA OS's own tooling.
- **Internationalization Support:** The use of `i18next` provides a robust solution for localization, which is crucial for a global operating system like SEOSONA OS.
- **Drag and Drop Interface:**  The drag and drop functionality implemented with `@dnd-kit/core` could be adapted to create intuitive interfaces for managing skills or agents within the SEOSONA OS environment.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
