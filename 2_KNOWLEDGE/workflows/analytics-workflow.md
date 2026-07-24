# Analytics Workflow

Performance measurement and reporting process.

## Overview

| Field | Value |
|-------|-------|
| **Purpose** | Measure, analyze, report marketing performance |
| **Agents** | analytics-analyst, campaign-debugger |
| **Human Checkpoints** | Strategic recommendations |

---

## Workflow Stages

### Stage 1: Data Collection

**Agent:** `analytics-analyst`

**Actions:**
1. GA4 data queries
2. Search Console metrics
3. Platform-specific data
4. CRM data export
5. Ad platform metrics

**Data Sources:**
- Google Analytics 4
- Google Search Console
- Social platform insights
- Email platform metrics
- Ad platforms (Google, Meta, etc.)

**Prompt Template:**
```
Collect analytics data for [period].
Sources: [GA4, GSC, social, email, ads]
Metrics: traffic, conversions, engagement, spend
Export to: plans/reports/data/[date]-raw-data.json
```

---

### Stage 2: Analysis

**Agent:** `analytics-analyst`

**Actions:**
1. Trend identification
2. Attribution modeling
3. Funnel analysis
4. Segment comparison
5. Anomaly detection

**Output:** Analysis findings

**Prompt Template:**
```
Analyze marketing data for [period].
Focus areas:
- Traffic trends by source
- Conversion funnel performance
- Top/bottom performing content
- Attribution by channel
Identify anomalies and opportunities.
```

---

### Stage 3: Reporting

**Agent:** `analytics-analyst`

**Actions:**
1. Dashboard updates
2. Scheduled reports
3. Executive summaries
4. Team-specific views

**Output:** Reports in `plans/reports/`

**Report Types:**
- Weekly performance summary
- Monthly marketing report
- Campaign-specific reports
- Channel deep-dives

**Prompt Template:**
```
Generate [report-type] for [period].
Audience: [executive/marketing/sales]
Include:
- Key metrics overview
- Trends and comparisons
- Top performers
- Areas of concern
- Visualizations (describe for implementation)
Save to: plans/reports/[date]-[report-type].md
```

---

### Stage 4: Insights & Actions

**Agent:** `analytics-analyst`

**Human Checkpoint:** Strategic recommendations

**Actions:**
1. Extract actionable insights
2. Prioritize recommendations
3. Define next steps
4. Set optimization targets

**Output:** Action items with priorities

**Prompt Template:**
```
Generate insights from [report-path].
Provide:
- Top 3 insights (data-backed)
- Recommended actions (prioritized)
- Expected impact
- Resources needed
Format as actionable tasks.
```

---

## Report Templates

### Weekly Performance Report
```markdown
# Weekly Performance: [Week]

## Key Metrics
| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Sessions | X | Y | +/-% |
| Conversions | X | Y | +/-% |
| Revenue | $X | $Y | +/-% |

## Highlights
- [Top 3 wins]

## Concerns
- [Areas needing attention]

## Next Week Focus
- [Priorities]
```

### Monthly Marketing Report
```markdown
# Monthly Marketing Report: [Month]

## Executive Summary
[2-3 sentence overview]

## Channel Performance
### Organic
### Paid
### Email
### Social

## Campaign Performance
[Active campaigns]

## Funnel Analysis
[Stage-by-stage conversion]

## Recommendations
[Prioritized action items]
```

---

## Metrics Framework

### Acquisition
- Sessions, Users, New Users
- Traffic by source/medium
- Bounce rate, Pages/session

### Engagement
- Time on site
- Scroll depth
- Event completions
- Content engagement

### Conversion
- Goal completions
- Conversion rate
- Revenue, AOV
- Lead quality

### Retention
- Return visitors
- Email engagement
- Customer LTV
- Churn rate

---

## Attribution Models

### First Touch
Credit to first interaction

### Last Touch
Credit to final interaction

### Linear
Equal credit across touchpoints

### Time Decay
More credit to recent touches

### Position-Based
40% first, 40% last, 20% middle

---

## Integration Points

### Hooks Triggered
- `campaign-tracking` → Data logged for analysis

### Data Flow
```
[Collection] → [Analysis] → [Reporting] → [Actions]
      ↑                                        │
      └────────── Iteration Loop ──────────────┘
```

### Tools/APIs
- GA4 API / BigQuery
- Google Search Console API
- Social platform APIs
- Email platform APIs

---

## Usage Example

```
/analyze:report "monthly"

# Triggers workflow:
1. analytics-analyst: Collect data from all sources
2. analytics-analyst: Analyze trends, funnels, attribution
3. analytics-analyst: Generate monthly report
4. analytics-analyst: Extract insights, recommend actions
```

---

## Success Metrics

- Report accuracy (data validation)
- Insight quality (actionability)
- Decision support (recommendations used)
- Time to insight (collection → action)
