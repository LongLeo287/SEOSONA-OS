# KI: Anil-matcha/vox-ai-motion-graphics-generator

## Overview
This repository contains a skill for generating Vox-style paper-collage explainer videos using AI agents. The workflow involves script generation, collage keyframe creation, motion graphics, voice-over addition, music integration, and captioning, all automated through scripts executed sequentially.  The project leverages the Muapi API and local ffmpeg tools to achieve end-to-end video production.

## Tech Stack (from code)
- **Language:** Python 3 (implied by `scripts/*.py` files).
- **Build System/Configuration:** The project uses a `package.json` file, indicating the use of Node.js and npm for managing dependencies and potentially build scripts (though no explicit build commands are visible in the provided code).  The presence of `.gitignore` suggests Git version control is used.

```json
{
  "name": "muapi-director",
  "version": "1.0.0",
  "description": "Muapi Director — an open-source Agent Skill that turns one topic into a finished Vox-style paper-collage explainer/ad video: script, collage keyframes, motion, voice-over, music and captions, automated end to end on the Muapi API + local ffmpeg. Works with Claude Code, Codex, and any SKILL.md agent.",
  "keywords": [
    "vox",
    "muapi-director",
    "ai-video",
    "video-generation",
    "text-to-video",
    "paper-collage",
    "collage-video",
    "motion-graphics",
    "explainer-video",
    "ai-ads",
    "agent-skill",
    "claude-skill",
    "claude-code",
    "codex",
    "ffmpeg",
    "tts",
    "muapi",
    "muapiapp",
    "generative-ai"
  ],
  "homepage": "https://github.com/muapiapp/muapi-director",
  "license": "MIT"
}
```

## Public API / Exports
The provided code does not contain any explicit definitions of public APIs or exported functions. The `scripts/` directory contains Python scripts (`assemble.py`, `audio.py`, `clips.py`, `keyframes.py`, `muapi_client.py`, `style_bakeoff.py`, `styles.py`, `text_overlay.py`) which likely define internal functionalities, but their public interfaces are not discernible from the given code snippet.

## Dependencies
Based on the `package.json` file and the `AGENTS.md` documentation:
- **Node.js/npm:**  Implied by the presence of `package.json`.
- **ffmpeg & ffprobe:** Required for video processing (mentioned in `AGENTS.md`).
- **Pillow:** A Python imaging library, required for image manipulation (mentioned in `AGENTS.md`).
- **Muapi API:** Used for integration with Muapi services.
- **OpenAI API:**  Used for prompt planning and scripts (mentioned in `AGENTS.md`).

```markdown
## Requirements

- `MUAPI_API_KEY` in the environment — from your Muapi Dashboard
- `OPENAI_API_KEY` in the environment — for prompt planning/scripts
- `ffmpeg` + `ffprobe`
- Python 3 with `pillow`
```

## Architecture Patterns
- **Sequential Script Execution:** The workflow is explicitly designed to be executed sequentially, as outlined in `AGENTS.md`.  The order of execution (`style_bakeoff.py → keyframes.py → clips.py → audio.py → assemble.py`) defines a clear pipeline.
- **Agent Skill/Workflow:** The project implements an "agent skill," which is a self-contained workflow designed to be driven by an AI agent (like Claude Code or Codex). This suggests a modular and reusable design.



## Relevance to SEOSONA OS
The code demonstrates a structured approach to automated video generation using AI, which could benefit SEOSONA OS in several ways:

- **Composable Video Generation:** The sequential script execution pattern can be adapted for creating composable video pipelines within SEOSONA OS, allowing users to define and customize their own video creation workflows.
- **Agent Skill Integration:**  The concept of an "agent skill" aligns with the potential for integrating AI agents into SEOSONA OS to automate various tasks, including content creation. The modular design facilitates easy integration of new skills.
- **Dependency Management:** The `package.json` file and explicit dependency listing provide a model for managing dependencies within SEOSONA OS projects, ensuring consistency and reproducibility.

## UAP Routing (auto-classified)
- **System:** `seosona-flow` · **Function:** `ai-video` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `video-generat`, `text-to-video`
- **All scores:** {'seosona-os': 22, 'seosona-video': 22, 'seosona-content': 22, 'seosona-ux-ui': 22, 'seosona-flow': 44}
