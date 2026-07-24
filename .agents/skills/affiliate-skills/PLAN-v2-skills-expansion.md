# PLAN v2: Skills Expansion + README Upgrade

> **Mục tiêu:** Đóng gói capabilities từ `hidrix-tools` (MCP tools) + `content-pipeline` (LinkedIn content engine) thành skills cho `affiliate-skills`. Nâng cấp README thành world-class. Biến affiliate-skills thành THE definitive AI skills package cho affiliate marketing — cho affiliates, influencers, marketers, affiliate networks, và advertisers.
>
> **Nguồn:** hidrix-tools (7 MCP tools), content-pipeline (research → write → image pipeline), gstack (structured workflows), ai-marketing-skills (growth engine patterns)

---

## Phân tích nguồn

### hidrix-tools — 7 MCP tools
| Tool | Có thể thành Skill? | Phân tích |
|------|---------------------|-----------|
| `web_search` | ❌ Đã có sẵn (tool cơ bản) | Mọi AI đều có web_search |
| `web_fetch` | ❌ Đã có sẵn | Tool cơ bản |
| `youtube_search` | ✅ → Tích hợp vào `trending-content-scout` | Search + view count data |
| `tiktok_search` | ✅ → Tích hợp vào `trending-content-scout` | Search + play/like count |
| `x_search` | ✅ → Tích hợp vào `trending-content-scout` | Top tweets |
| `reddit_search` | ✅ → Tích hợp vào `trending-content-scout` | Posts with scores |
| `similarweb` | ✅ → **NEW skill**: `traffic-analyzer` | Traffic, rank, sources — competitor intelligence |

**Kết luận:** 4 social search tools đã được tích hợp logic vào `trending-content-scout` (Phase trước, qua social-data-providers.md). `similarweb` chưa có skill tương ứng → tạo mới.

### content-pipeline — LinkedIn Content Engine
| Feature | Có thể thành Skill? | Phân tích |
|---------|---------------------|-----------|
| Brave Search research | ✅ → **NEW skill**: `content-research-brief` | Research trending topics, collect sources |
| Article selection + tagging | ✅ → Tích hợp vào research brief | Auto-tag: Funding, AI, SaaS, Tools, Trends |
| Format selection (Toplist, POV, Case Study, How-to) | ✅ → Đã có tương tự trong S2/S3 skills | viral-post-writer, blog-builder đã cover |
| Claude streaming write | ❌ Đã có (core capability) | Mọi AI skill đều viết |
| Satori infographic generation | ✅ → **NEW skill**: `infographic-generator` | Branded image từ content — unique value |
| Multi-source synthesis | ✅ → Tích hợp vào `content-research-brief` | N sources → unique angle per output |

**Kết luận:** 2 unique capabilities cần skill mới: research brief aggregator + infographic generator.

---

## Thay đổi

### A. Skills mới (3 skills)

| # | Skill | Stage | Source | Mô tả |
|---|-------|-------|--------|--------|
| 1 | `traffic-analyzer` | S1-Research | hidrix-tools/similarweb | Analyze website traffic, rank, sources. Compare affiliate program websites. Evaluate advertiser strength. |
| 2 | `content-research-brief` | S2-Content | content-pipeline | Research trending topics via web search. Collect 5-10 source articles. Auto-tag. Generate research brief with multi-angle synthesis. Foundation for any content creation. |
| 3 | `infographic-generator` | S2-Content | content-pipeline/Satori | Generate branded infographic specs (layout, data, colors, copy) from any content. LinkedIn-optimized 1080×1350. Can be rendered by Satori, Canva, or manually. |

### B. Skills upgraded from existing social-intelligence (đã làm Phase trước)

`trending-content-scout` đã reference hidrix-tools social search APIs trong `social-data-providers.md`. Không cần thêm.

### C. README.md — Complete rewrite

| Section | Thay đổi |
|---------|----------|
| Tagline | 45 → 50 skills, thêm "social intelligence" angle |
| Flywheel diagram | Giữ nguyên nhưng move lên ngay sau intro (như screenshot yêu cầu) |
| Skill tables | Thêm 5 skills mới (2 từ social-intelligence + 3 từ plan này) |
| Demo | Nâng cấp: thêm trending-content-scout + content-research-brief vào flow |
| Who this is for | Mở rộng: affiliates + influencers + marketers + networks + advertisers |
| Companion tools | Thêm section: hidrix-tools (MCP) + content-pipeline (app) |
| Social intelligence | Thêm section mới highlight social data capabilities |

