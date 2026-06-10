---
name: seosona:video-content
description: >-
  Video marketing strategy, script writing, storyboards, YouTube SEO,
  platform optimization, and AI video generation workflows. Activate when
  user wants to create video content, write video scripts, optimize YouTube
  channel, plan video strategy, or convert existing content to video.
  Keywords: "video", "YouTube", "script", "storyboard", "TikTok", "Reels",
  "video SEO", "thumbnail", "video marketing", "làm video".
argument-hint: "[script|storyboard|strategy|youtube-seo] [topic]"
version: "1.0.0"
---

# Video Content

Video production strategy, scripting, YouTube SEO, and content repurposing.

## When to Use

- Writing video scripts with creative direction
- Planning video content strategy from keyword data
- YouTube SEO optimization
- Converting blog/SEO content into video
- Storyboard creation
- Thumbnail strategy
- Video repurposing across platforms

---

## Video Strategy — SEOSONA Integration

### Keyword Research → Video Topics
Use existing SEO data to drive video content:

```python
# From keyword_research_*_autocomplete.csv
High-volume + low-competition keywords → Video topics
"how to [X]" keywords → Tutorial videos
"[X] review" / "[X] vs [Y]" → Comparison videos
"best [X] for [Y]" → Listicle/roundup videos
Local keywords → Local business videos
```

### Content Pillar → Video Series
Map topical clusters to video series:
- **1 pillar topic** = 1 YouTube playlist
- **5-10 cluster topics** = individual videos in playlist
- **Internal linking** = video descriptions + pinned comments

---

## Script Writing Framework

### The 5-Part Script Structure
```
[HOOK] — First 5-15 seconds — Stop the scroll
  - Pattern interrupt (surprising stat, bold claim, question)
  - Preview the payoff ("In this video I'll show you...")
  - DO NOT: start with "Hey guys, welcome back to my channel"

[INTRO] — 30-60 seconds — Why watch this video?
  - Credibility signal (who you are, why you can answer this)
  - Set up the problem/question
  - Subscribe CTA (early, not forced)

[VALUE DELIVERY] — 60-80% of video — Main content
  - 3-7 key points (odd numbers feel more complete)
  - Each point: Concept → Example → Application
  - Pattern: teach one thing, demonstrate it, move on
  - B-roll suggestions at each visual transition point

[RETENTION HOOK] — Mid-video — Keep watching
  - "Before we get to tip #5 (the most important one)..."
  - Tease something coming up
  - Open a loop, close it later

[CTA] — Last 15-30 seconds — One action
  - One primary CTA: subscribe / comment / visit link
  - Optional: mention next video
  - End screen: link to related video
```

### Hook Templates
- **Stat:** "94% of marketers say [X], but only 12% actually do [Y]"
- **Claim:** "I ranked #1 for [keyword] with 0 backlinks. Here's exactly how."
- **Question:** "What if you could [benefit] without [pain]?"
- **Story:** "3 months ago my traffic dropped 70%. This is what I did."
- **Counter-intuitive:** "The advice everyone gives about [X] is completely wrong."

---

## YouTube SEO

### Title Formula
`[Primary Keyword] — [Benefit/Outcome] ([Year or Number])`

**Good examples:**
- "On-Page SEO: Complete Guide to Ranking #1 in 2024"
- "Technical SEO Audit: Fix 12 Issues in 30 Minutes"
- "How to Get Backlinks: 7 Strategies That Actually Work"

**Title rules:**
- Primary keyword in first 60 characters
- 60-70 character total (shows fully in search)
- Numbers and brackets increase CTR
- No clickbait — YouTube penalizes high abandon rate

### Description Template
```
[First 2-3 sentences — include primary keyword, summarize video]
This video covers [topic] including [point 1], [point 2], and [point 3].

📌 TIMESTAMPS
00:00 — Introduction
[MM:SS] — [Chapter title]
[MM:SS] — [Chapter title]

🔗 RESOURCES MENTIONED
- [Tool/link 1]
- [Tool/link 2]

📊 FREE AUDIT
[Link to SEOSONA free tool if applicable]

🔔 SUBSCRIBE for weekly SEO tips

#[keyword1] #[keyword2] #[keyword3]
```

