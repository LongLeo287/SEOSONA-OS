# KI: DietrichGebert/ponytail

## Overview
Ponytail is a plugin designed for AI agents, specifically targeting "lazy senior dev mode." It aims to reduce development effort by promoting efficient coding practices like leveraging existing code, standard libraries, and native platform features before writing new code. The project provides commands and skills that assist in reviewing code, identifying over-engineering, tracking shortcuts, and measuring impact.

## Tech Stack (from code)
- **JavaScript/Node.js:**  The `package.json` file indicates this is a Node.js project:
```json
{
  "name": "@dietrichgebert/ponytail",
  "version": "4.8.4",
  ...
  "main": "./.opencode/plugins/ponytail.mjs",
  ...
}
```
- **TOML:** Configuration files for commands are defined using TOML format (e.g., `commands/ponytail.toml`).
```toml
description = "Switch ponytail intensity level (lite/full/ultra/off)"
prompt = ...
```
- **YAML:** The plugin definition and configuration is in YAML format (`plugin.yaml`, `promptfooconfig.gpt.yaml`).
```yaml
name: ponytail
version: 4.8.4
description: Lazy senior dev mode for Hermes Agent, always-on context, bundled skills, and slash commands.
```

## Public API / Exports
Based on the `package.json` file's `exports` section, the main entry point is `.opencode/plugins/ponytail.mjs`:
```json
{
  "name": "@dietrichgebert/ponytail",
  ...
  "main": "./.opencode/plugins/ponytail.mjs",
  "exports": {
    ".": "./.opencode/plugins/ponytail.mjs",
    "./plugin": "./.opencode/plugins/ponytail.mjs"
  },
  ...
}
```

The plugin provides hooks and commands as defined in `plugin.yaml`:
```yaml
provides_hooks:
  - pre_llm_call
  - pre_gateway_dispatch
provides_commands:
  - ponytail
  - ponytail-review
  - ponytail-audit
  - ponytail-debt
  - ponytail-gain
  - ponytail-help
provides_skills:
  - ponytail
  - ponytail-review
  - ponytail-audit
  - ponytail-debt
  - ponytail-gain
  - ponytail-help
```

## Dependencies
The `package.json` file lists the following dependencies:
```json
{
  "name": "@dietrichgebert/ponytail",
  ...
  "keywords": ["opencode-plugin", "opencode", "ponytail", "pi-package", "pi", "skills"],
  ...
}
```

## Architecture Patterns
- **Plugin Architecture:** The project is structured as a plugin, with configuration and skill definitions in YAML files. This suggests an extensible architecture where functionality can be added or modified without changing core components.
- **Command Line Interface (CLI):** Commands are defined using TOML files, indicating the presence of a CLI for interacting with the Ponytail agent.  The `commands/` directory contains these TOML definitions.
- **Configuration Management:** The project uses environment variables (`PONYTAIL_DEFAULT_MODE`) and configuration files (`~/.config/ponytail/config.json`) to manage settings, demonstrating a flexible approach to customization.



## Relevance to SEOSONA OS
The Ponytail plugin's focus on code efficiency and minimizing development effort aligns well with the goals of SEOSONA OS.  Specifically:

- **Reduced Resource Consumption:** By encouraging efficient coding practices (e.g., leveraging existing libraries, avoiding unnecessary abstractions), Ponytail can contribute to reduced resource consumption within SEOSONA OS agents.
- **Faster Development Cycles:** The plugin's review and audit commands could be integrated into the SEOSONA OS development workflow to identify and eliminate over-engineering early on, leading to faster development cycles.
- **Improved Code Quality:**  The emphasis on code clarity and avoiding unnecessary complexity can lead to improved overall code quality within SEOSONA OS. The `ponytail:` comments used for marking shortcuts could be adapted as a form of internal documentation or technical debt tracking within the SEOSONA codebase.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
