---
description: 💡💡 Programmatic SEO template generation
argument-hint: [template-type]
---

Generate programmatic SEO templates for scalable content.

<template_type>$ARGUMENTS</template_type>

## Template Types
- `location` - Location-based pages (e.g., "best {service} in {city}")
- `comparison` - Comparison pages (e.g., "{product} vs {competitor}")
- `review` - Review pages (e.g., "{product} review")
- `howto` - How-to guides (e.g., "how to {action} with {tool}")
- `list` - List posts (e.g., "top 10 {category} tools")

## Workflow

1. **Template Selection**
   - Parse template type from `$ARGUMENTS`
   - If not specified, ask user via `AskUserQuestion`

2. **Data Structure Design**
   - Use `seo-specialist` agent for template architecture
   - Define data source schema (CSV, JSON, API)
   - Identify variable placeholders

3. **Template Creation**
   - Use `content-creator` agent for content blocks
   - Activate `content-marketing` skill
   - Generate:
     - Page template with variables
     - Meta tag templates
     - Schema markup template
     - Internal linking strategy

4. **SEO Optimization**
   - Apply `seo-optimization` skill
   - Keyword insertion points
   - Unique content ratios
   - Prevent duplicate content

5. **Sample Generation**
   - Generate 3 sample pages
   - Validate SEO compliance
   - Output to `assets/attraction/pseo-templates/`

## Agents Used
- `seo-specialist` - pSEO architecture
- `content-creator` - Content templates

## Skills Used
- `seo-optimization` - SEO best practices
- `content-marketing` - Content strategy
- `assets-organizing` - Standardized output paths

## Output
- Templates → `assets/attraction/pseo-templates/{template-name}.md`
- Data schema → `assets/attraction/pseo-templates/{template-name}-schema.json`
- Samples → `assets/attraction/pseo-templates/{template-name}-samples/`

## Examples
```
/seo/pseo location
/seo/pseo comparison
/seo/pseo "best {tool} for {usecase}"
```
