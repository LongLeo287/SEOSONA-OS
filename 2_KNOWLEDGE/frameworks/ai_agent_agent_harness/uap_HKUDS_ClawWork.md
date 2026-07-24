# KI: HKUDS/ClawWork

## Overview
Repository with 7855 files across 3624 directories. Primary language: Python (59 files).

## Tech Stack (from code)
- Python (59 files)
- **Total:** 7855 files, 3624 directories
- **File types:** .jsonl: 2387, .log: 2345, .txt: 1023, .pdf: 544, .docx: 518, .xlsx: 456, .pptx: 140, .png: 112

## Dependencies

### Python Dependencies (from requirements.txt)
- `fastapi>=0.104.0`
- `uvicorn>=0.24.0`
- `websockets>=12.0`
- `fastmcp>=0.2.0`
- `langchain>=0.1.0`
- `langchain-openai>=0.0.2`
- `langchain-mcp-adapters>=0.1.0`
- `langgraph>=0.2.0`
- `pandas>=2.0.0`
- `pyarrow>=14.0.0`
- `python-dotenv>=1.0.0`
- `requests>=2.31.0`
- `boxlite[sync]>=0.6.0`
- `e2b-code-interpreter>=1.0.0`
- `tavily-python>=0.3.0  # Tavily search (recommended)`
- `aiofiles>=23.2.1`
- `python-docx>=1.0.0`
- `python-pptx>=0.6.21`
- `reportlab>=4.0.0`
- `openpyxl>=3.1.0`

## Imports Detected in Source
- `setuptools`

## File Structure
```
  .env.example
  .gitignore
  LICENSE
  README.md
  requirements.txt
  run_test_agent.sh
  setup.py
  start_dashboard.sh
  view_logs.sh
  assets/
    architecture.png
    clawmode.gif
    clawwork_banner.png
    dashboard_preview.png
    leaderboard.gif
    live_banner.png
  clawmode_integration/
    README.md
    __init__.py
    agent_loop.py
    artifact_tools.py
    cli.py
    config.py
    provider_wrapper.py
    task_classifier.py
    tools.py
    skill/
      SKILL.md
  eval/
    README.md
    generate_meta_prompts.py
    meta_prompt_generation.log
    test_single_category.py
    meta_prompts/
      Accountants_and_Auditors.json
      Administrative_Services_Managers.json
      Audio_and_Video_Technicians.json
      Buyers_and_Purchasing_Agents.json
      Child_Family_and_School_Social_Workers.json
      Compliance_Officers.json
      Computer_and_Information_Systems_Managers.json
      Concierges.json
      Counter_and_Rental_Clerks.json
      Customer_Service_Representatives.json
      Editors.json
      Film_and_Video_Editors.json
      Financial_Managers.json
      Financial_and_Investment_Analysts.json
      First-Line_Supervisors_of_Non-Retail_Sales_Workers.json
      First-Line_Supervisors_of_Office_and_Administrative_Support_Workers.json
      First-Line_Supervisors_of_Police_and_Detectives.json
      First-Line_Supervisors_of_Production_and_Operating_Workers.json
      First-Line_Supervisors_of_Retail_Sales_Workers.json
      General_and_Operations_Managers.json
      Industrial_Engineers.json
      Lawyers.json
      Mechanical_Engineers.json
      Medical_Secretaries_and_Administrative_Assistants.json
      Medical_and_Health_Services_Managers.json
      News_Analysts_Reporters_and_Journalists.json
      Nurse_Practitioners.json
      Order_Clerks.json
      Personal_Financial_Advisors.json
      Pharmacists.json
      Private_Detectives_and_Investigators.json
      Producers_and_Directors.json
      Project_Management_Specialists.json
      Propert
```

## Key Source Excerpts
### setup.py
```python
"""
LiveBench Setup
"""
from setuptools import setup, find_packages

setup(
    name="livebench",
    version="1.0.0",
    description="AI Agent Economic Survival Simulation",
    packages=find_packages(),
    python_requires=">=3.10",
    install_requires=[
        # Core dependencies - add as needed
    ],
)


```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`, `router`
- **All scores:** {'seosona-os': 89, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
