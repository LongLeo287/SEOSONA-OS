---
name: seosona:funnel
description: >-
  Marketing funnel design, analysis, and optimization. Maps website traffic
  data from GSC/GA4 to funnel stages. Designs complete conversion funnels
  from traffic source to post-purchase. Activate when user asks to design
  a funnel, optimize conversions, analyze drop-off points, or map the customer
  journey. Keywords: "funnel", "conversion", "customer journey", "drop-off",
  "lead capture", "sales page", "checkout optimization".
argument-hint: "[design|analyze|optimize] [funnel-type]"
version: "1.0.0"
---

# Marketing Funnel

Design and optimize complete marketing funnels integrated with SEOSONA SEO data.

## Funnel Types

| Type | Use Case | Stages |
|------|----------|--------|
| **Lead Magnet** | B2B lead generation | Traffic → Landing → Opt-in → Nurture → Qualify → Close |
| **Webinar** | High-ticket products | Traffic → Registration → Show up → Offer → Close |
| **Product Launch** | New product/feature | Awareness → Interest → Desire → Launch → Upsell |
| **Evergreen** | Automated sales | Traffic → Content → Email → Offer → Close |
| **Tripwire** | Low-ticket entry | Traffic → Free offer → Low-ticket → Core offer → Upsell |
| **SEO Funnel** | Organic traffic | Awareness content → Consideration content → Decision content → CTA |

## Standard Funnel Stages

```
TOFU (Top of Funnel) — Awareness
  └── Traffic source: organic, paid, social, referral
  └── Content: blog posts, videos, social content
  └── Goal: reach, impressions, traffic volume
  └── SEOSONA data: GSC impressions, keyword rankings

MOFU (Middle of Funnel) — Consideration  
  └── Landing pages, lead magnets, webinars
  └── Goal: leads, email subscribers, qualified prospects
  └── SEOSONA data: GA4 goals, landing page performance

BOFU (Bottom of Funnel) — Decision
  └── Sales pages, demos, trials, pricing
  └── Goal: conversions, revenue, customers
  └── SEOSONA data: GA4 e-commerce events, conversion rate

POST-PURCHASE — Retention & Upsell
  └── Onboarding, upsell sequences, referral programs
  └── Goal: LTV, NPS, referrals
```

## SEOSONA Data → Funnel Mapping

Map real data from connectors to funnel analysis:

### GSC Data → TOFU Analysis
```python
# From gsc_report_*.csv
TOFU Metrics:
- impressions → reach potential
- clicks → actual TOFU traffic
- CTR → headline/meta effectiveness
- avg_position → visibility score

Top TOFU keywords (informational intent):
- "how to [problem]"
- "what is [topic]"
- "[topic] guide"
- "[topic] examples"
```

### GA4 Data → MOFU Analysis
```python
# From ga4_report_*.csv
MOFU Metrics:
- page_views → content consumption
- avg_session_duration → engagement depth
- bounce_rate → relevance signal
- goal_completions → lead capture rate
```

### GSC + GA4 Combined → Content Gap Analysis
```
High GSC impressions + Low GA4 traffic
  → CTR problem → Fix meta titles/descriptions

High GA4 traffic + Low conversions
  → CRO problem → Fix landing page, CTA, offer

High conversions on some pages, zero on others
  → Intent mismatch → Content/offer alignment needed
```

## Funnel Design Framework

### Step 1: Define the Job to Be Done
What outcome does the customer want? Design funnel around the outcome, not your product.

### Step 2: Map Awareness Levels
| Level | What They Know | Content Type |
|-------|---------------|--------------|
| Unaware | Nothing | Attention-grabbing content, hooks |
| Problem-aware | They have a problem | Problem-focused content |
| Solution-aware | Solutions exist | Comparison content |
| Product-aware | Your product exists | Feature/benefit content |
| Most aware | Ready to buy | Offer, CTA, proof |

### Step 3: Design Stage-by-Stage
For each stage define:
- **Traffic source** — where do they come from?
- **Content/page** — what do they see?
- **Single goal** — one action we want
- **Metric** — how we measure success
- **Drop-off fix** — what to do if conversion is low

### Step 4: Set Conversion Benchmarks

| Funnel Stage | Good Rate | Average Rate |
|---|---|---|
| Landing page opt-in | 30-50% | 10-20% |
| Email open rate | 25-35% | 15-25% |
| Email click rate | 5-10% | 2-5% |
| Sales page conversion | 3-8% | 1-3% |
| Checkout completion | 60-80% | 40-60% |
| Upsell take rate | 20-40% | 10-20% |

## Funnel Analysis Checklist

### Traffic Quality (TOFU)
- [ ] Are keywords informational or transactional?
- [ ] What is the awareness level of organic traffic?
- [ ] Are top landing pages aligned with funnel entry points?
- [ ] What is the organic CTR? (Target: 3%+ for position 1-3)

### Lead Capture (MOFU)
- [ ] Is the lead magnet valuable enough to exchange email for?
- [ ] How many form fields? (Less = higher conversion)
- [ ] Is there a clear value proposition above the form?
- [ ] What is the page load speed? (Each second costs ~20% conversion)

### Conversion (BOFU)
- [ ] Does the sales/pricing page handle all objections?
- [ ] Is social proof visible above the fold?
- [ ] Is the CTA specific and benefit-led?
- [ ] Is there a money-back guarantee or risk reversal?

## Optimization Priorities

Rank by: (Impact × Likelihood) / Effort

### High Impact Fixes
1. **Headline** — 80% of visitors decide to stay or leave based on headline
2. **Page load speed** — 1s delay = 7% conversion drop (Google study)
3. **Form field reduction** — each field removed = ~10% more completions
4. **Social proof placement** — near CTA increases conversion 20-34%
5. **CTA copy** — specific beats generic ("Get My Free Audit" vs "Submit")

### A/B Test Priority Queue
1. Headline (highest leverage)
2. CTA copy + color
3. Form fields (remove one at a time)
4. Social proof placement
5. Hero image vs no image
6. Pricing display (monthly vs annual first)
7. Page length (long vs short)

## Output Templates

### Funnel Map
```markdown
## [Product/Service] Funnel Map

**Entry:** [Traffic source + volume]
**Goal:** [Primary conversion metric]

| Stage | Page/Action | Metric | Current | Target |
|-------|-------------|--------|---------|--------|
| TOFU  | Blog posts  | Visits | X/month | Y/month |
| MOFU  | Lead magnet | Opt-ins | X% | Y% |
| BOFU  | Sales page  | Conversions | X% | Y% |

**Primary drop-off:** [Stage with biggest gap]
**Immediate fix:** [One action to take this week]
```

## Agent Integration

**Primary:** Use for funnel design and conversion analysis
**Related skills:** `cro`, `copywriting`, `marketing_psychology`, `seo`
**Data sources:** `gsc_connector`, `ga4_connector`, `keyword_connector`
