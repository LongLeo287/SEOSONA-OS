# KI: yaojingang/yao-meta-skill

## Overview
This repository, `yao-meta-skill`, appears to be a platform for creating and managing "agent skills," which are reusable components designed to automate workflows or tasks. The project focuses on defining skill interfaces, providing tooling for development, evaluation, packaging, and deployment of these skills across various platforms.  The emphasis is on structured triggers, clear documentation, and automated testing/verification processes.

## Tech Stack (from code)
- **Python:** The `Makefile` specifies `PYTHON ?= python3`, indicating Python 3 as the primary language. (`Makefile`)
- **YAML:** The file `agents/interface.yaml` uses YAML for defining skill interfaces and compatibility settings.
- **JSON:** Numerous `.json` files (e.g., `evals/output_cases.jsonl`, `reports/*.json`) suggest JSON is used extensively for configuration, data storage, and report generation.
- **Markdown:**  `.md` files are prevalent throughout the repository (`AGENTS.md`, `SKILL.md`, `docs/README.*.md`), indicating Markdown is used for documentation.

## Public API / Exports
Due to the nature of this project (likely a framework or toolkit), identifying "public APIs" in the traditional sense is difficult without further context. However, based on the files present:

- **`agents/interface.yaml`:** Defines an interface for agent skills, specifying properties like `display_name`, `short_description`, and compatibility settings. This file acts as a contract or schema for skill development.
- **Makefile targets**: The Makefile defines several targets that can be considered "public" in the sense that they are intended to be used by developers (e.g., `eval`, `package-verify-check`, `install-simulation-check`).

## Dependencies
The dependencies cannot be fully determined without a `requirements.txt` or similar file. However, based on code usage and imports:

- **Python Standard Library:**  The `Makefile` uses Python's standard library (e.g., `sys`) for version checking. (`Makefile`)
- **YAML libraries**: The use of YAML files suggests the presence of a YAML parsing library in the project dependencies.

## Architecture Patterns
- **Modular Design:** The directory structure, with distinct folders for `agents`, `evals`, `reports`, and `docs`, indicates a modular design approach.
- **Configuration as Code:**  Skill interfaces and compatibility settings are defined using configuration files (YAML), promoting consistency and version control.
- **Pipeline/Workflow Automation:** The extensive use of the `Makefile` suggests a focus on automating build, test, packaging, and deployment processes.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Skill Management Framework:**  The core functionality for defining, evaluating, and deploying agent skills can be integrated into SEOSONA OS to enable users to create and share custom automation components.
- **Standardized Skill Interface:** The `agents/interface.yaml` file provides a standardized interface that could ensure compatibility and interoperability between different skill implementations within the SEOSONA ecosystem.
- **Automated Testing & Verification:**  The testing infrastructure defined in the `Makefile` and associated scripts can be adapted to automatically test and verify new skills added to SEOSONA OS, ensuring quality and reliability.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `capability`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 41, 'seosona-ux-ui': 33, 'seosona-flow': 0}
