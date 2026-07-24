# SEOSONA Project Rules

This project is bound to SEOSONA OS through `seosona.project.json`.

## Startup Contract

1. Resolve SEOSONA OS through `~/.seosona`.
2. Read `~/.seosona/1_CORE/SOUL.md`.
3. Query `~/.seosona/1_CORE/scripts/seosona_capability_bridge.js` for routing.
4. Check project memory at `~/.seosona/3_MEMORY/projects/seosona-os/`.
5. Run project health with `npm run seosona:doctor` when available.

## Project Connector

- Manifest: `seosona.project.json`
- Memory namespace: `seosona-os`
- Publish/deploy actions require explicit user intent.

## System Guardrails

- **Tool Selection:** Always prioritize specific tools (e.g. `grep_search`, `replace_file_content`) over broad bash commands (`grep`, `sed`, `cat`).
- **Refactoring:** Major architectural changes require an `implementation_plan.md` and user approval before execution.
- **Context:** Always maintain and read `task.md` to prevent context drift during long tasks.

TASK COMPLETED
