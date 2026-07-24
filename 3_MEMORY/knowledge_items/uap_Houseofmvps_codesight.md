# KI: Houseofmvps/codesight

## Overview
Codesight is a command-line tool designed to generate AI context for tools like Claude, Cursor, and Copilot. It scans codebases, extracts information such as routes, schemas, components, and dependencies, and formats this data into a knowledge base that can be used by AI coding assistants. The project also includes functionality for generating AI configuration files and HTML reports summarizing the codebase structure.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"` in `src/types.ts` - though this is part of a larger type definition, it indicates TypeScript usage). JavaScript is also used extensively.
- **Framework:** The project detects and supports various frameworks including Next.js, Express, Fastify, Phoenix, Spring, and others (see `src/scanner.ts`, `src/core.ts` for framework detection logic).  The `ProjectInfo` interface in `src/types.ts` defines a `frameworks` array.
- **Build System:** pnpm (`package.json`: `"scripts": { "build": "tsc" }`) and TypeScript compiler (tsc) are used for building the project. AssemblyScript is also used for WASM plugin generation (`plugins/ast/Cargo.toml`).

## Public API / Exports
Based on `package.json`'s `exports` section, the following modules are publicly exposed:
- `.`:  `./dist/index.js` (main entry point)
- `./plugins`: `./dist/plugins/index.js`
- `./plugins/cicd`: `./dist/plugins/cicd/index.js`
- `./plugins/githooks`: `./dist/plugins/githooks/index.js`
- `./plugins/skills`: `./dist/plugins/skills/index.js`
- `./plugins/terraform`: `./dist/plugins/terraform/index.js`
- `./dist/*`:  All modules within the `dist` directory are exported.

## Dependencies
Based on `package.json`, key dependencies include:
- `@types/node`: ^22.0.0
- assemblyscript: 0.28.19
- tsx: 4.19.0
- typescript: 5.7.0
- Node.js runtime (engines: `"node": ">=18.0.0"`)

## Architecture Patterns
- **Plugin System:** The project utilizes a plugin system for extending functionality, particularly in areas like CI/CD and Git hooks (`plugins` directory).  This is evident from the `plugins/index.ts` file which acts as an entry point for plugins.
- **Modular Design:** The codebase is structured into modules (e.g., `src/config.ts`, `src/core.ts`, `src/scanner.ts`) with clear responsibilities, promoting maintainability and reusability.
- **Configuration-Driven:**  The project relies heavily on configuration files (`codesight.config.ts`, `pnpm-lock.yaml`, `tsconfig.json`) to control its behavior. The `loadConfig` function in `src/config.ts` demonstrates this.
- **Native AST Plugins**: Uses WASM plugins for parsing code, as seen in the `plugins/ast` directory and related files like `assembly/index.ts`.

## Relevance to SEOSONA OS
Codesight's ability to generate AI context could be highly beneficial to SEOSONA OS.  Specifically:
- **Improved Code Understanding:** The codebase analysis capabilities can help SEOSONA OS understand the structure and dependencies of its own code, facilitating debugging, refactoring, and onboarding new developers.
- **AI-Powered Development Tools:** Codesight's generated context could be integrated into IDEs or other development tools within SEOSONA OS to provide AI-powered suggestions, autocompletion, and documentation generation.
- **Automated Documentation Generation**: The ability to extract routes, schemas, and components can automate the creation of technical documentation for SEOSONA OS services.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `rag`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
