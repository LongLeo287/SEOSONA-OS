---
name: "web_crawler_katana"
description: "High-speed web crawling using Katana patterns for deep site mapping, URL discovery, and content extraction."
version: "1.0.0"
tags: ["crawling", "scraping", "site-map", "url-discovery", "seo-technical"]
---

# Skill: Katana Web Crawler

## Execution Steps
1. Accept target domain and crawl parameters (depth, concurrency, filters).
2. Execute crawl: discover all URLs, follow redirects, respect robots.txt.
3. Extract: page titles, meta descriptions, status codes, response times, content types.
4. Build complete URL inventory with link relationships.
5. Output: CSV/JSON with full URL map + site structure visualization.

## Integration Points
- Complements `technical_seo_scanner.py` for deeper crawling
- Feeds data into `internal_linking_optimizer` skill
- Provides URL inventory for `seo-workflow` audit phase

## Quality Validation
- [ ] All discoverable URLs catalogued
- [ ] robots.txt respected (no disallowed URLs crawled)
- [ ] Response time data collected for performance analysis
