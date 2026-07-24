# KI: titanwings/colleague-skill

## Overview
This project appears to be a system for managing and installing "skills" related to colleagues, likely involving persona generation and work analysis. The presence of directories like `skills/colleague/example_*` suggests a modular design with pre-built skill examples.  The tools directory contains scripts for data collection from various platforms (DingTalk, Feishu, Slack) indicating an automation focus.

## Tech Stack (from code)
- **Language:** Python - evidenced by the `.py` file extensions and imports within files like `tools/dingtalk_auto_collector.py`.
- **Dependencies:** The project utilizes several Python libraries as listed in `requirements.txt`, including `requests`, `pypinyin`, `playwright`, `slack-sdk`, `python-docx`, and `openpyxl`.

## Public API / Exports
Due to the lack of readily available entry points (e.g., a main module or web server), identifying public APIs is difficult based solely on this code listing. However, files in the `tools/` directory suggest potential command-line interfaces:
- `dingtalk_auto_collector.py`: Likely contains functions for collecting data from DingTalk.
- `email_parser.py`:  Likely contains functions for parsing emails.
- `feishu_auto_collector.py`: Likely contains functions for collecting data from Feishu.
- `install_codex_skill.py`, `install_openclaw_generated_skill.py`: Suggests functions or scripts related to installing skills, potentially with command-line arguments.

## Dependencies
The following dependencies are listed in `requirements.txt`:
- `requests>=2.28.0`
- `pypinyin>=0.48.0` (Optional)
- `playwright>=1.40.0` (Optional)
- `slack-sdk>=3.27.0` (Optional)
- `python-docx>=1.1.0` (Optional)
- `openpyxl>=3.1.0` (Optional)

## Architecture Patterns
- **Modular Design:** The directory structure, particularly the `skills/colleague/example_*` and `prompts/*` directories, suggests a modular architecture where skills are self-contained units with associated personas and work descriptions.
- **Data Collection Automation:**  The presence of scripts like `dingtalk_auto_collector.py`, `feishu_auto_collector.py`, and `slack_auto_collector.py` indicates an automation pattern for gathering data from different communication platforms.
- **Configuration via JSON:** The use of `.json` files (e.g., `skills/colleague/example_jiaxiu/meta.json`) suggests configuration is handled through JSON format, likely defining skill properties or parameters.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Persona Generation:** The persona generation capabilities (evident from `prompts/*` and files within the example skills) can be integrated into SEOSONA OS for creating more realistic and engaging virtual agents or characters.
- **Data Collection Automation:**  The data collection scripts could be adapted to gather information relevant to SEOSONA OS's specific needs, such as user preferences or environmental data.
- **Skill Management Framework:** The skill management framework (installation scripts, modular design) provides a potential model for managing and extending the functionality of SEOSONA OS with custom modules or plugins.

## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `srt` · **Fit:** 99/100 · **Auto-apply:** True
- **Evidence:** `srt`, `subtitle`, `transcript`
- **All scores:** {'seosona-os': 44, 'seosona-video': 56, 'seosona-content': 99, 'seosona-ux-ui': 0, 'seosona-flow': 0}
