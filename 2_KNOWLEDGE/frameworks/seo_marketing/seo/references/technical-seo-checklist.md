# Technical SEO Checklist

## Crawlability
- [ ] robots.txt exists, no critical blocks
- [ ] XML sitemap submitted to Search Console
- [ ] Canonical tags on all pages
- [ ] No orphan pages (all pages linked)
- [ ] Redirect chains < 3 hops

## Indexation
- [ ] No unintended noindex tags
- [ ] Important pages indexed (site:domain.com)
- [ ] Remove/noindex thin content
- [ ] Pagination handled (rel=prev/next or load more)

## Site Speed
- [ ] LCP < 2.5 seconds
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images optimized (WebP, lazy load)
- [ ] CSS/JS minified, deferred
- [ ] CDN configured

## Mobile
- [ ] Mobile-responsive design
- [ ] No horizontal scroll
- [ ] Touch targets > 48px
- [ ] Font size > 16px
- [ ] Viewport meta tag set

## Security
- [ ] HTTPS enabled (no mixed content)
- [ ] Security headers set
- [ ] No exposed sensitive files

## Structure
- [ ] Clean URL structure (/category/page)
- [ ] Breadcrumbs implemented
- [ ] Internal linking strategy
- [ ] 404 page with navigation

## Audit Output Format

```markdown
## Technical SEO Audit: [Site]

### Summary
- Crawlability: [score]/100
- Indexation: [score]/100
- Speed: [score]/100
- Mobile: [score]/100

### Critical (Fix Now)
| Issue | Pages | Impact |
|-------|-------|--------|

### High Priority
[Issues list]

### Recommendations
1. [Action item]
```

## Tools

**API-based:**
- Google Search Console
- PageSpeed Insights (`audit-core-web-vitals.cjs`)

**Browser-based (chrome-devtools skill):**
- `performance.js` - Real CWV metrics
- `network.js` - Redirect chains, 404s
- `screenshot.js` - Visual verification
- See: `browser-seo-audit-workflow.md`
