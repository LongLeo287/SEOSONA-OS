# Fraud Prevention

## Common Fraud Types

| Type | Detection |
|------|-----------|
| Cookie Stuffing | Unexpected attributions |
| Fake Leads | Low engagement, high bounce |
| Click Fraud | Velocity spikes, low conversion |
| Self-Referrals | IP/device matching |
| Brand Bidding | Google Ads monitoring |
| Transaction Fraud | Refund rates >10% |

## Multi-Layer Detection

### Layer 1: IP Analysis
- Flag velocity >50 clicks/hour from same IP
- Detect data center IPs
- Monitor geographic clustering

### Layer 2: Device Fingerprinting
- Detect emulators (FraudFox, Kameleo)
- Flag multiple accounts per device
- Identify proxy/VPN masking

### Layer 3: Behavioral Analytics
- Form fill velocity (milliseconds = bot)
- Session duration anomalies
- Scroll depth patterns

## Prevention Policies

### Commission Hold (Critical)
- **60-90 days** matching refund window
- Pay only after hold + no refunds

### Minimum Payout: $50-100

### Clawback Triggers
- Fraudulent referrals
- Chargebacks/refunds
- TOS violations

## Terms of Service

```
Affiliates SHALL NOT:
□ Bid on branded keywords
□ Use bots or fake leads
□ Use malware/adware
□ Typosquatting
□ Stolen payment methods
```

## Consequences

| Violation | Action |
|-----------|--------|
| First | Warning + 7-day pause |
| Second | 30-day hold + probation |
| Third | Termination + clawback |
| Fraud | Immediate termination |

## Risk Scoring

| Indicator | Points |
|-----------|--------|
| Conversion >20% above avg | 20 |
| Velocity >50 clicks/hour | 15 |
| Time-to-conversion <30s | 15 |
| Refund rate >15% | 20 |
| VPN/Proxy detected | 20 |

**Thresholds:** 0-30 low, 30-50 medium, 50-75 high, 75+ suspend

## Monthly Audit

- [ ] Top 20% earners review
- [ ] Conversion rates vs average
- [ ] Traffic source analysis
- [ ] Chargeback patterns
