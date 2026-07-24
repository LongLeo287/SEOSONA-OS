# KI: wquguru/harness-books

## Overview
This repository contains source material for two books related to "Harness Engineering" and a comparison of different approaches, likely intended for educational or documentation purposes. The codebase includes Markdown files, diagrams, and Python scripts used for building and exporting the books in various formats.  The project emphasizes reproducible builds and consistent metadata management.

## Tech Stack (from code)
- **Markdown:** Used extensively for content creation (131 `.md` files).
- **Python 3:** Utilized for build automation, print HTML generation, and PDF export (`tools/book-kit/*.py`).  This is evidenced by the shebang line in `tools/book-kit/build_print_html.py`: `#!/usr/bin/env python3`.
- **Honkit:** A static site generator used for building the books (referenced in build commands within `AGENTS.md`).
- **SVG & PNG:** Used for diagrams and cover images (`assets/*.svg`, `diagrams/*.png`).
- **JavaScript/Node.js:**  Used indirectly through Honkit, as indicated by the use of `npx` in build commands (e.g., `npx --yes honkit build . _book`).

## Public API / Exports
The project doesn't appear to expose a public API or library. It primarily focuses on content creation and book building processes rather than providing reusable code components. The "exports" are the generated books themselves in various formats (HTML, PDF).

## Dependencies
Dependencies are managed via Python scripts (`tools/book-kit/*.py`) and Honkit.  While a `package.json` or `requirements.txt` is not directly visible, the build commands within `AGENTS.md` suggest dependencies for Honkit and potentially other Node.js packages. The use of `npx --yes honkit build . _book` implies that Honkit itself has dependencies managed through npm.

## Architecture Patterns
- **Modular Book Structure:**  The project divides content into two distinct books (`book1-claude-code/`, `book2-comparing/`), each with its own directory structure and configuration files (e.g., `book.json`).
- **Build Automation:** Python scripts in the `tools/book-kit/` directory automate common build tasks, promoting consistency and reproducibility.
- **Separation of Concerns:** Assets (`assets/`), diagrams (`diagrams/`), and styles (`styles/`) are kept separate from the main content files.
- **Configuration-Driven Builds:** The `book.json` file appears to be central for managing book metadata and configuration, influencing build processes and output formats.

## Relevance to SEOSONA OS
This project's code demonstrates a structured approach to documentation and knowledge management, which could benefit SEOSONA OS in the following ways:
- **Documentation Generation:** The Honkit build process and Python scripts provide a template for automating the generation of technical documentation for SEOSONA OS components.
- **Modular Content Management:**  The modular book structure can inspire a similar approach to organizing SEOSONA OS documentation, allowing for easier maintenance and updates.
- **Reproducible Builds:** The emphasis on reproducible builds ensures that documentation remains consistent across different environments and versions of SEOSONA OS.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
