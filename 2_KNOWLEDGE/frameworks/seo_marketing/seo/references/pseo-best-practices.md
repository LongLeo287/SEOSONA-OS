# pSEO Best Practices

Guidelines for creating high-quality programmatic SEO pages at scale.

## Content Uniqueness

**Target:** >80% unique content per page

### Strategies

1. **Unique Introductions**
```javascript
// Bad: Same intro everywhere
intro: `Welcome to our ${city} page.`

// Good: Data-driven unique intros
intro: `${city} has ${businessCount} ${service} providers with an average rating of ${rating}/5.0 based on ${reviewCount} local reviews.`
```

2. **Dynamic Sections**
- Local statistics
- User-generated content (reviews)
- Location-specific imagery
- Custom FAQs per page

3. **Avoid Template Fingerprints**
```html
<!-- Bad: Visible template pattern -->
<p>We offer [SERVICE] in [CITY].</p>

<!-- Good: Natural variation -->
<p>{{ city }} residents can choose from {{ providerCount }} certified {{ service }} professionals, with prices starting at ${{ minPrice }}.</p>
```

## Quality Guardrails

### Minimum Content Standards

| Metric | Minimum | Ideal |
|--------|---------|-------|
| Word count | 300 | 800+ |
| Readability | Grade 8 | Grade 10-12 |
| Unique content | 70% | 85%+ |
| Internal links | 3 | 5-10 |
| External links | 1 | 2-3 |

### Implementation

```javascript
// Quality validation before publishing
function validatePage(page) {
  const checks = {
    wordCount: page.content.split(/\s+/).length >= 300,
    uniqueness: calculateUniqueness(page) >= 0.80,
    readability: fleschKincaid(page.content) >= 8 && <= 12,
    internalLinks: page.links.internal.length >= 3,
    hasSchema: !!page.schema
  };

  return Object.values(checks).every(v => v);
}
```

## Thin Content Avoidance

**Google's Definition:** Little to no value, duplicate, or low-effort content.

### Red Flags

- Word count <300
- Same content across pages except 1-2 words
- No unique value proposition
- Auto-generated without human review
- No substantive information

### Solutions

1. **Add Unique Data**
```markdown
<!-- Thin -->
# Plumber in Austin
We have plumbers in Austin.

<!-- Substantive -->
# Plumber in Austin, TX
Austin has 127 licensed plumbing contractors with an average response time of 2.3 hours. The typical service call costs $125-$175. Top-rated providers include ABC Plumbing (4.9/5, 234 reviews) and XYZ Plumbers (4.7/5, 189 reviews).

## Emergency Services
24/7 emergency plumbing available from 43 providers.

## Common Issues
- Water heater repair: $250-$800
- Drain cleaning: $100-$300
- Pipe replacement: $400-$2,000
```

2. **User-Generated Content**
- Import reviews
- Local forum discussions
- Q&A sections

3. **Expert Commentary**
- Industry insights per location
- Local regulations/codes
- Seasonal considerations

## Keyword Density

**Target:** 1-3% for primary keyword

### Calculation

```javascript
function keywordDensity(content, keyword) {
  const words = content.toLowerCase().split(/\s+/);
  const keywordWords = keyword.toLowerCase().split(/\s+/);
  const totalWords = words.length;

  let count = 0;
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const phrase = words.slice(i, i + keywordWords.length).join(' ');
    if (phrase === keyword.toLowerCase()) count++;
  }

  return (count / totalWords) * 100;
}

// Example
const content = "Plumber in Austin TX. Find Austin plumbers...";
const density = keywordDensity(content, "plumber in austin");
// Returns: 2.1% (good range)
```

### Best Practices

- **1-2%:** Natural, safe range
- **3-4%:** Maximum before risk
- **>5%:** Keyword stuffing territory

### Placement Priority

1. Title tag (first 3-5 words)
2. H1 heading
3. First paragraph (first 100 words)
4. Subheadings (H2/H3)
5. Image alt text
6. Internal anchor text
7. Meta description

## Value-Add vs Doorway Pages

### Doorway Pages (Avoid)

```html
<!-- Bad: Doorway page -->
<h1>Plumber Austin</h1>
<p>Looking for plumber Austin? Click here.</p>
<a href="/contact">Contact Us</a>
```

**Characteristics:**
- Sole purpose: funnel to conversion page
- No substantive content
- Duplicate template across locations
- No unique value

### Value-Add Pages (Create)

```html
<!-- Good: Value-add page -->
<h1>Plumber Services in Austin, TX</h1>

<p>Austin has 127 licensed plumbing contractors. Average emergency response time is 2.3 hours. Service calls typically cost $125-$175.</p>

<h2>Top-Rated Plumbers in Austin</h2>
<ul>
  <li>ABC Plumbing - 4.9/5 (234 reviews)</li>
  <li>XYZ Plumbers - 4.7/5 (189 reviews)</li>
</ul>

<h2>Common Plumbing Issues in Austin</h2>
<ul>
  <li>Hard water deposits (due to limestone aquifer)</li>
  <li>Tree root intrusion (native oak trees)</li>
  <li>Seasonal freeze protection</li>
</ul>

<h2>Austin Plumbing Codes</h2>
<p>Austin follows the 2018 International Plumbing Code with local amendments...</p>
```

