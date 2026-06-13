# Seline Analytics Design System (Refero Template)

**Source:** https://styles.refero.design/style/7967c6d9-e50c-42b5-b4d1-74003ba41781

This document serves as the standard template for creating a `DESIGN.md` file for any web project in SEOSONA OS. It structures Design Tokens, CSS Variables, and Tailwind v4 configurations based on the premium "Seline Analytics" methodology.

---

## 1. Design Thesis (Visual Direction)
**Description:** Sunlit data observatory on warm paper — a cream canvas where one blue signal is the only color allowed to speak.
**Core Principle:** The palette is intentionally 96% grayscale warm-stone. The only chromatic voice is a sky blue (`#3ba6f1`) used for chart bars, CTA fills, icon strokes, and links.

## 2. Design Tokens (Colors)

### Brand Colors
- **Signal Blue (`#3ba6f1`):** Action color for filled buttons, selected navigation states, and focused conversion moments.
- **Highlight Wash (`#c1e1f7`):** Gray wash for highlight backgrounds, decorative bands, and soft emphasis. Do not use as primary CTA.

### Neutral Colors
- **Stone Ink (`#0c0a09`):** Primary headings and body text — near-black with a warm undertone (Never pure #000).
- **Stone Charcoal (`#1c1917`):** Secondary button fill, dark accent surfaces.
- **Warm Slate (`#78716c`):** Secondary body text, helper text, subtle labels.
- **Soft Slate (`#a8a29e`):** Tertiary text, muted captions.
- **Mist Gray (`#afafae`):** Decorative icon fills, placeholder strokes.
- **Heading Mute (`#c9c5c2`):** Placeholder headlines, disabled heading text.
- **Warm Border (`#d6d3d1`):** Secondary borders (input fields, section dividers).
- **Fog Border (`#e1dfdd`):** Navigation borders, subtle dividers.
- **Pearl Border (`#e5e7eb`):** Primary 1px hairlines (card borders, dividers, button outlines).
- **Canvas Cream (`#fafaf9`):** Page background (stone-50) to avoid feeling clinical.
- **Pure White (`#ffffff`):** Card surfaces, elevated panels.

## 3. Typography
- **Primary/Display Font:** `Roobert` (Geometric Humanist). Used for headlines. Pulled tight to negative tracking (e.g., `-0.021em`) so headlines read as compact confident statements.
- **Body Font:** `Inter` (Geometric Humanist). Used for body text and UI elements.
- **Type Scale:** Major Second (1.125) from 16px base.

## 4. CSS Variables Template

```css
@theme inline {
  /* Brand Colors */
  --color-signal-blue: #3ba6f1;
  --color-highlight-wash: #c1e1f7;

  /* Neutral Colors */
  --color-stone-ink: #0c0a09;
  --color-stone-charcoal: #1c1917;
  --color-warm-slate: #78716c;
  --color-soft-slate: #a8a29e;
  --color-mist-gray: #afafae;
  --color-heading-mute: #c9c5c2;
  --color-warm-border: #d6d3d1;
  --color-fog-border: #e1dfdd;
  --color-pearl-border: #e5e7eb;
  --color-canvas-cream: #fafaf9;
  --color-pure-white: #ffffff;

  /* Semantic Mapping */
  --color-bg-primary: var(--color-canvas-cream);
  --color-bg-secondary: var(--color-pure-white);
  --color-text-primary: var(--color-stone-ink);
  --color-text-secondary: var(--color-warm-slate);
  --color-border-primary: var(--color-pearl-border);
  --color-brand-primary: var(--color-signal-blue);

  /* Fonts */
  --font-display: "Roobert", sans-serif;
  --font-body: "Inter", sans-serif;
}
```

## 5. Tailwind v4 Configuration Template
*Note: In Tailwind CSS v4, the `tailwind.config.js` is largely replaced by standard CSS variables using `@theme` as shown above. However, if using legacy configurations:*

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3ba6f1',
          wash: '#c1e1f7',
        },
        stone: {
          ink: '#0c0a09',
          charcoal: '#1c1917',
          slate: '#78716c',
          soft: '#a8a29e',
          mist: '#afafae',
          mute: '#c9c5c2',
        },
        border: {
          warm: '#d6d3d1',
          fog: '#e1dfdd',
          pearl: '#e5e7eb',
        },
        surface: {
          cream: '#fafaf9',
          white: '#ffffff',
        }
      },
      fontFamily: {
        display: ['Roobert', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.025em',
        tight: '-0.021em',
      }
    }
  }
}
```

## 6. Micro-Interactions & Components
- **Buttons:** Pill buttons (`rounded-full` or 9999px radius).
- **Borders:** Thin 1px stone borders.
- **Shadows:** Avoided entirely except for the product-preview card. The page should sit on its surface like printed material on paper, not a glassmorphic dashboard.
