# KI: NevaMind-AI/memU

## Overview
This project, `memU`, appears to be a system for personal memory management and retrieval, designed to function as an AI companion or workspace. It provides capabilities for memorizing information, retrieving it based on various criteria (LLM, RAG), and exporting the memory in a human-readable format. The codebase demonstrates a focus on pluggable storage solutions and integration with large language models.

## Tech Stack (from code)
- **Python:**  The primary language is Python, evidenced by the 169 `.py` files (`src/`, `src/memu/`, etc.).
- **Rust:** A Rust library named `_core` is used for extension modules within Python. This is defined in `src/lib.rs`.
- **PyO3:**  The Rust code utilizes PyO3, a framework for writing Python extensions in Rust (`src/lib.rs`: `use pyo3::prelude::*;`).
- **SQLModel:** Used for database models (e.g., `src/memu/database/models.py`).
- **Langchain:**  Listed as a dependency in `pyproject.toml` under the "dependencies" section (`langchain-core>=1.2.7`).
- **uv**: A virtual environment manager, used for project setup and dependency management (Makefile).

## Public API / Exports
Based on the `src/memu/cli.py` file, the main entry point appears to be:
```python
# src/memu/cli.py
def main():
    ...
```
This is exposed as a script named "memu" via `[project.scripts]` in `pyproject.toml`:
```toml
# pyproject.toml
[project.scripts]
memu = "memu.cli:main"
```

The Rust module `_core` exports the function `hello_from_bin`. This is defined in `src/lib.rs`:
```rust
#[pyfunction]
fn hello_from_bin() -> String {
    "Hello from memu!".to_string()
}
```

## Dependencies
- **Python:** anthropic, defusedxml, httpx, numpy, openai, pydantic, sqlmodel, alembic, pendulum, langchain-core (listed in `pyproject.toml` under "dependencies").
- **Rust:** pyo3 (listed in `Cargo.toml`).

## Architecture Patterns
- **Modular Design:** The codebase is structured into modules (`src/memu/app`, `src/memu/blob`, `src/memu/database`) suggesting a modular design with clear separation of concerns.
- **Pluggable Storage:**  The architecture explicitly supports pluggable storage backends, as indicated in the directory structure (`src/memu/database/inmemory`, `src/memu/database/sqlite`, `src/memu/database/postgres`) and documented in `docs/adr/0002-pluggable-storage-and-vector-strategy.md`.
- **Workflow Pipeline:** The project uses a workflow pipeline architecture, as described in `AGENTS.md` ("Workflows: memorize, retrieve_rag, retrieve_llm...").



## Relevance to SEOSONA OS
The `memU` project's focus on personal memory management and retrieval could be beneficial for SEOSONA OS in the following ways:

- **Contextual Awareness:** The ability to store and retrieve information based on various criteria (LLM, RAG) can enhance SEOSONA’s contextual awareness.
- **Personalized User Experience:**  The pluggable storage architecture allows for integration with different data sources, enabling a more personalized user experience within SEOSONA.
- **Agentic Capabilities:** The workflow pipeline and LLM integration could be leveraged to build agentic capabilities into SEOSONA, automating tasks and providing proactive assistance.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `embedding`, `rag`, `vector`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 56}
