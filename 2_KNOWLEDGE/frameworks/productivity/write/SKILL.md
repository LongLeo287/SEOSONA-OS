---
name: ckm:write
description: Write creative copy, blog posts, CRO content, and more
argument-hint: "[audit|blog|blog-youtube|cro|enhance|fast|good|publish] [args]"
metadata:
  author: claudekit
  version: "1.0.0"
---

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `audit` | Audit content quality against copywriting, SEO, and platform standards | `references/audit.md` |
| `blog` | 💡💡 Create SEO-optimized blog content | `references/blog.md` |
| `blog-youtube` | 💡💡 Generate SEO-optimized blog article from YouTube video | `references/blog-youtube.md` |
| `cro` | Analyze the current content and optimize for conversion | `references/cro.md` |
| `enhance` | Analyze the current copy issues and enhance it | `references/enhance.md` |
| `fast` | Write creative & smart copy [FAST] | `references/fast.md` |
| `formula` | Generate copy using proven copywriting formulas (AIDA, PAS, BAB, etc.) | `references/formula.md` |
| `good` | Write good creative & smart copy [GOOD] | `references/good.md` |
| `publish` | Audit content, auto-fix issues, output publish-ready version | `references/publish.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments