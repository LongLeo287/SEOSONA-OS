# learn — Capture Reusable Patterns

Extract and store learnings from completed steps for future improvement.

## When to Use

User finished a step (or multiple steps) and wants to capture what worked, what didn't, and reusable patterns.

## Process

1. **Resolve Playbook** — if `[name]` given, use it. Otherwise find active playbook or ask.

2. **Identify Completed Steps** — read manifest, list recently completed steps (since last learning capture).

3. **Gather Feedback** — for each completed step, ask user via `AskUserQuestion`:
   - What worked well?
   - What would you change?
   - Any patterns to reuse?

4. **Extract Patterns** — from user feedback, extract generalizable patterns (not step-specific details). Each learning must have:
   - `category`: tone, structure, content-type, process, audience, channel
   - `pattern`: the reusable insight (1-2 sentences)
   - `source`: which step generated this learning
   - `example`: concrete example from the step output

5. **Store Learnings**
   - Append to `manifest.json` learnings array via `scripts/manifest.cjs learn <slug>`.
   - Write human-readable summary to `data/playbooks/{slug}/learnings.md`.

6. **Consolidation Check**
   - If learnings count exceeds 30: consolidate similar learnings.
   - Merge overlapping patterns, keep the most specific example.
   - Remove outdated or contradicted learnings.

7. **Confirm** — display stored learnings grouped by category. Show total count.

## Learning Application

Before any future skill/agent invocation within this playbook:
- Load learnings from manifest.
- Filter by relevance (matching category, related step type).
- Inject as constraints: "Based on previous learnings, apply these patterns: ..."

## Error Handling

- No completed steps → inform user, suggest running steps first.
- User provides no feedback → skip that step, don't create empty learnings.
- Consolidation conflicts → prefer newer learnings over older ones.
