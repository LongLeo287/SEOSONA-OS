---
name: seosona-task-intake
description: Connects Antigravity task intake to SEOSONA OS, SEOSONA Website context, capability routing, project memory, and validation commands.
---

# SEOSONA Task Intake

Use this skill whenever the user asks Antigravity to work on SEOSONA OS, SEOSONA Website, SEO operations, agent workflows, website tasks, audits, fixes, or task orchestration.

## Intake Procedure

1. Resolve SEOSONA OS through `~/.seosona`.
2. Read `~/.seosona/1_CORE/SOUL.md`.
3. Read `~/.seosona/2_KNOWLEDGE/MASTER_INDEX.md`.
4. Check `~/.seosona/3_MEMORY/knowledge_items/` for relevant Knowledge Items before new research.
5. Check project memory at `~/.seosona/3_MEMORY/projects/seosona-os/`.
6. Route the task:

```bash
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js route "<task>"
```

7. Run the autonomous activation gate so the system does not forget available KIs, skills, agents, workflows, and validation surfaces:

```bash
npm run autonomy:intake -- --task "<task>"
```

8. For website-specific work, inspect `.openai/hosting.json` and treat `https://github.com/LongLeo287/SEOSONA` as the active SEOSONA Website source when no local website checkout is present.
9. For complex work, create `implementation_plan.md` and `task.md` before editing.
10. For narrow fixes, update `task.md` with the active checklist and proceed.
11. Validate with the smallest relevant command, and always run `npm run seosona:doctor` before connection handoff.
12. Log major milestones through:

```bash
python ~/.seosona/1_CORE/scripts/memory_logger.py --source ANTIGRAVITY --type TASK_EVENT --status DONE --content "<summary>"
```

## Output Contract

- Keep system files in English.
- Use portable paths only: `~/.seosona`, `${SEOSONA_ROOT}`, or relative paths.
- Do not deploy, publish, or push git changes unless the user explicitly asks.
- Finish major task responses with `TASK COMPLETED`.
