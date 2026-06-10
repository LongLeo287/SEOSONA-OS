---
description: 💡 Get campaign status
argument-hint: [campaign-name]
---

Get the current status of a marketing campaign.

<campaign_name>$ARGUMENTS</campaign_name>

## Workflow

1. **Locate Campaign**
   - Search `campaigns/` directory for campaign files
   - If no name provided, list all active campaigns

2. **Gather Status**
   - Read campaign brief and timeline
   - Check milestone completion
   - Use `analytics-analyst` agent for current metrics

3. **Generate Report**
   - Campaign overview and goals
   - Progress against milestones
   - Key metrics and KPIs
   - Blockers and next steps

## Agents Used
- `analytics-analyst` - Metrics tracking
- `project-manager` - Progress tracking

## Output
- Status displayed in terminal
- Optional detailed report to `reports/`

## Examples
```
/campaign/status "Q1 Product Launch"
/campaign/status
```
