# digital-marketing-pro — vendored framework

**Upstream:** https://github.com/indranilbanerjee/digital-marketing-pro
**License:** MIT (see `LICENSE` in this directory — Copyright (c) 2026 Digital Marketing Pro)
**Vendored:** 2026-07-24 during a UAP ingest wave (fit 50 — highest-scoring repo of the wave).

## What this is
A complete AI marketing/SEO plugin: **158 skills** (`skills/`), **89 engine scripts** (`scripts/`,
mostly Python + stdlib; a few use `nltk`), 24 specialist agents (`agents/`), commands, and hooks.
Vendored whole so the script-dependent skills (e.g. `seo-audit`, `keyword-cluster`, `entity-audit`)
resolve their `${CLAUDE_PLUGIN_ROOT}/scripts/...` references. Excluded from the copy: `.git`,
`tests/`, `node_modules`, `.github/`.

## Runtime notes
- Skills that shell out reference `${CLAUDE_PLUGIN_ROOT}/scripts/<name>.py`. When running one of
  those scripts, set `CLAUDE_PLUGIN_ROOT` to this directory:
  `~/.seosona/2_KNOWLEDGE/frameworks/digital-marketing-pro`.
- As vendored third-party code under `2_KNOWLEDGE/frameworks`, these scripts run through the OS
  **skill sandbox** (`1_CORE/scripts/core/skill_sandbox.py`) when launched via the dispatcher:
  secret-stripped env, temp cwd, pre-exec HARD re-scan, resource caps.
- Overlap with the OS's own SEO connectors (`1_CORE/scripts/connectors/*`) is intentional — the
  connectors fetch data; these skills add planning/audit/workflow on top.
- Security: the full plugin was HARD-scanned clean (0 HARD / 0 SOFT over 504 files) before vendoring.
