# KI: xunbu/docutranslate

## Overview
DocuTranslate is a file translation tool designed for converting documents into various formats and languages. The project appears to leverage large language models (LLMs) for the core translation functionality, with support for multiple providers like OpenAI and potentially others.  The code demonstrates a modular architecture focused on document conversion, exporting, and integration with external services.

## Tech Stack (from code)
- **Python:** The primary language is Python, evidenced by the `.py` file extensions (129 files). `pyproject.toml` confirms this: `requires-python = ">=3.11"`
- **FastAPI:**  The project uses FastAPI as a web framework, indicated in `pyproject.toml`: `"fastapi[standard]>=0.115.12"`. This suggests an API is exposed.
- **uv**: Used for virtual environment management and dependency resolution (Dockerfile & pyproject.toml).
- **Build System:**  `pyproject.toml` uses `setuptools` as the build backend, indicating a standard Python packaging approach.

## Public API / Exports
Due to the sheer size of the codebase, identifying all exported elements is not feasible without further analysis. However, based on file structure and naming conventions:
- **FastAPI Endpoints:** The presence of FastAPI suggests REST endpoints are exposed for document translation and management.  The `app.py` file within the `docutranslate/` directory likely defines these routes. (path: `docutranslate/app.py`)
- **Exporter Classes:** The `exporter/` directory contains numerous classes like `md2html_exporter.py`, `docx2docx_exporter.py`, and others, suggesting a public API for exporting documents to different formats.  These likely inherit from base exporter classes (e.g., `base.py`).
- **Agent Classes:** The `agents/` directory contains agent classes like `glossary_agent.py` and `markdown_agent.py`. These are likely designed to be used in a workflow for document processing.

## Dependencies
The following dependencies are listed in `pyproject.toml`:
- fastapi (>=0.115.12)
- jsonpath-ng (>=1.7.0)
- openpyxl (>=3.1.5)
- xlsx2html (>=0.6.2)
- json-repair (>=0.48.0)
- mammoth (>=1.10.0)
- srt (>=3.5.3)
- lxml (>=5.4.0)
- python-docx (>=1.2.0)
- beautifulsoup4 (>=4.13.4)
- markdown (>=3.8.2)
- pymdown-extensions (>=10.16.1)
- pysubs2 (>=1.8.0)
- httpx (>=0.28.1)
- python-pptx (>=1.0.2)
- pypdf (>=6.7.1)
- regex (>=2025.11.3)
- charset-normalizer (>=3.4.4)
- html2text (>=2024.2.26)
- python-dotenv (>=1.2.1)
- msoffcrypto-tool (>=4.12.0)
- opencv-python (dev dependency)
- docling (dev dependency)
- pytest (dev dependency)

## Architecture Patterns
- **Modular Design:** The project is highly modular, with directories like `exporter`, `converter`, `core`, and `agents` each responsible for specific functionalities. This promotes code reusability and maintainability.
- **Factory Pattern:**  The `core/factory.py` file suggests the use of a factory pattern to create instances of various components (e.g., exporters, agents).
- **Strategy Pattern:** The multiple conversion engines (`converter_docling.py`, `converter_mineru.py`) within the `x2md/` directory suggest the strategy pattern is used for selecting different document conversion methods.
- **Configuration Management:**  The `.env.example` file and the use of environment variables indicate a configuration management approach, allowing customization without modifying code.

## Relevance to SEOSONA OS
- **Document Processing Capabilities:** The core functionality of DocuTranslate – converting documents between formats and languages – aligns with potential needs within SEOSONA OS for document handling and localization.
- **LLM Integration:**  The project's integration with LLMs could be leveraged for advanced text processing tasks, such as summarization or content generation, which are valuable in an operating system context.
- **Modular Design:** The modular architecture would allow specific components to be integrated into SEOSONA OS without requiring a full dependency on the entire DocuTranslate framework.  For example, the exporter modules could be used for generating different document formats within the OS.
- **Customization via Configuration:** The environment variable configuration allows easy adaptation of translation parameters and LLM providers, which is crucial for flexibility in an operating system environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 28, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
