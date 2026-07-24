---
name: review-gated-loops
description: "Design agent loops with explicit verification gates before execution and judging before delivery — Goal → Plan → Review → Deliver → Judge → Stop. Use when an agent task needs pre-flight checking, cross-model reviewer councils, or stop-conditions to avoid runaway/low-quality output. Complements the OS debate_protocol (post-output quality gate) with the pre-flight + loop-control half."
license: MIT
metadata:
  type: harness-pattern
  source: https://github.com/ksimback/looper
  complements: 1_CORE/scripts/core/debate_protocol.py
---

# Review-gated agent loops (looper)

[ksimback/looper](https://github.com/ksimback/looper) (MIT, Python) — a skill for
structuring agent loops with verification gates: **Goal → Plan → Review → Deliver →
Judge → Stop**. Two ideas worth adopting in the OS harness:

1. **Pre-flight verification gates** — validate the *plan* before executing (cheap
   to catch a bad approach before spending tokens/side-effects).
2. **Cross-model reviewer council** — have N independent reviewers (ideally different
   models) judge before delivery; require majority approval.

## Relation to the OS's `debate_protocol.py`
`1_CORE/scripts/core/debate_protocol.py` already runs a **post-output** gate
(`run_debate`): Round 1 internal-consistency, Round 2 knowledge-alignment vs vector
memory → APPROVED / NEEDS_REVISION. That is the *Judge* step.

looper adds the missing halves: the **pre-flight Review gate** (check the plan first)
and the **reviewer council** (multiple independent judges, not one pass). A natural
upgrade path: wrap dispatch so a task runs `plan → pre-flight gate → execute →
run_debate(output) → stop-or-revise`, and let `run_debate` call a small council of
reviewers instead of a single pass.

> debate_protocol is the *Judge*; looper is the *loop + gates* around it.
