# Content Gap Analysis Framework

## Overview

Content gap analysis identifies topics competitors rank for that you don't, revealing opportunities to capture additional search traffic.

## Step-by-Step Process

### Step 1: Competitor Selection

**Identify Top 3-5 Competitors**
- Direct product/service competitors
- Same target audience and geography
- Similar domain authority (±20 points)
- Currently ranking for your target keywords

**Validation Criteria**
- Organic visibility overlap >30%
- Shared keyword count >100
- Similar content formats
- Active content publishing (min 2x/month)

### Step 2: Competitor Content Mapping

**Data Collection**
- Export competitor ranking keywords (SEMrush, Ahrefs)
- Filter: positions 1-20, min 100 volume
- Capture: URL, keyword, position, volume, difficulty
- Time frame: Last 3 months

**Content Inventory**
```
Competitor A:
- Total ranking keywords: 3,240
- Top 10 positions: 890
- Content pieces: 156
- Monthly traffic: ~45,000

Your Site:
- Total ranking keywords: 1,820
- Top 10 positions: 420
- Content pieces: 89
- Monthly traffic: ~22,000

Gap: 1,420 keywords, 470 top 10 rankings
```

### Step 3: Topic Extraction Methodology

**Keyword Clustering**
1. Group competitor keywords by topic
2. Identify topic patterns (n-gram analysis)
3. Map to content types (guide, how-to, list, comparison)
4. Tag with intent (informational, commercial, transactional)

**Topic Categories**
- Problem-solving topics
- Educational/tutorial topics
- Comparison and review topics
- Tool/resource topics
- Industry news/trends topics

### Step 4: Gap Identification Process

**Three Gap Types**

**Type 1: Missing Topics**
- Competitor ranks, you have zero content
- Highest priority for new content
- Example: Competitor has "email deliverability guide", you don't

**Type 2: Weak Coverage**
- You rank positions 20+, competitor ranks top 10
- Improve/expand existing content
- Example: You rank #34, competitor ranks #3

**Type 3: Format Gaps**
- Same topic, different content format
- Competitor uses video/infographic, you use text only
- Example: Competitor has interactive tool, you have blog post

**Gap Detection Criteria**
```
Missing Topic Gap:
- You rank for 0 keywords in topic cluster
- Competitor ranks for 10+ keywords
- Topic volume: 500+ monthly searches

Weak Coverage Gap:
- Your best position: >20
- Competitor position: <10
- Position gap: >10 ranks
- Volume: 200+ monthly searches
```

### Step 5: Opportunity Scoring

**Scoring Formula**
```
Opportunity Score = (Volume × Intent Weight) / (Difficulty + Competition Level)

Where:
- Volume: Monthly search volume
- Intent Weight: 1.0 (info), 1.5 (commercial), 2.0 (transactional)
- Difficulty: Keyword difficulty (0-100)
- Competition Level: # competitors ranking (1-10 scale)

Example:
Keyword: "email marketing automation guide"
Volume: 2,400
Intent Weight: 1.5 (commercial)
Difficulty: 45
Competition: 6

Score = (2,400 × 1.5) / (45 + 6) = 70.6
```

**Scoring Interpretation**
- 80+: High priority, quick win
- 60-79: Medium priority, good opportunity
- 40-59: Low priority, long-term investment
- <40: Skip or defer

### Step 6: Prioritization Matrix

**Evaluation Criteria**

| Factor | Weight | Scoring |
|--------|--------|---------|
| Search volume | 30% | 0-100 scale |
| Business relevance | 25% | 1-10 rating |
| Ranking difficulty | 20% | Inverse of KD |
| Content effort | 15% | Inverse of hours |
| Traffic potential | 10% | CTR × Volume |

**Priority Tiers**
- Tier 1 (P0): Score >75, business critical
- Tier 2 (P1): Score 60-75, high impact
- Tier 3 (P2): Score 40-60, medium impact
- Tier 4 (P3): Score <40, low priority

### Step 7: Content Brief Generation

**Brief Template**

```markdown
# Content Brief: [Topic]

## Opportunity Summary
- Primary keyword: [keyword]
- Search volume: [monthly volume]
- Current ranking: [position or "none"]
- Opportunity score: [score]

## Competitor Analysis
- Top 3 ranking URLs
- Word count range: [min-max]
- Content format: [article/guide/list/video]
- Unique angles: [list differentiators]

## Content Specifications
- Target word count: [recommended length]
- Content type: [format]
- Target audience: [persona]
- User intent: [informational/commercial/transactional]

## Required Elements
- [ ] Primary keyword in title
- [ ] H2/H3 subheadings (min 5)
- [ ] Visual elements (min 3)
- [ ] Internal links (min 3)
- [ ] External authoritative links (min 2)
- [ ] CTA placement
- [ ] Schema markup type

## Key Topics to Cover
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]
...

## Keywords to Include
- Primary: [main keyword]
- Secondary: [2-3 related keywords]
- LSI: [5-8 semantic keywords]

## Competitive Differentiation
- [What makes this better than competitor content]
- [Unique value proposition]
- [Additional resources/tools to include]
```

## Analysis Tools

**Recommended Stack**
- SEMrush: Keyword Gap tool
- Ahrefs: Content Gap feature
- SurferSEO: SERP analyzer
- Google Search Console: Performance data
- Screaming Frog: Content audit

**Manual Analysis**
- SERP manual review (top 10 results)
- Competitor site:search in Google
- Topic modeling with Python/R
- Spreadsheet pivot analysis

## Implementation Workflow

**Week 1: Discovery**
- Identify competitors (day 1)
- Export ranking data (day 2-3)
- Initial clustering (day 4-5)

**Week 2: Analysis**
- Gap identification (day 1-2)
- Opportunity scoring (day 3-4)
- Prioritization (day 5)

**Week 3: Planning**
- Content brief creation (day 1-3)
- Editorial calendar mapping (day 4)
- Resource allocation (day 5)

**Week 4+: Execution**
- Content creation (ongoing)
- Publishing schedule (2-4x/month)
- Performance tracking (weekly)

## Success Metrics

**Leading Indicators**
- Content pieces published
- Keyword positions improving
- Indexation rate
- Internal link growth

**Lagging Indicators**
- Organic traffic increase (target: +20% in 6 months)
- Keyword ranking growth (target: +50 top 10 rankings)
- Impressions growth (target: +30% in 4 months)
- Click-through rate improvement

## Best Practices

1. Run gap analysis quarterly
2. Focus on intent match, not just volume
3. Prioritize business-relevant topics
4. Build pillar content before supporting content
5. Track competitor content velocity
6. Monitor keyword cannibalization
7. Update existing content before creating new
8. Link new content to existing hub pages
9. Measure ROI per content piece
10. Iterate based on performance data
