# KI: Alisa0808/vox-director

## Overview
Vox Director — an open-source Agent Skill that turns one topic into a finished Vox-style paper-collage explainer/ad video: script, collage keyframes, motion, voice-over, music and captions, automated end to end on the Atlas Cloud API + local ffmpeg. Works with Claude Code, Codex, and any SKILL.md agent.

## Tech Stack (from code)
- Python (18 files)
- **Total:** 42 files, 5 directories
- **File types:** .py: 18, .md: 10, .jpg: 5, .mp4: 4, .gitignore: 1, .txt: 1, .json: 1, .skill: 1

## File Structure
```
  .gitignore
  AGENTS.md
  LICENSE
  README.md
  README.zh.md
  SKILL.md
  SKILL.zh.md
  llms.txt
  package.json
  vox-director.skill
  assets/
    showcase-football.mp4
    showcase-money.mp4
    showcase-silicon-valley.mp4
    showcase-tang.mp4
    thumbs/
      football.jpg
      mexican.jpg
      money.jpg
      silicon-valley.jpg
      tang.jpg
  references/
    beat-layer.md
    local-engine.md
    models-and-gotchas.md
    prompt-guide.md
    voices.md
  scripts/
    aroll_assemble.py
    aroll_clips.py
    asr_beats.py
    assemble.py
    atlas_cloud.py
    audio.py
    clips.py
    confetti.py
    croll_keyframes.py
    extract_elements.py
    kenburns.py
    keyframes.py
    mg_scrapbook.py
    motion.py
    provider.py
    style_bakeoff.py
    styles.py
    text_overlay.py
```

## Agent Configuration
### AGENTS.md
# Vox Director — Agent Guide

This repository is an **agent skill**: a self-contained workflow that turns one
topic into a finished Vox-style paper-collage video (script → collage keyframes →
motion → voice-over → music → captions). It is not tied to any single assistant —
any coding agent that can read instructions and run scripts can drive it.

## How to use it (for the agent)

1. Read **`SKILL.md`** — the full workflow and the two human approval gates.
   (`SKILL.zh.md` is the same in Chinese.)
2. Before writing any prompt, read **`references/`** (prompt structures, the
   vocabulary/theme bank, and the narrative-beat library).
3. Work one project at a time under `out/<project>/`, driven by a single
   `beats.json`. Run the stages in **`scripts/`** in order:
   `style_bakeoff.py → keyframes.py → clips.py → audio.py → assemble.py`.

## Requirements

- `ATLASCLOUD_API_KEY` in the environment — https://www.atlascloud.ai/console/api-keys
- `ffmpeg` + `ffprobe`
- Python 3 with `pillow`

## Agent notes

- **Claude Code** auto-loads this as a skill from `SKILL.md`'s frontmatter — just
  ask for a "vox video".
- **Codex / other agents**: follow `SKILL.md` as your instructions; this
  `AGENTS.md` is your entry point.


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-flow` · **Function:** `ai-video` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `video-generat`, `text-to-video`
- **All scores:** {'seosona-os': 22, 'seosona-video': 22, 'seosona-content': 22, 'seosona-ux-ui': 22, 'seosona-flow': 44}
