---

name: ab_testing
description: "Design and analyze experiments that produce statistically valid, actionable results."
  A/B test design, hypothesis framework, sample size calculation, statistical
  analysis, and experiment documentation. Activate when user wants to test
  a change, set up an experiment, analyze test results, or design variants.
  Keywords: "A/B test", "split test", "experiment", "hypothesis", "variant",
  "statistical significance", "test this change", "kiểm tra A/B", "thử nghiệm".
argument-hint: "[page|feature] [what to test]"
version: "1.0.0"
---

# A/B Testing

Design and analyze experiments that produce statistically valid, actionable results.

## Core Principles

1. **Hypothesis first** — Not "let's see what happens" — specific prediction with reasoning
2. **Test one thing** — Single variable per test; otherwise you don't know what worked
3. **Statistical rigor** — Pre-determine sample size. Never stop early because you "see" significance
4. **Measure what matters** — Primary metric tied to business value + guardrail metrics

---

## Hypothesis Framework

### Structure
```
Because [observation/data],
we believe [specific change]
will cause [expected outcome]
for [audience segment].
We'll know this is true when [primary metric] changes by [X%].
```

### Example
❌ **Weak:** "Changing the button color might increase clicks."

✅ **Strong:** "Because heatmaps show users aren't seeing the CTA (per Hotjar), we believe making the button 2x larger with high-contrast color will increase CTA click-through by 15%+ for new visitors. We'll measure CTR from page view to signup start."

---

## Test Types

| Type | Variants | Traffic Required | Use When |
|------|---------|-----------------|----------|
| A/B | 2 (control + variant) | Low | Most common, single change |
| A/B/n | 3+ | Medium | Testing multiple options |
| Multivariate | Multiple combinations | Very high | Testing interaction effects |
| Split URL | Different URLs | Low | Major page redesigns |

---

## Sample Size Calculator

### Quick Reference Table

| Baseline Rate | Detect 10% lift | Detect 20% lift | Detect 50% lift |
|--------------|----------------|----------------|----------------|
| 1% | 150,000/variant | 39,000/variant | 6,000/variant |
| 3% | 47,000/variant | 12,000/variant | 2,000/variant |
| 5% | 27,000/variant | 7,000/variant | 1,200/variant |
| 10% | 12,000/variant | 3,000/variant | 550/variant |

**Duration formula:**
```
Duration = (Sample needed × Variants) ÷ (Daily traffic × Conversion rate)
Minimum: 1-2 business cycles (at least 1 week)
```

**External calculators:** Evans Miller (evanmiller.org/ab-testing) | Optimizely

---

## Metrics Framework

### 3-Layer Metric Structure

| Layer | What | Example |
|-------|------|---------|
| **Primary** | Single metric that determines winner | CTA click-through rate |
| **Secondary** | Context for why it worked | Time to click, scroll depth |
| **Guardrail** | What must NOT get worse | Revenue, downstream conversion, NPS |

### By Test Type
| Test | Primary | Secondary | Guardrail |
|------|---------|-----------|---------|
| Homepage CTA | CTA CTR | Time to click | Bounce rate |
| Pricing page | Plan selection rate | Time on page | Refund rate |
| Signup flow | Completion rate | Field drop-off | Post-signup activation |
| Email subject | Open rate | Click rate | Unsubscribe rate |

---

## Designing Variants

### What to Test (Priority Order)
1. **Concept/angle** — Biggest impact. What problem angle resonates?
2. **Headline/hook** — High leverage, quick to implement
3. **Visual structure** — Layout, image, visual hierarchy
4. **Body copy** — Message length, specifics
5. **CTA** — Button copy, size, placement, color

### Variant Documentation
```markdown
## Test: [Name]
**Hypothesis:** [Full statement]

### Control (A)
[Screenshot + description of current state]

### Variant (B)
[Screenshot/mockup + specific changes]
[Hypothesis for why this will win]
```

