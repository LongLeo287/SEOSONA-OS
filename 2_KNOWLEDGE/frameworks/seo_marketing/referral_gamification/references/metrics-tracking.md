# Metrics & KPI Tracking

## Core Metrics

### Participation Rate
**Formula:** `(Customers who shared / Total customers) × 100`
**Target:** 5-9% | **Action if low:** Simplify, improve visibility, test incentives

### Referral Rate
**Formula:** `(Referred customers / Total customers) × 100`
**Target:** 5-10% (avg: 2.3%) | **Action if low:** Extend attribution, improve conversion

### Conversion Rate
**Formula:** `(Converted referrals / Total clicks) × 100`
**Benchmark:** 2-3x higher than non-referral

## Financial Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| CAC via Referral | Rewards / Acquired | 30-50% lower than other channels |
| Referred CLV | Cohort comparison | 16-25% higher LTV |
| Program ROI | (Revenue - Incentives) / Incentives | 3:1 to 5:1 |

## Monitoring Query

```sql
SELECT DATE(created_at) as date,
  COUNT(*) as total,
  COUNT(CASE WHEN status='converted' THEN 1 END) as conversions,
  SUM(reward_amount) as rewards_paid
FROM referrals
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at) ORDER BY date DESC;
```

## Health Checks

| Metric | Warning | Critical |
|--------|---------|----------|
| Participation | <3% | <1% |
| Conversion | <10% | <5% |
| Fraud rate | >3% | >5% |
| Reward fulfillment | <95% | <90% |

## Review Cadence
- **Weekly:** Participation, fraud flags, top referrers
- **Monthly:** ROI, A/B tests, channel performance
- **Quarterly:** CLV comparison, structure optimization

## Attribution Windows
| Sales Cycle | Window |
|-------------|--------|
| Consumer | 30 days |
| SaaS trial | 60 days |
| B2B enterprise | 90+ days |

## Power User Query
```sql
SELECT user_id, COUNT(*) as count, SUM(reward_amount) as earned
FROM referrals WHERE status='converted'
GROUP BY user_id ORDER BY count DESC LIMIT 100;
```
Top 10% referrers often drive 80%+ of referral revenue.
