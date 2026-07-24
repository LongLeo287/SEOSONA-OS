---
name: "aeo_search_optimizer"
description: "Analyzes AI-generated search results (Google AI Overview, Bing Chat, Perplexity) to optimize content for Answer Engine Optimization."
version: "1.0.0"
tags: ["seo", "aeo", "ai-search", "answer-engine", "featured-snippets"]
connector: "scripts/connectors/aeo_ai_search_analyzer.py"
---

# Skill: AEO Search Optimizer

## Execution Steps
1. Accept target keywords and competitor domain.
2. Run `aeo_ai_search_analyzer.py` to query AI search engines.
3. Analyze: Which sources are cited in AI answers? What content formats get referenced?
4. Identify opportunities: What questions aren't being answered well?
5. Generate: AEO optimization report with content recommendations.

## Optimization Strategies
- Structure content as direct Q&A (matches AI answer extraction)
- Add structured data (FAQ schema, HowTo schema)
- Build topical authority through comprehensive content clusters
- Ensure factual accuracy with cited sources (AI models prefer verified info)

## Quality Validation
- [ ] AI search results analyzed for target keywords
- [ ] Competitor citation frequency documented
- [ ] Actionable content optimization recommendations provided
