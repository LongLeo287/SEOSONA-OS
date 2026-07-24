# Screen Prompt Template

> **Usage:** Create one prompt file per screen during Step 4.
> Save as: `projects/<project-name>/prompts/SXX_screen_name.md`
> Each prompt is sent directly to Stitch's `generate_screen_from_text` API.

---

## Prompt Structure

The final prompt sent to Stitch should combine all 3 parts below into a single coherent prompt. Adjust wording so it reads naturally — do NOT include the section headers or template markers.

---

### PART 1: Design System Context
<!-- Copy the relevant design system rules. Keep it concise but sufficient for Stitch to maintain consistency. -->

```
Design a desktop web application screen with the following design system:

**Colors:**
- Primary: [hex] (buttons, active states)
- Background: [hex], Surface/Cards: [hex]
- Text: [hex] primary, [hex] secondary
- Semantic: Success [hex], Warning [hex], Error [hex], Info [hex]

**Typography:** [Font family], sizes: H1 28px, H2 22px, Body 14px, Caption 12px
**Border radius:** Cards 12px, Buttons 8px, Inputs 8px
**Icons:** [Icon set] style

**Navigation (present on ALL screens):**
- Left sidebar (260px wide, [background color]):
  - [Logo] at top
  - Menu items:
    - [Icon] Dashboard (→ S01)
    - [Icon] Tasks (→ S04) ← **[HIGHLIGHT if this is current screen]**
    - [Icon] Reports (→ S07)
    - ...
  - User profile at bottom
- Top bar: [Search bar] center, [Notifications bell] right, [User avatar] right
```

---

### PART 2: Screen Map Context
<!-- Position this screen within the overall application -->

```
This application has [N] total screens. This is screen [X]/[N]: "[Screen Name]".

Navigation context:
- Previous screen: S[XX] [Name] (user came from [action])
- This screen is part of: [Journey Name]
- The sidebar item "[Menu Item]" should be highlighted/active

Other screens in this journey:
- S[XX] [Name] → S[XX] [Name] → **[This Screen]** → S[XX] [Name]
```

---

### PART 3: Screen Content
<!-- Detailed layout and content for this specific screen -->

```
## Screen: [Screen Name]

### Layout Structure
<!-- Describe the page layout top-to-bottom, left-to-right -->

**Header Section:**
- Page title: "[Title]"
- Breadcrumb: Home > [Parent] > [Current]
- Action buttons: [Button 1], [Button 2]

**Content Area:**

[Describe each section/component in detail]

**Section 1: [Name]**
- Component type: [Card / Table / Chart / Form / etc.]
- Content: [Describe what's inside]
- Data: [Use sample data from design system]
- States: [Default / Empty / Loading / Error]

**Section 2: [Name]**
- ...

### Interactions
<!-- Key interactive elements and their behavior -->
- Clicking [element] → [what happens]
- Hovering [element] → [visual feedback]
- [Filter/Sort] controls → [behavior]

### Sample Data
<!-- Specific data to show on this screen, consistent with other screens -->
| Column 1 | Column 2 | Column 3 |
|---|---|---|
| [data] | [data] | [data] |
```

---

## Assembly Instructions

When building the actual prompt to send to Stitch:

1. **Merge** all 3 parts into a single natural-language prompt
2. **Remove** section headers like "PART 1", "PART 2", "PART 3"
3. **Be specific** about layout — describe exact positioning and sizing
4. **Include realistic data** — not "lorem ipsum"
5. **Highlight active nav item** — sidebar/topbar must reflect current screen
6. **Keep it under ~2000 words** — Stitch works best with focused prompts
7. **Specify device type** — match the project target (Desktop/Mobile/Tablet)

---

## Example Final Prompt

> Design a desktop web application screen: **"Task Board"** (screen 5 of 12).
>
> **Design System:** Use a modern dark theme with primary color #6366F1 (indigo), background #0F172A, surface #1E293B, text #F8FAFC. Font: Inter. Cards have 12px border radius. Icons: Lucide style.
>
> **Navigation:** Left sidebar (260px, #1E293B background) with logo "TaskLens" at top, menu items: Dashboard, **Tasks (active/highlighted)**, Reports, Team, Settings. User avatar at bottom. Top bar: search center, notification bell with red dot, user avatar right.
>
> **Layout:** This is a Kanban-style task board with 4 columns: "To Do" (3 cards), "In Progress" (2 cards), "In Review" (1 card), "Done" (4 cards). Each column header shows count badge. Each task card shows: task title, assignee avatar, priority tag (🔴 High, 🟡 Medium, 🟢 Low), due date, and comment count icon. Top of page: "Task Board" title with breadcrumb "Home > Tasks > Board View", filter bar (assignee, priority, date range), and "+ New Task" primary button.
>
> **Sample Data:** Tasks like "Redesign login flow" (High, Alex M., Mar 18), "API rate limiting" (Medium, Sarah K., Mar 20), "Update docs" (Low, Mike R., Mar 22).
