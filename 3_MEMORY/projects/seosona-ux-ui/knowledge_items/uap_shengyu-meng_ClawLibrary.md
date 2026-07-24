# KI: shengyu-meng/ClawLibrary

## Overview
This project, "Claw Library," appears to be a 2D pixel-game museum UI designed for indexing, previewing, and monitoring OpenClaw assets and runtime flows. The code suggests it provides tools for editing map logic, managing asset definitions, and visualizing game environments. It seems to focus on providing an interactive environment for developers working with the "OpenClaw" system.

## Tech Stack (from code)
- **TypeScript:**  The project heavily utilizes TypeScript as evidenced by files like `tsconfig.json` (`{ "compilerOptions": { "target": "ES2022", ... } }`) and numerous `.ts` and `.tsx` files in the `src/` directory.
- **Vite:** The project uses Vite for bundling and development, confirmed by `vite.config.ts` (`import { defineConfig } from 'vite';`).  The `package.json` also lists "vite" as a dev dependency.
- **Phaser:** The project utilizes the Phaser game framework, imported in `src/main.ts` (`import Phaser from 'phaser';`). This is further confirmed by its presence in `package.json` under dependencies (`"dependencies": { "phaser": "^3.90.0" }`).
- **JSON:**  The project utilizes JSON for configuration and data storage, as seen in files like `clawlibrary.config.json`, `asset.manifest.json`, and `map.logic.json`.

## Public API / Exports
Due to the nature of this project (likely a UI application), it's difficult to define a clear public API without more context. However, based on the code:

- **`LibraryScene` class:**  Defined in `src/runtime/scene/LibraryScene.ts`, this appears to be the core scene object for the Phaser game.
- **Functions within `vite.config.ts`**: Functions like `createOpenClawSnapshot`, `resolveOpenClawPath`, and others are exported from `vite.config.ts` and used in the build process.  These aren't directly exposed as a public API, but they represent internal functionality.
- **Functions within `scripts/clawlibrary-config.mjs`**: Functions like `clawlibraryConfig` and `isLocalOnlyHost` are exported from this file and used for configuration purposes.

## Dependencies
Based on `package.json`:
- `"phaser": "^3.90.0"`:  A 2D game framework.
- `"pixelmatch": "^7.1.0"`: Used for visual regression testing.
- `"playwright": "^1.55.0"`: A tool for end-to-end testing and automation.
- `"sharp": "^0.34.3"`:  A library for image processing.
- `"typescript": "^5.9.2"`: The TypeScript compiler.
- `"vite": "^7.1.3"`: Build tool

## Architecture Patterns
- **Component-Based UI:** The use of Phaser suggests a component-based approach to building the user interface, with scenes and game objects acting as reusable components.
- **Configuration-Driven Development:**  The project relies heavily on configuration files (e.g., `clawlibrary.config.json`, `map.logic.json`) to define behavior and data, promoting flexibility and maintainability.
- **Modular Design:** The codebase is structured into modules (`core/`, `runtime/`, `ui/`), suggesting a modular design approach for better organization and reusability.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **Visualization Tools:**  The map editing and asset previewing capabilities could be adapted to create visualization tools for SEOSONA’s internal systems or data representations. The `map.logic.json` file provides a clear structure for defining spatial relationships, which is applicable to many domains beyond game environments.
- **UI Framework Integration:** The Phaser integration demonstrates how a robust 2D UI framework can be used effectively.  SEOSONA could leverage similar techniques and libraries for building its own user interfaces.
- **Configuration Management:** The configuration-driven approach employed in this project provides a good example of how to manage complex systems through external configuration files, which is valuable for SEOSONA's maintainability goals.

## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `accessibility` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `aria`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 0}
