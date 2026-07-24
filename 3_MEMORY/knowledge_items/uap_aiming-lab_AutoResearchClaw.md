# KI: aiming-lab/AutoResearchClaw

## Overview
AutoResearchClaw is a system designed to automate research paper generation, transforming research ideas into complete papers. It utilizes large language models (LLMs) and automated experimentation pipelines to achieve this goal. The project appears focused on enabling autonomous scientific discovery through software.

## Tech Stack (from code)
- **Language:** Python (evident from the `.py` file extensions and usage in scripts like `run_hep_pipeline.sh`, e.g., `python -m researchclaw run`).
- **Build System:** Hatchling (defined in `pyproject.toml`: `[build-system] requires = ["hatchling"] build-backend = "hatchling.build"`).
- **Configuration Management:** YAML (used extensively for configuration files like `config.researchclaw.example.yaml` and `prompts.default.yaml`).
- **LLM Interaction:** The project interacts with LLMs via API calls, as demonstrated in the `config.researchclaw.example.yaml` file which specifies providers like OpenAI and Anthropic.

## Public API / Exports
Due to the limited scope of analysis (only source code), it's difficult to definitively list a public API. However, based on the `pyproject.toml` file, the following is exposed:
- `researchclaw`:  This appears to be the main entry point for the application as defined by `[project.scripts] researchclaw = "researchclaw.cli:main"`

## Dependencies
The `pyproject.toml` file lists the following dependencies:
- `pyyaml>=6.0`
- `rich>=13.0`
- `arxiv>=2.1`
- `numpy>=1.24`
- `httpx>=0.24` (optional, for Anthropic)
- `scholarly>=1.7` (optional, for web scraping)
- `crawl4ai>=0.2` (optional, for web scraping)
- `tavily-python>=0.3` (optional, for web scraping)
- `PyMuPDF>=1.23` (optional, for PDF processing)
- `huggingface_hub>=0.20` (optional)
- `matplotlib>=3.7` (optional)
- `scipy>=1.10` (optional)

## Architecture Patterns
- **Configuration-Driven:** The system heavily relies on configuration files (YAML format) to define project settings, LLM providers, and experimental parameters. This promotes flexibility and customization.  (e.g., `config.researchclaw.example.yaml`)
- **Modular Design:** The presence of multiple adapter scripts within the `experiments/arc_bench/baseline/adapters` directory suggests a modular architecture where different agents or tools can be plugged in. (e.g., `agent_lab_adapter.py`, `ai_scientist_v2_adapter.py`)
- **Pipeline Architecture:** The `run_hep_pipeline.sh` script indicates a pipeline structure, with defined stages for research tasks.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Automated Research Integration:**  The automated paper generation capabilities could be integrated into SEOSONA OS to automatically generate documentation or reports based on system data and analysis.
- **LLM Interaction Framework:** The existing framework for interacting with LLMs (OpenAI, Anthropic) can be leveraged by SEOSONA OS for various tasks requiring natural language processing.
- **Experiment Automation:**  The experiment automation pipeline could be adapted to automate testing or performance evaluation within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 28}
