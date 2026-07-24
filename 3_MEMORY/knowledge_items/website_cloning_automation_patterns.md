# KI: Website Cloning Automation Patterns

_Source: UAP Wave 3 analysis of `JCodesMore/ai-website-cloner-template`_

## Pipeline Architecture
```
Target URL → Crawl → Extract HTML/CSS/Assets → AI Analysis → Component Decomposition → Template Generation → Output
```

## Key Stages
1. **Crawl**: Full-page screenshot + HTML extraction (Puppeteer/Playwright)
2. **AI Analysis**: Vision model analyzes layout, color scheme, typography, component hierarchy
3. **Component Decomposition**: Break page into reusable components (header, hero, features, footer, etc.)
4. **Template Generation**: Generate clean HTML/CSS/React components from decomposed structure
5. **Asset Extraction**: Download and organize images, fonts, icons

## SEOSONA OS Applications
1. **Competitor Website Analysis**: Clone competitor's UI to study their conversion patterns and CRO strategies.
2. **Client Website Audit**: Create a pixel-perfect reference of client's current site before making changes.
3. **Landing Page Generation**: Clone successful landing page templates and adapt for client's brand.
4. **Design Reference**: Extract design patterns from award-winning websites for UI/UX inspiration.

## Integration Points
- Works with existing `competitor_website_analyzer.md` skill (Wave 3)
- Complements `ui-ux-designer` agent capabilities
- Can feed into `seo-to-code-autonomous-pipeline` workflow
- Leverages `browser_automation/` framework (Puppeteer/Playwright)

## Limitations
- Cannot clone dynamic/JS-heavy SPA content without rendering
- Copyrighted assets should not be used — only structure and patterns
- Rate limiting and robots.txt must be respected
