# Automated Plan: AI-Powered Wireframe Generation via Stitch

## Goal

Build a complete **Skill** (`stitchSkill`) that enables AI to automatically: read software description docs → plan all screens → craft high-quality prompts → **generate wireframes via Stitch MCP or direct API script**.

---

## Dual Execution Modes

| | Mode A — Stitch MCP | Mode B — Direct API Script |
|---|---|---|
| **Mechanism** | AI calls MCP tools | Node.js calls `stitch.googleapis.com` REST API |
| **Auth** | Google ADC | ✅ Reuses same ADC credentials |
| **Strengths** | AI reviews each screen, flexible edits | Batch processing, retry, parallel, auto-logging |
| **When to use** | < 10 screens, needs review | ≥ 10 screens, batch generation |

---

## Authentication

The `application_default_credentials.json` file contains: `client_id`, `client_secret`, `refresh_token`, `type: authorized_user`. Cannot reuse Antigravity's login (different OAuth scope). The skill includes `setup_auth.ps1` — a **one-time setup** that opens a browser for Google login → token auto-refreshes indefinitely.

---

## 8-Step Pipeline

> **Note:** All output is stored at `stitchSkill/projects/<project-name>/`

### Step 1 — Read Documentation & Collect References

**1a. Read & analyze description documents:**
- AI reads all description files (markdown, docx, txt…)
- Extracts: objectives, user roles, features, data entities, business rules, domain terminology
- → Output: `projects/<name>/system_context.md`

**1b. Ask user for reference materials:**

AI proactively asks:

> *"Do you have any reference materials? For example:"*
> 1. 🖼️ **Screenshots / mockups** of similar apps for inspiration
> 2. 🎨 **Style guide / brand guidelines** (logo, colors, fonts)
> 3. 🌐 **Website/app URLs** whose style you like
> 4. 📝 **Style notes** (e.g., "dark theme, corporate, minimal")
> 5. 📄 **Any other documents** (old wireframes, Figma links, PDFs…)

If the user provides:
- Screenshots → AI analyzes color palette, layout patterns, component styles → injects into design system
- URLs → AI (or browser tool) captures & analyzes visual style
- Brand guide → Extracts colors, fonts, logo rules
- Text → Records preferences

→ Output: `projects/<name>/style_references.md` (consolidated references)

### Step 2 — Identify ALL Screens (Screen Map)

**2a. AI recommends Users/Actors & Journeys:**

Based on `system_context.md` + `style_references.md`, AI proposes:

```markdown
## Proposed Users/Actors

From the description documents, I identified the following user groups:

| # | Actor | Description | Usage Frequency |
|---|---|---|---|
| 1 | Analyst | Primary data analyst | Daily |
| 2 | Unit Manager | Unit-level manager | Weekly |
| 3 | Executive | C-level leadership | Monthly |
| 4 | System Admin | System administrator | As needed |

## Proposed Journeys per Actor

### Actor 1: Analyst
- ✅ Dashboard Analytics → Drill-down → Export
- ✅ Task Management → Task Detail → Annotations
- ✅ Report Comparison → Cross-period Analysis

### Actor 2: Unit Manager
- ✅ Team Overview → Member Performance → Alerts
- ...

> 💬 Do you agree with these proposals?
> You can: add actors, remove journeys, add specific screens,
> or comment with any adjustments.
```

**2b. User reviews & adjusts:**
- Agree → AI proceeds
- Comment → AI updates per feedback, re-proposes
- Add → AI incorporates
- Remove → AI excludes

**2c. After approval, AI creates the complete screen map:**

→ Output: `projects/<name>/screen_map.md` including:
- Full list of all screens (numbered SXX)
- Grouped by approved journeys
- Flow diagram (mermaid)
- Navigation mapping (which screen links to which)

#### Journey Reference Library for AI

##### 1. Core Navigation & Entry
| Journey | Example Screens |
|---|---|
| Authentication | Login, Register, Forgot Password, 2FA, SSO Redirect |
| Onboarding | Welcome, Setup Wizard, Profile Completion, Tour |
| Home / Landing | Dashboard Overview, News Feed, Activity Stream |

##### 2. Data Browsing & Management
| Journey | Example Screens |
|---|---|
| List → Detail → Edit | Master List, Detail View, Edit Form, Delete Confirm |
| Search & Filter | Advanced Search, Saved Filters, Search Results |
| Data Import/Export | Upload Wizard, Column Mapping, Preview, Export |
| Bulk Operations | Multi-select, Bulk Edit, Bulk Delete, Progress |

##### 3. Analytics & Reporting
| Journey | Example Screens |
|---|---|
| Dashboard Analytics | KPI Overview, Trends, Comparisons, Period Selector |
| Drill-down | Summary → Category → Individual Item |
| Report Builder | Template, Parameters, Preview, Schedule, Export |
| Data Visualization | Chart Builder, Map View, Heatmap, Pivot Table |
| Cross-period Analysis | Period Comparison, Delta, Trend Projection |

