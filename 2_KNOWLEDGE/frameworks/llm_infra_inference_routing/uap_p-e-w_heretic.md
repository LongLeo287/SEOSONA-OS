# KI: p-e-w/heretic

## Overview
The `heretic` repository aims to automatically remove censorship from language models. It achieves this by analyzing and modifying the behavior of LLMs, likely through techniques like residual analysis and prompt engineering. The project appears focused on identifying and mitigating "guardrails" or safety filters imposed on these models.

## Tech Stack (from code)
- **Python:**  The primary language is Python, evidenced by the `.py` file extensions throughout the `src/heretic/` directory (e.g., `src/heretic/__init__.py`, `src/heretic/analyzer.py`).
- **Pyproject.toml**: This file indicates usage of `uv_build` as a build backend, and specifies dependencies like `torch` and `transformers`.
- **TOML:** Configuration files (`config.default.toml`, `config.nohumor.toml`, `config.noslop.toml`) use TOML format for defining project settings.

## Public API / Exports
Due to the limited scope of analysis (only code inspection, no execution), identifying a definitive public API is difficult. However, based on the `pyproject.toml` file:
- **`heretic.main:main`**: This script appears to be the primary entry point for running the Heretic tool.  This suggests that the `main()` function within the `heretic.main` module is exposed or intended for external use (though not necessarily a public API in the traditional sense).

## Dependencies
The project's dependencies are listed in `pyproject.toml`:
- `accelerate~=1.13`
- `bitsandbytes~=0.49`
- `datasets~=4.7`
- `huggingface-hub~=1.7`
- `immutabledict~=4.3`
- `langdetect~=1.0`
- `lm-eval[hf]~=0.4`
- `numpy~=2.2`
- `optuna~=4.7`
- `peft~=0.19`
- `psutil~=7.2`
- `py-cpuinfo~=9.0`
- `pydantic-settings~=2.13`
- `questionary~=2.1`
- `rich~=14.3`
- `tomli-w~=1.2`
- `torch` (version unspecified)
- `torchvision` (version unspecified)
- `tqdm~=4.67`
- `transformers[kernels]~=5.6`
- `geom-median~=0.1` (optional dependency)
- `imageio~=2.37` (optional dependency)
- `matplotlib~=3.10` (optional dependency)
- `pacmap~=0.8` (optional dependency)
- `scikit-learn~=1.7` (optional dependency)
- `ruff>=0.14.5` (dev dependency)
- `ty>=0.0.5` (dev dependency)

## Architecture Patterns
- **Modular Design:** The code is organized into modules within the `src/heretic/` directory, suggesting a modular architecture (`analyzer.py`, `evaluator.py`, `scorer.py`, etc.).
- **Configuration-Driven:**  The project heavily relies on configuration files (TOML format) to control its behavior, indicating a design that prioritizes flexibility and customization. The presence of multiple config files (`config.default.toml`, `config.nohumor.toml`, `config.noslop.toml`) suggests different operational modes or profiles.
- **Plugin System:**  The existence of a `plugin.py` file hints at a plugin architecture, allowing for extensibility and customization of the core functionality.

## Relevance to SEOSONA OS
The techniques employed by Heretic – analyzing LLM behavior, identifying constraints, and manipulating prompts – could be valuable for SEOSONA OS in several ways:
- **Safety Filter Bypass Research:** The code provides a framework for understanding how safety filters work and potentially bypassing them, which can inform the development of more robust and adaptable AI systems.
- **Prompt Engineering Techniques:**  The project's approach to prompt engineering could be adapted to improve the performance and controllability of LLMs within SEOSONA OS.
- **Automated Analysis Tools:** The analysis components (e.g., `analyzer.py`, `scorer.py`) could be repurposed or integrated into SEOSONA OS for automated evaluation and optimization of AI models.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `llm`, `gemini`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
