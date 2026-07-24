---

name: "skills-sh-trending-ecosystem"
description: "Skills.sh is "The Open Agent Skills Ecosystem". It is a centralized registry of reusable capabilities (procedural knowledge) designed specifically for AI Agents like Antigravity, Claude Code, Cursor, Windsurf, and others."
keywords: ["skills-sh-trending-ecosystem", "ingested"]
mcp_compatible: true
---

# Agent Skills Ecosystem (skills.sh)

**Source:** http~/.seosona/path/
**Date Ingested:** 2026-06-12

## 1. Overview
Skills.sh is "The Open Agent Skills Ecosystem". It is a centralized registry of reusable capabilities (procedural knowledge) designed specifically for AI Agents like Antigravity, Claude Code, Cursor, Windsurf, and others.

Skills are installed via the CLI:
```bash
npx skills add <owner/repo>
```

## 2. Trending Skill Capabilities
Based on the live trending data, the ecosystem is heavily focused on AI-driven media manipulation, specialized dev tools, and design:

- **UI/UX & Design:** `sleekdotdesign/agent-skills/sleek-design-mobile-apps`
- **Video Processing:** `qu-skills/skills/remotion-render`, `doany-ai/skills/video-edit`, `video-inpainting`
- **Image Generation & Editing:** `gpt-image-edit`, `image-outpainting`, `face-swap`, `ai-image-generation`, `kling-3-0` (from RunComfy / Doany AI)
- **Data Scraping:** `scrapegraphai/just-scrape/just-scrape`
- **Developer Coaching:** `mattpocock/skills/grill-me`, `grill-with-docs`
- **Discovery:** `vercel-labs/skills/find-skills`

## 3. SEOSONA OS Integration Strategy
Since SEOSONA OS operates via the `Antigravity` agent, we have native compatibility with this ecosystem. If `Website SEOSONA` requires dynamic video generation (Remotion), AI image outpainting for hero banners, or advanced web scraping, SEOSONA OS can automatically run `npx skills add` to absorb these specific capabilities on-the-fly instead of building them from scratch.
