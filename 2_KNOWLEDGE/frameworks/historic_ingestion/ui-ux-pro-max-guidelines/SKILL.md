---

name: "ui-ux-pro-max-guidelines"
description: "This document synthesizes knowledge from `taste-skill` and `ui-ux-pro-max-skill`."
keywords: ["ui-ux-pro-max-guidelines", "ingested"]
mcp_compatible: true
---

# UI/UX Pro Max Guidelines & Taste Skill

This document synthesizes knowledge from `taste-skill` and `ui-ux-pro-max-skill`.

## 1. Design Principles

- **Golden Spacing:** All spacing (margins, padding, gaps) must be a multiple of 4 or 8 (e.g., 8px, 16px, 24px, 32px, 64px). Arbitrary values like 15px or 21px are strictly prohibited.
- **Visual Hierarchy:** Users must instantly distinguish between primary headings (H1/H2), body text, and Call-to-Action (CTA) elements at a glance (Squint Test). Control hierarchy through weight and color, not just massive scale.
- **Grid System:** Always utilize a 12-column grid for Desktop environments. For Mobile, reflow into a 1- or 2-column layout.

## 2. Typography Mastery

- **Headings:** Must utilize a tight `line-height` (approx. 1.1 to 1.2) to maintain cohesion. Oversized H1s that "scream" are banned.
- **Body Text:** Must utilize a relaxed `line-height` (approx. 1.5 to 1.65) to ensure maximum readability for long-form content.
- **Line Length (Measure):** Never allow a single line of text to exceed 75 characters (Characters per line - CPL). Enforce maximum widths using `max-w-prose` or `max-w-2xl` in Tailwind.

## 3. Color Theory & Calibration

- **The 60-30-10 Rule:**
  - 60% Background Color (typically White, Light Gray, or Dark Navy).
  - 30% Secondary Color (used for Text, Borders, Sub-headers).
  - 10% Accent Color (used SPARINGLY for CTAs, Links, and Highlight Badges).
- **Color Calibration:** Max 1 Accent Color. Keep saturation below 80%. Ensure strict Color Consistency across the entire project.
- **No Pure Black:** Pure black `#000000` is banned. Substitute with Charcoal `#0F172A` or Dark Navy `#091338` for a softer, more premium aesthetic.
