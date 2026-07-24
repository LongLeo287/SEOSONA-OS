# KI: awslabs/agentcore-samples

## Overview
This repository contains sample applications and tutorials demonstrating the use of Amazon Bedrock Agent Core, a framework for building AI agents. The samples showcase various features like custom containers, gateway integration, execution limits, and integrations with models such as Gemini and OpenAI.  The code is intended to be educational and illustrative rather than production-ready.

## Tech Stack (from code)
- **Python:**  Extensive use of `.py` files throughout the repository indicates Python as the primary language. (`00-getting-started/main.py`, `01-features/01-harness/custom_container.py`)
- **LangChain:** The presence of `langchain[aws]` in `requirements.txt` and numerous imports within `.py` files (e.g., `from langchain.chains import LLMChain` - found in multiple .py files) confirms the use of LangChain framework.
- **Ruff:**  The `pyproject.toml` file specifies Ruff as the linter, indicating its usage for code formatting and linting. (`[tool.ruff]`)
- **uv**: Listed as a dependency in `requirements.txt`.

## Public API / Exports
Due to the nature of this repository being primarily tutorial examples, identifying definitive public APIs is difficult. However, some notable files suggest potential entry points or functions:

- `00-getting-started/main.py`: This file appears to be a starting point for running an agent core application.  While not explicitly exported as a module, it represents a common execution path.
- `07-oauth/oauth_gateway.py`: Contains code related to OAuth gateway integration and likely defines functions or classes relevant to that functionality.

## Dependencies
Based on the contents of `requirements.txt` and `pyproject.toml`, the following dependencies are used:

- `strands-agents`
- `strands-agents-tools`
- `strands-agents[litellm]`
- `uv`
- `boto3`
- `langchain[aws]`
- `langgraph`
- `langsmith[otel]`
- `duckduckgo-search`
- `langchain-community`
- `opentelemetry-instrumentation-langchain`
- `bedrock-agentcore`
- `bedrock-agentcore-starter-toolkit`
- `ipython`
- `ipykernel`
- `pandas`
- `jupyterlab`
- `openpyxl`
- `mcp>=1.9.0`
- `ruff` (as a linter)

## Architecture Patterns
- **Modular Structure:** The directory structure, particularly within `01-features`, demonstrates a modular approach with separate directories for different features and integrations (e.g., custom containers, gateway integration).
- **Layered Architecture:**  The use of files like `system-prompt.md` alongside code suggests a layered architecture where prompts are managed separately from the core logic.
- **Configuration-Driven Development:** The presence of `.yaml` and `.json` files (e.g., `cloudformation.yaml`, `example_inputs.json`) indicates that configuration plays a significant role in agent behavior.

## Relevance to SEOSONA OS
This repository's code could benefit SEOSONA OS by providing:

- **Example Agent Integrations:** The samples demonstrate how to integrate with external services (e.g., DuckDuckGo, OpenAI) which can be adapted for use within SEOSONA OS agents.
- **LangChain Usage Patterns:**  The extensive use of LangChain provides valuable insights into best practices and common patterns for building AI agent workflows that could inform the development of SEOSONA OS's own agent framework.
- **Bedrock Integration Techniques:** The samples showcase how to interact with Amazon Bedrock, which might be relevant if SEOSONA OS needs to leverage similar cloud-based LLM services.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