### D. Reference updates

| File | Thay đổi |
|------|----------|
| `social-data-providers.md` | Thêm SimilarWeb section (đã có nhưng update) |
| `flywheel-connections.md` | Thêm connections cho 3 skills mới |
| `registry.json` | Thêm 3 entries |

---

## Chi tiết từng skill

### 1. NEW: `skills/research/traffic-analyzer/SKILL.md`

**Source:** hidrix-tools `similarweb` tool
**Why it's a skill, not just a tool:** A tool returns raw data. A skill interprets data, scores it, compares it, and recommends actions.

**Core value:**
- Evaluate affiliate program website health before promoting
- Compare competitor traffic sources (organic vs paid vs social)
- Identify which platforms drive traffic → inform content strategy
- Score advertiser viability (high-traffic advertiser = better conversion support)

**Input:** domain(s) to analyze
**Output:** traffic scorecard with rank, visits, engagement, traffic sources, competitive comparison

**Workflow:**
1. Get traffic data (SimilarWeb API if configured, web_search fallback)
2. Analyze: rank, visits, bounce rate, pages/visit, time on site
3. Break down traffic sources (direct, search, social, referral, paid)
4. Compare if multiple domains provided
5. Score and recommend

**Flywheel:**
- Feeds Into: `affiliate-program-search` (S1), `competitor-spy` (S1), `niche-opportunity-finder` (S1)
- Fed By: `competitor-spy` (S1) — competitor domains to analyze

---

### 2. NEW: `skills/content/content-research-brief/SKILL.md`

**Source:** content-pipeline research + select + synthesis flow
**Why it's unique:** Most content skills start writing immediately. This skill does structured research FIRST — collecting 5-10 source articles, auto-tagging by theme, then synthesizing into a research brief that any content skill can consume.

**Core value:**
- Research-backed content instead of AI-hallucinated content
- Multi-source synthesis → each output piece has a unique angle
- Auto-tagging: Funding, AI, SaaS, Tools, Trends, Startup, Growth, Industry
- Research brief becomes shared context for all downstream S2/S3 skills

**Input:** topic + optional filters (news/blogs/linkedin/youtube)
**Output:** research brief with tagged sources, key insights, suggested angles

**Workflow:**
1. Search web for topic (Brave Search if available, web_search fallback)
2. Fetch top 5-10 articles
3. Auto-tag each source by theme
4. Extract key data points, quotes, stats from each
5. Synthesize: identify 3-5 unique angles from the source material
6. Output research brief ready for any content skill

**Flywheel:**
- Feeds Into: `viral-post-writer` (S2), `affiliate-blog-builder` (S3), `tiktok-script-writer` (S2), `content-pillar-atomizer` (S2), `infographic-generator` (S2)
- Fed By: `trending-content-scout` (S1) — trending topics to research deeper, `niche-opportunity-finder` (S1) — niche keywords

---

### 3. NEW: `skills/content/infographic-generator/SKILL.md`

**Source:** content-pipeline Satori rendering
**Why it's a skill:** Generates the complete infographic specification (layout, data visualization, copy, color scheme) as a structured output. Can be consumed by Satori, Canva, Figma, or built as HTML/CSS.

**Core value:**
- LinkedIn posts with infographics get 3x engagement vs text-only
- Branded visual content from any data or article
- Platform-optimized dimensions (LinkedIn: 1080×1350, IG: 1080×1080, Twitter: 1200×675)
- No design skills required — AI generates the complete spec

**Input:** content/data + platform + brand colors (optional)
**Output:** infographic spec (layout, copy, data points, colors, dimensions) + optional HTML/CSS renderable version

**Workflow:**
1. Extract key data points from content (stats, comparisons, steps, lists)
2. Select infographic type (data comparison, process flow, stat highlight, timeline, checklist)
3. Design layout optimized for target platform
4. Generate all copy (headline, subheads, data labels, footer)
5. Apply brand colors or generate complementary palette
6. Output as structured spec + optionally as renderable HTML/CSS

**Flywheel:**
- Feeds Into: `social-media-scheduler` (S5), `landing-page-creator` (S4)
- Fed By: `content-research-brief` (S2), `viral-post-writer` (S2), `affiliate-blog-builder` (S3), `trending-content-scout` (S1)

