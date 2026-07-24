# KI: SamurAIGPT/AI-Youtube-Shorts-Generator

## Overview
This project is a command-line tool for generating YouTube Shorts from longer videos. It downloads video content, transcribes audio, identifies highlights, and creates short clips with titles and hooks. The application supports both an API mode (using MuAPI) and a local mode leveraging faster-whisper and LLM providers.

## Tech Stack (from code)
- **Language:** Python 3 (evident from `main.py`: `python main.py ...`)
- **Framework/Libraries:**  `argparse` is used for command-line argument parsing (`main.py`: `parser = argparse.ArgumentParser(...)`). The project utilizes the `requests` library for HTTP requests, as indicated in `requirements.txt`. It also uses `python-dotenv` to load environment variables from a `.env` file (also listed in `requirements.txt`).
- **Configuration:** Environment variables are used for configuration, as demonstrated by the `.env.example` file.

## Public API / Exports
The primary entry point is the `main()` function within `main.py`:
```python
# main.py
def main() -> int:
    ...
```
The `generate_shorts` function in `shorts_generator/generate_shorts` appears to be a core component, called from `main.py`.  It is not directly exported but is used internally within the project.

## Dependencies
Based on `requirements.txt`:
- `requests>=2.31`: For making HTTP requests.
- `python-dotenv>=1.0`: For loading environment variables.

## Architecture Patterns
- **Command-Line Interface (CLI):** The application is designed as a CLI tool, using `argparse` to handle command-line arguments and options.
- **Modular Design:**  The code is structured into several modules within the `shorts_generator/` directory (`clipper.py`, `config.py`, `downloader.py`, `highlights.py`, `muapi.py`, `pipeline.py`, `transcriber.py`), suggesting a modular approach to different aspects of the short generation process (downloading, transcription, highlight selection, etc.).
- **Configuration via Environment Variables:** The project uses environment variables for configuration, allowing flexibility in deployment and customization without modifying code directly (`.env.example`).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by providing a reusable component for automated video content creation. Specifically:
- **Video Summarization/Short Generation:** The core functionality of generating short clips from longer videos can be integrated into SEOSONA OS workflows for creating promotional materials, educational snippets, or social media content.
- **Transcription and Highlight Extraction:**  The transcription and highlight extraction components could be leveraged to improve searchability and accessibility within SEOSONA OS's video management system. The `transcriber.py` and `highlights.py` files would be particularly useful.
- **CLI Tool Integration:** The CLI nature of the tool makes it easy to integrate into automated scripts and pipelines within SEOSONA OS, allowing for batch processing of videos.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 6/100 · **Auto-apply:** False
- **Evidence:** `llm`
- **All scores:** {'seosona-os': 6, 'seosona-video': 6, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 6}
