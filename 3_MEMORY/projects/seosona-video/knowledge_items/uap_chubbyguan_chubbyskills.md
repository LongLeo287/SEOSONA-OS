# KI: chubbyguan/chubbyskills

## Overview
This project, Chubby Skills, appears to be a system for ingesting, transcribing, and enriching content from various online platforms like Bilibili, Douyin, YouTube, WeChat, Weibo, X (Twitter), and Xiaohongshu. The code includes scripts for fetching data, performing transcriptions using models like Funasr and Faster Whisper, and managing a knowledge vault.  The project aims to automate the process of collecting and organizing information from these sources.

## Tech Stack (from code)
- **Python:** The primary language is Python, evidenced by the numerous `.py` files throughout the repository (e.g., `bilibili-transcribe/scripts/transcribe.py`, `tools/chubby.py`).
- **YAML:** Configuration files are used extensively in YAML format (e.g., `chubby.example.yaml`, `platforms/*.yaml`), indicating its use for defining pipelines and platform configurations.
- **Bash:** A setup script (`setup.sh`) is provided, suggesting the usage of Bash for installation and environment configuration.
- **Dependencies:** The `requirements.txt` file (https://github.com/chubbyguan/chubbyskills/blob/main/requirements.txt) lists Python dependencies like `funasr`, `modelscope`, `torch`, `torchaudio`, `beautifulsoup4`, and `faster-whisper`.

## Public API / Exports
Due to the nature of this project (primarily scripts and configuration), there's no readily apparent public API in the traditional sense. However, several key functions are exposed within the Python scripts:

- **`chubby.py`**: This file likely serves as a central orchestration point. While its contents aren’t fully visible without more context, its name suggests it might be an entrypoint or main script for running the Chubby Skills system.
- **`tools/check_env.py`**:  This script is used to check the environment and dependencies (as seen in `setup.sh`).
- **Transcription Scripts:** Each transcription directory (`bilibili-transcribe`, `douyin-transcribe`, etc.) contains a `transcribe.py` script, which likely handles the core transcription logic for that platform.  For example: https://github.com/chubbyguan/chubbyskills/blob/main/bilibili-transcribe/scripts/transcribe.py
- **Ingest Scripts:** Similar to transcription scripts, directories like `wechat-article-ingest` and `x-ingest` contain scripts (e.g., `extract.py`, `fetch_tweet.py`) for fetching content from specific platforms.

## Dependencies
Based on the `requirements.txt` file:
- `funasr>=1.0.0`: For speech recognition.
- `modelscope>=1.10.0`:  Likely used for model loading and inference.
- `torch>=2.0.0`, `torchaudio>=2.0.0`: PyTorch and Torchaudio for deep learning tasks.
- `faster-whisper>=0.10.0`: Another speech recognition library, potentially used in conjunction with Funasr.
- `beautifulsoup4>=4.12.0`: For parsing HTML content (likely used in the WeChat article ingest).
- `markitdown>=0.0.1`:  For Markdown processing.
- `pymupdf>=1.23.0`: For PDF handling (used in the WeChat article ingest).

## Architecture Patterns
- **Modular Design:** The project is structured into distinct directories, each responsible for a specific platform or task (e.g., `bilibili-transcribe`, `wechat-article-ingest`). This promotes code reusability and maintainability.
- **Script-Based Automation:**  The core logic is implemented in Python scripts, suggesting an automated workflow driven by these scripts.
- **Configuration-Driven:** The use of YAML files for configuration allows for flexibility and customization of the ingestion and transcription processes.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Content Ingestion Pipeline:**  The platform-specific ingest scripts (e.g., for YouTube, Twitter) can be adapted to feed content into SEOSONA OS’s knowledge base.
- **Transcription Services:** The transcription logic using Funasr and Faster Whisper could be integrated as a core component of SEOSONA OS's audio processing capabilities.
- **Knowledge Vault Management:**  The vault structure and potentially the `vault_curator.py` script (https://github.com/chubbyguan/chubbyskills/blob/main/tools/vault_curator.py) could provide a foundation for managing SEOSONA OS’s knowledge repository.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 98/100 · **Auto-apply:** True
- **Evidence:** `asr`, `whisper`, `faster-whisper`, `transcri`
- **All scores:** {'seosona-os': 44, 'seosona-video': 98, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
