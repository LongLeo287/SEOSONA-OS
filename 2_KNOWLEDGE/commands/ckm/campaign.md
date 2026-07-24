---
description: 💡💡 Create and manage marketing campaigns
argument-hint: [action] [name]
---

Create and manage marketing campaigns.

<args>$ARGUMENTS</args>

## Actions
- `create [name]` - Create new campaign
- `status [name]` - Get campaign status
- `analyze [name]` - Analyze campaign performance

## Workflow

1. **Parse Arguments**
   - Extract action (create/status/analyze) from `$ARGUMENTS`
   - Extract campaign name if provided

2. **Route to Action**
   - `create`: Launch campaign creation workflow
   - `status`: Query campaign status
   - `analyze`: Run performance analysis

3. **Campaign Creation Workflow** (for `create`)
   - Gather campaign requirements via `AskUserQuestion`
   - Use `campaign-manager` agent to generate campaign brief
   - Use `funnel-architect` agent to design campaign funnel
   - Activate `campaign-management` skill for templates
   - Output to `assets/campaigns/{date}-{campaign-slug}/`

4. **Status Check Workflow** (for `status`)
   - Read campaign files from `campaigns/`
   - Use `analytics-analyst` agent for metrics summary
   - Display progress, milestones, and blockers

5. **Analysis Workflow** (for `analyze`)
   - Use `analytics-analyst` agent for performance data
   - Use `campaign-debugger` agent for issue diagnosis
   - Generate report to `reports/campaign-analysis-{date}.md`

## Agents Used
- `campaign-manager` - Campaign orchestration
- `funnel-architect` - Funnel design
- `analytics-analyst` - Performance tracking
- `campaign-debugger` - Issue diagnosis

## Skills Used
- `campaign-management` - Templates and workflows
- `creativity` - Creative direction, style selection, color palettes for campaign briefs
- `assets-organizing` - Standardized output paths

## Output
- Campaign briefs → `assets/campaigns/{date}-{slug}/briefs/`
- Campaign creatives → `assets/campaigns/{date}-{slug}/creatives/`
- Campaign reports → `assets/campaigns/{date}-{slug}/reports/`
- Analysis reports → `assets/diagnostics/campaign-audits/{date}-{name}.md`

## Examples
```
/campaign create "Q1 Product Launch"
/campaign status "Q1 Product Launch"
/campaign analyze "Q1 Product Launch"
```
