# KI: imbad0202/academic-research-skills

## Overview
This repository appears to be a collection of resources and tools designed to assist with academic research skills, focusing on areas like paper writing, review processes, and citation management. The project utilizes a modular structure with agents and templates aimed at automating or guiding various stages of the academic workflow. Evidence for this includes directories named `academic-paper`, `academic-paper-reviewer`, and files such as `bilingual_abstract_template.md` and `revision_tracking_template.md`.

## Tech Stack (from code)
- **Python:** The presence of `.py` files (215 total) and the `pyproject.toml` file indicates Python is a primary language.  The `pyproject.toml` file specifies configuration for pytest, suggesting testing with Python.
```toml
### pyproject.toml
[tool.pytest.ini_options]
pythonpath = ["."]
```
- **Markdown:** The large number of `.md` files (280) suggests extensive documentation and content delivery using Markdown.
- **TOML:**  The use of `.toml` files (`.command-invariants.toml`, `pyproject.toml`) indicates the project utilizes TOML for configuration management.
- **JSON:** The presence of `.json` files (96 total) suggests data serialization and potentially API interactions or configuration storage.

## Public API / Exports
Due to the nature of the repository (primarily documentation, scripts, and templates), there's no clear "public API" in the traditional sense. However, based on file names within `academic-paper/agents` and `academic-paper-reviewer/agents`, it appears that these agents are intended for use as components or modules:
- `abstract_bilingual_agent.md`
- `argument_builder_agent.md`
- `citation_compliance_agent.md`
- `draft_writer_agent.md`
- `formatter_agent.md`
- `intake_agent.md`
- `literature_strategist_agent.md`
- `peer_reviewer_agent.md`
- `revision_coach_agent.md`
- `socratic_mentor_agent.md`
- `structure_architect_agent.md`
- `visualization_agent.md`
- `devils_advocate_reviewer_agent.md`
- `domain_reviewer_agent.md`
- `editorial_synthesizer_agent.md`
- `eic_agent.md`
- `field_analyst_agent.md`
- `methodology_reviewer_agent.md`
- `perspective_reviewer_agent.md`

## Dependencies
Based on the available code, dependencies are not explicitly listed in a single file like `package.json` or `requirements.txt`. However, the `pyproject.toml` file implies Python dependencies will be managed by pip:
```toml
### pyproject.toml
[tool.pytest.ini_options]
pythonpath = ["."]
```

## Architecture Patterns
- **Agent-Based System:** The presence of "agent" directories and associated `.md` files suggests an architecture where tasks are broken down into independent agents that interact with each other. This is evident in `academic-paper/agents` and `academic-paper-reviewer/agents`.
- **Templating:**  The `templates` directory within both `academic-paper` and `academic-paper-reviewer` indicates a templating approach for generating documents, likely using Markdown or LaTeX templates.
- **Modular Design:** The project is organized into distinct directories (e.g., `academic-paper`, `academic-paper-reviewer`, `references`) suggesting a modular design where different aspects of the research process are handled separately.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Research Workflow Automation:** The agent-based architecture and templating system could be adapted to automate or streamline specific tasks within the SEOSONA OS research pipeline, such as literature review, paper drafting, or peer review.
- **Knowledge Management:** The structured documentation (Markdown files) and templates provide a valuable resource for knowledge management and training on academic research skills within the SEOSONA OS ecosystem.
- **Citation Management Integration:**  The focus on citation compliance and formatting could be integrated with SEOSONA OS's existing tools to improve the accuracy and consistency of citations in generated documents or publications. The `.gitleaks.toml` file also demonstrates a concern for security, which is relevant for any system handling sensitive data.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 56}
