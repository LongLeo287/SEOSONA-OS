# PLAN: Social Intelligence Upgrade cho affiliate-skills

> **Mục tiêu:** Nâng cấp content pipeline bằng cách thêm khả năng đọc dữ liệu tương tác thực (views, likes, comments, shares) từ các nền tảng — giúp user thấy được **đâu là nội dung đang thắng** trước khi tạo content.
>
> **Triết lý:** API là optional. Skill phải hoạt động được với chỉ `web_search` + `web_fetch`. Có API thì mạnh hơn. User tự config API provider mà không cần thay đổi codebase.
>
> **Tham khảo:** gstack (structured specialist roles), ai-marketing-skills (Expert Panel, Growth Engine), Affitor CMS Social Listening (existing data model)

---

## Tổng quan thay đổi

### A. Skill mới (2 skills)

| # | Skill | Stage | Mô tả |
|---|-------|-------|--------|
| 1 | `trending-content-scout` | S1-Research | Tìm top content theo keyword trên YouTube/TikTok/X/Reddit, sort by engagement, phân tích patterns |
| 2 | `content-angle-ranker` | S2-Content | Lấy data từ scout → rank các content angles theo engagement thực tế → gợi ý angle tốt nhất cho mỗi platform |

### B. Skill nâng cấp (4 skills)

| # | Skill | Thay đổi |
|---|-------|----------|
| 3 | `competitor-spy` | Thêm Step mới: Social Engagement Analysis — spy engagement metrics của competitor content |
| 4 | `viral-post-writer` | Thêm Step: Research Winning Formats — dùng data từ `trending-content-scout` để chọn format |
| 5 | `tiktok-script-writer` | Thêm Step: Analyze Top Performers — xem top TikTok scripts trong niche trước khi viết |
| 6 | `content-pillar-atomizer` | Thêm Step: Platform Performance Data — biết platform nào đang hot cho topic này |

### C. Reference mới (1 file)

| # | File | Mô tả |
|---|------|--------|
| 7 | `shared/references/social-data-providers.md` | Danh sách API providers + cách config + free alternatives |

### D. Cập nhật (2 files)

| # | File | Thay đổi |
|---|------|----------|
| 8 | `shared/references/flywheel-connections.md` | Thêm connections cho 2 skills mới |
| 9 | `registry.json` | Đăng ký 2 skills mới |

---

## Chi tiết từng thay đổi

---

### 1. NEW: `skills/research/trending-content-scout/SKILL.md`

**Vị trí trong Flywheel:** S1-Research — skill đầu tiên nên chạy trước khi tạo content

**Core idea:** Thay vì đoán mò nội dung nào đang work, skill này **scan thực tế** các nền tảng và trả về top content sorted by engagement. Lấy cảm hứng từ:
- gstack `/office-hours`: "reframe the problem before you build" → "see what's winning before you create"
- ai-marketing-skills `Trend Scout`: tìm keyword gaps competitors missed
- Affitor CMS `social-listening`: đã có model data (views, likes, comments, shares)

**Input Schema:**
```yaml
keyword: string           # (required) "AI video tools", "email marketing"
platforms: string[]        # (optional, default: ["youtube", "tiktok"]) 
                           # Options: "youtube" | "tiktok" | "x" | "reddit"
sort_by: string            # (optional, default: "engagement_score")
                           # Options: "views" | "likes" | "engagement_score" | "recency"
time_range: string         # (optional, default: "30d") "7d" | "30d" | "90d" | "all"
limit: number              # (optional, default: 20)
api_config: object         # (optional) — xem social-data-providers.md
```

**Workflow:**

**Step 1: Determine Data Source**
```
IF user has API config (xem social-data-providers.md):
  → Dùng API trực tiếp (RapidAPI, Apify, SerpAPI, etc.)
  → Có structured data: views, likes, comments, shares
  
ELSE (no API — default mode):
  → Dùng web_search + web_fetch
  → web_search "[keyword] site:youtube.com" → lấy top results
  → web_search "[keyword] site:tiktok.com most viewed"
  → web_search "[keyword] site:reddit.com top"
  → web_fetch từng URL → extract engagement signals từ page
  → Note: data ít chính xác hơn API, nhưng vẫn useful
```

