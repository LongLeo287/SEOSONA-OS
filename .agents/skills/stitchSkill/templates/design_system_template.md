# DESIGN.md — {{App Name}}

> **Format:** awesome-design-md / Google Stitch 9-section standard
> **Usage:** Fill this template during Step 3, combining system_context.md + style_references.md + ui-ux-pro-max design intelligence.
> Save as: `projects/<project-name>/DESIGN.md`
> This content is injected as PART 1 of every screen prompt for visual consistency.
> Coding agents: follow this file for ALL styling decisions. Do not use colors, fonts, or spacing not defined here.

---

## 1 Visual Theme & Atmosphere

<!-- High-level brand identity and design philosophy -->

- **Mood:** <!-- e.g., "Minimalist and precise", "Warm and approachable", "Bold and energetic" -->
- **Visual Density:** <!-- e.g., "Spacious — generous whitespace", "Compact — information-dense" -->
- **Design Philosophy:** <!-- e.g., "Form follows function. Every pixel earns its place." -->
- **Personality:** <!-- e.g., "Professional but friendly", "Technical and precise" -->
- **Overall Feel:** <!-- e.g., "Modern SaaS", "Enterprise dashboard", "Creative tool" -->

### App Identity

- **App Name:** <!-- e.g., TaskLens -->
- **Tagline:** <!-- e.g., "Insight-driven project management" -->
- **Logo:** <!-- Description or reference -->
- **Favicon:** <!-- Description -->

---

## 2 Color Palette & Roles

<!-- Define colors using semantic roles, not just raw hex codes.
     Use ui-ux-pro-max recommendations for palette harmony. -->

### Theme Mode
- **Mode:** <!-- Light / Dark / Both -->

### Light Mode Surface Tokens

| Token | Hex | Usage |
|---|---|---|
| `background` | `#` | Page background |
| `surface` | `#` | Cards, panels, modals |
| `surface-raised` | `#` | Elevated cards, popovers |
| `border` | `#` | Dividers, input borders |
| `border-subtle` | `#` | Secondary borders |

### Dark Mode Surface Tokens

| Token | Hex | Usage |
|---|---|---|
| `background` | `#` | Page background |
| `surface` | `#` | Cards, panels, modals |
| `surface-raised` | `#` | Elevated cards, popovers |
| `border` | `#` | Dividers, input borders |
| `border-subtle` | `#` | Secondary borders |

### Brand & Accent Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#` | Buttons, active states, links |
| `primary-hover` | `#` | Hover states for primary elements |
| `primary-subtle` | `#` | Backgrounds, badges, highlights |
| `secondary` | `#` | Secondary actions, alternative accent |
| `accent` | `#` | Special highlights, decorative |

### Text Colors

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#` | Headings, body text |
| `text-secondary` | `#` | Labels, descriptions |
| `text-muted` | `#` | Placeholders, disabled text |
| `text-inverse` | `#` | Text on primary-colored backgrounds |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `success` | `#` | Positive states, completed |
| `warning` | `#` | Caution, attention needed |
| `error` | `#` | Error states, destructive |
| `info` | `#` | Informational, neutral |

---

## 3 Typography Rules

<!-- Define the font system and text hierarchy.
     All sizes use rem or px. Include Google Fonts import if applicable. -->

- **Font Import:** <!-- e.g., `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')` -->

### Type Scale

| Role | Font Family | Size | Weight | Line Height | Letter Spacing | Color Token |
|---|---|---|---|---|---|---|
| Display | | 36px | Bold (700) | 1.2 | -0.02em | `text-primary` |
| H1 | | 28px | Bold (700) | 1.3 | -0.01em | `text-primary` |
| H2 | | 22px | Semibold (600) | 1.35 | 0 | `text-primary` |
| H3 | | 18px | Semibold (600) | 1.4 | 0 | `text-primary` |
| H4 | | 16px | Medium (500) | 1.4 | 0 | `text-primary` |
| Body | | 14px | Regular (400) | 1.5 | 0 | `text-primary` |
| Body Small | | 13px | Regular (400) | 1.5 | 0 | `text-secondary` |
| Caption | | 12px | Regular (400) | 1.4 | 0.01em | `text-secondary` |
| Overline | | 11px | Medium (500) | 1.5 | 0.08em | `text-muted` |
| Code | | 13px | Regular (400) | 1.5 | 0 | `text-primary` |

