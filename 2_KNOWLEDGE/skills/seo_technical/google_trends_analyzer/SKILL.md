---
name: "google_trends_analyzer"
description: "Detects trending topics and seasonal patterns using Google Trends data for content planning and keyword strategy."
version: "1.0.0"
tags: ["trends", "google-trends", "keyword-research", "seasonal", "content-planning"]
connector: "scripts/connectors/google_trends_connector.py"
---

# Skill: Google Trends Analyzer

## Execution Steps
1. Accept seed keywords and geographic region (default: Vietnam).
2. Run `google_trends_connector.py` to pull trend data.
3. Analyze: Interest over time, regional breakdown, related queries, rising topics.
4. Detect: Seasonal patterns, breakout trends, declining topics.
5. Report: Trend report with content calendar recommendations.

## Use Cases
- Identify trending topics before competitors
- Plan seasonal content calendar (Tết, mùa hè, Black Friday VN)
- Validate keyword demand before investing in content
- Detect industry shifts early for proactive content strategy

## Quality Validation
- [ ] Trend data is current (within last 7 days)
- [ ] Regional data correctly reflects target market
- [ ] Rising queries identified and actionable
