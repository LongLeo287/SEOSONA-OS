# gate — Manual Quality Gate

Approve or reject a step awaiting human quality review.

## When to Use

A step has completed AI execution and is now `gate-pending` — requires human judgment before downstream steps can proceed.

## Process

### Approve: `gate <name> <step> approve`

1. Load manifest via `scripts/manifest.cjs read <slug>`.
2. Validate step exists and status is `gate-pending`. Error if not.
3. Set step status to `completed`.
4. Record gate result: `{decision: "approved", timestamp: now}`.
5. Update manifest via `scripts/manifest.cjs update <slug>`.
6. Run `scripts/graph.cjs evaluate <slug>` to recompute — newly unblocked downstream steps become `pending` (ready if all deps met).
7. Report: `Approved "{step}". {N} downstream steps now unblocked.`
8. Suggest: `/ckm:play next {slug}` to continue.

### Reject: `gate <name> <step> reject`

1. Load manifest, validate step is `gate-pending`.
2. Set step status to `in-progress` (needs revision).
3. Record gate result: `{decision: "rejected", timestamp: now}`.
4. Show gate criteria from template (what the expert says to evaluate).
5. Show step's output files so user knows what to review.
6. Ask user via `AskUserQuestion`: "What needs to change?" Store feedback.
7. Update manifest with rejection feedback.
8. Report: `Rejected "{step}". Step returned to in-progress for revision. Run /ckm:play next {slug} to re-execute.`

## Error Handling

- Step not gate-pending → show current status, explain when gates apply.
- Step not found → list valid step IDs.
- Playbook not found → list available playbooks.
- Missing approve/reject → prompt user to specify decision.
