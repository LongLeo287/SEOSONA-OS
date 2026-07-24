# KI: onmax/npm-agentskills

## Overview
This project, `npm-agentskills`, provides a framework for discovering and exporting skills for AI coding agents. It aims to be framework-agnostic, supporting various agent platforms like Claude, Copilot, and others. The core functionality involves scanning packages (both local and from `node_modules`) for skill definitions and then exporting those skills to designated locations based on target agent requirements.

## Tech Stack (from code)
- **TypeScript:**  The primary language used throughout the project (`tsconfig.json`: `"include": ["src"]`, numerous `.ts` files).
- **Node.js:** The runtime environment, evidenced by `package.json`'s `"type": "module"` and usage of Node.js built-in modules like `fs` (`src/export.ts`: `import { promises as fsp } from 'node:fs'`).
- **ES Modules:**  The project utilizes ES module syntax, confirmed by `package.json`: `"type": "module"`.
- **Rollup / Vite (likely):** While not directly specified in a configuration file, the presence of `@nuxt/kit` and its dependencies suggests that Rollup or Vite is used for bundling (`package.json`: `@nuxt/kit`, `@nuxt/schema`).
- **Nuxt.js:** The project includes Nuxt module functionality (`src/nuxt.ts`, `package.json`: `"peerDependencies": { "@nuxt/kit": "^4.0.0", "nuxt": "^3.14.0 || ^4.0.0" }`)

## Public API / Exports
Based on the `src/index.ts` file, the following are exported:

- `copySkillDir`:  Copies a skill directory recursively (`src/index.ts`: `export { copySkillDir } from './export'`).
- `expandHome`: Expands tilde (`~`) to the user's home directory (`src/index.ts`: `export { expandHome } from './export'`).
- `exportToTargets`: Exports skills to agent target destinations (`src/index.ts`: `export { exportToTargets } from './export'`).
- `generateManifest`: Generates a manifest file for the skills (`src/index.ts`: `export { generateManifest } from './manifest'`).
- `findReferences`: Finds reference files within a skill directory (`src/index.ts`: `export { findReferences } from './resolve'`).
- `parseSkillMd`: Parses the SKILL.md file to extract metadata (`src/index.ts`: `export { parseSkillMd } from './resolve'`).
- `resolveSkills`: Resolves skills from scanned packages and local package.json (`src/index.ts`: `export { resolveSkills } from './resolve'`).
- `scanForSkillPackages`: Scans node_modules for skill packages (`src/index.ts`: `export { scanForSkillPackages } from './scan'`).
- `scanLocalPackage`: Scans the local project package.json for agents (`src/index.ts`: `export { scanLocalPackage } from './scan'`).
- `AGENT_DESTINATIONS`: A constant defining agent target destination paths (`src/index.ts`: `export { AGENT_DESTINATIONS } from './types'`)

## Dependencies
Based on the `package.json` file:

**Production Dependencies:**
- `citty`:  ^0.1.6
- `consola`: ^3.4.0
- `gray-matter`: ^4.0.3
- `pathe`: ^2.0.0
- `pkg-types`: ^2.0.0

**Development Dependencies:**
- `@antfu/eslint-config`: ^4.0.0
- `@nuxt/kit`: ^4.0.0
- `@nuxt/schema`: ^4.0.0
- `@nuxt/test-utils`: ^3.21.0
- `@types/node`: ^22.0.0
- `bumpp`: ^10.0.0
- `eslint`: ^9.0.0
- `tsdown`: ^0.9.0
- `typescript`: ^5.7.0
- `vitest`: ^3.0.0

## Architecture Patterns
- **Modular Design:** The project is structured into modules (`src/export`, `src/manifest`, `src/resolve`, `src/scan`) with clear responsibilities, promoting code reusability and maintainability.
- **Configuration-Driven:**  The agent targets and other settings are configurable through the Nuxt module options (`src/nuxt.ts`: `NuxtModuleOptions`).
- **File System Interaction:** The project heavily interacts with the file system for scanning packages, copying skill directories, and writing manifest files (`src/export.ts`, `src/scan.ts`, `src/manifest.ts`).
- **Plugin Architecture (Nuxt):**  The integration with Nuxt suggests a plugin architecture where skills are discovered and exported as part of the build process.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Skill Management:** The skill discovery and export functionality can be adapted for managing and distributing custom skills or plugins within SEOSONA OS.
- **Agent Integration:**  The framework’s ability to target different agent platforms provides a foundation for integrating with various AI agents used by SEOSONA OS.
- **Extensibility:** The modular design allows for easy extension to support new skill types, agent targets, or export formats.
- **Automation:** The automated scanning and export process can streamline the deployment of skills within SEOSONA OS environments.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
