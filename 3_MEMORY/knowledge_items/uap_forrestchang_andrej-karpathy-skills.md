# KI: forrestchang/andrej-karpathy-skills

## Overview
This repository appears to be a collection of behavioral guidelines and resources related to software development, inspired by Andrej Karpathy’s principles. It provides instructions and files intended for use with both Claude Code (via a plugin) and Cursor, a code editor focused on AI assistance. The core content revolves around promoting thoughtful coding practices and reducing common LLM-related errors.

## Tech Stack (from code)
The project primarily uses Markdown (`.md`, `.mdc`) and JSON (`.json`) files for documentation and configuration. There's no explicit indication of a programming language or build system within the provided file list, suggesting it is focused on textual guidelines rather than executable code. The presence of `plugin.json` suggests integration with Claude Code, which itself uses a proprietary environment.

## Public API / Exports
There are no exported functions, classes, or endpoints in the provided source code.  The files primarily contain text-based instructions and guidelines intended for human consumption or use within specific tools like Cursor and Claude Code. The `skills/karpathy-guidelines/SKILL.md` file is referenced as a potential reusable skill but does not represent an exported API.

## Dependencies
There are no dependency files (e.g., `package.json`, `requirements.txt`) provided in the listed files, so dependencies cannot be determined from this source code alone. The `plugin.json` and `marketplace.json` within `.claude-plugin/` suggest a dependency on Claude Code's plugin system, but specific library versions are not visible.

## Architecture Patterns
The primary architectural pattern is that of layered documentation. There's a clear separation between:
*   **General Guidelines:** Defined in `CLAUDE.md`.
*   **Cursor Integration:** Described in `CURSOR.md` and implemented via `.cursor/rules/karpathy-guidelines.mdc`.
*   **Claude Code Plugin:** Managed by files within the `.claude-plugin/` directory (specifically `plugin.json` and `marketplace.json`).
*   **Reusable Skill:**  Represented by `skills/karpathy-guidelines/SKILL.md`.

The documentation emphasizes synchronization between these layers, particularly between `CLAUDE.md`, `.cursor/rules/karpathy-guidelines.mdc`, and `skills/karpathy-guidelines/SKILL.md` when changes are made to the core guidelines.



## Relevance to SEOSONA OS
Without knowing more about SEOSONA OS, it's difficult to assess direct relevance. However, the principles outlined in `CLAUDE.md` (thinking before coding, simplicity first, surgical changes, goal-driven execution) are universally applicable to software development and could be valuable for improving code quality and reducing errors within any software project, including SEOSONA OS. The Cursor integration approach might also be adaptable if SEOSONA OS uses a similar AI-assisted coding environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
