# KI: ericosiu/ai-marketing-skills

## Overview
This repository appears to be a collection of tools and scripts focused on AI-powered marketing operations, encompassing areas like content creation, conversion optimization, outbound engagement, and financial analysis. The project emphasizes automation and quality control within these processes, with specific attention paid to safety and adherence to defined standards (e.g., PII scanning, CTA verification).  The structure suggests a modular design, with each directory representing a distinct operational area.

## Tech Stack (from code)
- **Python:** Numerous `.py` files exist across various directories (e.g., `autoresearch/autoresearch.py`, `content-ops/editorial-brain.py`, `finance-ops/cfo-analyzer.py`), indicating Python is a primary language.  The presence of `requirements.txt` files in many directories further confirms this.
- **YAML:** The `skill-safety.yml` file uses YAML for defining CI/CD workflows (GitHub Actions).
- **TypeScript:** A single `.ts` file (`eval/run-eval.ts`) suggests the use of TypeScript, although its role is unclear from limited code visibility.
- **Makefile:**  A `Makefile` exists, indicating a build system or automation process using Make.

## Public API / Exports
Due to the lack of readily available module definitions (e.g., `__init__.py` files in Python), it's difficult to definitively identify public APIs or exports. However, several script names suggest potential entry points:
- `autoresearch/autoresearch.py`: Likely contains functions related to automated research tasks.
- `content-ops/editorial-brain.py`: Suggests a core component for content editing and processing.
- `finance-ops/cfo-analyzer.py`:  Implies functionality for financial analysis.
- `growth-engine/autogrowth-weekly-scorecard.py`: Likely generates weekly growth reports.

## Dependencies
Dependencies are primarily listed in `requirements.txt` files within various directories. Examples include:
- **content-ops/requirements.txt:** Contains dependencies like `beautifulsoup4`, `openai`, and `python-dotenv`.
- **conversion-ops/requirements.txt:** Includes `streamlit`.
- **finance-ops/requirements.txt:** Lists dependencies such as `pandas` and `requests`.

## Architecture Patterns
- **Modular Design:** The project is organized into distinct directories (e.g., `autoresearch`, `content-ops`, `finance-ops`), suggesting a modular architecture where each directory encapsulates a specific functionality.
- **Script-Based Automation:**  Many tasks are implemented as individual Python scripts, indicating a script-based automation approach.
- **Configuration Files:** The use of `.env.example` and YAML files (`skill-safety.yml`) suggests configuration-driven behavior and CI/CD integration.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Content Quality & Safety:**  The `content-eval` directory, along with the `skill-safety.yml` file’s PII scanning job, demonstrates a focus on content quality and safety. This aligns well with SEOSONA OS's goals of producing reliable and safe AI outputs. The CTA check in `skill-safety.yml` could be adapted to ensure consistent branding across SEOSONA OS generated content.
- **Automation & Efficiency:**  The various automation scripts (e.g., for outbound engagement, financial analysis) could provide valuable templates or components for automating similar tasks within SEOSONA OS. The modular design facilitates integration of specific functionalities.
- **Financial Modeling:** The `finance-ops` directory contains scripts and references related to financial modeling (`cfo-analyzer.py`, `scenario-modeler.py`). These tools could be adapted to model the costs and benefits of different SEOSONA OS features or strategies.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 28, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 28}
