# KI: minhtri22/mcp-server

## Overview
This project appears to be a server for managing and orchestrating software development tasks, likely involving AI agents or tools. It provides an API endpoint (likely accessed via SSE) and a dashboard interface for interacting with the system. The code demonstrates database interaction, configuration management, and plugin architecture.

## Tech Stack (from code)
- **Python:**  The primary language is Python, evidenced by numerous `.py` files throughout the repository (e.g., `mcp_server/main.py`, `dashboard/app.py`).
- **PostgreSQL:** The project utilizes PostgreSQL as its database, confirmed by the `docker-compose.yml` file which specifies an image `pgvector/pgvector:pg15` and environment variables for PostgreSQL user, password, and database name (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).
- **Flask:** The dashboard application uses Flask, as indicated by the presence of `app.py` in the `dashboard/` directory, which is a common entry point for Flask applications.  The `requirements.txt` file also lists `flask`.
- **Build System:** Python's standard library and potentially pip are used for dependency management. The `requirements.txt` files within both the `mcp_server/` and `dashboard/` directories list dependencies.

## Public API / Exports
Based on the code, it is difficult to determine a complete public API without further analysis of the `main.py` file in `mcp_server`. However, some observations can be made:

- **`/health` endpoint:**  The `docker-compose.yml` and `test_sprint1_verification.py` files reference a `/health` endpoint on port 8000.
- **SSE Endpoint:** The `docker-compose.yml` file indicates the use of Server-Sent Events (SSE) with the `--sse` flag passed to the `main.py` script (`command: python main.py --sse`).  The exact URL for this SSE endpoint is not explicitly defined in the provided code snippets.
- **Dashboard API:** The dashboard exposes an API on port 8501, as evidenced by the health check test in `test_sprint1_verification.py` (`http://localhost:8501/_stcore/health`).

## Dependencies
Based on the `requirements.txt` files:

- **mcp_server/requirements.txt:**  (Partial list - full content not provided) Includes dependencies like `psycopg2`, suggesting database interaction with PostgreSQL.
- **dashboard/requirements.txt:** (Partial list - full content not provided) Likely includes Flask and related libraries for web application development.

## Architecture Patterns
- **Plugin Architecture:** The project utilizes a plugin architecture, as demonstrated by the `plugins/` directory containing subdirectories for different plugins (`antigravity_sync`, `core_system`, etc.). Each plugin has a `plugin.yaml` file, suggesting configuration or metadata.
- **Configuration Management:**  The use of `mcp_config.json` files in both the root and `mcp_server/config/` directories indicates a configuration management system.
- **Layered Architecture (in `mcp_server/core/`)**: The `mcp_server/core/` directory contains subdirectories like `ast_analyzer`, `database`, `metrics`, suggesting a layered architecture for the core server functionality.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **AI Agent Orchestration:** The MCP Commander’s plugin architecture and task management capabilities can be adapted to orchestrate AI agents within SEOSONA OS, enabling automated workflows for software development or other tasks.
- **Database Integration:**  The PostgreSQL integration provides a robust foundation for storing and managing data related to AI agent activity and project state within SEOSONA OS.
- **Plugin Extensibility:** The plugin system allows for easy extension of SEOSONA OS functionality with custom tools and integrations, similar to how MCP Commander supports various plugins.
- **Dashboard Visualization:**  The dashboard component can be leveraged to create visualizations and monitoring interfaces for AI agent performance and project progress within the SEOSONA OS environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
