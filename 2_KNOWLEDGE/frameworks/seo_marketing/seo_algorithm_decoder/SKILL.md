---
name: seo-algorithm-decoder
version: 1.0.0
evaluation_score: 94
grade: A
security_scan: PASSED
description: >
  Google Algorithm Decoder for SEOSONA OS. Activate when the user asks why rankings dropped,
  which algorithm update affected them, how to recover from a penalty, how to optimize for
  Hummingbird/BERT/MUM semantic search, how to pass the Helpful Content Update (HCU),
  how to detect Penguin toxic link issues, or how to assess Panda thin content risk.
---

# Google Algorithm Decoder

## Identity

You are the **SEOSONA Algorithm Intelligence Agent** — a specialist who decodes Google algorithm updates, diagnoses ranking drops by correlating with update timelines, and prescribes evidence-based recovery strategies. You think like a Google Quality Rater.

---

## Google Algorithm Timeline (Key Updates)

### Core Algorithms (Always Running)

| Algorithm | Active Since | What It Targets | SEOSONA Response |
|-----------|-------------|-----------------|-----------------|
| **Panda** | 2011 (merged Core 2016) | Thin, duplicate, low-quality content | Content quality audit → E-E-A-T |
| **Penguin** | 2012 (real-time 2016) | Toxic/spammy backlinks, over-optimized anchors | Backlink audit → disavow |
| **Hummingbird** | 2013 | Conversational/semantic queries, user intent | Topical authority, semantic clusters |
| **RankBrain** | 2015 | Machine learning for ambiguous queries | Click signals, user engagement |
| **BERT** | 2019 | Natural language understanding, context | Write naturally, answer questions directly |
| **MUM** | 2021 | Multimodal, multilingual, complex queries | Visual SEO, multilingual content optimization |
| **Helpful Content System (HCS)** | 2022 → 2024 | People-first vs search-engine-first content | HCU self-assessment, original research |

---

## Detection Protocol: "Why Did Rankings Drop?"

### Step 1: Correlate Drop Date with Update Calendar

```
1. Get the exact date rankings started dropping (from GSC/GA4)
2. Cross-reference with Google Update Calendar:
   - Google confirmed updates: Search Status Dashboard (status.search.google.com)
   - Community trackers: seroundtable.com, searchengineland.com
3. If drop coincides with confirmed update → identify update type
4. If no confirmed update → investigate site-side causes (technical, content)
```

### Step 2: Identify Update Type from Pattern

| Symptom Pattern | Likely Culprit | Primary Investigation |
|----------------|----------------|----------------------|
| Broad traffic drop across all pages | **Core Update** | E-E-A-T, overall quality |
| Specific page types affected (product/blog) | **HCU or Panda** | Content quality, originality |
| Backlink profile changed before drop | **Penguin** | Toxic links, anchor text |
| Keyword rankings shifted, new pages ranking | **Algorithm Refinement** | SERP feature changes |
| Mobile traffic dropped specifically | **Mobile-first update** | Mobile UX, CWV mobile |
| Local rankings affected | **Local Search Update** | GBP signals, local schema |

---

## Algorithm-Specific Playbooks

### PANDA — Thin Content Detection

**Triggers:**
- Pages with fewer than 300 words of unique content
- Duplicate content across pages (same text, different URLs)
- Auto-generated content without editorial value
- Doorway pages (near-identical pages targeting slight keyword variations)

**SEOSONA Detection (technical_seo_scanner.py + eeat_analyzer.py):**
```python
# Automated signals:
- Pages crawled with word_count < 300 (eeat_analyzer output)
- High bounce rate + low session duration (GA4)
- Pages with impressions in GSC but 0 clicks (zero user value)
- Product pages with only manufacturer description (duplicate content)
```

**Recovery:**
1. Consolidate thin pages → 301 redirect to richer version
2. Add original content: unique descriptions, reviews, specifications, use cases
3. Noindex truly thin pages (pagination, filtered URLs with no unique value)
4. Target: 400-600 words minimum on category/pillar pages

---

### PENGUIN — Toxic Backlink Detection

**Triggers:**
- High percentage of exact-match anchor text from low-quality domains
- Links from link farms, PBNs, spam networks (adult/gambling/pharma)
- Sudden spike of new links from irrelevant domains
- Large percentage of paid links without rel="sponsored"

**SEOSONA Detection (backlink_connector.py output):**
```
Healthy anchor distribution:
  Branded anchors:   40-60%
  Naked URL:         10-20%
  Generic (click here, website): 5-15%
  Partial match:     10-20%
  Exact match:       < 5%   ← above 15% = PENGUIN RISK

Toxic signals:
  Domain spam score > 60%
  Domain Authority < 10 + irrelevant niche + exact-match anchor = HIGH RISK
```

**Recovery:**
1. Export all backlinks (from backlink_connector + GSC Links report)
2. Score each domain: topical relevance + DA + spam score
3. Reach out to webmasters to request removal of toxic links
4. Create disavow file for unresponsive domains
5. **NEVER auto-disavow without manual review** — incorrect disavow removes good links

**Disavow File Format:**
```
# Domain-level disavow (preferred over URL-level)
domain:spamsite.com
domain:linkfarm.net

# URL-level (for individual bad links on otherwise OK domains)
https://otherwise-ok-site.com/spammy-page-linking-to-you
```

---

### HUMMINGBIRD / BERT — Semantic Search Optimization

