# Asset Type Details

## Articles

**Purpose:** Long-form blog content with supporting images.

**Path:** `assets/articles/{date}-{slug}/`

**Structure:**
- `{slug}.md` - Main article content
- `images/{date}-{slug}/` - Article images

**Produced By:**
- `/content/blog` command
- `content-creator` agent

**Required Files:**
- Main markdown file
- At least one hero image

**Naming:**
- Slug from article title
- No date prefix (evergreen)

---

## Storyboards

**Purpose:** Video planning with START/END frame pairs.

**Path:** `assets/storyboards/{date}-{slug}/`

**Structure:**
- `storyboard.md` - Human-readable format
- `storyboard.json` - Machine-readable data
- `scene-{NN}-start.png` - Scene start frames
- `scene-{NN}-end.png` - Scene end frames

**Produced By:**
- `/video:storyboard:create` command

**Required Files:**
- Both `.md` and `.json` versions
- Paired start/end frames for each scene

**Naming:**
- Scene numbers: 2-digit padded (01, 02, 03)
- Slug from video title/topic

---

## Videos

**Purpose:** Final video outputs and scene clips.

**Path:** `assets/videos/{date}-{slug}/`

**Structure:**
- `master.mp4` - Final assembled video
- `scene-{NN}.mp4` - Individual scene clips
- `concat.txt` - FFmpeg concat list
- `captions.srt` - Subtitles (optional)
- `analysis-*.md` - Quality reports

**Produced By:**
- `/video:create` command

**Required Files:**
- `master.mp4` (minimum)

**Naming:**
- Scene numbers: 2-digit padded
- Slug from video title/topic

---

## Transcripts

**Purpose:** Text transcriptions of video/audio content.

**Path:** `assets/transcripts/`

**Structure:**
- `{slug}.md` - Transcript with timestamps

**Produced By:**
- `ai-multimodal` skill (audio analysis)
- Manual transcription

**Format:**
```markdown
# Transcript: {Title}

**Source:** {video/audio file}
**Duration:** {length}

## Transcript

[00:00] Speaker: Content...
[00:15] Speaker: More content...
```

**Naming:**
- Slug from source title
- No date prefix (tied to source)

---

## Writing Styles

**Purpose:** Writing style guides for content consistency.

**Path:** `assets/writing-styles/`

**Structure:**
- `{slug}.md` - Style guide document

**Produced By:**
- Manual creation
- `content-creator` agent style extraction

**Required Sections:**
- Voice & Tone
- Vocabulary preferences
- Sentence structure
- Example passages

**Naming:**
- Descriptive slug (e.g., `technical`, `casual`, `default`)

---

## Banners

**Purpose:** Campaign and promotional banners.

**Path:** `assets/banners/{campaign}/`

**Structure:**
- `{type}-{size}.{ext}` - Banner variants

**Common Sizes:**
- Hero: 1920x1080, 1600x900
- Sidebar: 300x600, 160x600
- Leaderboard: 728x90
- Mobile: 320x50, 640x100

**Produced By:**
- `ui-ux-designer` agent
- `/design` commands

**Naming:**
- Campaign folder name
- Size in filename

---

## Designs

**Purpose:** UI/UX designs, mockups, components.

**Path:** `assets/designs/{project}/`

**Structure:**
- `mockup-{variant}.{ext}` - Full mockups
- `components/` - Individual components
- `exports/` - Final exports

**Produced By:**
- `ui-ux-designer` agent
- `/design` commands

**Naming:**
- Project folder name
- Descriptive variant names

---

## Infographics

**Purpose:** Data visualizations, charts, diagrams.

**Path:** `assets/infographics/`

**Structure:**
- `{date}-{slug}.{ext}` - Dated infographics

**Produced By:**
- `content-creator` agent
- Design tools

**Naming:**
- Date prefix (time-relevant data)
- Descriptive slug

---

## Logos

**Purpose:** Brand logos and variations.

**Path:** `assets/logos/`

**Structure:**
- `{name}-{variant}.{ext}` - Logo variants

**Common Variants:**
- Primary, secondary, icon
- Light, dark, mono
- Horizontal, vertical, stacked

**Produced By:**
- External design tools
- Brand assets upload

**Naming:**
- Brand/product name
- Variant descriptor

---

## Social Posts

**Purpose:** Platform-specific social media graphics.

**Path:** `assets/posts/{platform}/`

**Structure:**
- `{date}-{slug}.{ext}` - Post graphics

