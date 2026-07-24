# KI: raulvidis/openclaw-multi-agent-kit

## Overview
This repository provides templates and documentation for building AI agent teams using the OpenClaw platform, integrated with Telegram supergroups. It focuses on providing pre-built personality templates (SOUL.md), metadata (IDENTITY.md), workspace scaffolding, skill packages, and configuration snippets designed to be copied into an OpenClaw workspace. The project itself is not a library or application; it contains only markdown, JSON, and JSONC files.

## Tech Stack (from code)
- **Configuration Format:** JSON / JSONC - evidenced by the `templates/openclaw-config.jsonc` file.
- **Documentation Language:** Markdown - evident from the extensive use of `.md` files throughout the repository.
- **Platform:** OpenClaw - explicitly stated in `CLAUDE.md`.

## Public API / Exports
This project does not contain executable code, therefore there are no public APIs or exports. The content is intended to be copied and used within another system (OpenClaw).

## Dependencies
There are no dependency files present (e.g., package.json, requirements.txt, Cargo.toml) in the provided file listing.  The project's documentation explicitly states it "is a template/docs-only repo (no runtime code)."

## Architecture Patterns
- **Template-Based Design:** The core architecture revolves around providing templates for various agent roles and configurations. This is evident from the directory structure (`templates/soul/*`, `templates/identity/*`, `templates/skills/*`) and the descriptions in `CLAUDE.md`.
- **Layered Templates:**  The project utilizes a layered approach to templates, distinguishing between core templates and an extended catalog. This allows for both quick setup with essential agents and more specialized roles.

## Relevance to SEOSONA OS
Given that this repository focuses on AI agent orchestration and Telegram integration, its template structures and documentation could potentially inform the design of similar functionalities within SEOSONA OS. The modular approach to defining agent personalities and skills might be adaptable for creating a flexible and extensible agent system in SEOSONA OS. However, further analysis would require understanding how SEOSONA OS currently handles agents and integrations.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `workflow`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 56}
