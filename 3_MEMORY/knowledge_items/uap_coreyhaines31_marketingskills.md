# KI: coreyhaines31/marketingskills

## Overview
This repository, "Marketing Skills," provides a collection of agent skills designed for AI agents following the Agent Skills specification. It serves as both a library of marketing-related skills and a marketplace for those skills accessible via a Claude Code plugin. The project includes validation scripts to ensure skill adherence to defined standards.

## Tech Stack (from code)
- **JavaScript:**  The presence of 64 `.js` files, particularly within the `tools/clis/` directory, indicates extensive use of JavaScript for CLI tools and potentially other scripting tasks. (`skills/`, `tools/clis/*.js`)
- **Markdown (.md):** The vast majority of files (285) are Markdown files, suggesting a documentation-heavy approach to defining skills and providing references.
- **YAML:** YAML is used extensively for frontmatter within the `.md` skill definition files (`skills/*/SKILL.md`).  The `validate-skills.sh` script parses these YAML structures.
- **Bash scripting:** The `validate-skills.sh` and `validate-skills-official.sh` scripts demonstrate use of bash for validation and automation tasks.

## Public API / Exports
Due to the nature of this project as a collection of skills and documentation, there are no explicitly defined public APIs or exported functions in the traditional sense.  The "public" interface is primarily through:

- **Agent Skills:** The `.md` files within the `skills/` directory represent individual skills that can be consumed by AI agents following the Agent Skills specification.
- **CLI Tools:** The JavaScript files under `tools/clis/` appear to expose command-line interfaces for various marketing tasks, although their specific functionality would require further investigation of each script individually.  The `validate-skills.sh` script references these tools (`node tools/clis/<name>.js`).
- **Claude Code Plugin:** The `.claude-plugin/marketplace.json` file defines the plugin's metadata and entry points for Claude Code users.

## Dependencies
Dependencies are not explicitly listed in a `package.json` or similar manifest file within the provided code snapshot.  The `validate-skills-official.sh` script indicates dependency on the `agentskills/agentskills` repository, which is installed via pip within a virtual environment. The script also checks for `uv` and falls back to `pip` if it's not found.

## Architecture Patterns
- **Content-as-Code:** Skills are defined primarily through Markdown files, treating skill definitions as code that can be versioned and validated.
- **Plugin-Based Architecture:**  The project is structured as a plugin for Claude Code, suggesting a modular design where skills can be added or removed without affecting the core functionality.
- **Validation Pipeline:** The `validate-skills.sh` and `validate-skills-official.sh` scripts implement a validation pipeline to ensure that skills adhere to defined standards.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Skill Integration:**  The Agent Skills format provides a standardized way to integrate marketing expertise into SEOSONA OS, allowing AI agents within the platform to perform tasks like content creation, SEO analysis, and campaign management.
- **Validation Framework:** The validation scripts (`validate-skills.sh`, `validate-skills-official.sh`) offer a reusable framework for ensuring the quality and consistency of skills or plugins integrated into SEOSONA OS.  This could be adapted to validate other types of modules within the platform.
- **CLI Toolset Inspiration:** The JavaScript CLI tools in `tools/clis/` demonstrate a practical approach to automating marketing tasks, which could inspire similar tooling for SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
