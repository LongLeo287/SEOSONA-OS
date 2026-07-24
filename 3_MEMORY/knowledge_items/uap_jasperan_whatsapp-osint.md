# KI: jasperan/whatsapp-osint

## Overview
**WhatsApp Beacon** tracks when specific WhatsApp contacts go online and stores every completed session in SQLite. It can export to Excel, generate a polished analytics dashboard, and run fully headless once the session is authenticated.

## Architecture & Tech Stack
- Python
-   Python deps: selenium, openpyxl, keyboard, webdriver-manager, pyyaml, colorlog, pytest, pytest-mock, coverage
- **Total files:** 46 files across 13 directories
- **File types:** .py: 18, .png: 9, .jpg: 3, .gitignore: 2, .md: 2, .yml: 2, .html: 2

## Core Capabilities
- **PyPI install**: `pip install whatsapp-osint` gets you the package fast.
- **One-command installer**: clone, create a local `.venv`, install the package, and verify the browser setup.
- **Best-effort Linux bootstrap**: if Git, Python, or Chrome/Chromium are missing, the installer will try to install them with `sudo`.
- **Automated browser driver resolution**: Selenium Manager handles matching drivers, with manual override flags if you need them.
- **Headless tracking**: authenticate once, then run quietly in the background.
- **SQLite session history**: every finished online session is stored locally.
- **Excel export**: turn the database into `History_wp.xlsx`.
- **Advanced analytics dashboard**: generate a static HTML report with filters, heatmaps, leaderboards, and recent-session views.

---

## Documentation Sections
- 🕵️‍♂️ WhatsApp Beacon (OSINT Tracker)
- ✨ Features
- 🚀 Installation
- Install from PyPI
- One-click installer from GitHub
- ▶️ Run it
- First run
- 📊 Advanced analytics
- or on macOS
- 🖼️ Screenshots
- First-run WhatsApp Web authentication flow
- Advanced analytics dashboard overview
- Advanced analytics dashboard filtered to a single contact
- ⚙️ Command line arguments
- ⚙️ Configuration
- 📦 Output
- 🔧 Troubleshooting
- `cannot find Chrome binary`
- `Username is required`
- 🤝 Contributing
- 📜 License
- 🙌 Credits

## Core Structure
```
  .gitignore
  CLAUDE.md
  History_wp.xlsx
  LICENSE
  README.md
  config.yaml
  install.sh
  pyproject.toml
  requirements.txt
  setup.py
  uv.lock
  .github/
    workflows/
      greetings.yml
  .serena/
    .gitignore
    project.yml
  assets/
    analytics-dashboard-filtered.jpg
    analytics-dashboard-overview.jpg
    whatsapp-web-first-run.jpg
  database/
    victims_logs.db
  docs/
    slides/
      presentation.html
      slide-01.png
      slide-02.png
      slide-03.png
      slide-04.png
      slide-05.png
      slide-06.png
  img/
    doc1.PNG
    img.png
    img_1.png
    img_2.png
  src/
    whatsapp_beacon/
      __init__.py
      analytics.py
      beacon.py
      config.py
      dashboard.html
      database.py
      db_to_excel.py
      logger.py
      main.py
  tests/
    __init__.py
    conftest.py
    test_infrastructure_validation.py
    integration/
      __init__.py
    unit/
      __init__.py
      test_analytics.py
      test_beacon.py
      test_config.py
      test_database.py
```

## Quick Start
```bash
python3 -m pip install whatsapp-osint
curl -fsSL https://raw.githubusercontent.com/jasperan/whatsapp-osint/master/install.sh | bash
PROJECT_DIR=/opt/whatsapp-osint curl -fsSL https://raw.githubusercontent.com/jasperan/whatsapp-osint/master/install.sh | bash
git clone https://github.com/jasperan/whatsapp-osint.git
cd whatsapp-osint
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -e ".[dev]"
whatsapp-osint -u "John Doe"
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

**WhatsApp Beacon** is a Selenium-based OSINT tool that monitors WhatsApp Web to track when specific contacts go online/offline. It logs session data to SQLite, can export to Excel, and generates an HTML analytics dashboard.

## Commands

### Install (development)
```bash
conda create -n whatsapp-osint python=3.12
conda activate whatsapp-osint
pip install -e ".[dev]"
```

### One-command installer (end-users)
```bash
curl -fsSL https://raw.githubusercontent.com/jasperan/whatsapp-osint/master/install.sh | bash
# Clones repo, creates .venv, installs deps, auto-installs Chrome if missing
```

### Run
```bash
# Module invocation (recommended during development)
python3 -m src.whatsapp_beacon.main -u "Contact Name"

# With options
python3 -m src.whatsapp_beacon.main -u "Contact Name" -l es --headless

# Generate analytics dashboard (writes analytics/index.html)
python3 -m src.whatsapp_beacon.main --analytics

# Export to Excel
python3 -m src.whatsapp_beacon.main -u "Contact Name" --excel

# After pip install (two aliases registered):
whatsapp-beacon -u "Contact Name"
whatsapp-osint -u "Contact Name"
```

### Tests
```bash
pytest                                                    # all tests
pytest tests/unit/test_beacon.py                          # single file
pytest tests/unit/test_beacon.py::TestClassName::test_x  # single test
coverage run -m pytest && coverage report                 # with coverage
```

## Architecture

Package lives in `src/whatsapp_beacon/`:

- **`config.py` (`Config`)**: Settings loaded in priority order: defaults → `config.yaml` → CLI args. Key config keys: `username`, `language`, `headless`, `excel`, `browser`, `log_level`, `data_dir`, `chrome_binary_path`, `split_char`. No env var support yet.
- **`beacon.py` (`WhatsAppBeacon`)**: Core class. Manages Selenium driver, WhatsApp Web login, contact search,


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
