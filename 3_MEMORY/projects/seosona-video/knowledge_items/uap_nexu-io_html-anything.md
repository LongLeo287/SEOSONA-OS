# KI: nexu-io/html-anything

## Overview
This project appears to be a workspace for building an application named "HTML Anything," focused on creating and manipulating HTML documents, potentially with AI assistance or advanced features like hyperframes and deployment capabilities. The core functionality seems centered around a Next.js frontend (`next/`) alongside CLI tools (`cli/`) and end-to-end tests (`e2e/`).  The project utilizes pnpm as its package manager to manage dependencies across multiple packages within the workspace.

## Tech Stack (from code)
- **TypeScript:** Widely used throughout the codebase, evidenced by numerous `.ts` and `.tsx` files in `cli/src`, `next/src`, `e2e/tsconfig.json`, and `next/tsconfig.json`.
- **Next.js:** The `next/` directory contains a Next.js application, confirmed by `next/package.json` which lists `"next": "16.2.6"` as a dependency and the presence of files like `next/next.config.ts`.
- **React:**  Used within the Next.js frontend, evidenced by the numerous `.tsx` files in `next/src/components/` and dependencies listed in `next/package.json`, including `"react": "19.2.4"` and `"react-dom": "19.2.4"`.
- **pnpm:** Used as a package manager, defined by the root `package.json`: `"packageManager": "pnpm@10.33.2"`.
- **Vitest:**  Used for testing in both the CLI and Next.js packages, evidenced by `cli/vitest.config.ts` and `next/vitest.config.ts`.

## Public API / Exports
Due to the size of the repository, a comprehensive list is not feasible. However, some notable exports can be identified:

- **CLI:** The `cli/src/index.ts` file appears to be an entry point for CLI commands.  While specific exported functions are not immediately visible without deeper inspection, it suggests a command-line interface with functionality related to HTML processing.
- **Next.js API Routes:** The `next/src/app/api/agents/route.ts` file defines an API route for agents, suggesting an endpoint accessible via HTTP requests.  The content of this file is not visible in the provided code snippet but its existence indicates a public API.
- **Components:** The `next/src/components/` directory contains numerous `.tsx` files (e.g., `ai-prompt-bar.tsx`, `deck-viewer.tsx`), which likely export React components used within the application's UI.

## Dependencies
Based on `package.json` and `pnpm-lock.yaml`:

- **Core Libraries:** React, ReactDOM, TypeScript, Next.js, pnpm, Vitest, Playwright (for E2E tests).
- **UI/Design:** Tailwind CSS (@tailwindcss/postcss), Lucide React.
- **HTML Processing:**  `dompurify`, `marked`, `highlight.js`, `unpdf`, `xlsx`.
- **AI Related:** The presence of "AGENTS" in multiple files and directories suggests integration with AI models or agents, although specific libraries are not immediately apparent from the provided code.

## Architecture Patterns
- **Monorepo Structure:**  The project utilizes a monorepo structure managed by pnpm (`pnpm-workspace.yaml`), containing separate packages for CLI tools, end-to-end tests, and the Next.js frontend.
- **Next.js App Router:** The `next/src/app` directory indicates usage of Next.js's app router introduced in version 13.
- **Agent-Based Architecture (Potential):**  The repeated references to "AGENTS" suggest a potential architecture where agents or AI models play a role in the application’s functionality, although the specifics are not evident from the provided code.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **HTML Processing Capabilities:** The libraries used for HTML processing (e.g., `unpdf`, `xlsx`) could be integrated into SEOSONA OS to enhance its ability to handle various document formats.
- **AI Integration Patterns:**  The "AGENT" architecture, if fully realized, might provide valuable insights into integrating AI models within a complex application, which is a key goal for SEOSONA OS. Further investigation would be needed to understand the specific implementation details.
- **Next.js Frontend Expertise:** The extensive use of Next.js provides a wealth of knowledge and reusable components that could inform the development of future SEOSONA OS user interfaces.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `remotion`, `hyperframe`
- **All scores:** {'seosona-os': 41, 'seosona-video': 44, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
