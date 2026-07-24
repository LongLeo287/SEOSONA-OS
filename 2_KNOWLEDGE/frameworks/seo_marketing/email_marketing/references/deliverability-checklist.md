# Email Deliverability Checklist

## Technical Setup

- [ ] SPF record configured
- [ ] DKIM signing enabled
- [ ] DMARC policy set
- [ ] Dedicated sending domain (not free email)
- [ ] IP reputation monitored
- [ ] Feedback loops configured

## List Hygiene

- [ ] Double opt-in enabled
- [ ] Bounce handling automated
- [ ] Unsubscribe working (1-click)
- [ ] Inactive subscribers segmented
- [ ] Hard bounces removed immediately
- [ ] List cleaned quarterly

## Content Best Practices

- [ ] Text-to-image ratio balanced (60:40)
- [ ] No spam trigger words
- [ ] Alt text on images
- [ ] Plain text version included
- [ ] Links not shortened suspiciously
- [ ] Unsubscribe link visible

## Sending Practices

- [ ] Consistent sending schedule
- [ ] Warm up new IP/domain
- [ ] Segment by engagement
- [ ] Avoid sudden volume spikes
- [ ] Honor unsubscribes immediately
- [ ] Monitor complaint rates

## Spam Trigger Words to Avoid

**High Risk:**
- Free, Free trial
- Act now, Limited time
- Congratulations, Winner
- Click here, Click below
- 100% guaranteed
- No obligation

**Medium Risk:**
- Discount, Sale
- Special offer
- Don't miss
- Urgent
- Reminder

## Key Metrics to Monitor

| Metric | Target | Red Flag |
|--------|--------|----------|
| Bounce Rate | <2% | >5% |
| Spam Complaints | <0.1% | >0.3% |
| Unsubscribe Rate | <0.5% | >1% |
| Open Rate | >15% | <10% |

## Recovery Steps (If Deliverability Drops)

1. Pause sending immediately
2. Review recent changes
3. Clean list aggressively
4. Check blacklists (mxtoolbox.com)
5. Contact ESP support
6. Slow ramp-up sending volume
7. Focus on engaged segment first