**Platforms:**
- `twitter/`, `linkedin/`, `instagram/`, `facebook/`, `tiktok/`

**Produced By:**
- `social-media-manager` agent
- `/social` commands

**Naming:**
- Date prefix (posting schedule)
- Platform subfolder
- Descriptive slug

---

## Generated

**Purpose:** AI-generated content (images, text, audio).

**Path:** `assets/generated/{type}/`

**Types:**
- `images/` - AI-generated images
- `audio/` - AI-generated audio
- `text/` - AI-generated drafts

**Produced By:**
- `ai-multimodal` skill
- `ai-artist` skill

**Naming:**
- Date prefix
- Descriptive slug
- Consider prompt hash for deduplication

---

# Text Content Assets

## Copy (General)

**Purpose:** Marketing copy for various channels.

**Path:** `assets/copy/{type}/`

**Types:**
- `ads/` - Ad copy variations
- `emails/` - Email copy
- `landing-pages/` - Landing page copy
- `headlines/` - Headline collections

**Produced By:**
- `copywriter` agent
- `content-creator` agent

**Naming:**
- Date prefix for time-sensitive copy
- Campaign/topic slug

---

## Ad Copy

**Purpose:** PPC, social ads, display ads copy.

**Path:** `assets/copy/ads/`

**Structure:**
- `{date}-{campaign}-{variant}.md` - Ad copy with variations

**Format:**
```markdown
# Ad Copy: {Campaign Name}

**Platform:** {Google/Meta/LinkedIn/TikTok}
**Date:** {date}
**Campaign:** {campaign}

## Variation A
- **Headline:** {headline}
- **Primary Text:** {text}
- **CTA:** {button}

## Variation B
...

## A/B Test Notes
{test recommendations}
```

**Produced By:**
- `copywriter` agent
- `/campaign` commands

**Naming:**
- Date prefix (campaign timing)
- Campaign name
- Variant identifier

---

## Email Copy

**Purpose:** Email sequences, campaigns, newsletters.

**Path:** `assets/copy/emails/`

**Structure:**
- `{date}-{sequence}-{slug}.md` - Email copy

**Format:**
```markdown
# Email: {Subject Line}

**Sequence:** {sequence-name}
**Position:** {1/5}
**Date:** {date}

## Subject Lines (Test Variations)
1. {subject 1}
2. {subject 2}
3. {subject 3}

## Preview Text
{preview}

## Body
{email content}

## P.S.
{postscript}

## CTA
{call to action}
```

**Produced By:**
- `email-wizard` agent
- `copywriter` agent
- `/email` commands

**Naming:**
- Date prefix
- Sequence name
- Email slug

---

## Landing Page Copy

**Purpose:** Landing page sections and variations.

**Path:** `assets/copy/landing-pages/`

**Structure:**
- `{slug}.md` - Landing page copy

**Format:**
```markdown
# Landing Page: {Page Name}

**URL:** {target-url}
**Goal:** {conversion goal}

## Hero Section
**Headline:** {headline}
**Subheadline:** {subheadline}
**CTA:** {button text}

## Value Propositions
1. {benefit 1}
2. {benefit 2}
3. {benefit 3}

## Social Proof
{testimonials, logos, stats}

## FAQ
...

## Final CTA
{closing CTA section}
```

**Produced By:**
- `copywriter` agent
- `content-creator` agent

**Naming:**
- Page slug (evergreen)
- No date prefix

---

## Headlines

**Purpose:** Headline collections and test variations.

**Path:** `assets/copy/headlines/`

**Structure:**
- `{date}-{topic}.md` - Headlines collection

**Format:**
```markdown
# Headlines: {Topic}

**Date:** {date}
**Use Case:** {blog/ad/email/social}

## Power Headlines
1. {headline}
2. {headline}

## Question Headlines
1. {headline}
2. {headline}

## How-To Headlines
1. {headline}
2. {headline}

## Listicle Headlines
1. {headline}
2. {headline}

## Recommended Tests
{which headlines to A/B test}
```

**Produced By:**
- `copywriter` agent

**Naming:**
- Date prefix
- Topic slug

---

## Scripts

**Purpose:** Video/audio scripts organized by type.

**Path:** `assets/scripts/{type}/`

**Types:**
- `youtube/` - YouTube video scripts
- `short-form/` - Reels, TikTok, Shorts
- `webinar/` - Webinar scripts
- `podcast/` - Podcast scripts
- `demo/` - Product demo scripts

