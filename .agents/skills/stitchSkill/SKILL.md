---
name: stitch-wireframe-generator
description: AI-Powered Wireframe Generation via Google Stitch. Reads software description docs → plans all screens → crafts high-quality prompts → generates wireframes via Stitch MCP or direct API script. Supports interactive and batch modes.
---

# Stitch Wireframe Generator

> Automated wireframe pipeline: Read docs → Plan screens → Build DESIGN.md → Build prompts → Generate via Stitch.

## 🔗 Dependencies

| Skill | Purpose | When Used |
|---|---|---|
| `ui-ux-pro-max` | Design intelligence — color theory, visual hierarchy, UX patterns | Step 3a — provides expert design recommendations before building DESIGN.md |

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the current step!**

| File | Description | When to Read |
|------|-------------|--------------|
| `templates/system_context_template.md` | System context extraction template | Step 1 — Reading docs |
| `templates/screen_map_template.md` | Screen map structure template | Step 2 — Identifying screens |
| `templates/design_system_template.md` | DESIGN.md 9-section template (awesome-design-md format) | Step 3 — Building DESIGN.md |
| `templates/screen_prompt_template.md` | Per-screen prompt template | Step 4 — Building prompts |
| `templates/generation_log_template.md` | Generation log template | Step 6 — Drawing screens |
| `scripts/setup_auth.ps1` | One-time ADC authentication | First-time setup only |
| `scripts/setup_project.js` | Create/list Stitch projects | Step 5 — Mode B (API) |
| `scripts/batch_generate.js` | Batch screen generation | Step 6 — Mode B (API) |
| `examples/tasklens_design_system.md` | Example design system | Reference for Step 3 |
| `examples/tasklens_screen_prompts.md` | Example screen prompts | Reference for Step 4 |

---

## 🔀 Dual Execution Modes

| | Mode A — Stitch MCP | Mode B — Direct API Script |
|---|---|---|
| **Mechanism** | AI calls MCP tools (`generate_screen_from_text`, `edit_screens`, etc.) | Node.js calls `stitch.googleapis.com` REST API |
| **Auth** | Google ADC (auto) | Reuses same ADC credentials |
| **Strengths** | AI reviews each screen, flexible edits | Batch processing, retry, parallel, auto-logging |
| **When to use** | < 10 screens, needs review | ≥ 10 screens, batch generation |

---

## 🔐 Authentication

The skill uses Google Application Default Credentials (ADC).

- File: `application_default_credentials.json` containing `client_id`, `client_secret`, `refresh_token`
- **Cannot** reuse Antigravity's login (different OAuth scope)
- Run `scripts/setup_auth.ps1` **once** — opens browser for Google login → token auto-refreshes indefinitely
- Verify: `gcloud auth application-default print-access-token`

---

## 💬 Interaction Rules — Question Pacing

> **CRITICAL**: These rules apply to ALL steps. Never dump a wall of questions at the user.

### Pacing

| Question Type | Per Turn | Example |
|---|---|---|
| **Complex / long** (needs thought, multiple choices, or review of a list) | **1 only** | "Here are the proposed actors — do you agree?" |
| **Small / quick** (yes/no, pick one, short preference) | **Up to 3** | "1) Dark or light theme? 2) Preferred font? 3) Include a sidebar?" |

### Progressive Disclosure

**Never present everything at once.** Build understanding layer by layer:

1. **Ask → Confirm → Build next layer** — get user approval on one concept before introducing the next
2. **Actors → Journeys → Screens** — don't show screens until the user understands the journeys those screens belong to
3. **Design system → Navigation → Layout details** — establish the big picture before diving into specifics

This ensures the user always understands the "why" behind each layer before seeing the "what".

---

## 📋 8-Step Pipeline

> **All output** is stored at `stitchSkill/projects/<project-name>/`

### Step 1 — Read Documentation & Collect References

**1a. Read & analyze description documents:**
- Read ALL description files (markdown, docx, txt, etc.)
- Extract: objectives, user roles, features, data entities, business rules, domain terminology
- Use `templates/system_context_template.md` as structure guide
- → Save output: `projects/<name>/system_context.md`

