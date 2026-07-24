# Hacker News — Show HN

**No image** (HN culture = text-only)

---

**Title:**
Show HN: 50 AI agent skills for affiliate marketing (Markdown, works with any LLM)

**Body:**

I've been building a collection of AI agent skills for affiliate marketing, packaged as SKILL.md files. Each file tells an AI exactly how to execute a specific task — with input/output schemas, workflow steps, error handling, and chaining to the next skill.

50 skills across 8 stages: research → content → blog/SEO → landing pages → distribution → analytics → automation → meta.

The v1.2 update adds a social intelligence layer:

- trending-content-scout: searches YouTube/TikTok/X/Reddit, normalizes engagement data, identifies winning formats and content gaps

- content-angle-ranker: generates 8-12 angle candidates and scores them by competition level, engagement prediction, platform fit, and creator strengths

- traffic-analyzer: pulls SimilarWeb-style data for any domain, scores advertiser website health 0-100

- content-research-brief: fetches 5-10 real articles, auto-tags by theme, extracts stats/quotes, generates unique angles backed by actual sources

- infographic-generator: outputs structured specs (layout, data, copy, colors) for branded infographics, optionally as self-contained HTML

Design decisions worth discussing:

1. All APIs are optional. Every skill falls back to web_search/web_fetch. Users with no API keys get patterns and gaps. Users with RapidAPI/YouTube API/etc get exact metrics.

2. Engagement score formula standardized across all skills: (likes×2 + comments×3 + shares×5) / max(views,1) × 1000. Curious if this weighting makes sense to others.

3. Feedback protocol: when a skill underperforms (self-validation fails, user rejects output, downstream skill can't parse), it appends a structured skill_feedback block. Issue taxonomy: data_quality, hallucination, chain_break, schema_mismatch, etc.

4. Version check: agents compare local VERSION file against remote, notify user if update available. Silent skip on network failure.

Pure Markdown. No runtime. Works with Claude Code, Pi, ChatGPT, Gemini CLI, Cursor, any AI that can read text files.

https://github.com/Affitor/affiliate-skills
