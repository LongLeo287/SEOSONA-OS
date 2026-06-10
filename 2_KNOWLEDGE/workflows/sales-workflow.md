# Sales Workflow

Lead-to-customer journey automation from generation to expansion.

## Overview

| Field | Value |
|-------|-------|
| **Purpose** | Convert leads to customers, expand accounts |
| **Agents** | attraction-specialist, lead-qualifier, email-wizard, sale-enabler, upsell-maximizer |
| **Human Checkpoints** | High-value lead handoff, Close deals |

---

## Workflow Stages

### Stage 1: Lead Generation

**Agent:** `attraction-specialist`

**Actions:**
1. Create lead magnets
2. SEO content for TOFU
3. Landing page optimization
4. Lead capture forms

**Output:** Lead gen assets, captured leads

**Prompt Template:**
```
Create lead generation assets for [product/service].
Target: [audience]
Include: lead magnet concept, landing page copy, SEO keywords
```

---

### Stage 2: Lead Qualification

**Agent:** `lead-qualifier`

**Actions:**
1. Score leads (demographic + behavioral)
2. Segment by intent
3. Identify sales-ready leads
4. Flag high-value prospects

**Output:** Qualified lead list, scoring report

**Prompt Template:**
```
Qualify leads from [source].
Scoring criteria: [criteria]
Segment into: cold, warm, hot
Flag high-value prospects for human review.
```

---

### Stage 3: Nurture Sequence

**Agent:** `email-wizard`

**Actions:**
1. Design drip campaigns
2. Personalize content
3. A/B test sequences
4. Optimize timing

**Output:** Email sequences in `content/emails/`

**Prompt Template:**
```
Create nurture sequence for [segment].
Journey: awareness → consideration → decision
Length: [X] emails over [Y] days
Include: subject lines, body, CTAs
```

---

### Stage 4: Sales Enablement

**Agent:** `sale-enabler`

**Actions:**
1. Create pitch decks
2. Build objection handlers
3. Generate case studies
4. Prepare proposals

**Output:** Sales collateral in `content/sales/`

**Human Checkpoint:** High-value deal support

**Prompt Template:**
```
Create sales materials for [prospect/segment].
Include: pitch deck, objection responses, relevant case study.
Customize for: [pain points, industry]
```

---

### Stage 5: Upsell & Cross-sell

**Agent:** `upsell-maximizer`

**Actions:**
1. Identify expansion opportunities
2. Product recommendations
3. Upgrade campaigns
4. Retention offers

**Output:** Expansion campaign assets

**Prompt Template:**
```
Create upsell strategy for [customer segment].
Current product: [product]
Expansion targets: [products/features]
Include: messaging, offers, timing
```

---

## Agent Orchestration

```
[Generation] → [Qualification] → [Nurture] → [Enablement] → [Expansion]
      │              │              │             │              │
attraction-     lead-         email-       sale-         upsell-
specialist     qualifier       wizard      enabler       maximizer
```

---

## Lead Scoring Model

| Signal | Points | Weight |
|--------|--------|--------|
| Email open | +5 | Low |
| Link click | +10 | Medium |
| Content download | +20 | High |
| Pricing page visit | +30 | Very High |
| Demo request | +50 | Critical |
| Company size match | +15 | Medium |
| Industry fit | +15 | Medium |

**Thresholds:**
- Cold: 0-30 points
- Warm: 31-60 points
- Hot: 61+ points
- Sales-ready: 80+ points

---

## Integration Points

### Hooks Triggered
- `campaign-tracking` → Lead captured, stage transition
- `brand-guidelines-reminder` → Before content creation

### Data Flow
- Lead capture → Qualification
- Scoring → Nurture segment assignment
- Engagement → Score updates
- Sales-ready → Human handoff

---

## Usage Example

```
/funnel design "SaaS Trial Conversion"

# Triggers workflow:
1. attraction-specialist: Lead magnet, landing page
2. lead-qualifier: Setup scoring, segments
3. email-wizard: Nurture sequences by segment
4. sale-enabler: Demo support materials
5. upsell-maximizer: Trial → Paid conversion offers
```

---

## Success Metrics

- Lead volume (MQLs generated)
- Qualification accuracy (MQL → SQL rate)
- Nurture engagement (open rate, click rate)
- Conversion rate (lead → customer)
- Expansion revenue (upsell success)
