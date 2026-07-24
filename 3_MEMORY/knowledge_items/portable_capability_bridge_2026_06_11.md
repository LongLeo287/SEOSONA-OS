---
domain: portable_capability_bridge
created: 2026-06-11
sources:
  - 1_CORE/PORTABLE_CAPABILITY_CONTRACT.md
  - 1_CORE/scripts/seosona_capability_bridge.js
  - 2_KNOWLEDGE/frameworks/agentic_workflows/seosona_portable_capability_bridge/SKILL.md
status: active
---

# KI: Portable Capability Bridge

## Summary

SEOSONA OS now exposes its full system graph through a portable bridge so IDEs, CLIs, MCP clients, and agent runtimes can discover and route skills, agents, workflows, KIs, raw data, SOPs, rules, and contracts without depending on a machine-specific installation path.

## Durable Memory

- External tools must use `~/.seosona`, `${SEOSONA_ROOT}`, or relative paths.
- `1_CORE/scripts/seosona_capability_bridge.js` is the machine-readable bridge.
- The bridge exports a JSON manifest from `2_KNOWLEDGE/SKILLS_ROUTER.md` plus agents, workflows, KIs, raw data, SOPs, rules, and contracts.
- The bridge validates core files, routeability, path resolution, and path portability.
- The bridge runs semantic portability audit across system-owned rules, SOPs, workflows, agents, KIs, specs, and every `SKILL.md`.
- The agent-looping and thinking-model ingestion is now exposed as reusable capability behavior, not only as stored notes.

## Required Commands

```text
node 1_CORE/scripts/seosona_capability_bridge.js manifest
node 1_CORE/scripts/seosona_capability_bridge.js route agent looping
node 1_CORE/scripts/seosona_capability_bridge.js validate
node 1_CORE/scripts/seosona_capability_bridge.js audit-portability
```

TASK COMPLETED
