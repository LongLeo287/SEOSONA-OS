# KI: HKUDS/RAG-Anything

## Overview
This project, "RAGAnything," appears to be an all-in-one Retrieval Augmented Generation (RAG) system designed for processing various document types and integrating with large language models. The code demonstrates support for parsing documents like PDFs, Office files, and Markdown, extracting text and assets, and constructing prompts for LLMs.  It aims to provide a flexible framework for building RAG pipelines.

## Tech Stack (from code)
- **Python:** The primary language used throughout the codebase (e.g., `setup.py`, `requirements.txt`, all `.py` files).
- **Setuptools:** Used as the build system, evidenced by `setup.py` and `pyproject.toml`.  The `pyproject.toml` file explicitly states `build-backend = "setuptools.build_meta"`.
- **Ruff:** A Python linter and formatter used in pre-commit hooks ( `.pre-commit-config.yaml`).
- **Poetry:** Used for dependency management, as indicated by the presence of `pyproject.toml` which defines project metadata and dependencies.

## Public API / Exports
Due to the limited scope of analysis, it's difficult to definitively list all public APIs. However, based on file structure and naming conventions within the `raganything/` directory, potential exported components include:

- **Classes & Functions in `raganything/__init__.py`:**  The code reads metadata from this file, suggesting that variables defined here might be intended for external use (though not explicitly exported).
- **Modules in `raganything/`:** Modules like `parser.py`, `processor.py`, and `prompt.py` likely contain classes and functions related to parsing documents, processing content, and constructing prompts respectively.  The presence of these modules suggests they are intended for use within the RAG pipeline.
- **Classes & Functions in `raganything/utils.py`:** This file is commonly used for utility functions that might be exposed.

## Dependencies
Based on `requirements.txt` and `pyproject.toml`, the project's dependencies include:

- `huggingface_hub`: For interacting with Hugging Face Hub (likely for model loading).
- `lightrag-hku`: A package from LightRAG, likely providing core functionality.
- `mineru[core]`:  A PDF parsing library with multiple backends.
- `tqdm`: For progress bars during batch processing.
- `Pillow`: For image format conversion (optional).
- `reportlab`: For converting text files to PDFs (optional).
- `paddleocr` and `pypdfium2`:  For OCR of scanned PDFs (optional).
- `markdown`, `weasyprint`, `pygments`: For Markdown processing (optional).

## Architecture Patterns
- **Modular Design:** The project is organized into modules within the `raganything/` directory, suggesting a modular architecture where different components handle specific tasks (parsing, processing, prompting).
- **Configuration-Driven:**  The use of `setup.py`, `requirements.txt`, and `pyproject.toml` indicates that the project's behavior is configurable through external files.
- **Extensible Design:** The optional dependencies (`image`, `text`, `office`, `paddleocr`) suggest a design intended to be extensible with different processing capabilities.



## Relevance to SEOSONA OS
The RAG-Anything framework could benefit SEOSONA OS in the following ways:

- **Document Processing:**  SEOSONA OS could leverage the parsing and processing capabilities for handling various document formats, enabling more advanced information retrieval and analysis.
- **LLM Integration:** The project's focus on prompt engineering and LLM integration can be used to enhance SEOSONA OS’s conversational AI abilities.
- **Customizable RAG Pipelines:**  The modular design allows SEOSONA OS developers to customize the RAG pipeline based on specific needs, improving performance and accuracy for different tasks.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `rag`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
