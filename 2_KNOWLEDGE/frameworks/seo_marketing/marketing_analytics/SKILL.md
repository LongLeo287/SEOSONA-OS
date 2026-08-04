---

name: marketing_analytics
description: "Performance measurement, attribution modeling, and data-driven optimization."
  Marketing analytics, KPI frameworks, attribution modeling, ROI calculation,
  campaign performance analysis, and reporting. Integrates with SEOSONA's
  GA4 and GSC connectors for data-driven decisions.
  Keywords: "analytics", "phân tích", "KPI", "ROI", "attribution", "reporting",
  "campaign performance", "conversion tracking", "metrics", "dashboard",
  "marketing data", "performance analysis".
argument-hint: "[kpi|attribution|report|analyze] [metric]"
version: "1.0.0"
---

# Marketing Analytics

Performance measurement, attribution modeling, and data-driven optimization.

## SEOSONA Data Sources

| Connector | Data Available | Key Metrics |
|-----------|---------------|-------------|
| `gsc_connector` | Organic search | Impressions, clicks, CTR, position |
| `ga4_connector` | Website traffic | Sessions, conversions, revenue, LTV |
| `rank_tracker` | Keyword rankings | Position changes, quick wins |
| `backlink_connector` | Link profile | DR, dofollow count, anchor text |
| `technical_seo_scanner` | Site health | Issues, speed, Core Web Vitals |

---

## Core Marketing KPI Framework

### Acquisition KPIs
| KPI | Formula | Target |
|-----|---------|--------|
| CAC (Customer Acquisition Cost) | Total marketing spend ÷ New customers | Varies by model |
| CPL (Cost Per Lead) | Total spend ÷ Leads generated | < LTV × conversion rate |
| Organic CTR | (Clicks ÷ Impressions) × 100 | >3% for positions 1-3 |
| Traffic growth MoM | (This month - Last month) ÷ Last month | +5-15% MoM |

### Engagement KPIs
| KPI | Formula | Benchmark |
|-----|---------|-----------|
| Bounce rate | Single-page sessions ÷ Total sessions | <60% ideal |
| Session duration | Total time ÷ Sessions | >2 min for content |
| Pages per session | Total pageviews ÷ Sessions | >2 pages |
| Email open rate | Opens ÷ Delivered | >25% |
| Email CTR | Clicks ÷ Delivered | >3% |

### Conversion KPIs
| KPI | Formula | Target |
|-----|---------|--------|
| CVR (Conversion Rate) | Conversions ÷ Visitors | >2-5% (varies) |
| ROAS | Revenue ÷ Ad spend | >3:1 minimum |
| MQL-to-SQL rate | SQLs ÷ MQLs | >30% |
| Trial-to-paid | Paid users ÷ Trial users | >25% |

### Retention KPIs
| KPI | Formula | Target |
|-----|---------|--------|
| LTV (Lifetime Value) | ARPU × Average customer lifespan | >3× CAC |
| Monthly churn | Churned ÷ Total at start of month | <3% MoM |
| NPS | % Promoters - % Detractors | >50 |
| DAU/MAU ratio | Daily active users ÷ Monthly active | >20% |

---

## Attribution Models

| Model | How It Works | Use When |
|-------|-------------|---------|
| **Last-click** | 100% credit to last touchpoint | Direct response, short cycles |
| **First-click** | 100% credit to first touchpoint | Brand awareness evaluation |
| **Linear** | Equal credit to all touchpoints | Long complex journeys |
| **Time-decay** | More credit to recent touchpoints | Short sales cycles |
| **Position-based** | 40% first + 40% last + 20% middle | Most B2B |
| **Data-driven** (GA4) | ML model based on actual paths | Best when enough data |

**Attribution rule of thumb:**
- Platform data is inflated (each claims credit)
- Use UTM parameters on ALL external links
- Compare platform data vs GA4 for truth
- Blended CAC (total spend ÷ total customers) is more honest than channel CPA

