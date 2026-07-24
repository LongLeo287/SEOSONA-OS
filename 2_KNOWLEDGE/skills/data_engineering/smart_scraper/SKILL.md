---
name: "smart_scraper"
description: "Intelligent web scraping with automatic retry, rate limiting, and anti-detection via Firecrawl patterns."
version: "1.0.0"
tags: ["scraping", "data-extraction", "firecrawl", "web-scraping", "automation"]
connector: "scripts/connectors/scraper_agent.py"
---

# Skill: Smart Scraper

## Execution Steps
1. Accept target URL(s) and data extraction schema (what fields to extract).
2. Analyze target: static HTML vs JS-rendered vs API-backed.
3. Select strategy: Simple HTTP for static, Firecrawl/Playwright for dynamic.
4. Execute with guardrails: rate limiting, rotating user agents, retry with backoff.
5. Extract and validate data against schema.
6. Output: Clean CSV/JSON with extracted data.

## Scraping Strategies
| Target Type | Tool | Method |
|---|---|---|
| Static HTML | HTTP + BeautifulSoup | Direct parse |
| JS-rendered SPA | Firecrawl / Playwright | Headless browser |
| Paginated lists | HTTP + pagination logic | Follow next links |
| API-backed | Direct API calls | REST/GraphQL |

## Quality Validation
- [ ] robots.txt respected
- [ ] Rate limiting applied (max 1 req/second default)
- [ ] Extracted data matches schema (no missing fields)
- [ ] No PII inadvertently captured
