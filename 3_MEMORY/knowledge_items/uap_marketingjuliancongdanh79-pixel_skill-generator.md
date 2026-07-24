# KI: marketingjuliancongdanh79-pixel/skill-generator

## Overview
This project appears to be a "Skill Creator Ultra," designed to automate the creation of skills or workflows, likely for AI agents or similar applications. The codebase includes scripts and markdown files detailing phases of skill development, evaluation, and optimization, suggesting a structured methodology for generating these skills.  The `install.sh` script indicates it's intended to be deployed across various platforms like Antigravity, Claude Code, and GitHub Copilot.

## Tech Stack (from code)
- **Python:** The presence of files with `.py` extensions (e.g., `generate_review.py`, `skill_audit.py`) indicates Python is the primary scripting language.  The file `scripts/ci_eval.py` further confirms this.
- **Bash:** The `install.sh` script demonstrates the use of Bash for installation and setup tasks.
- **HTML:** Files with `.html` extensions (e.g., `assets/eval_review.html`, `eval-viewer/viewer.html`) suggest a web-based evaluation or viewing component.

## Public API / Exports
Due to the nature of the project, it's difficult to definitively identify public APIs without further context. However, based on script names:
- `skill_audit.py`: Likely exports functions related to skill auditing.
- `skill_compare.py`:  Likely exports functions for comparing skills.
- `skill_export.py`: Likely exports functions for exporting skills.
- `skill_scaffold.py`: Likely exports functions for scaffolding new skills.
- `simulate_skill.py`: Likely exports functions to simulate skill execution.

## Dependencies
There are no dependency files (e.g., `package.json`, `requirements.txt`) present in the provided file listing, so dependencies cannot be determined from code alone.

## Architecture Patterns
- **Phase-Based Workflow:** The project is heavily structured around a phased workflow for skill creation (phases/phase1_interview.md through phase8_optimize.md). This suggests a sequential or pipeline architecture.
- **Modular Design:**  The separation of concerns into directories like `agents`, `resources`, and `scripts` implies a modular design, with different components responsible for specific tasks.
- **Scripted Automation:** The scripts directory (`scripts/`) contains numerous `.py` files that automate various skill creation processes (auditing, comparison, scaffolding, simulation, validation).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Skill Generation Pipeline:**  The defined phases and associated markdown documents provide a structured approach to skill development which can be integrated into the SEOSONA OS workflow.
- **Automation Scripts:** The Python scripts for auditing, comparison, scaffolding, and simulation could be adapted to automate tasks within SEOSONA OS, improving efficiency and consistency in skill creation or agent behavior.
- **Evaluation Framework:**  The `eval_review.html` file and related scripts suggest an evaluation framework that could be incorporated into SEOSONA OS to assess the quality and effectiveness of generated skills or agents.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