### UTM Parameter Template
```
utm_source=[where traffic comes from: google, facebook, newsletter]
utm_medium=[channel type: cpc, email, social, organic]
utm_campaign=[campaign name: spring-launch, brand]
utm_content=[ad variation: headline-a, hero-image]
utm_term=[keyword for paid: seo-audit-tool]
```

Example: `?utm_source=newsletter&utm_medium=email&utm_campaign=weekly&utm_content=cta-top`

---

## Reporting Cadence

| Cadence | What to Review | Who |
|---------|---------------|-----|
| **Daily** | Paid spend, conversion count, critical alerts | Performance team |
| **Weekly** | Channel performance vs. targets, quick wins | Marketing team |
| **Monthly** | Full funnel, trends, ROI by channel, optimizations | Leadership |
| **Quarterly** | Strategic review, attribution, LTV cohorts, testing roadmap | All stakeholders |

---

## Campaign Performance Analysis Workflow

### Step 1: Define Success Metrics (before campaign)
- Primary goal: [specific metric + target]
- Time period: [start] → [end]
- Baseline: [current state for comparison]

### Step 2: During Campaign — Weekly Check
```
[ ] Spend pacing (on track vs. budget?)
[ ] CPA/ROAS vs. targets
[ ] Top and bottom performing ads/content
[ ] Audience performance breakdown
[ ] Landing page conversion rate
[ ] Any technical issues?
```

### Step 3: Post-Campaign Analysis

**Data to pull from SEOSONA connectors:**
```python
# From 3_MEMORY/seo_exports/<domain>/
gsc_report_*.csv        → Organic traffic change during campaign
ga4_report_*.csv        → Conversion data, traffic sources
rank_tracking_*.csv     → Keyword position changes
```

**Report structure:**
```markdown
## Campaign: [Name] | [Date range]

### Goal vs. Result
| Metric | Goal | Result | Delta |
|--------|------|--------|-------|
| Organic traffic | +20% | +34% | +14% |
| Conversions | 50 | 67 | +34% |

### What Worked
[Specific channels + data]

### What Didn't Work
[Specific issues + hypothesis]

### Next Steps
[Actionable recommendations]
```

---

## A/B Test Analysis Framework

1. **Check sample size** — Did you reach pre-determined sample? If no → preliminary only
2. **Statistical significance** — p-value < 0.05? (95% confidence)
3. **Effect size** — Is the difference meaningful for business (≥ MDE)?
4. **Secondary metrics** — Do they support primary?
5. **Guardrails** — Did anything get worse?
6. **Segment differences** — Mobile vs. desktop, new vs. returning?

---

## Funnel Analysis (SEOSONA Integration)

Map Google Analytics data to funnel stages:

```
TOFU (Awareness):
  GSC: impressions + clicks by keyword intent
  GA4: traffic by source, new visitors %

MOFU (Consideration):
  GA4: landing page conversion rate
  GA4: pages per session, session duration
  GSC: clicks on feature/solution pages

BOFU (Decision):
  GA4: pricing page visits, trial signups
  GA4: checkout conversion rate
  GA4: demo requests

RETENTION:
  GA4: returning visitors, LTV proxy metrics
```

**Content Gap → Traffic Gap analysis:**
Run `scripts/run_full_audit.py` → Check `content_gap_*.csv` for keywords without content.

---

## Analytics Best Practices

1. **Track leading indicators, not just lagging** — Content published → Rankings → Traffic → Leads → Revenue
2. **Apples to apples** — Compare same periods (avoid holiday weeks, seasonal spikes)
3. **Statistical significance before conclusions** — Don't optimize based on 5 conversions
4. **Attribution ≠ causation** — Multiple channels deserve credit
5. **Report insights, not just numbers** — "Traffic up 20%" → "Traffic up 20% due to [cause], recommend [action]"
6. **Automate recurring reports** — Manual reports = inconsistency

## Agent Integration
**Primary:** Use for all analytics and measurement tasks
**Related skills:** `funnel`, `ab_testing`, `paid_ads`
**Data sources:** `ga4_connector`, `gsc_connector`, `rank_tracker`
