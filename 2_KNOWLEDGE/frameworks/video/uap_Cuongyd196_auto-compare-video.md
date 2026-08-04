# KI: Cuongyd196/auto-compare-video

## Overview
Repository with 50 files across 20 directories. Primary language: Unable to detect from file extensions.

## Tech Stack (from code)
- Unable to detect from file extensions
- **Total:** 50 files, 20 directories
- **File types:** .mp3: 16, .md: 14, .json: 8, .mjs: 5, .png: 2, .html: 2, .example: 1, .gitignore: 1

## File Structure
```
  .env.example
  .gitignore
  AGENTS.md
  CLAUDE.md
  DESIGN.md
  LICENSE
  README.EN.md
  README.md
  vbee.md
  .agents/
    skills/
      create-video/
        README.md
        SKILL.md
        references/
          composition.md
          scaffold-manual.md
          script-and-timing.md
        scripts/
          scaffold.mjs
  .claude/
    skills/
      create-video/
        SKILL.md
  docs/
    previews/
      dev-vs-devops.png
      thien-thach-vs-sao-bang.png
  videos/
    dev-vs-devops/
      BRIEF.md
      hyperframes.json
      index.html
      meta.json
      package.json
      assets/
        vo/
          durations.json
          line-1.mp3
          line-2.mp3
          line-3.mp3
          line-4.mp3
          line-5.mp3
          line-6.mp3
          line-7.mp3
          line-8.mp3
      scripts/
        generate-vo.mjs
        sync-channel.mjs
    thien-thach-vs-sao-bang/
      BRIEF.md
      hyperframes.json
      index.html
      meta.json
      package.json
      assets/
        vo/
          durations.json
          line-1.mp3
          line-2.mp3
          line-3.mp3
          line-4.mp3
          line-5.mp3
          line-6.mp3
          line-7.mp3
          line-8.mp3
      scripts/
        generate-vo.mjs
        sync-channel.mjs
```

## Agent Configuration
### AGENTS.md
# HyperFrames Composition Project

## Repo layout — multiple videos

This repo holds a **series** of short comparison videos, each its own self-contained
HyperFrames project under `videos/<video-name>/` (own `package.json`, `hyperframes.json`,
`meta.json`, `index.html`, `assets/`, `scripts/`, `renders/`, `snapshots/`). Root-level files
(`README.md`, `CLAUDE.md`, `AGENTS.md`, `DESIGN.md`, `vbee.md`) are shared across the whole
series — `DESIGN.md` in particular is the fixed layout/style contract every video follows.

**All commands below run with `cwd` inside the specific video's folder**
(`videos/<video-name>/`), not the repo root — that's where each video's `package.json` lives.

The Vbee TTS credentials (`.env`) live once at the **repo root** and are shared by every
video's `scripts/generate-vo.mjs`.

To start a new video: create `videos/<new-name>/`, run `hyperframes init` inside it, copy the
3-zone layout contract from `DESIGN.md`, and swap in the new topic's text/images/audio.

## Skills — USE THESE FIRST

**Always invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that are NOT in generic web docs. Skipping them produces broken compositions.

**Doing anything with HyperFrames?** Start at `/hyperframes` — it tells you what HyperFrames can do and which skill or workflow handles your intent (make a video, TTS / BGM

### CLAUDE.md
# HyperFrames Composition Project

## Repo layout — multiple videos

This repo holds a **series** of short comparison videos, each its own self-contained
HyperFrames project under `videos/<video-name>/` (own `package.json`, `hyperframes.json`,
`meta.json`, `index.html`, `assets/`, `scripts/`, `renders/`, `snapshots/`). Root-level files
(`README.md`, `CLAUDE.md`, `AGENTS.md`, `DESIGN.md`, `vbee.md`) are shared across the whole
series — `DESIGN.md` in particular is the fixed layout/style contract every video follows.

**All commands below run with `cwd` inside the specific video's folder**
(`videos/<video-name>/`), not the repo root — that's where each video's `package.json` lives.

The Vbee TTS credentials (`.env`) live once at the **repo root** and are shared by every
video's `scripts/generate-vo.mjs`.

To start a new video: create `videos/<new-name>/`, run `hyperframes init` inside it, copy the
3-zone layout contract from `DESIGN.md`, and swap in the new topic's text/images/audio.

## Skills — USE THESE FIRST

**Always invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that are NOT in generic web docs. Skipping them produces broken compositions.

**Doing anything with HyperFrames?** Start at `/hyperframes` — it tells you what HyperFrames can do and which skill or workflow handles your intent (make a video, TTS / BGM

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 6/100 · **Auto-apply:** False
- **Evidence:** `agent`
- **All scores:** {'seosona-os': 6, 'seosona-video': 6, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
