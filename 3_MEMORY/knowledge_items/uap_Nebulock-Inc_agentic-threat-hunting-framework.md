# KI: Nebulock-Inc/agentic-threat-hunting-framework

## Overview
This repository contains an Agentic Threat Hunting Framework (ATHF) designed for automating and enhancing threat hunting investigations using AI agents. The framework leverages the LOCK pattern (Learn, Observe, Check, Keep) to structure hunts and incorporates LLMs for hypothesis generation and research. It appears to be a CLI-driven tool with components for managing hunts, integrating with Splunk, and utilizing various LLM providers.

## Tech Stack (from code)
- **Language:** Python 3 (evident from `pyproject.toml`: `requires-python = ">=3.8"`)
- **Framework:** Click (dependency listed in `pyproject.toml`: `click>=8.0.0`) - used for CLI construction.
- **Build System:** Poetry (evident from `pyproject.toml` which defines a build system using setuptools).
- **TypeScript**: Used for automation scripts (`automation/classifier.ts`, `automation/config.ts`).

## Public API / Exports
Due to the nature of this project as a CLI tool and framework, identifying a clear public API is difficult without further analysis. However, based on file structure and naming conventions, we can infer some exported elements:

- **`athf/cli.py`**: Contains command-line interface functions (likely exposed via Click).
- **`athf/agents/__init__.py`**:  Exports agent classes defined within the `agents` directory.
- **`athf/commands/*`**: Modules in this directory likely export functions related to specific hunt commands (e.g., `hunt.py`, `research.py`).
- **`athf/core/*`**: Modules in this directory likely expose core functionality like `HuntManager` and `SplunkClient`.

## Dependencies
Based on `pyproject.toml`:
- Click: Version >=8.0.0
- PyYAML: Version >=6.0
- Rich: Version >=10.0.0
- Jinja2: Version >=3.0.0
- python-dotenv: Version >=0.19.0
- pytest (dev dependency)
- flake8 (dev dependency)
- mypy (dev dependency)
- bandit (dev dependency)
- mkdocs (doc dependency)
- scikit-learn (similarity dependency)
- requests (splunk dependency)
- litellm (LLM provider dependency - optional)
- openai (LLM provider dependency - optional)
- anthropic (LLM provider dependency - optional)
- boto3 (bedrock dependency - optional)
- ollama (LLM provider dependency - optional)

## Architecture Patterns
- **Plugin System:** The `athf/plugin_system.py` file suggests a plugin architecture, allowing for extensibility and customization of the framework's functionality.
- **Modular Design:**  The code is organized into distinct modules (`cli`, `agents`, `commands`, `core`, `data`) indicating a modular design approach.
- **Command Pattern:** The `athf/commands` directory suggests the use of a command pattern, where different actions are encapsulated as commands.
- **Agentic Architecture**:  The framework is designed to leverage AI agents for various tasks like hypothesis generation and research.

## Relevance to SEOSONA OS
ATHF's code could benefit SEOSONA OS in several ways:

- **Automated Threat Hunting:** The framework’s automation capabilities can be integrated into SEOSONA OS to proactively identify and respond to threats, reducing the workload on security analysts.
- **LLM Integration**:  The ability to integrate with various LLMs (OpenAI, Anthropic, Bedrock) allows SEOSONA OS to leverage advanced AI for threat intelligence gathering and analysis.
- **Plugin Architecture:** The plugin system enables customization of the framework's functionality to align with SEOSONA OS’s specific security needs and integrations.
- **Structured Threat Hunting**:  The LOCK pattern provides a structured approach to threat hunting, which can be incorporated into SEOSONA OS workflows for improved consistency and effectiveness.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `ollama`, `rag`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