**Produced By:**
- `/video:script:create` command
- `content-creator` agent

**Naming:**
- Slug from topic/title
- Type subfolder

---

# Campaign Assets

## Campaign Folder Structure

**Purpose:** Self-contained campaign asset organization.

**Path:** `assets/campaigns/{date}-{campaign-slug}/`

**Structure:**
```
assets/campaigns/{date}-{campaign-slug}/
├── briefs/           # Campaign briefs and strategy docs
├── creatives/        # Creative assets (images, videos)
├── reports/          # Performance and analytics reports
└── assets/           # Other campaign materials
```

**Produced By:**
- `campaign-manager` agent
- `/campaign` commands

---

## Campaign Briefs

**Purpose:** Strategy documents, creative briefs, messaging frameworks.

**Path:** `assets/campaigns/{date}-{slug}/briefs/`

**Structure:**
- `{type}-brief.md` - Brief documents

**Types:**
- `creative-brief.md` - Creative direction
- `messaging-brief.md` - Messaging framework
- `channel-brief.md` - Channel-specific tactics
- `audience-brief.md` - Target audience profiles

**Format:**
```markdown
# {Type} Brief: {Campaign Name}

**Campaign:** {campaign-slug}
**Date:** {date}
**Status:** Draft/Final

## Objective
{campaign goals}

## Target Audience
{audience description}

## Key Messages
{messaging framework}

## Requirements
{specifications}

## Success Criteria
{KPIs and targets}
```

**Naming:**
- Brief type prefix
- No date (versioned in git)

---

## Campaign Creatives

**Purpose:** Visual and video assets for campaign.

**Path:** `assets/campaigns/{date}-{slug}/creatives/`

**Structure:**
- `{channel}-{variant}.{ext}` - Creative assets

**Channels:**
- `email-` - Email headers, banners
- `social-` - Social media posts
- `display-` - Display ads
- `video-` - Video ads
- `landing-` - Landing page assets

**Format Examples:**
- `email-header-v1.png`
- `social-instagram-carousel-01.png`
- `display-leaderboard-728x90.png`
- `video-youtube-pre-roll.mp4`

**Naming:**
- Channel prefix
- Variant/size suffix
- Version number if needed

---

## Campaign Reports

**Purpose:** Performance reports, analytics, post-mortems.

**Path:** `assets/campaigns/{date}-{slug}/reports/`

**Structure:**
- `{date}-{report-type}.md` - Report documents

**Types:**
- `weekly-performance.md` - Weekly metrics
- `channel-analysis.md` - Channel breakdown
- `ab-test-results.md` - A/B test outcomes
- `post-mortem.md` - Campaign retrospective
- `roi-analysis.md` - ROI calculations

**Format:**
```markdown
# {Report Type}: {Campaign Name}

**Period:** {date range}
**Generated:** {date}

## Summary
{key findings}

## Metrics
| Metric | Target | Actual | Delta |
|--------|--------|--------|-------|
| {metric} | {target} | {actual} | {+/-} |

## Insights
{analysis}

## Recommendations
{next steps}
```

**Naming:**
- Date prefix (report date)
- Report type slug

---

## Campaign Assets (General)

**Purpose:** Miscellaneous campaign materials.

**Path:** `assets/campaigns/{date}-{slug}/assets/`

**Types:**
- Logos, icons
- Templates
- Raw materials
- Source files

**Naming:**
- Type prefix
- Descriptive name

---

# Sales Assets

## Sales Pitches

**Purpose:** Industry and persona-specific pitch documents.

**Path:** `assets/sales/pitches/`

**Structure:**
- `{date}-{industry}-{persona}.md` - Pitch documents

**Format:**
```markdown
# Sales Pitch: {Industry} - {Persona}

**Date:** {date}
**Target Industry:** {industry}
**Target Persona:** {persona title}

## Opening Hook
{attention-grabbing opener}

## Pain Points
1. {pain point 1}
2. {pain point 2}
3. {pain point 3}

## Solution Positioning
{how we solve these pains}

## Key Differentiators
- {differentiator 1}
- {differentiator 2}

## Proof Points
{testimonials, stats, case studies}

## Call to Action
{next steps}
```

**Produced By:**
- `sale-enabler` agent

**Naming:**
- Date prefix
- Industry slug
- Persona slug

---

## Sales Proposals

**Purpose:** Client-specific proposal documents.

**Path:** `assets/sales/proposals/`

**Structure:**
- `{date}-{client}-proposal.md` - Proposal documents

