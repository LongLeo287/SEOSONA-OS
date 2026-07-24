# KI: undertheseanlp/underthesea

## Overview
This project, "underthesea," is a Vietnamese NLP toolkit designed for various natural language processing tasks. It provides functionalities including text normalization, tokenization, part-of-speech tagging, named entity recognition, sentiment analysis, and translation, specifically tailored for the Vietnamese language. The project appears to be in an active development phase with ongoing research and experimentation evident in its documentation and test suite.

## Tech Stack (from code)
- **Python:**  The primary language is Python, as evidenced by numerous `.py` files (363 total).
- **Setuptools/Wheel:** Used for building the package, specified in `pyproject.toml`: `[build-system] requires = ["setuptools>=61.0", "wheel"]`.
- **Click:** A Python command-line interface framework, listed as a dependency in `pyproject.toml`: `'Click>=6.0'`.
- **PyYAML:** Used for YAML parsing, listed as a dependency: `'PyYAML'`.
- **Torch/Transformers:**  Used for deep learning tasks, indicated by the `deep` optional dependency group in `pyproject.toml`: `[project.optional-dependencies] deep = ["torch>=2.0.0", "transformers>=4.30.0"]`.
- **Uvicorn/Starlette/HTTPX:** Used for building an agent server, as defined by the `agent-server` optional dependency: `[project.optional-dependencies] agent-server = ["uvicorn>=0.34,<1", "starlette>=0.49.1,<1", "httpx>=0.27,<1"]`.
- **MkDocs/Material:** Used for documentation generation, as defined by the `docs` optional dependency: `[project.optional-dependencies] docs = ["mkdocs>=1.5.0", "mkdocs-material>=9.0.0", "mkdocstrings[python]>=0.24.0", "pymdown-extensions>=10.0"]`.

## Public API / Exports
Due to the large number of files, a comprehensive list is not possible. However, based on `pyproject.toml`, the main entry point appears to be:
- `underthesea`:  This is defined as an executable script in `pyproject.toml`: `[project.scripts] underthesea = "underthesea.cli:main`. This suggests a command-line interface with functionality accessible via `underthesea`.

## Dependencies
Based on `pyproject.toml`, the project has the following dependencies (partial list):
- `Click>=6.0`
- `tqdm`
- `requests`
- `joblib`
- `PyYAML`
- `underthesea_core>=3.3.0`
- `huggingface-hub`
- `seqeval` (for training)
- `torch>=2.0.0` (deep learning)
- `transformers>=4.30.0` (deep learning)
- `jax>=0.4.25` (voice processing)
- `dm-haiku>=0.0.12` (voice processing)
- `optax` (voice processing)
- `openai` (prompting)
- `uvicorn>=0.34,<1` (agent server)
- `starlette>=0.49.1,<1` (agent server)
- `httpx>=0.27,<1` (agent server)
- `textual>=0.50` (assistant)
- `rich>=13.0` (assistant)
- `langfuse>=2.0.0` (tracing)
- `nose==1.3.7` (testing)
- `pytest`, `pytest-asyncio`, `pytest-textual-snapshot` (testing)
- `ruff>=0.9.0` (linting)
- `tox` (development environment management)

## Architecture Patterns
- **Modular Design:** The project is structured into modules like `tests.pipeline.sent_tokenize`, `tests.pipeline.word_tokenize`, and `underthesea.cli`, suggesting a modular architecture with distinct components for different NLP tasks.
- **Optional Dependencies:**  The use of optional dependencies (e.g., `deep`, `voice`) indicates that certain features are only required for specific use cases, allowing users to install a smaller subset of the project's code.
- **Test-Driven Development:** The extensive test suite within the `tests` directory and the configuration in `tox.ini` suggest a strong emphasis on testing and potentially a test-driven development approach.

## Relevance to SEOSONA OS
The "underthesea" toolkit could be valuable for SEOSONA OS, particularly if it requires Vietnamese language processing capabilities. Specifically:
- **Vietnamese NLP Tasks:** The core functionality of text normalization, tokenization, POS tagging, NER, and sentiment analysis can directly enhance SEOSONA's ability to understand and process Vietnamese text data.
- **Voice Processing:**  The `voice` optional dependency group provides components for text-to-speech (TTS) which could be integrated into SEOSONA’s voice assistant or other audio applications.
- **Agent Development:** The agent server functionality, built with Uvicorn/Starlette/HTTPX, can potentially contribute to building intelligent agents within the OS.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `tts` · **Fit:** 61/100 · **Auto-apply:** True
- **Evidence:** `tts`, `text-to-speech`, `vieneu`
- **All scores:** {'seosona-os': 41, 'seosona-video': 61, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
