# KI: crisng95/flowkit

## Overview
Repository with 243 files across 34 directories. Primary language: Python (65 files).

## Tech Stack (from code)
- Python (65 files)
- TypeScript (React) (13 files)
- JavaScript (6 files)
- TypeScript (4 files)
- Shell (2 files)
- **Total:** 243 files, 34 directories
- **File types:** .md: 76, .py: 65, .jpg: 31, .json: 30, .tsx: 13, .js: 6, .html: 4, .ts: 4

## Public API / Exports
- `discover_skills` from `setup.py`
- `generate_claude` from `setup.py`
- `generate_gemini` from `setup.py`

## Dependencies

### Python Dependencies (from requirements.txt)
- `fastapi>=0.104.0`
- `uvicorn>=0.24.0`
- `aiosqlite>=0.19.0`
- `websockets>=12.0`
- `pydantic>=2.5.0`
- `aiohttp>=3.9.0`
- `httpx>=0.25.0`
- `anthropic>=0.40.0`

## Imports Detected in Source
- `agent`
- `argparse`
- `asyncio`
- `contextlib`
- `datetime`
- `fastapi`
- `json`
- `logging`
- `os`
- `pathlib`
- `signal`
- `sys`
- `websockets`

## File Structure
```
  .gitignore
  AGENTS.md
  ARCHITECTURE.md
  CLAUDE.md
  GEMINI.md
  LICENSE
  PLAN.md
  README.md
  pytest.ini
  requirements.txt
  setup.py
  setup.sh
  .claude/
    commands/
      fk-add-material.md
      fk-brand-logo.md
      fk-camera-guide.md
      fk-change-model.md
      fk-concat-fit-narrator.md
      fk-concat.md
      fk-create-project.md
      fk-creative-mix.md
      fk-dashboard.md
      fk-doctor.md
      fk-fix-uuids.md
      fk-gen-chain-videos.md
      fk-gen-images.md
      fk-gen-music.md
      fk-gen-narrator.md
      fk-gen-refs.md
      fk-gen-text-overlays.md
      fk-gen-tts-template.md
      fk-gen-videos.md
      fk-import-voice.md
      fk-insert-scene.md
      fk-monitor.md
      fk-pipeline.md
      fk-refresh-urls.md
      fk-research.md
      fk-review-board.md
      fk-review-video.md
      fk-status.md
      fk-switch-project.md
      fk-thumbnail-guide.md
      fk-thumbnail.md
      fk-upload-image.md
      fk-youtube-seo.md
      fk-youtube-upload.md
  agent/
    __init__.py
    config.py
    main.py
    materials.py
    models.json
    api/
      __init__.py
      active_project.py
      characters.py
      flow.py
      materials.py
      models.py
      music.py
      projects.py
      requests.py
      reviews.py
      scenes.py
      tts.py
      videos.py
    db/
      __init__.py
      crud.py
      schema.py
    models/
      __init__.py
      character.py
      enums.py
      material.py
      project.py
      request.py
      review.py
      scene.py
      tts.py
      video.py
    sdk/
      __init__.py
      repository.py
      models/
        __init__.py
        base.py
        character.py
        enums.py
        media.py
        project.py
        scene.py
        video.py
      persistence/
        __init__.py
        base.py
        sqlite_repository.py
      services/
        __init__.py
        media_resolver.py
        operations.py
        queue.py
        result_handler.py
    services/
      __init__.py
 
```

## Key Source Excerpts
### setup.py
```python
#!/usr/bin/env python3
"""
Flow Kit — AI Tool Setup
Generates AI tool configs from skills/fk:*.md (single source of truth).

Usage:
    python setup.py                  # Interactive: pick your AI tool(s)
    python setup.py --tool claude    # Generate for Claude
    python setup.py --tool gemini    # Generate for Gemini
    python setup.py --tool codex     # Generate for Codex
    python setup.py --tool all       # Generate for all tools
    python setup.py sync             # Re-sync all previously selected tools
    python setup.py clean            # Remove all generated tool configs
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent
SKILLS_DIR = ROOT / "skills"
CLAUDE_COMMANDS_DIR = ROOT / ".claude" / "commands"
GEMINI_COMMANDS_DIR = ROOT / ".gemini" / "commands" / "fk"
AGENTS_MD = ROOT / "AGENTS.md"
GEMINI_MD = ROOT / "GEMINI.md"
STATE_FILE = ROOT / ".fk-setup.json"


def discover_skills():
    """Scan skills/fk:*.md and extract name + first-line description."""
    if not SKILLS_DIR.exists():
        print(f"ERROR: skills/ directory not found at {SKILLS_DIR}")
        return []

    skills = []
    for path in sorted(SKILLS_DIR.glob("fk:*.md")):
        name = path.stem[len("fk:"):]  # strip "fk:" prefix
        description = ""
        try:
            first_line = path.read_text(encoding="utf-8").splitlines()[0].strip()
            # Strip leading markdown heading markers
          
```

### agent\__init__.py
```python
# google-flow-agent

```

