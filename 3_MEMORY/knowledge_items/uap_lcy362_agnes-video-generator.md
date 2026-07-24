# KI: lcy362/agnes-video-generator

## Overview
This repository contains a system, "Agnes Video Generator," designed for creating short videos from text prompts and images. The core functionality involves processing user input, generating video content using various pipelines (simple, creative, manuscript), and serving the results through an API.  The project emphasizes modularity with distinct components for image generation, audio processing, and video composition.

## Tech Stack (from code)
- **Language:** Python 3.11 (Dockerfile: `FROM python:3.11-slim`)
- **Framework:** FastAPI (`requirements.txt`: `fastapi>=0.100.0,<1.0.0`) for the API, MoviePy (`requirements.txt`: `moviepy>=2.0.0,<3.0.0`) for video editing.
- **Build System:**  Uses a standard Python virtual environment setup with `venv` (start.sh: `python3 -m venv .venv`). Docker is used for containerization (Dockerfile).
- **Configuration:** Uses JSON files for configuration (`core/config.py`: `CONFIG_FILE = os.path.join(CONFIG_DIR, "config.json")`)

## Public API / Exports
Based on the `server.py` and `core/api` modules, the following endpoints are exposed:
- `/api/tasks/simple` (POST):  Creates a simple video task. (`server.py`: `POST /api/tasks/simple`)
- `/api/tasks/creative` (POST): Creates a creative video task. (`server.py`: `POST /api/tasks/creative`)
- `/api/tasks/manuscript` (POST): Creates a manuscript video task. (`server.py`: `POST /api/tasks/manuscript`)
- `/api/tasks/poetry` (POST): Creates a poetry video task. (`server.py`: `POST /api/tasks/poetry`)
- `/api/tasks` (POST):  A backward compatible endpoint that maps to creative video tasks. (`server.py`: `POST /api/tasks`)
- `/api/config` (POST): Configures the API key. (`core/api/agnes_video.py`)
- `/api/voices` (GET): Retrieves a list of available voices. (`core/audio/voices.py`)
- `/api/tasks` (GET): Lists tasks. (`server.py`: `GET /api/tasks`)

## Dependencies
Based on the `requirements.txt` file:
- `fastapi>=0.100.0,<1.0.0`
- `uvicorn>=0.23.0,<1.0.0`
- `websockets>=12.0,<14.0`
- `requests>=2.28.0,<3.0.0`
- `pydantic>=2.0.0,<3.0.0`
- `PyYAML>=6.0,<7.0`
- `moviepy>=2.0.0,<3.0.0`
- `tenacity>=8.0.0,<10.0.0`
- `python-multipart>=0.0.6,<1.0.0`
- `edge_tts>=6.1.0,<8.0.0`
- `srt>=3.5.0,<4.0.0`

## Architecture Patterns
- **Modular Design:** The codebase is structured into distinct modules (`core/`, `api/`, `audio/`, `compositor/`, `pipelines/`) each responsible for a specific aspect of video generation.
- **Pipeline Pattern:** Video creation is organized as pipelines, allowing for different workflows (simple, creative, manuscript).  (`core/pipelines/*.py`)
- **API Gateway:** FastAPI acts as an API gateway, handling requests and routing them to the appropriate pipeline or service. (`server.py`)
- **Configuration Management:** Configuration parameters are loaded from JSON files, promoting flexibility and ease of customization. (`core/config.py`)

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Automated Content Creation:** The video generation capabilities can be integrated into SEOSONA OS to automatically create promotional videos or educational content based on user input and data.
- **API Integration:**  The existing FastAPI API provides a well-defined interface for integrating the video generation functionality with other SEOSONA OS components.
- **Modular Design:** The modular architecture allows for selective integration of specific components, such as the audio processing or image generation modules, into SEOSONA OS without requiring a full system overhaul.
- **TTS and Subtitle Generation:**  The use of Edge TTS and SRT libraries can be leveraged to enhance SEOSONA OS's accessibility features by automatically generating subtitles for videos.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `moviepy`, `compositor`
- **All scores:** {'seosona-os': 6, 'seosona-video': 44, 'seosona-content': 44, 'seosona-ux-ui': 0, 'seosona-flow': 22}
