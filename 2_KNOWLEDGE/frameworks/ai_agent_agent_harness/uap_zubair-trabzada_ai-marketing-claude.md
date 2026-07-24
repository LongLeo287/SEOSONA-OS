# KI: zubair-trabzada/ai-marketing-claude

## Overview
This project appears to be a collection of Claude Code skills, agents, and scripts designed for AI-powered marketing tasks. The purpose is to provide pre-built components that can be integrated into the Claude AI platform to automate various marketing processes, such as competitor analysis, content generation, and report creation.  The installation script suggests these are intended to augment Claude's capabilities with specific marketing expertise.

## Tech Stack (from code)
- **Language:** Python (`analyze_page.py`, `competitor_scanner.py`, `generate_pdf_report.py`, `social_calendar.py`). The presence of `.py` files confirms this.
- **Dependencies:**  The project relies on the `reportlab` library for PDF report generation, as specified in `requirements.txt`. (`requirements.txt`: `reportlab>=4.0`)

## Public API / Exports
Due to the nature of Claude Code skills (which are Markdown files intended to be consumed by the Claude platform), there's no traditional public API or exported functions in the conventional programming sense.  The "public" interface is defined by the content and structure within the `.md` files located in the `skills/` and `agents/` directories, which presumably dictate how Claude interacts with these components. The `market/SKILL.md` file appears to be a central orchestrator for the skills.

## Dependencies
- **Python Libraries:**  `reportlab` (version >= 4.0) as listed in `requirements.txt`.
- **Claude Code Platform:** The project is explicitly designed and intended to function within the Claude Code environment, requiring the `claude` command-line tool to be available. This dependency is checked for during installation (`install.sh`).

## Architecture Patterns
- **Modular Skill Design:**  The project adopts a modular architecture with distinct skills (e.g., `market-audit`, `market-copy`) each likely encapsulating a specific marketing task. These are organized within the `skills/` directory.
- **Agent-Based Automation:** The presence of agents (`agents/`) suggests an agent-based approach to automating complex workflows, where individual agents handle specific subtasks and coordinate with each other.
- **Scripted Tasks:**  The `scripts/` directory contains Python scripts that likely perform more involved data processing or report generation tasks, complementing the skills and agents.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Integration with AI Agents:** The agent-based architecture aligns well with a system designed for autonomous task execution.  The existing agents could be adapted or integrated into SEOSONA OS workflows.
- **Marketing Automation Modules:** The individual skills (e.g., competitor analysis, content generation) can be repurposed as reusable modules within SEOSONA OS to automate marketing tasks and improve efficiency.
- **Report Generation Capabilities:** The `reportlab` dependency and the existence of a PDF report generation script (`generate_pdf_report.py`) demonstrate an ability to create structured reports which could be integrated into SEOSONA's reporting features.
- **Claude Code Compatibility:** If SEOSONA OS aims for compatibility with Claude or similar AI platforms, understanding this project’s structure and integration approach can provide valuable insights.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
