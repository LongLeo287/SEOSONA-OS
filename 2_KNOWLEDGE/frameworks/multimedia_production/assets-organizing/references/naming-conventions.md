# Naming Conventions

## Slug Generation

### Rules
- Convert title/topic to lowercase
- Replace spaces with hyphens
- Remove special characters
- Keep numbers
- Max 50 characters (truncate at word boundary)
- No leading/trailing hyphens

### Examples
| Title | Slug |
|-------|------|
| "10 Marketing Tips for 2024" | `10-marketing-tips-for-2024` |
| "How to Use Claude Code?" | `how-to-use-claude-code` |
| "AI & Automation: A Guide" | `ai-automation-a-guide` |

## Date Formats

### Env Var
Use `$CK_PLAN_DATE_FORMAT` if set, otherwise default to `YYMMDD-HHmm`.

### Patterns
| Format | Example | Use Case |
|--------|---------|----------|
| `YYMMDD` | `251222` | Date-only assets |
| `YYMMDD-HHmm` | `251222-2230` | Time-sensitive assets |
| No date | `{slug}` | Evergreen assets |

### Date-Sensitive Assets
- Social posts
- Campaign assets
- Time-bound promotions
- Generated images

### Evergreen Assets
- Articles
- Videos
- Logos
- Writing styles

## File Extensions

| Type | Extensions |
|------|------------|
| Images | `.png`, `.jpg`, `.webp`, `.svg` |
| Videos | `.mp4`, `.mov`, `.webm` |
| Documents | `.md`, `.json`, `.txt` |
| Audio | `.mp3`, `.wav`, `.m4a` |

## Variant Naming

### Size Variants
`{name}-{width}x{height}.{ext}` or `{name}-{size}.{ext}`
- `hero-1920x1080.png`
- `banner-large.png`
- `thumbnail-small.jpg`

### Platform Variants
`{name}-{platform}.{ext}`
- `cover-youtube.png`
- `cover-instagram.png`
- `ad-linkedin.png`

### Version Variants
`{name}-v{N}.{ext}` or `{name}-{variant}.{ext}`
- `logo-v2.svg`
- `banner-dark.png`
- `hero-alt.jpg`

## Scene Naming (Video/Storyboards)

Pattern: `scene-{NN}-{position}.{ext}`
- `scene-01-start.png`
- `scene-01-end.png`
- `scene-02-start.png`

## Campaign Asset Naming

Pattern: `{campaign}-{type}-{variant}.{ext}`
- `black-friday-banner-hero.png`
- `product-launch-ad-v1.jpg`
- `holiday-sale-email-header.png`
