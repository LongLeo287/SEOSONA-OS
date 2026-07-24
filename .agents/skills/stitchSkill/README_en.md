# 🧩 Stitch Wireframe Generator — Antigravity Skill

> AI reads your software docs → plans all screens → builds context-rich prompts → auto-generates wireframes via Google Stitch.

An [Antigravity](https://code.google.com/assist/) skill that automates wireframe generation through Google Stitch MCP. Instead of manually creating screens one-by-one, let your AI agent handle the entire pipeline — from document analysis to full system wireframing.

---

## 🤔 The problem

There are two ways to generate wireframes with Google Stitch, and both have trade-offs:

**Approach 1 — Upload docs to Stitch directly:**
Stitch reads your full documentation and generates cohesive screens with consistent navigation, shared data, and proper user flows. Great results. But you have to click through creating each screen manually.

**Approach 2 — AI agent calls Stitch MCP:**
AI reads your docs, plans screens, and calls Stitch MCP to generate them automatically. No clicking required. But each MCP call is an isolated session — Stitch doesn't know what the previous screen looked like. The result? Every screen picks its own sidebar, its own navigation, its own color scheme.

**Here's what that looks like:**

| Screen | Sidebar | Top Navigation | Issue |
|--------|---------|----------------|-------|
| App Shell Header (S01) | None | `Nhà phân tích · BaoCaoT3_2026.xlsx` | Custom header bar |
| Tab Navigation (S02) | `Dashboard, Reports, History, Cảnh báo` | `Dashboard, Reports, History` | Different items from S01 |
| KPI Row (S05) | `Analytics, Team, Projects, Tasks, Archive` | `Dashboard, Reports, History` | Completely different sidebar |
| State Distribution (S06) | `Analytics, Team, Projects, Tasks, Archive` | `Dashboard, Reports, History` | Same as S05 but different from S02 |
| Health Distribution (S07) | `PHÂN TÍCH, NHÓM, DỰ ÁN, CÔNG VIỆC, LƯU TRỮ` | `Phân tích, Nhóm, Dự án` | Now in Vietnamese caps (!) |

Five screens, five different navigation systems. Each screen independently beautiful — but together, not a system.

### Example screens (before this skill)

<p align="center">
  <img src="examples/tmpScreens/createdByAIPrompt/image.png" width="45%" alt="App Shell Header — custom navigation" />
  <img src="examples/tmpScreens/createdByAIPrompt/image copy.png" width="45%" alt="Tab Navigation — different sidebar" />
</p>
<p align="center">
  <img src="examples/tmpScreens/createdByAIPrompt/image copy 2.png" width="45%" alt="KPI Dashboard — yet another sidebar" />
  <img src="examples/tmpScreens/createdByAIPrompt/image copy 3.png" width="45%" alt="State Distribution — inconsistent with others" />
</p>
<p align="center">
  <img src="examples/tmpScreens/createdByAIPrompt/image copy 4.png" width="45%" alt="Health Distribution — Vietnamese caps sidebar" />
</p>

> Each screen looks polished individually. But notice how the sidebar, top navigation, and even the language switches between screens. That's the context problem.

---

## 💡 The solution

This skill bridges both approaches: **keep the "holistic system understanding" from Approach 1, add the "full automation" from Approach 2.**

The key insight: before generating any screen, create a shared **Design System Spec** and inject it into every prompt. Each prompt contains not just "what to draw" but the entire system context: navigation structure, color palette, all screen names, and the current screen's position in the flow.

### Auto-feed running process

When running the skill in auto-feed mode, the AI automatically calls Stitch MCP for each screen in sequence. Here's the actual process generating 16 screens for TaskLens v2:

<p align="center">
  <img src="examples/createdScreens/image copy.png" width="45%" alt="Starting auto-feed — S01 through S05" />
  <img src="examples/createdScreens/image copy 4.png" width="45%" alt="Continuing — S05 through S08" />
</p>
<p align="center">
  <img src="examples/createdScreens/image.png" width="45%" alt="Detailed prompt being fed to Stitch" />
  <img src="examples/createdScreens/image copy 6.png" width="45%" alt="Complete — 16/16 screens all successful" />
</p>

> The AI reads prompts from the `prompts/` directory, calls `generate_screen_from_text` for each screen, logs the result, then moves to the next. All 16 screens completed without any manual intervention.

### Example screens (after this skill)

<p align="center">
  <img src="examples/createdScreens/image copy 2.png" width="45%" alt="Dashboard Overview — consistent navigation" />
  <img src="examples/createdScreens/image copy 5.png" width="45%" alt="Comparison View — same navigation, linked data" />
</p>
<p align="center">
  <img src="examples/createdScreens/image copy 3.png" width="45%" alt="Dashboard Detail — consistent sidebar" />
</p>

> Same sidebar, same top navigation, same color system, linked data — across all 16 auto-generated screens.

---

## ✨ What this skill does

- 📖 **Reads your software description** (markdown, docx, txt) and extracts system context
- 🎨 **Collects your style preferences** (screenshots, brand guides, URLs, or just "dark theme, minimal")
- 👥 **Proposes actors & journeys** for your review — you approve before anything is drawn
- 🎯 **Creates a unified Design System** (colors, fonts, navigation) injected into every screen prompt
- 📝 **Builds detailed 3-part prompts** per screen (Design System + Screen Map Context + Screen Content)
- 🖼️ **Auto-generates wireframes** via Stitch MCP — 16 screens in one go, zero clicking
- 📊 **Logs everything** to your project folder for traceability

---

## 📦 Installation

### Prerequisites

- [Antigravity](https://code.google.com/assist/) (Google's AI coding assistant)
- [Google Stitch MCP](https://developers.google.com/stitch) enabled in your Antigravity settings
- [Google Cloud SDK](https://cloud.google.com/sdk) (`gcloud` CLI) — for script-based execution only

### Steps

1. **Clone or copy this skill** into your Antigravity skills directory:

```
# Your Antigravity skills directory — typically:
#   <workspace>/.agent/skills/
#   or your custom skills path

git clone <repo-url> stitchSkill
```

2. **Verify skill detection:** Open Antigravity in the workspace. The skill will auto-activate when you ask anything about wireframes or Stitch.

3. **(Optional) Set up authentication for script mode:**

```powershell
# Navigate to the skill directory
cd .agent/skills/stitchSkill

# Run the one-time auth setup
powershell -File scripts/setup_auth.ps1
```

That's it. The skill is ready.

---

## 🔐 Authentication (for script mode)

> **Note:** If you only use Mode A (Stitch MCP), authentication is handled automatically by Antigravity. This section is only for Mode B (script batch).

<!-- TODO: Complete gcloud ADC setup automation -->
<!-- The current setup_auth.ps1 script guides you through:
1. Checking if gcloud CLI is installed
2. Running `gcloud auth application-default login`
3. Verifying the credential file was created
4. Testing connectivity to stitch.googleapis.com

This creates ~/.config/gcloud/application_default_credentials.json
containing OAuth2 refresh_token that auto-refreshes indefinitely. -->

```powershell
# One-time setup — opens browser for Google login
gcloud auth application-default login

# Verify it works
gcloud auth application-default print-access-token
```

**Status:** 🚧 The `setup_auth.ps1` script and batch generation scripts are under active development. The gcloud ADC approach works but the automation wrapper is being refined. Contributions welcome!

---

## 🚀 How to use

### Quick start

Just tell your AI agent:

> "Read the software description at `docs/product-spec.md` and generate wireframes for the entire system using the stitch wireframe skill."

The agent will automatically:
1. Read your SKILL.md and follow the 8-step pipeline
2. Ask you questions at the right moments (not all at once)
3. Generate all screens into a Stitch project

### The 8-step pipeline

```
📖 Step 1: Read docs & collect style references
     ↓
👥 Step 2: Propose actors → journeys → screens (you approve each layer)
     ↓
🎨 Step 3: Build Design System (colors → nav → layout, you approve each)
     ↓
📝 Step 4: Build 3-part prompts for every screen
     ↓
🔧 Step 5: Select Stitch project & drawing mode
     ↓
🖼️ Step 6: Auto-generate screens in journey order
     ↓
✏️ Step 7: Review & edit
     ↓
📊 Step 8: Export report
```

### Two drawing modes

| Mode | What happens | Best for |
|------|-------------|----------|
| **Interactive (MCP)** | AI draws each screen → shows you → waits for feedback → edits → continues | < 10 screens, want to review each one |
| **Auto-feed (MCP)** | AI draws all screens sequentially, you review at the end | ≥ 10 screens, batch generation |

The agent recommends a mode based on your screen count, but you can always choose.

### Example interaction

```
You:    "Generate wireframes for TaskLens v2 using the stitch wireframe skill.
         Here's the spec: docs/tasklens-v2-spec.md"

Agent:  "I've read the spec and extracted the system context.
         Do you have any reference materials — screenshots, brand guidelines,
         or websites whose style you like?"

You:    "Dark theme, minimal, similar to Linear.app"

Agent:  "Got it. From the spec, I identified 3 actors:
         1. Analyst — daily use
         2. Unit Manager — weekly
         3. Executive — monthly
         
         Do you agree with these actors?"

You:    "Add System Admin"

Agent:  "Updated. Now for the Analyst, I propose these journeys:
         1. Dashboard Analytics → Drill-down → Export
         2. Task Management → Task Detail → Annotations
         ..."

[... progressive disclosure continues ...]

Agent:  "All 16 screens approved. You have 16 screens —
         I recommend Auto-feed mode. Shall I proceed?"

You:    "Go"

Agent:  "Auto-feeding S01 Login Page (1/16)...
         Auto-feeding S02 Dashboard Overview (2/16)...
         ...
         All 16/16 screens generated successfully! ✅"
```

---

## 📁 Project structure

```
stitchSkill/
├── SKILL.md                          # Main skill instructions (8-step pipeline)
├── README.md                         # You are here
├── implementation_plan.md            # Detailed plan (Vietnamese)
├── implementation_plan_en.md         # Detailed plan (English)
│
├── templates/                        # Structural templates for each step
│   ├── system_context_template.md    # Step 1 — System context extraction
│   ├── screen_map_template.md        # Step 2 — Screen map structure
│   ├── design_system_template.md     # Step 3 — DESIGN.md 9-section spec
│   ├── screen_prompt_template.md     # Step 4 — Per-screen prompt (3 parts)
│   └── generation_log_template.md    # Step 6 — Generation log
│
├── scripts/                          # Automation scripts (Mode B)
│   ├── setup_auth.ps1                # 🚧 One-time Google ADC setup
│   ├── setup_project.js              # 🚧 Create/list Stitch projects via API
│   └── batch_generate.js             # 🚧 Batch screen generation via API
│
├── examples/                         # Reference examples
│   ├── tasklens_design_system.md     # Example design system (TaskLens v2)
│   ├── tasklens_screen_prompts.md    # Example screen prompts (TaskLens v2)
│   ├── createdScreens/              # Auto-feed results (16 screens)
│   └── tmpScreens/                  # Comparison screenshots
│       ├── createdByStitch/         # Direct upload results
│       └── createdByAIPrompt/       # Naive AI prompt results
│
└── projects/                         # [RUNTIME] Output per project
    └── <project-name>/
        ├── system_context.md
        ├── style_references.md
        ├── screen_map.md
        ├── DESIGN.md                 # From Step 3
        ├── prompts/
        │   ├── S01_login.md
        │   ├── S02_dashboard.md
        │   └── ...
        ├── generation_log.md
        └── wireframe_report.md
```

---

## 🔬 How the context injection works

The "secret sauce" is the 3-part prompt structure. Every screen prompt contains:

```
┌─────────────────────────────────────────────┐
│  PART 1: DESIGN SYSTEM                      │
│  Same colors, fonts, and nav for ALL screens│
│  → Sidebar: these exact items, this order   │
│  → Top bar: this layout, these elements     │
│  → Colors: #1A1B2E bg, #6366F1 accent, etc. │
├─────────────────────────────────────────────┤
│  PART 2: SCREEN MAP CONTEXT                 │
│  "This is screen 7 of 16."                  │
│  "Part of Journey: Dashboard Analytics"     │
│  "Sidebar highlights: Dashboard > Detail"   │
│  "Previous screen: Dashboard Overview"      │
│  "Next screen: Export Modal"                │
├─────────────────────────────────────────────┤
│  PART 3: SCREEN-SPECIFIC CONTENT            │
│  Layout grid, sections, components          │
│  Sample data — consistent with other screens│
│  Interactions, states, edge cases           │
└─────────────────────────────────────────────┘
```

This ensures Stitch has the same "full picture" for every screen — just like when you upload all docs at once.

---

## 🗺️ Journey reference library

The skill includes a curated library of 12 journey categories to help the AI propose relevant screen flows:

| Category | Examples |
|----------|----------|
| Core Navigation | Login, Register, 2FA, Onboarding, Dashboard |
| Data Browsing | Master List, Detail View, Edit Form, Search, Import/Export |
| Analytics | KPI Dashboard, Drill-down, Report Builder, Period Comparison |
| Workflow | Kanban Board, Approval Flow, Multi-step Wizard, Alerts |
| Communication | Inbox, Thread, File Sharing, Activity Feed |
| User Management | Profile, Org Management, User Admin, Roles & Permissions |
| System Admin | Settings, Feature Toggles, Audit Logs |
| E-commerce | Product Catalog, Cart, Checkout, Order Management |
| Content | WYSIWYG Editor, Publishing Flow, Template Management |
| Map & Location | Interactive Map, Asset Tracking |
| Monitoring | System Status, Incident Management |
| Edge Cases | Empty States, Error Pages, Help Center |

The AI selects relevant categories based on your software description — not every project needs all 12.

---

## 🛠️ Current status & roadmap

| Component | Status | Notes |
|-----------|--------|-------|
| SKILL.md (8-step pipeline) | ✅ Complete | Full pipeline with interaction rules |
| Templates (5 files) | ✅ Complete | All steps covered |
| Examples (TaskLens v2) | ✅ Complete | Design system + screen prompts |
| Auto-feed via MCP | ✅ Working | Tested with 16 screens |
| `setup_auth.ps1` | 🚧 In progress | Basic flow works, automation refining |
| `batch_generate.js` | 🚧 In progress | API calls work, retry logic in development |
| `setup_project.js` | 🚧 In progress | Project CRUD via REST API |

---

## 🤝 Contributing

This skill is under active development. Contributions are welcome!

**Areas that would benefit from contributions:**
- Script automation (`scripts/` directory) — gcloud auth wrapper, batch generation, retry logic
- Additional examples for different types of software (e-commerce, SaaS, mobile app)
- Template improvements based on real-world usage
- Support for other operating systems (currently Windows/PowerShell focused)

**To contribute:**
1. Fork this repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

- [Google Stitch](https://stitch.google.com/) — AI-powered wireframe generation
- [Antigravity](https://code.google.com/assist/) — AI coding assistant with skill system
- Built with the insight that **context is everything** — give AI the full picture, and it draws a system, not isolated screens.
