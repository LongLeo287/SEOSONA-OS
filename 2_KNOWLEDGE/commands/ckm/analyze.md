---
description: 💡💡 Analytics and performance reports
argument-hint: [type]
---

Generate analytics and performance reports.

<type>$ARGUMENTS</type>

## Analysis Types
- `traffic` - Traffic analysis report
- `campaigns` - Campaign performance overview
- `conversions` - Conversion funnel analysis
- `funnel` - Sales funnel metrics
- `content` - Content performance analysis
- `engagement` - Engagement metrics

## Workflow

1. **Parse Analysis Type** from `$ARGUMENTS`

2. **Data Gathering**
   - Use `analytics-analyst` agent for data collection
   - Activate `analytics` skill
   - If MCP available (GA4), fetch real metrics
   - Otherwise, analyze available project data

3. **Analysis**
   - Perform type-specific analysis:
     - Traffic: sources, pages, trends
     - Campaigns: ROI, conversions, cost
     - Conversions: funnel stages, drop-offs
     - Content: engagement, shares, time-on-page
   - Benchmark against goals

4. **Insights Generation**
   - Identify trends and patterns
   - Highlight anomalies
   - Generate recommendations

5. **Output**
   - Report → `reports/analytics/{date}-{type}.md`

## Agents Used
- `analytics-analyst` - Data analysis
- `funnel-architect` - Funnel insights

## Skills Used
- `analytics` - Analysis frameworks

## MCP Integrations
- GA4 - Traffic and behavior data
- Search Console - Search performance

## Output
- Reports → `reports/analytics/{date}-{type}.md`

## Examples
```
/analyze traffic
/analyze campaigns
/analyze conversions
/analyze content
```
