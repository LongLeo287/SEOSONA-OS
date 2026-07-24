# KI: Rune-kit/rune

## Overview
The `rune` repository appears to be a framework for AI coding assistants, providing a mesh of interconnected skills and a multi-platform compiler. It aims to provide "runtime auto-discipline" through native hooks and a layered architecture, supporting various AI IDEs like Claude Code, Cursor, Windsurf, and others. The project emphasizes structured skill invocation and avoids casual application of skills.

## Tech Stack (from code)
- **JavaScript/Node.js:**  The `package.json` file indicates the project is built using Node.js with JavaScript modules (`"type": "module"`).  The presence of `.js` files throughout the codebase, particularly in directories like `compiler/`, `commands/`, and `hooks/`, confirms this. The `bin` entry in `package.json` points to a Javascript file: `"bin": { "rune": "./compiler/bin/rune.js" }`.
- **Biome:**  The project utilizes Biome for code formatting and linting, as evidenced by the `biome.json` file and scripts like `"lint"` and `"format"` in `package.json`: `"scripts": { "lint": "biome check .", "lint:fix": "biome check --fix ."}`
- **JSON:** Configuration files are used extensively (e.g., `plugin.json`, `governance.schema.json`).
- **Markdown:** Documentation and skill definitions appear to be stored in Markdown format (`.md` files).

## Public API / Exports
Due to the sheer size of the repository, a comprehensive list is impractical. However, based on `package.json` and file structure:

- **`rune` CLI:** The primary entry point appears to be the `rune` command-line interface, defined in `package.json`: `"bin": { "rune": "./compiler/bin/rune.js" }`.  This suggests a public API for interacting with the system through commands like `build`, `doctor`, etc.
- **Skill Hooks:** The `hooks/` directory indicates a hook-based architecture, suggesting exported functions or events that can be used to extend or modify the behavior of skills. For example, `compiler/adapters/*.js` and `hooks/*.js` suggest adapter implementations and hooks respectively.
- **Adapters:**  The `compiler/adapters/` directory contains adapters for various AI platforms (e.g., Claude, Cursor, Windsurf). These likely expose APIs specific to each platform.

## Dependencies
Based on the `package.json` file:

- `@biomejs/biome`: Version 2.4.7 - Used for linting and formatting.
- c8: Version 10.1.3 -  Used for code coverage reporting.
- Node.js (>=18): As specified in the `engines` section of `package.json`.

## Architecture Patterns
- **Plugin Architecture:** The presence of `.claude-plugin/` and files like `plugin.json` suggests a plugin architecture, particularly for integration with Claude Code.
- **Layered Architecture:**  The documentation in `CLAUDE.md` explicitly mentions a "5-layer mesh architecture," indicating a structured approach to skill organization and interaction.
- **Adapter Pattern:** The `compiler/adapters/` directory demonstrates the adapter pattern, allowing the core functionality to be adapted for different platforms.
- **Skill-Based Architecture:**  The project revolves around reusable skills defined in `.md` format, promoting modularity and reusability.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by:

- **AI Assistant Integration:** The framework’s multi-platform adapter design allows for easier integration of AI coding assistant functionality into the SEOSONA OS environment.  The adapters can be extended or modified to support new platforms as they emerge.
- **Skill-Based Workflow Automation:** The skill-based architecture could be leveraged to automate common development tasks within SEOSONA OS, improving developer productivity and consistency.
- **Code Quality Enforcement:** Biome integration provides a foundation for enforcing consistent code style and quality across the SEOSONA OS codebase.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`, `router`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 66, 'seosona-flow': 0}