**Step 2: Collect & Normalize Data**
```
Mỗi content piece thu thập:
{
  title: string
  url: string
  platform: "youtube" | "tiktok" | "x" | "reddit"
  creator: string
  views: number
  likes: number
  comments: number
  shares: number
  published_date: string
  duration: string         # (video only)
  engagement_score: number # tính theo công thức bên dưới
  content_format: string   # "review" | "comparison" | "tutorial" | "listicle" | "reaction" | "story"
  hook_type: string        # "question" | "shock" | "bold_claim" | "demo_first" | "relatable"
}
```

**Engagement Score Formula:**
```
engagement_score = (likes × 2 + comments × 3 + shares × 5) / max(views, 1) × 1000

Giải thích:
- Shares × 5: viral signal mạnh nhất (người ta sẵn sàng gắn tên mình vào)
- Comments × 3: high-intent signal (mất công gõ)
- Likes × 2: low-effort nhưng vẫn là signal
- Chia cho views: normalize cho content mới vs cũ
- × 1000: cho con số dễ đọc (0-100 range thường thấy)
```

**Step 3: Analyze Patterns**
```
Từ top 20 content, extract:
- Format patterns: format nào chiếm đa số top? (e.g., 70% là comparison)
- Hook patterns: hook nào có engagement cao nhất?
- Duration sweet spot: video dài bao lâu perform tốt nhất?
- Creator patterns: ai đang dominate? đang bỏ lỡ gì?
- Gap analysis: keyword nào chưa có ai cover well?
```

**Step 4: Generate Insights Report**

**Output Schema:**
```yaml
output_schema_version: "1.0.0"
keyword: string
platforms_scanned: string[]
data_source: "api" | "web_search"   # transparency cho user
total_content_analyzed: number
top_content: ContentItem[]           # top 20 sorted by engagement_score
pattern_analysis:
  winning_formats: FormatInsight[]   # [{format, count, avg_engagement}]
  winning_hooks: HookInsight[]       # [{hook_type, count, avg_engagement}]  
  optimal_duration: string           # "45-60 seconds" for TikTok, etc.
  top_creators: CreatorInsight[]     # [{name, platform, avg_engagement}]
  content_gaps: string[]             # "Nobody has done X angle"
  engagement_benchmark:
    median_views: number
    median_likes: number
    median_engagement_score: number
    top_10_percent_threshold: number # engagement_score cần đạt để vào top 10%
recommended_angles: string[]         # top 3 angles dựa trên gaps + high engagement
recommended_next_skill: string       # "content-angle-ranker" hoặc "viral-post-writer"
```

**Output Format:**
```markdown
## Trending Content Scout: [Keyword]

### Data Source
[API: RapidAPI YouTube + TikTok | web_search (no API configured)]
[Scanned: X content pieces across Y platforms]

### Top Performing Content

| # | Title | Platform | Creator | Views | Engagement | Format |
|---|-------|----------|---------|-------|------------|--------|
| 1 | ... | YouTube | @creator | 150K | 42.3 | comparison |
| 2 | ... | TikTok | @creator | 800K | 38.1 | demo_first |

### Pattern Analysis

**Winning Formats:**
1. Comparison (45% of top content, avg engagement: 35.2)
2. Tutorial (25%, avg: 28.4)
3. Review (20%, avg: 22.1)

**Best Hooks:**
1. Bold claim: "This tool replaced my $5K/mo agency" (avg engagement: 41.3)
2. Demo first: Show result in first 3 seconds (avg: 36.8)

**Duration Sweet Spot:** 45-60s (TikTok), 8-12min (YouTube)

**Content Gaps:**
1. Nobody comparing [Product A] vs [Product B] on TikTok
2. No "honest cons" review — all positive, no authenticity
3. Missing "[keyword] for [specific audience]" angle

### Engagement Benchmark
- Median views: 12,000
- Top 10% threshold: engagement score > 45
- Your target: beat median to start, aim for top 10%

### Recommended Next Steps
1. Use `content-angle-ranker` to pick the best angle
2. Use `viral-post-writer` with format: comparison, hook: bold_claim
3. Use `tiktok-script-writer` with duration: 45s, hook: demo_first
```

**Error Handling:**
- **No API configured:** Fall back to web_search. Note: "Data from web_search is approximate. Configure an API provider for exact metrics — see social-data-providers.md"
- **API rate limited:** Fall back to web_search for remaining platforms. Note which platforms used API vs web_search.
- **No content found:** Keyword may be too niche. Broaden one level and re-search. If still empty → signal: this is either a gap opportunity or keyword is wrong.
- **Platform blocked/unavailable:** Skip that platform, continue with others. Note limitation.

