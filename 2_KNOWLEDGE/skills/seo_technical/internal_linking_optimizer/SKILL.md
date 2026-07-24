---
name: "internal_linking_optimizer"
description: "Analyzes and optimizes the internal link graph of a website for SEO authority distribution."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["seo-technical", "internal-linking", "site-architecture", "topical-authority"]
mcp_compatible: true
---

# 🛠️ Skill: Internal Linking Optimizer

> **Purpose**: Maps, analyzes, and optimizes a website's internal link structure to ensure proper authority distribution, topical clustering, and crawl efficiency.

## 📥 Inputs & Requirements
- **Dependencies**: Firecrawl MCP (for crawling), sitemap.xml
- **Input Format**: `{ "domain": "https://...", "sitemap_url": "https://.../sitemap.xml" }`

## 🧠 Execution Steps (The Method)
1. **Crawl & Map**: Crawl the website (or parse sitemap) to build a complete URL inventory with all internal links.
2. **Graph Analysis**:
   - Calculate link depth for each page (clicks from homepage).
   - Identify orphan pages (0 internal links pointing to them).
   - Identify link hubs (pages with excessive outbound links).
   - Map topical clusters (group pages by URL pattern and content similarity).
3. **Authority Flow Analysis**: Simulate PageRank-like authority flow to identify pages that are under-linked relative to their importance.
4. **Recommendations**:
   - Suggest new internal links (source page → target page with anchor text).
   - Flag pages that need link reduction (dilution risk).
   - Propose breadcrumb improvements.
5. **Output**: Link graph visualization (Mermaid diagram) + actionable recommendation table.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Suggest manipulative anchor text patterns (avoid over-optimization).
- **FALLBACK**: If crawling the full site exceeds resource limits, prioritize top 100 pages by traffic.

## ✅ Quality Validation Criteria (MANDATORY)
- [ ] Orphan pages identified and listed with specific linking recommendations.
- [ ] Link depth analysis shows no critical pages beyond 3 clicks from homepage.
- [ ] Recommendations include specific source URL, target URL, and suggested anchor text.

## 💻 Example Invocation
```markdown
User: "Phân tích internal link cho seosona.com"
Action: Execute `internal_linking_optimizer` with `{ "domain": "https://seosona.com" }`
Result: "[Link graph + 15 optimization recommendations generated]"
```
