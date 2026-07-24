# WORKFLOW: SEOSONA Grand Audit (Holistic Agency Website Audit)

**Purpose:** To perform a comprehensive, 360-degree audit of a target domain by combining automated Python data extraction with deep Agentic analysis (SEO, CRO, Psychology, Funnel, UI/UX, and Brand Alignment).
**Trigger:** `/grand-audit`, "phân tích website", "kiểm toán toàn diện", "audit website sâu", "đánh giá website".

## OVERVIEW

This workflow elevates a standard technical SEO audit into a **Digital Agency Strategy**. It relies on 3 distinct phases. The AI Orchestrator must ensure all 3 phases are completed before presenting the final deliverable.

---

## PHASE 1: DATA HARVESTING (Automated Extraction)
*Objective: Gather raw technical, traffic, and SERP data.*

**Action:** 
- The AI instructs the user to run the Python script OR triggers it via MCP:
  `python 1_CORE/scripts/run_full_audit.py --domain <target_domain> --clean`
- The Orchestrator waits for the script to finish and reads the output files from `3_MEMORY/seo_exports/<domain>/`.

**Data Points Collected:**
- Google Search Console (Queries, Clicks, Positions)
- Google Analytics 4 (Traffic, Drop-off, Conversion)
- Technical Scan (Web Vitals, Schema, Robots.txt)
- Playwright E2E Rendering Scan (JS DOM capture, CTA clickability)
- Competitor SERP & Backlinks
- Content Gap CSV

---

## PHASE 2: DEEP ANALYSIS (Agentic Inspection)
*Objective: Interpret the raw data using SEOSONA's Super-Kit Intelligence Layer.*

The Orchestrator must invoke the following specialized skills/personas to cross-examine the website:

### 1. Funnel & Analytics Diagnosis
- **Skill:** `frameworks/productivity/analyze/` & `frameworks/seo_marketing/funnel/`
- **Action:** Analyze GA4 drop-off rates. Map the website's pages to TOFU (Top of Funnel), MOFU, and BOFU stages. Identify where users are abandoning the site.

### 2. CRO & UI/UX Audit
- **Skill:** `frameworks/seo_marketing/cro/`
- **Action:** Evaluate the Landing Page structure. Check CTA placement, form field friction, mobile responsiveness, and trust signals (testimonials, badges).

### 3. Marketing Psychology Check
- **Skill:** `frameworks/seo_marketing/marketing_psychology/`
- **Action:** Scan the website's copy (text). Does it utilize *Loss Aversion*? Is there *Social Proof*? Does it follow the *First Principles* of persuasion? 

### 4. Brand & Persona Alignment
- **Skill:** `frameworks/seo_marketing/brand_identity/` & `frameworks/seo_marketing/persona/`
- **Action:** Compare the website's messaging against the ideal customer profile (ICP). Is the Tone of Voice consistent? 

### 5. SEO & Content Strategy
- **Skill:** `frameworks/seo_marketing/seo/` & `frameworks/seo_marketing/content_marketing/`
- **Action:** Review the Content Gap CSV. Identify low-hanging fruits (Quick Wins) and long-tail keyword opportunities.

### 6. E2E Automated QA (UX/CRO Friction)
- **Skill:** `frameworks/testing_automation/playwright/`
- **Action:** Simulate user interactions on the Homepage and top 3 Landing Pages. Identify any JS rendering blockers or non-clickable conversion elements.

### 7. OSINT Entity & E-E-A-T Validation
- **Skill:** `frameworks/osint/osint-graph-investigation/` & `frameworks/seo_marketing/brand/`
- **Action:** Scan the deep web for Author footprints, Brand mentions, and backlink network IPs to validate off-page Trust signals. Flag any fake entities or toxic PBNs.

---

## PHASE 3: THE MASTER PLAN (Deliverable Generation)
*Objective: Synthesize findings into a high-value, actionable Executive Report.*

The final output MUST NOT be a generic list of technical errors. It must be structured as an **Agency Consultation Report** containing:

1. **Executive Summary:** The 3 biggest bottlenecks currently killing their conversions/traffic.
2. **Quick Wins (Fix Now):** 5 technical or copy changes they can make today to see immediate ROI.
3. **Funnel & CRO Redesign:** Specific recommendations on redesigning the landing page layout or adjusting the CTA (highlighting Playwright UX Rendering Blockers).
4. **90-Day Content & Growth Plan:** A prioritized list of Topic Clusters and Marketing Ideas (using `marketing-ideas` skill) to dominate the niche.
5. **E-E-A-T & Entity Trust Score:** OSINT findings on brand authority and author credibility.

## SUCCESS CRITERIA
- The final report must sound like it was written by a Senior Strategy Director.
- It must explicitly reference the psychological and CRO frameworks used in Phase 2.
- It must be strictly customized to the target domain's actual data.
