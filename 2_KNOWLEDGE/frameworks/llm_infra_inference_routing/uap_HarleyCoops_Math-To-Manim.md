# KI: HarleyCoops/Math-To-Manim

## Overview
This repository, `HarleyCoops/Math-To-Manim`, aims to generate cinematic Manim animations from natural language prompts. The core functionality revolves around a "Mythos 6-agent chain" that processes user input and orchestrates the creation of these animations, accessible via both a REST API and an MCP server.  The project emphasizes automated workflows and leverages large language models for various tasks within the animation pipeline.

## Tech Stack (from code)
- **Python:** The primary programming language, evidenced by numerous `.py` files throughout the repository (e.g., `mythos/cli.py`, `mythos/agents/base.py`).
- **Manim:** Used for creating animations, as indicated in the project description and dependency list (`render = [ "manim>=0.19" ]` in `pyproject.toml`).
- **FastAPI:**  Used to build the REST API (e.g., `mythos/api.py`, `mythos/service.py`), as specified in the dependencies (`dependencies = ["fastapi>=0.110", "uvicorn>=0.29"]` in `pyproject.toml`).
- **Setuptools:** Used for building and packaging the project, as defined in `pyproject.toml`: `build-backend = "setuptools.build_meta"`.
- **Pydantic:**  Used for data validation and settings management (`requires = ["pydantic>=2,<3"]` in `pyproject.toml`).

## Public API / Exports
Based on the code, it's difficult to definitively list all public APIs without further analysis of usage patterns. However, the following suggest exposed functionality:
- **REST API:** The `mythos/api.py` file indicates a REST API built with FastAPI.  The presence of `math-to-manim serve-api` command in `pyproject.toml` suggests an endpoint for health checks (`curl localhost:8642/health`).
- **CLI Command:** The `pyproject.toml` defines the `math-to-manim` and `m2m` commands, which are linked to `mythos.cli:main`. This implies a command-line interface for running the animation generation process.

## Dependencies
The following dependencies are listed in `pyproject.toml`:
- `pydantic>=2,<3`
- `setuptools>=69`
- `wheel`
- `pytest>=8` (dev dependency)
- `httpx>=0.27` (dev dependency)
- `fastapi>=0.110` (dependency and dev dependency)
- `uvicorn>=0.29` (dependency and dev dependency)
- `mcp>=1.2` (dependency and dev dependency)
- `manim>=0.19` (render dependency)

## Architecture Patterns
- **Agent-Based System:** The core architecture revolves around a "Mythos 6-agent chain," suggesting an agent-based system where each agent performs a specific task in the animation pipeline.  The `AGENTS.md` file describes these agents and their roles.
- **Modular Design:** The project is structured into modules (e.g., `agents`, `app`, `integrations`, `pipeline`, `rendering`) indicating a modular design approach.
- **Configuration-Driven:** Configuration files like `.toml` files (`followup_infer.toml`, `repair_train.toml`, etc.) within the `m2m2_visual_repair/configs/` directory suggest that much of the pipeline's behavior is driven by configuration rather than hardcoded logic.



## Relevance to SEOSONA OS
This project’s code could benefit SEOSONA OS in several ways:

- **Automated Content Generation:** The agent-based system and workflow automation techniques used for creating animations could be adapted to automate other content generation tasks within SEOSONA OS, such as generating training materials or documentation.
- **Modular Architecture:**  The modular design of the project provides a good example of how to structure complex systems into manageable components, which is valuable for building scalable and maintainable software in SEOSONA OS.
- **REST API Integration:** The use of FastAPI for creating a REST API demonstrates best practices for exposing functionality and integrating with other services within SEOSONA OS.  The `mcp` dependency also suggests integration capabilities that could be explored.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 44, 'seosona-content': 28, 'seosona-ux-ui': 22, 'seosona-flow': 28}
