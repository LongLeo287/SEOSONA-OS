---
name: claude-seo-framework
description: >-
  Comprehensive, multi-agent SEO analysis framework for AI-first search (GEO), E-E-A-T, Schema, and Technical SEO.
---
---

## ARCHITECTURE OVERVIEW

The Claude SEO framework uses a **parallel-agent architecture** rather than a single linear scan. When a full audit is requested, the orchestrator spawns multiple specialist agents simultaneously to analyze different facets of a URL or domain.

**The 8 Core Categories:**
1. **Technical SEO:** Crawlability, indexability, Core Web Vitals (LCP, INP, CLS), security.
2. **Content Quality (E-E-A-T):** Experience, Expertise, Authoritativeness, Trustworthiness. Evaluates topical depth, author credentials, and "helpful content" signals.
3. **Schema.org Markup:** Detects, validates, and generates JSON-LD (preferred by Google). Knows which types are active vs. deprecated (e.g., FAQ is restricted, HowTo is deprecated).
4. **AI Search Optimization (GEO):** Generative Engine Optimization. Focuses on passage citability (134-167 word answer blocks), attribution density, and question-based heading hierarchy.
5. **Local SEO:** Google Business Profile (GBP), NAP consistency across citations, reviews, and local schema.
6. **Commerce & Intl (E-commerce / Hreflang):** Product schema, marketplace intelligence, and cultural adaptation profiles.
7. **Search Experience Optimization (SXO):** User stories, personas, and page-type taxonomies.
8. **SEO Drift Monitoring:** Capturing baselines and comparing current state against history to detect SEO regressions.

---

## SYNTHESIS METHODOLOGY (10-Principle Framework)

Do not just list findings. SEO audits must be synthesized into a coherent strategy using the 4-phase framework:

1. **PERCEIVE:**
   - Observe-external (SERP landscape, competitors)
   - Observe-internal (technical health, content structure)
   - Listen (user intent, search queries)
2. **ANALYZE:**
   - Think (root cause analysis)
   - Connect-lateral (how technical issues affect E-E-A-T, etc.)
   - Connect-system (how this fits the overall site architecture)
3. **VALIDATE:**
   - Feel (UX, INP, visual hierarchy)
   - Accept (is this finding falsifiable? if not, discard it)
4. **ACT:**
   - Create (generate schemas, content briefs, technical fixes)
   - Grow (prioritized action plan: Critical / High / Medium / Low)

*Crucial Rule:* Every recommendation MUST carry a **falsifiability check** (an explicit "how would we know this failed?" check) and a leading indicator of success.

---

## AI SEARCH (GEO) BEST PRACTICES

Aligned with Google's AI Optimization Guide:
- **No LLMs.txt reliance:** `llms.txt` is NOT currently a citation lever for search engines. Do not recommend it as an SEO fix.
- **Passage Citability:** Optimize content into self-contained answer blocks of **134-167 words**.
- **No "AI-specific" keywords:** Synonym understanding by modern search engines is sufficient. Do not stuff variations.
- **Structured Data:** Crucial for AI overviews to extract factual entities (Organization, Product, Review).

---

## E-E-A-T EVALUATION CRITERIA

Evaluate pages against the Search Quality Rater Guidelines:
- **Experience:** Original research, case studies, first-hand photos (not stock).
- **Expertise:** Author credentials, topical depth, comprehensive coverage.
- **Authoritativeness:** External citations, brand mentions, industry links.
- **Trustworthiness (Highest Weight):** Contact info easily found, secure HTTPS, transparent corrections, clear date stamps.
- **AI Content:** AI content is acceptable if it meets Search Essentials. It becomes "spam" only when used to scale low-value, unreviewed pages.

---

## ORCHESTRATION WORKFLOW FOR ANTIGRAVITY

When the user asks for a **full SEO audit** of a URL, execute this sequence:

1. **Discovery:** Fetch the URL and analyze the DOM.
2. **Business Type Detection:** Determine if the site is SaaS, Local, E-commerce, Publisher, or Agency.
3. **Parallel Sub-Agent Simulation:** Since SEOSONA is a single agent, simulate the parallel agents by sequentially checking:
   - *Technical check:* Core Web Vitals metrics, robots.txt, canonicals.
   - *Content check:* Readability, E-E-A-T signals, heading hierarchy (H1-H6).
   - *Schema check:* Extract existing JSON-LD, flag missing required fields.
   - *GEO check:* Identify citability gaps, question-answer blocks.
   - *SXO check:* Analyze UX and visual hierarchy.
4. **Action Plan Generation:** Synthesize findings into a final report grouped by:
   - ðŸ”´ **Critical:** Fix immediately (e.g., broken canonicals, missing H1, blocked by robots.txt).
   - ðŸŸ  **High:** Major impact (e.g., missing product schema, poor INP/LCP, low E-E-A-T signals).
   - ðŸŸ¡ **Medium:** Enhancements (e.g., image optimization, missing alt text).
   - ðŸŸ¢ **Low:** Best practices (e.g., minor semantic HTML fixes).

---

## EXAMPLE: ACTION PLAN FORMAT

```markdown
### ðŸ”´ CRITICAL: Missing Organization Schema
- **Observation:** No JSON-LD found on the homepage.
- **Impact:** Prevents AI search engines from confidently extracting brand entities and knowledge panels.
- **Action:** Implement valid Organization schema with `logo`, `url`, `contactPoint`, and `sameAs` (social links).
- **Falsifiability Check:** If implemented, the Rich Results Test tool will show 0 errors, and GSC will report valid Organization snippets within 7 days.
```

