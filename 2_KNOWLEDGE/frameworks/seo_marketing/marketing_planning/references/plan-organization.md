# Marketing Plan Organization

## Directory Structure

### Plan Location
Use `Plan dir:` from `## Naming` section injected by hooks.

**Example:** `plans/251101-1505-q1-campaign/` or `plans/product-launch-jan/`

### File Organization

```
{plan-dir}/
├── research/
│   ├── market-analysis.md
│   ├── competitor-audit.md
│   └── audience-insights.md
├── reports/
│   ├── campaign-brief.md
│   └── performance-benchmarks.md
├── plan.md                              # Overview access point
├── phase-01-strategy-foundation.md      # Goals, audience, positioning
├── phase-02-content-strategy.md         # Content pillars, calendar
├── phase-03-channel-execution.md        # Channel-specific tactics
├── phase-04-campaign-launch.md          # Launch timeline, assets
├── phase-05-optimization.md             # Testing, iteration
└── phase-06-measurement.md              # KPIs, reporting
```

## File Structure

### Overview Plan (plan.md)

**IMPORTANT:** All plan.md files MUST include YAML frontmatter.

**Example plan.md structure:**
```markdown
---
title: "Q1 Product Launch Campaign"
description: "Multi-channel launch campaign for new product line"
status: pending
priority: P1
effort: 40h
campaign_type: product_launch
channels: [email, social, paid, content]
budget: $10,000
target_kpi: 500 leads
created: 2025-12-16
---

# Q1 Product Launch Campaign

## Overview

Brief description of campaign objectives and expected outcomes.

## Phases

| # | Phase | Status | Effort | Link |
|---|-------|--------|--------|------|
| 1 | Strategy | Pending | 8h | [phase-01](./phase-01-strategy.md) |
| 2 | Content | Pending | 16h | [phase-02](./phase-02-content.md) |
| 3 | Execution | Pending | 12h | [phase-03](./phase-03-execution.md) |
| 4 | Optimization | Pending | 4h | [phase-04](./phase-04-optimization.md) |

## Budget Allocation

- Paid media: 50%
- Content production: 30%
- Tools/software: 10%
- Contingency: 10%
```

### Phase Files (phase-XX-name.md)

Each phase file should contain:

**Context Links**
- Links to research, brand docs, assets

**Overview**
- Priority and status
- Brief description
- Success metrics

**Strategy**
- Approach and tactics
- Target audience for this phase
- Key messages

**Deliverables**
- Content pieces to create
- Assets needed
- Templates to use

**Channel Tactics**
- Platform-specific actions
- Posting schedule
- Budget allocation

**Timeline**
- Key milestones
- Dependencies
- Deadlines

**Success Criteria**
- KPIs to measure
- Benchmarks to beat
- Reporting cadence
