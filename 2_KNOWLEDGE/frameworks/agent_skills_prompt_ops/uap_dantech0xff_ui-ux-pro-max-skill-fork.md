# KI: dantech0xff/ui-ux-pro-max-skill-fork

## Overview
This repository contains a skill for AI coding assistants like Claude Code, designed as an "Antigravity Kit" providing searchable databases of UI styles, color palettes, and UX guidelines. The core functionality revolves around a search engine that allows users to query these datasets based on various domains (product, style, typography, etc.) and stacks (React, Nextjs, Vue, etc.).  The project appears to be designed for distribution across multiple AI assistant platforms.

## Tech Stack (from code)
- **Python:** The primary language is Python, evidenced by the presence of `.py` files like `scripts/core.py` and `scripts/search.py`.
```python
# File: .claude/skills/ui-ux-pro-max/scripts/core.py
import os
import re
import sys
from typing import List, Tuple

class SearchEngine:
    def __init__(self):
        pass
```
- **CSV:** Data is stored and accessed using CSV files (e.g., `data/charts.csv`, `data/colors.csv`), indicating data storage and manipulation within the project.
- **BM25 Algorithm**: The search engine utilizes a BM25 ranking algorithm, as stated in the CLAUDE.md file: "The search engine uses BM25 ranking combined with regex matching."

## Public API / Exports
Based on the limited code provided (specifically `scripts/search.py` and `scripts/core.py`), it's difficult to definitively list a public API. However, the following can be inferred from the CLI command documented in `CLAUDE.md`:

- **`search.py`:**  This script appears to expose a command-line interface (CLI) for searching the UI/UX data. The CLI takes arguments like `<query>`, `--domain`, and `--stack`.
```bash
# File: CLAUDE.md
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max_results>]
```

## Dependencies
The repository does not contain a `package.json` or `requirements.txt` file, so dependencies cannot be determined from the provided code snippets.  However, the use of Python suggests there are likely external libraries used within the scripts.

## Architecture Patterns
- **Skill/Workflow for AI Assistants:** The project is explicitly designed as a skill or workflow for various AI coding assistants (Claude Code, Windsurf, Cursor). This implies a modular architecture intended to be integrated into different platforms.
- **Centralized Data Storage:**  The UI/UX data is stored in CSV files within the `data/` directory, suggesting a centralized repository of information accessible by the search engine.
- **Domain-Driven Design (Limited):** The use of `--domain` argument suggests some level of domain-driven design, separating concerns like product recommendations, style guides, and typography suggestions into distinct categories.
- **CLI Tooling:** A command-line interface is provided for interacting with the data and search functionality.

## Relevance to SEOSONA OS
The project's focus on UI/UX guidelines, searchable databases of styles, and integration with AI coding assistants could be beneficial to SEOSONA OS in several ways:

- **Design System Integration:** The structured data (color palettes, typography pairings) can be directly integrated into the SEOSONA OS design system.
- **AI-Powered Design Assistance:**  The skill/workflow architecture allows for easy integration with AI tools within SEOSONA OS to provide real-time design suggestions and feedback.
- **Improved Developer Productivity:** The searchable database of UI/UX resources can help developers quickly find the information they need, improving their productivity and ensuring consistency across projects.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 56, 'seosona-flow': 28}
