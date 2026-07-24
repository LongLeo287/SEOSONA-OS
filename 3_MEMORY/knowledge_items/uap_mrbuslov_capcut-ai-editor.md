# KI: mrbuslov/capcut-ai-editor

## Overview
This project, `capcut-ai-editor`, provides an MCP (Media Collaboration Protocol) server for automating video editing within CapCut. It leverages AI, specifically Claude Code and optionally OpenAI's GPT models, to analyze auto-generated subtitles, identify silences and duplicate takes, and directly modify CapCut projects. The goal is to streamline the "talking head" video editing process by removing unnecessary pauses and redundant segments.

## Tech Stack (from code)
- **Language:** Python 3 (specified in `pyproject.toml`: `requires-python = ">=3.10"`)
- **Build System:** Hatchling (defined in `pyproject.toml`: `build-backend = "hatchling.build"`)
- **Dependencies:**  The project utilizes several Python libraries, as listed in `requirements.txt` and `pyproject.toml`, including `mcp`, `openai`, `httpx`, `pydantic`, and `pydantic-settings`.

## Public API / Exports
Based on the directory structure and file names, it's difficult to definitively determine a public API without further analysis of the entry points used by MCP clients. However, we can infer exposed functionality from the `server.py` file:

*   `list_capcut_projects`:  Likely lists available CapCut projects.
*   `open_capcut_project`: Opens an existing CapCut project.
*   `smart_cut_project`: The core tool for automated editing.
*   `edit_subtitle`: Modifies individual subtitles.
*   `split_subtitle`: Splits a subtitle segment.
*   `merge_subtitles`: Merges subtitle segments.
*   `fix_word_timing`: Adjusts the timing of words within a subtitle.
*   `batch_edit_subtitles`:  Applies edits to multiple subtitles.

These are likely exposed as MCP tools, although the exact implementation details and data structures remain unclear without examining the client-side code.

## Dependencies
The project relies on the following dependencies:

*   `mcp>=1.0.0` (from `requirements.txt` and `pyproject.toml`) - The Media Collaboration Protocol library.
*   `openai>=1.0.0` (from `requirements.txt` and `pyproject.toml`, also listed as an optional dependency) - OpenAI's Python library for interacting with their models.
*   `httpx>=0.25.0` (from `requirements.txt`) - An HTTP client library.
*   `pydantic>=2.0.0` (from `requirements.txt` and `pyproject.toml`) - Data validation and settings management using Python type annotations.
*   `pydantic-settings>=2.0.0` (from `requirements.txt` and `pyproject.toml`) -  For managing configuration settings.

## Architecture Patterns
*   **Modular Design:** The project is structured into modules (`smartcut/core`, `smartcut/tools`) with clear responsibilities, promoting code organization and reusability.
*   **Configuration-Driven:** Settings like API keys and directory paths are managed through environment variables (as indicated in `config.py`), allowing for flexible deployment across different environments.
*   **Optional AI Integration:** The use of OpenAI's GPT models is optional, providing a fallback mechanism if the external service is unavailable or undesirable. This is evident from the conditional logic within `tools/capcut_projects.py` (`_detect_duplicates_with_llm()`).
*   **Heuristic-Based Algorithm:**  The core editing logic relies on heuristics (e.g., silence detection, duplicate take identification) implemented in `tools/capcut_projects.py`.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by:

*   **Automated Video Processing Pipeline Integration:** The MCP server architecture allows for seamless integration with a video processing pipeline within SEOSONA OS, automating tasks like removing silences and duplicate takes from user-generated content.
*   **AI-Powered Content Enhancement:**  The use of AI models (Claude Code, OpenAI GPT) demonstrates the potential to enhance content quality automatically, which aligns with SEOSONA's goals for intelligent media management. The `llm_client.py` file shows a clear path for integrating other LLMs as well.
*   **CapCut Ecosystem Support:**  The project’s direct interaction with CapCut projects provides valuable support for users within the CapCut ecosystem, potentially expanding SEOSONA's reach and utility.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`
- **All scores:** {'seosona-os': 41, 'seosona-video': 28, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
