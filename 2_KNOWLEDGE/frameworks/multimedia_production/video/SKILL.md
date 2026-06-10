---
name: ckm:video
description: Video marketing strategy, script writing, storyboards, production workflows, video specs for YouTube/TikTok/Instagram/LinkedIn, thumbnail creation, Veo 3.1 generation, optimization, and repurposing.
argument-hint: "[create|script-create|storyboard-create] [topic]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Video

Video production, scripts, storyboards, and AI video generation.

<args>$ARGUMENTS</args>

## When to Use

- Video script writing with creative direction
- Storyboard creation for video content
- AI video generation with Veo 3.1
- Video optimization for platforms
- Thumbnail design
- Video SEO optimization

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `create` | Create a video using Veo 3.1 | `references/create.md` |
| `script-create` | Create production-ready video script | `references/script-create.md` |
| `storyboard-create` | Create storyboard for video content | `references/storyboard-create.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Production Workflow | `references/production-workflow.md` |
| Video Types & Specs | `references/video-types-specs.md` |
| Script Templates | `references/script-templates.md` |
| Storyboard Format | `references/storyboard-format.md` |
| Thumbnail Design | `references/thumbnail-design-guide.md` |
| Art Directions | `references/video-art-directions.md` |
| Audio Directives | `references/audio-directive-guide.md` |
| Veo Prompt Guide | `references/veo-prompt-guide.md` |
| Video Optimization | `references/video-optimization.md` |
| Video SEO | `references/video-seo-optimization.md` |
| Quality Review | `references/quality-review-workflow.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/generate-video.cjs` | AI video generation |
| `scripts/create-storyboard.cjs` | Storyboard generation |
| `scripts/analyze-video.cjs` | Video analysis |
| `scripts/extract-captions.cjs` | Caption extraction |
| `scripts/optimize-for-platform.cjs` | Platform optimization |

## Templates

| Template | Purpose |
|----------|---------|
| `templates/explainer.json` | Explainer video template |
| `templates/product-demo.json` | Product demo template |
| `templates/short-form.json` | Short-form video template |
| `templates/testimonial.json` | Testimonial video template |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