### Tags Strategy
- First tag: exact match title keyword
- 5-10 variations of primary keyword
- 3-5 broad category tags
- 2-3 branded tags
- Total: 15-20 tags, each < 30 characters

### Thumbnail Design Principles
- **Contrast** — text readable at 120px width (thumbnail in search)
- **Face + emotion** — human faces increase CTR 38%
- **3-word text max** — readable at small size
- **Brand consistency** — same font, colors, style
- **A/B test** — YouTube Studio allows thumbnail A/B testing
- **Don't duplicate** — each thumbnail should look distinct in playlist

---

## Platform Specs

| Platform | Optimal Length | Aspect Ratio | Best Format |
|----------|---------------|--------------|-------------|
| YouTube (long) | 8-15 min | 16:9 (1920×1080) | MP4, H.264 |
| YouTube Shorts | 15-60 sec | 9:16 (1080×1920) | MP4 |
| TikTok | 15-60 sec | 9:16 (1080×1920) | MP4 |
| Instagram Reels | 15-90 sec | 9:16 (1080×1920) | MP4 |
| Instagram Feed | 1-3 min | 4:5 (1080×1350) | MP4 |
| LinkedIn | 1-5 min | 16:9 or 1:1 | MP4 |
| Twitter/X | 30-140 sec | 16:9 or 1:1 | MP4 |

---

## 1 Video → 10 Content Pieces (Repurposing)

From one YouTube video, create:
1. **Full YouTube video** (original)
2. **YouTube Shorts** — cut best 30-60 second clip
3. **TikTok** — same short with TikTok-specific hook
4. **Instagram Reels** — same + different audio/music
5. **Blog post** — transcript → structured post with headings
6. **Twitter/X thread** — key points as numbered thread
7. **LinkedIn article** — professional angle of same topic
8. **Email newsletter** — summary with link to video
9. **Podcast episode** — audio only with intro/outro
10. **Infographic** — key stats/frameworks as visual

### Repurposing Workflow
```
Record video
  → Upload to YouTube (SEO optimized)
  → Export transcript (auto-captions or Whisper)
  → Blog post from transcript (add headings, links)
  → Pull 3 best clips → Shorts/TikTok/Reels
  → Pull 5 key stats → Twitter thread
  → Summarize in email newsletter
```

---

## AI Video Generation (Veo 3.1)

For AI-assisted video creation:

### Veo Prompt Structure
```
[Shot type] of [subject] [action] in [setting].
[Lighting]: [description].
[Camera movement]: [pan/tilt/static/dolly].
[Style]: [cinematic/documentary/social media].
[Duration]: [seconds].
```

**Example:**
```
Close-up shot of hands typing on a keyboard in a modern office.
Soft natural lighting from window on left.
Slow push-in camera movement.
Style: cinematic, shallow depth of field.
Duration: 5 seconds.
```

### B-Roll Shot List Template
| Timestamp | Shot | Action | Notes |
|-----------|------|--------|-------|
| 0:30 | Close-up | Person typing | "When I first tried this..." |
| 1:15 | Screen recording | Dashboard | Show the actual result |
| 2:00 | Over-shoulder | Reading analytics | Data visualization |

---

## Video Analytics — What to Track

| Metric | Target | Action if Low |
|--------|--------|---------------|
| Click-through rate | >5% | Fix thumbnail + title |
| Average view duration | >50% | Fix script pacing, hooks |
| Audience retention cliff | < 30% at start | Improve hook |
| Like ratio | >95% | Check for controversial content |
| Comments per 1000 views | >5 | Ask questions in video |
| Subscribers from video | Track | CTA effectiveness |

## Agent Integration

**Primary:** Use for any video content task
**Related skills:** `copywriting`, `seo`, `content_marketing`
**Data sources:** `keyword_connector` (video topic ideation from keyword data)
