# KI: shinshin86/oh-my-logo

## Overview
This project is a command-line interface (CLI) tool that generates ASCII art logos with colorful gradients in the terminal. It supports two rendering systems: a traditional `figlet`-based approach and a newer, React-based system for filled block characters. The CLI allows users to customize fonts, palettes, and gradient directions.

## Tech Stack (from code)
- **TypeScript:**  The project is written primarily in TypeScript (`tsconfig.json`: `"language": "typescript"`).
- **React:** `InkRenderer.tsx` imports from React library (`import React from 'react';`).
- **Node.js:** The CLI is designed to run on Node.js (package.json: `"engines": { "node": ">=18" }`).
- **Vite:** Used as a build tool and test runner (`vitest.config.ts`).
- **Commander.js:**  Used for command-line argument parsing (`import { Command } from 'commander';` in `src/index.ts`).

## Public API / Exports
Based on the `package.json`'s "exports" section and source code, the following are exposed:

- **`render(text: string, options?: RenderOptions)`:**  From `src/lib.ts`, renders a logo using the traditional ASCII art method.
- **`renderFilled(text: string, options?: RenderInkOptions)`:** From `src/lib.ts`, renders a filled block character logo using React and Ink.
- **`getPaletteNames()`:**  From `src/lib.ts`, returns an array of available palette names.
- **`getDefaultPalette()`:** From `src/lib.ts`, returns the default color palette.
- **`resolveColors(palette: PaletteName | string[] | string)`:** From `src/lib.ts`, resolves a palette name or array of colors into an array of hex strings.

## Dependencies
Based on `package.json`:

- **cfonts:** Version 3.3.0 (Used for rendering characters in `InkRenderer.tsx`)
- **commander:** Version 11.1.0 (CLI argument parsing)
- **figlet:** Version 1.7.0 (ASCII art generation in `renderer.ts`)
- **gradient-string:** Version 2.0.2 (Gradient color generation)
- **ink:** Version 5.0.1 (React framework for terminal UI in `InkRenderer.tsx`)
- **react:** Version 18.3.1 (Used in the filled rendering system)

## Architecture Patterns
- **Dual Rendering Systems:** The project implements two distinct logo rendering systems: a traditional ASCII art approach and a React-based "filled" mode (`CLAUDE.md`). This introduces complexity but allows for different visual styles.
- **Command-Line Interface (CLI):**  The core functionality is exposed through a CLI using Commander.js, providing a user-friendly way to generate logos.
- **Configuration-Driven:** The project uses configuration files like `tsconfig.json` and `package.json` to manage build settings, dependencies, and scripts.
- **Modular Design:** Code is organized into modules (`src/utils`, `src/palettes`, `src/renderer`) with clear responsibilities.

## Relevance to SEOSONA OS
The project's code could benefit SEOSONA OS in the following ways:

- **Terminal Customization:** The logo generation capabilities can be integrated into SEOSONA OS for creating custom terminal prompts, status displays, or informational banners.
- **ASCII Art Library:**  The `figlet` and gradient rendering logic within `renderer.ts` could be adapted as a reusable library for generating ASCII art in other parts of the operating system.
- **CLI Framework Example:** The use of Commander.js provides an example of how to build robust command-line tools, which is valuable for developing OS utilities.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `render`
- **All scores:** {'seosona-os': 20, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
