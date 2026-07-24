# KI: Upload-Post/skill-autoshorts

## Overview
This project, named "skill-autoshorts," is a command-line tool designed for creating viral video clips from longer videos. It automates tasks such as transcription using Whisper, clip selection via Gemini AI, extraction of short segments with overlays, and publishing to platforms like TikTok/Instagram/YouTube through the Upload-Post API. The script manages state and learning data related to post performance and candidate selections.

## Tech Stack (from code)
- **Language:** Python 3 (`#!/usr/bin/env python3` in `autoshorts.py`)
- **Framework/Libraries:**  The code utilizes the `dotenv` library for environment variable management, `argparse` for command-line argument parsing, and `pathlib` for path manipulation. It also uses `subprocess` to execute external commands like FFmpeg. The presence of `google-genai` indicates integration with Google's Gemini AI models.
- **Configuration:** Environment variables are loaded from `.env` files (as seen in the `load_dotenv(ROOT / ".env")` line in `autoshorts.py`).  Dependencies are listed in `requirements.txt`.

## Public API / Exports
The script defines a command-line interface with subcommands, effectively acting as an exported API for its functionality:
- `pick`: Selects the next video to process.
- `transcribe <video>`: Transcribes a video using Whisper.
- `analyze <video>`: Analyzes a video using Gemini AI for clip selection.
- `extract <video>`: Extracts a single clip from a video.
- `hook <video>`: Adds text overlays to a video clip.
- `preview <video>`: Generates a preview frame of a video.
- `publish <video>`: Uploads the processed video via the Upload-Post API.
- `mark-processed <video>`: Marks a video as processed.
- `list-processed`: Lists processed videos.
- `learn`:  Performs weekly analytics and refreshes HOT.md.
- `reflect`: Extracts qualitative patterns from approved vs rejected hooks.

These subcommands are defined within the docstring of `autoshorts.py`.

## Dependencies
The following dependencies are listed in `requirements.txt`:
- `faster-whisper>=1.0.3`
- `google-genai>=0.8.0`
- `requests>=2.32.0`
- `python-dotenv>=1.0.1`
- `Pillow>=10.0.0`

## Architecture Patterns
- **Command-Line Interface (CLI):** The script is structured as a CLI tool with subcommands, utilizing `argparse`.
- **Configuration via Environment Variables:**  The application relies heavily on environment variables for configuration, managed by the `dotenv` library. This promotes flexibility and avoids hardcoding sensitive information.
- **Modular Design:** The code appears to be organized into functions (e.g., `append_jsonl`, `read_jsonl`, `sha256_of`), suggesting a modular design approach.
- **State Management:**  The script maintains state using JSON files (`processed.json`) within a dedicated "state" directory, indicating persistence and tracking of processed videos.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Automated Content Creation Pipeline:** The core functionality of automatically generating short video clips from longer content aligns with potential use cases within SEOSONA OS for creating engaging social media snippets.
- **Integration with AI Models:**  The integration with Whisper and Gemini demonstrates a capability to leverage AI for transcription, analysis, and creative tasks that could be incorporated into SEOSONA OS workflows.
- **Upload Automation:** The Upload-Post API integration provides a mechanism for automated content publishing, which is valuable for maintaining a consistent social media presence within SEOSONA OS.
- **Learning & Analytics:**  The "learn" subcommand and associated data storage (metrics, post history) suggest a focus on performance analysis and optimization – features that could be adapted to improve the effectiveness of content creation strategies in SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 49/100 · **Auto-apply:** True
- **Evidence:** `whisper`, `faster-whisper`
- **All scores:** {'seosona-os': 41, 'seosona-video': 49, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
