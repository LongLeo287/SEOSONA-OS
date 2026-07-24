# KI: kaixxx/noScribe

## Overview
Based on the source code, `noScribe` appears to be a transcription application, likely utilizing Whisper for speech-to-text conversion and potentially incorporating diarization and translation features. The project includes components for building Linux, macOS, and Windows executables, suggesting cross-platform compatibility.  The presence of multiple language files (`.yml`) within the `trans/` directory indicates support for translating transcription output into different languages.

## Tech Stack (from code)
- **Python:** The primary programming language is Python, evidenced by numerous `.py` files and the `requires-python = ">= 3.10"` entry in `pyproject.toml`.
  ```toml
  # File: pyproject.toml
  [project]
  name = "noScribe"
  requires-python = ">= 3.10"
  ```
- **Faster Whisper:** The code explicitly imports and uses the `faster_whisper` library, indicating its use for speech recognition.
  ```python
  # File: faster-whisper-test.py
  from faster_whisper import WhisperModel
  ```
- **PyInstaller:** A build system is used to create executables for different operating systems (Linux, macOS, Windows), as shown in the `pyinstaller/` directory and the `generate_linux_binary.sh` script.
   ```bash
   # File: generate_linux_binary.sh
   pyinstaller noScribe-linux.spec
   ```
- **Docker:** Docker is used for building the Linux binary, as demonstrated in the `Dockerfile` and `generate_linux_binary.sh`.
  ```dockerfile
  # File: Dockerfile
  FROM python:3.10
  ...
  ```

## Public API / Exports
Due to the limited scope of analysis (only source code), it's difficult to definitively determine a public API. However, based on file names and imports, potential exported components include:

- **`noScribe/CTkToolTips.py`:** Likely provides custom tooltip functionality for GUI elements.
- **`noScribe/__main__.py`:**  The entry point of the application.
- **`noScribe/transcription.py`:**  Handles transcription logic, likely containing functions or classes related to processing audio and generating transcripts.
- **`noScribe/utils.py`:** Contains utility functions used throughout the application.

## Dependencies
Dependencies are listed in `environments/requirements_linux.txt`. The exact list can be extracted from this file:
```text
# File: environments/requirements_linux.txt
fastapi
uvicorn
python-dotenv
pydantic
whisper
faster-whisper
torch
torchaudio
pyannote.audio
streamlit
rich
numpy
PyQt6
```

## Architecture Patterns
- **Modular Design:** The project is structured into several directories (`noScribe`, `noScribeEdit`, `prompts`, `pyannote`, `trans`) suggesting a modular design with distinct responsibilities for different components.
- **Configuration Files:**  The use of `.yml` files (e.g., in the `trans/` and `prompts/` directories) indicates configuration is managed through external files, allowing for customization without modifying code.

## Relevance to SEOSONA OS
- **Speech Recognition Integration:** The project's reliance on Whisper could be leveraged within SEOSONA OS for voice commands or dictation features.  The cross-platform nature of the application also makes it suitable for integration across different SEOSONA OS versions and hardware platforms.
- **Transcription Services:** `noScribe`’s transcription capabilities could provide a foundation for building more advanced transcription services within SEOSONA OS, potentially including diarization and translation features. The modular design would allow for selective integration of specific components.
- **GUI Framework:**  The use of PyQt6 suggests potential compatibility with existing GUI elements in SEOSONA OS, allowing for easier integration of `noScribe`'s UI components or leveraging its custom widgets (like `CTkToolTips`).

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 74/100 · **Auto-apply:** True
- **Evidence:** `whisper`, `faster-whisper`, `transcri`
- **All scores:** {'seosona-os': 22, 'seosona-video': 74, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
