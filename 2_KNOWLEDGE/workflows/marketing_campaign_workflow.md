# Marketing Campaign Workflow

**Purpose:** End-to-end workflow for planning, executing, and analyzing marketing campaigns using SEOSONA OS capabilities.

---

## When to Use
- Launching a new product, feature, or service
- Running a content marketing campaign
- Planning an email marketing campaign
- Executing a seasonal or promotional campaign
- Coordinating multi-channel campaigns

---

## Campaign Types

| Type | Primary Channel | Key Skills | Duration |
|------|----------------|-----------|---------|
| Content Campaign | Organic SEO | `seo`, `copywriting`, `video_content` | 4-12 weeks |
| Email Campaign | Email | `email_marketing`, `copywriting` | 1-4 weeks |
| Product Launch | Multi-channel | All skills | 4-8 weeks |
| SEO Push | Organic | `seo`, `technical_seo_scanner`, `copywriting` | 8-16 weeks |
| Conversion Campaign | Paid + Landing pages | `cro`, `copywriting`, `funnel` | 2-6 weeks |

---

## Campaign Workflow

### Phase 1: Research & Strategy (Week 1)

**Data gathering:**
```python
# Run SEOSONA connectors relevant to campaign
python 1_CORE/scripts/run_full_audit.py --domain <domain> --connectors gsc,ga4,keywords,competitors
```

**Strategy decisions:**
- [ ] Define ONE primary campaign goal (traffic / leads / revenue / brand)
- [ ] Define target audience segment and awareness level
- [ ] Choose campaign type and primary channel
- [ ] Set SMART goal: "Increase [metric] from [X] to [Y] by [date]"
- [ ] Identify keywords/topics from `keyword_research_*_autocomplete.csv`
- [ ] Identify competitor gaps from `competitor_matrix_*.csv`
- [ ] Check existing content ranking from `gsc_report_*.csv`

**Brand context:**
- [ ] Read `3_MEMORY/specs/brand_guidelines_template.md`
- [ ] Confirm voice, tone, prohibited phrases

**Deliverable:** Campaign Brief (see template below)

---

### Phase 2: Content Creation (Weeks 1-3)

**Content planning:**
- [ ] Activate `content_strategist` agent to map content to campaign goal
- [ ] Create content briefs for all pieces
- [ ] Build content calendar with publish dates

**Copywriting:**
- [ ] Activate `copywriter` agent for all campaign copy
- [ ] Apply copywriting formula appropriate to campaign type:
  - Product launch → AIDA for launch emails, 4Ps for sales page
  - Content campaign → PAS for blog intro, BAB for case studies
  - Email campaign → curiosity gap subjects, benefit-led body

**Assets checklist:**
- [ ] Landing page copy (if campaign has dedicated LP)
- [ ] Email sequence (minimum 3 emails)
- [ ] Social copy variations (platform-specific)
- [ ] Blog/SEO content pieces
- [ ] Video scripts (if video channel included)

---

### Phase 3: Technical Setup (Week 2)

- [ ] Create/update landing page with CRO checklist from `cro` skill
- [ ] Set up tracking: UTM parameters for all campaign links
- [ ] Configure GA4 goals for campaign conversions
- [ ] Set up email sequence in ESP
- [ ] Test all links, forms, and CTAs
- [ ] Mobile preview for all pages and emails

---

### Phase 4: Launch (Week 3-4)

**Launch sequence:**
1. Publish landing page (if applicable)
2. Publish SEO content
3. Send launch email to list
4. Publish social content on schedule
5. Monitor for technical issues first 24h

**Real-time monitoring:**
- Form submission confirmation working?
- Thank you page loads?
- Email sequence triggered correctly?
- UTM tracking firing in GA4?

---

### Phase 5: Optimization (Ongoing)

**Weekly review (first 4 weeks):**
- [ ] Email: open rate, click rate, unsubscribe rate vs benchmarks
- [ ] Landing page: conversion rate vs `cro` skill benchmarks
- [ ] SEO content: rank tracking via `rank_tracker.py`
- [ ] Social: engagement rate, link clicks

**Optimization actions:**
- Email open rate < 20%? → A/B test subject lines
- Landing page conversion < 2%? → Activate `cro` skill audit
- Content not ranking? → Technical check + backlink gap analysis
- Social low engagement? → Test new hook/format

---

### Phase 6: Analysis & Report

**End-of-campaign data pull:**
```python
python 1_CORE/scripts/run_full_audit.py --domain <domain>
# Compare with pre-campaign baseline
```

**Report structure:**
```markdown
## Campaign Performance Report: [Campaign Name]

**Period:** [Start] → [End]
**Goal:** [SMART goal defined in Phase 1]
**Result:** [Achieved / Partially / Not achieved]

### Key Metrics
| Metric | Baseline | Result | Change |
|--------|---------|--------|--------|
| Organic traffic | X | Y | +Z% |
| Email list growth | X | Y | +Z |
| Conversions | X | Y | +Z% |
| Revenue impact | $X | $Y | +$Z |

### What Worked
- [Specific tactic + data]

### What Didn't
- [Specific issue + hypothesis why]

### Next Campaign Recommendations
- [Learnings to apply]
```

---

## Campaign Brief Template

```markdown
## Campaign Brief: [Name]

**Goal:** [One measurable outcome]
**Timeline:** [Start date] → [End date]
**Budget:** [If applicable]

### Audience
- Segment: [Who exactly]
- Awareness level: [Unaware / Problem-aware / Solution-aware / Product-aware]
- Top pain point: [One sentence]

### Message
- Core promise: [One sentence — what we're offering]
- Proof point: [Specific data/testimonial/case study]
- CTA: [One action we want]

### Channels
- Primary: [Channel]
- Supporting: [Channels]

### Content Plan
| Piece | Channel | Publish Date | Owner |
|-------|---------|-------------|-------|
| [Title] | [Channel] | [Date] | [Agent/Person] |

### Success Metrics
- Primary: [Metric + target]
- Secondary: [Metric + target]
```

---

## Integration with SEOSONA Connectors

| Campaign Phase | SEOSONA Connector | Data Used |
|---|---|---|
| Research | `keyword_connector` | Topic ideation |
| Research | `gsc_connector` | Existing content performance |
| Research | `serp_competitor` | Competitor analysis |
| Setup | `technical_seo_scanner` | Pre-campaign technical health |
| Analysis | `ga4_connector` | Conversion tracking |
| Analysis | `rank_tracker` | Keyword position changes |
| Analysis | `backlink_connector` | Campaign link building results |