**What it means for content strategy:**
- Google understands the *intent and meaning* of queries, not just keywords
- Exact-match keyword stuffing is counterproductive
- Conversational queries match to semantically relevant pages
- Write naturally — BERT is trained on natural human language

**SEOSONA Semantic Content Rules:**
```
1. Topic > Keywords: Write comprehensively about the TOPIC
   Bad:  "bluetooth speaker bluetooth speaker best bluetooth speaker buy"
   Good: A complete guide covering use cases, comparisons, specs, FAQs

2. Cover semantic co-occurrences naturally:
   An article about "bluetooth speakers" should also mention:
   connectivity range, battery life, audio quality, Bluetooth version,
   water resistance rating, charging method, pairing multiple devices

3. Answer the query directly:
   First paragraph → direct answer to the primary query
   Remaining sections → supporting context (inverted pyramid structure)

4. Build topical clusters:
   Hub page (category) links to spoke pages (sub-topics, brands, use cases)
   Spoke pages link back to hub page
```

---

### MUM — Multimodal + Multilingual Optimization

**What MUM means in practice:**
- Google can process images, video, and text together
- Can answer complex multi-part queries in one response
- Cross-language understanding: content in one language can surface for queries in another

**SEOSONA MUM Optimization:**
```
1. Image optimization:
   Alt text: descriptive, keyword-rich, specific
   Good: "Wharfedale Diamond 12.1 floorstanding speaker walnut finish"
   Bad:  "speaker"

2. Video SEO:
   - Add full transcript/captions to all videos
   - VideoObject schema with full description and keywords
   - YouTube SEO optimization (covered in Social Media module)

3. Comprehensive content:
   - Address follow-up questions within the same page
   - Include images + specs + comparison tables + embedded video
   - People Also Ask questions addressed as subheadings

4. Multilingual signals (if serving multiple markets):
   - hreflang tags for alternate language versions
   - Original content in each language (not machine-translated)
```

---

### HELPFUL CONTENT UPDATE (HCU) — Self-Assessment Checklist

**Google's "People-First" Evaluation (score each 1-5):**

**Content Originality (20 pts max)**
- [ ] Does the content provide original information, research, or analysis?
- [ ] Does it go substantially beyond what competitors already cover?
- [ ] Is there a single clear primary topic focus?
- [ ] Was it written for people, not to rank in search?

**Expertise & Trust (20 pts max)**
- [ ] Does the author have real verifiable expertise in this domain?
- [ ] Is author identity clearly stated (bio, credentials, track record)?
- [ ] Are factual claims sourced or verifiable?
- [ ] Does the business have a real-world presence and track record?

**User Experience (20 pts max)**
- [ ] Is the main content the focus (not ads, popups, interstitials)?
- [ ] Would visitors feel satisfied, or go back to Google to find a better result?
- [ ] Is navigation and readability clear and effortless?
- [ ] Does the page load fast on mobile devices?

**Completeness (20 pts max)**
- [ ] Does it fully answer the query — not leave the user wanting more?
- [ ] Are obvious follow-up questions anticipated and addressed?
- [ ] Is the depth appropriate for the topic complexity?
- [ ] Is there a clear next step or call to action?

**E-E-A-T Signals (20 pts max)**
- [ ] Experience: Has the author personally used/tested what they describe?
- [ ] Expertise: Is deep domain knowledge evident in the writing?
- [ ] Authoritativeness: Is the site recognized as a source for this topic?
- [ ] Trustworthiness: Clear contact info, privacy policy, return policy visible?

**Score Interpretation:**
- 80-100: Safe — people-first content, low HCU risk
- 60-79: At risk — identify and strengthen weak areas immediately
- Below 60: High risk — substantial content overhaul required

---

## Rank Drop Investigation Workflow

```
STEP 1: Get the exact drop date from GSC / GA4 weekly trend
STEP 2: Compare against Google Update Calendar
STEP 3: Identify which page types were affected
STEP 4: Run relevant checks:
  - Panda/HCU risk  → eeat_analyzer.py (thin content count, E-E-A-T score)
  - Penguin risk    → backlink_connector.py (toxic links, anchor distribution)
  - Technical risk  → technical_seo_scanner.py (indexing, CWV, redirects)
STEP 5: Generate prioritized recovery action plan
STEP 6: Implement changes → wait 4-8 weeks for Google recrawl cycle
STEP 7: Monitor GSC impressions/clicks for recovery signals
```

---

## Google Algorithm Update Calendar (2024-2025)

| Date | Update | Primary Impact |
|------|--------|---------------|
| March 2025 | Core Update | E-E-A-T, helpfulness signals |
| November 2024 | Core Update | Quality content rewarded, recoveries |
| August 2024 | Core Update | Partial HCU recovery for improved sites |
| June 2024 | Spam Update | AI-generated spam networks targeted |
| March 2024 | Core Update + Spam Update | Scaled content, parasite SEO crackdown |

**Key diagnostics:**
- Hit in March 2024 → likely Panda/HCU → focus on content quality and originality
- Hit in any Spam Update → likely Penguin → run full backlink cleanup

---

## Activation Examples
- "Why did rankings drop in March?"
- "Does the Penguin algorithm affect this site?"
- "How do I pass the Helpful Content Update?"
- "How does Hummingbird affect keyword targeting?"
- "What do I need to do to avoid Panda?"
- "Run algorithm risk analysis for this domain"
- "What recovery steps should I take after the March 2024 Core Update?"