**1b. Ask user for reference materials:**

> Proactively ask the user:
>
> *"Do you have any reference materials? For example:"*
> 1. 🖼️ **Screenshots / mockups** of similar apps for inspiration
> 2. 🎨 **Style guide / brand guidelines** (logo, colors, fonts)
> 3. 🌐 **Website/app URLs** whose style you like
> 4. 📝 **Style notes** (e.g., "dark theme, corporate, minimal")
> 5. 📄 **Any other documents** (old wireframes, Figma links, PDFs…)

Process provided materials:
- **Screenshots** → Analyze color palette, layout patterns, component styles → inject into design system
- **URLs** → Use browser tool to capture & analyze visual style
- **Brand guide** → Extract colors, fonts, logo rules
- **Text notes** → Record preferences

→ Save output: `projects/<name>/style_references.md`

---

### Step 2 — Identify ALL Screens (Screen Map)

> ⚠️ **Progressive Disclosure**: This step has 4 sequential sub-steps. Each requires user approval before proceeding to the next.

**2a. Propose Users/Actors** *(ask ONLY this first)*

Based on `system_context.md`, propose ONLY the actors. Do NOT mention journeys or screens yet.

```markdown
## Proposed Users/Actors

From the documentation, I identified these user groups:

| # | Actor | Description | Usage Frequency |
|---|---|---|---|
| 1 | [Actor Name] | [Role description] | [Daily/Weekly/Monthly/As needed] |
| 2 | ... | ... | ... |

> 💬 Do you agree with these actors?
> You can: add, remove, or adjust any of them.
```

**Wait for user approval before continuing.**

---

**2b. Propose Journeys per Actor** *(only after actors are approved)*

For each approved actor, propose their journeys. Present **one actor at a time** if there are many (≥4 actors), or all at once if few (≤3 actors).

```markdown
## Proposed Journeys for: [Actor Name]

Based on their role, I recommend these journeys:

| # | Journey | Purpose | Key Actions |
|---|---|---|---|
| 1 | Dashboard Analytics | View KPIs and trends | Browse, filter, drill-down |
| 2 | Task Management | Track and manage work | Create, assign, update |
| 3 | Report Generation | Generate periodic reports | Configure, preview, export |

> 💬 Do these journeys make sense for [Actor Name]?
> You can: add journeys, remove, or adjust.
```

**Wait for user approval before continuing.**

---

**2c. Bind Screens to Journeys** *(only after journeys are approved)*

For each approved journey, propose the specific screens. This makes it clear **why** each screen exists.

```markdown
## Screens for Journey: "Dashboard Analytics" (Actor: Analyst)

This journey needs the following screens:

| # | Screen ID | Screen Name | Purpose in Journey | User visits when... |
|---|---|---|---|---|
| 1 | S01 | Dashboard Overview | Entry point, KPI summary | Opening the app |
| 2 | S02 | Drill-down Detail | Deep-dive into metrics | Clicking a KPI card |
| 3 | S03 | Export View | Download/share data | Clicking "Export" |

> 💬 Are these screens sufficient for this journey?
> You can: add screens, remove, rename, or adjust.
```

Present **one journey at a time** for complex journeys (≥4 screens), or batch **2-3 short journeys** for simpler ones.

**Wait for user approval before continuing.**

---

**2d. Compile Complete Screen Map** *(only after all screens are approved)*

- Use `templates/screen_map_template.md` as guide
- Number all screens (S01, S02, ...) across all journeys
- Group by approved journeys — each screen shows which journey it belongs to
- Include flow diagram (mermaid)
- Include navigation mapping (which screen links to which)
- Present the compiled map for **final review**
- → Save output: `projects/<name>/screen_map.md`

**Journey Reference Library** — Consult when proposing journeys in 2b:

