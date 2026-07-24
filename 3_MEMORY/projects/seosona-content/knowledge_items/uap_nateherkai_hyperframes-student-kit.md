# KI: nateherkai/hyperframes-student-kit

## Overview
This repository appears to be a workspace for creating video projects using Hyperframes, a framework built on top of Heygen. It provides tooling and guidelines for motion graphics creation, emphasizing specific aesthetic principles and workflows. The project structure suggests it's designed for students or individuals learning the Hyperframes workflow.

## Tech Stack (from code)
- **JavaScript/mjs:**  The presence of `package.json` and files like `scripts/animation-map.mjs` indicates JavaScript is the primary language, with `.mjs` extensions suggesting ES modules are used. File path: `package.json`, content: `"type": "commonjs"`.
- **Node.js:** The `package.json` file defines a Node.js project with scripts and dependencies. File path: `package.json`.
- **Playwright:** Listed as a dev dependency in `package.json`, suggesting automated testing or browser automation is used. File path: `package.json`, content: `"devDependencies": { "playwright": "^1.59.1" }`

## Public API / Exports
Due to the nature of this project (primarily a workspace and tooling), there are no readily apparent public APIs or exported functions directly visible in the provided code snippets. The `AGENTS.md` file mentions commands like `npx hyperframes preview`, `npx hyperframes render`, which suggest an internal CLI with functionality exposed through command-line tools, but these aren't explicitly defined as a public API.

## Dependencies
Based on the `package.json` file:
- **Playwright:** Version 1.59.1 (for testing or automation). File path: `package.json`.

## Architecture Patterns
- **Modular Composition Structure:** The project emphasizes organizing video projects into subfolders within `video-projects/`, each containing its own `index.html`, `assets/`, and other related files. This promotes modularity and reusability.  File path: `CLAUDE.md` content: "**This workspace hosts multiple video projects, one folder each, all under `video-projects/`.**"
- **Centralized Style Guide & Motion Philosophy:** The `MOTION_PHILOSOPHY.md` file acts as a central source of truth for aesthetic guidelines and best practices, ensuring consistency across projects. File path: `CLAUDE.md` content: "**`MOTION_PHILOSOPHY.md` (at the workspace root) is the canonical motion-graphics aesthetic...**"
- **CLI Tooling:** The project utilizes a command-line interface (`hyperframes`) for previewing, rendering, and linting compositions. File path: `AGENTS.md` content: "```bash\n npx hyperframes preview ... \n```".
- **Data Attributes for Composition Control:**  The use of data attributes like `data-start`, `data-duration`, and `data-track-index` within HTML elements suggests a declarative approach to controlling animation timelines. File path: `AGENTS.md` content: "Every timed element needs `data-start`, `data-duration`, and `data-track-index`".



## Relevance to SEOSONA OS
The project's focus on structured video composition, modularity, and centralized style guides could be beneficial for SEOSONA OS in the following ways:

*   **Templating & Standardization:** The workflow emphasizes reusable components and a defined aesthetic. This approach can be adapted to create standardized templates within SEOSONA OS for various content types.
*   **CLI Tooling Integration:**  The `hyperframes` CLI demonstrates how custom tooling can streamline video creation workflows. Similar tools could be developed for SEOSONA OS to automate common tasks and enforce quality standards.
*   **Data-Driven Composition:** The use of data attributes for controlling animation timelines provides a model for creating dynamic and interactive content within SEOSONA OS, potentially enabling more sophisticated user experiences.

## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `srt` · **Fit:** 66/100 · **Auto-apply:** True
- **Evidence:** `transcript`, `caption`
- **All scores:** {'seosona-os': 41, 'seosona-video': 44, 'seosona-content': 66, 'seosona-ux-ui': 66, 'seosona-flow': 0}
