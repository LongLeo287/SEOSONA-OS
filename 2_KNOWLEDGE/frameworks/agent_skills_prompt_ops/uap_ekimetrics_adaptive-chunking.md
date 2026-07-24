# KI: ekimetrics/adaptive-chunking

## Overview
This project, "adaptive-chunking," is a framework for evaluating document chunking techniques. It focuses on multi-domain document chunking and includes adaptive recursive splitting capabilities. The project aims to provide a structured evaluation environment for different chunking strategies used in NLP and RAG (Retrieval Augmented Generation) pipelines.

## Tech Stack (from code)
- **Language:** Python, as evidenced by the `pyproject.toml` file which specifies `Programming Language :: Python :: 3`.
- **Build System:** Hatchling, specified in `pyproject.toml`: `build-backend = "hatchling.build"`.
- **Dependencies:** The `pyproject.toml` lists numerous dependencies including `tiktoken`, `pandas`, `numpy`, `tqdm`, `sentence-transformers`, `spacy`, and others (see Dependencies section below).

## Public API / Exports
Due to the limited code provided, it's impossible to determine the public API.  The `pyproject.toml` file suggests a package named "adaptive_chunking" is built (`packages = ["src/adaptive_chunking"]`), implying that this directory contains the primary codebase and likely defines the exported functions and classes.

## Dependencies
Based on the `pyproject.toml` file, the project's dependencies are:
- `tiktoken>=0.9.0`
- `pandas>=2.2.3`
- `numpy`
- `tqdm>=4.67.1`
- `python-dotenv>=1.1.0`
- `sentence-transformers>=3.1`
- `spacy>=3.8.4`
- `scikit-learn`
- `scipy`
- `langdetect`
Additionally, optional dependencies are defined for "coref", "parsing", "paper", "test" and "dev". These include libraries like `maverick-coref`, `docling`, `pymupdf4llm`, `torch`, `langchain`, `nltk`, `openai`, `deepeval` and more.

## Architecture Patterns
Due to the limited code provided, architectural patterns cannot be determined. The presence of optional dependencies suggests a modular design allowing users to select specific functionalities based on their needs.  The project appears structured around evaluation, with dependencies related to data processing (pandas), numerical computation (numpy, scipy), and NLP tasks (spacy, sentence-transformers).

## Relevance to SEOSONA OS
Without knowing the specifics of SEOSONA OS, it's difficult to assess direct relevance. However, given that adaptive-chunking focuses on document chunking and evaluation for NLP pipelines, it could be beneficial if SEOSONA OS incorporates any form of text processing or information retrieval. The framework’s ability to evaluate different chunking strategies might allow SEOSONA OS to optimize its performance in tasks involving large documents or knowledge bases.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `rag`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
