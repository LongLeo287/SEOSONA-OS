---
description: 💡💡💡 Create comprehensive digital marketing campaign
argument-hint: [campaign-type-or-brief]
---

Create effective digital marketing campaigns with strategy, execution plan, and creative direction.

<brief>$ARGUMENTS</brief>

## Your Mission

Design a comprehensive, executable marketing campaign using discovery, ideation, strategy selection, and detailed execution planning.

## Phase 1: Discovery

Use `AskUserQuestion` to gather campaign essentials:

**Question Set A (Campaign Foundation)**
- Campaign objective: Brand awareness | Lead generation | Sales conversion | Product launch | Re-engagement
- Target audience: Who are we reaching? (demographics, psychographics, pain points)
- Budget range: $500-2K | $2K-10K | $10K-50K | $50K+
- Timeline: 1-2 weeks | 1 month | 2-3 months | Ongoing

**Question Set B (Context)**
- Primary channels: Paid ads | Social organic | Email | Content | Influencer | Mix
- Existing assets: Landing page | Email list | Social following | Content library
- Success metrics: What defines campaign success?
- Brand guidelines: Any constraints or requirements?

Read `docs/brand-guidelines.md` for brand context. Activate `brand-guidelines` skill.

## Phase 2: Ideation & Options

Use `brainstormer` skill to enter brainstorming session and generate 3-5 campaign concepts:

For each concept provide:
1. **Campaign theme** - Core creative idea
2. **Hook angle** - Why audience will care
3. **Channel strategy** - Platform priorities
4. **Content pillars** - Key content types
5. **Differentiation** - Why this approach wins

Present options via `AskUserQuestion` for user selection.

## Phase 3: Strategy Development

Based on selected approach, use `campaign-manager` agent to create:

### 3.1 Campaign Brief
- Objective and KPIs
- Target audience profile
- Key messages (primary + supporting)
- Channel mix and budget allocation
- Timeline with milestones
- Success criteria

### 3.2 Funnel Architecture
Use `funnel-architect` agent:
- Design awareness → interest → consideration → decision flow
- Map touchpoints per stage
- Plan offer sequencing (Hormozi model)
- Define conversion triggers

### 3.3 Platform Strategy
Activate `ads-management` skill for paid channels:

| Platform | Role | Budget % | Objectives |
|----------|------|----------|------------|
| Google Ads | Intent capture | [%] | [objectives] |
| Meta Ads | Discovery + retargeting | [%] | [objectives] |
| LinkedIn | B2B targeting | [%] | [objectives] |
| TikTok | Awareness | [%] | [objectives] |

## Phase 4: Creative Direction

Use `content-creator` agent with `creativity` skill:

### 4.1 Content Plan
- Blog posts / articles
- Social media content calendar
- Video scripts (if applicable)
- Ad copy variations (5+ per platform)
- Email sequences

### 4.2 Ad Creative Briefs
For each platform:
- Ad format specs
- Copy variations (headlines, descriptions, CTAs)
- Visual direction
- A/B test plan

### 4.3 Landing Page Strategy
- Hero section copy
- Value proposition
- Social proof placement
- CTA structure

## Phase 5: Execution Plan

### 5.1 Pre-Launch Checklist
Activate `campaign-management` skill → `references/launch-checklist.md`
- Technical setup (pixels, tracking, UTMs)
- Platform configuration
- Asset approval workflow
- Team responsibilities

### 5.2 Launch Timeline
| Week | Phase | Activities | Deliverables |
|------|-------|------------|--------------|
| W-2 | Prep | Asset creation, setup | Creatives, tracking |
| W-1 | QA | Testing, approvals | Go/no-go decision |
| W1 | Launch | Activation, monitoring | Live campaigns |
| W2+ | Optimize | A/B testing, scaling | Performance reports |

### 5.3 Budget Allocation
Activate `campaign-management` skill → `references/budget-allocation.md`

## Phase 6: Tracking & Measurement

Use `analytics-analyst` agent. Activate `analytics` skill:

### 6.1 KPI Framework
| Metric | Target | Tracking Method |
|--------|--------|-----------------|
| Impressions | [X] | Platform analytics |
| CTR | [X%] | Platform analytics |
| CVR | [X%] | GA4 + pixel |
| CPA | $[X] | Attribution model |
| ROAS | [X]x | Revenue tracking |

### 6.2 Attribution Setup
- Define attribution model (first/last/linear/data-driven)
- UTM parameter schema
- Conversion event setup
- Cross-platform tracking

### 6.3 Reporting Cadence
- Daily: Spend pacing, anomaly detection
- Weekly: Performance summary, optimization actions
- Monthly: Full analysis, budget reallocation
- End: Post-mortem report

## Phase 7: Integration & Automation

### 7.1 MCP Integrations (if configured)
- `google-ads` - Campaign automation
- `google-analytics` - Performance data
- `sendgrid` / `resend` - Email delivery
- `slack` - Alerts and notifications

### 7.2 Automation Workflows
- Lead scoring triggers
- Retargeting sequences
- Email drip activation
- Alert thresholds

## Agents Used

| Agent | Role |
|-------|------|
| `campaign-manager` | Campaign orchestration, brief creation |
| `brainstormer` | Creative ideation, concept generation |
| `funnel-architect` | Funnel design, conversion optimization |
| `content-creator` | Content planning, copy creation |
| `copywriter` | Ad copy, landing page copy |
| `analytics-analyst` | Tracking setup, measurement |
| `ads-specialist` | Platform-specific ad strategies |

## Skills Activated

- `campaign-management` - Brief templates, launch checklist
- `ads-management` - Platform specs, ad copy templates
- `analytics` - KPI frameworks, attribution models
- `content-marketing` - Content strategy
- `email-marketing` - Email sequences
- `brand-guidelines` - Brand context injection
- `creativity` - Creative direction
- `assets-organizing` - Standardized output paths

## Output Structure

```
assets/campaigns/{date}-{campaign-slug}/
├── briefs/
│   ├── campaign-brief.md
│   ├── creative-brief.md
│   └── channel-briefs/
├── creatives/
│   ├── ads/{platform}/
│   ├── social/
│   └── email/
├── copy/
│   ├── landing-page.md
│   ├── ad-copy.md
│   └── email-sequences/
├── tracking/
│   ├── utm-schema.md
│   └── conversion-events.md
└── reports/
    └── {date}-campaign-plan.md
```

## Token Efficiency

- Use progressive disclosure: gather requirements first, then expand
- Parallelize agent calls where independent
- Reference skill templates instead of generating from scratch
- Focus on actionable outputs over comprehensive documentation

## Examples

```bash
/campaign:create "Q1 Product Launch"
/campaign:create "Black Friday sale for SaaS product"
/campaign:create "lead gen for enterprise B2B"
```
