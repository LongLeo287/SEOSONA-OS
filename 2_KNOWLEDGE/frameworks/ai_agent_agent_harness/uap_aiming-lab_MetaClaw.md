# KI: aiming-lab/MetaClaw

## Overview
MetaClaw is a system for skill injection and reinforcement learning training, designed for one-click deployment. It appears focused on integrating skills into an existing framework (likely OpenClaw) and automating the training process using techniques like embedding retrieval and LLM-based skill evolution. The project includes benchmarking tools to evaluate performance.

## Tech Stack (from code)
- **Language:** Python, as evidenced by the presence of numerous `.py` files (137 in total).
- **Framework:** FastAPI is used for building APIs, indicated by its inclusion in `requirements.txt` and `pyproject.toml`.
- **Build System:**  The project uses `setuptools`, defined in `pyproject.toml`: `build-backend = "setuptools.build_meta"`.
- **Configuration:** YAML is used for configuration files, as indicated by the presence of `.yaml` files (11 total).

## Public API / Exports
Due to the large number of source code files and lack of readily available entry points without executing the code, it's difficult to definitively list public APIs. However, `pyproject.toml` defines a script named "metaclaw" that maps to `metaclaw.cli:metaclaw`, suggesting this is a primary command-line interface.

## Dependencies
Based on `requirements.txt` and `pyproject.toml`:
- **Core:** torch, transformers (>=4.51.1), httpx, fastapi, uvicorn[standard]
- **Optional - Embedding Retrieval:** numpy, sentence-transformers
- **Optional - Skill Evolution:** openai
- **Optional - Training Metrics Logging:** wandb
- **Optional - Scheduling:** google-api-python-client, google-auth-oauthlib, google-auth-httplib2
- **Other:** click (>=8.0), pyyaml (>=6.0), tiktoken

## Architecture Patterns
- **Modular Design:** The project's directory structure suggests a modular design with separate components for benchmarking (`benchmark/`), skill management, and data storage (`benchmark/data/`).
- **Configuration-Driven:**  The use of YAML configuration files (`openclaw.json`, `metaclaw.json`) indicates that the system is designed to be configurable without modifying code directly.
- **Data Pipelines:** The `benchmark/data/metaclaw-bench` directory and its subdirectories (e.g., `eval/day01/questions.json`) suggest a data pipeline for processing and evaluating skills.

## Relevance to SEOSONA OS
The MetaClaw project's focus on skill injection, reinforcement learning, and automated training could be beneficial to SEOSONA OS in several ways:
- **Skill Management:** The skill management components could be adapted to manage and integrate new capabilities into SEOSONA OS agents.
- **Automated Training:**  The automated training pipelines could be used to optimize the performance of SEOSONA OS agents through reinforcement learning, potentially reducing manual intervention.
- **Benchmarking & Evaluation:** The benchmarking tools provide a framework for evaluating the effectiveness of new skills and training methods within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `embedding`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