##### 4. Workflow & Process
| Journey | Example Screens |
|---|---|
| Task Management | Kanban Board, Task Detail, Assignment, Tracking |
| Approval Workflow | Submit, Pending, Approve/Reject, History |
| Multi-step Process | Wizard, Progress Bar, Validation, Confirm |
| Alerts & Notifications | Alert Center, Detail, Severity, Acknowledge |
| Calendar & Scheduling | Calendar, Event Detail, Create, Recurring |

##### 5. Communication & Collaboration
| Journey | Example Screens |
|---|---|
| Messaging | Inbox, Thread, Compose, Attachments |
| Comments | Thread, @Mention, Reply, Reactions |
| File Sharing | Browser, Upload, Preview, Version History |

##### 6. User & Account Management
| Journey | Example Screens |
|---|---|
| Profile | View, Edit, Avatar, Preferences |
| Organization | Org List, Detail, Departments, Members |
| User Admin | User List, Detail, Role Assignment, Invite |
| Roles & Permissions | Role List, Permission Matrix, Custom Roles |

##### 7. System Administration
| Journey | Example Screens |
|---|---|
| Settings | General, Theme, Integrations, API Keys |
| Configuration | Feature Toggles, Parameters, Email Templates |
| Audit & Logs | Audit Trail, System Logs, Filters |

##### 8. E-commerce & Transactions
| Journey | Example Screens |
|---|---|
| Product Catalog | Browse, Grid/List, Detail, Compare |
| Cart & Checkout | Cart, Payment, Review, Confirmation |
| Order Management | Orders, Detail, Tracking, Returns |

##### 9. Content Management
| Journey | Example Screens |
|---|---|
| Editing | WYSIWYG, Media Library, Version Control |
| Publishing | Draft → Review → Publish, Schedule |
| Templates | List, Editor, Variable Binding |

##### 10. Map & Location
| Journey | Example Screens |
|---|---|
| Map View | Interactive Map, Markers, Detail Popup |
| Asset Tracking | Real-time Map, Detail, Route History |

##### 11. Monitoring & Operations
| Journey | Example Screens |
|---|---|
| System Monitoring | Status, Health, Uptime, Performance |
| Incidents | List, Triage, Escalation, Post-mortem |

##### 12. Edge Cases & System States
| Journey | Example Screens |
|---|---|
| Empty States | First-time, No Results, No Access |
| Error States | 404, 500, Offline, Session Expired |
| Help & Support | Help Center, FAQ, Contact, Feedback |

### Step 3 — Build Design System Spec

→ Output: `projects/<name>/DESIGN.md`

Combines `system_context.md` + `style_references.md` (from Step 1b) to create:
- App Identity, Color Palette, Typography
- **Navigation Structure** (FIXED across all screens)
- Layout Grid, Component Patterns

### Step 4 — Build Detailed Prompts for Each Screen

→ Output: `projects/<name>/prompts/SXX_screen_name.md`

Each prompt contains **3 mandatory parts**:

```
┌─────────────────────────────────────────────┐
│  PART 1: DESIGN SYSTEM (copied from Step 3) │
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

### Step 5 — Select Stitch Project & Drawing Mode

**5a.** Call `list_projects` → display list → **ask user to choose** a project or create new.

**5b.** Ask user to choose **drawing mode**:
- **Interactive**: AI draws → presents → waits for feedback → edits → continues
- **Auto-feed**: AI draws all screens automatically → user reviews at the end

### Step 6 — Draw Screens in Journey Order

Execute per selected mode (Interactive / Auto-feed / Script batch).

### Step 7 — Review & Edit

Overall review → edit (`edit_screens`) → generate variants if needed.

### Step 8 — Export & Report

→ Output: `projects/<name>/wireframe_report.md`

---

## File Structure

```
stitchSkill/
├── SKILL.md                          # Main instructions (8 steps)
├── implementation_plan.md            # This plan (Vietnamese)
├── implementation_plan_en.md         # This plan (English)
├── templates/
│   ├── system_context_template.md
│   ├── screen_map_template.md
│   ├── design_system_template.md     # Step 3 — DESIGN.md 9-section spec
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
        ├── system_context.md         # From Step 1a
        ├── style_references.md       # From Step 1b
        ├── screen_map.md             # From Step 2
        ├── DESIGN.md                 # From Step 3
        ├── prompts/                  # From Step 4
        │   ├── S01_dashboard.md
        │   ├── S02_task_list.md
        │   └── ...
        ├── generation_log.md         # From Step 6
        └── wireframe_report.md       # From Step 8
```

---

## Verification Plan

### Automated
1. `setup_auth.ps1` → verify ADC credentials exist
2. `node scripts/setup_project.js --dry-run` → verify API connectivity
3. `node scripts/batch_generate.js --dry-run` → verify prompt loading

### Manual
1. Full pipeline dry-run
2. Compare output with Stitch results
3. Evaluate: navigation consistency, data linkage, visual coherence