---

## README.md Rewrite Plan

### Structure (top to bottom):

```
1. Title + tagline (50 skills, 8 stages)
2. Badges
3. Compatibility line
4. Install (quick)
5. Try it now (no install)
6. Without vs With affiliate-skills (table)

7. ★ HOW IT WORKS — The Affiliate Flywheel (MOVED UP from deep in doc)
   - ASCII diagram
   - 2-sentence explanation
   - "Every skill knows what comes next. Data flows forward and loops back."

8. ★ UPGRADED DEMO — "zero to first commission" 
   New flow includes social intelligence:
   
   You: "I want to promote AI video tools"
   AI:  [runs trending-content-scout]
        → Scans YouTube + TikTok for top content about AI video tools
        → Top format: comparison (45% of top content)
        → Best hook: "I replaced my $5K video team" (engagement: 42.3)
        → Gap: nobody comparing HeyGen vs Synthesia on TikTok
   
   You: "What's the best program?"
   AI:  [runs affiliate-program-search]
        → HeyGen: 30% recurring, 60 days, ★ 127
   
   You: "Research the latest news about HeyGen"
   AI:  [runs content-research-brief]
        → Fetches 8 recent articles
        → Tags: AI (4), Funding (1), Tools (3)
        → Key insight: HeyGen just launched Avatar 3.0
        → 3 unique angles generated
   
   You: "Write a LinkedIn post with an infographic"
   AI:  [runs viral-post-writer + infographic-generator]
        → Post: comparison angle, bold claim hook
        → Infographic: HeyGen vs Synthesia feature comparison, 1080×1350
   
   You: "Now a TikTok script"
   AI:  [runs tiktok-script-writer]
        → 45s script, demo_first hook (backed by scout data)
        → "Watch me create a $2000 video for free in 30 seconds"
   
   You: "Plan my full funnel"
   AI:  [runs funnel-planner]
        → Week 1: Scout + Research → find winning angles
        → Week 2: Content (5 posts + 2 TikToks + 1 infographic)
        → Week 3: Blog (comparison article backed by research brief)
        → Week 4: Deploy + bio link
        → Week 5: Analytics (compare your metrics vs scout benchmark)
        → Week 6: Optimize (double down on what beat the benchmark)

9. Who this is for (EXPANDED)
   - Affiliates: find programs, create content, track performance
   - Influencers/Creators: research what's trending, create platform-native content
   - Marketers: content research, competitive analysis, multi-platform strategy
   - Affiliate Networks: evaluate program quality, benchmark advertiser traffic
   - Advertisers: audit their own program positioning, understand affiliate landscape
   - AI-native teams: plug skills into any agent pipeline

10. Get Started (existing, minor updates)

11. Full Skill Table — 8 Stages, 50 Skills
    (updated counts: S1: 8 skills, S2: 7 skills)

12. Companion Tools (NEW section)
    - hidrix-tools: MCP server for live social data
    - content-pipeline: LinkedIn content app with infographics
    
13. How it works
14. Entry points
15. For Developers
16. Contributing
17. License
```

---

## Thứ tự thực hiện

| Phase | Task | Files |
|-------|------|-------|
| **1** | Create `traffic-analyzer` skill | `skills/research/traffic-analyzer/SKILL.md` |
| **2** | Create `content-research-brief` skill | `skills/content/content-research-brief/SKILL.md` |
| **3** | Create `infographic-generator` skill | `skills/content/infographic-generator/SKILL.md` |
| **4** | Update metadata | `registry.json` + `flywheel-connections.md` |
| **5** | Rewrite README.md | Complete rewrite with all updates |

---

## Validation Checklist

- [ ] 3 new skills follow template format
- [ ] All skills work without API (web_search fallback)
- [ ] hidrix-tools APIs referenced in social-data-providers.md
- [ ] content-pipeline capabilities preserved as skill workflows
- [ ] README flywheel moved up to after intro
- [ ] Demo upgraded with social intelligence flow
- [ ] Who-this-is-for expanded to 6 audiences
- [ ] Skill count accurate: 50 skills across 8 stages
- [ ] All flywheel connections documented
- [ ] registry.json has all 50 skills
- [ ] Companion Tools section references both repos
