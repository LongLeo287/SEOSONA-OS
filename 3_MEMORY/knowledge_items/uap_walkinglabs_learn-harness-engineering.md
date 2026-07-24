# KI: walkinglabs/learn-harness-engineering

## Overview
This repository contains documentation and example code for a course on "Learn Harness Engineering," focused on building reliable coding environments for AI agents. The core is a VitePress documentation site alongside hands-on project code, primarily utilizing Electron for desktop application development.  The `CLAUDE.md` file suggests this is intended to be used with the Claude AI assistant.

## Tech Stack (from code)
- **TypeScript:** Widely used throughout the codebase, evident in files like `docs/lectures/lecture-02-what-a-harness-actually-is/code/harness-vs-no-harness.ts` and `projects/shared/types.ts`.
- **JavaScript:** Used alongside TypeScript, as seen in `get_anthropic_logo.js`.
- **VitePress:**  The documentation site generator, configured in `docs/.vitepress/config.mts` and utilized via scripts like `npm run docs:dev`, `npm run docs:build`, and `npm run docs:preview`.
- **Electron:** Used for building desktop applications as described in the `CLAUDE.md` file and within project directories (e.g., `projects/project-NN/starter`).
- **React:**  Mentioned in `CLAUDE.md` as part of the Electron application's renderer process: "Renderer (`src/renderer/`): React UI with document list, Q&A panel, status bar".
- **Node.js:** Used for scripting and build tasks (e.g., `scripts/capture-readme-screenshots.ts`, `scripts/build-course-pdfs.ts`).

## Public API / Exports
Due to the nature of this project as a documentation site and example codebase, there are no readily apparent public APIs or exports in the sense of a library or service. The primary "exports" are the content within the VitePress documentation (Markdown files) and the runnable code examples found in `docs/lectures/<lecture-dir>/code/`.  The Electron projects likely have internal APIs exposed through IPC channels, but these aren't globally accessible from this repository.

## Dependencies
Based on `package.json`:
- **mermaid:** Version 11.14.0 - Used for diagrams (likely within Markdown files).
- **pdf-lib:** Version 1.17.1 -  Used for PDF generation, as indicated by the "pdf:export" script.
- **playwright:** Version 1.59.1 - Used for screenshot capture in `scripts/capture-readme-screenshots.ts`.
- **tsx:** Version 4.19.0 - A TypeScript execution environment.
- **typescript:** Version 5.7.0 - The core TypeScript compiler.
- **vitepress:** Version 1.6.4 -  The static site generator.
- **vitepress-plugin-mermaid:** Version 2.0.17 - VitePress plugin for Mermaid diagrams.
- **github-slugger:** Version 2.0.0 - Used for generating URL slugs from titles (likely within the VitePress build process).

## Architecture Patterns
- **Modular Documentation Structure:** The documentation is organized into lectures, each with its own directory containing Markdown files and code examples. This promotes a structured learning path.
- **Electron Application Architecture:**  The Electron projects follow a standard architecture: main process, preload script, renderer process, services, and shared types (as described in `CLAUDE.md`).
- **IPC Channel Constants:** The use of constants for IPC channels (`src/shared/types.ts`) promotes consistency and maintainability within the Electron applications.
- **Local Data Storage:**  Data is stored locally as JSON/text files, avoiding reliance on external databases (as noted in `CLAUDE.md`).



## Relevance to SEOSONA OS
The codebase demonstrates several patterns relevant to SEOSONA OS:

- **Reliable Coding Environments:** The core focus of the course – building reliable coding environments for AI agents – directly aligns with SEOSONA's goals of creating robust and predictable systems.  The harness engineering principles could be adapted to improve the stability and control of AI agent interactions within a SEOSONA environment.
- **Electron Application Development:** If SEOSONA requires desktop components, the Electron architecture patterns (main/preload/renderer) provide a solid foundation for development.
- **Local Data Storage:** The emphasis on local data storage aligns with potential requirements for offline functionality or increased privacy within SEOSONA.  This could be adapted to manage sensitive data locally while still integrating with centralized systems when available.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
