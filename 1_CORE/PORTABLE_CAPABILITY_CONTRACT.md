# SEOSONA Portable Capability Contract

## Purpose

This contract defines how any IDE, CLI, MCP client, agent runtime, or automation surface connects to SEOSONA OS without depending on a machine-specific installation path.

## Portable Anchors

Every external tool must use one of these anchors:

- `~/.seosona` for human-readable prompts, markdown, and IDE instructions.
- `${SEOSONA_ROOT}` for scripts, configs, and machine-resolved runtime paths.
- Relative paths from the SEOSONA OS root when already running inside the workspace.

External tools must never store the physical installation path in their persistent configuration.

## Required Startup Sequence

Any connected tool must:

1. Resolve the root through `~/.seosona` or `${SEOSONA_ROOT}`.
2. Read `1_CORE/SOUL.md`.
3. Read `2_KNOWLEDGE/MASTER_INDEX.md`.
4. Query the system graph through `1_CORE/scripts/seosona_capability_bridge.js`.
5. Check relevant Knowledge Items under `3_MEMORY/knowledge_items/`.
6. Route the task to the smallest useful set of skills, agents, workflows, SOPs, KIs, and raw references.
7. Log major work under `3_MEMORY/logs/`.

## Capability Bridge

Use `1_CORE/scripts/seosona_capability_bridge.js` as the stable machine-readable entrypoint.

Supported commands:

```text
node 1_CORE/scripts/seosona_capability_bridge.js manifest
node 1_CORE/scripts/seosona_capability_bridge.js route <query>
node 1_CORE/scripts/seosona_capability_bridge.js validate
node 1_CORE/scripts/seosona_capability_bridge.js audit-portability
```

The bridge emits portable paths only. JSON output must use `~/.seosona` paths, `${SEOSONA_ROOT}` paths, or relative paths.

## System Graph Shape

The bridge exports a system graph. Each resource includes:

- `name`: stable routing name.
- `type`: skill, agent, workflow, knowledge_item, raw_data, sop, rule, or contract.
- `keywords`: natural-language aliases or derived route terms.
- `relativePath`: path relative to the SEOSONA OS root.
- `portablePath`: `~/.seosona/...` path.
- `domain`: system domain or directory family.
- `source`: router, agent registry, KI directory, workflow directory, raw data, SOP, rule, or contract.

`capabilities` remains a backward-compatible alias for routed skills. Connected tools that want complete SEOSONA context should use `resources`.

## New Agentic Operating Model Capabilities

The Claude Cowork, Agent Looping, and Thinking Model ingestion is exposed through:

- `seosona:cost-bounded-agent-looping`
- `seosona:thinking-model-router`

Connected tools should use them as first-class capabilities, not as local notes.

## Environment Independence Rules

- Do not require a specific IDE.
- Do not require the physical root path.
- Do not require a particular shell profile.
- Do not store downloaded source artifacts as persistent dependencies.
- Do not rely on a local temporary file path from the ingestion machine.
- Do not run untrusted external code during capability discovery.

## Validation Contract

A healthy connection must pass:

```text
node 1_CORE/scripts/seosona_capability_bridge.js validate
npm run status
```

Validation confirms:

- Core files exist.
- The skills router is readable.
- Exported resource paths resolve inside SEOSONA OS.
- Skills, agents, workflows, KIs, raw data, SOPs, rules, and contracts are emitted with portable paths.
- The required agent-looping, thinking-model, and portable-bridge capabilities are routeable.
- No machine-specific paths are emitted by the bridge.
- Portability audit finds no machine-specific paths in semantic system surfaces.

TASK COMPLETED
