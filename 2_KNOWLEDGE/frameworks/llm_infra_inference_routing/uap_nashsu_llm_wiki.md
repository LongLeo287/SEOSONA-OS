# KI: nashsu/llm_wiki

## Overview
This project, `llm-wiki`, is a desktop application designed for creating and managing knowledge bases powered by LLMs. It allows users to create, edit, and organize wiki pages, integrate with external search engines, and leverage AI agents for research and summarization tasks. The codebase demonstrates a focus on local data persistence, offline functionality, and integration with Tauri for cross-platform desktop deployment.

## Tech Stack (from code)
- **TypeScript:**  The primary language used throughout the project (`tsconfig.json`, `src/*.ts*`).
- **React/JSX:** Used extensively for UI components (`App.tsx`, `components/*.tsx`).
- **Vite:** The build tool and development server (`vite.config.ts`, `package.json` script "dev").
- **Tailwind CSS:**  Used for styling (`vite.config.ts`, `index.css`).
- **Rust (Tauri):**  The application is built using Tauri, indicating a Rust backend for native desktop functionality (references in `vite.config.ts` and `package.json`).
- **Sigma.js:** Used for graph visualization (`@react-sigma/core`, `src/components/graph/graph-view.tsx`)

## Public API / Exports
Due to the nature of TypeScript modules, it's difficult to definitively list "public" exports without more context (e.g., a published library). However, based on import statements and file structure, some likely exported components include:

- `App`: From `src/App.tsx` - The main application component.
- `WikiEditor`: From `src/components/editor/wiki-editor.tsx` - A component for editing wiki pages.
- `ChatInput`: From `src/components/chat/chat-input.tsx` -  A component for user input in a chat interface.
- `GraphView`: From `src/components/graph/graph-view.tsx` - Component to display knowledge graph.
- Functions within `src/lib/*`: Numerous functions related to API interactions, data processing (e.g., `anytxtSearch`, `buildAzureOpenAiUrl`).

## Dependencies
Based on `package.json`:

- `@base-ui/react`: UI component library.
- `@fontsource-variable/geist`: Font management.
- `@milkdown/kit`, `@milkdown/plugin-math`, `@milkdown/react`, `@milkdown/theme-nord`: Markdown editor components.
- `@react-sigma/core`: Graph visualization library.
- `@tauri-apps/*`:  Tauri framework for desktop application development.
- `class-variance-authority`: Utility-first CSS.
- `graphology`, `graphology-communities-louvain`, `graphology-layout-forceatlas2`: Graph data structures and layout algorithms.
- `i18next`, `react-i18next`: Internationalization library.
- `js-yaml`: YAML parsing.
- `jszip`: Zip file manipulation.
- `katex`: Mathematical formula rendering.
- `lucide-react`: Icon set.
- `mermaid`: Diagramming and charting tool.
- `react`, `react-dom`: React core libraries.
- `tailwindcss`: CSS framework.
- `tw-animate-css`: CSS animation library.
- `zustand`: State management library.

## Architecture Patterns
- **Component-Based UI:** The application heavily utilizes React components for modularity and reusability.
- **Context-Aware Routing:**  The routing logic appears to be context-aware, adapting based on the selected project and user preferences (e.g., `app-layout.tsx`).
- **Plugin/Extension Architecture:** The use of Tauri suggests a plugin or extension architecture for adding functionality (manifest.json in `extension/` directory).
- **State Management with Zustand:**  Zustand is used to manage application state, likely providing global access to data and logic across components.
- **Asynchronous Operations & Promises:** Numerous asynchronous operations (API calls, file I/O) are handled using promises (`async/await`).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Local Knowledge Management:** The core functionality of creating and managing local knowledge bases aligns with potential needs for SEOSONA OS users.  The offline capabilities are particularly valuable.
- **AI Integration:** The integration with LLMs demonstrates a clear path for incorporating AI features into SEOSONA OS, such as intelligent search, summarization, and content generation.
- **Cross-Platform Desktop Application Development:** The use of Tauri provides a blueprint for building cross-platform desktop applications within the SEOSONA OS ecosystem.  The modular design could be adapted to create specialized tools or utilities.
- **Graph Visualization:** The graph visualization component (Sigma.js) could be leveraged to represent relationships between data points, providing users with a more intuitive understanding of complex information.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `ollama`, `embedding`, `rag`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 0}
