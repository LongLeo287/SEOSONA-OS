# status — Playbook Progress Dashboard

Show comprehensive status for one or all playbooks.

## When to Use

User wants an overview of playbook progress, blockers, and goal metrics.

## Process

1. **Resolve Scope**
   - If `[name]` given: load that playbook via `scripts/manifest.cjs read <slug>`.
   - If no name: scan `data/playbooks/` for all manifests. Show multi-playbook dashboard.

2. **Evaluate Graph** — run `scripts/graph.cjs evaluate <slug>` for each playbook. Detect stale steps (completed steps whose inputs have been re-run).

3. **Display Status Dashboard**

   For each playbook show:

   **Header**: playbook name, template, created date, last activity.

   **Progress Bar**: `[=========>......] 60% (12/20 steps)`

   **Stages** (grouped):
   ```
   Stage: Research & Discovery
     [x] Audience research .................. completed (Mar 15)
     [x] Competitor analysis ................ completed (Mar 16)
     [>] Market positioning ................. in-progress
     [ ] Messaging framework ................ pending (needs: positioning)

   Stage: Content Creation
     [ ] Landing page copy .................. blocked (needs: messaging)
     [!] Quality review ..................... gate-pending
   ```

   Status icons: `[x]` completed, `[>]` in-progress, `[ ]` pending, `[!]` gate-pending, `[~]` stale.

4. **Goal Progress** — run `scripts/goals.cjs pull <slug>`. Display:
   ```
   Goals:
     Traffic:  4,200 / 10,000  (42%)  ^12% this week
     Signups:    180 /    500  (36%)  ^8% this week
     Revenue: $2,100 / $5,000  (42%)  v3% this week
   ```

5. **Ready Steps + Smart Suggestions** — run `scripts/smart-suggest.cjs <slug>`. Show top 3 suggested next actions with reasoning.

6. **Suggest Action** — output: `Run /ckm:play next {slug} to execute the next step.`

## Error Handling

- No playbooks found → suggest `/ckm:play create`.
- Manifest corrupted → report error, suggest `/ckm:play reset`.
- Metrics fetch fails → show goals without current values, note API issue.
