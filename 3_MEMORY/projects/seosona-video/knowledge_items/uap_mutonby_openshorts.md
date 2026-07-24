# KI: mutonby/openshorts

OpenShorts is an AI-powered platform designed to transform long YouTube videos or local uploads into short, vertical video clips optimized for platforms like TikTok and Instagram Reels. The system leverages various AI models (Gemini, faster-whisper) for tasks such as clip selection, transcription, and voiceover generation, along with FFmpeg for video editing and rendering. It includes a dashboard interface for managing jobs and viewing results.

## Tech Stack (from code)

*   **Python:** The core backend logic is written in Python (`app.py`, `main.py`, `clip_selection.py`).
    ```text
    # File: app.py
    import os
    import re
    import sys
    import uuid
    ...
    ```
*   **FastAPI:** The backend API is built using FastAPI (`app.py`).
    ```text
    # File: app.py
    from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, Header, BackgroundTasks
    ```
*   **JavaScript/React:**  The dashboard frontend is a React application (`dashboard/src/App.jsx`, `package.json`).
    ```text
    # File: dashboard/package.json
    {
      "name": "openshorts-dashboard",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
        "@vitejs/plugin-react": "^4.2.1",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        ...
      },
    }
    ```
*   **Dockerfile:** Used for containerization, specifying Python 3.11 and dependencies (`Dockerfile`).
    ```text
    # File: Dockerfile
    FROM python:3.11-slim AS builder

    WORKDIR /app
    ```
*   **Node.js/npm:** Used for frontend build tools and some backend utilities (`package.json`, `docker-compose.yml`).
    ```text
    # File: docker-compose.yml
    services:
      frontend:
        build:
          context: ./dashboard
          target: dev
        container_name: openshorts-frontend
        ports:
          - "5175:5173"
        volumes:
          - ./dashboard:/app
          - /app/node_modules
        restart: unless-stopped
        depends_on:
          - backend
    ```

## Public API / Exports

*   **FastAPI Endpoints:** The `app.py` file defines FastAPI endpoints, although the specific routes are not fully exposed in this code snippet.  The presence of `FastAPI` and related imports indicates a RESTful API is provided.
    ```text
    # File: app.py
    from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, Header, BackgroundTasks
    app = FastAPI() # This line creates the FastAPI instance
    ```

## Dependencies

*   **Python Packages:** Listed in `requirements.txt`:
    ```text
    # File: requirements.txt
    scenedetect==0.7
    transnetv2-pytorch==1.0.5
    ultralytics==8.4.46
    torch==2.11.0
    torchvision==0.26.0
    tqdm==4.67.3
    yt-dlp
    faster-whisper==1.2.1
    py3langid==0.3.0
    google-genai==1.75.0
    python-dotenv==1.2.2
    mediapipe==0.10.14
    boto3==1.43.4
    fastapi==0.136.1
    uvicorn==0.46.0
    python-multipart==0.0.27
    httpx==0.28.1
    Pillow==12.2.0
    beautifulsoup4==4.14.3
    ```
*   **JavaScript Packages:** Listed in `dashboard/package.json`: Includes React, Vite, and various UI libraries.

## Architecture Patterns

*   **Microservices (loosely):** The project uses Docker Compose to define multiple services (`backend`, `frontend`, `renderer`), suggesting a microservice-like architecture although the level of independence isn't fully apparent from this code.
    ```text
    # File: docker-compose.yml
    services:
      backend:
        build: .
        container_name: openshorts-backend
        ports:
          - "8000:8000"
      frontend:
        build:
          context: ./dashboard
          target: dev
        container_name: openshorts-frontend
    ```
*   **Asynchronous Task Queue:** The backend uses `BackgroundTasks` in FastAPI, indicating asynchronous job processing.
    ```text
    # File: app.py
    from fastapi import BackgroundTasks
    ...
    background_tasks = BackgroundTasks()
    ```
*   **Environment Variable Configuration:**  The project heavily relies on environment variables for configuration (e.g., API keys, database URLs) as defined in `.env.example`.

## Relevance to SEOSONA OS

*   **AI-Powered Video Generation:** The core functionality of automatically generating short videos from longer content aligns with potential use cases within SEOSONA OS.
*   **Transcription and Analysis:**  The integration of transcription (faster-whisper) and AI analysis (Gemini) could be leveraged for automated content summarization or keyword extraction in SEOSONA OS workflows.
*   **Modular Architecture:** The microservice architecture allows for potential integration of specific components into the broader SEOSONA OS ecosystem. For example, the video rendering service (`renderer`) could be adapted to handle different output formats or platforms.
*   **Dependency Management:**  The clear dependency lists (requirements.txt, package.json) facilitate understanding and potentially reusing libraries within SEOSONA OS projects.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 66/100 · **Auto-apply:** True
- **Evidence:** `whisper`, `faster-whisper`, `transcri`
- **All scores:** {'seosona-os': 34, 'seosona-video': 66, 'seosona-content': 34, 'seosona-ux-ui': 12, 'seosona-flow': 0}
