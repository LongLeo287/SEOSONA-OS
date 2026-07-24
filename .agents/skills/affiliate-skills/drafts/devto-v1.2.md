# Dev.to Article — affiliate-skills v1.2

**Images:** 
- Image #3 (Skill list with 🆕 tags) → after "The 5 New Skills" section
- Image #4 (Flywheel + explanation) → after "The Flywheel" section

---

**Title:** I built 50 AI skills for affiliate marketing — here's the social intelligence layer

**Tags:** opensource, ai, marketing, webdev

**Published:** true

---

## The Problem

Most AI-written affiliate content is generic. The AI picks a format by default, writes from training data, and hopes it converts. No engagement signals. No real sources. No data on what's actually working.

I wanted to fix that.

## What I Built

[affiliate-skills](https://github.com/Affitor/affiliate-skills) is a collection of 50 SKILL.md files — each one tells any AI exactly how to execute an affiliate marketing task. Input/output schemas, step-by-step workflows, error handling, and chaining metadata.

The v1.2 update adds a **social intelligence layer**: 5 new skills that bring real engagement data into the content creation pipeline.

## The 5 New Skills

### 1. trending-content-scout (S1 Research)

Scans YouTube, TikTok, X, and Reddit for top-performing content by engagement score.

**What it returns:**
- Top 20 content sorted by engagement
- Winning formats (comparison: 45%, tutorial: 25%, review: 20%)
- Best hooks ("I replaced my $5K video team" → engagement: 42.3)
- Content gaps (nobody comparing HeyGen vs Synthesia on TikTok)
- Engagement benchmark (median views, top 10% threshold)

**Engagement Score Formula:**

```
engagement_score = (likes × 2 + comments × 3 + shares × 5) / max(views, 1) × 1000
```

Shares weighted 5x because they're the strongest viral signal. Comments 3x for high-intent. Likes 2x for low-effort positive signal.

### 2. content-angle-ranker (S1 Research)

Generates 8-12 content angle candidates and scores each on 4 dimensions:

```
angle_score = (platform_fit × 0.25) + (competition_level × 0.30) + 
              (engagement_prediction × 0.30) + (creator_fit × 0.15)
```

Output: ranked list with a clear #1 recommendation and ready-to-use parameters for the next skill.

### 3. traffic-analyzer (S1 Research)

Evaluates any website's traffic health before you commit to promoting their program. Pulls SimilarWeb-style data, calculates a Traffic Health Score 0-100, and compares multiple domains side-by-side.

### 4. content-research-brief (S2 Content)

Collects 5-10 real source articles, auto-tags them (AI, Funding, SaaS, Tools, Trends), extracts key stats and quotes, and generates 3+ unique content angles — each backed by a different primary source.

### 5. infographic-generator (S2 Content)

Generates complete infographic specs: layout, data points, copy, color scheme. Platform-optimized (LinkedIn 1080×1350, IG square, Twitter landscape). Output as structured spec or self-contained HTML/CSS.

<!-- INSERT IMAGE #3 HERE: Skill list with 🆕 tags -->

## The Flywheel

Every skill knows what comes next. Data flows forward through the funnel and back through analytics:

```
S1 RESEARCH → S2 CONTENT → S3 BLOG & SEO → S4 OFFERS & LANDING
     ↑                                              ↓
     │                                        S5 DISTRIBUTION
     │                                              ↓
     └──────── S6 ANALYTICS ◀────────────────────────┘
                    ↓
              S7 AUTOMATION → SCALE
```

<!-- INSERT IMAGE #4 HERE: Flywheel + explanation -->

**Closed loop.** S6 feeds back to S1. Your performance data refines the next content scout run.

**Data-driven.** By the time you write, you already know what format, hook, and platform to use.

**Research-backed.** Content skills don't write from thin air. `content-research-brief` collects real articles first.

## API-Optional Design

All skills work with just `web_search` and `web_fetch`. No API keys required.

But if you have APIs, the data gets better:

```yaml
social_data_config:
  youtube:
    provider: "youtube-data-api"
    api_key: "AIzaSy..."
  tiktok:
    provider: "rapidapi"
    api_key: "YOUR_KEY"
    host: "tiktok-api23.p.rapidapi.com"
```

Supported providers: YouTube Data API v3, RapidAPI (YouTube, TikTok, X, Reddit, SimilarWeb), SerpAPI, Apify, or any custom API with field mapping.

## Feedback Protocol

When a skill underperforms, it auto-generates a `skill_feedback` block:

```yaml
skill_feedback:
  skill: "trending-content-scout"
  status: "partial_failure"
  issue_type: "data_quality"
  step_failed: "Step 2"
  description: "TikTok returned 0 results"
  severity: "low"
  suggestion: "Add alternative search queries"
```

9 auto-detection triggers. Issue taxonomy: `data_quality`, `hallucination`, `chain_break`, `schema_mismatch`, etc. High/critical severity → suggests filing a GitHub Issue.

## Try It

**Any AI, no install:**

```
Paste into Claude, ChatGPT, or Gemini:

"Scout trending content about AI video tools on YouTube and TikTok. 
Show me top content by engagement, winning formats, and content gaps."
```

**Claude Code / Pi:**

```bash
git clone https://github.com/Affitor/affiliate-skills.git ~/.claude/skills/affiliate-skills
cd ~/.claude/skills/affiliate-skills && ./setup
```

**Full repo:** [github.com/Affitor/affiliate-skills](https://github.com/Affitor/affiliate-skills)

50 skills. 8 stages. MIT license. Works with any AI.

---

*What does your content research workflow look like? Would love to hear how others approach data-driven content creation.*
