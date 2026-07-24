# SOP: Claude SEO & AEO Audit (V4)

**Skill Reference:** `2_KNOWLEDGE/frameworks/seo_marketing/claude_seo_framework/` & `seo_aeo_best_practices`
**Trigger:** User asks to "Audit SEO", "Check website" or run the V4 Audit.
**Sub-Persona:** `[Claude SEO & AEO Analyst]`

## 1. PRE-FLIGHT CHECK
- Identify the Business Type (SaaS, E-commerce, Local, Publisher).
- Wait for the V4 `run_full_audit.py` to generate the CSV exports in `3_MEMORY/seo_exports/`.

## 2. DUAL ANALYSIS: SEO + AEO (Optimization for Search Engines & AI)
*You must evaluate both aspects in parallel for every website:*

- `[ ]` **1. Technical SEO & Schema:** (For Googlebot) Page Speed (PSI), redirects, and especially core Schema (Product, Article, FAQ). Are they valid?
- `[ ]` **2. AEO (Answer Engine Optimization):** (For ChatGPT/Perplexity)
    - **Direct Answers:** Does the page have direct answer paragraphs (40-60 words) immediately following H2/H3 question headings?
    - **Information Gain:** Does the article provide *original data* (original research, case studies) or is it just rewritten content? AI Search heavily favors citing sources with exclusive data.
    - **List Formatting:** Does it utilize `<ul>`, `<ol>`, and `<table>` structures so AI can easily parse the content?
- `[ ]` **3. E-E-A-T & Entity Density:** (For both)
    - Is the author clearly identified? Is there a Person/Organization Schema?
    - Is the density of topical Entities sufficiently deep?
- `[ ]` **4. Marketing Psychology / SXO:** Does the user journey on the page stimulate conversions?

## 3. SYNTHESIS & REPORTING (4-Level Scale)
Output the Action Plan using this tiered structure:
- 🔴 **Critical:** Broken technicals, LCP > 4s, missing H1, missing core Schema.
- 🟠 **High:** Thin content, lacking AEO structure (no Direct Answers), low E-E-A-T (unclear author).
- 🟡 **Medium:** Micro-optimizations for images (WebP), secondary keyword density.
- 🟢 **Low:** Minor HTML tweaks.

## 4. FALSIFIABILITY CHECK
For EVERY recommendation in the report, you MUST append a `Falsifiability Check`.
*Example:* "Falsifiability Check: Upgrading the direct answer paragraph under the H2 to exactly 50 words will increase the chance of appearing in Google AI Overviews within the next 14 days."
