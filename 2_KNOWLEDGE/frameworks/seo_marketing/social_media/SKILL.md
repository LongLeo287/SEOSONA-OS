---
name: ckm:social
description: Social media content creation, scheduling, API integrations for X/Twitter, Facebook, Threads, LinkedIn, YouTube, TikTok, Instagram. Platform-specific workflows, engagement templates, hook writing.
argument-hint: "[platform] [type] OR [schedule]"
metadata:
  author: claudekit
  version: "2.0.0"
---

# Social

Social media content creation, scheduling, and platform management.

<args>$ARGUMENTS</args>

## When to Use

- Social media post creation (any platform)
- Content scheduling and calendar management
- Platform-specific content optimization
- Thread/carousel/reel creation
- Engagement strategy and hook writing

## Platforms

`twitter`/`x`, `linkedin`, `instagram`, `tiktok`, `youtube`, `facebook`, `threads`

## Content Types

`post`, `thread`, `carousel`, `story`, `reel`

## Workflow

1. Parse platform + content type from `$ARGUMENTS`
2. Use `social-media-manager` agent for platform best practices
3. Use `content-creator` + `copywriter` agents for copy
4. Platform-specific formatting + hashtag research
5. Output to `assets/posts/{platform}/{date}-{slug}.md`

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `schedule` | Schedule social media posts | `references/schedule.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Platform Specs | `references/platform-specs.md` |
| Hook Writing | `references/hook-writing.md` |
| Engagement Templates | `references/engagement-templates.md` |
| Thread Templates | `references/thread-templates.md` |
| Posting Best Practices | `references/posting-best-practices.md` |
| Rate Limits & Errors | `references/rate-limits-errors.md` |
| Unified API Services | `references/unified-api-services.md` |
| X/Twitter Workflow | `references/x-twitter-workflow.md` |
| LinkedIn Workflow | `references/linkedin-workflow.md` |
| Facebook Workflow | `references/facebook-workflow.md` |
| Threads Workflow | `references/threads-workflow.md` |
| TikTok Workflow | `references/tiktok-workflow.md` |
| YouTube Workflow | `references/youtube-workflow.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/schedule-post.js` | Schedule posts via API |
| `scripts/validate-post-content.js` | Validate post content against platform rules |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
