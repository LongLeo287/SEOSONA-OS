---
description: Audit content quality against copywriting, SEO, and platform standards
argument-hint: <file-path>
---

Audit content quality and provide actionable scores.

<file_path>$ARGUMENTS</file_path>

## Scoring Dimensions (0-10 each)

### 1. Copywriting (40%)
- **Hook/Headline**: First line stops scroll? 4U formula (Useful, Unique, Urgent, Ultra-specific)?
- **Structure**: Clear hierarchy? AIDA/PAS flow?
- **CTA**: Clear action? First-person ("Get MY...")?
- **Specificity**: Numbers, data, concrete claims vs vague?
- **Readability**: Grade 6 level? Short sentences? Active voice?

### 2. SEO (30%) - for articles/blogs only
- **Keywords**: Primary keyword in title, H1, first 100 words?
- **Structure**: H2/H3 hierarchy? Internal links?
- **Meta**: Title <60 chars? Description <160 chars?
- **Length**: 1500+ words for comprehensive topics?

### 3. Platform Compliance (20%)
| Platform | Char Limit | Hashtags | Media |
|----------|------------|----------|-------|
| Twitter/X | 280 | 1-2 | Required |
| LinkedIn | 3000 | 3-5 | Optional |
| Instagram | 2200 | 20-30 | Required |
| TikTok | 2200 | 3-5 | Required |

### 4. Brand Voice (10%)
- Tone consistency with brand guidelines?
- Terminology alignment?

## Workflow

1. **Read File**
   - Load content from `<file_path>`
   - Detect content type (social, article, infographic, email)

2. **Apply Relevant Criteria**
   - Social posts → Copywriting + Platform
   - Articles → Copywriting + SEO
   - Emails → Copywriting + CTA focus
   - Infographics → Visual hierarchy + Data accuracy

3. **Score Each Dimension**
   - 0-3: Poor (needs rewrite)
   - 4-6: Acceptable (needs improvement)
   - 7-8: Good (minor tweaks)
   - 9-10: Excellent (ready to publish)

4. **Generate Report**

## Output Format

```markdown
# Content Audit: {filename}

**Overall Score: X/10** | **Status: [Publish Ready / Needs Work / Rewrite]**

## Scores

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Copywriting | X/10 | 40% | X.X |
| SEO | X/10 | 30% | X.X |
| Platform | X/10 | 20% | X.X |
| Brand Voice | X/10 | 10% | X.X |
| **Total** | | | **X.X/10** |

## Findings

### ✅ Strengths
- ...

### ⚠️ Issues
- ...

### 🔧 Recommendations
1. ...
2. ...
3. ...
```

## Skills Used
- `copywriting` - formulas, headline templates
- `seo-optimization` - keyword, structure checks
- `social-media` - platform specs
- `brand-guidelines` - voice consistency

## Examples
```
/write/audit assets/posts/251225-never-gonna-give-you-up-all-platforms.md
/write/audit assets/articles/251225-rickroll-phenomenon.md
```
