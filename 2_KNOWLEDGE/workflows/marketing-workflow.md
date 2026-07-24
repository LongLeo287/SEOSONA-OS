# Marketing Workflow

End-to-end marketing process orchestration from research to measurement.

## Overview

| Field | Value |
|-------|-------|
| **Purpose** | Orchestrate complete marketing cycle |
| **Agents** | researcher, planner, content-creator, content-reviewer, social-media-manager, analytics-analyst |
| **Human Checkpoints** | Strategy approval, Content approval |

---

## Workflow Stages

### Stage 1: Research & Insights

**Agent:** `researcher`

**Actions:**
1. Competitive analysis
2. Audience research
3. Market trends
4. Keyword opportunities

**Output:** Research reports in `plans/reports/`

**Prompt Template:**
```
Research [topic/market] for marketing campaign.
Include: competitor analysis, audience insights, trends.
Save report to plans/reports/[date]-research-[topic].md
```

---

### Stage 2: Strategy & Planning

**Agent:** `planner`

**Actions:**
1. Define campaign objectives
2. Select channels
3. Set KPIs
4. Create timeline

**Output:** Marketing plan in `plans/`

**Human Checkpoint:** Strategy approval required

**Prompt Template:**
```
Create marketing strategy for [objective].
Based on research: [research-report-path]
Include: channels, KPIs, timeline.
Save to plans/[date]-marketing-strategy.md
```

---

### Stage 3: Content Creation

**Agent:** `content-creator`

**Actions:**
1. Generate content drafts
2. Create ad copy
3. Design assets
4. SEO optimization

**Output:** Content drafts in `content/drafts/`

**Requires:** Brand guidelines hook active

**Prompt Template:**
```
Create [content-type] for [campaign].
Target audience: [audience]
Tone: [brand-voice]
Include: headlines, body, CTAs
```

---

### Stage 4: Review & Approval

**Agent:** `content-reviewer`

**Actions:**
1. Brand compliance check
2. Fact verification
3. Grammar/style review
4. SEO validation

**Human Checkpoint:** Content approval required

**Prompt Template:**
```
Review content at [path].
Check: brand alignment, accuracy, SEO, conversion potential.
Report issues and recommendations.
```

---

### Stage 5: Distribution

**Agent:** `social-media-manager`, `email-wizard`

**Actions:**
1. Schedule social posts
2. Launch email campaigns
3. Publish blog content
4. Activate ads

**Requires:** Approval workflow hook

**Prompt Template:**
```
Distribute approved content.
Channels: [channels]
Schedule: [dates/times]
Track with campaign ID: [campaign-id]
```

---

### Stage 6: Measurement

**Agent:** `analytics-analyst`

**Actions:**
1. Track performance metrics
2. Attribution analysis
3. Generate reports
4. Recommend optimizations

**Output:** Analytics reports in `plans/reports/`

**Prompt Template:**
```
Analyze campaign [campaign-id] performance.
Metrics: traffic, conversions, engagement, ROI.
Compare to KPIs. Recommend next steps.
```

---

## Agent Orchestration

```
[Research] → [Strategy] → [Content] → [Review] → [Distribution] → [Measurement]
     │            │            │           │             │              │
researcher    planner    content-    content-     social-media-   analytics-
                         creator     reviewer       manager        analyst
```

---

## Integration Points

### Hooks Triggered
- `brand-guidelines-reminder` → Before content-creator
- `campaign-tracking` → After each stage
- `approval-workflow` → Before distribution

### Data Flow
- Research → feeds Strategy
- Strategy → guides Content
- Review → gates Distribution
- Measurement → informs next cycle

---

## Usage Example

```
/campaign launch "Q1 Product Launch"

# Triggers workflow:
1. researcher: Market analysis
2. planner: Campaign strategy (await approval)
3. content-creator: Landing page, emails, social posts
4. content-reviewer: Review all assets (await approval)
5. social-media-manager: Schedule distribution
6. analytics-analyst: Track and report
```

---

## Success Metrics

- Research depth (sources, insights)
- Strategy alignment (objectives → tactics)
- Content quality (brand compliance, engagement)
- Distribution timing (on-schedule)
- Performance (vs KPIs)
