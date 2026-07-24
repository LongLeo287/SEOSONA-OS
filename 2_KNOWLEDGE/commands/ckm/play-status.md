---
description: "Show playbook progress dashboard"
argument-hint: "[playbook-name]"
---

Show playbook progress dashboard with stages, steps, goals, and blockers.

<args>status $ARGUMENTS</args>

## Workflow

1. **Parse Arguments** — extract optional playbook name from `$ARGUMENTS`
2. **Activate Skill** — route to `ckm:play` skill with `status $ARGUMENTS`

## Skill Used
- `ckm:play` — Marketing playbook orchestrator
