---
description: 💡💡 Social media content generation
argument-hint: [platform] [type]
---

Generate social media content for various platforms.

<args>$ARGUMENTS</args>

## Platforms
- `twitter` / `x` - Twitter/X posts and threads
- `linkedin` - LinkedIn posts and articles
- `instagram` - Instagram posts and reels
- `tiktok` - TikTok video scripts
- `youtube` - YouTube shorts and community posts

## Content Types
- `post` - Single post
- `thread` - Multi-post thread
- `carousel` - Carousel slides
- `story` - Story content
- `reel` - Short-form video script

## Workflow

1. **Parse Arguments**
   - Extract platform from `$ARGUMENTS`
   - Extract content type
   - If missing, prompt via `AskUserQuestion`

2. **Content Strategy**
   - Use `social-media-manager` agent for platform best practices
   - Activate `social-media` skill
   - Determine optimal format, length, hashtags

3. **Content Creation**
   - Use `content-creator` agent for copy
   - Use `copywriter` agent for hooks and CTAs
   - If visual needed, use `ai-multimodal` skill

4. **Optimization**
   - Platform-specific formatting
   - Hashtag research
   - Posting time recommendations
   - Output to `content/social/`

## Agents Used
- `social-media-manager` - Platform strategy
- `content-creator` - Content generation
- `copywriter` - Engaging copy

## Skills Used
- `social-media` - Platform best practices
- `creativity` - Platform-specific styles, visual trends, color psychology
- `assets-organizing` - Standardized output paths

## MCP Integrations
- Discord - Community posting
- Slack - Team sharing

## Output
- Social posts → `assets/posts/{platform}/{date}-{slug}.md`

## Examples
```
/social twitter thread
/social linkedin post
/social instagram carousel
/social tiktok reel
```
