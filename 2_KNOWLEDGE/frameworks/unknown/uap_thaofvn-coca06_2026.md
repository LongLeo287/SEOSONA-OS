# KI: thaofvn-coca06/2026

## Overview
Repository with 3 files across 1 directories. Primary language: Unable to detect from file extensions.

## Tech Stack (from code)
- Unable to detect from file extensions
- **Total:** 3 files, 1 directories
- **File types:** .md: 3

## File Structure
```
  AGENTS.md
  CLAUDE.md
  README.md
```

## Agent Configuration
### AGENTS.md
# Project conventions - github-skills

This file is for any Codex agent working on this repository. Read it before
making changes. Conventions here are mandatory unless the user asks otherwise.

## Versioning

- Single source of truth: `.codex-plugin/plugin.json`,
  `.agents/plugins/marketplace.json`, `.claude-plugin/plugin.json`, and
  `.claude-plugin/marketplace.json`. Plugin manifests must always match on
  package name and version; marketplace entries must point to the same package;
  author, license, homepage, and the public skill-bundle description must stay
  aligned.
- Keep `AGENTS.md` and `CLAUDE.md` aligned when changing shared project rules.
  Codex-specific workflow details belong here; Claude-specific details belong in
  `CLAUDE.md`.
- Codex marketplace install uses `.codex-marketplace/github-skills/`. Do not
  edit that generated package by hand. Update the root files first, then run
  `python3 scripts/sync_codex_marketplace.py`.
- **Default: bump the PATCH segment (3rd level, `0.0.X`).** This is the automatic
  behavior for every shippable commit, regardless of how large the diff feels.
  Skill renames, lib API breaks, new features: still PATCH by default.
- Only bump MINOR or MAJOR when **the user explicitly asks** for a higher rank
  ("this is minor", "make it 2.0", "bump major"). Do not promote on your own
  initiative even if semver textbook says so.
- After bumping, two steps are required:
  1. Tag the commit: `git tag -a v<X.Y.Z> -m "..."` + `git push ori

### CLAUDE.md
# Project conventions - github-skills

This file is for any Claude Code agent working on this repository. Read it
before making changes. Conventions here are mandatory unless the user asks
otherwise.

## Versioning

- Single source of truth: `.claude-plugin/plugin.json`,
  `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, and
  `.agents/plugins/marketplace.json`. Plugin manifests must always match on
  package name and version; marketplace entries must point to the same package;
  author, license, homepage, and the public skill-bundle description must stay
  aligned.
- Keep `CLAUDE.md` and `AGENTS.md` aligned when changing shared project rules.
  Claude-specific workflow details belong here; Codex-specific details belong in
  `AGENTS.md`.
- Codex marketplace install uses `.codex-marketplace/github-skills/`. Do not
  edit that generated package by hand. Update the root files first, then run
  `python3 scripts/sync_codex_marketplace.py`.
- **Default: bump the PATCH segment (3rd level, `0.0.X`).** This is the automatic
  behavior for every shippable commit, regardless of how large the diff feels.
  Skill renames, lib API breaks, new features: still PATCH by default.
- Only bump MINOR or MAJOR when **the user explicitly asks** for a higher rank
  ("this is minor", "make it 2.0", "bump major"). Do not promote on your own
  initiative even if semver textbook says so.
- After bumping, two steps are required:
  1. Tag the commit: `git tag -a v<X.Y.Z> -m "..."` + `git pu

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 6/100 · **Auto-apply:** False
- **Evidence:** `agent`
- **All scores:** {'seosona-os': 6, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
