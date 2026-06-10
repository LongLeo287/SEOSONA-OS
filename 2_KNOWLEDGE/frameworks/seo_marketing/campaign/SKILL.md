---
name: ckm:campaign
description: Marketing campaign planning, execution, optimization. Create campaigns, track status, analyze performance, manage budgets, coordinate multi-channel efforts.
argument-hint: "[create|status|analyze|email] [name]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Campaign

End-to-end campaign planning, execution, and optimization.

<args>$ARGUMENTS</args>

## When to Use

- Campaign planning and launch execution
- Multi-channel coordination
- Budget allocation and timeline management
- Performance tracking and optimization
- Email campaign management

## Campaign Types

Product Launch, Seasonal/Promotional, Brand Awareness, Lead Generation, Re-engagement

## Workflow

1. **Parse Arguments** — extract action + campaign name from `$ARGUMENTS`
2. **Route to Action:**
   - `create`: Gather requirements → `campaign-manager` agent → `funnel-architect` agent → output to `assets/campaigns/`
   - `status`: Read campaign files → `analytics-analyst` agent → display progress
   - `analyze`: `analytics-analyst` + `campaign-debugger` agents → generate report
   - `email`: Email campaign creation and management

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `analyze` | Analyze campaign performance | `references/analyze.md` |
| `create` | Create comprehensive digital marketing campaign | `references/create.md` |
| `email` | Email campaign management | `references/email.md` |
| `status` | Get campaign status | `references/status.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Campaign Brief | `references/campaign-brief.md` |
| Launch Checklist | `references/launch-checklist.md` |
| Budget Allocation | `references/budget-allocation.md` |
| Optimization Framework | `references/optimization-framework.md` |

## Agents Used

- `campaign-manager` — Campaign orchestration
- `funnel-architect` — Funnel design
- `analytics-analyst` — Performance tracking
- `campaign-debugger` — Issue diagnosis

## Output

- Campaign briefs → `assets/campaigns/{date}-{slug}/briefs/`
- Campaign creatives → `assets/campaigns/{date}-{slug}/creatives/`
- Campaign reports → `assets/campaigns/{date}-{slug}/reports/`
- Analysis reports → `assets/diagnostics/campaign-audits/{date}-{name}.md`

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
