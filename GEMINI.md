# SEOSONA Antigravity Bootstrap

This workspace is connected to SEOSONA OS.

## Startup

1. Resolve SEOSONA through `~/.seosona`.
2. Read `~/.seosona/1_CORE/SOUL.md`.
3. Check project memory at `~/.seosona/3_MEMORY/projects/seosona-os/`.
4. Route every task with:

```bash
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js route "<task>"
```

## Task Intake

- Create or update `task.md` for multi-step work.
- Create `implementation_plan.md` before broad architectural changes.
- Create `walkthrough.md` after implementation.
- Run `npm run seosona:doctor` before reporting connection status.
- Deployment, publishing, or git push requires explicit user intent.

## System Guardrails

- **Tool Selection:** Always prioritize specific tools (e.g. `grep_search`, `replace_file_content`) over broad bash commands (`grep`, `sed`, `cat`).
- **Refactoring:** Major architectural changes require an `implementation_plan.md` and user approval before execution.
- **Context:** Always maintain and read `task.md` to prevent context drift during long tasks.

TASK COMPLETED
