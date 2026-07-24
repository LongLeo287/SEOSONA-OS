# KI: bradautomates/claude-video

## Overview
This repository contains a "watch" skill for Claude, designed to process video URLs or file paths. The skill leverages `yt-dlp` and `ffmpeg` for downloading and frame extraction, with an optional Whisper API integration for transcription.  The project emphasizes portability across different agent platforms like Claude Code, Codex, and Cursor.

## Tech Stack (from code)
- **Python:**  Evidence: Numerous `.py` files exist throughout the repository (e.g., `skills/watch/scripts/download.py`, `skills/watch/scripts/transcribe.py`).
- **Bash:** Evidence: Shell scripts are used for build and synchronization tasks (`build-skill.sh`, `dev-sync.sh`).
- **JSON:**  Evidence: Multiple `.json` files define plugin manifests and configuration (e.g., `.claude-plugin/plugin.json`, `.agents/plugins/marketplace.json`).
- **Pytest:** Evidence: The presence of a `tests/` directory suggests the use of Pytest for testing, although specific test file contents are not provided.

## Public API / Exports
Due to the lack of readily available entry points (e.g., exposed HTTP endpoints or CLI commands), identifying a clear public API is difficult based solely on the code. The primary "export" appears to be the `/watch` slash command within Claude, which is derived from `SKILL.md` frontmatter (`name: watch`).  The core functionality is orchestrated through `skills/watch/scripts/watch.py`.

## Dependencies
- **yt-dlp:** Referenced in comments and code (e.g., `skills/watch/scripts/download.py`) as a key component for video downloading.
- **ffmpeg:** Used extensively for frame extraction, as evidenced by the `frames.py` script (`skills/watch/scripts/frames.py`).
- **Whisper API:**  Mentioned in `AGENTS.md` and utilized within `transcribe.py` (`skills/watch/scripts/transcribe.py`) for optional transcription capabilities.
- **Python Standard Library:** The project explicitly states it uses "Pure-stdlib Python" (from `AGENTS.md`).

## Architecture Patterns
- **Plugin-Based Architecture:**  The code heavily relies on a plugin architecture, with separate manifests and configurations for different platforms (Claude Code, Codex). This is evident in the `.claude-plugin/`, `.codex-plugin/` and `.agents/plugins/` directories.
- **Skill Contract:** The `SKILL.md` file acts as a central contract defining the skill's behavior, promoting consistency across different environments (as described in `AGENTS.md`).
- **Modular Scripting:**  The core functionality is broken down into smaller, modular Python scripts (`download.py`, `frames.py`, `transcribe.py`), enhancing maintainability and testability.

## Relevance to SEOSONA OS
This project's emphasis on portability and its plugin-based architecture could be beneficial for SEOSONA OS. The skill’s design – separating core logic from platform-specific details – aligns with a modular, extensible system.  The use of standard tools like `yt-dlp` and `ffmpeg` also suggests compatibility with existing infrastructure. However, the reliance on Claude-specific features (slash commands) would need to be adapted for SEOSONA OS's specific execution environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 49, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
