---
name: "server_log_analyzer"
description: "Analyzes Nginx/Apache server logs to identify Googlebot crawl patterns, errors, and performance bottlenecks."
version: "1.0.0"
tags: ["server-logs", "crawl-analysis", "googlebot", "technical-seo", "performance"]
connector: "scripts/connectors/log_analyzer.py"
---

# Skill: Server Log Analyzer

## Execution Steps
1. Accept server log file (Nginx access.log or Apache combined format).
2. Parse: Extract IP, timestamp, request URL, status code, user agent, response size.
3. Filter Googlebot: Isolate Google crawler requests by user agent.
4. Analyze:
   - Crawl frequency per page (which pages Google visits most/least)
   - Crawl budget waste (4xx/5xx pages being crawled)
   - Response time distribution (slow pages that delay crawling)
   - Crawl depth patterns (how deep does Googlebot go)
5. Report: Crawl efficiency score + optimization recommendations.

## Key Metrics
- Crawl budget utilization (% of crawls on indexable pages)
- Average response time for bot requests
- Error rate (4xx + 5xx as % of total bot requests)
- New page discovery rate

## Quality Validation
- [ ] Log file correctly parsed (no malformed entries silently dropped)
- [ ] Googlebot correctly identified (verified by reverse DNS if possible)
- [ ] Recommendations are specific and actionable
