# KI: nicobailon/visual-explainer

## Overview
This project provides an agent skill for generating HTML pages containing diagrams, diff reviews, plan reviews, slide decks, and data tables. It appears to be designed as a plugin for the "Pi" platform, likely facilitating code generation or visualization tasks within that environment. The `package.json` file describes it as a "visual-explainer" agent skill.

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The presence of an `extension.ts` file (`plugins/visual-explainer/extension.ts`) and the `pi` section in `package.json` which lists this file as a plugin extension indicates TypeScript usage. The `package.json` also implies JavaScript is used, given it's a standard Node.js project structure.
- **Node.js:**  The `package.json` file defines dependencies and scripts typical of a Node.js project.
- **Mermaid:** Several markdown files in the `commands/` directory (e.g., `generate-web-diagram.md`, `slide-deck.html`) reference Mermaid, suggesting its use for diagram generation.

## Public API / Exports
The `package.json` file lists several slash commands that are exposed as part of the skill: `/diff-review`, `/plan-review`, `/project-recap`, `/fact-check`, `/generate-web-diagram`, `/generate-slides`, and `/generate-visual-plan`. These are defined in markdown files within the `plugins/visual-explainer/commands/` directory.  The `install-pi.sh` script copies these markdown files to a prompts directory, suggesting they represent user-facing commands.

## Dependencies
Based on `package.json`:
- `@earendil-works/pi-coding-agent`: Listed as a peer dependency. This suggests the plugin requires this package to function correctly within the Pi environment.

## Architecture Patterns
- **Plugin Architecture:** The project is structured as a plugin for an external platform ("Pi").  The `plugins/visual-explainer` directory contains the core skill logic, and the `extension.ts` file likely serves as the entry point for the plugin.
- **Markdown-Driven Commands:** Slash commands are defined using Markdown files (`commands/*.md`), which appear to contain instructions or prompts that trigger specific actions within the agent skill.

## Relevance to SEOSONA OS
The project's focus on generating visual representations of code and plans could be beneficial for SEOSONA OS, particularly in areas such as:
- **Code Review Visualization:** The `/diff-review` command suggests a capability for visualizing code differences, which would aid in the review process.
- **Project Planning & Tracking:**  The `/plan-review` and `/project-recap` commands could be adapted to generate visual summaries of project plans and progress within SEOSONA OS.
- **Diagram Generation:** The ability to generate diagrams (e.g., using Mermaid) would enhance the clarity and understanding of complex systems or processes within the operating system's development environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
