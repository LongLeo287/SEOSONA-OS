# KI: earthtojake/text-to-cad

## Overview
This repository appears to be a workbench for developing agent skills related to CAD (Computer-Aided Design). It includes components for generating, rendering, and manipulating CAD models, with a focus on implicit surfaces and browser-based visualization. The project utilizes both JavaScript and Python for different aspects of the workflow, from frontend UI to backend model generation.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The `packages/cadjs` directory contains a `package.json` file indicating usage of JavaScript modules (`"type": "module"`). The presence of `.tsx`, `.jsx`, and `.ts` files in the `docs/src/app` directory further confirms TypeScript usage for frontend development.
- **Python:**  The `packages/cadpy` directory contains a `pyproject.toml` file, indicating Python projects using setuptools.
- **Three.js:** The `packages/cadjs/package.json` file lists `"three": "0.160.0"` as a dependency, confirming the use of Three.js for 3D rendering.
- **Next.js:**  The `docs` directory contains files like `next.config.ts`, `vercel.json`, and `package.json`, indicating that it is built with Next.js framework.

## Public API / Exports
Based on the code, here are some exported items:

*   **`packages/cadjs/src/index.js`**: Exports functions related to CAD scenes, rendering models, sources, themes, and other core functionalities.  For example: `export * from "./common/cadScene.js";`.
*   **`packages/implicitjs/src/index.js`**: Exports various modules for implicit CAD operations including schema definition, animation, model loading, rendering, snapshots, mesh generation, and exporting models. For example: `export * from "./lib/implicitCad/schema.js";`.

## Dependencies
Based on the `package.json` files in `packages/cadjs` and `packages/implicitjs`:

*   **`packages/cadjs/package.json`**: `"gifenc": "^1.0.3", "three": "0.160.0"`
*   **`packages/implicitjs/package.json`**: `"gifenc": "^1.0.3", "playwright": "^1.52.0", "three": "0.160.0"`.
*  **`packages/cadpy/pyproject.toml`**: `build123d`, `cadquery-ocp`

## Architecture Patterns
*   **Modular Design:** The project is structured into multiple packages (`cadjs`, `implicitjs`, `cadpy`), suggesting a modular architecture with distinct responsibilities for each package.
*   **Layered Architecture (in cadjs):**  The `packages/cadjs/src/index.js` file exports from subdirectories like "common" and "lib", indicating a layered design where common utilities are separated from more specific functionalities.
* **Plugin-based architecture:** The AGENTS.md file describes a plugin based architecture with symlinks across generated runtime, viewer-local package, and plugin package paths.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

*   **CAD Model Generation & Visualization:**  The `cadjs` and `implicitjs` packages provide tools for generating and rendering CAD models, which could be integrated into SEOSONA OS for tasks like virtual prototyping or design visualization.
*   **Agent Skill Development:** The "workbench" nature of the project suggests it's designed to facilitate development of agent skills related to CAD. This aligns with a potential need in SEOSONA OS for agents capable of interacting with and manipulating 3D models.
* **Implicit Surface Modeling**:  The focus on implicit surfaces within `implicitjs` could be valuable if SEOSONA OS needs advanced modeling capabilities beyond traditional polygonal representations.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `playwright`
- **All scores:** {'seosona-os': 22, 'seosona-video': 22, 'seosona-content': 22, 'seosona-ux-ui': 22, 'seosona-flow': 6}
