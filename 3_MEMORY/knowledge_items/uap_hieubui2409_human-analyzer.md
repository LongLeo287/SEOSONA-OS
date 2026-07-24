# KI: hieubui2409/human-analyzer

## Overview
A clinical-grade system that turns deep, evidence-backed psychological profiles of characters into platform-native content. Built to **scale from a handful of characters to many** — tooling is character-agnostic and resolves subjects dynamically via `paths.py`.

## Architecture & Tech Stack
- Python
- **Total files:** 138 files across 11 directories
- **File types:** .py: 69, .md: 24, .cjs: 21, .json: 14, .yaml: 4, .sh: 3, .gitignore: 1

## Core Capabilities
1. **Ingest** raw source material (transcripts, interviews, logs, articles) and score it for evidence quality.
2. **Analyze** it into a structured clinical profile — case formulation, defenses, attachment, trauma, strengths, timeline, growth.
3. **Generate** platform content (Facebook, LinkedIn, blog, …), gated by evidence tier and confidentiality.

Everything is **event-driven**: ingesting material cascades into a profile refresh, which cascades into
content recalibration. **68 framework skills** across **7 frameworks**, invoked as `{framework}:{skill}`
(e.g. `psy:crossref`). The full per-skill catalog is below and in [`CLAUDE.md`](./CLAUDE.md); per-skill
walkthroughs live in each skill's `GUIDE-EN.md` / `GUIDE-VI.md`.

---

## Documentation Sections
- Character Profile Intelligence System
- What it does
- Architecture
- Event flow / processing
- Use cases
- Quick start
- 1. First run — provision the virtualenv
- 2. Invoke a skill script directly
- example: score a character's profile completeness (needs a roster + profile; the synthetic
- e2e fixture under e2e/synthetic-project/ is a ready-made one to try against)
- The seven frameworks
- `MAT` — Materials (input) · 4 skills
- `PSY` — Psychology (analysis) · 16 skills
- `CRE` — Content (output) · 10 skills
- `GRO` — Growth · 8 skills
- `ORC` — Orchestration · 17 skills
- `COM` — Common · 5 skills
- `EVL` — Evaluation · 8 skills

## Core Structure
```
  .gitignore
  CHANGELOG.md
  CLAUDE.md
  CONTRIBUTING.md
  LICENSE
  README.md
  pyproject.toml
  .claude/
    framework-config.json
    pack.manifest.yaml
    settings.json
    agents/
      content-strategist.md
      cross-validator.md
      evl-rubric-importer.md
      growth-analyst.md
      material-analyst.md
      profile-manager.md
      psychologist.md
    hooks/
      context-budget-gauge.cjs
      detect-profile-drift-hook.cjs
      emit-session-summary.cjs
      gateguard-profile-protect.cjs
      observe-framework-signal.cjs
      pii-guard-on-write.cjs
      profile-edit-reminder.cjs
      rebuild-knowledge-graph.cjs
      track-script-execution.cjs
      track-skill-invocation.cjs
      write-framework-delta-compact-digest.cjs
      lib/
        bash-write-targets.cjs
        hook-config-utils.cjs
        hook-logger.cjs
        sensitivity-checker.cjs
        telemetry-paths.cjs
    schemas/
      ck-config.schema.json
      diagnostics.schema.json
      event-jsonl.schema.json
      evl-rubric.schema.json
      growth-career-path.schema.json
      growth-competency.schema.json
      material-frontmatter.schema.json
      material-schema.yaml
      profile-frontmatter.schema.json
      psychology-formulation.schema.json
      skill-schema.json
      universal-profile-schema.yaml
    scripts/
      README.md
      ck-help.py
      init-universal-profile-skeleton.py
      inject-material-frontmatter-into-existing-files.py
      mpc-migrate-flat-profiles-to-nested-structure.py
      requirements.txt
      resolve_env.py
      run-full-framework-validation.sh
      run-project-script-tests.py
      run-skill-conformance-gate.sh
      scan_commands.py
      scan_skills.py
      scan_skills.test.cjs
      score-skill-description.py
      set-active-plan.cjs
      skills_data.yaml
      test-ck-help.py
      validate-all-against-schemas.py
      validate-docs.cjs
      validate-skill-crossrefs.py
      validate-skill-frontmatter.py
      win_compat.py
      worktree.cjs
      worktree.test.cjs
      platform_lib/
        __init__.py
        angle_scoring.py
        asset_packages.py
        behavioral_clusters.py
        cache_store.py
        check_fence.py
        clinical_terms.py
        csv_search.py
        decision_store.py
        encoding_utils.py
        env_utils.py
        errors.py
        event_routing.py
        evidence_tier_permissions.py
        evl_aggregate.py
        evl_compare.py
        evl_convergence.py
        evl_evid
```