**Flywheel Connections:**
- Feeds Into: `content-angle-ranker` (S2), `viral-post-writer` (S2), `tiktok-script-writer` (S2), `competitor-spy` (S1), `keyword-cluster-architect` (S3)
- Fed By: `performance-report` (S6) — your performance data vs benchmark
- Feedback Loop: S6 performance data shows which of your content beats the benchmark → refine what "winning" means for your niche

---

### 2. NEW: `skills/research/content-angle-ranker/SKILL.md`

**Core idea:** Lấy output từ `trending-content-scout` + user context → rank content angles theo data, không theo cảm tính. Lấy cảm hứng từ:
- ai-marketing-skills `Expert Panel`: score content with domain-specific expert personas
- gstack `/plan-ceo-review`: "find the 10-star product hiding inside the request"

**Input Schema:**
```yaml
scout_data: object          # (optional) Output từ trending-content-scout — auto-detected from context
keyword: string             # (required if no scout_data)
product: object             # (optional) Affiliate product being promoted
platform: string            # (required) Target platform: "youtube" | "tiktok" | "linkedin" | "x" | "reddit" | "blog"
creator_strengths: string[] # (optional) "storytelling" | "technical" | "humor" | "authority"
audience: string            # (optional) Target audience description
```

**Workflow:**

**Step 1: Gather Data**
- Nếu có scout_data trong context → dùng trực tiếp
- Nếu không → chạy trending-content-scout internally

**Step 2: Generate Angle Candidates (8-12 angles)**
Từ pattern analysis, generate angles:
```
Mỗi angle = {
  angle: string             # "HeyGen vs Synthesia — honest comparison for beginners"
  format: string            # "comparison"
  hook: string              # "I spent $500 testing both so you don't have to"
  platform_fit: number      # 1-10 — how well this format works on target platform
  competition_level: number # 1-10 — how many similar content exists (10 = no competition)
  engagement_prediction: number # 1-10 — predicted engagement based on benchmark data
  difficulty: string        # "easy" | "medium" | "hard"
  estimated_time: string    # "30 min" | "2 hours" | "1 day"
  why: string               # rationale
}
```

**Step 3: Score Each Angle**
```
angle_score = (platform_fit × 0.25) + (competition_level × 0.30) + (engagement_prediction × 0.30) + (creator_fit × 0.15)

creator_fit = how well angle matches creator_strengths (if provided)
```

**Step 4: Present Ranked List + Recommendation**

**Output Format:**
```markdown
## Content Angle Ranker: [Keyword] on [Platform]

### Top 3 Angles (ranked by score)

#### 🥇 Angle 1: [Title] — Score: 8.7/10
- Format: comparison | Hook: bold claim
- Competition: 2/10 (nobody doing this angle)
- Engagement prediction: 9/10 (comparison format has highest engagement in this niche)
- Time to create: 2 hours
- Why: [rationale based on data]

#### 🥈 Angle 2: ...
#### 🥉 Angle 3: ...

### All Angles Scored

| # | Angle | Format | Platform Fit | Competition | Engagement | Score |
|---|-------|--------|-------------|-------------|------------|-------|

### Recommendation
Start with Angle 1. Here's why:
[Data-backed reasoning]

### Next Steps
1. `viral-post-writer` — angle: "[Angle 1]", format: comparison, hook: bold_claim
2. `tiktok-script-writer` — angle: "[Angle 1]", duration: 45s
```

**Flywheel:**
- Feeds Into: `viral-post-writer` (S2), `tiktok-script-writer` (S2), `twitter-thread-writer` (S2), `reddit-post-writer` (S2), `affiliate-blog-builder` (S3)
- Fed By: `trending-content-scout` (S1), `performance-report` (S6)

---

### 3. UPGRADE: `competitor-spy` — thêm Social Engagement Analysis

**Thêm Step mới giữa Step 2 và Step 3:**

```markdown
### Step 2.5: Analyze Competitor Content Engagement

For each competitor, scan their recent content performance:

**With API (optional — see social-data-providers.md):**
- Search YouTube/TikTok for competitor brand name
- Get views, likes, comments for their top 10 content pieces
- Calculate engagement_score for each
- Identify which content format gets them the most engagement

**Without API (default):**
- web_search "[competitor name] youtube" → find their channel
- web_fetch channel page → extract view counts from visible videos
- web_search "[competitor name] tiktok" → find top videos
- Note: approximate data, but reveals relative performance patterns

Add to competitor assessment table:
| Dimension | Score (1-10) | Assessment |
|-----------|-------------|------------|
| ... existing dimensions ... |
| **Content Engagement** | — | How well does their content perform? High engagement = proven demand, low = weak execution |
| **Platform Strength** | — | Which platform are they strongest on? Which are they ignoring? |
```

