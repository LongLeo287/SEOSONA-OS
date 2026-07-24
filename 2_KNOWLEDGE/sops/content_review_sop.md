# SOP: Content Review & Approval

_Version 1.0 | Created: 2026-06-17_

## Purpose
Quality control process for reviewing all content (blog posts, landing pages, social media, email) before publication.

## Review Pipeline

### Stage 1: Factual Accuracy (content-reviewer agent)
- [ ] All claims are verifiable with cited sources.
- [ ] Statistics and data points are current (not older than 2 years unless historical context).
- [ ] No fabricated quotes, testimonials, or case studies.
- [ ] Industry terminology used correctly.

### Stage 2: SEO Compliance (seo-content-master agent)
- [ ] Target keyword naturally appears in: title, H1, first 100 words, meta description.
- [ ] Secondary keywords distributed throughout without stuffing.
- [ ] Internal links to relevant pillar/cluster pages (minimum 3).
- [ ] External links to authoritative sources (minimum 1).
- [ ] Meta title ≤ 60 characters, meta description ≤ 160 characters.
- [ ] Alt text on all images with keyword relevance.

### Stage 3: Brand Voice & Tone (copywriter agent)
- [ ] Content matches SEOSONA brand voice (professional, helpful, authoritative).
- [ ] No AI-telltale phrases (run `ai_content_humanizer` if needed).
- [ ] Consistent formatting (heading hierarchy, bullet point style).
- [ ] Call-to-Action is clear and compelling.

### Stage 4: Technical Quality
- [ ] No spelling or grammar errors.
- [ ] All links functional (no 404s).
- [ ] Images load correctly and are appropriately sized.
- [ ] Mobile rendering verified.

### Stage 5: Final Approval
- [ ] Content lead signs off.
- [ ] For client content: client approval obtained.
- [ ] Publication scheduled with correct date/time.

## Rejection Criteria
Content is REJECTED and returned for revision if:
- Any factual inaccuracy is found (Stage 1 fail).
- Keyword density < 0.5% or > 2.5% (over-optimization).
- Brand voice violations detected.
