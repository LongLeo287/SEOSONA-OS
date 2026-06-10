---
description: Convert YouTube video to multi-platform social posts
argument-hint: <youtube-url> [platforms]
---

# YouTube to Social Posts

Transform YouTube video into platform-optimized social content.

<youtube_url>$ARGUMENTS</youtube_url>

## Workflow

1. **Extract Video Highlights**
   - Activate `youtube-handling` skill
   - Run VidCap API:
     ```bash
     # Get summary with key points
     python .claude/skills/youtube-handling/scripts/vidcap.py summary "<url>" --screenshot

     # Get comments for social proof angles
     python .claude/skills/youtube-handling/scripts/vidcap.py comments "<url>" --order relevance

     # Get video info for metadata
     python .claude/skills/youtube-handling/scripts/vidcap.py info "<url>"
     ```
   - Extract: title, key points, quotable moments, statistics, thumbnail

2. **Generate Platform Content**
   - Activate `social-media` skill
   - Activate `copywriting` skill for hooks
   - Load `references/hook-writing.md` for hook patterns
   - Create content per platform:

   | Platform | Format | Length | Hook Style |
   |----------|--------|--------|------------|
   | Twitter/X | Thread or single | 280 chars | Curiosity gap |
   | LinkedIn | Post + carousel | 3000 chars | Thought leadership |
   | Instagram | Caption + carousel | 2200 chars | Story opener |
   | TikTok | Script for video | 60-90 sec | 3-second hook |
   | YouTube | Community post | 500 chars | Engagement question |

3. **Hook Writing Rules**
   - Reference `social-media/references/hook-writing.md`
   - AVOID:
     - Punching keywords ("SHOCKING!", "INSANE!")
     - Clickbait ("You won't BELIEVE...")
     - Excessive emojis
     - Empty promises
   - USE:
     - Curiosity gaps
     - Contrarian takes
     - Story openers
     - Specific numbers

4. **Visual Assets**
   - Extract key frames from video screenshots
   - Generate carousel graphics if needed (ai-multimodal)
   - Apply brand styling

5. **Output Structure**
   - Per platform file → `assets/posts/{platform}/{date}-{slug}.md`
   - Combined file → `assets/posts/{date}-{slug}-all-platforms.md`

## Skills Used

- `youtube-handling` - VidCap API for video extraction
- `social-media` - Platform specs, posting best practices
- `copywriting` - Hook writing, CTAs
- `brand-guidelines` - Brand voice consistency
- `assets-organizing` - Standardized output paths

## Agents Used

- `social-media-manager` - Multi-platform content
- `copywriter` - Engaging hooks

## Platform Specifications

### Twitter/X
- Max: 280 characters (threads: 25 tweets)
- Image: 1200x675 (16:9)
- Hook: Open loop, question, contrarian

### LinkedIn
- Max: 3000 characters
- Image: 1200x627 or 1080x1080
- Hook: Professional insight, data point

### Instagram
- Caption: 2200 characters
- Carousel: 10 slides, 1080x1080 or 1080x1350
- Hook: Story, question, bold statement

### TikTok
- Script: 60-90 seconds
- Hook: First 3 seconds critical
- Style: Authentic, conversational

### YouTube Community
- Max: 500 characters
- Engagement: Polls, questions
- CTA: Watch full video

## Output Format

```markdown
# Social Posts: {Video Title}

Source: {youtube_url}

---

## Twitter/X

### Thread
1/ {Hook - curiosity gap}

{Key point}

2/ {Insight}

{Supporting detail}

...

{n}/ Full video: {link}

---

## LinkedIn

{Professional hook with data point}

{3-5 paragraphs of value}

What's your take on {topic}?

#relevant #hashtags

---

## Instagram

{Story-driven hook}

{Value points with emoji bullets}

Save this for later!

.
.
.
#hashtags
```

## Quality Gate (Auto-Triggered)

**After generating content, MUST run:**
1. `/write/audit` → Score content (target: ≥8.0)
2. `/write/publish` → Auto-fix if score <8.0
3. Present final version with score

## Examples

```bash
/youtube:social "https://youtube.com/watch?v=xyz"
/youtube:social "https://youtu.be/abc" twitter,linkedin
/youtube:social "https://youtube.com/watch?v=123" instagram
```
