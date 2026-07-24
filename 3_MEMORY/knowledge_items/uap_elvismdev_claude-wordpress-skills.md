# KI: elvismdev/claude-wordpress-skills

## Overview
This repository contains a Claude Code plugin designed for WordPress performance review skills. The plugin allows Claude to perform comprehensive code reviews of WordPress themes, plugins, and custom code with a focus on identifying and suggesting performance optimizations.  The project's structure includes skill definitions, references, and slash command configurations intended for use within the Claude AI environment.

## Tech Stack (from code)
- **Markdown:** The primary file format used throughout the repository (`.md` files). This suggests the content is structured documentation and configuration.
- **JSON:**  Used for plugin metadata (`.json` files, specifically `plugin.json` and `marketplace.json`). This indicates a reliance on JSON for data serialization and potentially API interaction.
- **PHP:** The "Code Standards" section in `CLAUDE.md` explicitly mentions WordPress PHP Coding Standards, implying that the skills are designed to analyze PHP code.

## Public API / Exports
There is no executable code provided within the repository; therefore, there are no exported functions, classes, or endpoints directly visible from the source code. The "public" interface appears to be Markdown files defining skill configurations and slash commands for use *within* the Claude AI environment.  The `plugin.json` file defines metadata about the plugin itself:

```
.claude-plugin/plugin.json
{
  "name": "WordPress Performance Review",
  "version": "1.0.0",
  "author": "Elvismdev",
  "description": "Provides WordPress performance review skills for Claude Code.",
  "keywords": [
    "wordpress",
    "performance",
    "optimization",
    "code review"
  ],
  "homepage": null,
  "repository": {
    "type": "git",
    "url": null
  }
}
```

## Dependencies
There are no dependency files (e.g., `package.json`, `requirements.txt`) included in the repository. Therefore, it's impossible to determine any external dependencies from the provided code.

## Architecture Patterns
- **Configuration as Code:** The entire plugin’s functionality is defined through Markdown and JSON configuration files rather than executable code. This promotes a declarative approach where behavior is specified rather than implemented directly.
- **Modular Skill Design:**  The `skills/` directory structure suggests a modular design, with each skill residing in its own subdirectory containing a `SKILL.md` file and associated reference documentation.

## Relevance to SEOSONA OS
Given the lack of executable code, direct integration into SEOSONA OS is not possible. However, the plugin's focus on WordPress performance optimization could be valuable for analyzing and improving the performance of any WordPress-based components or services used within SEOSONA OS. The principles and guidelines outlined in the reference documentation (e.g., caching strategies, WP_Query optimization) are generally applicable to WordPress development and could inform broader performance engineering efforts.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
