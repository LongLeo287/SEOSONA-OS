---
description: 💡💡 Generate SEO-optimized blog article from YouTube video
argument-hint: [youtube-url]
---

Generate a well-researched, SEO-friendly blog article from a YouTube video URL.

<youtube_url>$ARGUMENTS</youtube_url>

## Mission

Transform YouTube video content into a comprehensive blog article with citations, multiple perspectives, visual elements, and SEO optimization.

## Workflow

### 1. Writing Style Selection
- Scan `assets/writing-styles/` for available styles
- If multiple styles exist: use `AskUserQuestion` to let user select
- If only `default.md` exists: use it automatically
- Load selected style guidelines for content creation

### 2. Video Content Extraction
- Activate `youtube-handling` skill
- Extract from YouTube URL:
  - Video metadata (title, description, channel)
  - Full transcript/captions
  - AI-generated summary with key points
  - Screenshots at key moments (for illustrations)

```bash
# Get video info & summary
python .claude/skills/youtube-handling/scripts/vidcap.py info "$URL"
python .claude/skills/youtube-handling/scripts/vidcap.py summary "$URL" --screenshot
python .claude/skills/youtube-handling/scripts/vidcap.py caption "$URL" --locale en --ext vtt
```

If screenshots are not available, activate `ai-multimodal` skill to generate relevant visuals for the specific content sections.

### 3. Research & Enrichment
- Use multiple `researcher` agents in parallel to:
  - Find supporting sources and citations for claims
  - Gather different perspectives on the topic
  - Identify related statistics and data
  - Find expert opinions and counterarguments
- Compile research findings for article enrichment

### 4. SEO Optimization
- Activate `seo-optimization` skill
- Use `seo-specialist` agent for:
  - Primary/secondary keyword identification
  - Search intent analysis
  - Meta description optimization
  - Heading structure (H2-H4)
  - Internal linking opportunities

### 5. Visual Content Creation
- Activate `ai-multimodal` skill
- Generate visuals using Imagen 4:
  - Hero/featured image
  - Section illustrations or infographics
  - Quote cards for key takeaways
- Use video screenshots as supplementary visuals

### 6. Content Creation
- Use `content-creator` agent for main article body
- Use `copywriter` agent for:
  - Engaging introduction hook
  - Compelling conclusion with CTA
  - Pull quotes and highlights
- Apply selected writing style throughout
- Integrate citations naturally with proper attribution

### 7. Quality Review
- Use `content-reviewer` agent for:
  - Brand voice consistency
  - SEO checklist verification
  - Fact-checking citations
  - Readability optimization

## Agents Used

| Agent | Purpose |
|-------|---------|
| `researcher` | Find citations, perspectives, supporting data |
| `seo-specialist` | Keyword research, SEO optimization |
| `content-creator` | Main article body writing |
| `copywriter` | Hooks, conclusions, highlights |
| `content-reviewer` | Quality assurance |

## Skills Used

| Skill | Purpose |
|-------|---------|
| `youtube-handling` | Extract video content |
| `seo-optimization` | SEO best practices |
| `ai-multimodal` | Generate images/infographics |
| `content-marketing` | Content frameworks |

## Output Format

```yaml
---
title: "SEO-Optimized Article Title"
slug: keyword-optimized-slug
description: "Meta description under 160 chars"
keywords: [primary, secondary, long-tail]
source_video: "YouTube URL"
featured_image: "path/to/generated-hero.png"
schema: Article
---

# Article Title

[Hook/Introduction - 2-3 paragraphs]

## Section Heading (H2)
[Content with citations]
> Key quote from video

![Illustration](path/to/image.png)

## Another Section
[Research-enriched content]

### Subsection (H3)
[Supporting details]

## Key Takeaways
- Bullet point summary
- With actionable insights

## Conclusion
[CTA and wrap-up]

---
**Sources:**
- [Citation 1](url)
- [Citation 2](url)
- Original video: [Title](youtube-url)
```

## Output Location

- Article: `content/blog/{date}-{slug}.md`
- Images: `content/blog/images/{date}-{slug}/`

## Examples

```
/write:blog:youtube "https://youtube.com/watch?v=abc123"
/write:blog:youtube "https://youtu.be/xyz789"
```

## Token Efficiency

- Extract video content once, reuse across agents
- Run researcher agents in parallel
- Generate images only after content is finalized
- Use progressive disclosure for long transcripts
