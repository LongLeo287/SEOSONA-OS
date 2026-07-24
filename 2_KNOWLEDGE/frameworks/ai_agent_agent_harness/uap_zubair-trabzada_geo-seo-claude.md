# KI: zubair-trabzada/geo-seo-claude

## Overview
This project appears to be a command-line tool and web application for performing SEO analysis, specifically focused on "geo" or geographic factors. The scripts suggest it's designed to integrate with Claude Code, likely as a custom skill.  The code includes components for scanning websites, generating reports, and potentially automating some SEO tasks.

## Tech Stack (from code)
- **Python:**  `requirements.txt` lists several Python packages including `beautifulsoup4`, `requests`, `flask`, and `playwright`. (`./requirements.txt`)
- **Bash:** The `install.sh`, `install-win.sh`, and `uninstall.sh` scripts are written in Bash for installation and uninstallation purposes.  (`./install.sh`, `./install-win.sh`, `./uninstall.sh`)
- **HTML/CSS:** Templates within the `webapp/templates` directory use HTML and CSS (`./scripts/webapp/templates/_notes.html`, `./templates/geo-report-style.css`).
- **JSON:** Configuration files for various entities (article author, local business, etc.) are defined in JSON format (`./schema/*.json`).

## Public API / Exports
Due to the nature of the project as a command-line tool and web application, it's difficult to definitively list public APIs without further execution or documentation. However, based on file names:
- **`brand_scanner.py`:** Likely exports functions related to brand scanning functionality. (`./scripts/brand_scanner.py`)
- **`citability_scorer.py`:**  Exports functions for citability scoring. (`./scripts/citability_scorer.py`)
- **`app.py`:** This file, located in the `webapp` directory, likely defines Flask routes and associated handlers for the web application. (`./scripts/webapp/app.py`)

## Dependencies
Based on `./requirements.txt`:
- `beautifulsoup4>=4.12.0,<5.0.0`
- `requests>=2.32.4,<3.0.0`
- `lxml>=6.0.2,<7.0.0`
- `playwright>=1.56.0,<2.0.0`
- `Pillow>=12.1.0,<13.0.0`
- `urllib3>=2.6.3,<3.0.0`
- `validators>=0.22.0,<1.0.0`
- `flask>=3.0.0,<4.0.0`
- `rich>=13.0.0,<14.0.0`

## Architecture Patterns
- **Modular Design:** The project is structured into directories like `agents`, `geo`, `schema`, and `skills`, suggesting a modular design with distinct components for different functionalities.
- **Scripted Automation:**  The use of Bash scripts (`install.sh`, `uninstall.sh`) indicates an emphasis on automated installation, configuration, and uninstallation processes.
- **Web Application Layer:** The presence of Flask routes and HTML templates suggests a web application component for user interaction and report presentation.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Geographic SEO Capabilities:**  The "geo" focus provides valuable geographic data processing and analysis capabilities that can be integrated into SEOSONA OS’s core functionality.
- **Automated Reporting:** The report generation components (templates, scripts) can be adapted to create customized SEO reports within the SEOSONA OS platform.
- **Skill Integration Framework:**  The design of this project as a Claude Code skill demonstrates an approach to creating modular and extensible functionalities that could inform the development of a similar skill integration framework for SEOSONA OS.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `scraping` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `crawl`, `playwright`, `beautifulsoup`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
