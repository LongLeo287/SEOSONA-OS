# KI: amruth-sn/kong

## Overview
This project, "kong," is described as an AI reverse engineer with LLM orchestration for binary analysis. It appears to be a suite of tools and libraries designed for tasks like decompilation, deobfuscation, and vulnerability detection within binaries. The project utilizes both Python and Rust codebases, suggesting a hybrid approach to development.

## Tech Stack (from code)
- **Python:**  The `pyproject.toml` file lists Python as the primary language (`requires-python = ">=3.11"`). Numerous `.py` files exist within the `kong/` directory and its subdirectories, confirming this.
- **Rust:** The presence of `Cargo.lock`, `Cargo.toml`, and Rust source code in the `crates/kong-ml` and `crates/kong-types` directories indicates the use of Rust as a secondary language.
- **Build System (Python):** Hatchling is used for Python package building, specified in `pyproject.toml`. (`build-backend = "hatchling.build"`)
- **Build System (Rust):** Cargo is used for Rust project management and builds. (`Cargo.toml` files)
- **LLM Frameworks:** Anthropic and OpenAI are listed as dependencies in the Python environment, indicating integration with LLMs.

## Public API / Exports
Due to the scope of this analysis being limited to code inspection only, identifying a complete public API is not possible. However, based on module structures:

*   **`kong-ml::tokenizer::...`**:  The `crates/kong-ml/src/lib.rs` file exports a `tokenizer` module, suggesting functionality related to tokenization of binary code or data.
*   **`kong-types::binary::...`**: The `crates/kong-types/src/lib.rs` file exports a `binary` module, indicating types and structures for representing binaries.
*   **Python Modules:**  The `kong/` directory contains modules like `config.py`, `db.py`, `agent/__init__.py`, `evals/harness.py`, etc., suggesting these are intended to be used as Python modules within the larger Kong system.

## Dependencies
- **Python (from pyproject.toml):**
    - `click>=8.1`
    - `rich>=13.0`
    - `anthropic>=0.40`
    - `openai>=1.0`
    - `textual>=1.0`
    - `lief>=0.15`
    - `z3-solver>=4.12`
    - `pyghidra>=2.2.1`
    - `jpype1>=1.6.0`
    - `json-repair>=0.58.5`
    - `pytest>=8.0` (dev dependency)
    - `pytest-asyncio>=0.24` (dev dependency)

- **Rust (from Cargo.toml and crates/kong-ml/Cargo.toml):**
    - `serde`
    - `serde_json`
    - `strum_macros`
    - `candle-core`
    - `candle-nn`
    - `candle-transformers`
    - `safetensors`
    - `dirs`

## Architecture Patterns
- **Modular Design:** The project is heavily modularized, with distinct directories and modules for different functionalities (e.g., `agent/`, `evals/`, `ghidra/`, `llm/`). This suggests a focus on separation of concerns.
- **Hybrid Language Approach:**  The combination of Python and Rust indicates a potential strategy where performance-critical components are implemented in Rust, while higher-level logic or scripting is handled in Python. The `kong-ml` crate depends on `kong-types`, suggesting that the Rust code provides data structures used by the Python parts.
- **Agentic Architecture:**  The presence of an `agent/` directory suggests a design incorporating agent-based principles, potentially for automating reverse engineering tasks.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

*   **Binary Analysis Capabilities:** The tools within "kong" can be integrated into SEOSONA OS to enhance its ability to analyze and understand binary files, identifying potential vulnerabilities or malicious behavior.
*   **Deobfuscation Support:**  The deobfuscation features could aid in analyzing obfuscated code samples encountered during security assessments.
*   **LLM Integration:** The project's use of LLMs for reverse engineering tasks demonstrates a modern approach that SEOSONA OS could adopt to improve its analysis capabilities and automate complex processes. Specifically, the `kong-ml` crate shows how LLMs can be integrated into binary analysis workflows.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
