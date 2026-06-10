---
name: seosona:cro
description: >-
  Conversion Rate Optimization for forms, landing pages, onboarding flows,
  and checkout. Evidence-based optimization with A/B test hypotheses.
  Activate when user asks to increase conversion rate, optimize forms,
  reduce bounce rate, improve landing pages, fix checkout drop-off, or
  improve onboarding. Keywords: "CRO", "conversion", "form optimization",
  "bounce rate", "landing page", "checkout", "onboarding", "tối ưu chuyển đổi".
argument-hint: "[form|landing-page|onboarding|checkout] [URL or description]"
version: "1.0.0"
---

# CRO — Conversion Rate Optimization

Evidence-based optimization for forms, landing pages, onboarding, and checkout.

## Initial Assessment

Before any optimization, identify:
1. **What to optimize:** form / landing page / onboarding / checkout / entire funnel
2. **Current baseline:** existing conversion rate (if known)
3. **Traffic source:** organic, paid, email, direct — each has different intent/behavior
4. **Device split:** mobile vs desktop (usually needs separate optimization)
5. **Where drop-off happens:** which step/field/section loses people

## Core Principles

### 1. Every Friction Has a Cost
Each point of friction reduces conversion. Before adding anything, ask:
- Does this help the user accomplish their goal?
- Does this reduce our business risk enough to justify the friction?
- Can we get this information after conversion instead?

### 2. Value Must Exceed Perceived Effort
Conversion happens when: **Perceived Value > Perceived Effort + Perceived Risk**
- Increase value (better copy, stronger offer, social proof)
- Reduce effort (fewer fields, simpler steps, faster pages)
- Reduce risk (guarantees, testimonials, security badges)

### 3. Match Visitor Awareness Level
Traffic from "buy [product]" keyword → BOFU page (direct offer)
Traffic from "how to [solve problem]" → MOFU page (educate → capture)
Mismatch = high bounce rate regardless of CRO tactics.

---

## Form Optimization

### Field Cost Rule
| Fields | Expected Completion |
|--------|-------------------|
| 1-2 | 90%+ |
| 3 | Baseline (100%) |
| 4-6 | 75-90% |
| 7+ | 50-75% |
| 10+ | <50% |

**For each field, ask:**
- Is this absolutely necessary BEFORE we can help them?
- Can we get this data via enrichment (Clearbit, email domain lookup)?
- Can we ask this AFTER first conversion (progressive profiling)?

### Field Optimization Rules
- **Email:** Single field, inline validation, typo detection
- **Name:** Test "Full Name" (1 field) vs "First / Last" (2 fields)
- **Phone:** Always optional unless sales call is required; explain why if required
- **Company:** Auto-suggest or infer from email domain
- **Message:** Make optional, expand on focus
- **Dropdowns:** Use radio buttons if <5 options; searchable if >10

### Multi-Step Forms (Use when >5 fields)
- Show progress: "Step 2 of 3" or progress bar
- Start with easiest fields (name, email)
- End with sensitive fields (phone, budget, company size)
- Allow back navigation
- Save progress (don't lose data on page refresh)

### Error Handling
- Validate on field blur, not on every keystroke
- Specific error messages: "Please enter a valid email (e.g., name@company.com)"
- Never clear entered data on error
- Focus first error field on submit

### Submit Button Copy
| Weak | Strong |
|------|--------|
| Submit | Get My Free Report |
| Send | Send My Request |
| Sign Up | Start My Free Trial |
| Download | Download the Guide Now |

**Formula:** "[Verb] + [What they get] + [Optional: timeframe/qualifier]"

---

## Landing Page Optimization

### Above the Fold (most critical)
Must contain within first viewport (no scroll):
- [ ] Clear headline — what you do + who it's for
- [ ] Subheadline — key differentiator or how it works
- [ ] Primary CTA button (specific copy, high contrast color)
- [ ] Trust signal (logo strip, review stars, user count)

### Social Proof Placement
- **Near CTA:** increases conversion 20-34% (Nielsen Norman data)
- **Types by effectiveness:** video testimonials > named testimonials > ratings > logo strip > user counts
- **Specificity rule:** "Increased traffic 340% in 60 days" > "Great tool"

### Page Speed Impact (Google data)
| Load Time | Conversion Impact |
|-----------|-------------------|
| 1 second | Baseline |
| 2 seconds | -7% |
| 3 seconds | -14% |
| 5 seconds | -35% |
| 10 seconds | -58% |

**Quick wins:** Compress images (WebP), defer non-critical JS, use CDN, minimize CSS

### Trust & Risk Reduction
Near every CTA:
- Money-back guarantee (if applicable)
- "No credit card required" (if trial)
- "Cancel anytime" (if subscription)
- Privacy assurance ("We'll never share your data")
- Security badges (SSL, payment processor logos)

---

## Onboarding CRO

The onboarding flow determines whether a user reaches their "aha moment" and converts to active/paid.

### Aha Moment Framework
1. **Define the aha moment** — what is the first moment of value?
   - Example for SEOSONA: "seeing your first SEO score"
2. **Measure time to aha** — how long does it take currently?
3. **Remove everything between signup and aha**
4. **Make aha repeatable** — drive back to it via email/notification

### Onboarding Principles
- **Quick win first** — show value in < 2 minutes
- **Progress indicators** — "Setup 2 of 4" reduces abandonment
- **Skip options** — forced completion causes drop-off
- **Email drip backup** — capture incomplete onboarding via email sequence
- **Contextual tooltips** — explain features at point of use, not in docs

### Activation Metrics
| Metric | Target |
|--------|--------|
| Signup → First action | < 5 minutes |
| First action → Aha moment | < 10 minutes |
| Aha moment → Activation | < 1 session |
| Day 1 retention | > 40% |
| Day 7 retention | > 20% |

---

## A/B Test Hypothesis Library

Format: **If we [change], then [metric] will [direction] by [amount], because [psychology/principle].**

### High-Priority Tests
1. Headline variant (urgency vs clarity vs curiosity)
2. CTA copy ("Get" vs "Start" vs "Download" vs specific)
3. Form field reduction (remove one field at a time)
4. Social proof placement (above fold vs near CTA vs both)
5. CTA color (test high-contrast vs brand color)
6. Trust badge placement (before vs after CTA)
7. Pricing anchor (show expensive first vs show value first)

### Statistical Validity Rules
- Minimum sample: 100 conversions per variant
- Run time: at least 2 full weeks (captures weekly patterns)
- Test one thing at a time
- Document all tests in `3_MEMORY/specs/ab_tests.md`

---

## CRO Quick Wins Checklist

**Page level:**
- [ ] Headline passes the "5-second test" (clear who/what/why)
- [ ] CTA is visible without scrolling
- [ ] Page loads in < 3 seconds
- [ ] Mobile: CTA button is thumb-friendly (44px+ height)
- [ ] No more than one primary CTA

**Form level:**
- [ ] Fields reduced to absolute minimum
- [ ] No generic "Submit" button
- [ ] Privacy assurance near form
- [ ] Inline field validation works
- [ ] Form works on mobile without horizontal scroll

**Trust level:**
- [ ] Testimonials include name, company, photo
- [ ] User/customer count visible (with specific number)
- [ ] Recognizable logo strip if applicable
- [ ] SSL badge visible if collecting payment data

## Agent Integration

**Primary:** Use for any conversion optimization task
**Related skills:** `funnel`, `copywriting`, `marketing_psychology`
**Data sources:** `ga4_connector` (bounce rate, session duration), `technical_seo_scanner` (page speed)