**Characteristics:**
- Educational content
- Local data/statistics
- Unique insights
- Actionable information
- Internal linking to related topics

## Google Guidelines Compliance

### Quality Rater Guidelines

1. **E-E-A-T (Experience, Expertise, Authoritativeness, Trust)**
   - Show author expertise
   - Cite data sources
   - Include contact information
   - Maintain factual accuracy

2. **Helpful Content System**
   - Written for people, not search engines
   - Demonstrates first-hand knowledge
   - Clear purpose and value
   - Satisfies search intent

### Implementation Checklist

```markdown
## Pre-Launch Quality Checklist

### Content Quality
- [ ] >300 words per page
- [ ] 80%+ unique content
- [ ] Readability grade 8-12
- [ ] No keyword stuffing (1-3% density)
- [ ] Substantive, actionable information

### Technical SEO
- [ ] Unique title tag (50-60 chars)
- [ ] Unique meta description (150-160 chars)
- [ ] Proper heading hierarchy (H1 > H2 > H3)
- [ ] Clean URL structure
- [ ] Internal linking (3-10 links)
- [ ] Schema markup (JSON-LD)
- [ ] Mobile-responsive
- [ ] Page speed <3s

### User Experience
- [ ] Clear value proposition
- [ ] Easy navigation
- [ ] Readable font/spacing
- [ ] Accessible (WCAG AA)
- [ ] No intrusive interstitials

### Google Compliance
- [ ] Not doorway page
- [ ] Not auto-generated spam
- [ ] Not thin content
- [ ] Original research/data
- [ ] Proper attribution/citations
```

## Quality Validation Workflow

```javascript
// Automated quality checks
class PSEOQualityValidator {
  validate(page) {
    const results = {
      passed: [],
      failed: [],
      warnings: []
    };

    // Word count
    const wordCount = this.countWords(page.content);
    if (wordCount < 300) {
      results.failed.push(`Word count too low: ${wordCount} (min: 300)`);
    } else if (wordCount < 500) {
      results.warnings.push(`Word count acceptable but low: ${wordCount}`);
    } else {
      results.passed.push(`Word count: ${wordCount}`);
    }

    // Uniqueness
    const uniqueness = this.calculateUniqueness(page);
    if (uniqueness < 0.70) {
      results.failed.push(`Uniqueness too low: ${uniqueness}% (min: 70%)`);
    } else if (uniqueness < 0.80) {
      results.warnings.push(`Uniqueness acceptable: ${uniqueness}%`);
    } else {
      results.passed.push(`Uniqueness: ${uniqueness}%`);
    }

    // Keyword density
    const density = this.keywordDensity(page.content, page.primaryKeyword);
    if (density > 5) {
      results.failed.push(`Keyword stuffing detected: ${density}%`);
    } else if (density < 1) {
      results.warnings.push(`Keyword density low: ${density}%`);
    } else {
      results.passed.push(`Keyword density: ${density}%`);
    }

    // Internal links
    const internalLinks = page.links.filter(l => l.internal).length;
    if (internalLinks < 3) {
      results.warnings.push(`Few internal links: ${internalLinks}`);
    } else {
      results.passed.push(`Internal links: ${internalLinks}`);
    }

    return {
      passed: results.failed.length === 0,
      ...results
    };
  }

  countWords(text) {
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }

  calculateUniqueness(page) {
    // Compare to other pages in set
    // Return percentage of unique n-grams
    // Implementation depends on corpus
  }

  keywordDensity(content, keyword) {
    const words = content.toLowerCase().split(/\s+/);
    const matches = words.filter(w => w === keyword.toLowerCase()).length;
    return (matches / words.length) * 100;
  }
}
```

## Batch Quality Sampling

```javascript
// Sample random pages for manual review
function sampleForReview(pages, sampleSize = 50) {
  const sample = pages
    .sort(() => 0.5 - Math.random())
    .slice(0, sampleSize);

  return sample.map(page => ({
    url: page.url,
    wordCount: countWords(page.content),
    uniqueness: calculateUniqueness(page),
    keywordDensity: keywordDensity(page.content, page.keyword),
    internalLinks: page.links.filter(l => l.internal).length,
    status: validatePage(page).passed ? 'PASS' : 'FAIL'
  }));
}
```

## Common Mistakes to Avoid

1. **Over-optimization:** Keyword stuffing, unnatural linking
2. **Template visibility:** Obvious `[VARIABLE]` patterns in live content
3. **Duplicate content:** Same intro across all pages
4. **Thin pages:** <300 words with no unique value
5. **Broken links:** Dead internal/external links
6. **Missing schema:** No structured data markup
7. **Poor UX:** Difficult navigation, slow load times
8. **No value-add:** Pure doorway pages

## Success Metrics

Track these KPIs post-launch:

- **Indexation rate:** >90% of pages indexed
- **Average position:** Top 20 for long-tail
- **CTR:** >2% from search
- **Bounce rate:** <70%
- **Time on page:** >60 seconds
- **Conversion rate:** Depends on goal (form, purchase, etc.)
