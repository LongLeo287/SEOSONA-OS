---
name: "social_ingestion_facebook"
description: "Automatically scrape, extract, and structure content from Facebook posts, pages, and groups for knowledge ingestion."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["social-media", "facebook", "content-ingestion", "marketing"]
mcp_compatible: true
---

# 🛠️ Skill: Facebook Content Ingestion

> **Purpose**: Extracts post content, images, and engagement metrics from Facebook to populate the SEOSONA Knowledge Base. Overcomes common scraping blocks using Firecrawl MCP and specialized DOM parsing.

## 📥 Inputs & Requirements
- **Dependencies**: Firecrawl MCP Server, Apify Facebook Scraper (fallback).
- **Input Format**: `{ "url": "https://facebook.com/...", "extract_comments": boolean }`

## 🧠 Execution Steps (The Method)
1. **Validation**: Check if URL is a valid public Facebook post, page, or group link.
2. **Scraping Phase**: 
   - Attempt Firecrawl MCP to grab the raw HTML/Markdown.
   - If blocked by auth-wall, fallback to headless browser via Playwright (with active session cookies) or Apify.
3. **Data Extraction**:
   - Extract primary post text.
   - Extract image URLs and send to `vision_analysis` skill for alt-text generation.
   - Extract engagement metrics (Likes, Shares, Comments count).
4. **Knowledge Structuring**: Convert the extracted data into a unified Markdown/JSON format compatible with `3_MEMORY/knowledge_items/`.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Attempt to scrape private profiles or closed groups without valid session cookies.
- **DO NOT**: Store Personally Identifiable Information (PII) of commenters. Strip all regular user names; only keep brand/page names.
- **FALLBACK**: If direct scraping fails, instruct the user to provide the raw HTML source of the page.

## ✅ Quality Validation Criteria (MANDATORY)
*Before outputting "TASK COMPLETED", the agent MUST self-verify against these criteria:*
- [ ] Criteria 1: Output matches the standard Knowledge Base `.md` schema.
- [ ] Criteria 2: No placeholder text left in the extracted content.
- [ ] Criteria 3: Data privacy guardrails respected (no user PII).
- [ ] Criteria 4: Engagement metrics are accurately captured or explicitly marked as "N/A".

## 💻 Example Invocation (System Prompt Fragment)
```markdown
<skill_usage_example>
User: "Cào nội dung bài viết này giúp mình: https://facebook.com/seosona/posts/123"
Action: Execute `social_ingestion_facebook` with input `{ "url": "https://facebook.com/seosona/posts/123", "extract_comments": false }`
Result: "[Knowledge Item created in 3_MEMORY]"
</skill_usage_example>
```
