# TaskLens v2 — Screen Prompts Example

> This file shows 3 example screen prompts for the TaskLens v2 project.
> Each demonstrates the 3-part prompt structure (Design System + Screen Map + Content).
> Use as reference when building prompts in Step 4.

---

## S01 — Dashboard Overview

```
Design a desktop web application screen: "Dashboard Overview" (screen 1 of 14).

DESIGN SYSTEM:
Dark theme with primary color #6366F1 (indigo). Background #0F172A, surface/cards #1E293B, text #F8FAFC primary / #94A3B8 secondary. Font: Inter. Cards have 12px border radius with subtle shadow. Icons: Lucide style, 20px.

NAVIGATION:
Left sidebar (260px, #1E293B):
- TaskLens logo at top
- Menu: Dashboard (ACTIVE — highlighted with indigo left border and 15% indigo bg), Tasks, Projects, Reports, Team
- Divider
- Notifications, Settings
- User avatar "Alex Nguyen" at bottom

Top bar (64px, #1E293B): Breadcrumb "Dashboard" left, search bar center with "Cmd+K" hint, notification bell with red "3" badge right, user avatar right.

SCREEN CONTEXT:
This is the main dashboard (screen 1 of 14). It's the landing page after login. The sidebar item "Dashboard" is active.

CONTENT LAYOUT:

Header row:
- Title: "Good morning, Alex 👋"
- Subtitle: "Here's your project overview for Sprint 12"
- Right: Date "March 15, 2026" and "Sprint 12 · Day 6 of 14"

KPI Cards row (4 cards, equal width):
1. "Active Tasks" → 23 (↑ 3 from last sprint), icon: CheckSquare
2. "Completed" → 47 (this sprint), icon: CheckCircle, green accent
3. "At Risk" → 5 projects, icon: AlertTriangle, amber accent
4. "Team Velocity" → 87 pts, icon: TrendingUp, indigo accent

Main content (2 columns, 60/40 split):

Left column:
- "Project Health" card — table with 4 projects:
  | Project | Health | Progress | Lead |
  | Mobile App v3 | 🟢 On Track | 72% bar | Sarah K. |
  | Website Redesign | 🟡 At Risk | 45% bar | Mike R. |
  | API Migration | 🔴 Behind | 28% bar | David P. |
  | Dashboard v2 | ⚪ Not Started | 0% bar | Lisa C. |

Right column:
- "Recent Activity" card — timeline list (5 items):
  - "Sarah Kim completed 'Setup CI pipeline'" — 2h ago
  - "Mike Rodriguez moved 'Hero redesign' to In Review" — 3h ago
  - "Alex Nguyen commented on 'API rate limiting'" — 5h ago
  - "Lisa Chen created test plan for Sprint 12" — Yesterday
  - "David Park deployed API v2.1" — Yesterday

Bottom row:
- "Sprint Burndown" card — line chart showing ideal vs actual burndown
  - X-axis: Sprint days (1-14), Y-axis: Story points (0-120)
  - Ideal: straight line from 120 to 0
  - Actual: slightly above ideal at day 6 (showing 68 remaining vs ideal 60)
```

---

## S04 — Task Board (Kanban)

```
Design a desktop web application screen: "Task Board" (screen 4 of 14).

DESIGN SYSTEM:
Dark theme. Primary #6366F1, Background #0F172A, Surface #1E293B, Text #F8FAFC / #94A3B8. Font: Inter. Cards 12px radius. Lucide icons.

NAVIGATION:
Left sidebar (260px, #1E293B):
- TaskLens logo
- Dashboard, Tasks (ACTIVE — indigo highlight), Projects, Reports, Team
- Divider, Notifications, Settings
- "Alex Nguyen" at bottom

Top bar: Breadcrumb "Tasks > Board View", search center, notifications right, avatar right.

SCREEN CONTEXT:
Screen 4 of 14. Part of "Task Management" journey. Previous: S03 Task List. The "Tasks" sidebar item is active. View toggle shows "Board" is selected (vs "List" and "Calendar" options).

CONTENT LAYOUT:

Header row:
- Title: "Task Board"
- View toggle buttons: List | Board (ACTIVE) | Calendar
- Right side: Filter button with "Assignee, Priority, Sprint" dropdown, "+ New Task" primary button

Filter bar (if filters active):
- Chips: "Sprint: Sprint 12" (×), "Assignee: All" (×)

Kanban board — 4 columns with horizontal scroll:

Column 1: "To Do" (badge: 5)
Cards:
1. "Design notification system" — 🔴 High — Mike R. avatar — Mar 18 — 💬 3
2. "Write API docs for v2" — 🟡 Medium — David P. avatar — Mar 19 — 💬 1
3. "Set up monitoring alerts" — 🟡 Medium — Lisa C. avatar — Mar 20
4. "Review security audit" — 🔴 High — Alex N. avatar — Mar 17 — 💬 5
5. "Update onboarding flow" — 🟢 Low — Sarah K. avatar — Mar 22

Column 2: "In Progress" (badge: 3)
Cards:
1. "Implement rate limiting" — 🔴 High — David P. avatar — Mar 16 — 💬 8 — progress bar 60%
2. "Redesign profile page" — 🟡 Medium — Mike R. avatar — Mar 18 — 💬 2
3. "Add export to CSV" — 🟢 Low — Sarah K. avatar — Mar 21

Column 3: "In Review" (badge: 2)
Cards:
1. "CI/CD pipeline setup" — 🔴 High — Sarah K. avatar — Mar 15 — 💬 4
2. "Hero section redesign" — 🟡 Medium — Mike R. avatar — Mar 16 — 💬 6

Column 4: "Done" (badge: 7) — slightly muted/faded
Cards (show 3, "+4 more" link):
1. "Setup staging environment" — ✅ — David P. — Mar 12
2. "Create test fixtures" — ✅ — Lisa C. — Mar 13
3. "Database migration script" — ✅ — David P. — Mar 14

Each card: #1E293B background, 12px radius, shows title, priority badge (colored pill), assignee avatar (24px circle), due date in #94A3B8, comment icon with count. Draggable cursor on hover.
```

