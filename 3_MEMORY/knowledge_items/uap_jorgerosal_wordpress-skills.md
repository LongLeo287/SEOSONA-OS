# KI: jorgerosal/wordpress-skills

## Overview
This repository contains a collection of "skill packs" designed for use with AI tools like Claude Code and Codex, specifically focused on WordPress development workflows. The skills cover various domains within WordPress development, including performance reviews, security audits, plugin development, and more, providing structured review processes and reference documentation.  The project appears to be organized around guiding AI agents through specific WordPress development tasks.

## Tech Stack (from code)
Based solely on the provided file list, it's difficult to definitively determine a complete tech stack. However:

*   **Markdown:** The extensive use of `.md` files (134 instances) indicates that Markdown is a primary format for documentation and skill definitions.
*   **YAML:**  The `CLAUDE.md` file mentions YAML frontmatter in the `SKILL.md` files, suggesting YAML is used for configuration within those files.
*   **JavaScript:** The presence of `.js` file suggests Javascript may be involved.

There are no readily apparent build system or framework configuration files (e.g., `package.json`, `requirements.txt`) in the provided list.

## Public API / Exports
The code provided does not contain any executable code, so there is no public API or exported functions to identify. The `.md` files appear to be documentation and skill definitions rather than actual code with exports.

## Dependencies
There are no dependency management files (e.g., `package.json`, `requirements.txt`) present in the provided file list. Therefore, dependencies cannot be determined from this data alone.

## Architecture Patterns
*   **Modular Skill Structure:** The project utilizes a modular architecture where each WordPress development area (performance review, security review, etc.) is encapsulated within its own directory (`wp-performance-review`, `wp-security-review`). Each module contains a `SKILL.md` file and a `references/` subdirectory for related documentation.
*   **Documentation-Driven Development:** The heavy reliance on Markdown files suggests that the project prioritizes detailed documentation alongside skill definitions, likely to guide AI agents or human developers through specific processes.

## Relevance to SEOSONA OS
The structured approach to WordPress development skills and the focus on areas like performance review, security, and accessibility could be valuable for SEOSONA OS. The modular design allows for potential integration of these "skills" into automated workflows within SEOSONA OS to improve code quality, identify vulnerabilities, and enhance overall platform performance.  However, further investigation would be needed to understand the specific format and content of the `SKILL.md` files to assess their direct applicability.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 66, 'seosona-flow': 28}
