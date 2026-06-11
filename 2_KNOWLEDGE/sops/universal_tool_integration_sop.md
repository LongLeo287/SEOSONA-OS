# Universal Tool Integration SOP

## Purpose

Ensure every IDE, CLI, MCP client, and agent runtime can use SEOSONA OS without depending on a specific machine, shell, drive, editor, or local installation path.

## Scope

This SOP applies to:

- Skills.
- Agents.
- Workflows.
- Knowledge Items.
- Raw data snapshots.
- SOPs.
- Rules.
- Contracts.
- System prompts.
- Runtime scripts that expose SEOSONA capabilities.

## Integration Rule

Every connected tool must treat SEOSONA OS as a portable system graph.

Allowed anchors:

- `~/.seosona`
- `${SEOSONA_ROOT}`
- Relative paths from the SEOSONA OS root

Forbidden anchors:

- Physical drive roots.
- Personal home-directory paths.
- Temporary ingestion paths.
- IDE-specific project paths.

## Startup Sequence

1. Resolve `~/.seosona` or `${SEOSONA_ROOT}`.
2. Read `1_CORE/SOUL.md`.
3. Read `2_KNOWLEDGE/MASTER_INDEX.md`.
4. Query `1_CORE/scripts/seosona_capability_bridge.js`.
5. Load only the resources required for the task.
6. Execute with the relevant skills, agents, workflows, and KIs.
7. Verify output.
8. Log major work under `3_MEMORY/logs/`.

## Bridge Commands

```bash
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js manifest
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js route "task description"
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js validate
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js audit-portability
```

## Knowledge Conversion Rule

When new data is ingested:

1. Store distilled knowledge, not machine-local source paths.
2. Promote reusable workflows into `SKILL.md` files.
3. Promote durable decisions into KIs.
4. Update indexes and routing.
5. Validate portability before commit.

## Validation

Before a task is considered complete, run:

```bash
npm run capabilities:validate
npm run status
```

The task is not complete if semantic system surfaces contain machine-specific paths.

TASK COMPLETED
