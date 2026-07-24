# KI: shanraisshan/claude-code-best-practice

## Overview
This repository serves as a collection of best practices and example workflows for configuring Claude Code, focusing on skills, subagents, hooks, and commands. It's designed as a reference implementation rather than a standalone application. The primary purpose is to demonstrate patterns for interacting with Claude Code through various agents and skills.

## Tech Stack (from code)
The presence of `scripts/hooks.py` indicates the use of Python.  While no explicit package manifests are present, the file extension `.py` confirms Python as a scripting language within the project.

## Public API / Exports
There is no readily apparent public API or exported functionality in the provided source code snippets. The focus appears to be on configuration files and markdown documentation rather than directly executable code.  The `weather-orchestrator` command, described in `CLAUDE.md`, seems to act as an entry point but its implementation resides within `.claude/commands/weather-orchestrator.md`.

## Dependencies
No dependency manifests (e.g., `package.json`, `requirements.txt`) are present in the provided file listing, so dependencies cannot be determined from code alone.

## Architecture Patterns
The repository demonstrates a "Command → Agent → Skill" architecture for workflows, as described in `CLAUDE.md`.  Specifically:
- **Skills:** Defined within `.claude/skills/<name>/SKILL.md` using YAML frontmatter and appear to be reusable components with configurable parameters like `allowed-tools`, `model`, and `context`.
- **Agents:** Orchestrate the execution of skills, as seen in the `weather-agent` (`.claude/agents/weather-agent.md`).
- **Commands:** Provide an entry point for user interaction, such as `/weather-orchestrator` (`.claude/commands/weather-orchestrator.md`).
The use of hooks within skills is also a notable pattern: `hooks`: Lifecycle hooks scoped to this skill in `.claude/skills/<name>/SKILL.md`.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by providing examples and patterns for building modular, agent-driven workflows. The "Command → Agent → Skill" architecture is a valuable pattern for creating extensible and reusable components within an operating system environment.  The hook system demonstrated in `.claude/hooks/` could be adapted to provide cross-platform notifications or trigger actions based on specific events within SEOSONA OS. The YAML skill definition structure offers a standardized approach to defining and managing skills, which aligns with the principles of modularity and configurability often desired in operating systems.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `workflow`, `mcp`
- **All scores:** {'seosona-os': 89, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 28}
