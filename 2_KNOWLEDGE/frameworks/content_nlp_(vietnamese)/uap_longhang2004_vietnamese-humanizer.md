# KI: longhang2004/vietnamese-humanizer

## Overview
This project, "vietnamese-writing-skills," aims to provide tools and agent skills for improving the clarity and naturalness of Vietnamese writing. It includes components for grammar checking, humanization, style guidance, and translationese cleaning, all tailored for the Vietnamese language. The project appears to be designed for both direct use and integration into larger systems like an agent.

## Tech Stack (from code)
- **Python:**  The primary language is Python, evidenced by numerous `.py` files throughout the repository (e.g., `src/vietnamese_writing_skills/__init__.py`, `scripts/lint_vietnamese.py`).
- **PyYAML:** Used for parsing YAML configuration files, as indicated in `pyproject.toml`: `requires = ["jsonschema>=4.22,<5", "PyYAML>=6.0,<7"]`.
- **JSON Schema:** Utilized for validating data structures, demonstrated by the presence of `.schema.json` files (e.g., `benchmarks/case.schema.json`).
- **Hatchling:** The build system used for packaging and distribution is Hatchling, specified in `pyproject.toml`: `[build-system] requires = ["hatchling>=1.27"]`.

## Public API / Exports
Based on the presence of script entries defined in `pyproject.toml`, the following command-line tools are exposed:

- `viet-writing-lint`:  `vietnamese_writing_skills.cli.lint:main` - likely a linting tool for Vietnamese writing.
- `viet-writing-validate-skills`: `vietnamese_writing_skills.cli.validate_skills:main` - validates agent skills.
- `viet-writing-validate-patterns`: `vietnamese_writing_skills.cli.validate_patterns:main` - validates patterns.
- `viet-writing-validate-examples`: `vietnamese_writing_skills.cli.validate_examples:main` - validates preservation examples.
- `viet-writing-benchmark`: `vietnamese_writing_skills.cli.benchmarks:main` - runs benchmarks.
- `viet-writing-generate-docs`: `vietnamese_writing_skills.cli.generate_docs:main` - generates documentation.

## Dependencies
From the `pyproject.toml` file, the project's dependencies include:

- jsonschema (>=4.22,<5)
- PyYAML (>=6.0,<7)
- build (>=1.2,<2) for development
- pytest (>=8.2,<10) for testing
- ruff (>=0.6,<1) for linting

## Architecture Patterns
- **Modular Design:** The project is structured into modules within the `src/vietnamese_writing_skills` directory, such as `cli`, `core`, and `data`. This suggests a modular design approach to separate concerns.  For example, `src/vietnamese_writing_skills/cli/__init__.py` indicates a command-line interface module.
- **Skill-Based Architecture:** The presence of directories like `skills/grammar-checker-vi/`, `skills/humanizer-vi/`, etc., suggests an architecture centered around distinct "skills" or components, each responsible for a specific writing improvement task.  Each skill directory contains a `SKILL.md` file and references related to its functionality.
- **Configuration-Driven:** The use of YAML files (e.g., `patterns/grammar.yml`, `patterns/humanizer.yml`) indicates that the system's behavior is configurable through external configuration files, promoting flexibility and customization.



## Relevance to SEOSONA OS
This project’s code could benefit SEOSONA OS in several ways:

- **Vietnamese Language Support:**  SEOSONA OS could integrate the grammar checking and humanization tools for improved Vietnamese language processing capabilities. The `grammar-checker-vi` skill, specifically, would be valuable.
- **Agent Skill Integration:** The "skill" architecture lends itself well to integration as agent skills within SEOSONA OS, allowing for modular enhancement of writing assistance features.  The validation scripts (`validate_skills.py`, defined in `.pre-commit-config.yaml`) suggest a framework for defining and testing these skills.
- **Data Validation & Quality:** The schema validation components (using JSON Schema) could be adapted to validate data used by SEOSONA OS, ensuring quality and consistency.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 34/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `router`
- **All scores:** {'seosona-os': 34, 'seosona-video': 6, 'seosona-content': 0, 'seosona-ux-ui': 6, 'seosona-flow': 6}
