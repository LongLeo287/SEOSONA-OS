---
description: 💡💡 Technical SEO audit
argument-hint: [url]
---

Perform a comprehensive technical SEO audit.

<url>$ARGUMENTS</url>

Activate `seo-optimization` skill.

## Workflow

1. **Fetch Page Data**
   - Use `WebFetch` tool to retrieve page content
   - If local file, use `Read` tool

2. **ReviewWeb API Analysis** (if `$REVIEWWEB_API_KEY` available)
   - Reference: `.claude/skills/seo-optimization/references/reviewweb-api.md`
   - **Backlink Analysis**: `POST /seo-insights/backlinks` with domain
   - **Traffic Insights**: `POST /seo-insights/traffic` for traffic history, top pages, keywords
   - **Page Review**: `POST /review` then `GET /review/{reviewId}` for detailed analysis
   - **Visual Audit**: `POST /screenshot` for desktop/mobile rendering check

3. **Technical Analysis**
   - Use `seo-specialist` agent for audit
   - Activate `seo-optimization` skill
   - Check all SEO elements:
     - Title tag (length, keywords)
     - Meta description
     - Heading structure (H1-H6)
     - URL structure
     - Internal/external links
     - Image alt tags
     - Schema markup
     - Mobile responsiveness
     - Page speed indicators

4. **Generate Report**
   - Merge WebFetch + ReviewWeb API findings
   - Score each element
   - Prioritize issues (critical/high/medium/low)
   - Provide specific recommendations
   - Output to `reports/seo/`

## Agents Used
- `seo-specialist` - Technical SEO expertise

## Skills Used
- `seo-optimization` - Audit frameworks + ReviewWeb API reference
- `assets-organizing` - Standardized output paths

## API Reference
- ReviewWeb API: `.claude/skills/seo-optimization/references/reviewweb-api.md`
- Required env: `$REVIEWWEB_API_KEY` (optional but recommended)

## Output
- Path: `assets/seo/audits/{date}-{domain}-audit.md`

### Output Requirements
- Overall score (0-100) with letter grade
- Executive summary (2-3 sentences)
- Each element scored with status emoji: ✅ Pass | ⚠️ Warning | ❌ Fail
- Issues grouped by priority (Critical → High → Medium → Low)
- Actionable recommendations with effort estimates (Quick Win / Medium / Major)
- Include ReviewWeb API data if available (backlinks, traffic, keywords)

### Output Template
```markdown
# SEO Audit: {domain}
**Date:** {date} | **Score:** {score}/100 ({grade})

## Executive Summary
{2-3 sentence overview of site health and top priorities}

## Quick Stats
| Metric | Value | Status |
|--------|-------|--------|
| Backlinks | {count} | {emoji} |
| Monthly Traffic | {estimate} | {emoji} |
| Top Keywords | {count} ranking | {emoji} |

## Technical SEO Checklist
| Element | Status | Details |
|---------|--------|---------|
| Title Tag | {emoji} | {length}/60 chars, {keyword status} |
| Meta Description | {emoji} | {length}/160 chars |
| H1 Tag | {emoji} | {count} found |
| Heading Hierarchy | {emoji} | {structure} |
| URL Structure | {emoji} | {notes} |
| Image Alt Tags | {emoji} | {x}/{total} optimized |
| Schema Markup | {emoji} | {types found or missing} |
| Mobile Friendly | {emoji} | {notes} |
| Page Speed | {emoji} | {indicators} |
| Internal Links | {emoji} | {count} |
| External Links | {emoji} | {count} |

## Issues by Priority

### 🔴 Critical
{list or "None found"}

### 🟠 High
{list or "None found"}

### 🟡 Medium
{list or "None found"}

### 🟢 Low
{list or "None found"}

## Recommendations
| # | Action | Priority | Effort | Impact |
|---|--------|----------|--------|--------|
| 1 | {recommendation} | {priority} | {effort} | {impact} |

## Data Sources
- WebFetch analysis: {yes/no}
- ReviewWeb API: {yes/no, endpoints used}
```

## Examples
```
/seo/audit https://example.com
/seo/audit https://example.com/pricing
```
