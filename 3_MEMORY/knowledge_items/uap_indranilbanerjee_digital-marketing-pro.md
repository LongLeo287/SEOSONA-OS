# KI: indranilbanerjee/digital-marketing-pro

## Overview
This repository contains a plugin for AI marketing, designed to be compatible with various platforms like Claude Code, Cowork, Codex, Cursor, Copilot CLI, Antigravity, Hermes Agent, and OpenClaw. The project provides 158 skills across 24 specialist agents, aiming to assist marketing agencies and in-house teams with tasks ranging from SEO audits to campaign management.  The plugin emphasizes compliance with regulations like the EU AI Act.

## Tech Stack (from code)
- **JavaScript/Node.js:** The `package.json` file indicates this is a Node.js project, using JavaScript for its core functionality and build processes.
```json
{
  "name": "@indranilbanerjee/digital-marketing-pro",
  "version": "3.15.1",
  ...
}
```
- **Python:** The `scripts/` directory contains numerous Python scripts (e.g., `_common.py`, `action-doctor.py`), suggesting the use of Python for specific tasks and potentially backend logic.
```python
# scripts/_common.py
"""
Common utility functions for Digital Marketing Pro scripts.
"""
```
- **YAML:** The `plugin.yaml` file is used to define plugin metadata, indicating YAML as a configuration format.
```yaml
# plugin.yaml
name: digital-marketing-pro
version: 3.15.1
...
```

## Public API / Exports
Due to the nature of this project as a plugin for various platforms, it's difficult to define a single "public API" in the traditional sense. However, based on the code, we can identify exported concepts:

- **Skills:** The core functionality revolves around 158 skills, each described in `SKILL.md` files within the `skills/` directory. These skills are exposed to different agent platforms (Claude Code, Cowork, Hermes Agent etc.).
- **Commands:**  The `commands/` directory contains markdown files describing commands that users can execute through supported platforms. Examples include "backlink-gap," "brand-setup," and "seo-audit."
- **Python Scripts:** The scripts in the `scripts/` folder are intended to be executed by agents, providing specific functionalities like competitor analysis (`competitor_scraper.py`) or SEO audits (`seo_audit.py`).

## Dependencies
Based on the `package.json` file:

- **Node Modules:** Numerous dependencies are listed within `package.json`, including but not limited to:  `@indranilbanerjee/digital-marketing-pro`, and others implied by the project's structure (though specific versions aren’t critical for this analysis).
```json
{
  "name": "@indranilbanerjee/digital-marketing-pro",
  ...
}
```

## Architecture Patterns
- **Plugin Architecture:** The project is designed as a plugin, adhering to the requirements of different platforms (Claude Code, Cowork, OpenClaw). This involves manifest files (`.claude-plugin/plugin.json`, `openclaw.plugin.json`) and platform-specific adaptation logic.
- **Skill-Based Design:**  The functionality is modularized into skills, each encapsulated within a `SKILL.md` file and potentially associated Python scripts. This promotes reusability and maintainability.
- **Configuration via Environment Variables/MCPs:** The project relies on environment variables or MCP (Marketing Connector Platform) setups for configuration, particularly for connecting to external services.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Skill Integration:**  The skill-based architecture aligns well with a modular and extensible system like SEOSONA OS. Individual skills could be integrated as plugins or modules, extending the platform’s capabilities.
- **Agent Framework:** The agent framework, particularly the structure for defining agents and their tasks, can provide valuable insights into building an AI-powered marketing assistant within SEOSONA OS.
- **Compliance & Ethics:**  The project's emphasis on compliance with regulations like the EU AI Act provides a strong foundation for incorporating ethical considerations and legal requirements into SEOSONA OS’s design. The code demonstrating these checks could be adapted.
- **Connector Architecture:** The approach to connectors (using MCPs) offers a flexible model for integrating with external marketing tools, which can be adopted by SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 50/100 · **Auto-apply:** False
- **Evidence:** `seo`, `keyword`, `backlink`
- **All scores:** {'seosona-os': 50, 'seosona-video': 0, 'seosona-content': 12, 'seosona-ux-ui': 0, 'seosona-flow': 0}