---

## Traffic Allocation

| Approach | Split | When to Use |
|----------|-------|-------------|
| Standard | 50/50 | Most tests |
| Conservative | 90/10 → 80/20 | High-risk changes |
| Ramp | Increase over time | Technical risk mitigation |

**Rules:** Same user always sees same variant. Balanced time-of-day/week exposure.

---

## Implementation Tools

| Tool | Type | Best For |
|------|------|---------|
| PostHog | Client + Server | Product experiments |
| Optimizely | Client | Marketing pages |
| VWO | Client | Marketing pages |
| LaunchDarkly | Server | Feature flags |
| Google Optimize* | Client | Marketing (*deprecated) |

**Client-side:** Quick, can cause flicker → Good for marketing pages, copy changes
**Server-side:** No flicker, needs dev → Good for product features, complex changes

---

## Running the Test

### Pre-Launch Checklist
- [ ] Hypothesis documented with hypothesis framework
- [ ] Primary metric defined and tracked
- [ ] Sample size calculated and run time estimated
- [ ] Both variants QA'd on desktop + mobile
- [ ] Tracking verified (fire test events before launch)
- [ ] Stakeholders informed of test duration

### During the Test
✅ Monitor for technical issues | Check segment quality | Document external events
❌ DON'T peek and stop early | DON'T change variants mid-test | DON'T add new traffic sources

**Peeking problem:** Looking at results before reaching sample size = false positives, inflated effects, wrong decisions. Pre-commit to sample size and trust the process.

---

## Analyzing Results

### Decision Matrix

| Result | Action |
|--------|--------|
| Significant winner (p<0.05) | Implement variant |
| Significant loser (p<0.05) | Keep control, document why |
| No significant difference | Need more traffic or bolder test |
| Mixed signals (primary ↑, guardrail ↓) | Dig into segments |

### Segment Analysis (Run After Results)
- Mobile vs desktop (often different behavior)
- New vs returning visitors
- Traffic source (organic vs paid vs direct)
- Device type

### Statistical vs Practical Significance
Statistical significance (p<0.05) ≠ business significance.
Ask: "Is the effect size worth implementing and maintaining?"

---

## Test Documentation Template

```markdown
## A/B Test: [Name]
**ID:** [Tool ID] | **Dates:** [Start] - [End] | **Owner:** [Name]

### Hypothesis
[Full hypothesis statement]

### Variants
- Control (A): [Description]
- Variant (B): [Description + changes]

### Results
- Sample: [Achieved] vs [Target]
- Primary metric: [Control X%] vs [Variant Y%] ([Δ%], [confidence%])
- Secondary: [Summary]
- Guardrails: [OK / Concern]
- Segments: [Notable differences]

### Decision
Winner: [A / B / Inconclusive]
Action: [Implement / Keep control / Retest]

### Learnings
[What this tells us + what to test next]
```

---

## A/B Test Idea Library (Priority Queue)

High-impact areas to test first:
1. **Headline** — Single highest-leverage element
2. **CTA copy** — "Submit" vs. specific action + benefit
3. **Form field count** — Remove one field, measure completion
4. **Social proof placement** — Above fold vs. near CTA
5. **CTA color** — High-contrast vs. brand color
6. **Pricing display** — Monthly vs. annual first
7. **Hero image** — With vs. without, person vs. product

---

## Building a Testing Culture

- **Central test log:** `3_MEMORY/specs/ab_tests.md` — all tests, results, learnings
- **Prevent re-running failures:** Search log before proposing test
- **Min viable test:** 2 weeks runtime + 100+ conversions per variant
- **Win rate expectation:** 1/4 tests typically win — that's normal and valuable

## Agent Integration
**Primary:** Use when designing or analyzing any experiment
**Related skills:** `cro`, `copywriting`, `analytics`
**Output:** Document tests in `3_MEMORY/specs/ab_tests.md`