### agent\config.py
```python
"""Configuration constants."""
import json
import os
from pathlib import Path

# ─── Paths ───────────────────────────────────────────────────
BASE_DIR = Path(os.environ.get("FLOW_AGENT_DIR", Path(__file__).parent.parent))
DB_PATH = BASE_DIR / "flow_agent.db"

# ─── API Server ──────────────────────────────────────────────
API_HOST = os.environ.get("API_HOST", "127.0.0.1")
API_PORT = int(os.environ.get("API_PORT", "8100"))

# ─── WebSocket Server (extension connects here) ─────────────
WS_HOST = os.environ.get("WS_HOST", "127.0.0.1")
WS_PORT = int(os.environ.get("WS_PORT", "9222"))

# ─── Google Flow API ────────────────────────────────────────
GOOGLE_FLOW_API = "https://aisandbox-pa.googleapis.com"
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "REDACTED_GOOGLE_API_KEY")
RECAPTCHA_SITE_KEY = os.environ.get("RECAPTCHA_SITE_KEY", "REDACTED_RECAPTCHA_KEY")

# ─── Worker ──────────────────────────────────────────────────
POLL_INTERVAL = int(os.environ.get("POLL_INTERVAL", "5"))
VIDEO_POLL_INTERVAL = int(os.environ.get("VIDEO_POLL_INTERVAL", "10"))  # polling interval for video/upscale status
MAX_RETRIES = int(os.environ.get("MAX_RETRIES", "5"))
VIDEO_POLL_TIMEOUT = int(os.environ.get("VIDEO_POLL_TIMEOUT", "420"))
API_COOLDOWN = int(os.environ.get("API_COOLDOWN", "10"))  # seconds between API calls (anti-spam)
MAX_CONCURRENT_REQUESTS = int(os.environ.get("MAX_CONCURRENT_REQUESTS", "5"))  # Google Flow max parallel requests
STALE_PROCESSING_TIM
```

## Agent Configuration
### AGENTS.md
<!-- AUTO-GENERATED by setup.py — do not edit. Source: skills/ -->
# Google Flow Agent — Codex CLI Instructions

Base URL: `http://127.0.0.1:8100`

## Pre-flight

Before ANY workflow:
```bash
curl -s http://127.0.0.1:8100/health
# Must return: {"extension_connected": true}
```

## Critical Rules (MUST follow)

1. **Media ID is always UUID** — format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Never use `CAMS...` / base64 strings.
2. **Scene prompts = ACTION only** — never describe character appearance. Reference images handle visual consistency via `imageInputs`.
3. **All reference images must exist before scene images** — verify every entity has `media_id` before generating scene images.
4. **No throwaway scripts** — NEVER write Python, shell, or any script file to loop over API requests. Use `POST /api/requests/batch` to submit all requests at once, then poll `GET /api/requests/batch-status`. The server throttles automatically.
5. **Locations use landscape, characters use portrait** — reference image orientation depends on entity type.
6. **UUID extraction** — if a response gives `CAMS...` instead of UUID, extract UUID from the `fifeUrl` in the response URL: `/image/{UUID}?...`.
7. **Cascade on regen** — regenerating an image auto-clears downstream video + upscale.
8. **REGENERATE vs GENERATE** — `GENERATE_*` skips if already COMPLETED. `REGENERATE_*` always runs (clears + regenerates).
9. **Image Material required** — every project needs a `material` field (e.g. `realistic`, `

### GEMINI.md
<!-- AUTO-GENERATED by setup.py — do not edit. Source: skills/ -->
# Google Flow Agent — Gemini CLI Instructions

Base URL: `http://127.0.0.1:8100`

## Pre-flight

Before ANY workflow:
```bash
curl -s http://127.0.0.1:8100/health
# Must return: {"extension_connected": true}
```

## Critical Rules (MUST follow)

1. **Media ID is always UUID** — format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Never use `CAMS...` / base64 strings.
2. **Scene prompts = ACTION only** — never describe character appearance. Reference images handle visual consistency via `imageInputs`.
3. **All reference images must exist before scene images** — verify every entity has `media_id` before generating scene images.
4. **No throwaway scripts** — NEVER write Python, shell, or any script file to loop over API requests. Use `POST /api/requests/batch` to submit all requests at once, then poll `GET /api/requests/batch-status`. The server throttles automatically.
5. **Locations use landscape, characters use portrait** — reference image orientation depends on entity type.
6. **UUID extraction** — if a response gives `CAMS...` instead of UUID, extract UUID from the `fifeUrl` in the response URL: `/image/{UUID}?...`.
7. **Cascade on regen** — regenerating an image auto-clears downstream video + upscale.
8. **REGENERATE vs GENERATE** — `GENERATE_*` skips if already COMPLETED. `REGENERATE_*` always runs (clears + regenerates).
9. **Image Material required** — every project needs a `material` field (e.g. `realistic`, 

### CLAUDE.md
# Flow Kit

Base URL: `http://127.0.0.1:8100`

## Pre-flight

```bash
curl -s http://127.0.0.1:8100/health
# Must return: {"extension_connected": true}
```

## How to work

- Always use `/fk:*` skills — all rules and workflows live inside each skill
- Never write scripts to loop API calls — use `POST /api/requests/batch`
- `media_id` is always UUID format (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`), never `CAMS...` strings
- **On any pipeline error** (request `FAILED`, stuck `PROCESSING`, `extension_connected: false`, HTTP 4xx/5xx from `:8100`, YouTube `HttpError`, error strings like `UNSAFE_GENERATION` / `not found` / `CAPTCHA` / `NO_FLOW_KEY`): invoke `/fk-doctor` before guessing a fix

## Skills

| Skill | When to use |
|-------|-------------|
| `/fk-create-project` | New project with entities + scenes |
| `/fk-research` | Fact-check before scripting |
| `/fk-gen-refs` | Generate reference images for entities |
| `/fk-gen-images` | Generate scene images |
| `/fk-gen-videos` | Generate scene videos |
| `/fk-gen-chain-videos` | Videos with scene chaining transitions |
| `/fk-review-video` | Review video quality before upscale |
| `/fk-review-board` | Visual scene review board for feedback |
| `/fk-concat` | Download + concat final video |
| `/fk-concat-fit-narrator` | Concat trimmed to narrator duration |
| `/fk-gen-narrator` | Generate narrator text + TTS |
| `/fk-gen-text-overlays` | Generate text overlays from narrator text |
| `/fk-gen-tts-template` | Create voice template 

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
