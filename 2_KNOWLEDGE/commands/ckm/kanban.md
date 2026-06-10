---
description: AI agent orchestration board (Coming Soon)
arguments:
  - name: dir
    description: Plans directory (default: ./plans)
    required: false
---

Plans dashboard with progress tracking and timeline visualization.

## Usage

- `/kanban` - View dashboard for ./plans directory
- `/kanban plans/` - View dashboard for specific directory
- `/kanban --stop` - Stop running server

## Features

- Plan cards with progress bars
- Phase status breakdown (completed, in-progress, pending)
- Timeline/Gantt visualization
- Activity heatmap
- Issue and branch links

## Execution

```bash
# Check if --stop flag
if [[ "$ARGUMENTS" == *"--stop"* ]]; then
  node .claude/skills/plans-kanban/scripts/server.cjs --stop
  exit 0
fi

# Determine plans directory
INPUT_DIR="{{dir}}"
PLANS_DIR="${INPUT_DIR:-./plans}"

# Start kanban dashboard
node .claude/skills/plans-kanban/scripts/server.cjs \
  --dir "$PLANS_DIR" \
  --host 0.0.0.0 \
  --open \
  --background
```

Report the URL to the user. For remote access from other devices, use the `networkUrl` field from the JSON output.

## Future Plans

The `/kanban` command will evolve into **VibeKanban-inspired** AI agent orchestration:

### Phase 1 (Current - MVP)
- ✅ Task board with progress tracking
- ✅ Visual representation of plans/tasks
- ✅ Click to view plan details

### Phase 2 (Worktree Integration)
- Create tasks → spawn git worktrees
- Assign agents to tasks
- Track agent progress per worktree

### Phase 3 (Full Orchestration)
- Parallel agent execution monitoring
- Code diff/review interface
- PR creation workflow
- Agent output streaming
- Conflict detection

Track progress: https://github.com/claudekit/claudekit-engineer/issues/189
