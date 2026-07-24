---

name: skill
description: "Building accurate customer personas to drive all marketing decisions."
  Customer persona creation, ICP (Ideal Customer Profile) development,
  audience segmentation, and persona-driven content strategy.
  Activate when user asks to define target audience, create buyer persona,
  understand customer segments, or build ICP.
  Keywords: "persona", "customer persona", "buyer persona", "ICP",
  "ideal customer profile", "target audience", "audience segment",
  "khách hàng mục tiêu", "chân dung khách hàng".
argument-hint: "[create|analyze|update] [persona-name]"
version: "1.0.0"
---

# Customer Persona & ICP

Building accurate customer personas to drive all marketing decisions.

## Why Personas Matter

Bad persona → Wrong message → Wrong audience → Wasted budget.
Good persona → Right message → Right audience → Lower CAC, higher LTV.

**The Jobs-to-Be-Done lens:** Don't describe WHO they are — describe WHAT JOB they're hiring your product to do.

---

## ICP Definition Framework

### Step 1: Start with Your Best Customers
Pull from existing customers (or target customers):
- Who has the highest LTV?
- Who converts fastest?
- Who refers others?
- Who gives the best reviews?

**Data to collect:**
- Company: industry, size, revenue, growth rate, tech stack
- Contact: role, seniority, decision-making power
- Behavior: how they found you, what they said in sales calls, what made them convert

### Step 2: ICP Profile Template

```markdown
## ICP: [Name]

### Company Profile
- Industry: [e.g., SaaS, E-commerce, Agency]
- Size: [e.g., 10-50 employees]
- Revenue: [e.g., $500K - $5M ARR]
- Geography: [e.g., Vietnam, SEA]
- Tech stack: [key tools they use]

### Contact Profile
- Title: [e.g., Marketing Manager, Founder]
- Seniority: [e.g., C-level, Manager, IC]
- Decision power: [Budget holder / Influencer / User]
- Reports to: [e.g., CEO, CMO]

### Context
- Trigger event: [What makes them look for a solution NOW?]
  (e.g., "just got funding", "competitor just launched", "team grew to 10")
- Current solution: [What they do now / what they're replacing]
- Why they switch: [Primary motivation to change]

### Pain Points (Jobs to Be Done)
1. [Functional job: task they want to accomplish]
2. [Emotional job: how they want to feel]
3. [Social job: how they want to appear to others]

### Goals & Motivations
- Primary goal: [e.g., "increase organic traffic 50% this quarter"]
- Success metric: [How they measure success]
- Personal motivation: [Career advancement, efficiency, recognition]

### Objections & Fears
1. [e.g., "Will this work for Vietnamese market?"]
2. [e.g., "We don't have time to set this up"]
3. [e.g., "We tried something similar and it didn't work"]

### Buying Behavior
- Research process: [How they evaluate solutions]
- Content consumed: [Blog, YouTube, LinkedIn, Peer recommendations]
- Decision timeframe: [Days / Weeks / Months]
- Budget authority: [Can spend X alone / needs approval]
- Influences: [Who they trust: peers, influencers, case studies]

### Preferred Channels
- Discovery: [e.g., Google search, LinkedIn, peer referral]
- Evaluation: [e.g., G2 reviews, case studies, demos]
- Communication: [e.g., Email, LinkedIn, WhatsApp]
```

---

## Persona Research Methods

### Primary Research (Best)
1. **Customer interviews:** 10-15 interviews with best customers (45-60 min)
   - "Walk me through the last time you [problem]..."
   - "What were you using before? Why did you switch?"
   - "What almost stopped you from buying?"

2. **Sales call recordings:** Review 20+ calls with Gong/Chorus — what objections, language, pain points?

3. **Support tickets:** What do customers struggle with? Patterns = unmet needs

4. **NPS survey follow-up:** Ask "Why did you give that score?" and call high NPS responders

### Secondary Research
- G2/Capterra reviews of you AND competitors (read the 3-star reviews!)
- Reddit/Quora threads about the problem
- LinkedIn profiles of your best customers
- Industry reports and surveys

---

## Persona Segmentation

### When to Have Multiple Personas

**Yes, if:**
- Your product serves genuinely different use cases
- Different buyers have different pain points and messages
- Sales cycle/process differs significantly by segment

**No, if:**
- You're early stage (start with 1 ICP, go deep)
- Personas are superficially different but have same core pain
- You'd dilute marketing trying to reach all of them

### Segmentation Dimensions

| Dimension | Examples |
|-----------|---------|
| Company size | Solo / SMB / Mid-market / Enterprise |
| Industry | SaaS / Agency / E-commerce / Local biz |
| Role | Founder / Marketing Manager / SEO Specialist |
| Sophistication | Beginner / Intermediate / Expert |
| Urgency | Exploring / Evaluating / Ready to buy |

---

## Persona → Content Matrix

Once persona is defined, map to content strategy:

| Awareness Level | Content Type | Channel |
|---|---|---|
| Unaware | Problem-focused blog posts, SEO | Google, social |
| Problem-aware | How-to guides, comparison content | Google, YouTube |
| Solution-aware | Case studies, demos, testimonials | Direct, email |
| Product-aware | Free trial, pricing page | Direct, retargeting |
| Customer | Onboarding content, upsell | Email, in-app |

### Message Tailoring by Persona
For each persona, define:
- **Hook:** What specific pain triggers their attention?
- **Promise:** What outcome do they want?
- **Proof:** What evidence do they trust?
- **CTA:** What action makes sense at their awareness level?

---

## Quick Persona Validation

Before investing heavily, validate the persona is real:
1. Can you name 5 real companies that match this ICP?
2. Can you find 10 people on LinkedIn with this exact profile?
3. Do 3 of your current best customers match this description?
4. Does your sales team recognize this person immediately?

If no to any → refine the persona.

---

## Output: Persona Card

Deliverable for team use:

```markdown
## Persona: [Name/Label]
**Quote:** "[Their authentic words about their problem]"

| | |
|--|--|
| Role | [Title, seniority] |
| Company | [Size, industry] |
| Goal | [Primary goal] |
| Pain | [Primary pain] |
| Channel | [Where they are] |

**Story:** [2-3 sentences describing their day and how your product fits]

**Use for:** [Which marketing/content/sales activities this persona guides]
```

## Agent Integration
**Primary:** Use when defining target audience for any marketing task
**Related skills:** `copywriting` (persona-specific messaging), `content_marketing` (persona-mapped content), `funnel` (persona-based funnel design)
**Output:** Store personas in `3_MEMORY/specs/personas/`
