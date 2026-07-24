# Keyword Research Workflow (ReviewWeb.site API)

## Prerequisites
Set `REVIEWWEB_API_KEY` in `.env` (copy from `.env.example`)

## Workflow A: Seed Keyword Research

```bash
# Get keyword ideas + difficulty for a topic
node scripts/analyze-keywords.cjs -k "your topic" -c us -o report.md
```

**Output includes:** keyword ideas, search volume, difficulty, CPC, intent, priority

## Workflow B: Competitor Analysis

```bash
# Analyze competitor's traffic, keywords, backlinks
node scripts/analyze-keywords.cjs -d "competitor.com" -o competitor.md
```

**Output includes:** organic traffic, top pages, top keywords, backlink profile

## Workflow C: Batch Analysis

```bash
# Analyze multiple keywords from JSON file
echo '["keyword1", "keyword2"]' > keywords.json
node scripts/analyze-keywords.cjs -f keywords.json --format json -o results.json
```

## Priority Classification

| Priority | Criteria | Action |
|----------|----------|--------|
| 1 (Quick Win) | Vol >500, Diff <40 | Target immediately |
| 2 (Medium) | Vol >100, Diff <50 | Short-term target |
| 3 (Long-term) | Diff <70 | Build authority first |
| 4 (Skip) | Diff >70 | Too competitive |

## Intent → Content Type

| Intent | Signals | Content |
|--------|---------|---------|
| Informational | how, what, guide | Blog/Guide |
| Commercial | best, review, vs | Comparison |
| Transactional | buy, price | Landing/Product |
| Navigational | brand terms | Homepage |

## Output Format

Script generates markdown report with:
- Summary (total keywords, quick wins count)
- Quick wins table (high priority keywords)
- Full keyword table (sorted by priority)
- For domains: traffic overview, top pages, backlinks

## API Endpoints Used

- `/seo-insights/keyword-ideas` - expand seed keywords
- `/seo-insights/keyword-difficulty` - volume, difficulty, CPC
- `/seo-insights/traffic` - domain traffic analysis
- `/seo-insights/backlinks` - backlink profile
