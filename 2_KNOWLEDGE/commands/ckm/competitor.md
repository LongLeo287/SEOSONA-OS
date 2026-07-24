---
description: 💡💡 Competitive analysis
argument-hint: [action] [url]
---

Analyze competitors and identify opportunities.

<args>$ARGUMENTS</args>

## Actions
- `analyze [url]` - Analyze competitor website
- `content [url]` - Content gap analysis
- `seo [url]` - SEO comparison
- `list` - List tracked competitors

## Workflow

1. **Parse Arguments**
   - Extract action (analyze/content/seo)
   - Extract competitor URL

2. **Analyze Workflow**
   - Use `WebFetch` to retrieve competitor data
   - Use `researcher` agent for comprehensive analysis:
     - Value proposition
     - Pricing strategy
     - Target audience
     - Marketing channels
     - Strengths/weaknesses
   - Use `attraction-specialist` for positioning

3. **Content Gap Workflow**
   - Use `seo-specialist` for content audit
   - Compare content topics and formats
   - Identify gaps and opportunities
   - Generate content recommendations

4. **SEO Comparison Workflow**
   - Use `seo-specialist` agent for comparison
   - Activate `seo-optimization` skill
   - Compare:
     - Keyword rankings
     - Backlink profile
     - Domain authority
     - Content quality

5. **Output**
   - Reports → `reports/competitors/{date}-{name}.md`

## Agents Used
- `researcher` - Competitor intelligence
- `attraction-specialist` - Market positioning
- `seo-specialist` - SEO analysis

## Skills Used
- `seo-optimization` - SEO comparison
- `content-marketing` - Content analysis
- `assets-organizing` - Standardized output paths

## Output
- Battlecards → `assets/sales/battlecards/{competitor}.md`
- Analysis → `reports/competitors/{date}-{name}.md`

## Examples
```
/competitor analyze https://competitor.com
/competitor content https://competitor.com
/competitor seo https://competitor.com
/competitor list
```
