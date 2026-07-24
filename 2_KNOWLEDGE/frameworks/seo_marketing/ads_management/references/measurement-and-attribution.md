# Measurement, Attribution & Tracking

## Conversion Tracking Setup

### Google Ads
- Use Google Tag (gtag.js) or GTM — never rely on imported GA4 goals alone for bidding
- Set up Enhanced Conversions (hash first-party data) — improves accuracy 10-20%
- Assign conversion values even for leads (avg deal size × close rate)
- Primary vs secondary conversions: only primary drives bidding
- For e-com: implement dynamic remarketing tag with product IDs

### Meta Ads (Pixel + CAPI)
- **Use both** Pixel + Conversions API in parallel — never replace one with the other
- Deduplication: use `event_id` parameter on both sides; 48h dedup window
- Target Event Match Quality (EMQ) ≥ 7.0, dedup rate ≥ 90%
- Send: email (hashed), phone, first/last name, zip, country for max match
- Priority events: ViewContent → AddToCart → InitiateCheckout → Purchase
- CAPI setup: Meta native gateway, Shopify integration, or GTM server-side
- Validate in Events Manager → Diagnostics

## Attribution Models

| Model | Best For | Notes |
|-------|----------|-------|
| Data-Driven (DDA) | Google Ads default 2025+ | ML-based credit distribution |
| First-touch | Brand awareness campaigns | Identifies discovery channels |
| Last-touch | Short sales cycles, direct response | Simple but biased |
| Linear | B2B long consideration | Equal credit all touchpoints |

### Post-iOS 14.5 Reality
- Meta reported ROAS is understated; use 7-day click / 1-day view window
- Server-side tagging via GTM bypasses cookie/browser restrictions
- Proper attribution reduces wasted spend by ~27%
- Multi-touch improves CPA efficiency 14-36%

## Key Metrics

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| CTR | clicks / impressions | >1% search, >0.5% display |
| CVR | conversions / clicks | >2% |
| CPC | cost / clicks | Varies by industry |
| CPM | cost / 1000 impressions | Varies |
| ROAS | revenue / ad spend | >2x minimum, >4x scale |
| CPA | cost / conversions | ≤ target |
| MER | total revenue / total ad spend | Holistic metric |

## Measurement Best Practices

- **Triangulate signals**: platform data + GA4 + revenue CRM + incrementality tests
- **MER (Marketing Efficiency Ratio)**: total revenue / total ad spend — simpler than blended ROAS
- Use server-side tagging for accuracy
- Add qualitative data: surveys, interviews, sales feedback
- Focus on useful/honest reporting over vanity metrics

## Google Ads Scripts for Automation

High-value free scripts:
- **Budget Pacing** — alert on over/underspend
- **Quality Score Tracker** — log QS changes to Google Sheets
- **Broken URLs** — scan for 404 destination URLs
- **Search Term Harvester** — auto-add converting terms as keywords
- Source: developers.google.com/google-ads/scripts/docs/intro
