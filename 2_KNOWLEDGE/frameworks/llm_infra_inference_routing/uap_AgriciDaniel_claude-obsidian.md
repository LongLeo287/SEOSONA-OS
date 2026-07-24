# KI: AgriciDaniel/claude-obsidian

## Overview
This repository contains a Claude Code plugin and an Obsidian vault designed for building persistent, compounding knowledge bases using Andrej Karpathy’s LLM Wiki pattern. The project facilitates the ingestion of sources into an Obsidian vault, enabling Claude to answer questions based on this curated knowledge and automate research tasks.  The system aims to create a dynamic, evolving knowledge base accessible through both Claude Code and other Agent Skills-compatible agents.

## Tech Stack (from code)
*   **Python:** The `scripts/` directory contains several Python scripts (`baseline-v16.py`, `benchmark-runner.py`, `bm25-index.py`, `boundary-score.py`, `contextual-prefix.py`, `rerank.py`, `retrieve.py`, `tiling-check.py`, `wiki-mode.py`).  This is evidenced by the file extensions and shebang lines (e.g., `#!/usr/bin/env python3` in `scripts/baseline-v16.py`).
*   **Bash:** The project utilizes Bash scripts for various tasks, including testing (`allocate-address.sh`, `detect-transport.sh`, `wiki-lock.sh`) and setup (`setup-multi-agent.sh`). This is evident from the `.sh` file extensions and shebang lines (e.g., `#!/bin/bash` in `scripts/allocate-address.sh`).
*   **Makefile:** The project uses a Makefile to define build targets and automate tasks, as demonstrated by the contents of the `Makefile`.
*   **JavaScript:**  The `.obsidian/plugins/` directory contains JavaScript files related to Obsidian plugins (e.g., `calendar/main.js`, `obsidian-banners/main.js`).

## Public API / Exports
Based on the code, it's difficult to define a definitive "public API" in the traditional sense because this is primarily a plugin and vault setup rather than a standalone library. However, the following represent exposed functionalities:

*   **Agent Skills:** The `skills/` directory contains Markdown files (`SKILL.md`) that define Agent Skills accessible to agents like Claude Code or OpenCode. These skills expose functions like `/wiki`, `/wiki-ingest`, and `/wiki-query`. For example, the skill definition for `/wiki` is found in `skills/wiki/SKILL.md`:

    ```markdown
    # claude-obsidian Wiki Skill

    ## Description

    Scaffolds a new vault, manages hot cache, routes to sub-skills.

    ## Trigger Phrases

    * `/wiki`
    * set up wiki
    * scaffold vault
    ```

*   **Obsidian Plugin Skills:** The plugin exposes skills through Obsidian's API, accessible via commands within the Obsidian editor. These are defined in the `plugin.json` file located in `.claude-plugin/`.

## Dependencies
The dependencies are not explicitly listed in a single file but can be inferred from the scripts and configuration files:

*   **Python Libraries:** The Python scripts likely depend on libraries like `requests`, `BeautifulSoup4`, and potentially others for web scraping, data processing, and indexing.  However, specific requirements files (e.g., `requirements.txt`) are not present in the provided code.
*   **Obsidian Plugins:** The `.obsidian/community-plugins.json` file lists dependencies on various Obsidian plugins like "Calendar," "Obsidian Bannners," and "Excalidraw."
*   **Agent Skills Framework:**  The project relies on an Agent Skills framework (likely Codex CLI or OpenCode) for executing the defined skills.

## Architecture Patterns
*   **Plugin-Based Architecture:** The core functionality is encapsulated within a plugin, allowing it to extend Obsidian's capabilities.
*   **Layered Architecture:** The system separates concerns into layers: source ingestion (`.raw/`), knowledge base generation (`wiki/`), and user interaction (through Agent Skills).
*   **Templating:**  The `_templates/` directory suggests the use of templating for generating wiki pages, promoting consistency and reducing boilerplate code.
*   **Configuration-Driven:** The project relies heavily on configuration files (e.g., `Makefile`, `.obsidian/app.json`) to define behavior and customize settings.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

*   **Knowledge Management:**  The LLM Wiki pattern implemented here provides a robust framework for building and maintaining knowledge bases, which is crucial for any operating system aiming to provide intelligent assistance.
*   **Agent Skill Integration:** The Agent Skills standard allows SEOSONA OS to leverage the functionality of this plugin with other AI agents, promoting interoperability and extensibility.  The modular design of skills makes it easy to integrate into a larger agent ecosystem.
*   **Automated Research & Synthesis:** The `autoresearch` skill demonstrates automated research capabilities that could be integrated into SEOSONA OS to proactively gather information and provide users with relevant insights.
*   **Obsidian Integration:**  If SEOSONA OS incorporates Obsidian or similar note-taking tools, the plugin's functionality can enhance user productivity and knowledge organization.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 22, 'seosona-flow': 0}
