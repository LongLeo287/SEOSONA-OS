# KI: ericblue/habit-sprint

## Overview
This project, `habit-sprint`, is a command-line tool and potentially web application for tracking habits within sprint cycles. It appears to be designed around a JSON-native approach, accepting commands and data via JSON payloads. The system manages sprints, habits associated with those sprints, and provides reporting capabilities.

## Tech Stack (from code)
- **Language:** Python 3.12 (specified in `pyproject.toml`: `requires-python = ">=3.12"`)
- **Build System:** Setuptools (defined in `pyproject.toml`: `[build-system] build-backend = "setuptools.build_meta"`)
- **Web Framework:** FastAPI is used for the web component (`pyproject.toml`: `web = ["fastapi>=0.115.0", ... ]`)
- **Templating Engine:** Jinja2 is used for templating HTML pages (`pyproject.toml`: `web = ["jinja2>=3.1.0", ... ]`)

## Public API / Exports
Based on the `Makefile` and `habit_sprint/cli.py`, the primary public interface appears to be a command-line tool accessible via `habit-sprint`.  The `run` target in the `Makefile` demonstrates example usage:

```makefile
run: ## Print usage examples for habit-sprint CLI
	@echo "habit-sprint CLI usage examples:"
	@echo ""
	@echo "  # List all sprints"
	@echo '  habit-sprint --json '"'"'{"action": "list_sprints"}'"'"''
	@echo ""
	@echo "  # Create a new sprint"
	@echo '  habit-sprint --json '"'"'{"action": "create_sprint", "payload": {"name": "March 2026", "start_date": "2026-03-01"}}'"'"''
```

This suggests the tool accepts JSON payloads with an `action` key to trigger different functionalities.  The CLI is defined in `habit_sprint/cli.py`, which contains a `main` function (referenced by `[project.scripts] habit-sprint = "habit_sprint.cli:main"` in `pyproject.toml`).

## Dependencies
Based on the `pyproject.toml` file, the dependencies include:

- setuptools (>=68.0)
- setuptools-scm (>=8.0)
- fastapi (>=0.115.0)
- uvicorn (>=0.34.0)
- jinja2 (>=3.1.0)
- python-multipart (>=0.0.9)
- httpx (>=0.27.0)
- pytest (>=8.0)

## Architecture Patterns
- **Command-Line Interface (CLI):** The project heavily relies on a CLI for interacting with the system, as evidenced by the `Makefile` and example commands.
- **JSON Configuration:**  The application appears to be designed to accept configuration and instructions via JSON payloads. This suggests a potentially flexible architecture where behavior can be modified without code changes.
- **Modular Design (Potential):** The presence of multiple Python files within the `habit_sprint/` directory (`cli.py`, `db.py`, `engine.py`, etc.) indicates a likely modular design, although the specific interactions between these modules are not evident from this limited view.

## Relevance to SEOSONA OS
The project's JSON-native approach and CLI could be beneficial for integration with SEOSONA OS:

- **Automation:** The ability to interact with `habit-sprint` via a JSON payload makes it suitable for automated tasks within the OS, such as scheduling habit tracking routines or generating reports.
- **Extensibility:**  The modular design and reliance on configuration files suggest that new features or integrations could be added without modifying core code. This aligns well with SEOSONA's extensible architecture.
- **Reporting & Monitoring:** The reporting capabilities of `habit-sprint` (e.g., sprint dashboards) could provide valuable insights into user behavior and productivity, which can be integrated into the OS’s monitoring systems.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `mcp`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
