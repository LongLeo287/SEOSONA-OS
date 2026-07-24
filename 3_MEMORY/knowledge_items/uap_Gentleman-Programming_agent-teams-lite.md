# KI: Gentleman-Programming/agent-teams-lite

## Overview
This repository appears to be a collection of "skills" or guidelines for software development, organized around a process called SDD (likely Software Design Definition). The `AGENTS.md` file describes how developers should use these skills by loading and following the patterns within specific markdown files located in the `skills/` directory.  The project seems to be focused on standardizing and documenting development practices.

## Tech Stack (from code)
Based solely on the provided file list, it's impossible to determine the programming language or framework used. There are shell scripts (`*.sh`) and PowerShell scripts (`*.ps1`), suggesting some automation is involved, but no source code for a specific programming language is present in the listed files.

## Public API / Exports
There is no executable code provided; therefore, there are no public APIs or exports to identify. The `AGENTS.md` file lists "skills" which appear to be markdown documents acting as guides rather than exported functions or classes.  The path to each skill is documented within the `AGENTS.md` file (e.g., `skills/sdd-init/SKILL.md`).

## Dependencies
There are no dependency files (`package.json`, `requirements.txt`, `Cargo.toml`, etc.) provided, so it's impossible to list dependencies.

## Architecture Patterns
The primary architectural pattern evident is a "skill-based" approach to development. This involves breaking down the software development process into discrete skills (e.g., `sdd-init`, `sdd-explore`) and providing detailed instructions within markdown files for each skill. The structure of the `skills/` directory suggests a hierarchical organization of these skills, potentially grouped by stage or purpose.

## Relevance to SEOSONA OS
Without knowing what SEOSONA OS is or its architecture, it's impossible to determine how this project could benefit it. However, if SEOSONA OS aims for standardized development practices and reproducible processes, the "skill-based" approach demonstrated in this repository might offer a template for defining and enforcing those standards. The markdown skill documents could be adapted and integrated into SEOSONA OS’s developer onboarding or documentation.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
