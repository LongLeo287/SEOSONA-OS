# SOP: Scoring Rubric — Thang điểm chuẩn SEO

> Dùng để chấm điểm từng hạng mục trong 5 Pillars. Mỗi hạng mục 0-100 điểm.

---

## PILLAR 1 — Technical Foundation

### 1.1 Core Web Vitals (LCP / INP / CLS)
| Score | LCP | INP | CLS |
|-------|-----|-----|-----|
| 90-100 | < 1.8s | < 100ms | < 0.05 |
| 70-89 | 1.8-2.5s | 100-200ms | 0.05-0.1 |
| 50-69 | 2.5-4s | 200-500ms | 0.1-0.25 |
| < 50 | > 4s | > 500ms | > 0.25 |

### 1.2 Crawlability
| Score | Condition |
|-------|-----------|
| 100 | robots.txt accessible, no critical blocks, crawl depth ≤ 3 for key pages |
| 70-89 | Minor crawl blocks on non-critical pages |
| 40-69 | Some key pages blocked or crawl depth > 5 |
| < 40 | Key pages blocked, noindex on important content |

### 1.3 Indexation Rate
| Score | % Pages Indexed |
|-------|----------------|
| 90-100 | > 90% of submitted sitemap pages indexed |
| 70-89 | 75-90% indexed |
| 50-69 | 50-75% indexed |
| < 50 | < 50% indexed |

### 1.4 HTTPS / Security
| Score | Condition |
|-------|-----------|
| 100 | HTTPS, valid cert, HSTS, no mixed content |
| 70 | HTTPS, minor mixed content warnings |
| 40 | HTTP on some pages |
| 0 | Full HTTP site |

### 1.5 Mobile Usability
| Score | PSI Mobile Score |
|-------|----------------|
| 90-100 | 90+ |
| 70-89 | 70-89 |
| 50-69 | 50-69 |
| < 50 | < 50 |

### 1.6 Structured Data
| Score | Condition |
|-------|-----------|
| 90-100 | Schema present, no errors, matches content type, rich result eligible |
| 70-89 | Schema present, minor warnings |
| 40-69 | Limited schema, wrong types |
| < 40 | No schema |

### 1.7 Internal Linking
| Score | Condition |
|-------|-----------|
| 90-100 | No orphan pages, link depth ≤ 3, descriptive anchor text |
| 70-89 | < 5% orphan pages |
| 40-69 | 5-20% orphan pages, shallow internal links |
| < 40 | > 20% orphan pages, no logical link structure |

---

## PILLAR 2 — Content Intelligence

### 2.1 E-E-A-T Score
| Score | Condition |
|-------|-----------|
| 90-100 | Named authors with credentials, original research/data, external citations, clear About/Contact |
| 70-89 | Named authors, some credentials, clear expertise |
| 50-69 | Anonymous content, some expertise signals |
| < 50 | Anonymous, thin, no expertise signals |

### 2.2 Content Depth vs Competitors
| Score | Condition |
|-------|-----------|
| 90-100 | Top pages ≥ 120% of competitor avg word count AND covers all sub-topics |
| 70-89 | 90-120% of competitor avg, covers most sub-topics |
| 50-69 | 70-90% of competitor avg, missing some topics |
| < 50 | < 70% of competitor avg or significant topic gaps |

### 2.3 Content Freshness
| Score | % Pages Updated Last 90 Days |
|-------|------------------------------|
| 90-100 | > 50% |
| 70-89 | 30-50% |
| 50-69 | 15-30% |
| < 50 | < 15% |

### 2.4 AEO / GEO Readiness
| Score | Condition |
|-------|-----------|
| 90-100 | Clear definitions, quotable stats, FAQ schema, direct answers to questions, high citability |
| 70-89 | Good structure, some direct answers |
| 50-69 | Content present but not optimized for AI extraction |
| < 50 | No GEO signals |