---

## 4 Component Stylings

<!-- Specific rules for UI elements, including state-based styling. -->

### Buttons

| Variant | Background | Text | Border | Radius | Padding | Hover | Disabled |
|---|---|---|---|---|---|---|---|
| Primary | `primary` | `text-inverse` | None | | `8px 16px` | `primary-hover` | 50% opacity |
| Secondary | Transparent | `primary` | 1px `primary` | | `8px 16px` | `primary-subtle` bg | 50% opacity |
| Ghost | Transparent | `text-secondary` | None | | `8px 16px` | `surface` bg | 50% opacity |
| Danger | `error` | `text-inverse` | None | | `8px 16px` | Darken 10% | 50% opacity |

### Cards

| Property | Value |
|---|---|
| Background | `surface` |
| Border | 1px `border-subtle` |
| Border Radius | |
| Shadow | |
| Padding | |
| Hover | <!-- e.g., "Slight shadow increase" or "Border color change" --> |

### Inputs & Forms

| Property | Value |
|---|---|
| Height | <!-- e.g., 40px --> |
| Background | `surface` |
| Border | 1px `border` |
| Border Radius | |
| Focus | `primary` border + subtle glow |
| Error | `error` border + message below |
| Label Position | Above input |

### Tables

| Property | Value |
|---|---|
| Header Background | <!-- e.g., `surface-raised` --> |
| Header Text | Bold, `text-secondary` |
| Row Hover | <!-- e.g., `surface-raised` background --> |
| Row Border | Horizontal dividers only |
| Row Alternating | <!-- e.g., Subtle alternating background --> |
| Cell Padding | <!-- e.g., 12px 16px --> |

### Navigation

> ⚠️ **CRITICAL**: Navigation is FIXED across ALL screens. Every screen prompt must include this exact structure.

#### Sidebar (Left)

| Group | Item | Icon | Target Screen |
|---|---|---|---|
| Main | Dashboard | 📊 | S01 |
| Main | Tasks | ✅ | S04 |
| | | | |
| Settings | Settings | ⚙️ | S10 |

- **Width:** <!-- e.g., 260px expanded / 60px collapsed -->
- **Background:** <!-- e.g., `surface` -->
- **Active Item:** <!-- e.g., `primary-subtle` background + `primary` text -->

#### Top Bar

| Element | Position | Description |
|---|---|---|
| App Logo | Left | Logo + app name |
| Search | Center | Global search bar |
| Notifications | Right | Bell icon with badge |
| User Avatar | Right | Profile dropdown |

- **Height:** <!-- e.g., 56px -->
- **Background:** <!-- e.g., `background` -->
- **Border Bottom:** <!-- e.g., 1px `border-subtle` -->

### Badges / Tags

| Property | Value |
|---|---|
| Border Radius | <!-- e.g., 16px (pill) --> |
| Padding | <!-- e.g., 2px 8px --> |
| Font Size | Caption |
| Colors | Semantic tokens per status |

### Iconography

- **Icon Set:** <!-- e.g., Lucide, Material Icons, Heroicons -->
- **Default Size:** <!-- e.g., 20px -->
- **Color:** Matches text color of context
- **Stroke Width:** <!-- if applicable, e.g., 1.5px -->

---

## 5 Layout Principles

<!-- Define the "rhythm" of the interface — spacing, grid, containers. -->

### Grid System

| Property | Value |
|---|---|
| Container Max Width | <!-- e.g., 1440px --> |
| Grid Columns | <!-- e.g., 12-column --> |
| Grid Gap | <!-- e.g., 16px --> |
| Content Area Padding | <!-- e.g., 24px --> |

### Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px | Inline spacing, icon gaps |
| `space-sm` | 8px | Between related elements |
| `space-md` | 16px | Between sections |
| `space-lg` | 24px | Between major blocks |
| `space-xl` | 32px | Page margins |
| `space-2xl` | 48px | Major separations |
| `space-3xl` | 64px | Hero/section spacing |

### Whitespace Philosophy

<!-- e.g., "Generous whitespace between sections. Content breathes." -->

---

## 6 Depth & Elevation

