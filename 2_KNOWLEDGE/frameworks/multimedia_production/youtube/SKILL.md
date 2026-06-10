---
name: ckm:youtube
description: Convert YouTube videos to blog posts, infographics, social content. Download video/audio, get captions/transcripts, generate AI summaries, analyze comments via VidCap.xyz API.
argument-hint: "[blog|infographic|social] [youtube-url]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# YouTube

YouTube video content repurposing and VidCap.xyz API integration.

<args>$ARGUMENTS</args>

## When to Use

- Convert YouTube videos to blog posts, infographics, social content
- Download video/audio from YouTube
- Extract captions and transcripts
- Generate AI summaries of video content
- Analyze video comments

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `blog` | Convert YouTube video to SEO-optimized blog post | `references/blog.md` |
| `infographic` | Convert YouTube video to visual infographic | `references/infographic.md` |
| `social` | Convert YouTube video to multi-platform social posts | `references/social.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| VidCap Content API | `references/api-content.md` |
| VidCap Media API | `references/api-media.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/vidcap.py` | VidCap.xyz API client (download, captions, summaries) |
| `scripts/test_vidcap.py` | VidCap API test suite |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