**Thêm vào Output Schema:**
```yaml
competitors_analyzed:
  - ... existing fields ...
    avg_engagement_score: number     # NEW
    strongest_platform: string       # NEW
    weakest_platform: string         # NEW — gap to exploit
    top_performing_content: string[] # NEW — their best pieces
```

---

### 4. UPGRADE: `viral-post-writer` — thêm Research Winning Formats

**Thêm vào Step 2 (Research the Product), sau existing research:**

```markdown
### Step 2.5: Research Winning Formats (data-driven)

Before writing, check what's already working for this topic:

**If `trending-content-scout` or `content-angle-ranker` ran earlier:**
- Use `pattern_analysis.winning_formats` → pick the format with highest engagement
- Use `pattern_analysis.winning_hooks` → pick the hook style backed by data
- Use `engagement_benchmark` → know what "good" looks like for this keyword

**If no scout data available:**
- Quick scan: web_search "[product name] review site:linkedin.com" → check top posts
- Look for: post length, format (story vs list vs question), engagement signals
- Estimate which format works best on target platform

Use this data to override default assumptions about format and hook. 
Data > intuition. If comparisons get 2x engagement vs reviews in this niche, 
write a comparison — even if you'd normally write a review.
```

---

### 5. UPGRADE: `tiktok-script-writer` — thêm Analyze Top Performers

**Thêm Step mới trước Step 2 (Select the Hook Style):**

```markdown
### Step 1.5: Analyze Top Performing TikToks (data-driven)

Before selecting hook style, see what's winning in this niche:

**If `trending-content-scout` ran earlier:**
- Use TikTok-specific data from `top_content` 
- Extract: winning hooks, optimal duration, top creators' styles
- Use `engagement_benchmark` to set a target

**If no scout data (quick mode):**
- web_search "[product name] tiktok" → find top videos
- web_search "best [niche] tiktok viral" → find format patterns
- Note view counts, styles, and durations visible in search results

**Apply findings:**
- If demo_first hooks have 2x engagement → default to demo_first
- If 30-45s videos outperform 60s → adjust duration target
- If a specific creator style dominates → note as reference (not copy)

This step takes <2 minutes but can 3x the script's potential by 
building on proven patterns instead of guessing.
```

---

### 6. UPGRADE: `content-pillar-atomizer` — thêm Platform Performance Data

**Thêm vào Step 1 (Analyze the Pillar), mục platform research:**

```markdown
### Step 1.5: Check Platform Performance for This Topic

Before atomizing, understand which platforms are hot for this topic:

**If `trending-content-scout` ran:**
- Use platform-level engagement data
- Prioritize platforms where this topic has highest engagement
- Adjust platform allocation accordingly

**Quick check (no scout data):**
- web_search "[topic] youtube vs tiktok vs linkedin" → which platform dominates?
- Check: is this topic more visual (→ TikTok/YouTube) or professional (→ LinkedIn)?

**Apply to atomization:**
- If TikTok engagement is 5x LinkedIn for this topic → generate more TikTok variants
- If Reddit has high engagement → don't skip Reddit (often ignored)
- Platform allocation = proportional to engagement potential, not equal split
```

---

### 7. NEW: `shared/references/social-data-providers.md`

