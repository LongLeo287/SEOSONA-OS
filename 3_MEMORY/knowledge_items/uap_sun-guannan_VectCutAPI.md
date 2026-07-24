# KI: sun-guannan/VectCutAPI

## Overview
This project, `CapCutAPI`, provides an open-source API tool designed to interact with CapCut video editing functionality and potentially Jianying (a related platform). The codebase includes modules for creating drafts, adding various media elements like audio, video, text, images, stickers, and effects, as well as saving and uploading these drafts.  It appears to be built to automate or programmatically control aspects of the CapCut/Jianying editing process.

## Tech Stack (from code)
- **Python:** The primary language used throughout the codebase (e.g., `add_audio_track.py`, `create_draft.py`).
- **Flask:** Used for creating a web API endpoint (`capcut_server.py` imports `flask`).
- **FastAPI & Uvicorn**: Listed as dependencies in `pyproject.toml`.
- **Setuptools:**  Used as the build backend (defined in `pyproject.toml`).
- **JSON5:** Used for parsing JSON files, indicated by its presence in `requirements.txt`.

```toml
# pyproject.toml
[project]
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.100.0",
    "uvicorn[standard]>=0.23.0",
]
```

## Public API / Exports
Based on the `capcut_server.py` file, which appears to be the main entry point for the API, the following endpoints are exposed:

- `/add_video`:  Handles adding video tracks (defined in `capcut_server.py`).
- Other functions like `add_audio_track`, `add_text_impl`, etc., are called by the server and therefore represent functionality exposed through the API. These are imported into `capcut_server.py`.

```python
# capcut_server.py
@app.route('/add_video', methods=['POST'])
def add_video():
    ...
```

## Dependencies
- **imageio:** For image processing (listed in `requirements.txt`).
- **psutil:**  For process monitoring (listed in `requirements.txt`).
- **flask:** Web framework (listed in `requirements.txt`).
- **requests:** For making HTTP requests (listed in `requirements.txt` and used extensively).
- **oss2:** For interacting with Alibaba Cloud OSS storage (listed in `requirements.txt`).
- **json5:**  For parsing JSON files (listed in `requirements.txt`).
- **mcp, aiohttp, websockets, jsonrpc-base, jsonrpc-websocket, jsonrpc-async**: Dependencies for MCP support (defined in `pyproject.toml` under the `mcp` section).

```text
# requirements.txt
imageio
psutil
flask
requests
oss2
json5
```

## Architecture Patterns
- **Modular Design:** The codebase is organized into modules like `add_audio_track.py`, `add_video_track.py`, and `create_draft.py`, each responsible for a specific task.
- **Configuration-Driven:**  Settings such as API keys, endpoints, and file paths are likely stored in configuration files (e.g., `settings/local.py`).
- **Cache Management:** The use of `draft_cache.py` and `DRAFT_CACHE` suggests a caching mechanism to improve performance and reduce load on the underlying CapCut/Jianying systems.  An LRU cache is implemented.
- **Abstraction Layers:** The code uses abstractions like `pyJianYingDraft` which likely provides a unified interface for interacting with different video editing platforms (CapCut and Jianying).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:

- **Automated Video Editing Workflows:** The API can be integrated into SEOSONA OS to automate video creation or modification tasks, such as generating promotional videos or creating content for social media.
- **Cloud Storage Integration:**  The `oss2` dependency and related code demonstrate integration with Alibaba Cloud OSS. This could be adapted to integrate with other cloud storage providers used by SEOSONA OS.
- **Cross-Platform Compatibility:** The abstraction layer provided by `pyJianYingDraft` suggests the potential for supporting multiple video editing platforms, which could be valuable if SEOSONA OS needs to work across different environments.
- **Task Scheduling and Management:**  The `save_draft_impl.py` file includes background task processing logic that could be adapted for managing other asynchronous tasks within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `workflow`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 28, 'seosona-content': 33, 'seosona-ux-ui': 22, 'seosona-flow': 28}
