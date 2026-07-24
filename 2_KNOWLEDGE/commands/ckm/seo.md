---
description: 💡💡 SEO audit and optimization
argument-hint: [action] [target]
---

SEO audit and optimization for websites and content.

<args>$ARGUMENTS</args>

## Actions
- `audit [url]` - Technical SEO audit
- `keywords [topic]` - Keyword research
- `optimize [content]` - Content optimization
- `schema [page]` - Generate JSON+LD schema

## Workflow

1. **Parse Arguments**
   - Extract action (audit/keywords/optimize/schema)
   - Extract target (url/topic/content/page)

2. **Audit Workflow** (for `audit`)
   - Use `seo-specialist` agent for technical analysis
   - Activate `seo-optimization` skill
   - Check: meta tags, structure, performance, mobile
   - Generate audit report

3. **Keywords Workflow** (for `keywords`)
   - Use `attraction-specialist` agent for keyword research
   - Analyze search intent and volume
   - Identify opportunities and gaps
   - Output keyword strategy

4. **Optimize Workflow** (for `optimize`)
   - Use `seo-specialist` agent for content analysis
   - Check keyword density, structure, readability
   - Generate optimization recommendations
   - Apply changes if confirmed

5. **Schema Workflow** (for `schema`)
   - Analyze page content type
   - Generate appropriate JSON+LD schema
   - Validate schema structure
   - Output ready-to-use markup

## Agents Used
- `seo-specialist` - SEO audit and optimization
- `attraction-specialist` - Keyword research

## Skills Used
- `seo-optimization` - SEO frameworks and templates
- `assets-organizing` - Standardized output paths

## MCP Integrations
- Search Console - Rankings and impressions

## Output
- Audit reports → `assets/seo/audits/{date}-{domain}-audit.md`
- Keyword reports → `assets/seo/keywords/{date}-{topic}-keywords.md`
- Schema files → `assets/seo/schemas/{page}-schema.json`

## Examples
```
/seo:audit https://example.com
/seo:keywords "project management software"
/seo:optimize https://example.com/blog/post-title
/seo:schema
```
