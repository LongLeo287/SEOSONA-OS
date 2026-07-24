# KI: loerei/HoverSource

## Overview
This repository, `hoversource/HoverSource`, appears to be a monorepo for a tool designed to inspect UI elements and generate code snippets, likely for AI agents or other automated processes. The project aims to provide a "Zero-invasive UI-to-Code inspector" that helps developers save tokens when working with large codebases.  It seems to focus on integrating with various frontend frameworks like React, Vue, Svelte, Angular, etc.

## Tech Stack (from code)
- **TypeScript:** The primary language used for development, evidenced by the `tsconfig.json` file: 
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    ...
    "strict": true,
    ...
  },
  ...
}
```
- **JavaScript:** Used in conjunction with TypeScript.
- **React:** The `packages/babel-plugin-react` package suggests integration and manipulation of React code.
- **Babel:** Utilized for transpilation as shown by the dependency on `@babel/core` within `packages/babel-plugin-react/package.json`.
- **Vite:**  Used as a build tool, indicated by the presence of `vitest` in multiple package.json files (e.g., `package.json`, `packages\cli\package.json`).
- **Node.js:** The project is built and runs on Node.js, confirmed by the `package.json` file's `type: "module"` declaration and scripts that use Node commands like `tsc`.

## Public API / Exports
Based on a cursory examination of source code, it's difficult to definitively list all public APIs without more extensive analysis. However, some key exports are evident:

- **`babelPluginReactHoverSource()`:**  Exported from `packages\babel-plugin-react\src\index.ts`. This function is a Babel plugin for React that adds attributes to JSX elements.
```typescript
// packages\babel-plugin-react\src\index.ts
export default function babelPluginReactHoverSource() { ... }
```

- **`vitePluginReactHoverSource()`:** Exported from `packages\babel-plugin-react\src\index.ts`. This is a Vite plugin that uses the Babel plugin for React.
```typescript
// packages\babel-plugin-react\src\index.ts
export function vitePluginReactHoverSource() { ... }
```

- **`SourceResolver` class:** Exported from `packages\source-resolver\src\index.ts`. This class appears to be central to resolving source information for different UI frameworks.
```typescript
// packages\source-resolver\src\index.ts
export class SourceResolver { ... }
```

## Dependencies
Based on the `package.json` file, key dependencies include:

- `@types/node`:  TypeScript type definitions for Node.js.
- `@vitest/coverage-v8`: Vitest coverage reporter.
- TypeScript: The core language compiler.
- `@babel/core`: Babel core library.
- `ws`: WebSocket library (used in `@hoversource/client-injector`).

## Architecture Patterns
- **Monorepo:**  The project is structured as a monorepo, using workspaces to manage multiple packages (`packages/*`) within a single repository. This is evident from the `workspaces` array in `package.json`.
- **Plugin Architecture:** The use of Babel and Vite plugins suggests an extensible architecture where functionality can be added or modified without changing core components.  The `babel-plugin-react` package exemplifies this pattern.
- **Adapter Pattern:** The `packages\source-resolver` directory uses the Adapter pattern to support various UI frameworks (React, Vue, Svelte, Angular, etc.). Each framework has its own adapter that implements a common interface (`SourceAdapter`).

## Relevance to SEOSONA OS
The code in this repository could be beneficial to SEOSONA OS in several ways:

- **UI Code Generation:** The core functionality of generating UI code snippets from inspected elements could be integrated into SEOSONA OS to automate repetitive tasks or assist developers.
- **Framework Agnostic Support:**  The adapter pattern used for different UI frameworks allows the system to support a wide range of technologies, which is valuable in a diverse development environment.
- **Automated Testing/Debugging:** The ability to extract source information and generate code could be leveraged for automated testing or debugging purposes within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 56}