**Format:**
```markdown
# Proposal: {Client Name}

**Date:** {date}
**Prepared For:** {client}
**Valid Until:** {expiry date}

## Executive Summary
{brief overview}

## Understanding Your Needs
{client pain points and goals}

## Proposed Solution
{solution overview}

## Scope of Work
{deliverables and timeline}

## Investment
{pricing breakdown}

## ROI Projection
{expected returns}

## Next Steps
{implementation plan}
```

**Produced By:**
- `sale-enabler` agent

**Naming:**
- Date prefix
- Client slug

---

## Case Studies

**Purpose:** Customer success stories.

**Path:** `assets/sales/case-studies/`

**Structure:**
- `{date}-{client}-{outcome}.md` - Case study documents

**Format:**
```markdown
# Case Study: {Client Name}

**Industry:** {industry}
**Company Size:** {size}
**Outcome:** {primary result}

## Challenge
{what problem they faced}

## Solution
{how we helped}

## Results
- {metric 1}: {before} → {after} ({improvement}%)
- {metric 2}: {before} → {after} ({improvement}%)

## Quote
> "{testimonial quote}"
> — {name}, {title}

## Key Takeaways
{lessons learned}
```

**Produced By:**
- `sale-enabler` agent

**Naming:**
- Client slug
- Outcome slug (e.g., `3x-revenue`, `50-percent-faster`)

---

## Competitive Battlecards

**Purpose:** Competitor comparison and positioning.

**Path:** `assets/sales/battlecards/`

**Structure:**
- `{competitor}.md` - Battlecard documents

**Format:**
```markdown
# Battlecard: {Competitor Name}

**Last Updated:** {date}
**Threat Level:** {high/medium/low}

## Quick Facts
- **Founded:** {year}
- **Pricing:** {pricing model}
- **Target Market:** {market}

## Their Strengths
- {strength 1}
- {strength 2}

## Their Weaknesses
- {weakness 1}
- {weakness 2}

## Our Advantages
| Area | Them | Us |
|------|------|-----|
| {feature} | {their approach} | {our approach} |

## Common Objections
| Objection | Response |
|-----------|----------|
| "{objection}" | {rebuttal} |

## Trap Questions
{questions to ask that expose competitor weaknesses}
```

**Produced By:**
- `sale-enabler` agent

**Naming:**
- Competitor name slug

---

# SEO Assets

## SEO Audits

**Purpose:** Technical and content SEO audit reports.

**Path:** `assets/seo/audits/`

**Structure:**
- `{date}-{domain}-audit.md` - Audit documents

**Format:**
```markdown
# SEO Audit: {domain}

**Date:** {date}
**Domain:** {domain}

## Executive Summary
{key findings}

## Technical SEO
| Issue | Severity | Fix |
|-------|----------|-----|
| {issue} | {high/med/low} | {fix} |

## Content Analysis
{content quality assessment}

## Recommendations
{prioritized action items}
```

**Produced By:**
- `seo-specialist` agent
- `/seo:audit` command

**Naming:**
- Date prefix
- Domain slug

---

## Keyword Research

**Purpose:** Keyword analysis and opportunity reports.

**Path:** `assets/seo/keywords/`

**Structure:**
- `{date}-{topic}-keywords.md` - Keyword research documents

**Format:**
```markdown
# Keyword Research: {Topic}

**Date:** {date}
**Topic:** {topic}

## Primary Keywords
| Keyword | Volume | Difficulty | Intent |
|---------|--------|------------|--------|
| {keyword} | {vol} | {diff} | {intent} |

## Long-Tail Opportunities
| Keyword | Volume | Difficulty |
|---------|--------|------------|
| {keyword} | {vol} | {diff} |

## Content Recommendations
{content ideas based on keywords}
```

**Produced By:**
- `seo-specialist` agent
- `/seo:keywords` command

**Naming:**
- Date prefix
- Topic slug

---

## Schema Markup

**Purpose:** JSON-LD schema markup files.

**Path:** `assets/seo/schemas/`

**Structure:**
- `{page}-schema.json` - Schema markup files

**Types:**
- `organization-schema.json`
- `product-{name}-schema.json`
- `article-{slug}-schema.json`
- `faq-{page}-schema.json`

**Produced By:**
- `seo-specialist` agent

**Naming:**
- Page/entity slug
- Schema type suffix

---

# Funnel Assets

## Funnel Designs

**Purpose:** Funnel architecture and stage design documents.

