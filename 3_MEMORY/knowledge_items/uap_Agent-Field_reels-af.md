# KI: Agent-Field/reels-af

## Overview
This project, "reel-af," aims to generate vertical viral reels from a URL or topic using a multi-reasoner DAG on the AgentField platform. It leverages various AI models for text-to-speech (TTS), image generation, and video creation, integrating with services like OpenRouter and potentially Veo for motion. The project is designed to be deployed as a Docker container and integrates with an AgentField control plane.

## Tech Stack (from code)
- **Language:** Python 3.11 (Dockerfile: `FROM python:3.11-slim`)
- **Framework/Libraries:**  `pydantic`, `python-dotenv`, `aiohttp`, `readability-lxml`, `lxml`, `typer`, `rich`, `Pillow`, `pysubs2`, `agentfield` (pyproject.toml: `dependencies = [...]`)
- **Build System:** Setuptools, UV (pyproject.toml, Dockerfile)

## Public API / Exports
Based on the `docker-compose.yml` and `main.py` files, the following endpoints are exposed:
- `/`:  The main application endpoint accessible via `http://reel-af:8002` (docker-compose.yml). The `reel-af-server` script defined in pyproject.toml is likely associated with this endpoint.

## Dependencies
Based on `pyproject.toml`, the project's dependencies include:
- `agentfield`
- `pydantic>=2.0`
- `python-dotenv>=1.0`
- `aiohttp>=3.9`
- `readability-lxml>=0.8`
- `lxml[html_clean]>=5.0`
- `typer>=0.12`
- `rich>=13.0`
- `Pillow>=10.0`
- `pysubs2>=1.7`
Development dependencies:
- `pytest>=7.0`
- `pytest-asyncio>=0.21`
- `ruff>=0.1`

## Architecture Patterns
- **AgentField Integration:** The project is tightly integrated with AgentField, as evidenced by the environment variables (`AGENTFIELD_SERVER`, `AGENT_NODE_ID`) and dependency on the `agentfield` package.  It appears to act as an agent within the AgentField ecosystem.
- **Modular Design:** The code is structured into several modules under `src/reel_af/`, including `app.py`, `cli.py`, `models.py`, `agents/`, `planning/`, and `render/`. This suggests a modular design with distinct responsibilities for different components of the reel generation process.
- **Configuration via Environment Variables:**  The project heavily relies on environment variables (defined in `.env.example` and used in `docker-compose.yml`) to configure various aspects, such as API keys, model choices, and AgentField settings. This promotes flexibility and ease of deployment across different environments.
- **Asynchronous Operations:** The use of `aiohttp` suggests that the application utilizes asynchronous programming for network requests.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Content Generation Capabilities:**  The reel generation functionality can be integrated into SEOSONA OS to automatically create engaging short-form video content from various sources (URLs, topics).
- **AgentField Integration:** The existing AgentField integration provides a framework for incorporating this reel generation process as an agent within the broader SEOSONA OS ecosystem. This allows for automated workflows and interactions with other agents.
- **Modular Design & Reusability:**  The modular design of the code makes it easier to adapt and reuse components for other content creation tasks within SEOSONA OS. The `render/` directory, in particular, contains modules for image generation, subtitle rendering, text-to-speech, and video stitching that could be valuable assets.


## UAP Routing (auto-classified)
- **System:** `seosona-content` · **Function:** `srt` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `subtitle`
- **All scores:** {'seosona-os': 22, 'seosona-video': 28, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 28}
