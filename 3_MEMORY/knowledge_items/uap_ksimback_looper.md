# KI: ksimback/looper

## Overview
Looper is a skill for Claude Code that scaffolds well-designed agent loops, facilitating the creation of structured workflows involving agents and reviewers or judges. The installation script suggests it’s designed to be integrated into an environment like Claude Code, where explicit invocation of commands is preferred.  The project provides templates and scripts to automate various aspects of loop design and verification.

## Tech Stack (from code)
- **Python:** The primary language for the project. This is evidenced by files such as `pyproject.toml` which specifies `requires-python = ">=3.9"` and numerous `.py` files in the repository, including `looper.py`, `run-loop.py`, and scripts within the loop templates.
- **PyYAML:** A Python library for parsing YAML files. This is explicitly listed as a dependency in `pyproject.toml`: `dependencies = ["PyYAML>=6.0"]`.  The project uses YAML extensively for configuration (e.g., `agents/openai.yaml`, loop definitions within the templates).
- **Bash:** Used for the installation script (`install.sh`).

## Public API / Exports
Due to the nature of this being a skill, it's difficult to determine a public API without knowing how it is consumed by Claude Code. However, based on the `install.sh` script and the structure of the project:

- `/looper`:  The installation script suggests that `/looper` will be available as a command within the target environment after installation. This is indicated in the line `echo "Restart Claude Code, then run /looper."`.
- The scripts within the loop templates (e.g., `check-fix-report.py`, `check-review.py`) are likely intended to be executed as part of a larger workflow, but their specific export status is unclear without more context.

## Dependencies
Based on `pyproject.toml`:
- PyYAML >=6.0

The installation script also installs these dependencies using pip:
- pip (as part of the Python venv setup)

## Architecture Patterns
- **Templating:** The project heavily utilizes templates for defining agent loops, as evidenced by the `templates/` directory and files like `loop.yaml`.  This suggests a design pattern where loop configurations are parameterized and reusable.
- **Scripting for Automation:** Scripts (e.g., `check-fix-report.py`, `scan-secrets.py`) are used to automate tasks within the agent loops, such as report checking and security scanning. This indicates a focus on automating verification and quality assurance processes.
- **Modular Design:** The project is organized into directories like `agents/`, `commands/`, `conformance/`, `references/`, `schemas/`, `scripts/`, and `templates/`, suggesting a modular design with distinct responsibilities for each component.

## Relevance to SEOSONA OS
Looper's focus on structured agent loops, templating, and automated verification could be beneficial to SEOSONA OS in the following ways:

- **Workflow Automation:** The templating system can be adapted to create reusable workflows within SEOSONA OS, automating repetitive tasks involving agents.
- **Code Quality Assurance:**  The scripts used for loop verification (e.g., `check-review.py`, `scan-secrets.py`) could be integrated into SEOSONA OS's code quality pipelines to automate checks and identify potential issues.
- **Agent Loop Standardization:** Looper’s design promotes standardized agent loops, which can improve consistency and maintainability within SEOSONA OS projects that utilize agents. The schema definitions in `schemas/` suggest a formal approach to loop structure that could be leveraged for validation and standardization.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
