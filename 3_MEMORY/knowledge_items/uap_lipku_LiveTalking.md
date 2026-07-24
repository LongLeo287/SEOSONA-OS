# KI: lipku/LiveTalking

## Overview
This project, `LiveTalking`, appears to be a digital human server platform built for creating interactive and personalized virtual avatars. The codebase facilitates real-time communication with these avatars via WebRTC and supports various functionalities like text-to-speech (TTS), speech-to-text (STT), and large language model (LLM) integration, as evidenced by the presence of modules related to these technologies and configuration files for API keys. It also includes features for avatar customization and control, with support for multiple models and rendering techniques.

## Tech Stack (from code)
- **Language:** Python 3.10 (determined from `Dockerfile`: `FROM nerfstream python=3.10`)
- **Framework:** Flask (evident in `app.py`: `from flask import Flask, render_template...`) and aiohttp (`import aiohttp`, `import aiohttp_cors`).
- **Build System:** Conda (used for environment management as shown in the `Dockerfile`'s installation steps).
- **Configuration:** YAML (`import yaml` in `config.py`, usage of `config.yaml`)

## Public API / Exports
Based on the code, particularly `app.py` and `server/routes.py` (not listed but referenced), the following endpoints are likely exposed:
- `/`:  Rendered by Flask (`from flask import render_template`). This is likely a landing page or UI entry point.
- `/static/<path:filename>`: Serves static assets like images and JavaScript files, as indicated by `send_from_directory` in `app.py`.
- WebRTC signaling endpoints (not directly visible but implied by the use of `aiortc` and `RTCPeerConnection`).
- API endpoints for LLM interaction (likely within `llm.py`, although specific routes are not exposed).

## Dependencies
The project's dependencies are listed in `requirements.txt`:
- `python-dotenv`
- `pyyaml`
- `numpy`
- `tqdm`
- `scipy`
- `transformers` (version 4.46.2)
- `edge_tts`
- `flask`
- `opencv-python-headless`
- `aiortc`
- `aiohttp_cors`
- `librosa`
- `openai`
- `websockets` (version 12.0)
- `dashscope`
- `diffusers`
- `accelerate`

## Architecture Patterns
- **Plugin/Extension System:** The `registry.py` file defines a plugin registration system using decorators, allowing for modular extension of the core functionality (e.g., STT, TTS, avatar models). This promotes flexibility and maintainability.
- **Configuration-Driven Design:**  The project heavily relies on configuration files (`config.yaml`, `.env.example`) to manage settings and API keys, enabling customization without modifying code.
- **Asynchronous Programming:** The use of `aiohttp` suggests asynchronous operations for handling network requests and WebRTC connections.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Avatar Integration:**  The avatar rendering pipeline (particularly within the `avatars/` directory) could be adapted to create custom digital human avatars for SEOSONA OS, potentially offering a wider range of personalization options.
- **TTS and STT Capabilities:** The integration with TTS and STT services (currently using edge_tts and other providers) can enhance SEOSONA OS's voice interaction capabilities.  The plugin architecture in `registry.py` would allow for easy swapping of these services.
- **LLM Integration:** The LLM integration (`llm.py`) demonstrates a pattern for incorporating large language models into interactive systems, which could be valuable for building intelligent assistants or conversational interfaces within SEOSONA OS.  The modular design allows for different LLMs to be plugged in easily.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 74/100 · **Auto-apply:** True
- **Evidence:** `asr`, `whisper`, `transcri`
- **All scores:** {'seosona-os': 41, 'seosona-video': 74, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
