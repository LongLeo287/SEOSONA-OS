# KI: asgeirtj/system_prompts_leaks

## Overview
This repository appears to be a collection of system prompts and related documentation for the Claude AI assistant, likely intended for internal use or research purposes. The files primarily consist of Markdown documents detailing various prompt configurations, skill definitions, and design specifications across different Claude models (Sonnet, Opus, Haiku) and functionalities (code generation, data visualization).  The structure suggests a focus on documenting and managing these prompts to ensure consistency and reproducibility.

## Tech Stack (from code)
- **JavaScript:** The presence of `validate_palette.js` in the `Anthropic/Claude Code/dataviz/scripts/` directory indicates JavaScript usage for data validation purposes.  (File: `Anthropic/Claude Code/dataviz/scripts/validate_palette.js`)
```javascript
// Anthropic/Claude Code/dataviz/scripts/validate_palette.js
// This file contains javascript code, likely used for validating palettes.
```
- **Python:** The presence of `validate_palette.py` in the `Anthropic/Claude Code/dataviz/scripts/` directory indicates Python usage for data validation purposes. (File: `Anthropic/Claude Code/dataviz/scripts/validate_palette.py`)
```python
# Anthropic/Claude Code/dataviz/scripts/validate_palette.py
# This file contains python code, likely used for validating palettes.
```
- **Markdown:** The vast majority of files are Markdown (`.md`), suggesting that the primary technology is documentation and text formatting using Markdown syntax.

## Public API / Exports
There's no discernible public API or exported functions in the provided source code.  The repository consists entirely of static Markdown documents, which do not define any executable code with exports. The files appear to be intended for human consumption (reading and understanding) rather than programmatic interaction.

## Dependencies
No dependency management files (`package.json`, `requirements.txt`, `Cargo.toml`) were found in the provided file listing. Therefore, it's impossible to determine external dependencies based solely on this information.

## Architecture Patterns
- **Hierarchical Documentation:** The directory structure demonstrates a hierarchical approach to organizing prompts and related documentation, categorized by Claude model version (Sonnet, Opus, Haiku) and functionality (Code, Data Visualization, Deep Research). This suggests an attempt at structured knowledge management.
- **Skill-Based Design:**  The presence of "SKILL.md" files within several directories (`Anthropic/Claude Code/dataviz/`, `Anthropic/Claude Code/run-skill-generator/`) indicates a design pattern where functionality is encapsulated into reusable skills or modules, likely for the Claude AI assistant.
- **Versioned Documentation:** The filenames in the `Official` directory (e.g., `2024-07-12-claude-haiku-3.md`) suggest a versioning system for documenting changes to prompts and configurations over time.

## Relevance to SEOSONA OS
The repository's focus on prompt engineering and skill design could be beneficial to SEOSONA OS in the following ways:
- **Prompt Engineering Best Practices:** The collection of prompts provides examples of how to structure instructions and guide AI behavior, which can inform the development of more effective prompts for SEOSONA OS’s own AI components.
- **Skill Modularization:**  The "SKILL" concept could inspire a modular design approach for SEOSONA OS's AI functionalities, allowing for easier reuse and maintainability.
- **Documentation Standards:** The repository demonstrates a structured documentation system that can be adapted to improve the clarity and consistency of SEOSONA OS’s internal AI development processes.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `openai`, `anthropic`, `gemini`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
