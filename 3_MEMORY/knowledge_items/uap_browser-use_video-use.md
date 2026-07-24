# KI: browser-use/video-use

## Overview
This project, named "video-use," appears to be a skill for Claude Code designed as a conversation-driven video editor. The `pyproject.toml` file indicates it's intended to leverage external APIs (likely for audio processing and potentially video generation) and may utilize the Manim animation library.  The presence of scripts like `transcribe.py` and `pack_transcripts.py` suggests a workflow involving transcription and packaging of transcripts.

## Tech Stack (from code)
- **Language:** Python (specified in `pyproject.toml`: `requires-python = ">=3.10"`)
- **Build System:** Setuptools (defined in `pyproject.toml`: `build-backend = "setuptools.build_meta"`)
- **Dependencies:**  `pyproject.toml` lists dependencies including `requests`, `librosa`, `matplotlib`, `pillow`, and `numpy`. The optional dependency `manim` suggests animation capabilities.

## Public API / Exports
Due to the limited code provided, it's impossible to determine the public API or exported functions/classes definitively.  The presence of files like `transcribe.py` and `pack_transcripts.py` *suggests* these might contain functions intended for use within a larger system, but without seeing their contents, this is speculative.

## Dependencies
Based on the `pyproject.toml` file:
- requests
- librosa
- matplotlib
- pillow
- numpy
- manim (optional)

## Architecture Patterns
Without access to the content of the Python files in the `helpers/` and `skills/manim-video/scripts/` directories, it's difficult to identify specific architectural patterns. The directory structure suggests a modular design with separate components for grading (`grade.py`), transcript processing (`transcribe.py`, `pack_transcripts.py`), rendering (`render.py`), and timeline view (`timeline_view.py`).  The use of Manim implies an animation pipeline, which likely involves scene setup, object creation, and rendering steps.

## Relevance to SEOSONA OS
The project's focus on video editing and transcription could be beneficial for SEOSONA OS in several ways:
- **Automated Video Generation:** The integration with Manim suggests the potential for automated generation of instructional or explanatory videos based on text input. This could be used to create tutorials, demonstrations, or other content for users.
- **Transcription Services:**  The `transcribe.py` script indicates transcription capabilities which can be integrated into SEOSONA OS for creating subtitles, searchable transcripts, and improving accessibility.
- **Audio Processing:** The use of `librosa` suggests audio processing functionality that could be leveraged for tasks such as noise reduction, speech enhancement, or music analysis within the OS.





## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 24, 'seosona-content': 33, 'seosona-ux-ui': 22, 'seosona-flow': 0}
