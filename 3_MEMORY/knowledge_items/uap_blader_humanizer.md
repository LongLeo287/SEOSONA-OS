# KI: blader/humanizer

## Overview
This repository contains a portable agent skill implemented entirely as Markdown, with `SKILL.md` serving as the primary source of truth for the skill’s behavior and allowed tools. The project appears to be designed for use with AI coding agents like Claude Code or Codex, providing instructions in a format that can be loaded by various harnesses.  The repository also includes supporting documentation for human users and optional plugin manifests for specific platforms.

## Tech Stack (from code)
Based on the provided file list, there is no evidence of any build system configuration files (e.g., `package.json`, `requirements.txt`, `Cargo.toml`). The project appears to be entirely Markdown-based, with no explicit programming language or framework used in its core functionality.

## Public API / Exports
There are no exported functions, classes, or endpoints as the repository consists solely of Markdown files.  The "public API" is effectively the content and structure defined within `SKILL.md`.

## Dependencies
There are no dependency management files (e.g., `package.json`, `requirements.txt`) present in the provided file list. Therefore, it's impossible to determine any dependencies from code evidence.

## Architecture Patterns
The primary architectural pattern is a Markdown-based skill definition.  `SKILL.md` contains YAML frontmatter followed by editor prompts, and this structure dictates the agent’s behavior. The `AGENTS.md` file describes a maintenance contract emphasizing synchronization between `SKILL.md`, `README.md`, and `.claude-plugin/plugin.json`.

## Relevance to SEOSONA OS
Based solely on the provided code, it is impossible to determine how this project's code can benefit SEOSONA OS. The repository’s Markdown-based skill definition could potentially be adapted for use within a broader AI agent ecosystem if SEOSONA OS utilizes such agents. However, without further information about SEOSONA OS and its capabilities, any assessment of relevance would be speculative.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
