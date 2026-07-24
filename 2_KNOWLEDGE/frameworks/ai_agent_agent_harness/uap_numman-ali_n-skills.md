# KI: numman-ali/n-skills

## Overview
This repository, `n-skills`, serves as a curated marketplace for AI coding agent skills. It manages and distributes these skills, providing descriptions, installation instructions, and usage examples. The project appears to be designed to integrate with an external tool called "openskills."

## Tech Stack (from code)
- **JavaScript/TypeScript:**  The presence of `.ts` files (15 total) and `tsconfig.json` within the repository indicates TypeScript is used for development, transpiled to JavaScript. The `package.json` file confirms this: `"devDependencies": { "yaml": "^2.9.0" }`.
- **Node.js:**  The use of `node scripts/sync-external.mjs` and `node scripts/update-registry.mjs` in the `scripts` section of `package.json` indicates Node.js is used for scripting and build processes.
- **YAML:** The `sources.yaml` file, along with `"devDependencies": { "yaml": "^2.9.0" }` in `package.json`, confirms YAML is used for configuration files.

## Public API / Exports
Due to the nature of this project (a curated marketplace), there are no readily apparent public APIs or exports within the source code itself. The primary interaction points appear to be through scripts (`sync-external.mjs`, `update-registry.mjs`) and the structure defined in `sources.yaml` for external skill integration.  The AGENTS.md file provides examples of how skills are invoked using `openskills read <skill-name>`.

## Dependencies
Based on the `package.json` file:
- **yaml:** Version 2.9.0 (used for parsing YAML configuration files).

## Architecture Patterns
- **Plugin/Skill Marketplace:** The core architecture revolves around a plugin or skill marketplace model, where skills are curated and distributed to AI coding agents.  The `sources.yaml` file defines the structure and metadata for these skills.
- **Configuration-Driven:** Skill management is heavily driven by configuration in `sources.yaml`, which dictates how external skills are synced and integrated.
- **Modular Structure:** The project utilizes a modular directory structure (`skills/automation/dev-browser`, `skills/tools/zai-cli`, etc.) to organize different skill categories and implementations.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Skill Management Framework:** The architecture for managing and distributing skills (as defined in `sources.yaml` and used by the scripts) could be adapted to create a similar framework within SEOSONA OS for integrating with external tools or services.
- **Plugin Marketplace Design:**  The overall design of the marketplace, including skill descriptions, installation instructions, and invocation examples (seen in AGENTS.md), provides valuable insights into building a plugin ecosystem.
- **YAML Configuration:** The use of YAML for configuration is a well-established pattern that SEOSONA OS could leverage for managing various aspects of its functionality.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
