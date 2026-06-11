# SEOSONA OS Operational Ecosystem

This document describes the standard operating model for SEOSONA OS as a portable AI operating system.

## 1. Core Mechanism

SEOSONA OS is not tied to one project folder, IDE, CLI, or physical installation path. It operates as a portable system graph.

The mechanism has four layers:

1. **Portable Anchor:** `~/.seosona` points to the active SEOSONA OS root.
2. **Environment Variable:** `${SEOSONA_ROOT}` can be used by scripts and runtime configs.
3. **Global Injection:** IDEs and CLIs receive a startup instruction that points them to `~/.seosona/1_CORE/SOUL.md`.
4. **Capability Bridge:** `~/.seosona/1_CORE/scripts/seosona_capability_bridge.js` exposes the system graph as portable JSON.

## 2. System Graph

The portable graph includes:

- Skills from `2_KNOWLEDGE/frameworks/`.
- Agents from `4_AGENTS/personas/`.
- Workflows from `1_CORE/workflows/` and `2_KNOWLEDGE/workflows/`.
- Knowledge Items from `3_MEMORY/knowledge_items/`.
- Raw references from `2_KNOWLEDGE/raw_data/`.
- SOPs from `2_KNOWLEDGE/sops/`.
- Rules and contracts from `1_CORE/`.

Connected tools should route through the bridge first when they need machine-readable discovery.

## 3. Daily Flow

1. Open any project folder.
2. Open any connected IDE, CLI, MCP client, or agent runtime.
3. The tool resolves SEOSONA through `~/.seosona`.
4. The tool reads `1_CORE/SOUL.md`.
5. The tool queries the bridge:

```bash
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js route "task description"
```

6. The tool loads the smallest useful set of resources.
7. The tool executes, verifies, and logs major work under `3_MEMORY/logs/`.

## 4. Administration

When adding or updating system knowledge:

- Add skills under `2_KNOWLEDGE/frameworks/`.
- Add agents under `4_AGENTS/personas/`.
- Add workflows under `1_CORE/workflows/` or `2_KNOWLEDGE/workflows/`.
- Add KIs under `3_MEMORY/knowledge_items/`.
- Add raw references under `2_KNOWLEDGE/raw_data/`.
- Add SOPs under `2_KNOWLEDGE/sops/`.
- Rebuild routing with `1_CORE/scripts/core/plugin_manager.py`.
- Validate with `npm run capabilities:validate` and `npm run status`.

Persistent instructions, docs, configs, skills, and memory must use `~/.seosona`, `${SEOSONA_ROOT}`, or relative paths. Physical installation paths are not allowed.

TASK COMPLETED
