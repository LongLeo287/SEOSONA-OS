---
name: seosona:portable-capability-bridge
description: Expose the full SEOSONA OS system graph to any IDE, CLI, MCP client, or agent runtime through portable anchors and a machine-readable bridge that never emits machine-specific paths.
argument-hint: "[manifest | route <query> | validate]"
metadata:
  author: seosona
  version: "1.0.0"
---

# Portable Capability Bridge

Use this skill when an external IDE, CLI, MCP client, agent runtime, or automation surface needs to connect to SEOSONA OS skills, agents, workflows, Knowledge Items, raw data, SOPs, rules, and contracts without knowing where the system is physically installed.

## Core Contract

All integrations must use:

- `~/.seosona` for prompts and markdown references.
- `${SEOSONA_ROOT}` for runtime configs and scripts.
- Relative paths when already inside the SEOSONA OS workspace.

Never persist physical installation paths in external tool configuration.

## Bridge Commands

Run from the SEOSONA OS root:

```text
node 1_CORE/scripts/seosona_capability_bridge.js manifest
node 1_CORE/scripts/seosona_capability_bridge.js route <query>
node 1_CORE/scripts/seosona_capability_bridge.js validate
node 1_CORE/scripts/seosona_capability_bridge.js audit-portability
```

The bridge exports portable JSON that other tools can consume. In manifest v2, `resources` is the complete system graph and `capabilities` remains the skill-only compatibility list.

## Startup Procedure for Connected Tools

1. Resolve root through `~/.seosona` or `${SEOSONA_ROOT}`.
2. Read `1_CORE/SOUL.md`.
3. Read `2_KNOWLEDGE/MASTER_INDEX.md`.
4. Load routes through the bridge or `2_KNOWLEDGE/SKILLS_ROUTER.md`.
5. Check relevant KIs under `3_MEMORY/knowledge_items/`.
6. Use the smallest relevant set of skills, agents, workflows, SOPs, KIs, and raw references.
7. Log major actions under `3_MEMORY/logs/`.

## Required Capability Routing

The bridge must expose:

- `seosona:cost-bounded-agent-looping`
- `seosona:thinking-model-router`
- `seosona:portable-capability-bridge`

These make the Claude Cowork, Agent Looping, and Thinking Model knowledge usable as operating behavior in every connected environment.

## Whole-System Coverage

The bridge must expose:

- Skills from `2_KNOWLEDGE/SKILLS_ROUTER.md`.
- Agents from `4_AGENTS/personas/`.
- Workflows from `1_CORE/workflows/` and `2_KNOWLEDGE/workflows/`.
- Knowledge Items from `3_MEMORY/knowledge_items/`.
- Raw reference indexes from `2_KNOWLEDGE/raw_data/`.
- SOPs from `2_KNOWLEDGE/sops/`.
- Rules and contracts from `1_CORE/`.

## Validation

Run:

```text
node 1_CORE/scripts/seosona_capability_bridge.js validate
npm run status
```

Validation fails if:

- A required core file is missing.
- A router path does not resolve.
- A required new capability is not routeable.
- The bridge emits a machine-specific path.
- The semantic portability audit finds a machine-specific path in a system-owned rule, SOP, workflow, agent, KI, spec, or SKILL.md file.

TASK COMPLETED
