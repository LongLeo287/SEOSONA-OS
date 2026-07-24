# KI: NVIDIA/skills

## Overview
The `NVIDIA/skills` repository appears to be a catalog and management system for skills or modular components, likely related to AI and accelerated computing workflows.  It defines how these skills are registered, evaluated, and deployed, with specific directories outlining skill definitions and associated documentation. The presence of YAML files suggests configuration-driven behavior and potentially automated processes.

## Tech Stack (from code)
- **YAML:** Used extensively for configuration and catalog management (`catalog-exceptions.yml`).
- **JSON:**  Used for data serialization and plugin configurations (`marketplace.json`, `evals/*.json`).
- **Python:** Evidence of Python scripts exists, particularly within the `aiq-research/scripts/` directory (`aiq.py`).
- **Bash:** Shell scripts are present (`skills.sh.json`), suggesting scripting for automation or build processes.

## Public API / Exports
Due to the nature of this repository (primarily a catalog and configuration system), there's no readily apparent "public API" in the traditional sense of exported functions or endpoints.  However, the following files define key aspects of the skill definitions:
- `skills/aiq-deploy/SKILL.md`: Defines structure for an AIQ deploy skill card.
- `skills/aiq-research/SKILL.md`: Defines structure for an AIQ research skill card.
- `skills/cuopt-numerical-optimization-api/SKILL.md`: Defines structure for a cuOpt numerical optimization API skill card.

## Dependencies
Dependencies are not explicitly listed in a single file like `package.json` or `requirements.txt`. However, the presence of `.sig` files suggests usage of signing tools and potentially associated dependencies.  The `fern/fern.config.json` indicates use of Fern for generating API documentation.

## Architecture Patterns
- **Configuration as Code:** The extensive use of YAML files demonstrates a configuration-as-code approach, where skill definitions and metadata are managed through declarative configurations.
- **Plugin-Based Architecture:**  The `.claude-plugin/`, `.codex-plugin/` and `.cursor-plugin/` directories within `plugins/nvidia-skills/` suggest a plugin architecture allowing for extensibility and modularity.
- **Catalog Management:** The `catalog-exceptions.yml` file indicates a centralized cataloging system with exceptions managed through defined criteria (reason, owner).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Modular Component System:**  The skill definition and management approach can be adapted for managing modular components within SEOSONA OS.
- **Configuration Management:** The YAML-based configuration system provides a model for declarative configuration of services and features in SEOSONA OS.
- **Plugin Architecture:** The plugin architecture could inspire a similar design for extending SEOSONA OS functionality through plugins.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
