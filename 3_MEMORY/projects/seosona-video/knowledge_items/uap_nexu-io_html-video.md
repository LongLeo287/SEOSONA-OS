# KI: nexu-io/html-video

## Overview
This repository, `nexu-io/html-video`, is a monorepo for an open-source HTML→Video meta-layer designed for coding agents. It aims to provide a unified platform that supports multiple rendering engines (Hyperframes, Remotion) and simplifies the process of creating video content from HTML structures. The project appears to be in active development, with ongoing work on adapters, a CLI tool, and a studio UI.

## Tech Stack (from code)
- **TypeScript:**  The primary language used throughout the codebase, evidenced by numerous `.ts` and `.tsx` files (e.g., `packages/adapter-hyperframes/src/capabilities.ts`, `packages/cli/src/bin.ts`).
- **React:** Used within the Remotion adapter's bridge (`packages/adapter-remotion/src/bridge`) and likely in the project studio UI, as indicated by the presence of `.tsx` files and dependencies on `react` and `react-dom` in `package.json`.
- **Node.js:** The runtime environment for the CLI tool and other scripts, confirmed by the `bin` entry point in `packages/cli/package.json` (`"bin": { "html-video": "./dist/bin.js" }`) and the use of Node.js modules.
- **Vite:** Used as a build tool for `@html-video/studio-next`, evidenced by its presence in `packages/studio-next/package.json` (`"scripts": { "dev": "vite", ...}`).
- **Biome:**  Used for code formatting and linting, indicated by the `biome.json` file at the root of the repository and the script defined in `package.json` (`"format": "biome format --write ."`).
- **pnpm:** Package manager used to manage dependencies as specified in `package.json` (`"packageManager": "pnpm@9.15.0"`).

## Public API / Exports
Based on the code, here are some notable exported items:

- **`@html-video/core`**:  Exports `HtmlVideoError`, `AssetStore`, `EngineRegistry`, `ProjectOrchestrator`, and related types (e.g., `CreateProjectInput`). See `packages/core/src/index.ts`.
- **`@html-video/cli`**: Exports `bootstrap`, `findProjectRoot`, `startStudioServer`.  See `packages/cli/src/index.ts`.
- **`@html-video/runtime`**: Exports `AgentDef`, `AgentInvokeContext`, `AGENT_DEFS`, `detectOne`, `spawnAgent`, and related types. See `packages/runtime/src/index.ts`.
- **`@html-video/content-graph`**:  Exports `Node`, `Edge`, and `ContentGraph` interfaces, defining the content graph schema. See `packages/content-graph/src\index.ts`.

## Dependencies
Key dependencies (from `package.json`):

- `@remotion/bundler`: Version 4 (used by adapter-remotion)
- `@remotion/renderer`: Version 4 (used by adapter-remotion)
- `react`: Version 18 or 19 (used by adapter-remotion and potentially project studio)
- `react-dom`: Version 18 or 19 (used by adapter-remotion and potentially project studio)
- `hyperframes`:  Version 0.4.x (peer dependency of adapter-hyperframes)
- `@html-video/core`: Used as a workspace dependency in multiple packages.

## Architecture Patterns
- **Monorepo:** The project utilizes a monorepo structure with workspaces, allowing for code sharing and modular development across different components (adapters, CLI, core). This is evident from the `pnpm-workspace.yaml` file.
- **Adapter Pattern:**  The architecture employs an adapter pattern to support multiple rendering engines (Hyperframes, Remotion). Each engine has its own adapter package (`packages/adapter-hyperframes`, `packages/adapter-remotion`) that implements a common interface (`EngineAdapter`).
- **Plugin Architecture**: The ability to add new rendering engines through adapters suggests a plugin architecture.
- **Content Graph:** A central concept is the "content graph," which represents the structure and dependencies of HTML frames, facilitating content orchestration and rendering across different engines.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Video Generation Capabilities**: The core functionality of converting HTML structures into videos can be integrated into SEOSONA OS for creating dynamic tutorials, demonstrations, or promotional content.
- **Agent Integration:**  The focus on coding agents and the runtime adapter (`@html-video/runtime`) could enable SEOSONA OS to leverage AI agents for automated video creation workflows.
- **Modular Design**: The modular architecture (adapters) allows for easy integration of new rendering engines or customization of existing ones, aligning with SEOSONA OS's potential need for flexibility in content generation.
- **Content Graph as a Foundation:**  The content graph concept could be adapted to represent and manage other types of structured data within SEOSONA OS, enabling more sophisticated workflows and automation.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 89/100 · **Auto-apply:** True
- **Evidence:** `remotion`, `render`, `gsap`, `hyperframe`
- **All scores:** {'seosona-os': 82, 'seosona-video': 89, 'seosona-content': 33, 'seosona-ux-ui': 44, 'seosona-flow': 28}