**Path:** `assets/funnels/designs/`

**Structure:**
- `{date}-{slug}-funnel.md` - Funnel design document

**Format:**
```markdown
# Funnel Design: {Funnel Name}

**Type:** {webinar/sales/lead-gen/etc}
**Stages:** {number of stages}

## Funnel Overview
[Visual representation]

## Stage Details
### Stage 1: {Name}
- **Goal:** {objective}
- **Content:** {content type}
- **CTA:** {action}
- **Metrics:** {KPIs}

## Offer Stack
{Hormozi model elements}

## Implementation Notes
{technical requirements}
```

**Produced By:**
- `funnel-architect` agent

**Naming:**
- Descriptive slug
- `-funnel` suffix

---

## Funnel Audits

**Purpose:** Funnel performance analysis and optimization reports.

**Path:** `assets/funnels/audits/`

**Structure:**
- `{date}-{funnel}-audit.md` - Audit documents

**Produced By:**
- `funnel-architect` agent

**Naming:**
- Date prefix
- Funnel slug

---

## A/B Tests

**Purpose:** A/B test designs and results.

**Path:** `assets/funnels/tests/`

**Structure:**
- `{date}-{test-name}.md` - Test documents

**Produced By:**
- `funnel-architect` agent

**Naming:**
- Date prefix
- Test name slug

---

# Lead Assets

## Scoring Models

**Purpose:** Lead scoring criteria and rules.

**Path:** `assets/leads/scoring-models/`

**Structure:**
- `{date}-{model-name}.md` - Scoring model documents

**Format:**
```markdown
# Lead Scoring Model: {Name}

**Date:** {date}
**Version:** {version}

## Demographic Score (Max: {N} pts)
| Criteria | Points | Rationale |
|----------|--------|-----------|
| {criteria} | {pts} | {why} |

## Behavioral Score (Max: {N} pts)
| Action | Points | Decay |
|--------|--------|-------|
| {action} | {pts} | {days} |

## Thresholds
- **MQL:** {score} points
- **SQL:** {score} points
- **Hot Lead:** {score} points
```

**Produced By:**
- `lead-qualifier` agent

**Naming:**
- Date prefix
- Model name slug

---

## Segments

**Purpose:** Lead segment definitions.

**Path:** `assets/leads/segments/`

**Structure:**
- `{segment-name}.md` - Segment documents

**Produced By:**
- `lead-qualifier` agent

**Naming:**
- Segment slug (evergreen)

---

## ICP Profiles

**Purpose:** Ideal Customer Profile definitions.

**Path:** `assets/leads/icp-profiles/`

**Structure:**
- `{persona}.md` - ICP profile documents

**Format:**
```markdown
# ICP Profile: {Persona Name}

## Demographics
- **Industry:** {industry}
- **Company Size:** {size}
- **Role:** {title}
- **Location:** {region}

## Psychographics
- **Goals:** {goals}
- **Challenges:** {pain points}
- **Objections:** {common objections}

## Buying Behavior
{purchase patterns}

## Qualification Criteria
{BANT or custom criteria}
```

**Produced By:**
- `lead-qualifier` agent

**Naming:**
- Persona slug (evergreen)

---

# Community Assets

## Response Templates

**Purpose:** Pre-written responses for common community situations.

**Path:** `assets/community/templates/`

**Structure:**
- `{situation}.md` - Template documents

**Format:**
```markdown
# Response Template: {Situation}

**Use When:** {trigger conditions}
**Tone:** {friendly/professional/empathetic}

## Template
{response text with placeholders}

## Variations
### Variation A
{alternative response}

## Notes
{when to customize}
```

**Produced By:**
- `community-manager` agent

**Naming:**
- Situation slug (evergreen)

---

## FAQs

**Purpose:** Frequently asked questions and answers.

**Path:** `assets/community/faqs/`

**Structure:**
- `{topic}.md` - FAQ documents

**Produced By:**
- `community-manager` agent

**Naming:**
- Topic slug (evergreen)

---

## Moderation Guides

**Purpose:** Community moderation policies and guidelines.

**Path:** `assets/community/moderation/`

**Structure:**
- `{policy}.md` - Policy documents

**Produced By:**
- `community-manager` agent

**Naming:**
- Policy slug (evergreen)

---

# Retention Assets

## Retention Campaigns

**Purpose:** Re-engagement and win-back campaign designs.

**Path:** `assets/retention/campaigns/`

**Structure:**
- `{date}-{campaign}.md` - Campaign documents

