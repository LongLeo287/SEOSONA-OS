---
description: Audit content, auto-fix issues, output publish-ready version
argument-hint: <file-path>
---

Quality gate before publishing. Audit → Fix → Output.

<file_path>$ARGUMENTS</file_path>

## Workflow

1. **Read Content**
   - Load file from `<file_path>`
   - Detect type: social | article | email | infographic

2. **Run Audit** (use `/write/audit` criteria)
   - Score each dimension (Copywriting, SEO, Platform, Brand)
   - Identify issues

3. **Auto-Fix Issues**

   | Issue Type | Fix Action |
   |------------|------------|
   | Weak hook | Rewrite using hook formulas from `social-media/references/hook-writing.md` |
   | Missing hashtags | Add platform-appropriate hashtags |
   | Too long | Trim to platform limits |
   | Weak CTA | Apply CTA patterns from `copywriting/references/cta-patterns.md` |
   | Low readability | Simplify to Grade 6 level |
   | Missing @mentions | Suggest relevant accounts |

4. **Output**
   - Save fixed version → same path (overwrite) or `{path}-published.md`
   - Show before/after diff for major changes
   - Final score must be ≥8.0 to pass

## Pass Criteria

| Score | Status | Action |
|-------|--------|--------|
| ≥9.0 | Publish Ready | No changes needed |
| 8.0-8.9 | Good | Minor fixes applied |
| 6.0-7.9 | Needs Work | Major fixes applied |
| <6.0 | Rewrite | Flag for manual review |

## Skills Used

- `copywriting` - Hook formulas, CTA patterns
- `social-media` - Platform specs, hashtag strategy
- `seo-optimization` - Keyword optimization
- `brand-guidelines` - Voice consistency

## Output Format

```markdown
# Publish Review: {filename}

**Before:** X.X/10 → **After:** X.X/10

## Changes Made
1. ✅ [Platform] Hook strengthened: "..." → "..."
2. ✅ [Platform] Added X hashtags
3. ✅ [Platform] CTA improved

## Final Version
[Full polished content here]

---
**Status:** Ready to Publish ✅
```

## Examples
```
/write/publish assets/posts/251225-rickroll-all-platforms.md
/write/publish assets/articles/251225-seo-guide.md
```