| Category | Journey Types |
|---|---|
| Core Navigation | Authentication, Onboarding, Home/Landing |
| Data Browsing | List→Detail→Edit, Search & Filter, Import/Export, Bulk Ops |
| Analytics | Dashboard, Drill-down, Report Builder, Visualization, Cross-period |
| Workflow | Tasks, Approvals, Multi-step, Alerts, Calendar |
| Communication | Messaging, Comments, File Sharing |
| User Management | Profile, Organization, User Admin, Roles & Permissions |
| System Admin | Settings, Configuration, Audit & Logs |
| E-commerce | Catalog, Cart & Checkout, Orders |
| Content | Editing, Publishing, Templates |
| Map & Location | Map View, Asset Tracking |
| Monitoring | System Monitoring, Incidents |
| Edge Cases | Empty States, Error States, Help & Support |

---

### Step 3 — Build DESIGN.md (awesome-design-md 9-Section Format)

> ⚠️ **Progressive Disclosure**: Build layer by layer, confirm each before proceeding.
> **Output format:** awesome-design-md / Google Stitch 9-section standard.
> **Output file:** `DESIGN.md` (replaces the legacy `design_system.md`).

**3a. Design Intelligence via ui-ux-pro-max** *(first — before any design decisions)*
- **Load** the `ui-ux-pro-max` skill (if not already loaded)
- Analyze `system_context.md` + `style_references.md` through ui-ux-pro-max
- Request design recommendations:
  - Color palette with semantic roles (primary, secondary, semantic, surface tokens)
  - Typography system (font family, type scale, hierarchy)
  - Visual theme and atmosphere (mood, density, personality)
  - Component styling patterns (buttons, cards, inputs)
- Present ui-ux-pro-max recommendations to user for approval
- Wait for approval before proceeding

**3b. Typography & Navigation** *(after palette approved)*
- Using approved palette, propose font system + type scale
- Define navigation structure (sidebar items + icons, topbar elements)
- This is critical — navigation is FIXED across all screens
- Present proposal with the 9 typography roles from the template
- Wait for approval

**3c. Components & Layout** *(after nav approved)*
- Propose component styles using approved palette: buttons, cards, inputs, tables
- Define layout grid, spacing scale, depth tokens (shadows, radius)
- Define sample data (user names, project names used across screens)
- Propose Do's and Don'ts guardrails + responsive breakpoints
- Wait for approval

**3d. Compile DESIGN.md** *(after all approvals)*
- Read `templates/design_system_template.md` (the 9-section template)
- Optionally reference `examples/tasklens_design_system.md`
- Fill ALL 9 sections with approved design decisions:
  1. Visual Theme & Atmosphere
  2. Color Palette & Roles
  3. Typography Rules
  4. Component Stylings
  5. Layout Principles
  6. Depth & Elevation
  7. Do's and Don'ts
  8. Responsive Behavior
  9. Agent Prompt Guide
- → Save output: `projects/<name>/DESIGN.md`

---

### Step 4 — Build Detailed Prompts for Each Screen

- Read `templates/screen_prompt_template.md`
- Optionally reference `examples/tasklens_screen_prompts.md`
- Each prompt file contains **3 mandatory parts**:

```
┌─────────────────────────────────────────────┐
│  PART 1: DESIGN.md (from Step 3)             │
│  → Ensures color, font, nav consistency     │
├─────────────────────────────────────────────┤
│  PART 2: SCREEN MAP CONTEXT                 │
│  → Summarizes all screens + current position│
│  → "This is screen 3/12: Alerts Console"    │
│  → Sidebar must highlight correct menu item │
├─────────────────────────────────────────────┤
│  PART 3: SCREEN CONTENT                     │
│  → Detailed layout for this screen          │
│  → Sample data (consistent cross-screen)    │
│  → Sections, interactions, states           │
└─────────────────────────────────────────────┘
```

- → Save output: `projects/<name>/prompts/SXX_screen_name.md` (one per screen)

---

### Step 5 — Select Stitch Project & Drawing Mode

**5a. Select project:**
- Call `list_projects` (MCP) → display projects to user
- Ask user to **choose existing** or **create new** project
- If creating new: call `create_project` with appropriate title

**5b. Ask user for drawing mode — with recommended default:**

