---
description: 💡💡 Keyword research & planning
argument-hint: [topic]
---

Conduct keyword research for a topic or niche.

<topic>$ARGUMENTS</topic>

## Workflow

1. **Understand Intent**
   - Parse topic from `$ARGUMENTS`
   - Determine search intent (informational/transactional/navigational)

2. **Research Keywords via ReviewWeb API**
   - **Keyword Ideas**: `POST /seo-insights/keyword-ideas` with topic
   - **Keyword Difficulty**: `POST /seo-insights/keyword-difficulty` for top keywords
   - Use `attraction-specialist` agent for expanded discovery
   - Use `WebSearch` for competitive analysis
   - Activate `seo-optimization` skill for keyword clustering

3. **Analysis**
   - Primary keywords (high volume, relevant)
   - Long-tail variations
   - Question-based keywords
   - Related topics
   - Competitor keywords
   - Difficulty scores from API

4. **Output Strategy**
   - Keyword clusters by intent
   - Content recommendations
   - Priority ranking
   - Output to `assets/seo/keywords/`

## API Reference

Uses ReviewWeb SEO Insights API:
- Skill: `seo-optimization/references/reviewweb-api.md`
- Endpoints: `/seo-insights/keyword-ideas`, `/seo-insights/keyword-difficulty`
- Auth: `$REVIEWWEB_API_KEY` via X-API-Key header

## Agents Used
- `attraction-specialist` - Keyword discovery
- `seo-specialist` - Keyword analysis

## Skills Used
- `seo-optimization` - Keyword research frameworks, ReviewWeb API
- `assets-organizing` - Standardized output paths

## Output Requirements

1. **Minimum 20 keywords** across all clusters
2. **Difficulty scores** for top 10 primary keywords (via API)
3. **Intent classification** for each keyword cluster
4. **Priority ranking** (High/Medium/Low) based on:
   - Search volume potential
   - Difficulty score (lower = higher priority)
   - Relevance to topic
5. **Content recommendations** per cluster

## Output Template

```markdown
# Keyword Research: {topic}

**Date**: {YYYY-MM-DD}
**Topic**: {topic}
**Search Intent**: {primary intent}

## Executive Summary

{2-3 sentence overview of findings}

## Primary Keywords

| Keyword | Difficulty | Volume Est. | Intent | Priority |
|---------|------------|-------------|--------|----------|
| {kw}    | {0-100}    | {High/Med/Low} | {I/T/N} | {H/M/L} |

## Keyword Clusters

### Cluster 1: {Theme}
**Intent**: {Informational/Transactional/Navigational}
**Priority**: {High/Medium/Low}

- {keyword 1}
- {keyword 2}
- {keyword 3}

**Content Recommendation**: {suggested content type/angle}

### Cluster 2: {Theme}
...

## Long-tail Keywords

| Long-tail Keyword | Parent Keyword | Intent |
|-------------------|----------------|--------|
| {long-tail kw}    | {parent}       | {I/T/N} |

## Question Keywords

- {question keyword 1}
- {question keyword 2}

## Competitor Keywords

| Competitor | Key Terms | Gap Opportunity |
|------------|-----------|-----------------|
| {domain}   | {terms}   | {opportunity}   |

## Recommendations

1. **Quick Wins**: {low difficulty, high relevance keywords}
2. **Strategic Targets**: {medium difficulty, high value}
3. **Long-term Goals**: {high difficulty, brand-building}

## Next Steps

- [ ] Create content calendar for top clusters
- [ ] Prioritize quick-win keywords
- [ ] Monitor competitor movements
```

## Output Path

`assets/seo/keywords/{date}-{topic-slug}-keywords.md`

## Examples
```
/seo:keywords "AI writing tools"
/seo:keywords "project management software"
/seo:keywords "sustainable fashion"
```
