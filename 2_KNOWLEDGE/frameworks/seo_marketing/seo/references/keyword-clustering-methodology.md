# Keyword Clustering Methodology

## Overview

Keyword clustering groups related keywords into thematic clusters to build comprehensive content strategies and establish topical authority.

## Clustering Approaches

### 1. Topic Clustering
- Group keywords by overarching topic/theme
- Identify semantic relationships
- Map to content structure
- Create pillar-cluster hierarchy

### 2. Intent-Based Grouping

**Informational Intent**
- How-to, guide, tutorial queries
- "What is", "how to", "guide to"
- Target: Educational content, blog posts
- Example: "how to optimize images for web"

**Navigational Intent**
- Brand/product seeking queries
- Company names, product names
- Target: Landing pages, product pages
- Example: "semrush pricing", "ahrefs login"

**Transactional Intent**
- Purchase-ready queries
- "Buy", "discount", "coupon", "deal"
- Target: Product pages, checkout flows
- Example: "buy seo tools", "best seo software discount"

**Commercial Intent**
- Research before purchase
- "Best", "top", "review", "vs"
- Target: Comparison pages, reviews
- Example: "best keyword research tool", "semrush vs ahrefs"

### 3. Parent Topic Identification

```
Parent Topic: SEO Tools
├── Keyword Research Tools (sub-topic)
├── Backlink Analysis Tools (sub-topic)
├── Rank Tracking Tools (sub-topic)
└── Technical SEO Tools (sub-topic)
```

**Process:**
1. Extract head terms (1-2 word core topics)
2. Group long-tail variations under head terms
3. Identify parent-child relationships
4. Map difficulty and volume at each level

## Cluster Hierarchy Structure

### Three-Tier Model

**Tier 1: Pillar Page (Hub)**
- Broad topic coverage (2000-4000 words)
- High search volume head term
- Links to all cluster pages
- Example: "Complete Guide to SEO"

**Tier 2: Cluster Pages (Spokes)**
- Sub-topic deep dives (1500-2500 words)
- Medium volume keywords
- Links back to pillar and between clusters
- Example: "Technical SEO Guide", "On-Page SEO Guide"

**Tier 3: Supporting Content**
- Specific long-tail topics (800-1500 words)
- Lower volume, high intent keywords
- Links to cluster page and pillar
- Example: "How to Fix Crawl Errors", "Image Optimization Best Practices"

## Clustering Process

### Step 1: Keyword Collection
- Export keyword list (min 200-500 keywords)
- Include: keyword, volume, difficulty, intent

### Step 2: Initial Grouping
- Sort by semantic similarity
- Use n-gram analysis for common phrases
- Group synonyms and variations

### Step 3: Intent Mapping
- Tag each keyword with intent type
- Separate informational vs commercial
- Identify content format match

### Step 4: Cluster Assignment
- Create 5-15 main clusters
- 10-50 keywords per cluster
- Name cluster with primary keyword

### Step 5: Hierarchy Building
- Identify pillar topics (1-3 pillars)
- Assign clusters to pillars
- Map supporting content

## Tools & Automation

### Manual Methods
- Spreadsheet pivot tables
- Conditional formatting for grouping
- Manual tagging and categorization

### Semi-Automated
- Keyword clustering tools (SEMrush, Ahrefs)
- SERP similarity analysis
- Google Keyword Planner grouping

### Fully Automated
- Python clustering scripts (K-means, DBSCAN)
- NLP-based semantic analysis
- Machine learning topic modeling

## Example Cluster Structure

```
Pillar: Email Marketing Guide (vol: 12,000)
│
├── Cluster 1: Email List Building (vol: 3,200)
│   ├── "how to build email list" (vol: 880)
│   ├── "email lead magnet ideas" (vol: 320)
│   ├── "email signup form best practices" (vol: 210)
│   └── "grow email subscribers fast" (vol: 180)
│
├── Cluster 2: Email Copywriting (vol: 2,800)
│   ├── "email subject line formulas" (vol: 590)
│   ├── "how to write marketing emails" (vol: 480)
│   ├── "email call to action examples" (vol: 320)
│   └── "email personalization tips" (vol: 290)
│
└── Cluster 3: Email Analytics (vol: 1,900)
    ├── "email open rate benchmarks" (vol: 720)
    ├── "improve email deliverability" (vol: 410)
    ├── "email click through rate" (vol: 380)
    └── "email conversion tracking" (vol: 190)
```

## Cluster Quality Metrics

**Cohesion Score**
- Semantic similarity within cluster
- Target: >70% keyword overlap in SERP results

**Volume Concentration**
- Total search volume in cluster
- Target: 1,000-10,000 monthly searches

**Intent Alignment**
- % keywords with same intent
- Target: >80% same intent type

**Content Opportunity**
- Gap between cluster coverage and competition
- Score: (Your coverage - Competitor avg) / Competitor max

## Best Practices

1. Start with 200+ seed keywords minimum
2. Use SERP analysis to validate clusters
3. Review top 10 results for overlap
4. Update clusters quarterly
5. Track cluster rankings over time
6. Link strategically between cluster content
7. Monitor cannibalization between cluster pages
8. Prioritize commercial intent for revenue goals
9. Build informational content for top-of-funnel
10. Create conversion paths between clusters
