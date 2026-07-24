# KI: harry0703/MoneyPrinterTurbo

## Overview
This project, "MoneyPrinterTurbo," is designed for generating short videos from text prompts, local assets, subtitles, and text-to-speech (TTS). It leverages various APIs and libraries to handle video creation, TTS conversion, and content generation. The code demonstrates a focus on automation and integration of multiple services for streamlined video production.

## Tech Stack (from code)
- **Python:**  The primary language is Python, evident from the numerous `.py` files throughout the repository (e.g., `cli.py`, `main.py`, `app/router.py`).
- **FastAPI:** The project uses FastAPI for building APIs, as seen in `app/asgi.py`: `from fastapi import FastAPI`.
- **Streamlit:**  The web UI is built with Streamlit, indicated by the `webui/Main.py` file and the command used to run it: `"streamlit", "run", "./webui/Main.py" (docker-compose.yml)`.
- **uvicorn:** Used as an ASGI server for FastAPI applications (`main.py`: `uvicorn.run(...)`).
- **TOML:** Configuration is managed using TOML files, specifically `config.example.toml` and `.streamlit/config.toml`.
- **Build System:** Hatchling is used as the build backend (pyproject.toml: `build-backend = "hatchling.build"`).

## Public API / Exports
Due to the large number of files, a complete listing is impractical. However, some notable exports include:

- `app.router`:  Likely contains FastAPI route definitions (based on file path and common FastAPI structure).
- `app.config.config`: Configuration object used throughout the application (`main.py`: `from app.config import config`).
- `cli.py` functions: Command-line interface functions for video generation, such as `parse_args`.

## Dependencies
Based on `requirements.txt` and `pyproject.toml`, the project depends on:
- moviepy==2.2.1
- streamlit==1.58.0
- edge_tts==7.2.7
- fastapi==0.136.3
- uvicorn==0.32.1
- openai==2.24.0
- faster_whisper==1.1.0
- loguru==0.7.3
- google.generativeai==0.8.6
- dashscope==1.20.14
- azure-cognitiveservices-speech==1.41.1
- redis==5.2.0
- python-multipart==0.0.27
- pyyaml==6.0.3
- requests==2.33.1
- socksio==1.0.0
- pydub==0.25.1
- litellm==1.86.2
- twelvelabs (optional)

## Architecture Patterns
- **Modular Design:** The `app/` directory structure suggests a modular design, with separate modules for controllers, models, services, and utilities.
- **Configuration Management:**  The use of TOML files (`config.example.toml`) indicates a configuration management pattern to externalize settings.
- **API Gateway (FastAPI):** FastAPI acts as an API gateway, handling routing and request processing.
- **Asynchronous Operations:** The use of `uvicorn` suggests asynchronous operations for improved performance.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **Automated Content Generation:**  The video generation pipeline can be integrated into SEOSONA OS to automatically create promotional videos or educational content based on user input and data.
- **TTS Integration:** The TTS capabilities (using `edge_tts` and potentially Azure Cognitive Services Speech) could enhance accessibility features within SEOSONA OS.
- **API Integration Framework:**  The project's integration with various APIs (Pexels, Pixabay, OpenAI, etc.) provides a valuable framework for integrating external services into SEOSONA OS. The modular design would allow for easy replacement or addition of API providers.
- **Streamlit UI Components:** Streamlit components could be reused to create custom user interfaces within SEOSONA OS for data visualization and interaction.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `embedding`
- **All scores:** {'seosona-os': 61, 'seosona-video': 56, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