Based on the screen count from Step 2, recommend a default:

> *"You have [N] screens. I recommend **[default mode]**. Here are your options:"*
>
> | Mode | Best For | How It Works |
> |---|---|---|
> | **A. Interactive (MCP)** | < 10 screens, want to review each | AI draws via Stitch MCP → you review each → edit → next |
> | **B. Script (API batch)** | ≥ 10 screens, batch processing | Node.js script generates all screens automatically |
>
> *"Shall I proceed with **[default]**?"*

| Screen Count | Default Recommendation |
|---|---|
| < 10 screens | **Mode A — Interactive** |
| ≥ 10 screens | **Mode B — Script batch** |

**Auto-proceed:** If the user says "ok", "yes", "go ahead", or similar → proceed immediately with the recommended default. No need to re-confirm.

---

### Step 6 — Draw Screens in Journey Order

**Mode A — Stitch MCP (Interactive/Auto-feed):**
1. For each screen in journey order:
   - Read the prompt from `projects/<name>/prompts/SXX_*.md`
   - Call `generate_screen_from_text` with `projectId` and `prompt`
   - Set `deviceType` based on user preference (default: `DESKTOP`)
   - Log result ID to `projects/<name>/generation_log.md`
2. **Interactive mode**: After each screen, present result and ask for feedback
   - If edits needed → call `edit_screens` with feedback
3. **Auto-feed mode**: Generate all screens sequentially, log results

**Mode B — API Script:**
1. Ensure ADC is set up: `scripts/setup_auth.ps1`
2. Run: `node scripts/batch_generate.js --project <id> --prompts-dir projects/<name>/prompts/`
3. Script handles retry, parallel execution, logging

Use `templates/generation_log_template.md` for logging format.

---

### Step 7 — Review & Edit

1. Call `list_screens` to see all generated screens
2. Overall review for consistency (navigation, colors, data)
3. Fix issues with `edit_screens` providing specific feedback
4. Generate variants with `generate_variants` if exploring alternatives
5. Update `generation_log.md` with all changes

---

### Step 8 — Export & Report

Create final report:
- → Save output: `projects/<name>/wireframe_report.md`
- Include: total screens, generation stats, review notes, screen references
- Link to Stitch project for design handoff

---

## 📁 File Structure

```
stitchSkill/
├── SKILL.md                          # This file (8-step pipeline)
├── implementation_plan.md            # Plan (Vietnamese)
├── implementation_plan_en.md         # Plan (English)
├── templates/
│   ├── system_context_template.md
│   ├── screen_map_template.md
│   ├── design_system_template.md      # DESIGN.md 9-section template (awesome-design-md format)
│   ├── screen_prompt_template.md
│   └── generation_log_template.md
├── scripts/
│   ├── setup_auth.ps1                # One-time ADC login
│   ├── setup_project.js              # Create/list projects
│   └── batch_generate.js             # Batch generation
├── examples/
│   ├── tasklens_design_system.md
│   └── tasklens_screen_prompts.md
└── projects/                         # [RUNTIME] Per-project output
    └── <project-name>/
        ├── system_context.md
        ├── style_references.md
        ├── screen_map.md
        ├── DESIGN.md                  # 9-section design system (awesome-design-md format)
        ├── prompts/
        │   ├── S01_dashboard.md
        │   └── ...
        ├── generation_log.md
        └── wireframe_report.md
```

---

## 🔧 First-Time Setup

1. Run `scripts/setup_auth.ps1` to authenticate with Google ADC
2. Verify: `gcloud auth application-default print-access-token`
3. (Optional for Mode B) Run `npm install` in `scripts/` directory

## 💡 Tips

- **Consistency is king**: The DESIGN.md (Step 3) is injected into EVERY prompt to ensure visual coherence
- **Navigation first**: Define sidebar/topbar in the design system — it stays fixed across all screens
- **Realistic data**: Use consistent sample data across screens (same user names, project names, etc.)
- **Journey order**: Generate screens in journey order so navigation flows are logical
- **Review at milestones**: After each journey group, pause to review consistency before proceeding
