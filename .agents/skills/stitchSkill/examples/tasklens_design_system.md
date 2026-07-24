# TaskLens v2 — Design System Example

> This is an example design system created for the TaskLens v2 project tracking application.
> Use as reference when building your own design system in Step 3.

---

## App Identity

- **App Name:** TaskLens v2
- **Tagline:** "Insight-driven project management"
- **Logo:** Abstract lens icon in indigo gradient
- **Favicon:** Simplified lens icon, 32×32

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|---|---|---|
| Primary | `#6366F1` | Buttons, active states, links, sidebar active |
| Primary Dark | `#4F46E5` | Hover states, pressed buttons |
| Primary Light | `#A5B4FC` | Badges, light backgrounds, tags |

### Neutral Colors (Dark Theme)
| Name | Hex | Usage |
|---|---|---|
| Background | `#0F172A` | Page background |
| Surface | `#1E293B` | Cards, sidebar, panels |
| Surface Hover | `#334155` | Hovered rows, interactive surfaces |
| Border | `#334155` | Dividers, input borders |
| Text Primary | `#F8FAFC` | Headings, body text |
| Text Secondary | `#94A3B8` | Labels, secondary info |
| Text Muted | `#64748B` | Placeholders, disabled text |

### Semantic Colors
| Name | Hex | Usage |
|---|---|---|
| Success | `#22C55E` | Completed, positive |
| Warning | `#F59E0B` | At risk, caution |
| Error | `#EF4444` | Failed, critical |
| Info | `#3B82F6` | Information, neutral |

### Theme
- **Mode:** Dark
- **Overall feel:** Modern, data-rich, professional, focused

---

## Typography

| Role | Font Family | Size | Weight | Color |
|---|---|---|---|---|
| H1 | Inter | 28px | 700 Bold | `#F8FAFC` |
| H2 | Inter | 22px | 600 Semibold | `#F8FAFC` |
| H3 | Inter | 18px | 600 Semibold | `#F8FAFC` |
| Body | Inter | 14px | 400 Regular | `#F8FAFC` |
| Caption | Inter | 12px | 400 Regular | `#94A3B8` |
| Button | Inter | 14px | 500 Medium | White |
| Code | JetBrains Mono | 13px | 400 Regular | `#A5B4FC` |

---

## Navigation Structure

### Sidebar (Left, 260px, `#1E293B` background)

| Group | Item | Icon | Target |
|---|---|---|---|
| *Top* | **TaskLens** Logo | 🔍 | — |
| Main | Dashboard | `LayoutDashboard` | S01 |
| Main | Tasks | `CheckSquare` | S04 |
| Main | Projects | `FolderKanban` | S07 |
| Main | Reports | `BarChart3` | S09 |
| Main | Team | `Users` | S11 |
| *Divider* | | | |
| System | Notifications | `Bell` | S13 |
| System | Settings | `Settings` | S14 |
| *Bottom* | User Avatar + Name | `Avatar` | Profile Dropdown |

**Active state:** Indigo background (`#6366F1` at 15% opacity), left border 3px solid `#6366F1`, text white.

### Top Bar (64px height, `#1E293B` background)

| Element | Position | Description |
|---|---|---|
| Breadcrumb | Left | Shows current path: Home > Section > Page |
| Global Search | Center | Search bar with `Cmd+K` shortcut hint |
| Notifications | Right | Bell icon with red badge (count) |
| User Avatar | Right | Circle avatar with dropdown menu |

---

## Layout Grid

- **Sidebar width:** 260px (collapsed: 64px)
- **Content area padding:** 24px
- **Card padding:** 20px
- **Grid:** 12-column, 16px gap
- **Max content width:** 1440px

---

## Component Patterns

### Cards
- Background: `#1E293B`
- Border: 1px solid `#334155`
- Border radius: 12px
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.3)`
- Padding: 20px

### Buttons
| Variant | Background | Text | Border Radius |
|---|---|---|---|
| Primary | `#6366F1` | White | 8px |
| Secondary | Transparent | `#6366F1` | 8px (1px border) |
| Ghost | Transparent | `#94A3B8` | 8px |
| Danger | `#EF4444` | White | 8px |

### Tables
- Header: `#1E293B`, text `#94A3B8`, font 12px uppercase
- Rows: Transparent, hover `#334155`
- Borders: 1px bottom `#334155`
- Row height: 52px

### Badges / Tags
| Type | Background | Text |
|---|---|---|
| Priority High | `#EF4444` at 15% | `#EF4444` |
| Priority Medium | `#F59E0B` at 15% | `#F59E0B` |
| Priority Low | `#22C55E` at 15% | `#22C55E` |
| Status Active | `#6366F1` at 15% | `#6366F1` |

### Icons
- **Set:** Lucide Icons
- **Default size:** 20px
- **Stroke width:** 1.5px
- **Color:** Inherits from text context

---

## Sample Data (Cross-Screen Consistency)

### Users
| Name | Role | Avatar |
|---|---|---|
| Alex Nguyen | Product Manager | AN |
| Sarah Kim | Lead Engineer | SK |
| Mike Rodriguez | Designer | MR |
| Lisa Chen | QA Lead | LC |
| David Park | Backend Dev | DP |

### Projects
| Name | Status | Health |
|---|---|---|
| Mobile App v3 | Active | 🟢 On Track |
| Website Redesign | Active | 🟡 At Risk |
| API Migration | Active | 🔴 Behind |
| Dashboard v2 | Planning | ⚪ Not Started |

### Date Context
- Current date: March 15, 2026
- Sprint: Sprint 12 (Mar 10 – Mar 24)
- Quarter: Q1 2026
