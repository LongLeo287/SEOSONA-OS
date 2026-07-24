# KI: Alisa0808/vox-director

## Overview
This repository contains a skill for generating Vox-style paper-collage explainer videos using AI agents. The workflow involves script generation, collage keyframe creation, motion graphics, voice-over, music integration, and captioning, all automated through scripts and leveraging the Atlas Cloud API along with local ffmpeg.  The project is designed to be driven by coding agents like Claude Code or Codex.

## Tech Stack (from code)
- **Language:** Python 3 (implied by `scripts/*.py` files).
- **Build System/Configuration:** The project utilizes a `package.json` file, indicating usage of Node.js and npm for package management.  This suggests the use of JavaScript alongside Python, although its primary purpose appears to be metadata rather than core functionality.
```json
{
  "name": "vox-director",
  "version": "1.0.0",
  "description": "Vox Director — an open-source Agent Skill that turns one topic into a finished Vox-style paper-collage explainer/ad video: script, collage keyframes, motion, voice-over, music and captions, automated end to end on the Atlas Cloud API + local ffmpeg. Works with Claude Code, Codex, and any SKILL.md agent.",
  "keywords": [
    "vox",
    "vox-director",
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
    "atlas-cloud",
    "generative-ai"
  ],
  "homepage": "https://github.com/Alisa0808/vox-director",
  "repository": {
    "type": "git",
    "url": "https://github.com/Alisa0808/vox-director.git"
  },
  "license": "MIT",
  "author": "Alisa0808"
}
```

## Public API / Exports
The code does not explicitly define a public API or exported functions in the traditional sense. Instead, it appears to be structured as a series of scripts (`scripts/*.py`) that are executed sequentially by an agent.  These scripts likely contain internal functions and classes used within their respective processes (e.g., `keyframes.py`, `audio.py`). The `AGENTS.md` file outlines the order in which these scripts should be run, suggesting a workflow rather than a library with reusable components.

## Dependencies
- **Atlas Cloud API:**  Required for video generation and voice-over services (referenced in `package.json` description and `AGENTS.md`). Requires an `ATLASCLOUD_API_KEY`.
- **ffmpeg & ffprobe:** Used for video processing (mentioned in `AGENTS.md`).
- **Pillow:** A Python imaging library (mentioned in `AGENTS.md`).
- **Node.js/npm:**  Used to manage project metadata and potentially other tooling, as indicated by the presence of `package.json`.

## Architecture Patterns
- **Workflow-based architecture:** The core functionality is organized around a defined workflow consisting of multiple scripts executed sequentially. This promotes modularity but introduces dependencies between steps.
- **Agent-driven execution:**  The system relies on an external agent to orchestrate the entire process, highlighting its design as a skill rather than a standalone application.
- **Configuration-driven:** The `beats.json` file appears to drive the workflow, suggesting that project parameters and instructions are passed through configuration files.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Modular Video Generation Skill:**  The skill can be integrated as a module within SEOSONA OS for automated video creation from text or data sources.
- **Agent Integration Framework:** The agent-driven architecture provides insights into how to design and integrate AI agents for complex tasks within the operating system.
- **Workflow Management System:** The sequential script execution pattern could inform the development of a workflow management system within SEOSONA OS, enabling users to define and automate multi-step processes.


## UAP Routing (auto-classified)
- **System:** `seosona-flow` · **Function:** `ai-video` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `video-generat`, `text-to-video`
- **All scores:** {'seosona-os': 22, 'seosona-video': 22, 'seosona-content': 22, 'seosona-ux-ui': 22, 'seosona-flow': 44}
