# SEO Workflow

SEO optimization process from audit to monitoring.

## Overview

| Field | Value |
|-------|-------|
| **Purpose** | Systematic SEO improvement |
| **Agents** | seo-specialist, content-creator, attraction-specialist |
| **Human Checkpoints** | Strategy approval for major changes |

---

## Workflow Stages

### Stage 1: Audit

**Agent:** `seo-specialist`

**Actions:**
1. Technical SEO audit
2. Content audit
3. Competitor analysis
4. Current rankings check

**Output:** SEO audit report in `plans/reports/`

**Prompt Template:**
```
Perform SEO audit for [domain/site].
Include:
- Technical issues (crawl, speed, mobile)
- Content gaps
- Top competitor comparison
- Current keyword rankings
Save to: plans/reports/[date]-seo-audit.md
```

---

### Stage 2: Keyword Research

**Agent:** `seo-specialist`, `attraction-specialist`

**Actions:**
1. Identify topic clusters
2. Map search intent
3. Analyze keyword difficulty
4. Find content gaps
5. Prioritize opportunities

**Output:** Keyword strategy doc

**Prompt Template:**
```
Research keywords for [topic/niche].
Include:
- Primary keywords (high intent)
- Long-tail opportunities
- Question-based keywords
- Competitor keyword gaps
Prioritize by: volume, difficulty, intent
```

---

### Stage 3: On-Page Optimization

**Agent:** `seo-specialist`

**Actions:**
1. Title tag optimization
2. Meta description updates
3. Header structure (H1-H6)
4. Internal linking
5. Schema markup

**Output:** Optimization recommendations

**Prompt Template:**
```
Optimize on-page SEO for [page/URL].
Target keyword: [keyword]
Include:
- Title tag suggestion
- Meta description
- Header optimization
- Internal link opportunities
- Schema markup (JSON-LD)
```

---

### Stage 4: Content Creation

**Agent:** `content-creator`, `seo-specialist`

**Actions:**
1. Create SEO-optimized content
2. Build pSEO templates
3. Update existing content
4. Link building content

**Output:** SEO content in `content/`

**Prompt Template:**
```
Create SEO content for [keyword].
Search intent: [informational/transactional/etc]
Include:
- Optimized title and headers
- Target and related keywords
- Internal links
- Schema markup
Word count: [target based on competition]
```

---

### Stage 5: Monitoring

**Agent:** `analytics-analyst`, `seo-specialist`

**Actions:**
1. Track keyword rankings
2. Monitor organic traffic
3. Analyze CTR improvements
4. Identify new opportunities
5. Report on progress

**Output:** SEO performance reports

**Prompt Template:**
```
Monitor SEO performance for [domain].
Metrics:
- Keyword ranking changes
- Organic traffic trends
- Top performing pages
- CTR improvements
Period: [date range]
Recommend next optimizations.
```

---

## SEO Checklist

### Technical SEO
- [ ] Site crawlable
- [ ] XML sitemap submitted
- [ ] Robots.txt configured
- [ ] HTTPS enabled
- [ ] Mobile-friendly
- [ ] Page speed optimized
- [ ] Core Web Vitals passing

### On-Page SEO
- [ ] Unique title tags (50-60 chars)
- [ ] Meta descriptions (150-160 chars)
- [ ] H1 tag with keyword
- [ ] Header hierarchy (H2-H6)
- [ ] Keyword density (1-2%)
- [ ] Image alt text
- [ ] Internal links
- [ ] External links to authority

### Content SEO
- [ ] Addresses search intent
- [ ] Comprehensive coverage
- [ ] Original/unique value
- [ ] Updated regularly
- [ ] Proper length vs competition

### Off-Page SEO
- [ ] Quality backlinks
- [ ] Brand mentions
- [ ] Social signals
- [ ] Local citations (if applicable)

---

## pSEO (Programmatic SEO)

### Template Structure
```
/[category]/[topic]/[location]
/tools/[tool-name]
/alternatives/[competitor]
/vs/[product-a]-vs-[product-b]
```

### Template Prompt
```
Create pSEO template for [pattern].
Variables: [variable-list]
Include:
- Title template with variables
- Meta description template
- Content sections (dynamic + static)
- Schema template
- Internal linking pattern
```

---

## Integration Points

### Hooks Triggered
- `campaign-tracking` → SEO content published

### Data Flow
- Audit → Research priorities
- Research → Content strategy
- Content → Rankings
- Monitoring → Iteration

### Tools/APIs
- Google Search Console
- Google Analytics 4
- Rank tracking tools
- Site crawlers

---

## Usage Example

```
/seo:audit "example.com"

# Triggers workflow:
1. seo-specialist: Technical + content audit
2. seo-specialist: Keyword research, gap analysis
3. seo-specialist: On-page optimization plan
4. content-creator: New content + updates
5. analytics-analyst: Track rankings, traffic
```

---

## Success Metrics

- Keyword rankings (position changes)
- Organic traffic (sessions, users)
- Click-through rate (impressions → clicks)
- Conversion rate (organic traffic → goals)
- Domain authority (backlink quality)
