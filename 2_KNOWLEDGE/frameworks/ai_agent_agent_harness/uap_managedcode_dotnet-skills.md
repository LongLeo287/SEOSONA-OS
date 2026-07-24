# KI: managedcode/dotnet-skills

## Overview
This repository, `managedcode/dotnet-skills`, appears to be a catalog of .NET skills and related orchestration agents. The primary purpose is to maintain a scanned catalog for modern and legacy .NET frameworks, along with associated automation for refreshing the catalog based on upstream changes.  The project also includes tooling for installing these agents.

## Tech Stack (from code)
- **Language:** C# (.cs files exist).
- **Build System:** The presence of `.csproj` files indicates a .NET project using MSBuild.
- **Automation:** Python scripts are present (`.py` extensions), suggesting automation tasks.  GitHub Actions workflows are used for CI/CD (`.github/workflows`).
- **Configuration:** YAML files (`.yaml`, `.yml`) are used for configuration, specifically `waza.yaml` which defines limits and thresholds.

## Public API / Exports
Due to the limited code provided, it's impossible to determine a public API. The structure suggests that the primary output is likely the catalog itself (skills.json) and potentially publishable tools (`cli/ManagedCode.DotnetAgents`, `cli/ManagedCode.Agents`, `cli/ManagedCode.DotnetSkills`).

## Dependencies
Dependencies cannot be determined from the provided code snippet. There are no dependency management files like `package.json` or `requirements.txt`.

## Architecture Patterns
- **Modular Catalog Structure:** The catalog is organized into a hierarchical structure (`catalog/<type>/<package>/`) suggesting a modular approach to skill definition and organization.  Each "skill" has its own manifest file (`manifest.json`) and associated documentation (SKILL.md, references/*.md).
- **Agent-Based Orchestration:** The `agents/` directory indicates an agent-based architecture for orchestration tasks. Each agent appears to have a dedicated folder with an `AGENT.md` file describing its purpose.
- **Configuration Driven:**  The use of `.waza.yaml` suggests that the system is configured through YAML files, allowing for customizable limits and thresholds.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Skill Catalog Integration:** The structured skill catalog could be integrated into SEOSONA OS to provide a centralized repository of .NET skills and knowledge.
- **Automation Framework:**  The automation scripts and GitHub Actions workflows demonstrate techniques for maintaining up-to-date documentation and tooling, which could be adapted for use within SEOSONA OS.
- **Agent-Based Architecture:** The agent-based orchestration pattern offers a flexible approach to managing tasks and processes that could be applicable to various aspects of SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `workflow`, `mcp`, `router`
- **All scores:** {'seosona-os': 100, 'seosona-video': 22, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 28}
