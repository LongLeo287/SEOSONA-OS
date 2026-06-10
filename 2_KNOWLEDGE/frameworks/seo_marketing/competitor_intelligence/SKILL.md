---
name: ckm:competitor
description: Competitive analysis, alternative pages, vs comparisons, SEO competitor content, market positioning, and battlecard generation.
argument-hint: "[analyze|content|seo|alternatives|list] [url or competitor]"
metadata:
  author: claudekit
  version: "1.1.0"
---

# Competitor

Competitive analysis and competitor comparison content creation.

<args>$ARGUMENTS</args>

## When to Use

- Analyze competitor websites and positioning
- Content gap analysis vs competitors
- SEO comparison with competitors
- Create competitor alternative/vs/comparison pages
- Generate sales battlecards
- Track competitors

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `alternatives` | Create competitor comparison & alternative pages | `references/alternatives.md` |

## Actions

- `analyze [url]` - Analyze competitor website
- `content [url]` - Content gap analysis
- `seo [url]` - SEO comparison
- `alternatives [competitor]` - Create alternative/vs pages
- `list` - List tracked competitors

## Workflow

1. **Parse Arguments** - Extract action and competitor URL/name

2. **Analyze Workflow**
   - Use `WebFetch` to retrieve competitor data
   - Use `researcher` agent for comprehensive analysis (value prop, pricing, audience, channels, strengths/weaknesses)
   - Use `attraction-specialist` for positioning

3. **Content Gap Workflow**
   - Use `seo-specialist` for content audit
   - Compare content topics and formats
   - Identify gaps and opportunities

4. **SEO Comparison Workflow**
   - Use `seo-specialist` agent
   - Activate `seo` skill
   - Compare keyword rankings, backlinks, domain authority, content quality

5. **Alternatives Workflow**
   - Load `references/alternatives.md`
   - Research competitor and your product data
   - Generate comparison pages (4 formats: singular alt, plural alts, vs, A-vs-B)

6. **Output** - Reports → `reports/competitors/{date}-{name}.md`

## Agents Used
- `researcher` - Competitor intelligence
- `attraction-specialist` - Market positioning
- `seo-specialist` - SEO analysis
- `sale-enabler` - Battlecard generation

## Skills Used
- `seo` - SEO comparison
- `content-marketing` - Content analysis
- `copywriting` - Comparison copy
- `assets-organizing` - Standardized output paths

## Output
- Battlecards → `assets/sales/battlecards/{competitor}.md`
- Analysis → `reports/competitors/{date}-{name}.md`
- Alt/Vs pages → organized by format

## Examples
```
/competitor analyze https://competitor.com
/competitor content https://competitor.com
/competitor seo https://competitor.com
/competitor alternatives notion
/competitor list
```

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
