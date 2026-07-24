---
description: 💡💡 Create SEO-optimized blog content
argument-hint: [topic]
---

Create SEO-optimized blog content with keyword targeting and meta optimization.

<topic>$ARGUMENTS</topic>

## Workflow

1. **SEO Research**
   - Use `seo-specialist` agent for keyword research on topic
   - Activate `seo-optimization` skill
   - Identify:
     - Primary keyword
     - Secondary keywords
     - Related long-tail keywords
     - Search intent

2. **Content Planning**
   - Use `planner` agent for outline structure
   - Activate `content-marketing` skill
   - Generate:
     - SEO-optimized title (H1)
     - Meta description
     - Heading structure (H2-H4)
     - Internal linking opportunities

3. **Content Creation**
   - Use `content-creator` agent for blog content
   - Use `copywriter` agent for engaging intro/conclusion
   - Integrate keywords naturally
   - Add CTA sections

4. **SEO Optimization**
   - Use `seo-specialist` for final review
   - Generate schema markup (Article/BlogPosting)
   - Image alt text suggestions
   - URL slug recommendation

5. **Output**
   - Blog post → `assets/articles/{date}-{slug}/{date}-{slug}.md`
   - Blog images → `assets/articles/{date}-{slug}/images/`
   - SEO metadata in frontmatter

## Agents Used
- `seo-specialist` - Keyword research and optimization
- `content-creator` - Blog content writing
- `copywriter` - Engaging copy
- `planner` - Content structure

## Skills Used
- `seo-optimization` - SEO best practices
- `content-marketing` - Content frameworks
- `creativity` - Visual style suggestions for blog imagery and graphics
- `assets-organizing` - Standardized output paths

## Output
- Blog post → `assets/articles/{date}-{slug}/{date}-{slug}.md`
- Blog images → `assets/articles/{date}-{slug}/images/`

## Output Format
```yaml
---
title: "SEO Optimized Title"
slug: keyword-slug
description: "Meta description under 160 chars"
keywords: [primary, secondary, related]
schema: Article
---
```

## Quality Gate (Auto-Triggered)

**After generating content, MUST run:**
1. `/write/audit` → Score content (target: ≥8.0)
2. `/write/publish` → Auto-fix if score <8.0
3. Present final version with score

## Examples
```
/write/blog "best project management tools for startups"
/write/blog "AI marketing automation guide"
/write/blog "remote team productivity tips"
```
