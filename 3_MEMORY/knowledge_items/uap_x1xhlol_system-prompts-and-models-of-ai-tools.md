# KI: x1xhlol/system-prompts-and-models-of-ai-tools

## Overview
This repository appears to be a collection of system prompts and tools configurations for various AI models, including Claude, Gemini, GPT, and others. The files primarily consist of text documents containing prompt instructions and JSON files defining tool configurations intended to be used with these AI agents.  The structure suggests an effort to catalog and organize prompts tailored for different AI platforms and use cases.

## Tech Stack (from code)
Based on the file extensions (.txt, .json, .yaml, .png, .md), this project does not appear to have a traditional software development stack with associated configuration files like `package.json`, `requirements.txt`, or `Cargo.toml`. It is primarily focused on text and data files representing prompts and tool configurations rather than executable code.

## Public API / Exports
This repository doesn't contain any code that defines public APIs, exported functions, classes, or endpoints. The content consists entirely of prompt definitions and configuration files intended for use *with* external AI systems. There are no explicit exports within the provided file listing.

## Dependencies
There are no dependency management files (e.g., `package.json`, `requirements.txt`) present in the listed directory structure, therefore dependencies cannot be determined from code evidence.

## Architecture Patterns
The primary architectural pattern observed is a hierarchical organization of prompts and tools based on AI model and specific use case.  For example, there are directories for "Claude," "Gemini," "GPT," and subdirectories within those for different versions or functionalities (e.g., "Claude Code", "Google/Antigravity"). This suggests a design focused on modularity and categorization of prompts rather than complex software architecture. The use of both `.txt` files for prompt instructions and `.json` files for tool definitions indicates a separation of concerns between the textual guidance given to the AI and the specific tools it can utilize.

## Relevance to SEOSONA OS
This repository's content could be valuable for SEOSONA OS in several ways:

*   **Prompt Engineering Resource:** The collection of prompts provides a starting point or inspiration for developing custom system prompts for AI agents integrated into SEOSONA OS.
*   **Tool Configuration Examples:**  The JSON files defining tool configurations offer examples of how to structure and define tools that can be used by AI agents within the operating system.
*   **Model Compatibility Testing:** The variety of prompts targeting different models (Claude, Gemini, GPT) could facilitate testing and ensuring compatibility across various AI platforms integrated into SEOSONA OS.  However, without knowing what SEOSONA OS is or how it uses AI, this relevance remains speculative.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `openai`, `anthropic`, `gemini`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