---

## S09 — Reports Dashboard

```
Design a desktop web application screen: "Reports Dashboard" (screen 9 of 14).

DESIGN SYSTEM:
Dark theme. Primary #6366F1, Background #0F172A, Surface #1E293B, Text #F8FAFC / #94A3B8. Font: Inter. Cards 12px radius. Lucide icons.

NAVIGATION:
Left sidebar (260px, #1E293B):
- TaskLens logo
- Dashboard, Tasks, Projects, Reports (ACTIVE — indigo highlight), Team
- Divider, Notifications, Settings
- "Alex Nguyen" at bottom

Top bar: Breadcrumb "Reports", search center, notifications right, avatar right.

SCREEN CONTEXT:
Screen 9 of 14. Part of "Analytics & Reporting" journey. The "Reports" sidebar item is active.

CONTENT LAYOUT:

Header row:
- Title: "Reports"
- Date range picker: "Mar 1 – Mar 15, 2026" with presets (This week, This month, This quarter, Custom)
- Right: "Export PDF" secondary button, "Schedule Report" primary button

Top KPI row (5 metric cards):
1. "Tasks Completed" → 47 — trend: ↑12% vs last period — mini sparkline
2. "Avg Completion Time" → 3.2 days — trend: ↓0.5 days — mini sparkline
3. "Sprint Velocity" → 87 pts — trend: ↑8% — mini sparkline
4. "Blockers Resolved" → 12 — trend: → same — mini sparkline
5. "Team Utilization" → 78% — circular progress ring

Main content (2 columns, 50/50):

Left:
- "Task Completion Trend" card — area chart
  - X-axis: Weeks (W1-W10 of 2026)
  - Y-axis: Tasks completed (0-60)
  - Two areas: "Planned" (indigo 30% opacity) and "Actual" (indigo solid)
  - Actual tracks close to planned with slight improvement trend

- "Priority Distribution" card — donut chart
  - High: 28% (red)
  - Medium: 45% (amber)
  - Low: 27% (green)
  - Center: total "142 tasks"

Right:
- "Team Performance" card — horizontal bar chart
  - Each team member: name, avatar, tasks completed bar, velocity number
  - Sarah K.: 18 tasks, 32 pts
  - David P.: 14 tasks, 28 pts
  - Mike R.: 8 tasks, 15 pts
  - Lisa C.: 7 tasks, 12 pts

- "Project Status Summary" card — stacked bar chart
  - Each project as a row
  - Segments: Done (green), In Progress (indigo), To Do (gray)
  - Mobile App v3: 72% done
  - Website Redesign: 45% done
  - API Migration: 28% done

Bottom row (full width):
- "Recent Reports" card — table
  | Report Name | Type | Generated | Generated By | Actions |
  | Sprint 11 Review | Sprint | Mar 10 | Alex N. | View · Download |
  | Q1 Progress | Quarterly | Mar 1 | Alex N. | View · Download |
  | Team Velocity | Weekly | Mar 8 | System | View · Download |
  - Each row has hover state, "View" and "Download" action links
```

---

## Usage Tips

1. **Copy-paste ready**: Each prompt block can be sent directly to `generate_screen_from_text`
2. **Consistent data**: Notice how the same users, projects, and dates appear across all prompts
3. **Active navigation**: Each prompt explicitly marks which sidebar item is ACTIVE
4. **Specific layout**: Describes exact column splits, card content, and data values
5. **~500-800 words per prompt**: Sweet spot for Stitch quality
