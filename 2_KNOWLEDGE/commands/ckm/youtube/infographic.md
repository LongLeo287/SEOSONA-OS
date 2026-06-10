---
description: Convert YouTube video to visual infographic
argument-hint: <youtube-url> [style]
---

# YouTube to Infographic

Transform YouTube video content into data visualization infographic.

<youtube_url>$ARGUMENTS</youtube_url>

## Workflow

1. **Extract Video Data**
   - Activate `youtube-handling` skill
   - Run VidCap API:
     ```bash
     python .claude/skills/youtube-handling/scripts/vidcap.py info "<url>"
     python .claude/skills/youtube-handling/scripts/vidcap.py summary "<url>" --screenshot
     python .claude/skills/youtube-handling/scripts/vidcap.py caption "<url>" --ext vtt
     ```
   - Extract: title, duration, key points, statistics, quotes

2. **Analyze Content Structure**
   - Identify infographic type based on content:
     | Content Type | Chart Recommendation |
     |--------------|---------------------|
     | Steps/process | Timeline, Funnel |
     | Comparisons | Bar Chart, Comparison Table |
     | Statistics | KPI Cards, Icon Array |
     | Breakdown | Pie/Donut, Treemap |
     | Flow/journey | Sankey, Funnel |
     | Rankings | Horizontal Bar |
   - Activate `design-system` skill for chart selection

3. **Design Infographic**
   - Activate `ui-ux-pro-max` skill for visual style
   - Inject brand context:
     ```bash
     node .claude/skills/brand-guidelines/scripts/inject-brand-context.cjs --json
     ```
   - Get embeddable design tokens (MANDATORY for standalone HTML):
     ```bash
     node .claude/skills/design-system/scripts/embed-tokens.cjs --minimal
     ```
   - Structure:
     - Header: Video title + thumbnail
     - Body: 3-5 key data visualizations
     - Footer: Source attribution + CTA

4. **Generate Visuals**
   - Activate `ai-multimodal` skill
   - Generate supporting images with Imagen 4 if needed
   - Use brand colors from design tokens

5. **Output**
   - HTML infographic → `assets/infographic/{date}-{slug}.html`
   - PNG export → `assets/infographic/{date}-{slug}.png`
   - Source data → `assets/infographic/{date}-{slug}.json`

## Skills Used

- `youtube-handling` - VidCap API for video extraction
- `design-system` - Chart type selection (slide-charts.csv)
- `ui-ux-pro-max` - Visual design intelligence
- `ai-multimodal` - Image generation with Imagen 4
- `brand-guidelines` - Brand context injection
- `assets-organizing` - Standardized output paths

## Agents Used

- `content-creator` - Content synthesis
- `ui-ux-designer` - Visual layout

## Infographic Styles

| Style | Description | Best For |
|-------|-------------|----------|
| data | Statistics-heavy, chart-focused | Research, reports |
| timeline | Chronological flow | How-to, processes |
| comparison | Side-by-side analysis | Reviews, versus |
| listicle | Numbered key points | Tips, summaries |
| story | Narrative visual flow | Case studies |

## Design Token Requirements (MANDATORY)

All infographics MUST use design tokens from `assets/design-tokens.css`:

| Element | Token Usage |
|---------|-------------|
| Background | `var(--color-background)`, `var(--primitive-gradient-dark)` |
| Primary color | `var(--color-primary)` |
| Secondary color | `var(--color-secondary)` |
| Accent color | `var(--color-accent)` |
| Text | `var(--color-foreground)`, `var(--color-foreground-secondary)` |
| Cards | `var(--color-surface)`, `var(--card-radius)`, `var(--card-padding)` |
| Font heading | `var(--typography-font-heading)` |
| Font body | `var(--typography-font-body)` |
| Spacing | `var(--primitive-spacing-*)` |
| Font sizes | `var(--primitive-fontSize-*)` |
| Gradients | `var(--primitive-gradient-primary)`, `var(--primitive-gradient-accent)` |

**NEVER hardcode colors like `#e94560` or `#ff6b6b`** - always use CSS variables.

## Output Format

**IMPORTANT:** Embed tokens inline for file:// compatibility. Run:
```bash
node .claude/skills/design-system/scripts/embed-tokens.cjs --minimal
```

```html
<!DOCTYPE html>
<html>
<head>
  <title>{Video Title} - Infographic</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* Design Tokens - EMBED OUTPUT FROM embed-tokens.cjs */
    :root {
      /* Paste output from: node .claude/skills/design-system/scripts/embed-tokens.cjs --minimal */
    }
  </style>
  <style>
    body {
      font-family: var(--typography-font-body);
      background: var(--color-background);
      color: var(--color-foreground);
    }
    h1, h2, h3 {
      font-family: var(--typography-font-heading);
    }
    /* All styles MUST use var(--token-name) */
  </style>
</head>
<body>
  <header><!-- Video title, thumbnail --></header>
  <main><!-- Data visualizations --></main>
  <footer><!-- Source: YouTube link --></footer>
</body>
</html>
```

## Quality Gate (Auto-Triggered)

**After generating content, MUST run:**
1. `/write/audit` → Score content (target: ≥8.0)
2. `/write/publish` → Auto-fix if score <8.0
3. Present final version with score

## Examples

```bash
/youtube:infographic "https://youtube.com/watch?v=xyz"
/youtube:infographic "https://youtu.be/abc" timeline
/youtube:infographic "https://youtube.com/watch?v=123" data
```
