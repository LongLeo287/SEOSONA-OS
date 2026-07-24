# KI: nexu-io/motion-anything

## Overview
Repository with 1395 files across 456 directories. Primary language: JavaScript (React) (134 files).

## Tech Stack (from code)
- JavaScript (React) (134 files)
- JavaScript (125 files)
- **Total:** 1395 files, 456 directories
- **File types:** .md: 312, .css: 256, .html: 225, .yaml: 218, .jsx: 134, .js: 125, .json: 68, .gif: 16

## File Structure
```
  .gitignore
  AGENTS.md
  ATTRIBUTION.md
  CLAUDE.md
  HTML-TO-VIDEO.md
  INTEGRATIONS.md
  LICENSE
  MOTION-SPEC.md
  PROGRESS.md
  README.md
  README.zh-CN.md
  ROADMAP.md
  SOURCES.md
  VIDEO-ROADMAP.md
  WEBGL.md
  .claude/
    launch.json
  app/
    index.html
    agent-icons/
      amr.svg
      claude.svg
      codex.svg
      cursor-agent.svg
      gemini.svg
      grok-build.svg
      hermes.svg
      opencode.svg
    brand/
      logo.svg
    data/
      design-systems.js
      html-templates.json
      recipes.js
      reicon-LICENSE.txt
      reicon-icons.json
      video-templates.json
    design-systems/
      SOURCE.md
      airbnb/
        DESIGN.md
        manifest.json
      apple/
        DESIGN.md
        manifest.json
      arc/
        DESIGN.md
        manifest.json
      brutalism/
        DESIGN.md
        manifest.json
      canva/
        DESIGN.md
        manifest.json
      claude/
        DESIGN.md
        manifest.json
      claymorphism/
        DESIGN.md
        manifest.json
      cohere/
        DESIGN.md
        manifest.json
      coinbase/
        DESIGN.md
        manifest.json
      discord/
        DESIGN.md
        manifest.json
      duolingo/
        DESIGN.md
        manifest.json
      editorial/
        DESIGN.md
        manifest.json
      elevenlabs/
        DESIGN.md
        manifest.json
      figma/
        DESIGN.md
        manifest.json
      framer/
        DESIGN.md
        manifest.json
      futuristic/
        DESIGN.md
        manifest.json
      github/
        DESIGN.md
        manifest.json
      glassmorphism/
        DESIGN.md
        manifest.json
      gradient/
        DESIGN.md
        manifest.json
      huggingface/
        DESIGN.md
        manifest.json
      intercom/
        DESIGN.md
        manifest.json
      linear-app/
        DESIGN.md
        manifest.json
      loom/
        DESIGN.md
        manifest.json
      mastercard/
        DESIGN.md
        manifest.json
      meta/
        
```

## Agent Configuration
### CLAUDE.md
# CLAUDE.md

This project follows a single, tool-agnostic working agreement so it can be continued by any AI
agent in any session.

👉 **Read [`AGENTS.md`](AGENTS.md) first** — it is the source of truth for repo structure,
the recipe manifest schema, the golden path for adding recipes, and the hard rules.

👉 **Then read [`PROGRESS.md`](PROGRESS.md)** — current status and the task queue.

👉 **The motion standard is [`MOTION-SPEC.md`](MOTION-SPEC.md)** — every recipe and the router
skill must obey it.

## Claude-specific notes

- This repo is intentionally plain files (Markdown / YAML / HTML / CSS / JS) with no build step,
  so the user can switch tools or resume in a fresh session at any time without losing context.
  Keep it that way.
- When the user describes a motion in natural language, your job is the loop in
  `skills/motion-anything/SKILL.md`: classify intent → pick recipes from `recipes/` honoring
  `MOTION-SPEC.md` (especially the restraint budget) → produce the output.
- Prefer extending the library and the spec over one-off code. The reusable recipe is the asset.


### AGENTS.md
# AGENTS.md — working agreement for any AI agent on this repo

This file is the single source of truth for **any** coding agent (Claude Code, Cursor, Codex,
Aider, …) working on `motion-anything`. If you are an AI picking this project up cold, read this
file and `PROGRESS.md` first — they are designed so the project can be continued by any tool, in
any new session, without losing context.

## What this project is

`motion-anything` is an open-source, chat-native **motion engine**: a curated + standardized
library of motion recipes, a "taste engine" (`MOTION-SPEC.md`), and a router skill that turns one
sentence of intent into produced, tasteful animation. It is an independent product that **shares
resources with and interlocks with** [Open Design](https://github.com/nexu-io/open-design):
every recipe is authored as an **Open-Design-compatible `SKILL.md`** so it can drop straight into
OD's `skills/` and bind to OD design systems' `motion` section.

Read the product thesis in `README.md`. Read live status and the task queue in `PROGRESS.md`.

## Repository map

| Path | Role |
|------|------|
| `recipes/<surface>/<recipe-id>/` | One motion recipe. Surfaces: `web/`, `interaction/`, `video/`. |
| `recipes/<...>/recipe.motion.yaml` | Machine manifest (gallery + router read this). Schema below. |
| `recipes/<...>/SKILL.md` | The portable, Open-Design-compatible skill for this recipe. |
| `recipes/<...>/preview.html` | Self-contained, openable live demo. No build step, no external de

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 12/100 · **Auto-apply:** False
- **Evidence:** `openai`, `gemini`
- **All scores:** {'seosona-os': 12, 'seosona-video': 0, 'seosona-content': 6, 'seosona-ux-ui': 6, 'seosona-flow': 0}
