---
name: "brand_context_analyzer"
description: "Tracks brand mentions, sentiment, and online reputation across web sources."
version: "1.0.0"
tags: ["brand", "reputation", "mentions", "sentiment", "monitoring"]
connector: "scripts/connectors/brand_context.py"
---

# Skill: Brand Context Analyzer

## Execution Steps
1. Accept brand name and optional domain.
2. Run `brand_context.py` to scan web for brand mentions.
3. Analyze: Sentiment (positive/neutral/negative), source authority, mention context.
4. Track: Volume trends over time, new mention sources, competitor comparison.
5. Report: Brand health score + key mentions + action items.

## Use Cases
- Client brand monitoring for reputation management
- E-E-A-T signal verification (brand mentions as authority proof)
- Competitive brand perception analysis
- PR crisis early detection

## Quality Validation
- [ ] Brand mentions accurately identified (no false positives)
- [ ] Sentiment analysis is reasonably accurate
- [ ] Sources are properly attributed and categorized
