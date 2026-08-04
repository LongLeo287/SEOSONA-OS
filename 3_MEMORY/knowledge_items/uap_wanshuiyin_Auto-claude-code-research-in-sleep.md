# KI: wanshuiyin/Auto-claude-code-research-in-sleep (ARIS)

> Manually authored (2026-07-24), NOT via the UAP assimilator. HARD-flagged only because
> `tests/test_threat_scan.py` embeds an obviously fake, sequential AWS access-key id fixture for the
> repo's own threat-scanner test — not a real secret. Verified benign; the literal string is omitted
> here so this KI stays clean of secret-scanner patterns.

## Overview
ARIS ("Auto claude-code Research In Sleep") is a **skill-based autonomous research workflow** for
agentic CLIs (Claude Code, Codex CLI, Cursor, Trae, Antigravity, Copilot CLI, OpenClaw). You hand it a
research direction; it runs long-horizon research unattended, keeping a **research-wiki for memory** and
having **other models cross-check every step** to fight the two classic failure modes of autoresearch —
the model forgetting earlier details and grading its own work. Presented as a methodology (arXiv
2605.03042), not a platform. Spawned sister projects: **Anti-Autoresearch** (a 61-signal integrity
auditor across 8 hack-pattern families) and **ARIS-Movie-Director** (multi-scene still-frame storytelling).

## Tech Stack / structure (from code)
- Skill-based: `skills/` per host CLI (e.g. `skills/skills-codex/`), consumed as agent skills.
- `aris-monitor/` runtime, extensive `docs/` (per-CLI adaptation runbooks, EN + CN).
- Agent-facing `AGENT_GUIDE.md` (structured for LLM consumption, not human browsing).

## Relevance to SEOSONA
High-value for the **OS's agent layer**: ARIS's "research-wiki memory + independent cross-model
verification + self-audit" mirrors SEOSONA's own memory + integrity-guard philosophy. The
Anti-Autoresearch integrity-signal catalog is a concrete reference for hardening any autonomous
generate-then-verify loop (cf. the OS's security guard + adversarial-verify patterns).