```markdown
# Social Data Providers

Các API providers cho social data. Tất cả đều OPTIONAL — skills hoạt động 
với web_search/web_fetch mà không cần API. Có API = data chính xác hơn + nhiều hơn.

## Cách config

Thêm vào conversation context hoặc project settings:

\```yaml
social_data_config:
  youtube:
    provider: "rapidapi"           # hoặc "serpapi", "apify", "youtube-data-api"
    api_key: "YOUR_KEY"
    # provider-specific settings
    host: "youtube-api49.p.rapidapi.com"  # RapidAPI specific
    
  tiktok:
    provider: "rapidapi"           # hoặc "apify", "tiktok-research-api"  
    api_key: "YOUR_KEY"
    host: "tiktok-api23.p.rapidapi.com"
    
  x:
    provider: "rapidapi"           # hoặc "twitter-api-v2", "apify"
    api_key: "YOUR_KEY"
    host: "twitter-api45.p.rapidapi.com"
    
  reddit:
    provider: "rapidapi"           # hoặc "reddit-api", "apify"
    api_key: "YOUR_KEY"
    host: "reddit-scraper2.p.rapidapi.com"
\```

## Provider Options

### YouTube
| Provider | Free Tier | Tốc độ | Chất lượng data |
|----------|-----------|--------|-----------------|
| **RapidAPI youtube-api49** | 100 req/mo | Fast | ★★★★★ (views, likes, comments, duration) |
| **SerpAPI** | 100 searches/mo | Fast | ★★★★ (search results + video info) |
| **YouTube Data API v3** | 10,000 units/day | Fast | ★★★★★ (official, most complete) |
| **Apify YouTube Scraper** | 5 runs/mo | Medium | ★★★★ (scraper, no API limits) |
| **web_search (no API)** | Unlimited | Slow | ★★ (approximate view counts from snippets) |

### TikTok
| Provider | Free Tier | Tốc độ | Chất lượng data |
|----------|-----------|--------|-----------------|
| **RapidAPI tiktok-api23** | 100 req/mo | Fast | ★★★★ (views, likes, comments, shares) |
| **Apify TikTok Scraper** | 5 runs/mo | Medium | ★★★★ (full data, slower) |
| **TikTok Research API** | Application required | Fast | ★★★★★ (official, limited access) |
| **web_search (no API)** | Unlimited | Slow | ★★ (view counts from search snippets only) |

### X (Twitter)
| Provider | Free Tier | Tốc độ | Chất lượng data |
|----------|-----------|--------|-----------------|
| **RapidAPI twitter-api45** | 100 req/mo | Fast | ★★★★ (likes, retweets, views) |
| **X API v2 (Basic)** | $100/mo | Fast | ★★★★★ (official) |
| **Apify Twitter Scraper** | 5 runs/mo | Medium | ★★★★ |
| **web_search (no API)** | Unlimited | Slow | ★★ |

### Reddit
| Provider | Free Tier | Tốc độ | Chất lượng data |
|----------|-----------|--------|-----------------|
| **RapidAPI reddit-scraper2** | 100 req/mo | Fast | ★★★ (upvotes, comments) |
| **Reddit API (official)** | Free (100 req/min) | Fast | ★★★★★ |
| **Apify Reddit Scraper** | 5 runs/mo | Medium | ★★★★ |
| **web_search (no API)** | Unlimited | Slow | ★★ |

### Multi-platform
| Provider | Platforms | Free Tier |
|----------|-----------|-----------|
| **SocialBlade API** | YT, TT, X, IG | Limited free |
| **Apify** | All | 5 free runs/mo |
| **SerpAPI** | Search results for all | 100/mo free |

## Không có API? Không sao.

Skills dùng web_search + web_fetch làm fallback. Data sẽ:
- Ít chính xác hơn (approximate view counts từ search snippets)
- Ít content hơn (10-20 results thay vì 50)
- Không có likes/comments/shares chi tiết

Nhưng vẫn đủ để thấy **patterns**: format nào phổ biến, ai đang dominate, 
content gaps ở đâu. Đó là insight quan trọng nhất.

## Thêm provider mới

Bạn có API provider khác? Chỉ cần config:
\```yaml
social_data_config:
  youtube:
    provider: "custom"
    base_url: "https://your-api.com"
    api_key: "YOUR_KEY"
    search_endpoint: "/search"
    search_params:
      query_field: "q"
      limit_field: "max_results"
    response_mapping:
      items_path: "data.results"
      title_field: "title"
      views_field: "statistics.views"
      likes_field: "statistics.likes"
\```

Skills sẽ dùng mapping này để đọc response từ bất kỳ API nào.
```

---

### 8. UPDATE: `shared/references/flywheel-connections.md`

**Thêm connections:**

