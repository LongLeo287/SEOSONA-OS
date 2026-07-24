# KI: hans1801/hans-n8n

## Overview
This repository appears to be a collection of pre-built n8n workflows and Docker configurations for various integrations, primarily focused on YouTube (YT) automation tasks like video processing, transcription, and chatbot interactions. The project provides ready-to-use solutions for integrating services such as Chatwoot, Evolution API, and utilizing technologies like Redis and PgVector within the n8n environment.  The workflows are designed to automate common tasks related to content creation and management.

## Tech Stack (from code)
*   **Python:** A `Dockerfile` is present in the `services/n8n-whisper-ffmpeg/whisper` directory, containing a line: `COPY app.py .`. This indicates Python usage for the Whisper application.  (File path: `services/n8n-whisper-ffmpeg/whisper/Dockerfile`)
*   **Docker:** Numerous `docker-compose.yml` files are present across various directories (e.g., `in_progress/n8n-redis-pgvector`, `services/chatwoot`, `services/full-n8n-redis-pgvector`). This signifies the use of Docker for containerization and deployment.
*   **n8n:** The project heavily revolves around n8n, a visual workflow automation platform.  The presence of numerous `.json` files (e.g., `services/chatwoot/n8n/Asistente personal.json`, `workflows/basic-short-automation/YT - Basic Video Automation.json`) confirms this.
*   **Bash:** Shell scripts are used for setup and configuration, as evidenced by files like `certify_domain.sh` in several service directories (e.g., `services/chatwoot`, `services/evolution-api`).

## Public API / Exports
Due to the nature of this repository being primarily workflow definitions and Docker configurations, there are no explicitly exported functions or APIs directly visible within the code. The `.json` files represent n8n workflows which *define* a series of actions that can be executed by the n8n engine.  These workflows effectively act as "public" interfaces for specific automation tasks when deployed within an n8n instance.

## Dependencies
Dependencies are not explicitly listed in any `package.json`, `requirements.txt` or similar file. The Dockerfiles and docker-compose files *imply* dependencies, but a full dependency list cannot be derived without further analysis of the services being containerized.  For example, the `Dockerfile` for Whisper likely has Python package dependencies that are not visible from this code snapshot.

## Architecture Patterns
*   **Modular Design:** The project is organized into directories representing different integrations and functionalities (e.g., Chatwoot, FFmpeg, Redis). This suggests a modular approach to building automation workflows.
*   **Configuration as Code:**  Docker Compose files and shell scripts are used to define infrastructure and setup procedures, demonstrating configuration-as-code principles.
*   **Workflow-Based Automation:** The core pattern is the creation of n8n workflows defined in `.json` files that orchestrate a sequence of actions.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by providing pre-built automation workflows for common content management and social media tasks, particularly those involving YouTube video processing and chatbot interactions. The Docker configurations can simplify the deployment of these integrations within a containerized environment on SEOSONA OS.  The modular design allows for selective integration of specific functionalities based on SEOSONA OS's needs. Specifically:

*   **Automated Video Processing:** Workflows like those in `ffmpeg-basics` could be integrated to automate video editing, combining, and conversion tasks within the SEOSONA OS ecosystem.
*   **Chatbot Integration:** The Chatwoot workflows demonstrate how to build automated chatbot interactions for content promotion or customer support, which can enhance user engagement on SEOSONA OS.
*   **Containerized Deployment:**  The Docker configurations provide a standardized way to deploy these integrations within the SEOSONA OS infrastructure, ensuring consistency and ease of management.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `gemini`, `rag`, `vector`
- **All scores:** {'seosona-os': 61, 'seosona-video': 49, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 28}
