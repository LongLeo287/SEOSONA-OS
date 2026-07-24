---
description: Convert YouTube video to SEO-optimized blog post
argument-hint: <youtube-url> [writing-style]
---

# YouTube to Blog Post

Transform YouTube video into SEO-optimized long-form article.

<youtube_url>$ARGUMENTS</youtube_url>

## Workflow

1. **Extract Video Content**
   - Activate `youtube-handling` skill
   - Run VidCap API:
     ```bash
     # Get full article conversion
     python .claude/skills/youtube-handling/scripts/vidcap.py article "<url>"

     # Or custom extraction for more control
     python .claude/skills/youtube-handling/scripts/vidcap.py summary-custom "<url>" \
       --prompt "Extract main points, key quotes, and actionable insights"

     # Get captions for quotes
     python .claude/skills/youtube-handling/scripts/vidcap.py caption "<url>" --ext vtt
     ```
   - Capture: title, key points, timestamps, quotes, statistics

2. **Apply Writing Style**
   - Check for writing style in `assets/writing-styles/`
   - If style specified, apply voice/tone characteristics
   - Default: professional, educational tone
   - Activate `copywriting` skill for conversion techniques

3. **SEO Optimization**
   - Activate `seo-optimization` skill
   - Generate:
     - Primary keyword from video topic
     - Secondary keywords from content
     - Meta description (150-160 chars)
     - URL slug
   - Structure headings (H1, H2, H3) for featured snippets

4. **Content Enhancement**
   - Add intro hook (PAS or AIDA formula)
   - Convert timestamps to section headers
   - Add internal linking opportunities
   - Create conclusion with CTA
   - Include video embed

5. **Output**
   - Blog post → `assets/articles/{date}-{slug}.md`
   - Frontmatter includes:
     - SEO metadata
     - Source video URL
     - Writing style used
     - Keywords

## Skills Used

- `youtube-handling` - VidCap API for video extraction
- `copywriting` - Writing formulas and style
- `seo-optimization` - Keyword research, meta optimization
- `content-marketing` - Content structure
- `brand-guidelines` - Brand voice consistency
- `assets-organizing` - Standardized output paths

## Agents Used

- `content-creator` - Article writing
- `copywriter` - Hooks, CTAs
- `seo-specialist` - Keyword optimization

## Writing Styles

Styles are defined in `assets/writing-styles/` or `references/writing-styles.md`:

| Style | Characteristics |
|-------|-----------------|
| casual | Conversational, contractions, personal pronouns |
| professional | Formal, authoritative, data-driven |
| edgy | Provocative, bold claims, pattern interrupts |
| luxe | Elegant, minimal, premium language |
| warm | Supportive, empathetic, encouraging |

## Output Format

```yaml
---
title: "SEO Optimized Title"
slug: keyword-rich-slug
description: "Meta description under 160 chars"
keywords: [primary, secondary, related]
source_video: "https://youtube.com/watch?v=..."
writing_style: professional
date: YYYY-MM-DD
schema: Article
---

# {Title}

{Intro with hook}

## {Section from video timestamp}

{Content with quotes from video}

> "Direct quote from video" - Speaker

## Key Takeaways

- Point 1
- Point 2

## Conclusion

{CTA}

---
*This article is based on [Video Title](source_url)*
```

## Quality Gate (Auto-Triggered)

**After generating content, MUST run:**
1. `/write/audit` → Score content (target: ≥8.0)
2. `/write/publish` → Auto-fix if score <8.0
3. Present final version with score

## Examples

```bash
/youtube:blog "https://youtube.com/watch?v=xyz"
/youtube:blog "https://youtu.be/abc" casual
/youtube:blog "https://youtube.com/watch?v=123" professional
```
