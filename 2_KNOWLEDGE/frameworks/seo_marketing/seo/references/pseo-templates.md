# Programmatic SEO (pSEO) Templates

## What is pSEO?
Creating many similar pages from template + data to capture long-tail searches.

## Common pSEO Patterns

### 1. Location Pages
**Template:** `[Service] in [City]`
**Example:** "Plumber in Austin", "Dentist in Miami"
**Data:** City list + service descriptions

### 2. Integration Pages
**Template:** `[Product] + [Integration] Integration`
**Example:** "Slack + Asana Integration"
**Data:** Integration pairs + features

### 3. Comparison Pages
**Template:** `[Product A] vs [Product B]`
**Example:** "Notion vs Coda"
**Data:** Product pairs + comparison points

### 4. Glossary/Definition
**Template:** `What is [Term]?`
**Example:** "What is API?"
**Data:** Term list + definitions

### 5. Statistics Pages
**Template:** `[Topic] Statistics [Year]`
**Example:** "Remote Work Statistics 2025"
**Data:** Statistics + sources

## Template Structure

```html
<!-- Title: {primary_keyword} - {brand} -->
<h1>{primary_keyword}</h1>

<p class="intro">{intro_paragraph}</p>

<h2>Key Points</h2>
{dynamic_content}

<h2>FAQ</h2>
{faq_schema}

<h2>Related</h2>
{internal_links}
```

## Data Requirements
- CSV/JSON with variables
- Unique intro per page (avoid duplicate)
- Internal link mappings
- Schema data

## Quality Checklist
- [ ] Each page has unique value
- [ ] No thin content (<300 words)
- [ ] Proper internal linking
- [ ] Schema markup included
- [ ] Canonical set correctly
- [ ] No keyword stuffing

## Output: pSEO Spec

```markdown
## pSEO Template: [Type]

### Pattern
[URL pattern]: /[variable1]/[variable2]

### Data Schema
| Field | Type | Example |
|-------|------|---------|

### Content Sections
1. [Section] - {variable}

### Internal Linking
[Strategy]

### Volume Estimate
[Number] pages × [avg monthly searches] = [total opportunity]
```
