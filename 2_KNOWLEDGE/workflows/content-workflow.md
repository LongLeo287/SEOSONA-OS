# Content Workflow

5-stage content production pipeline from draft to published.

## Overview

| Field | Value |
|-------|-------|
| **Purpose** | Manage content lifecycle with quality gates |
| **Agents** | content-creator, content-reviewer, seo-specialist |
| **Human Checkpoints** | Final approval before publish |

---

## Content States

```
[DRAFT] → [REVIEW] → [EDIT] → [AUDIT] → [APPROVED] → [PUBLISHED]
```

Each piece of content moves through these states sequentially.

**IMPORTANT:** Claude MUST automatically run `/write/audit` after any content generation command (`/youtube:*`, `/write:*`) and apply `/write/publish` fixes before presenting final output.

---

## Workflow Stages

### Stage 1: Draft

**Agent:** `content-creator`

**Actions:**
1. Create initial content
2. Apply SEO foundation
3. Include target keywords
4. Structure for readability

**Output:** Draft in `content/drafts/`

**Requirements:**
- Content brief provided
- Target keywords identified
- Audience defined

**Prompt Template:**
```
Create [content-type] draft.
Topic: [topic]
Keywords: [primary], [secondary]
Audience: [audience]
Word count: [target]
Save to: content/drafts/[slug].md
```

---

### Stage 2: Review

**Agent:** `content-reviewer`

**Actions:**
1. Brand voice compliance
2. Factual accuracy check
3. Grammar and style
4. SEO validation
5. Conversion elements

**Output:** Review report with issues

**Prompt Template:**
```
Review content at [path].
Check:
- Brand voice alignment
- Factual accuracy
- Grammar/spelling
- SEO optimization
- CTA effectiveness
Report issues and recommendations.
```

---

### Stage 3: Edit

**Agent:** `content-creator` (with review feedback)

**Actions:**
1. Address review feedback
2. Refine messaging
3. Optimize for SEO
4. Polish copy

**Output:** Revised draft

**Prompt Template:**
```
Edit content at [path].
Address feedback:
[feedback-items]
Maintain: brand voice, SEO keywords
Save revised version.
```

---

### Stage 4: Audit

**Command:** `/write/audit` → `/write/publish`

**Actions:**
1. Score content (Copywriting, SEO, Platform, Brand)
2. Identify issues automatically
3. Apply fixes (hooks, hashtags, CTAs, readability)
4. Verify score ≥8.0

**Output:** Polished content ready for approval

**Auto-Triggered By:**
- `/youtube:social`, `/youtube:blog`, `/youtube:infographic`
- `/write:blog`, `/write:cro`
- Any content generation command

**Prompt Template:**
```
Run /write/audit on [path].
If score <8.0, run /write/publish to auto-fix.
Present final version with before/after scores.
```

---

### Stage 5: Approved

**Agent:** `content-reviewer` (final pass)

**Human Checkpoint:** Final approval required

**Actions:**
1. Verify audit score ≥8.0
2. Final quality check
3. Schedule publication
4. Prepare assets

**Output:** Approved content ready for publish

**Requires:** `approval-workflow` hook

**Prompt Template:**
```
Final review of [path].
Verify audit score ≥8.0.
Confirm ready for publication.
If approved, schedule for [date/time].
```

---

### Stage 6: Published

**Agent:** `social-media-manager`, `email-wizard`

**Actions:**
1. Publish to platform
2. Distribute across channels
3. Enable tracking
4. Monitor initial performance

**Output:** Live content with tracking

**Prompt Template:**
```
Publish approved content at [path].
Channels: [channels]
Tracking: [campaign-id]
Monitor for [duration].
```

---

## Content Types

### Blog Post
- Length: 1000-2500 words
- SEO: Primary + 3-5 secondary keywords
- Structure: Intro, H2 sections, conclusion, CTA

### Landing Page
- Length: 500-1500 words
- Focus: Single conversion goal
- Elements: Headline, benefits, social proof, CTA

### Email
- Length: 150-400 words
- Focus: Single message/action
- Elements: Subject, preview, body, CTA

### Social Post
- Length: Platform-specific
- Focus: Engagement or click
- Elements: Hook, value, CTA

### Ad Copy
- Length: Platform limits
- Focus: Click-through
- Elements: Headline, description, CTA

---

## Quality Checklist

### Brand Compliance
- [ ] Voice and tone match guidelines
- [ ] Visual style aligned
- [ ] Messaging on-brand

### SEO Requirements
- [ ] Primary keyword in title
- [ ] Keywords in H2s
- [ ] Meta description optimized
- [ ] Internal links included
- [ ] Alt text for images

### Conversion Elements
- [ ] Clear value proposition
- [ ] Compelling CTA
- [ ] Social proof (if applicable)
- [ ] Urgency elements (if appropriate)

### Technical
- [ ] Mobile-friendly
- [ ] Links working
- [ ] Images optimized
- [ ] Load time acceptable

---

## Integration Points

### Hooks Triggered
- `brand-guidelines-reminder` → Before Draft
- `approval-workflow` → Before Approved → Published

### Data Flow
- Brief → Draft
- Review → Edit feedback
- Approval → Distribution
- Published → Analytics

---

## Usage Example

```
User: "Create social posts from this YouTube video"

# Claude auto-triggers workflow:
1. /youtube:social → Generate multi-platform posts
2. /write/audit → Score content (auto-triggered)
3. /write/publish → Fix issues if score <8.0 (auto-triggered)
4. Present polished content with score
5. Human approval → Publish
```

**User doesn't need to know commands.** Claude picks the right ones based on intent.

---

## Success Metrics

- Time to publish (draft → live)
- Review cycles (iterations needed)
- Quality score (review pass rate)
- Performance (engagement, conversions)
