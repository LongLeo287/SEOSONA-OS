# Omniclaw Blackboard Protocol

## Purpose

Maintain explicit task state for multi-step SEOSONA work.

## State Fields

- `scope`: repositories and paths included in the task.
- `exclusions`: repositories and paths not to touch.
- `active_project`: current project namespace.
- `findings`: validated issues and risks.
- `actions`: completed edits or commands.
- `validation`: commands run and their result.
- `blockers`: unresolved failures that need a follow-up action.

## Rules

- Update state when scope changes.
- Keep exclusions visible.
- Do not claim completion while validation is failing.
- Convert reusable findings into project memory.

TASK COMPLETED
