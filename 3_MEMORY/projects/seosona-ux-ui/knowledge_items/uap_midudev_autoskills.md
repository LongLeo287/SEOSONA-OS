# KI: midudev/autoskills

## Overview
This repository, `midudev/autoskills`, appears to be a command-line interface (CLI) tool designed for automatically detecting and installing AI agent skills. The project focuses on providing a hardened environment with specific rules around dependency management and code quality, as evidenced by the `AGENTS.md` file detailing security practices and coding conventions. It leverages TypeScript and Astro for development and deployment.

## Tech Stack (from code)
- **Language:** TypeScript (`packages/autoskills/tsconfig.json`: `"extends": "astro/tsconfigs/strict"`)
- **Framework:** Astro (`packages/autoskills/package.json`: `"dependencies": {"astro": "6.4.6"}`)
- **Build System:** `tsc` (TypeScript compiler, as specified in `packages/autoskills/package.json`: `"scripts": {"build": "tsc"}`)
- **Package Manager:** pnpm (`package.json`: `"packageManager": "pnpm@10.33.0"`)

## Public API / Exports
Based on the `packages/autoskills/index.mjs` file, the primary exported item is the `autoskills` command:

```typescript
// packages/autoskills/index.mjs
{
  "bin": {
    "autoskills": "index.mjs"
  }
}
```

This suggests that running `autoskills` from the command line executes code within this file. Further analysis of `index.mjs` would be needed to determine the specific functions and classes exposed by the CLI.

## Dependencies
Based on `package.json` and `packages/autoskills/package.json`:

*   **Root Package:**
    *   `@tailwindcss/vite`: 4.3.1
    *   `astro`: 6.4.6
    *   `geist`: 1.7.2
    *   `tailwindcss`: 4.3.1
    *   `oxfmt`: 0.54.0 (devDependency)
    *   `oxlint`: 1.69.0 (devDependency)

*   **Autoskills Package:**
    *   `typescript`: 5.8.3 (devDependency)

The `pnpm-lock.yaml` file provides a more comprehensive list of transitive dependencies, including `@babel/parser`, `@babel/types`, and others related to Astro's build process.

## Architecture Patterns
- **Modular Design:** The project is structured into multiple packages (`packages/autoskills`), suggesting a modular architecture where different functionalities are separated into distinct modules.
- **CLI Tooling:**  The `index.mjs` file and the presence of a `"bin"` entry in `packages/autoskills/package.json` indicate that this is designed as a command-line tool.
- **Hardened Dependency Management:** The `AGENTS.md` file outlines strict rules for dependency management, including pinning exact versions, disabling automatic updates, and verifying package publishers. This demonstrates a focus on security and reproducibility.
- **Configuration Driven**:  The project uses configuration files like `tsconfig.json`, `astro.config.mjs`, and `package.json` to define build settings, dependencies, and scripts.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **Dependency Management Best Practices:** The strict dependency management rules outlined in `AGENTS.md` can serve as a model for ensuring security and stability within SEOSONA OS projects.  The use of exact version pinning and restrictions on update mechanisms are valuable lessons.
- **CLI Tooling Patterns:** The structure and design of the `autoskills` CLI tool could provide inspiration for building other command-line utilities within SEOSONA OS, particularly those related to automation or configuration management.
- **Modular Architecture:**  The modular package structure demonstrates a good approach to organizing large projects, which is beneficial for maintainability and scalability in SEOSONA OS.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `accessibility` · **Fit:** 100/100 · **Auto-apply:** True
- **Evidence:** `a11y`, `accessibility`, `wcag`, `aria`
- **All scores:** {'seosona-os': 89, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 100, 'seosona-flow': 28}
