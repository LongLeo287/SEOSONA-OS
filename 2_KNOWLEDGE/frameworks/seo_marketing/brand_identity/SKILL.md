---

name: brand_identity
description: "Brand voice, visual identity, messaging frameworks, and consistency systems."
  Brand voice, visual identity, messaging framework, and brand consistency.
  Activate when user asks about brand guidelines, tone of voice, brand audit,
  messaging framework, color palette, typography, or logo usage.
  Keywords: "brand", "nhận diện thương hiệu", "brand voice", "tone of voice",
  "brand guideline", "thương hiệu", "brand positioning", "messaging".
argument-hint: "[voice|visual|messaging|audit]"
version: "1.0.0"
---

# Brand Identity

Brand voice, visual identity, messaging frameworks, and consistency systems.

## When to Use
- Defining brand voice and content tone
- Creating/reviewing visual identity standards
- Building messaging framework
- Auditing brand consistency
- Organizing brand assets

---

## Brand Voice Framework

### 4 Dimensions of Brand Voice
1. **Character/Persona** — Who is the brand as a person?
2. **Tone** — How does the character express themselves in different contexts?
3. **Language** — Specific vocabulary and sentence style
4. **Purpose** — Why does the brand communicate?

### Voice vs. Tone
- **Voice** stays constant (who you are)
- **Tone** adapts to context (how you express it)

| Context | Tone Adjustment |
|---------|----------------|
| Marketing copy | Energetic, inspiring |
| Error messages | Calm, helpful, solution-focused |
| Onboarding | Encouraging, clear |
| Support | Patient, empathetic |
| Social media | Casual, engaged |

### Voice Definition Template
```
[Brand Name] sounds like: [3 voice adjectives]
[Brand Name] never sounds like: [3 opposite adjectives]

In practice, we are [adjective] but not [extreme version].
Example: "Confident but not arrogant"
         "Friendly but not unprofessional"
         "Expert but not condescending"
```

### Writing Style Rules
- Sentence length: [Short/Medium/Long]? → Default: Mix, avg <20 words
- Jargon policy: [Use freely / Explain always / Avoid]?
- Contractions: [Yes / No]?
- Humor: [Frequent / Occasional / Never]?
- First person ("we"): [Yes / No]?

---

## Visual Identity

### Color System
```
Primary:    #______ — Main brand actions, CTA buttons
Secondary:  #______ — Accents, highlights
Background: #______ — Page/card backgrounds
Text:       #______ — Primary reading text
Text-muted: #______ — Subtext, captions
Accent:     #______ — Hover, active states
Success:    #______ — Positive feedback
Error:      #______ — Alerts, warnings
```

**Contrast rules:** All text must meet WCAG AA (4.5:1 ratio minimum).

### Typography Hierarchy
| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | [Font] | 700 | 32-48px |
| H2 | [Font] | 600 | 24-32px |
| H3 | [Font] | 600 | 20-24px |
| Body | [Font] | 400 | 16-18px |
| Caption | [Font] | 400 | 12-14px |
| Code | [Mono Font] | 400 | 14px |

### Logo Usage Rules
- **Clear space:** Minimum 2x logo height on all sides
- **Minimum size:** 80px width for digital
- **Dark backgrounds:** Use light/white version
- **Light backgrounds:** Use dark/primary version
- **Never:** Stretch, rotate, recolor, add effects, use on busy backgrounds

---

## Messaging Framework

### Brand Positioning Statement
```
For [target audience]
who [have this problem/need],
[Brand Name] is the [category]
that [key benefit]
because [reason to believe].

Unlike [alternatives],
we [key differentiator].
```

### Elevator Pitches
**5-second version:** [Tagline only]
**30-second version:** [1-2 sentences — who, what, outcome]
**2-minute version:** [Full story — problem, solution, proof, CTA]

### Message Hierarchy
| Audience Awareness | Key Message |
|---|---|
| Unaware | [Problem-focused hook] |
| Problem-aware | [Solution category introduction] |
| Solution-aware | [Why us vs. alternatives] |
| Product-aware | [Specific features + proof] |
| Most aware | [Offer + urgency] |

### Core Value Propositions
1. **Primary UVP** — [Single sentence, most important benefit]
2. **Secondary** — [Supporting benefit]
3. **Tertiary** — [Additional differentiator]

---

## Brand Consistency Checklist

### Every Content Piece
- [ ] Matches brand voice adjectives (review voice card)
- [ ] Uses approved terminology (no prohibited phrases)
- [ ] CTA matches brand tone
- [ ] Headline follows approved style
- [ ] Color usage follows system
- [ ] Typography uses brand fonts

### Visual Assets
- [ ] Logo usage follows rules
- [ ] Colors are from approved palette (hex verified)
- [ ] Fonts are brand-approved
- [ ] Images align with brand aesthetic
- [ ] Clear space rules respected

### Cross-Platform Consistency
- [ ] Website reflects brand guidelines
- [ ] Social profiles use consistent bio/handle
- [ ] Email signatures follow template
- [ ] Ad creative matches brand style
- [ ] App/product uses design system

---

## Brand Asset Organization

### Folder Structure
```
assets/brand/
├── logos/
│   ├── primary/       (full color)
│   ├── reversed/      (white/light versions)
│   └── icon/          (favicon, app icon)
├── colors/
│   ├── palette.css    (CSS variables)
│   └── swatches.png   (visual reference)
├── typography/
│   └── fonts/         (font files)
├── templates/
│   ├── email-signature.html
│   ├── social-cover.psd
│   └── pitch-deck.pptx
└── guidelines.md      (this document)
```

### Asset Naming Convention
`[brand]-[type]-[variant]-[size].[ext]`
Examples:
- `acme-logo-primary-full.svg`
- `acme-logo-reversed-icon.png`
- `acme-hero-homepage-v2.jpg`

---

## Brand Audit Questions

Run quarterly to catch drift:
1. Pick 10 random pieces of recent content — do they sound like one brand?
2. Check all social profiles — consistent bio, logo, colors?
3. Review emails from last 3 months — do they feel the same as website?
4. Compare to competitor brands — are we clearly differentiated?
5. Ask a new team member: "How would you describe our brand voice?"

## Integration with SEOSONA OS

- **Brand context file:** `3_MEMORY/specs/brand_guidelines.md` (fill template)
- **Auto-injection:** `scripts/connectors/brand_context.py` reads and injects into reports
- **Content:** All `copywriting` and `email_marketing` tasks read brand context first
- **Consistency:** Run brand audit before major campaign launches
