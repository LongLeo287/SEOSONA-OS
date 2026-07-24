# reset — Reset Playbook Steps

Reset a specific step or entire playbook to re-run.

## When to Use

User wants to redo a step (e.g., output wasn't satisfactory) or restart an entire playbook.

## Process

### Reset Single Step: `reset <name> <step>`

1. Load manifest via `scripts/manifest.cjs read <slug>`.
2. Validate step ID exists in manifest.
3. Set step status to `pending`. Clear completion timestamp and gate result.
4. Run `scripts/graph.cjs evaluate <slug>` to identify downstream steps.
5. Mark all downstream dependent steps as `stale` (they may need re-running with new input).
6. Update manifest via `scripts/manifest.cjs update <slug>`.
7. Confirm: `Reset "{step}" to pending. {N} downstream steps marked stale.`
8. Do NOT delete output files — user can clean up manually.

### Reset Entire Playbook: `reset <name>`

1. Confirm with user via `AskUserQuestion`: "Reset all steps in '{name}'? Output files will be preserved."
2. If confirmed: set all steps to `pending`, clear all timestamps and gate results.
3. Preserve: user inputs, goal targets, learnings (these are still valuable).
4. Update manifest via `scripts/manifest.cjs update <slug>`.
5. Confirm: `Reset all {N} steps in "{name}" to pending. Inputs and learnings preserved.`

## Error Handling

- Playbook not found → list available playbooks.
- Step not found → list valid step IDs for that playbook.
- User cancels full reset → abort, no changes.
