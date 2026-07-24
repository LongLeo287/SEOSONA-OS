# KI: AykutSarac/jsoncrack.com

## Overview
This repository hosts a monorepo for `jsoncrack.com`, which provides tools for visualizing JSON data.  It includes a Chrome extension, a VS Code extension, and a website (built with Next.js) all centered around the core functionality of rendering JSON as graphs. The project appears to be designed for both developer productivity (VS Code extension) and public consumption (website).

## Tech Stack (from code)
- **TypeScript:**  Widely used throughout the codebase, evidenced by numerous `.ts` and `.tsx` files (e.g., `packages/jsoncrack-react/src/index.ts`). The presence of `tsconfig.json` files in various directories confirms TypeScript configuration.
- **React:** Used extensively for UI components, particularly within the `packages/jsoncrack-react` package and the VS Code extension (`apps/vscode/src/App.tsx`).  The `package.json` file for `packages/jsoncrack-react` lists React as a peer dependency.
- **Next.js:** The website is built using Next.js, as indicated by the `next.config.js`, `next-sitemap.config.js`, and related files in the `apps/www` directory.  The `package.json` for `apps/www` confirms this dependency.
- **Vite:** Used as a build tool for both the Chrome extension (`apps/chrome-extension/vite.config.ts`) and the VS Code extension (`apps/vscode/vite.config.ts`).
- **pnpm:**  The package manager used, specified in `package.json` ("packageManager": "pnpm@10.20.0") and `pnpm-lock.yaml`.

## Public API / Exports
Based on the source code analysis:
- **`packages/jsoncrack-react/src/index.ts`**:  Exports `JSONCrack` (a React component), `parseGraph`, and type definitions (`JSONCrackProps`, `JSONCrackRef`, `ParseGraphResult`, etc.). This suggests a core public API for integrating the JSON visualization into other React applications.
- **VS Code Extension:** The extension exposes commands like "jsoncrack-vscode.start" (to enable visualization) as defined in `apps/vscode/package.json`.

## Dependencies
Based on `package.json` and related files:
- **React:**  `^18`, `^19.2.4` (in different packages).
- **react-dom:** `^18`, `^19.2.4`
- **Next.js:** `^16.2.6`
- **Vite:** `^8.0.13`
- **jsoncrack-react:** Used as a dependency in the Chrome extension and VS Code extension.
- **@mantine/core, @mantine/hooks**:  Used within the website (`apps/www`).
- **shiki**: Used for syntax highlighting in the VS Code extension.

## Architecture Patterns
- **Monorepo:** The project utilizes a monorepo structure (as defined by `pnpm-workspace.yaml`), allowing for code sharing and consistent dependency management across different applications (Chrome Extension, VS Code Extension, Website).
- **Component-Based UI:**  The use of React strongly indicates a component-based architecture for the user interface.
- **Plugin Architecture (VSCode):** The VS Code extension uses activation events (`activationEvents`) to dynamically load and unload functionality based on file types present in the workspace.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **JSON Visualization Component:**  The `jsoncrack-react` package provides a reusable React component for visualizing JSON data, which could be integrated into various SEOSONA OS tools or dashboards that require JSON display.
- **Data Exploration Tools:** The core visualization logic and parsing capabilities could be adapted to create more advanced data exploration tools within the operating system.
- **Code Editor Integration:**  The VS Code extension demonstrates how to integrate a specialized tool (JSON visualization) into an IDE, which could serve as a model for integrating other SEOSONA OS development utilities.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `seo`, `sitemap`, `keyword`, `robots`
- **All scores:** {'seosona-os': 82, 'seosona-video': 22, 'seosona-content': 56, 'seosona-ux-ui': 33, 'seosona-flow': 0}