**Format:**
```markdown
# Retention Campaign: {Name}

**Date:** {date}
**Target Segment:** {segment}
**Trigger:** {condition}

## Campaign Flow
1. {step 1}
2. {step 2}

## Messages
### Email 1
- **Subject:** {subject}
- **Content:** {content}
- **CTA:** {action}

## Success Metrics
{KPIs}
```

**Produced By:**
- `continuity-specialist` agent

**Naming:**
- Date prefix
- Campaign slug

---

## Health Scoring Models

**Purpose:** Customer health scoring criteria.

**Path:** `assets/retention/scoring-models/`

**Structure:**
- `{date}-{model}.md` - Scoring model documents

**Produced By:**
- `continuity-specialist` agent

**Naming:**
- Date prefix
- Model slug

---

## Intervention Playbooks

**Purpose:** Actions for at-risk customer segments.

**Path:** `assets/retention/playbooks/`

**Structure:**
- `{segment}.md` - Playbook documents

**Format:**
```markdown
# Intervention Playbook: {Segment}

**Risk Level:** {high/medium/low}
**Trigger:** {condition}

## Actions
| Step | Action | Owner | Timeline |
|------|--------|-------|----------|
| 1 | {action} | {owner} | {time} |

## Escalation Path
{when to escalate}

## Success Criteria
{metrics}
```

**Produced By:**
- `continuity-specialist` agent

**Naming:**
- Segment slug (evergreen)

---

# Attraction Assets

## Landing Page Content

**Purpose:** Landing page copy and content.

**Path:** `assets/attraction/landing-pages/`

**Structure:**
- `{slug}.md` - Landing page content

**Format:**
```markdown
# Landing Page: {Page Name}

**URL:** {target-url}
**Goal:** {conversion goal}
**Keyword:** {primary keyword}

## Hero Section
- **Headline:** {headline}
- **Subheadline:** {subheadline}
- **CTA:** {button text}

## Value Propositions
1. {benefit 1}
2. {benefit 2}

## Social Proof
{testimonials, logos}

## FAQ
{questions and answers}
```

**Produced By:**
- `attraction-specialist` agent

**Naming:**
- Page slug (evergreen)

---

## Lead Magnets

**Purpose:** Lead magnet content and designs.

**Path:** `assets/attraction/lead-magnets/`

**Structure:**
- `{slug}.md` - Lead magnet documents

**Produced By:**
- `attraction-specialist` agent

**Naming:**
- Magnet slug (evergreen)

---

## pSEO Templates

**Purpose:** Programmatic SEO template designs.

**Path:** `assets/attraction/pseo-templates/`

**Structure:**
- `{template-name}.md` - Template documents

**Format:**
```markdown
# pSEO Template: {Template Name}

**Pattern:** {URL pattern}
**Variables:** {dynamic elements}

## Page Structure
### Title Template
{title pattern}

### Meta Description
{description pattern}

### H1 Template
{headline pattern}

### Content Blocks
{content structure}

## Internal Linking
{linking strategy}

## Schema
{structured data template}
```

**Produced By:**
- `attraction-specialist` agent

**Naming:**
- Template name slug (evergreen)

---

## Content Briefs

**Purpose:** Content creation briefs for writers.

**Path:** `assets/attraction/content-briefs/`

**Structure:**
- `{date}-{topic}.md` - Brief documents

**Produced By:**
- `attraction-specialist` agent

**Naming:**
- Date prefix
- Topic slug

---

# Diagnostic Assets

## Campaign Audits

**Purpose:** Campaign performance analysis and debugging reports.

**Path:** `assets/diagnostics/campaign-audits/`

**Structure:**
- `{date}-{campaign}.md` - Audit documents

**Format:**
```markdown
# Campaign Audit: {Campaign Name}

**Date:** {date}
**Campaign:** {campaign}
**Issue:** {problem summary}

## Executive Summary
{key findings}

## Timeline
{chronological events}

## Root Cause Analysis
{investigation findings}

## Recommendations
{fixes and improvements}

## Evidence
{supporting data}
```

**Produced By:**
- `campaign-debugger` agent

**Naming:**
- Date prefix
- Campaign slug

---

## Content Reviews

**Purpose:** Content quality assessment reports.

**Path:** `assets/diagnostics/content-reviews/`

**Structure:**
- `{date}-{content}.md` - Review documents

**Produced By:**
- `content-reviewer` agent

**Naming:**
- Date prefix
- Content slug
