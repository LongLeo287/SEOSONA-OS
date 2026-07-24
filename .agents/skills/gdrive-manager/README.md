# 📁 gdrive-manager

> A production-ready **Agent Skill** for full Google Drive management — works natively across Claude Code, Gemini CLI, Kilo Code, Codex CLI, Kiro, OpenCode, GitHub Copilot, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Open%20Standard-8A2BE2)](https://agentskills.io)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-✓-blueviolet)](https://code.claude.com)
[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-✓-orange)](https://github.com/google-gemini/gemini-cli)
[![Kilo Code](https://img.shields.io/badge/Kilo%20Code-✓-teal)](https://kilo.ai)
[![Codex CLI](https://img.shields.io/badge/Codex%20CLI-✓-black)](https://developers.openai.com/codex)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-✓-blue)](https://github.com/features/copilot)
[![Kiro](https://img.shields.io/badge/Kiro-✓-red)](https://kiro.dev)
[![OpenCode](https://img.shields.io/badge/OpenCode-✓-green)](https://opencode.ai)

---

## What Is This?

`gdrive-manager` is a single **Agent Skill** following the [Agent Skills open standard](https://agentskills.io) — a `SKILL.md` + executable Python scripts — that teaches any AI agent to fully manage Google Drive:

- Create, read, update, delete files and folders (Docs, Sheets, Slides, PDFs, any file)
- Upload and download files and entire folder trees
- Search by name, full-text content, or file type
- Manage sharing permissions
- All with **mandatory safety guardrails** enforced in code — no AI can silently delete your files

Because it follows the open Agent Skills standard, the **same skill folder works natively** across every major AI coding assistant with no reformatting or duplication.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Install with npx skills (Universal)](#-install-with-npx-skills-universal)
- [Manual Installation by Agent](#manual-installation-by-agent)
  - [Claude Code](#-claude-code)
  - [Gemini CLI](#-gemini-cli)
  - [Kilo Code](#-kilo-code)
  - [OpenAI Codex CLI](#-openai-codex-cli)
  - [Kiro](#-kiro-ide--cli)
  - [OpenCode](#-opencode)
  - [GitHub Copilot](#-github-copilot-vs-code)
  - [Claude.ai Browser](#-claudeai-browser)
- [Prerequisites & Auth Setup](#prerequisites--auth-setup)
- [Safety Guardrails](#-safety-guardrails)
- [Command Reference](#command-reference)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| | |
|---|---|
| 📄 **CRUD Files** | Create, read, update, delete — Docs, Sheets, Slides, PDFs, any file |
| 📂 **CRUD Folders** | Create, list, rename, move, trash, permanently delete |
| ⬆️ **Upload** | Single file, recursive folder, auto-convert Office → Google Workspace |
| ⬇️ **Download** | Single file, recursive folder, auto-export Workspace → Office format |
| 🔍 **Search** | By name (partial), full-text content, MIME type, parent folder |
| 🔗 **Share** | Share with user, make public, list/revoke permissions |
| 📊 **Output** | Markdown table (default) or JSON |
| 🔒 **Safety** | Two-step human confirmation required for all destructive operations — enforced in code |

---

## Quick Start

```bash
# Clone
git clone https://github.com/habitual69/gdrive-manager.git
cd gdrive-manager

# Install Python dependencies
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

# Interactive setup: detects OS & shell, asks where credentials.json lives,
# runs OAuth, then prints exact export commands for your environment
python scripts/auth_setup.py

# Try it
python scripts/gdrive.py list
```

---

## 🚀 Install with npx skills (Universal)

The fastest way to install across any supported agent. The `npx skills` CLI auto-detects which agents you have installed.

```bash
# Install to all detected agents at once
npx skills add habitual69/gdrive-manager

# Install to a specific agent only
npx skills add habitual69/gdrive-manager --agent claude-code
npx skills add habitual69/gdrive-manager --agent gemini-cli
npx skills add habitual69/gdrive-manager --agent kilo-code
npx skills add habitual69/gdrive-manager --agent codex

# Install globally (available across all projects)
npx skills add habitual69/gdrive-manager --global

# List all installed skills
npx skills list

# Update to latest version
npx skills update habitual69/gdrive-manager
```

---

## Manual Installation by Agent

All agents follow the same pattern: copy the skill folder into the agent's skills discovery directory. The skill is then auto-discovered on next startup — no config file edits needed.

**Skill precedence across all agents:** project-level (`.agent/skills/`) overrides global (`~/.agent/skills/`) when names conflict.

---

### 🟣 Claude Code

**Docs:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

Claude Code scans `~/.claude/skills/` (personal — all projects) and `.claude/skills/` (project-level — current repo only). Skills are auto-discovered at startup with live reload — no restart needed when you edit a skill during a session.

```bash
# Global install — available in all your projects
git clone https://github.com/habitual69/gdrive-manager.git ~/.claude/skills/gdrive-manager

# OR project-level install — checked into your repo
git clone https://github.com/habitual69/gdrive-manager.git .claude/skills/gdrive-manager
```

**Verify it loaded (in a Claude Code session):**
```
/skills
```

**Invoke explicitly:**
```
/gdrive-manager list all my Drive files
```

**Invoke automatically** — just ask anything Drive-related and Claude Code matches the skill description and activates it automatically.

> **How it works:** At startup Claude Code reads only `name` and `description` (~100 tokens) from each `SKILL.md`. When your task matches, the full skill body and scripts directory load into context. Claude can then call `scripts/gdrive.py` directly via bash.

---

### 🔵 Gemini CLI

**Docs:** [geminicli.com/docs/cli/skills](https://geminicli.com/docs/cli/skills/)

Gemini CLI scans two locations:
- `~/.gemini/skills/` — **User scope**: global, all projects
- `.gemini/skills/` — **Workspace scope**: project-local, shareable with team via git

```bash
# User scope (global)
git clone https://github.com/habitual69/gdrive-manager.git ~/.gemini/skills/gdrive-manager

# Workspace scope (project-local)
git clone https://github.com/habitual69/gdrive-manager.git .gemini/skills/gdrive-manager
```

**Or use the built-in `gemini skills` command:**
```bash
# Install from GitHub (.skill bundle or folder)
gemini skills install https://github.com/habitual69/gdrive-manager --scope user
gemini skills install https://github.com/habitual69/gdrive-manager --scope workspace

# Symlink from a local clone (edits reflect immediately — no re-install)
gemini skills link /path/to/gdrive-manager --scope user
gemini skills link /path/to/gdrive-manager --scope workspace

# List all discovered skills
gemini skills list

# Reload skills without restarting (inside an active session)
/skills reload
```

**Verify:**
```
/skills list
```

**Invoke:** Gemini auto-activates via the `activate_skill` tool when your request matches the description. You will see a consent prompt before the skill loads. You can also invoke explicitly:
```
Use the gdrive-manager skill to upload my project folder to Drive
```

> **How it works:** Gemini CLI uses progressive disclosure — only `name` and `description` are in context at startup. When activated, the full `SKILL.md` body and the skill's directory path are added to context, granting Gemini read access to all bundled scripts. Gemini can execute `scripts/gdrive.py` via bash tool calls natively.

---

### 🟢 Kilo Code

**Docs:** [kilo.ai/docs/customize/skills](https://kilo.ai/docs/customize/skills)

Kilo Code (VS Code extension) scans:
- `~/.kilocode/skills/` — **Global**: all workspaces
- `.kilocode/skills/` — **Project-level**: current workspace only

```bash
# Global install
git clone https://github.com/habitual69/gdrive-manager.git ~/.kilocode/skills/gdrive-manager

# Project-level install
git clone https://github.com/habitual69/gdrive-manager.git .kilocode/skills/gdrive-manager
```

**Or use npx:**
```bash
npx ai-agent-skills install habitual69/gdrive-manager
# Installs to ~/.kilocode/skills/ automatically
```

**After install, reload VS Code:**
```
Cmd+Shift+P → Developer: Reload Window
```

**Verify the skill loaded (ask the agent):**
```
Is the gdrive-manager skill available?
```

**Troubleshoot if skill doesn't appear:**
```
View → Output → select "Kilo Code" from the dropdown — look for skill-related errors
```

> **How it works:** Kilo Code scans all `SKILL.md` files at initialization, reading only metadata. When your task matches the description, the full skill body loads on demand. Kilo Code can run `scripts/gdrive.py` directly via bash tool calls.

---

### ⚫ OpenAI Codex CLI

**Docs:** [developers.openai.com/codex/skills](https://developers.openai.com/codex/skills/)

Codex scans skills from multiple locations in priority order:
- `.agents/skills/` — project-local (walks up to repo root)
- `~/.codex/skills/` — global user skills

```bash
# Global install
git clone https://github.com/habitual69/gdrive-manager.git ~/.codex/skills/gdrive-manager

# Project-level install
mkdir -p .agents/skills
git clone https://github.com/habitual69/gdrive-manager.git .agents/skills/gdrive-manager
```

**Or use the built-in skill installer:**
```bash
# Inside a Codex session
$skill-installer
# Then ask it to install from: https://github.com/habitual69/gdrive-manager
```

**Invoke explicitly in Codex:**
```
$gdrive-manager list all files in my Drive
```

**Invoke automatically** — Codex implicitly activates skills when your task matches the description.

> Codex detects skill file changes automatically. If an update doesn't appear, restart Codex.

---

### 🔴 Kiro (IDE + CLI)

**Docs:** [kiro.dev/docs/skills](https://kiro.dev/docs/skills/)

Kiro scans:
- `~/.kiro/skills/` — **Global**: available across all workspaces
- `.kiro/skills/` — **Workspace**: project-local (takes precedence over global for same name)

**Option A — Clone into skills directory:**
```bash
# Global
git clone https://github.com/habitual69/gdrive-manager.git ~/.kiro/skills/gdrive-manager

# Workspace
git clone https://github.com/habitual69/gdrive-manager.git .kiro/skills/gdrive-manager
```

**Option B — Import via Kiro UI (easiest):**
1. Open the **Kiro panel** in your IDE
2. Navigate to **Agent Steering & Skills**
3. Click **Import from GitHub**
4. Paste: `https://github.com/habitual69/gdrive-manager`
5. Choose **Global** or **Workspace** scope
6. Click **Import** — the skill is copied to your skills directory and works immediately

> **Note:** When importing via UI, Kiro copies the files — future repo updates require a re-import. Use the git clone method if you want to `git pull` updates.

---

### 🟠 OpenCode

**Docs:** [opencode.ai/docs/skills](https://opencode.ai/docs/skills/)

OpenCode searches multiple locations and supports shared directories with Claude Code and Codex:

**Global locations (searched in order):**
- `~/.config/opencode/skills/*/SKILL.md`
- `~/.claude/skills/*/SKILL.md`
- `~/.agents/skills/*/SKILL.md`

**Project-local locations (walks up to git root):**
- `.opencode/skills/*/SKILL.md`
- `.claude/skills/*/SKILL.md`
- `.agents/skills/*/SKILL.md`

```bash
# Global — using OpenCode's own directory
git clone https://github.com/habitual69/gdrive-manager.git ~/.config/opencode/skills/gdrive-manager

# Global — shared with Claude Code (same skill works in both)
git clone https://github.com/habitual69/gdrive-manager.git ~/.claude/skills/gdrive-manager

# Project-level
git clone https://github.com/habitual69/gdrive-manager.git .opencode/skills/gdrive-manager
```

> **Tip:** Installing to `~/.claude/skills/` makes the skill available to both Claude Code and OpenCode simultaneously with no duplication.

---

### 🔵 GitHub Copilot (VS Code)

**Docs:** [code.visualstudio.com/docs/copilot/customization/agent-skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)

GitHub Copilot (VS Code) reads skills from `.github/skills/` in your project workspace. This is project-scoped — commit it to share with your team.

> ⚠️ **Important:** The directory name must match the `name` field in `SKILL.md`. The skill won't load if they differ.

```bash
# Project install (committed to repo — shared with team)
mkdir -p .github/skills
git clone https://github.com/habitual69/gdrive-manager.git .github/skills/gdrive-manager
```

**Invoke in Copilot Chat:**
```
/skills
```
Select `gdrive-manager` from the slash-command menu, or just describe what you want and Copilot matches it automatically:
```
Use the gdrive-manager skill to search my Drive for files named "invoice"
```

**Or generate a skill directly from chat:**
```
/create-skill
```

> **How it works:** When your request matches the description, Copilot loads the full `SKILL.md` into context. Additional files (scripts, references) load on demand. Skills in `.github/skills/` are shared team-wide when committed.

---

### 🔶 Claude.ai (Browser)

Claude.ai supports uploading `.skill` ZIP packages directly.

**Option A — Upload the `.skill` file:**
1. Download `gdrive-manager.skill` from [Releases](https://github.com/habitual69/gdrive-manager/releases)
2. Go to [claude.ai](https://claude.ai) → **Customize → Skills**
3. Click **Upload skill** → select `gdrive-manager.skill`
4. Toggle it **on**

> Requires: **Settings → Capabilities → Code execution and file creation** must be enabled.
> Available on Pro, Max, Team, and Enterprise plans.

**Option B — Custom Instructions (no code execution):**
1. Go to **Settings → Custom Instructions**
2. Paste the full contents of `SKILL.md`

> In custom instructions mode, Claude will use the inline patterns from `references/` instead of running scripts directly. Safety rules still apply.

---

## Prerequisites & Auth Setup

### 1. Python 3.10+
```bash
python3 --version
```

### 2. Install packages
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### 3. Get credentials.json from Google Cloud

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create or select a project
3. Enable these four APIs: **Google Drive API**, **Docs API**, **Sheets API**, **Slides API**
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Desktop App**
6. Download JSON → save it (recommended: `~/.config/gdrive/credentials.json`)

> ⚠️ **Never commit `credentials.json` or `token.json` to version control.**

```bash
echo "credentials.json" >> .gitignore
echo "token.json" >> .gitignore
echo "gdrive_audit.log" >> .gitignore
```

### 4. Interactive auth setup

```bash
python scripts/auth_setup.py
```

The script detects your OS and shell, asks where your files live, opens browser OAuth, then prints the **exact commands** to set environment variables permanently:

| OS | Shell | Command |
|----|-------|---------|
| Linux/macOS | bash/zsh | `export GDRIVE_CREDS="..."` + `echo ... >> ~/.bashrc` |
| Linux/macOS | fish | `set -Ux GDRIVE_CREDS "..."` |
| Windows | PowerShell | `[System.Environment]::SetEnvironmentVariable(...)` |
| Windows | CMD | `setx GDRIVE_CREDS "..."` |

**Other auth commands:**
```bash
python scripts/auth_setup.py --check     # verify token is valid
python scripts/auth_setup.py --revoke    # delete token, force re-auth
python scripts/auth_setup.py --show-env  # print current env var values
python scripts/auth_setup.py --no-auth   # configure paths only, skip OAuth
```

The script auto-applies `chmod 600` on credential files (Linux/macOS). On Windows, files are stored in `AppData\Roaming\gdrive\` which is user-private by default.

---

## 🔒 Safety Guardrails

Enforced in `scripts/safety.py` — not just written as instructions. Every call to `drive.files().delete()` and every `trashed=True` in `gdrive.py` routes through the safety gate. **There is no code path that bypasses it.**

```
╔══════════════════════════════════════════════════════════════════════════╗
║  RULE 1  No AI may trash or delete any file without explicit typed      ║
║          confirmation from a human user.                                 ║
║  RULE 2  Always prefer TRASH (recoverable 30 days) over permanent       ║
║          DELETE (irreversible — data gone forever).                      ║
║  RULE 3  Permanent delete requires typing the EXACT file name.          ║
║          Bulk delete requires typing "delete N files".                  ║
║  RULE 4  Every destructive attempt is logged to gdrive_audit.log        ║
║          with timestamp, file name, file ID, and outcome.               ║
║  RULE 5  Agent must warn in chat FIRST — then the script asks AGAIN     ║
║          in the terminal. Both steps required. Neither can be skipped.  ║
║                                                                          ║
║  Applies to: Claude, Gemini, Codex, Copilot, Kilo Code, Kiro,          ║
║  OpenCode, and any automation pipeline.                                  ║
║  NO PROMPT, FLAG, OR ENV VAR CAN OVERRIDE RULES 1–4.                   ║
╚══════════════════════════════════════════════════════════════════════════╝
```

**View your audit log:**
```bash
python scripts/gdrive.py audit
```

---

## Command Reference

```bash
# ── Auth ──────────────────────────────────────────────────────────────────
python scripts/auth_setup.py                 # interactive setup (run first)
python scripts/auth_setup.py --check         # verify token is valid
python scripts/auth_setup.py --revoke        # delete token, force re-auth
python scripts/auth_setup.py --show-env      # print current env var values
python scripts/auth_setup.py --no-auth       # configure paths only, skip OAuth

# ── List / Read ───────────────────────────────────────────────────────────
python scripts/gdrive.py list                              # root folder
python scripts/gdrive.py list --parent FOLDER_ID           # specific folder
python scripts/gdrive.py info --id FILE_ID                 # file metadata
python scripts/gdrive.py search --name "budget"            # by name (partial)
python scripts/gdrive.py search --text "invoice"           # full-text search
python scripts/gdrive.py search --type sheet               # doc|sheet|slide|folder|pdf
python scripts/gdrive.py search --name "Q3" --type doc --parent FOLDER_ID

# ── Create ────────────────────────────────────────────────────────────────
python scripts/gdrive.py mkdir   --name "Projects" --parent FOLDER_ID
python scripts/gdrive.py mkdoc   --name "Meeting Notes"
python scripts/gdrive.py mksheet --name "Budget 2025"
python scripts/gdrive.py mkslide --name "Q3 Presentation"

# ── Update ────────────────────────────────────────────────────────────────
python scripts/gdrive.py rename --id FILE_ID --name "New Name"
python scripts/gdrive.py move   --id FILE_ID --to DEST_FOLDER_ID

# ── Upload ────────────────────────────────────────────────────────────────
python scripts/gdrive.py upload --src ./report.pdf --to FOLDER_ID
python scripts/gdrive.py upload --src ./project-folder --to FOLDER_ID
python scripts/gdrive.py upload --src ./data.xlsx --to FOLDER_ID --convert

# ── Download ──────────────────────────────────────────────────────────────
python scripts/gdrive.py download --id FILE_ID --dest ./downloads
python scripts/gdrive.py download --id FOLDER_ID --dest ./backups

# ── Share ─────────────────────────────────────────────────────────────────
python scripts/gdrive.py share  --id FILE_ID --email user@example.com --role writer
python scripts/gdrive.py public --id FILE_ID

# ⚠️  TRASH — recoverable 30 days (requires typing 'yes' in terminal)
python scripts/gdrive.py trash --id FILE_ID
python scripts/gdrive.py trash --id ID1 --id ID2 --id ID3

# 🚨 PERMANENT DELETE — irreversible (requires typing exact file name)
python scripts/gdrive.py delete --id FILE_ID

# ── Audit ─────────────────────────────────────────────────────────────────
python scripts/gdrive.py audit

# All commands accept --out json
python scripts/gdrive.py list --out json
```

---

## Project Structure

```
gdrive-manager/
├── SKILL.md                    ← Agent instructions (YAML frontmatter + body)
├── README.md                   ← This file
├── scripts/
│   ├── auth_setup.py           ← Interactive OAuth2 + OS-aware env export
│   ├── gdrive.py               ← Unified CLI — 16 commands
│   └── safety.py               ← Mandatory safety guardrails
└── references/
    ├── file-crud.md            ← Extended Docs/Sheets/Slides batchUpdate patterns
    ├── mime-types.md           ← Full MIME type + export format table
    ├── query-syntax.md         ← Drive query language + pagination
    └── sharing-permissions.md  ← Share, revoke, transfer ownership
```

---

## Environment Variables

`auth_setup.py` prints the exact commands for your OS and shell after first run.

| Variable | Default | Purpose |
|----------|---------|---------|
| `GDRIVE_CREDS` | `credentials.json` | Path to OAuth2 credentials |
| `GDRIVE_TOKEN` | `token.json` | Path to cached token |
| `GDRIVE_AUDIT_LOG` | `gdrive_audit.log` | Path to destructive ops audit log |
| `GDRIVE_CONFIRM_TRASH` | _(unset)_ | Set to `yes` for non-interactive trash in CI only |

---

## Contributing

1. Fork the repo and create a branch
2. `SKILL.md` frontmatter must be `name` + `description` only — flat strings, no nested YAML
3. All destructive ops must route through `safety.py` — no exceptions
4. Test auth with `python scripts/auth_setup.py --check` before submitting PR
5. Open a PR with a clear description

---

## License

MIT — see [LICENSE](LICENSE)

---

> Built by [@habitual69](https://github.com/habitual69) · If this skill saved your data (or your sanity), consider ⭐ starring the repo!
