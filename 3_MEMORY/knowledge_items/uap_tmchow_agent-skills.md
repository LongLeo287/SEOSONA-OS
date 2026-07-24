# KI: tmchow/agent-skills

## Overview
This repository, `tmchow/agent-skills`, appears to be a collection of AI agent skills packaged in a specific format (`SKILL.md`). The skills are designed to be installable via various runtime environments like Claude Code, Hermes, and OpenClaw.  The project provides guidelines for creating and maintaining these skills, emphasizing a structured directory layout and standardized skill descriptions.

## Tech Stack (from code)
Based on the file extensions present, this appears to be primarily Markdown-based content. There are no explicit configuration files like `package.json`, `requirements.txt`, or `Cargo.toml` visible in the provided file listing. The project uses `.md` for documentation and `.gitignore` for version control exclusion.

## Public API / Exports
There is no executable code present in the listed files, so there are no public APIs or exports to identify.  The "API" appears to be the structure of the `SKILL.md` files themselves, which define the skill's metadata and instructions. The AGENTS.md file describes how these skills can be installed via CLI tools (npx), Hermes, and OpenClaw.

## Dependencies
There are no dependency management files listed in the provided source code. Therefore, dependencies cannot be determined from this information alone.

## Architecture Patterns
The project demonstrates a directory-based architecture for organizing agent skills. Each skill resides within its own top-level directory containing `SKILL.md` (agent instructions) and `README.md` (human-readable documentation).  A consistent naming convention is enforced: directory names must match the `name:` field in the `SKILL.md` frontmatter, using lowercase kebab-case. The use of a dedicated `_assets/` directory for shared assets suggests an attempt to avoid duplication and maintain consistency across skills.

## Relevance to SEOSONA OS
The structured approach to defining and packaging agent skills could be beneficial to SEOSONA OS.  If SEOSONA OS utilizes AI agents or has a plugin architecture, the standardized `SKILL.md` format and installation mechanisms (Hermes-like) could provide a framework for managing and distributing custom skill extensions. The asset management strategy using `_assets/` also promotes modularity and reduces redundancy in agent capabilities.  However, without knowing more about SEOSONA OS's architecture, it is difficult to assess the full extent of this relevance.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
