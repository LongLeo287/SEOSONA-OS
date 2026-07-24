---
description: 💡💡 Generate periodic reports
argument-hint: [period]
---

Generate periodic marketing reports.

<period>$ARGUMENTS</period>

## Periods
- `daily` - Daily summary
- `weekly` - Weekly report
- `monthly` - Monthly review
- `quarterly` - Quarterly analysis

## Workflow

1. **Parse Period** from `$ARGUMENTS`

2. **Data Collection**
   - Use `analytics-analyst` agent for comprehensive data
   - Gather from all channels:
     - Website traffic
     - Email metrics
     - Social engagement
     - Campaign performance
     - Conversion data

3. **Report Generation**
   - Executive summary
   - Key metrics dashboard
   - Channel-by-channel breakdown
   - Goal progress
   - Highlights and lowlights
   - Recommendations

4. **Format**
   - Use `campaign-management` skill for templates
   - Include visualizations (tables, charts)
   - Comparison to previous period

5. **Output**
   - Report → `reports/periodic/{date}-{period}.md`

## Agents Used
- `analytics-analyst` - Data aggregation
- `campaign-manager` - Report structure

## Skills Used
- `analytics` - Metrics frameworks
- `campaign-management` - Report templates
- `assets-organizing` - Standardized output paths

## MCP Integrations
- GA4 - Website data
- Google Ads - Ad performance

## Output
- Report → `reports/periodic/{date}-{period}.md`

## Examples
```
/analyze/report daily
/analyze/report weekly
/analyze/report monthly
/analyze/report quarterly
```
