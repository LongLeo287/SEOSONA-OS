# SEO Audit Workflow

Step-by-step comprehensive SEO analysis using ReviewWeb API.

## Phase 1: Initial Assessment

1. **Start Review**
```bash
curl -X POST "$BASE_URL/review" \
  -H "X-API-Key: $REVIEWWEB_API_KEY" \
  -d '{"url": "https://example.com", "instructions": "Focus on technical SEO"}'
```

2. **Capture Screenshots** (Desktop + Mobile)
```bash
# Desktop
curl -X POST "$BASE_URL/screenshot" \
  -d '{"url": "https://example.com", "fullPage": true, "deviceType": "DESKTOP"}'

# Mobile
curl -X POST "$BASE_URL/screenshot" \
  -d '{"url": "https://example.com", "fullPage": true, "deviceType": "MOBILE"}'
```

3. **Extract Links Map**
```bash
curl -X POST "$BASE_URL/scrape/links-map?url=https://example.com" \
  -d '{"includeExternal": true, "maxLinks": 100, "getStatusCode": true}'
```

## Phase 2: Keyword Research

```bash
# Use the script
node scripts/analyze-keywords.cjs -k "target keyword" -c us -o keywords.md
```

Or direct API:
- `POST /seo-insights/keyword-ideas` - Get suggestions
- `POST /seo-insights/keyword-difficulty` - Check difficulty

## Phase 3: Competitive Analysis

```bash
# Use the script for full analysis
node scripts/analyze-keywords.cjs -d "competitor.com" -o competitor.md
```

Or direct API:
- `POST /seo-insights/traffic` - Traffic metrics
- `POST /seo-insights/backlinks` - Backlink profile

## Phase 4: Content Extraction

**Extract SEO Elements**
```bash
curl -X POST "$BASE_URL/extract" \
  -d '{
    "url": "https://example.com",
    "options": {
      "instructions": "Extract SEO metadata",
      "jsonTemplate": {
        "title": "string",
        "metaDescription": "string",
        "h1": "string[]",
        "h2": "string[]",
        "canonicalUrl": "string"
      }
    }
  }'
```

## Quick Audit Checklist

- [ ] Broken links identified (`/scrape/links-map`)
- [ ] Mobile rendering verified (`/screenshot`)
- [ ] Target keywords researched (`/seo-insights/keyword-ideas`)
- [ ] Competitor backlinks analyzed (`/seo-insights/backlinks`)
- [ ] Traffic metrics captured (`/seo-insights/traffic`)
- [ ] Meta tags extracted (`/extract`)

## Output

Combine results into report:
- Technical issues (broken links, redirect chains)
- Mobile vs Desktop rendering
- Keyword opportunities with difficulty
- Backlink profile strength
- Traffic trends
- Content gaps
