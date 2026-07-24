# list — List All Playbooks

Show all playbooks with status summary.

## When to Use

User wants to see all active and completed playbooks at a glance.

## Process

1. **Scan Playbooks** — read `data/playbooks/` directory. For each subdirectory, load `manifest.json` via `scripts/manifest.cjs list`.

2. **Compute Progress** — for each playbook, count completed steps vs total steps.

3. **Display Table**
   ```
   Marketing Playbooks

   Name                  Template           Status      Progress      Last Updated
   Q1 Product Launch     product-hunt       active      12/20 (60%)  Mar 18
   Content Engine        content-engine     active       4/15 (27%)  Mar 17
   Holiday Campaign      campaign-sprint    completed   10/10 (100%) Mar 10
   ```

4. **Show Summary** — total playbooks, active count, completed count.

5. **Suggest Actions**
   - If active playbooks exist: `Run /ckm:play next <name> to continue.`
   - If no playbooks: `Run /ckm:play create to start a new playbook.`

## Error Handling

- No `data/playbooks/` directory → report no playbooks, suggest `/ckm:play create`.
- Corrupted manifest → skip that playbook, warn user, suggest `/ckm:play reset`.
