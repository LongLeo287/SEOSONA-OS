# Ultimate AI Content Pipeline (Marketing Pipeline)

> **Source**: https://github.com/pennydinh/marketing-pineline-share
> **Ingested**: 2026-06-10
> **Type**: Reference (AI Content Automation / Marketing Pipeline)
> **License**: Open Source
> **Author**: pennydinh (Vietnamese developer)
> **Stars**: 95 | **Forks**: 69

---

## Overview

Ultimate AI Content Pipeline is a **closed-loop content production system** fully powered by AI (Claude 3, OpenAI) and Remotion video rendering. Users input a keyword, and the system handles the entire workflow: research → content generation → video creation.

**Core Promise**: Automate up to **90%** of the content creation workflow for marketers, content creators, and businesses.

---

## Core Features (Superpowers)

### 1. 📡 Auto-Scan Research (Cào Tin Độc Quyền)
- **Real-time news crawling**: Automatically crawls and analyzes live data from major publications — *TechCrunch, a16z, X (Twitter), LinkedIn* — within the last 24 hours.
- **Data-backed insights**: Extracts deep insights with supporting data, ensuring content is always current and trend-leading.

### 2. 🧠 Multi-Format AI Content Generation (Claude/OpenAI)
- **Format diversity**: Generates content in multiple formats — *Toplist, POV (Point of View), Case Study, How-to*.
- **Multilingual + Tone control**: Auto-generates parallel English & Vietnamese versions with adjustable voice (expert, friendly, humorous) targeting specific audiences.

### 3. 🎬 Auto Video & Image Rendering (Remotion Integration)
- **Text-to-video**: Automatically renders infographics and short videos from article content — no video editing skills needed.
- **Multi-platform optimization**: Exports videos in proper aspect ratios for Reels, TikTok, and Shorts.

### 4. 🔗 Extensible Architecture
- Integrates with: **OpenAI, Anthropic (Claude), RapidAPI**.
- **Next.js** frontend with a smooth, user-friendly interface.
- Few clicks from keyword to publish-ready content.

---

## Architecture & Technical Stack

| Component | Technology |
|---|---|
| **Frontend** | Next.js (TypeScript) |
| **AI Engine** | Claude 3 (Anthropic) + OpenAI |
| **Video Rendering** | Remotion |
| **Data Sources** | RapidAPI, web crawling (TechCrunch, a16z, X, LinkedIn) |
| **Language** | TypeScript |
| **Config** | `eslint.config.mjs`, `tsconfig.json`, `next.config.ts` |

### Repository Structure

```
marketing-pineline-share/
├── bot/               # AI bot logic (research + content generation)
├── public/            # Static assets
├── src/               # Next.js application source
├── AGENTS.md          # Agent instructions
├── CLAUDE.md          # Claude-specific prompts
├── HUONG_DAN_CAI_DAT.md  # Vietnamese setup guide
├── README.md
├── next.config.ts
├── package.json
├── props.json         # Remotion video composition props
└── walkthrough.html   # Interactive walkthrough
```

---

## Key Design Patterns (Learnable)

1. **Keyword-to-Content Pipeline**: Single keyword input triggers an autonomous multi-stage pipeline (Research → Write → Render). This is the exact pattern SEOSONA needs for its content automation workflows.

2. **Real-Time Research Layer**: Instead of relying solely on LLM training data, the system crawls live sources within 24h. This pattern directly maps to SEOSONA's `Auto-Scan Research` and `seo_content_research` skills.

3. **Parallel Multilingual Generation**: Simultaneously generating EN + VI content versions is directly applicable to SEOSONA's Vietnamese-first content strategy.

4. **Remotion Video Integration**: Code-driven video generation from structured content data — aligns perfectly with SEOSONA's existing `remotion` skill in `multimedia_production/`.

5. **AI Agent Architecture**: Uses `AGENTS.md` + `CLAUDE.md` for agent instruction — same pattern as SEOSONA's persona system.

6. **Format Matrix**: Toplist / POV / Case Study / How-to as selectable output formats — mirrors SEOSONA's `ai_writing_formulas` skill approach.

---

## SEOSONA Relevance Assessment

- **Skillize?** ❌ Not immediately — The codebase is a full Next.js app, not a standalone CLI/script. However, the `bot/` directory likely contains extractable pipeline logic.
- **Agentize?** ❌ Not requested by user.
- **Reference Value**: ✅ **Very High** — This is the most directly relevant repo to SEOSONA's content marketing mission. The keyword-to-content pipeline, real-time research crawling, multilingual generation, and Remotion video integration are all patterns that map directly to existing SEOSONA skills and workflows.
- **Classification**: `ingested_data/` reference only.

---

## Potential SEOSONA Integration Points

| SEOSONA Component | Marketing Pipeline Feature | Integration Opportunity |
|---|---|---|
| `seo_content_research` skill | Auto-Scan Research | Enhance with 24h live crawling pattern |
| `content_creator` skill | Multi-format AI generation | Add Toplist/POV/Case Study format templates |
| `ai_writing_formulas` skill | Tone + Format matrix | Expand with Vietnamese-specific formulas |
| `remotion` skill | Video auto-rendering | Adopt props.json pattern for content-to-video |
| `social_content_distribution` | Multi-platform export | Reels/TikTok/Shorts ratio optimization |
| `content-workflow` | End-to-end pipeline | Study as reference implementation for `ckm-write-blog` |

---

## Quick Start (from README)

```bash
git clone https://github.com/pennydinh/marketing-pineline-share.git
cd marketing-pineline-share
npm install
# Configure API keys (OpenAI, Anthropic, RapidAPI)
npm run dev
```
