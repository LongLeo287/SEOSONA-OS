---
name: skill
description: Guides agents through a file-backed Plan -> Work -> Review -> Release loop with explicit specs, Plans.md task contracts, verification evidence, independent review, and bounded long-running execution. Use for substantial SEOSONA work that must stay auditable across sessions or agents.
---

# Harness Delivery Loop

## Overview

Use this skill when chat memory is not enough. The loop converts a request into durable files, bounded work slices, independent review, and evidence packages that survive context resets.

## When To Use

- Multi-step implementation or ingestion work.
- Work that may span sessions.
- Work with high risk of scope drift.
- Work where review must be separate from implementation.

Do not use this for one-line fixes or simple questions.

## Operating Loop

1. Investigate.
   - Read the current repository state.
   - Reuse existing memory and KI items.
   - Keep unobserved facts marked as `unknown`.

2. Plan.
   - Write or update a spec when behavior, architecture, or scope is non-trivial.
   - Write or update `Plans.md` or an equivalent task checklist.
   - Include acceptance criteria, dependencies, stop conditions, and validation commands.

3. Work.
   - Execute one approved slice at a time.
   - Keep edits scoped to the active task.
   - Add tests or evidence proportional to risk.

4. Verify.
   - Run focused tests first.
   - Run broader gates when shared behavior, routing, or publication surfaces change.
   - Record exact commands and outcomes.

5. Review.
   - Review separately from implementation.
   - Check spec alignment, plan alignment, security, regressions, UX, and test evidence.
   - Major findings block completion.

6. Release or handoff.
   - Package evidence.
   - Commit/push only when explicitly requested or already authorized by the task.
   - Log memory/KI updates for durable learning.

## Long-Running Loop

For long-running work:

1. Reload the active plan at each re-entry.
2. Resolve the next incomplete task.
3. Verify the task contract before acting.
4. Recover memory/context.
5. Execute a bounded slice.
6. Record evidence and status.
7. Continue, schedule, or stop based on the plan.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The plan is in the conversation." | Chat context is volatile; file-backed plans are inspectable and resumable. |
| "Review can happen at the end." | Late review makes scope drift expensive. |
| "Unknown probably means absent." | Unknown means not observed; do not promote it to a claim. |
| "One big pass is faster." | Bounded slices reduce rollback cost and make verification meaningful. |

## Red Flags

- Work starts before the task boundary is clear.
- Plans list tasks without acceptance criteria.
- Verification evidence is reconstructed from memory.
- Review approves changes without command output or file references.
- The agent pushes changes without explicit publish intent.

## Verification

- [ ] Current scope is recorded.
- [ ] Each completed task has evidence.
- [ ] Review is separate from implementation.
- [ ] Remaining risks are explicit.
- [ ] Memory logging was run for major outcomes.
