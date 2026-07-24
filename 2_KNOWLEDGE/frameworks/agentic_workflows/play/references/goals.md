# goals — Goal Tracker Dashboard

Set, pull, and view marketing goal metrics tied to playbook outcomes.

## When to Use

User wants to track business metrics, set targets, or pull latest data from integrations.

## Process

### No args: Show Goal Dashboard

1. Find active playbook (or ask user to specify).
2. Read goal targets and current values from manifest.
3. Run `scripts/goals.cjs display <slug>`.
4. Display:
   ```
   Goal Dashboard: {playbook name}

     Metric       Current    Target    Progress   Trend
     Traffic       4,200     10,000      42%       ^12%
     Signups         180        500      36%       ^8%
     Revenue      $2,100     $5,000      42%       v3%
     Email subs      320      1,000      32%       ^5%
   ```
5. Show which playbook steps impact each lagging metric.

### `set <metric> <target>`: Set Goal Target

1. Validate metric name exists in template's goal schema.
2. Run `scripts/goals.cjs set <slug> <metric> <target>`.
3. Update manifest with new target value.
4. Confirm: `Set {metric} target to {target}.`
5. Show updated goal dashboard.

### `pull`: Pull Latest Metrics

1. Run `scripts/goals.cjs pull <slug>`.
2. For each configured metric source:
   - GA4 traffic/conversions → via `scripts/metrics-bridge.cjs ga4`
   - GSC impressions/clicks → via `scripts/metrics-bridge.cjs gsc`
   - Stripe revenue → via `scripts/metrics-bridge.cjs stripe`
   - Email stats → via `scripts/metrics-bridge.cjs email`
3. Update manifest with fresh values and compute trends.
4. If no API configured for a metric → prompt user for manual input via `AskUserQuestion`.
5. Display updated goal dashboard with trend arrows.

## Error Handling

- No goals defined → suggest setting goals or using a template with built-in goals.
- API key missing → fall back to manual input, note which integration to configure.
- Invalid metric name → list valid metrics from template schema.
- Invalid target value → show expected format (number, currency, percentage).
