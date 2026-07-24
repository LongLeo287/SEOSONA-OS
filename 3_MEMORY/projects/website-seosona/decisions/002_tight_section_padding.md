# Design Decision: Tight Section Spacing (Safe Spacing)
**Date:** 2026-06-15
**Context:** The standard Tailwind padding for major sections (`py-16 lg:py-24` or `py-20 lg:py-28`) was creating too much "dead space" (safe spacing top and bottom) for card-based grid layouts, leading to a disconnected ("rời rạc") feel.

**Decision:**
1. Reduce standard section wrapper padding to **`py-6 lg:py-8`** (approx 32px on desktop).
2. Reduce heading bottom margins to **`mb-8`** (from `mb-12`).
3. Reduce CTA top margins to **`mt-8`** (from `mt-12` or `mt-16`).
4. Maintain alternating backgrounds (`bg-white` and `bg-[#F8FAFC]` or dark equivalents) so sections still visually separate clearly without needing huge whitespace gaps.

**Impact:** All sections (Trust, Ecosystem, CoreSolutions, AI, Data, Journey, Case Studies, Testimonials, FAQ, CTA) must adopt this tight padding rule.
