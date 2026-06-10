# Competitor & Alternative Pages

Create competitor comparison and alternative pages for SEO and sales enablement.

Covers four formats: singular alternative, plural alternatives, you vs competitor, and competitor vs competitor.

<args>$ARGUMENTS</args>

## Initial Assessment

Before creating competitor pages, understand:

1. **Your Product** - Value proposition, differentiators, ICP, pricing, strengths/weaknesses
2. **Competitive Landscape** - Direct/indirect competitors, positioning, search volume
3. **Goals** - SEO traffic capture, sales enablement, conversion, brand positioning

## Core Principles

1. **Honesty Builds Trust** - Acknowledge competitor strengths, be accurate about limitations
2. **Depth Over Surface** - Go beyond feature checklists, explain *why* differences matter
3. **Help Them Decide** - Be clear about who you're best for AND who competitor is best for
4. **Modular Content Architecture** - Centralized competitor data, single source of truth

## Page Formats

### Format 1: [Competitor] Alternative (Singular)

**Search intent**: User actively looking to switch from a specific competitor

**URL pattern**: `/alternatives/[competitor]` or `/[competitor]-alternative`

**Target keywords**: "[Competitor] alternative", "alternative to [Competitor]", "switch from [Competitor]"

**Page structure**:
1. Why people look for alternatives (validate their pain)
2. Summary: You as the alternative (quick positioning)
3. Detailed comparison (features, service, pricing)
4. Who should switch (and who shouldn't)
5. Migration path
6. Social proof from switchers
7. CTA

**Tone**: Empathetic to their frustration, helpful guide

### Format 2: [Competitor] Alternatives (Plural)

**Search intent**: User researching options, earlier in journey

**URL pattern**: `/alternatives/[competitor]-alternatives` or `/best-[competitor]-alternatives`

**Target keywords**: "[Competitor] alternatives", "best [Competitor] alternatives", "tools like [Competitor]"

**Page structure**:
1. Why people look for alternatives (common pain points)
2. What to look for in an alternative (criteria framework)
3. List of alternatives (you first, but include real options)
4. Comparison table (summary)
5. Detailed breakdown of each alternative
6. Recommendation by use case
7. CTA

**Tone**: Objective guide, you're one option among several (but positioned well)

**Important**: Include 4-7 real alternatives. Being genuinely helpful builds trust and ranks better.

### Format 3: You vs [Competitor]

**Search intent**: User directly comparing you to a specific competitor

**URL pattern**: `/vs/[competitor]` or `/compare/[you]-vs-[competitor]`

**Target keywords**: "[You] vs [Competitor]", "[Competitor] vs [You]", "[You] compared to [Competitor]"

**Page structure**:
1. TL;DR summary (key differences in 2-3 sentences)
2. At-a-glance comparison table
3. Detailed comparison by category (Features, Pricing, Support, UX, Integrations)
4. Who [You] is best for
5. Who [Competitor] is best for (be honest)
6. What customers say (testimonials from switchers)
7. Migration support
8. CTA

**Tone**: Confident but fair, acknowledge where competitor excels

### Format 4: [Competitor A] vs [Competitor B]

**Search intent**: User comparing two competitors (not you directly)

**URL pattern**: `/compare/[competitor-a]-vs-[competitor-b]`

**Target keywords**: "[A] vs [B]", "[A] or [B]", "[A] compared to [B]"

**Page structure**:
1. Overview of both products
2. Comparison by category
3. Who each is best for
4. The third option (introduce yourself)
5. Comparison table (all three)
6. CTA

**Tone**: Objective analyst, earn trust through fairness, then introduce yourself

## Index Pages

Each format needs an index page listing all pages of that type.

### Alternatives Index (`/alternatives`)
Lists all "[Competitor] Alternative" pages with competitor name, key differentiator, link.

### Alternatives (Plural) Index (`/best-alternatives`)
Lists all roundup pages with competitor name, number of alternatives covered.

### Vs Comparisons Index (`/vs` or `/compare`)
Lists all "You vs [Competitor]" and "[A] vs [B]" pages.

### Index Page Best Practices
- Keep updated when adding new comparison pages
- Cross-link between related comparisons
- Include last updated date, quick filters if many comparisons
- Sort by popularity, alphabetically, or by category

## Content Architecture

### Centralized Competitor Data

Create single source of truth per competitor in `competitor_data/`:

```yaml
name: Notion
website: notion.so
tagline: "The all-in-one workspace"
founded: 2016

# Positioning
primary_use_case: "docs + light databases"
target_audience: "teams wanting flexible workspace"

# Pricing
pricing_model: per-seat
free_tier: true
starter_price: $8/user/month

# Features (rate 1-5)
features:
  documents: 5
  databases: 4
  project_management: 3

# Strengths, Weaknesses, Best for, Not ideal for
strengths: [...]
weaknesses: [...]
best_for: [...]
not_ideal_for: [...]

# Common complaints (from reviews)
common_complaints: [...]

# Migration notes
migration_from:
  difficulty: medium
  data_export: "Markdown, CSV, HTML"
```

### Page Generation

Each page pulls from centralized data:
- **Alternative page**: competitor data + your data
- **Alternatives page**: competitor data + your data + other alternatives
- **Vs page**: your data + competitor data
- **[A] vs [B] page**: both competitor data + your data

## Section Templates

### TL;DR Summary
```
**TL;DR**: [Competitor] excels at [strength] but struggles with [weakness].
[Your product] is built for [your focus], offering [key differentiator].
Choose [Competitor] if [their ideal use case]. Choose [You] if [your ideal use case].
```

### Comparison Tables - Beyond Checkmarks

Instead of ✓/✗, use descriptive content:
| Feature | You | Competitor |
|---------|-----|-----------|
| Feature A | Full support with [detail] | Basic support, [limitation] |

Organize by category: Core functionality, Collaboration, Integrations, Security, Support.

### Key Sections to Include
- **Feature Comparison** - Paragraph + table per category with "Bottom line" verdict
- **Pricing Comparison** - Include hidden costs, value comparison for 10-person team
- **Service & Support** - Docs quality, response time, onboarding, CSM availability
- **Who It's For** - Honest assessment of ideal customer for each product
- **Migration** - What transfers, what needs reconfiguration, support offered
- **Social Proof** - Quotes from switchers, results after switching

## Research Process

For each competitor, gather:
1. **Product research** - Free trial, features, UX, limitations, screenshots
2. **Pricing research** - Current pricing, tiers, hidden costs, contracts
3. **Review mining** - G2, Capterra, TrustRadius themes
4. **Customer feedback** - Switcher quotes, lost deal insights
5. **Content research** - Their positioning, their comparison pages, changelog

### Maintenance Schedule
- **Quarterly**: Verify pricing, check major feature changes
- **When notified**: Customer mentions competitor change
- **Annually**: Full refresh of all competitor data

## SEO Considerations

### Keyword Targeting

| Format | Primary | Secondary |
|--------|---------|-----------|
| Alternative | [Competitor] alternative | switch from [Competitor] |
| Alternatives | [Competitor] alternatives | tools like [Competitor] |
| You vs Competitor | [You] vs [Competitor] | [You] compared to [Competitor] |
| A vs B | [A] vs [B] | [A] or [B] |

### Internal Linking & Schema
- Cross-link between related competitor pages
- Link from feature pages to relevant comparisons
- Use FAQ schema for common questions

## Output

- Competitor data → `competitor_data/{name}.yaml`
- Pages → organized by format with URL, meta tags, full copy, comparison tables, CTAs

## Questions to Ask

1. Who are your top 3-5 competitors?
2. What's your core differentiator?
3. What are common reasons people switch to you?
4. Do you have customer quotes about switching?
5. What's your pricing vs. competitors?
6. Do you offer migration support?

## Related Skills
- `seo` - For optimizing competitor pages
- `copywriting` - For writing compelling comparison copy