<!-- Define how hierarchy is communicated visually. -->

### Shadows

| Level | Value | Usage |
|---|---|---|
| None (Level 0) | `none` | Flat elements, inline content |
| Low (Level 1) | `0 1px 3px rgba(0,0,0,0.08)` | Cards, dropdowns |
| Medium (Level 2) | `0 4px 12px rgba(0,0,0,0.12)` | Popovers, floating elements |
| High (Level 3) | `0 8px 24px rgba(0,0,0,0.16)` | Modals, overlays |

### Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Tags, badges |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, panels |
| `radius-xl` | 16px | Modals, large containers |
| `radius-full` | 9999px | Avatars, pills |

### Z-Index Scale

| Layer | Value | Usage |
|---|---|---|
| Base | 0 | Default stacking |
| Sticky | 10 | Sticky headers |
| Dropdown | 20 | Dropdowns, menus |
| Overlay | 30 | Overlays, backdrops |
| Modal | 40 | Modal dialogs |
| Toast | 50 | Notifications, toasts |

---

## 7 Do's and Don'ts

<!-- Essential design guardrails to prevent AI hallucinations. -->

### ✅ Do

- <!-- e.g., "Use consistent spacing from the spacing scale" -->
- <!-- e.g., "Apply semantic color tokens — never hardcode hex in components" -->
- <!-- e.g., "Maintain the exact navigation structure from Section 4" -->
- <!-- e.g., "Use the defined type scale — no arbitrary font sizes" -->
- <!-- e.g., "Include hover/focus states for all interactive elements" -->

### ❌ Don't

- <!-- e.g., "Don't use colors not defined in the palette" -->
- <!-- e.g., "Don't change sidebar width or navigation order" -->
- <!-- e.g., "Don't use inline styles for colors or spacing" -->
- <!-- e.g., "Don't skip empty states or loading states" -->
- <!-- e.g., "Don't use more than 2 font families" -->

---

## 8 Responsive Behavior

<!-- Define how the interface adapts across screen sizes. -->

### Breakpoints

| Name | Width | Behavior |
|---|---|---|
| Mobile | < 640px | Single column, sidebar collapses to bottom nav, full-width cards |
| Tablet | 640px–1024px | 2-column grid, sidebar collapses to hamburger |
| Desktop | 1024px–1440px | Full layout, sidebar visible |
| Wide | > 1440px | Centered container, max-width enforced |

### Touch Targets

- **Minimum size:** 44×44px for mobile
- **Spacing between:** At least 8px

### Adaptation Strategy

- <!-- e.g., "Tables → card list on mobile" -->
- <!-- e.g., "Multi-column → stacked on tablet" -->
- <!-- e.g., "Sidebar → hamburger on tablet, bottom nav on mobile" -->

---

## 9 Agent Prompt Guide

<!-- Quick reference cheat sheet for AI agents using this DESIGN.md. -->

### How to Use This File

1. **Before generating ANY screen**: Load this entire DESIGN.md as context
2. **Color usage**: Reference tokens from Section 2, never hardcode values
3. **Typography**: Follow the type scale in Section 3 exactly
4. **Components**: Use styling rules from Section 4 for all UI elements
5. **Spacing**: Use only the spacing scale from Section 5
6. **Navigation**: Always include the fixed navigation from Section 4 on every screen
7. **Responsiveness**: Apply breakpoints from Section 8

### Sample Prompt Snippet

```
Build [Screen Name] following the DESIGN.md exactly:
- Use color tokens from Section 2 (e.g., `primary` for CTAs, `surface` for cards)
- Apply typography scale from Section 3 (H1 for page title, Body for content)
- Include the fixed sidebar + top bar navigation from Section 4
- Use spacing scale from Section 5 (space-lg between major sections)
- Apply shadow Level 1 for cards (Section 6)
```

### Sample Data (Cross-Screen Consistency)

> Use these names/values consistently across ALL screen prompts.

#### Users

| Name | Role | Avatar Initial |
|---|---|---|
| | | |

#### Projects / Items

| Name | Status | Key Metric |
|---|---|---|
| | | |

#### Dates

- Current date shown: <!-- e.g., March 15, 2026 -->
- Date range: <!-- e.g., Q1 2026 -->
