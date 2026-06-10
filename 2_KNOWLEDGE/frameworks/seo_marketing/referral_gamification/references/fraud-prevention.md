# Fraud Prevention

## Detection Mechanisms

### Device Fingerprinting
- Capture browser/device details
- Flag multiple accounts from same device
- Use libraries: FingerprintJS, ClientJS

### IP Address Tracking
```javascript
// Flag high volumes from single IP
const ipCounts = await db.query(`
  SELECT ip_address, COUNT(*) as signups
  FROM referral_clicks
  WHERE click_timestamp > NOW() - INTERVAL '24 hours'
  GROUP BY ip_address
  HAVING COUNT(*) > 5
`);
```

**Block lists:**
- Data center IPs
- Known VPN providers
- Tor exit nodes
- CIDR ranges for suspicious blocks

### Email Validation
- Block disposable email domains (Mailinator, Guerrillamail, etc.)
- Verify domain reputation (check MX records)
- Flag pattern anomalies (random strings)

### Velocity Checks
- Max signups per IP per hour
- Max referrals per user per day
- Conversion rate monitoring per referrer

## Prevention Tactics

### Reward Delay
Issue rewards 7-14 days after conversion:
```javascript
// Schedule reward payout
await scheduleReward({
  referralId,
  payoutDate: addDays(conversionDate, 7),
  status: 'pending_review'
});
```

### Multi-Step Rewards
Reward at action milestones, not just signup:
1. Signup → Nothing yet
2. Complete onboarding → $5
3. First purchase → $15

### Self-Referral Block
```javascript
// Prevent self-referral
if (referrer.email.split('@')[1] === referee.email.split('@')[1]) {
  return { error: 'Same email domain not allowed' };
}
if (referrer.ip === referee.ip && !isTrustedIP(ip)) {
  return { error: 'Suspicious activity detected' };
}
```

### Manual Approval Queue
Flag suspicious referrals for review:
- Rapid signups (>3 in 1 hour)
- Similar email patterns
- Same payment method
- High-velocity referrers

## Fraud Scoring Model

```javascript
let fraudScore = 0;

if (sameIP) fraudScore += 30;
if (disposableEmail) fraudScore += 40;
if (sameDevice) fraudScore += 35;
if (rapidSignups) fraudScore += 25;
if (vpnDetected) fraudScore += 20;

if (fraudScore > 50) {
  await flagForReview(referralId);
}
```

## Platform Solutions

- **SaaSquatch:** IP blocking, disposable email detection
- **Prefinery:** Device fingerprinting, rate limiting
- **Voucherify:** Custom rule engine for fraud detection
