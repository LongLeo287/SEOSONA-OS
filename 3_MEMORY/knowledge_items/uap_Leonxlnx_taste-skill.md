# KI: Leonxlnx/taste-skill

## Overview
This repository appears to be a collection of "skills" or plugins, likely for an agentic AI system. The `skill.sh` script serves as a registry, mapping skill names to file paths containing their definitions (likely Markdown files).  The project includes various skills focused on tasks like image generation, code generation, and design.

## Tech Stack (from code)
- **Bash:** The primary scripting language is Bash, evidenced by the `skill.sh` script: `#!/usr/bin/env bash`.
- **JavaScript/Node.js:**  The presence of `.mjs` files in the `scripts` directory indicates usage of JavaScript and Node.js for build scripts (e.g., `build-emil-sponsor-row.mjs`).

## Public API / Exports
The primary "public" interface is defined by the `skill.sh` script. It exports a function that, given a skill name as an argument, returns the file path to its definition:
```
# File: skill.sh
if [[ $# -eq 0 ]]; then
  echo "Usage: source ./skill.sh <skill-name>"
  echo "Available skills: ${!SKILLS[@]}"
else
  echo "${SKILLS[$1]}"
fi
```

## Dependencies
There are no dependency files (e.g., `package.json`, `requirements.txt`) present in the provided file listing, so dependencies cannot be determined from the code.

## Architecture Patterns
- **Registry Pattern:** The `skill.sh` script implements a registry pattern, mapping skill names to their corresponding definition files. This allows for dynamic loading or execution of skills based on their name.
- **Modular Design:**  The project is structured into multiple directories (`skills/`, `research/`), suggesting a modular design where each directory represents a distinct skill or research area.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Skill Management System:** The registry pattern implemented in `skill.sh` provides a foundation for building a robust skill management system within SEOSONA OS, allowing for easy registration and retrieval of skills.
- **Plugin Architecture:**  The modular structure and skill definitions (likely Markdown) could be adapted to create a plugin architecture for SEOSONA OS, enabling the addition of new functionalities without modifying core components. The `SKILL.md` files in each skill directory represent potential plugin definition formats.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 41, 'seosona-ux-ui': 22, 'seosona-flow': 0}
