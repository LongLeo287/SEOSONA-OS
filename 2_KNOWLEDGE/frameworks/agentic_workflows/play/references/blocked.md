# blocked — Show Blocked Steps

Diagnose what's stuck and how to unblock it.

## When to Use

User wants to understand why steps aren't progressing or what's holding up execution.

## Process

1. **Resolve Scope**
   - If `[name]` given: evaluate that playbook only.
   - If no name: evaluate all playbooks.

2. **Evaluate Graph** — run `scripts/graph.cjs evaluate <slug>` for each playbook. Collect all steps with status `blocked` or `gate-pending`.

3. **Analyze Each Blocked Step**
   For dependency-blocked steps:
   - Identify which upstream step(s) it depends on.
   - Show upstream step status and what it produces.
   - If upstream is `in-progress` → suggest checking on it or waiting.
   - If upstream is `pending` → suggest running it first.
   - If upstream is `gate-pending` → suggest approving the gate.

4. **Analyze Gate-Pending Steps**
   For steps awaiting manual gate approval:
   - Show gate criteria (what the expert template says to evaluate).
   - Show the step's output files for review.
   - Suggest: `/ckm:play gate {slug} {step} approve` or `reject`.

5. **Display Blocker Report**
   ```
   Blocked Steps: {playbook name}

   1. "Landing page copy" — blocked
      Waiting for: "Messaging framework" (in-progress)
      Action: Complete messaging framework first

   2. "Launch email sequence" — blocked
      Waiting for: "Landing page copy" (blocked), "Email list segment" (completed)
      Action: Unblock "Landing page copy" first (chain dependency)

   3. "Content quality review" — gate-pending
      Gate criteria: Review tone, accuracy, brand alignment
      Output: data/playbooks/launch/content/blog-posts.md
      Action: /ckm:play gate launch content-quality-review approve
   ```

6. **Suggest Unblock Path** — show the shortest path to unblock the most steps (identify critical chain).

## Error Handling

- No blocked steps → report "All clear" and suggest `/ckm:play next`.
- Circular dependency detected → report error in template, show cycle.
- Playbook not found → list available playbooks.