```markdown
### S1 Research → S2 Content (NEW connections)
| From Skill | To Skill | Data Flowing |
|---|---|---|
| trending-content-scout | viral-post-writer | `pattern_analysis` (winning formats, hooks, benchmark) |
| trending-content-scout | tiktok-script-writer | `top_content` (top TikTok examples + engagement data) |
| trending-content-scout | twitter-thread-writer | `top_content` (top X threads + engagement data) |
| trending-content-scout | reddit-post-writer | `top_content` (top Reddit posts + engagement data) |
| trending-content-scout | content-angle-ranker | `full output` (all data for angle scoring) |
| content-angle-ranker | viral-post-writer | `recommended_angle` (best angle + format + hook) |
| content-angle-ranker | tiktok-script-writer | `recommended_angle` (TikTok-specific angle) |
| content-angle-ranker | affiliate-blog-builder | `recommended_angle` (blog-specific angle) |

### S1 Research (internal)
| From Skill | To Skill | Data Flowing |
|---|---|---|
| trending-content-scout | competitor-spy | `top_creators` (who's dominating this keyword) |
| competitor-spy | trending-content-scout | `competitor_urls` (channels/profiles to analyze) |

### S6 Analytics → S1 Research (feedback loop — NEW)
| From Skill | To Skill | Data Flowing |
|---|---|---|
| performance-report | trending-content-scout | `your_metrics` (compare your content vs benchmark) |
| performance-report | content-angle-ranker | `winning_angles` (which of your angles actually performed) |
```

---

### 9. UPDATE: `registry.json`

Thêm 2 entries:
```json
{
  "slug": "trending-content-scout",
  "name": "Trending Content Scout",
  "stage": "S1",
  "category": "research",
  "description": "Scan YouTube/TikTok/X/Reddit for top content by engagement. Sort by views, likes, shares. Find winning formats and content gaps before creating.",
  "tags": ["research", "social-data", "engagement", "trending", "content-intelligence"]
},
{
  "slug": "content-angle-ranker", 
  "name": "Content Angle Ranker",
  "stage": "S2",
  "category": "content",
  "description": "Rank content angles by engagement data, competition level, and platform fit. Data-driven angle selection instead of guesswork.",
  "tags": ["content-creation", "data-driven", "ranking", "angle-selection"]
}
```

---

## Updated Flywheel Flow

```
                    ┌─────────────────────┐
                    │  trending-content-   │
                    │  scout (NEW)         │
                    │  "What's winning?"   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
  S1 RESEARCH      │  content-angle-      │
                    │  ranker (NEW)        │
                    │  "Which angle wins?" │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
   ┌─────▼─────┐    ┌─────────▼───────┐    ┌───────▼────────┐
   │ viral-post │    │ tiktok-script   │    │ blog-builder   │
   │ writer     │    │ writer          │    │                │
   │ (UPGRADED) │    │ (UPGRADED)      │    │                │
   └─────┬─────┘    └─────────┬───────┘    └───────┬────────┘
         │                     │                     │
   S2-S3 CONTENT              │                     │
         └─────────────────────┼─────────────────────┘
                               │
                        S4-S5 DISTRIBUTION
                               │
                    ┌──────────▼──────────┐
                    │  performance-report  │
   S6 ANALYTICS    │  (compare vs         │
                    │  benchmark from      │
                    │  scout)              │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  FEEDBACK LOOP       │
                    │  → back to scout     │
                    │  "Am I beating the   │
                    │   benchmark?"        │
                    └─────────────────────┘
```

---

## Thứ tự thực hiện

| Phase | Files | Ước lượng |
|-------|-------|-----------|
| **Phase 1** | `shared/references/social-data-providers.md` | Reference file — cần tạo trước để skills reference |
| **Phase 2** | `skills/research/trending-content-scout/SKILL.md` | Core skill mới — mọi thứ khác depend vào |
| **Phase 3** | `skills/research/content-angle-ranker/SKILL.md` | Skill mới — dùng output từ scout |
| **Phase 4** | Upgrade `competitor-spy`, `viral-post-writer`, `tiktok-script-writer`, `content-pillar-atomizer` | 4 file sửa — thêm steps reference scout data |
| **Phase 5** | Update `flywheel-connections.md` + `registry.json` | Metadata updates |

---

## Validation Checklist

- [ ] Tất cả skills hoạt động **không cần API** (web_search/web_fetch fallback)
- [ ] Có API → data tốt hơn, nhưng **không bắt buộc**
- [ ] User có thể dùng **bất kỳ API provider nào** (RapidAPI, Apify, SerpAPI, official APIs, custom)
- [ ] Không thay đổi gì ở `affiliate-cms` codebase
- [ ] Mỗi skill mới follow đúng template format (`template/SKILL.md`)
- [ ] Flywheel connections cập nhật đầy đủ
- [ ] registry.json cập nhật
- [ ] Engagement Score formula consistent across tất cả skills
- [ ] Error handling cho mọi trường hợp: no API, rate limited, platform blocked, no results
- [ ] Output schemas tương thích với downstream skills (viral-post-writer, tiktok-script-writer, etc.)
```
