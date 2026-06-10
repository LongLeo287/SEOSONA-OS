# Backlink Analysis Framework

## Key Metrics

### Domain Authority Metrics
- **Domain Authority (DA)**: 0-100 scale (Moz)
- **Domain Rating (DR)**: 0-100 scale (Ahrefs)
- **Trust Flow/Citation Flow**: Majestic metrics
- **Target**: DA/DR 40+ for quality backlinks

### Referring Domain Metrics
- **Total Referring Domains**: Unique domains linking to site
- **New/Lost Domains**: Monthly tracking
- **DoFollow Ratio**: Target 60-80% dofollow
- **Link Velocity**: Natural growth rate (avoid spikes)

### Anchor Text Distribution
- **Branded**: 40-50% (company/brand name)
- **Naked URL**: 20-30% (raw domain)
- **Generic**: 15-20% (click here, read more)
- **Exact Match**: 5-10% (target keywords)
- **Partial Match**: 10-15% (keyword variations)

### Quality Indicators
- **Toxic Score**: <5% toxic links (Semrush/Ahrefs)
- **Relevance Score**: Topical alignment
- **Traffic**: Linking domain monthly visitors
- **Spam Score**: <30% (Moz)

## Competitor Gap Analysis

### Process
1. Export competitor backlink profiles (top 3-5 competitors)
2. Identify domains linking to 2+ competitors but not you
3. Filter by DA/DR threshold (30+)
4. Sort by number of competitor links (high opportunity)
5. Export target list for outreach

### Gap Analysis Template
```
Competitor Gap Analysis
Date: [YYYY-MM-DD]
Competitors: [list URLs]

| Domain | DA | Links to C1 | Links to C2 | Links to C3 | Traffic | Niche |
|--------|----|-----------|-----------|-----------| --------|-------|
| example.com | 65 | Yes | Yes | No | 50k | Tech |

Priority Targets:
- High DA + links to multiple competitors
- Relevant niche/topic
- Active content publication
```

## Quality Assessment Criteria

### High-Quality Link Signals
- DA/DR 40+
- Organic traffic 10k+/month
- Topically relevant content
- Editorial placement (not footer/sidebar)
- Contextual anchor text
- DoFollow attribute
- Natural link placement

### Low-Quality/Toxic Signals
- DA/DR <20
- No organic traffic
- Spammy content/ads
- Link farm patterns
- Irrelevant niche
- Exact match anchor spam
- Site-wide links
- PBN indicators

### Assessment Scoring
**Score 1-5 for each:**
- Domain authority (DA/DR)
- Traffic quality
- Content relevance
- Link placement
- Editorial value

**Total Score:**
- 20-25: Premium link
- 15-19: Quality link
- 10-14: Average link
- 5-9: Low quality
- 0-4: Consider disavow

## Disavow Decision Process

### When to Disavow
- Spam score >50%
- Known PBN/link farm
- Hacked site with malicious links
- Irrelevant foreign language spam
- Sitewide links from low-quality directories
- Manual penalty received

### Disavow File Format
```
# Toxic domain - spam score 85%
domain:spamsite.com

# Low quality directory
domain:freelinkdirectory.net

# Specific URL only
http://example.com/spam-page
```

### Disavow Workflow
1. Export all backlinks
2. Filter by toxic score >30%
3. Manual review of flagged links
4. Create disavow.txt file
5. Upload to Google Search Console
6. Monitor ranking changes (4-8 weeks)
7. Update quarterly

## Backlink Audit Template

```markdown
# Backlink Audit Report
**Date**: [YYYY-MM-DD]
**Domain**: [your-domain.com]

## Overview
- Total Backlinks: [count]
- Referring Domains: [count]
- DoFollow Links: [count] ([%])
- Average DA: [score]
- Toxic Links: [count] ([%])

## Top Referring Domains
| Domain | DA | Links | Type | Traffic |
|--------|----| ------|------|---------|
| [domain] | [DA] | [count] | [dofollow/nofollow] | [estimate] |

## Anchor Text Distribution
- Branded: [%]
- Naked URL: [%]
- Generic: [%]
- Exact Match: [%]
- Partial Match: [%]

## Link Velocity (Last 90 Days)
- New Links: [count]
- Lost Links: [count]
- Net Growth: [+/- count]

## Quality Issues
- Toxic Links: [count]
- Low DA (<20): [count]
- Irrelevant Niches: [count]

## Recommendations
1. [Action item]
2. [Action item]
3. [Action item]

## Disavow Actions
- Links to disavow: [count]
- Domains to disavow: [count]
- File uploaded: [Yes/No]
```

## Tools Integration

### Ahrefs Metrics
- Use Site Explorer for backlink profile
- Content Gap for competitor analysis
- Batch Analysis for bulk domain checks

### Semrush Metrics
- Backlink Analytics for toxic score
- Link Building Tool for prospects
- Bulk Analysis for domain metrics

### Google Search Console
- Links report for Google's view
- Most linked pages
- Top linking sites
- Top linking text

## Analysis Frequency

- **Weekly**: Monitor new/lost links
- **Monthly**: Full backlink audit
- **Quarterly**: Competitor gap analysis
- **Semi-annual**: Disavow file update
