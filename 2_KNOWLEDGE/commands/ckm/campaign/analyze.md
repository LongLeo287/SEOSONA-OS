---
description: 💡💡 Analyze campaign performance
argument-hint: [campaign-name]
---

Analyze marketing campaign performance with insights and recommendations.

<campaign_name>$ARGUMENTS</campaign_name>

## Workflow

1. **Gather Data**
   - Read campaign configuration from `campaigns/{name}/`
   - Use `analytics-analyst` agent for performance metrics
   - If MCP available, fetch real-time analytics

2. **Performance Analysis**
   - Use `campaign-debugger` agent for issue identification
   - Analyze conversion funnel
   - Compare against benchmarks
   - Identify top/bottom performers

3. **Generate Insights**
   - Use `funnel-architect` agent for optimization suggestions
   - Calculate ROI and attribution
   - Identify improvement opportunities

4. **Create Report**
   - Executive summary
   - Detailed metrics breakdown
   - Actionable recommendations
   - Output to `reports/campaign-analysis-{date}-{name}.md`

## Agents Used
- `analytics-analyst` - Performance data
- `campaign-debugger` - Issue diagnosis
- `funnel-architect` - Optimization

## Skills Used
- `analytics` - Metrics frameworks
- `campaign-management` - Analysis templates
- `assets-organizing` - Standardized output paths

## MCP Integrations
- GA4 - Traffic and conversion data
- Google Ads - Ad performance

## Output
- Analysis report → `assets/diagnostics/campaign-audits/{date}-{name}.md`

## Examples
```
/campaign/analyze "Q1 Product Launch"
/campaign/analyze "Black Friday Sale"
```
