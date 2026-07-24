# Campaign Workflow

Single campaign lifecycle management from brief to post-mortem.

## Overview

| Field | Value |
|-------|-------|
| **Purpose** | Manage individual campaign lifecycle |
| **Agents** | campaign-manager, content-creator, funnel-architect, analytics-analyst |
| **Human Checkpoints** | Brief approval, Launch approval |

---

## Workflow Stages

### Stage 1: Campaign Brief

**Agent:** `campaign-manager`

**Actions:**
1. Define objectives (awareness, leads, sales)
2. Set target audience
3. Determine budget
4. Establish KPIs
5. Create timeline

**Output:** Campaign brief in `plans/campaigns/`

**Human Checkpoint:** Brief approval required

**Prompt Template:**
```
Create campaign brief for [campaign-name].
Objective: [objective]
Budget: [budget]
Timeline: [start] to [end]
Include: audience, channels, KPIs, success criteria
```

---

### Stage 2: Creative Development

**Agent:** `content-creator`, `copywriter`

**Actions:**
1. Ad copy variations
2. Visual concepts
3. Landing page content
4. Email templates

**Output:** Creative assets in `content/campaigns/[campaign-id]/`

**Prompt Template:**
```
Create creative assets for campaign [campaign-id].
Channels: [channels]
Messaging: [key-messages]
Include: headlines, descriptions, CTAs, visual direction
```

---

### Stage 3: Funnel Setup

**Agent:** `funnel-architect`

**Actions:**
1. Design conversion path
2. Setup tracking (UTMs, pixels)
3. Configure attribution
4. Create A/B test variants

**Output:** Funnel configuration doc

**Prompt Template:**
```
Design conversion funnel for [campaign-id].
Entry points: [traffic sources]
Goal: [conversion action]
Include: funnel stages, tracking setup, test variants
```

---

### Stage 4: Launch

**Agent:** `campaign-manager`

**Actions:**
1. Final checklist verification
2. Publish content
3. Activate ad campaigns
4. Start email sequences
5. Enable tracking

**Human Checkpoint:** Launch approval required

**Requires:** `approval-workflow` hook

**Prompt Template:**
```
Launch campaign [campaign-id].
Verify: tracking, creatives, targeting, budget.
Channels: [channels]
Start date: [date]
```

---

### Stage 5: Optimization

**Agent:** `campaign-debugger`, `analytics-analyst`

**Actions:**
1. Monitor performance daily
2. Analyze A/B test results
3. Adjust targeting
4. Optimize budget allocation
5. Pause underperformers

**Output:** Optimization reports

**Prompt Template:**
```
Optimize campaign [campaign-id].
Current metrics: [metrics]
Issues: [issues]
Recommend: targeting, budget, creative changes
```

---

### Stage 6: Post-Mortem

**Agent:** `analytics-analyst`

**Actions:**
1. Final performance analysis
2. ROI calculation
3. Learnings capture
4. Recommendations

**Output:** Campaign report in `plans/reports/`

**Prompt Template:**
```
Generate post-mortem for campaign [campaign-id].
Include: performance vs KPIs, ROI, key learnings.
Recommend: improvements for next campaign
```

---

## Agent Orchestration

```
[Brief] → [Creative] → [Funnel] → [Launch] → [Optimize] → [Post-Mortem]
    │          │           │          │           │             │
campaign-   content-    funnel-   campaign-  campaign-    analytics-
manager     creator    architect   manager    debugger      analyst
```

---

## Campaign Types

### Product Launch
- Focus: Awareness → Trial → Conversion
- Duration: 4-8 weeks
- Channels: All

### Lead Generation
- Focus: Capture → Nurture → Qualify
- Duration: Ongoing
- Channels: Content, Paid, Email

### Promotional
- Focus: Limited-time offer conversion
- Duration: 1-2 weeks
- Channels: Email, Paid, Social

### Brand Awareness
- Focus: Reach, Impressions, Engagement
- Duration: 2-4 weeks
- Channels: Social, Display, Content

---

## Integration Points

### Hooks Triggered
- `campaign-tracking` → All stage transitions
- `approval-workflow` → Before launch
- `brand-guidelines-reminder` → During creative

### Data Flow
- Brief → guides all subsequent stages
- Creative → feeds Launch
- Tracking → feeds Optimization
- Post-mortem → feeds next campaign

---

## Usage Example

```
/campaign create "Black Friday 2024"

# Triggers workflow:
1. campaign-manager: Brief creation (await approval)
2. content-creator: Promo creatives
3. funnel-architect: Landing page → Checkout funnel
4. campaign-manager: Launch checklist (await approval)
5. campaign-debugger: Daily optimization
6. analytics-analyst: Post-mortem report
```

---

## Success Metrics

- Reach (impressions, unique users)
- Engagement (clicks, interactions)
- Conversion (leads, sales)
- ROI (revenue / spend)
- Learnings (documented insights)