### 2.5 Thin Content
| Score | % Pages > 300 words |
|-------|---------------------|
| 100 | 95%+ |
| 70-89 | 80-95% |
| 50-69 | 60-80% |
| < 50 | < 60% |

---

## PILLAR 3 — Authority & Trust

### 3.1 Domain Rank / Domain Authority
| Score | DR (Ahrefs) / DA (Moz) |
|-------|----------------------|
| 90-100 | DR/DA > 70 |
| 70-89 | DR/DA 50-70 |
| 50-69 | DR/DA 30-50 |
| 30-49 | DR/DA 15-30 |
| < 30 | DR/DA < 15 |

### 3.2 Referring Domain Quality
| Score | Condition |
|-------|-----------|
| 90-100 | > 500 unique RDs, avg DR > 40, topically relevant |
| 70-89 | 100-500 RDs, avg DR 25-40 |
| 50-69 | 20-100 RDs, mixed quality |
| < 50 | < 20 RDs or majority low-quality |

### 3.3 Toxic Link Ratio
| Score | % Toxic Links |
|-------|--------------|
| 100 | < 2% |
| 70-89 | 2-10% |
| 40-69 | 10-25% |
| < 40 | > 25% |

### 3.4 Anchor Text Health
| Score | Condition |
|-------|-----------|
| 90-100 | 40-60% branded, < 5% exact-match, varied |
| 70-89 | 30-40% branded, 5-10% exact-match |
| 40-69 | < 30% branded OR 10-20% exact-match |
| < 40 | Over-optimized (> 20% exact-match) or mostly generic |

---

## PILLAR 4 — Visibility & Rankings

### 4.1 Keyword Portfolio (Top 10)
| Score | # Keywords Ranking Top 10 |
|-------|--------------------------|
| 90-100 | > 500 |
| 70-89 | 100-500 |
| 50-69 | 20-100 |
| < 50 | < 20 |

### 4.2 Average CTR
| Score | Avg CTR (GSC) |
|-------|--------------|
| 90-100 | > 10% |
| 70-89 | 5-10% |
| 50-69 | 2-5% |
| < 50 | < 2% |

### 4.3 SERP Feature Ownership
| Score | Condition |
|-------|-----------|
| 90-100 | Owns featured snippets, PAA, or sitelinks for main keywords |
| 70-89 | Owns some SERP features |
| 50-69 | Minimal SERP features |
| < 50 | No SERP features |

### 4.4 AI Overview Presence
| Score | Condition |
|-------|-----------|
| 90-100 | Regularly cited in AI Overviews for target keywords |
| 70-89 | Occasionally cited |
| 50-69 | Rarely cited but content is AI-ready |
| < 50 | Not cited, content not GEO-optimized |

---

## PILLAR 5 — Competitive Position

### 5.1 SERP Keyword Overlap
| Score | % Overlap with Top 3 Competitors |
|-------|----------------------------------|
| 90-100 | > 60% overlap (same battleground, competing well) |
| 70-89 | 40-60% overlap |
| 50-69 | 20-40% overlap |
| < 50 | < 20% overlap (not in same competitive space) |

### 5.2 Keyword Gap
| Score | Condition |
|-------|-----------|
| 90-100 | < 20% of competitor keywords not covered |
| 70-89 | 20-40% gap |
| 50-69 | 40-60% gap |
| < 50 | > 60% gap |

---

## Composite Scoring Formula

```
P1 = avg(CWV, Crawlability, Indexation, HTTPS, Mobile, Schema, InternalLinking)
P2 = avg(EEAT, ContentDepth, Freshness, AEO, ThinContent)
P3 = avg(DomainRank, ReferringDomains, ToxicRatio, AnchorHealth)
P4 = avg(KeywordPortfolio, AvgCTR, SERPFeatures, AIOverview)
P5 = avg(SERPOverlap, KeywordGap)

TOTAL = (P1 × 0.25) + (P2 × 0.25) + (P3 × 0.20) + (P4 × 0.20) + (P5 × 0.10)
```
