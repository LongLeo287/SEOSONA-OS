---
domain: agentic_operating_models
created: 2026-06-12
sources:
  - https://github.com/LongLeo287/OmniClaw
  - 2_KNOWLEDGE/raw_data/agentic_operating_models/omniclaw_delta_snapshot_2026-06-12.md
  - 2_KNOWLEDGE/frameworks/agentic_workflows/omniclaw_8_daemons_architecture/SKILL.md
status: active
---

# KI: OmniClaw Operational Governance Delta

## Summary

SEOSONA OS reviewed the current `LongLeo287/OmniClaw` repository at commit `79bb980` and upgraded the local OmniClaw knowledge from a short 8-daemon description into an operational governance pattern.

## Durable Memory

- Use deterministic daemon-like scripts for routing, registry updates, ingestion, security checks, cleanup, and local bridge governance.
- Use persona agents for bounded specialist reasoning, not for unrestricted background authority.
- Keep external repository ingestion quarantine-first: clone, static review, distill, promote, validate, then remove or ignore scratch material.
- Use blackboard state and receipts for long-running tasks so handoffs survive context loss.
- Local dashboards and preview tools must bind to `127.0.0.1` by default; network exposure must be explicit.
- Promote useful external repo patterns into small SEOSONA skills/KIs instead of copying whole third-party payloads.

## Native Changes

- Expanded `omniclaw_8_daemons_architecture/SKILL.md` with SEOSONA mappings, receipt schema, promotion checklist, and localhost-first perimeter guidance.
- Fixed SEOSONA portability/security issues discovered during the audit:
  - Removed hardcoded SRT source path from `1_CORE/scripts/core/srt_cleaner.py`.
  - Replaced media FPS `eval()` with safe fraction parsing.
  - Changed preview and kanban host defaults from `0.0.0.0` to `127.0.0.1`.

TASK COMPLETED