## Quick Start
```bash
| Framework | Type | Owns (write root) | Purpose |
| --- | --- | --- | --- |
| **MAT** | Domain | `docs/materials/` | Evidence ingestion, tiers T1–T5, CRAAP |
| **PSY** | Domain | `docs/profiles/` · `docs/references/` · `docs/graph/` | Clinical 5P formulation |
| **CRE** | Domain | `assets/` | Platform content creation |
| **GRO** | Domain | `docs/profiles/*/growth/` | Career + competency intelligence |
| **EVL** | Domain | `docs/profiles/*/eval/` · `docs/rubrics/` | Evidence-cited rubric scoring + verdicts |
| **ORC** | Orchestrator | `.claude/` | Event routing, domain boundaries, memory, graph |
| **COM** | Common | `.claude/` | Git, health-check, rules, observability |
---
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

Clinical-grade **character profile intelligence system** for storytelling + content creation. Each character = deep, evidence-backed psychological profile feeding platform-native content. Built to **scale to many characters** (currently 3) — never hardcode character specifics in shared logic; resolve dynamically via `paths.py`.

---

## Architecture

Five domain frameworks + orchestrator + common toolkit, wired by an event bus:

```
MAT (Input) → PSY (Analysis) → CRE (Output)
                  ↑ ORC (Orchestration) ↑
            GRO (Growth) ↗ PSY + CRE
   PSY / GRO → EVL (Evaluation) → CRE (optional)
```

| FW | Domain | Data location | Purpose |
|----|--------|---------------|---------|
| **MAT** | Materials | `docs/materials/` | Evidence ingestion, tiers, CRAAP |
| **PSY** | Psychology | `docs/profiles/` + `docs/references/` + `docs/graph/` | Clinical profiling, 5P formulation |
| **CRE** | Content | `assets/` | Platform content creation |
| **GRO** | Growth | `docs/profiles/*/growth/` | Career + competency intelligence |
| **EVL** | Evaluation | `docs/rubrics/` + `docs/profiles/*/eval/` | Rubric scoring, evidence-cited verdicts |
| **ORC** | Coordination | `.claude/` | Event routing, domain boundaries |
| **COM** | Utilities | `.claude/` | Git, health-check, rules |

**Event pipeline:** `MAT.integrated → PSY.refresh → CRE.recalibrate` · `GRO.assessed|mentored → PSY.refresh → CRE.recalibrate` · `PSY.refresh|GRO.assessed → EVL.rescore → EVL.scored → CRE.recalibrate`. Domain boundaries enforced — each FW owns its data, communicates via events not cross-domain writes (Rule 12).

**Design principle:** scripts do deterministic gathering (may over-flag); the LLM does heuristic judgment. Never delegate reasoning to scripts.

---

## Load on Demand

Pull a reference only when its topic is active. **Exception:** load `gates-and-anti-rationalization.md` **every turn**.

| Need | Load |
|------|------|
| **Gates / anti-rationalization** (every turn) | `.claude/

--- CONTRIBUTING.md ---
# Contributing

Thanks for your interest! This is the framework toolkit. Public contributions are made against the
public mirror (`hieubui2409/human-analyzer`); the maintainer cherry-picks them into the canonical repo.
Contributions to the skills, scripts, rules, tests, and docs are welcome.

## The one hard rule — no PII, no private corpus

The **public** repo must **never** contain:

- Real-person character profiles, materials, graph, or references 

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
