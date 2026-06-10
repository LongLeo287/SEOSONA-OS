# ⚙️ SEOSONA OS Operational Ecosystem (Zero-Config Global)

This document describes the Standard Operating Procedure (SOP) for SEOSONA OS following its restructuring into the **Global Symlink** architecture.

---

## 1. Core Mechanism

The new architecture transforms SEOSONA OS from a "Project Directory" into a **"Background AI Operating System"**.
You no longer need to copy cumbersome files into individual projects. The operational mechanism works in 3 steps:

1. **Global Anchor (Symlink):** SEOSONA OS creates an invisible pipeline (`~/.seosona`) pointing directly to its brain. No matter where you move the root folder, running the installation command will automatically realign the pipeline.
2. **Global Injection:** Every AI tool (Claude Code, Cursor, Codex, Windsurf, etc.) is "injected" with a default awareness: *"You are SEOSONA OS. Your brain is located at ~/.seosona"*.
3. **Real-time Access:** When the AI needs a skill, it navigates through the `~/.seosona` pipeline to fetch the exact skill file and applies it to your current project.

---

## 2. Practical Operational Flow

### 🟢 Phase 1: Initialization (One-time only)
1. Download the SEOSONA OS directory to any location (e.g., `D:\SEOSONA OS`).
2. Open a Terminal in that directory and run:
   ```bash
   npm install
   ```
3. *Done! Your machine is now permanently infused with SEOSONA OS.*

### 🔵 Phase 2: Daily Workflow (Zero-Touch)
1. Open **ANY** project folder you want to work on (e.g., `E:\ClientProject_A`).
2. Open your preferred AI tool (Cursor, Claude Code, Windsurf, Codex).
3. Chat normally with the AI:
   > *"Analyze the SEO technicals of this `index.html` file according to SEOSONA standards."*
4. The AI will automatically:
   - Navigate through the pipeline and read `MASTER_INDEX.md` to find the skill.
   - Transform into the **[Claude SEO Analyst]**.
   - Pull the `seo_marketing` skill set to audit the `index.html` file.

### 🔴 Phase 3: Background Automation (Invisible Hooks)
While the AI works, **Global Hooks** trigger silently in the background to protect you:
- **Privacy Block:** Prevents the AI from leaking sensitive client data to the internet.
- **Rules Reminder:** Automatically enforces coding standards (SOUL.md) if the AI shows signs of writing sloppy code.
- **Memory Logger:** After task completion, the AI automatically drops the analysis report into the `~/.seosona/3_MEMORY/logs/` repository, preserving knowledge for the entire system.

---

## 3. System Administration & Updates

Because the entire system acts as a Single Source of Truth, administration becomes incredibly effortless:

- **When adding a new Skill:** Simply drop the Markdown file into `D:\SEOSONA OS\2_KNOWLEDGE\frameworks\`. Instantly, **EVERY PROJECT** on your machine has access to that skill.
- **When modifying SOUL.md rules:** Change one line, and 100% of running IDEs/CLIs will immediately and obediently follow the new rule.

---

> **Summary:** SEOSONA OS now operates exactly like a RAM module plugged directly into the brain of every AI tool on your machine. Just launch the AI and use it — no installation per project, no copying files, and no complex commands to remember!
