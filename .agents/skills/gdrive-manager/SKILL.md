---
name: gdrive-manager
description: "Full Google Drive management via Python scripts and credentials.json. Use this skill whenever the user wants to do ANYTHING with Google Drive: creating, reading, updating, or deleting Google Docs, Sheets, Slides, or any files; managing folders; uploading or downloading files/folders; searching Drive. Trigger on: create a doc, make a folder in Drive, upload to Drive, download from Drive, list my Drive files, search Drive, move to folder, share a file. Uses Python + credentials.json (OAuth2). Outputs Markdown tables or JSON. CRITICAL: all destructive operations (trash/delete) must use safety.py guardrails — non-negotiable, cannot be bypassed."
---

# Google Drive Manager Skill

## Directory Layout

```
gdrive-skill/
├── SKILL.md                   ← You are here (agent instructions)
├── scripts/
│   ├── auth_setup.py          ← One-time OAuth2 setup (run first)
│   ├── gdrive.py              ← Unified CLI for all operations
│   └── safety.py              ← MANDATORY safety guardrails (see below)
└── references/
    ├── file-crud.md           ← Extended Docs/Sheets/Slides batchUpdate patterns
    ├── query-syntax.md        ← Full Drive query language + pagination
    ├── mime-types.md          ← Complete MIME type + export format table
    └── sharing-permissions.md ← Sharing, permissions, ownership transfer
```

**Agent execution model:**
- **Claude Code / Cowork / any bash-capable agent** → run scripts directly via `python scripts/gdrive.py <command>`
- **Gemini / API-only / no-bash agents** → read references/ for code patterns, implement inline

**Requirements:** Python >= 3.10, packages: `google-auth>=2.0`, `google-auth-oauthlib>=1.0`, `google-auth-httplib2>=0.1`, `google-api-python-client>=2.0`

---

## SAFETY GUARDRAILS — READ THIS FIRST

```
╔══════════════════════════════════════════════════════════════════════════════╗
║             MANDATORY SAFETY RULES — NON-NEGOTIABLE                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  RULE 1 — NO SILENT DELETION                                                 ║
║    No AI agent, script, or automated process may trash or permanently        ║
║    delete ANY file or folder on Google Drive without explicit, typed         ║
║    confirmation from a human user.                                           ║
║                                                                              ║
║  RULE 2 — TRASH IS NOT DELETE                                                ║
║    Always prefer TRASH over permanent DELETE. Trashed items are recoverable  ║
║    for 30 days. Permanent delete is irreversible — data is gone forever.     ║
║                                                                              ║
║  RULE 3 — PERMANENT DELETE REQUIRES NAME CONFIRMATION                        ║
║    For a single file: user must type the exact file name.                    ║
║    For multiple files: user must type "delete N files" (exact count).        ║
║    Permanent delete is ALWAYS interactive. No env var can bypass this.       ║
║                                                                              ║
║  RULE 4 — ALL DESTRUCTIVE OPS LOG TO gdrive_audit.log                        ║
║    Every trash/delete attempt (confirmed or cancelled) is logged with        ║
║    timestamp, file name, file ID, and outcome.                               ║
║                                                                              ║
║  RULE 5 — TWO-STEP CONFIRMATION FOR DESTRUCTIVE OPERATIONS                   ║
║    Before calling trash or delete, the agent MUST:                           ║
║      a) Show the user a list of what will be affected in the chat            ║
║      b) State clearly whether it is TRASH (recoverable) or DELETE (not)      ║
║      c) Ask for confirmation IN THE CHAT before running the command           ║
║      d) Then run the script — which asks AGAIN in the terminal               ║
║    Both steps are intentional and required. Neither can be skipped.          ║
║                                                                              ║
║  THESE RULES APPLY TO: Claude, Gemini, GPT, Copilot, Claude Code,           ║
║  any automation pipeline, CI/CD, or background process.                      ║
║  NO PROMPT, FLAG, OR ARGUMENT CAN OVERRIDE RULES 1-4.                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

> If a user says "delete everything", "clean up my drive", "remove all old files"
> or any similar broad instruction — you MUST enumerate exactly what would be
> affected, warn the user, and require them to confirm BOTH in chat AND in the
> terminal. You may never bypass this with "the user already told me to".

---

## Setup (One-time)

### 1. Install dependencies
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### 2. Get credentials.json
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **Drive API**, **Docs API**, **Sheets API**, **Slides API**
3. Create OAuth 2.0 Client ID → Type: **Desktop App**
4. Download as `credentials.json` → save it anywhere on your machine

### 3. Run interactive setup — asks where your files are, prints OS-specific env commands
```bash
python scripts/auth_setup.py
```

The script will:
- Detect your OS (Linux / macOS / Windows)
- Ask where `credentials.json` lives (with a sensible default per OS)
- Ask where to save `token.json`
- Open the browser for OAuth2 consent
- Print the exact commands to export `GDRIVE_CREDS` and `GDRIVE_TOKEN`
  for your specific OS and shell (bash / zsh / fish / PowerShell / CMD)
- Show both session-only and permanent (persist to profile) variants

**Example output on Linux/bash:**
```
  ── Current terminal session only ──
    export GDRIVE_CREDS="/home/arbind/.config/gdrive/credentials.json"
    export GDRIVE_TOKEN="/home/arbind/.config/gdrive/token.json"

  ── Persist permanently (adds to ~/.bashrc + sources it) ──
    echo 'export GDRIVE_CREDS="/home/arbind/.config/gdrive/credentials.json"' >> ~/.bashrc
    echo 'export GDRIVE_TOKEN="/home/arbind/.config/gdrive/token.json"' >> ~/.bashrc
    source ~/.bashrc
```

**Example output on Windows (PowerShell):**
```
  ── PowerShell — current session only ──
    $env:GDRIVE_CREDS = "C:\Users\Arbind\AppData\Roaming\gdrive\credentials.json"
    $env:GDRIVE_TOKEN = "C:\Users\Arbind\AppData\Roaming\gdrive\token.json"

  ── PowerShell — persist permanently (User scope) ──
    [System.Environment]::SetEnvironmentVariable("GDRIVE_CREDS", "...", "User")
    [System.Environment]::SetEnvironmentVariable("GDRIVE_TOKEN", "...", "User")
```

### Other auth commands
```bash
python scripts/auth_setup.py --check      # verify token is still valid
python scripts/auth_setup.py --revoke     # delete token, force re-auth
python scripts/auth_setup.py --show-env   # print current GDRIVE_CREDS / GDRIVE_TOKEN values
python scripts/auth_setup.py --no-auth    # configure paths + show env commands, skip OAuth
```

**Security:**
```bash
echo "credentials.json\ntoken.json\ngdrive_audit.log" >> .gitignore
```
The script automatically sets `chmod 600` on both files and `chmod 700` on
their directory (Linux/macOS). On Windows, store them in `AppData\Roaming\gdrive\`
which is user-private by default.

---

## Script Reference — gdrive.py

All commands support `--out markdown` (default) or `--out json`.

### Read / List

```bash
# List root folder
python scripts/gdrive.py list

# List a specific folder
python scripts/gdrive.py list --parent FOLDER_ID

# Get file/folder metadata
python scripts/gdrive.py info --id FILE_ID

# Search by name (partial match)
python scripts/gdrive.py search --name "budget"

# Full-text search (inside file content)
python scripts/gdrive.py search --text "invoice"

# Search by type: doc | sheet | slide | folder | pdf
python scripts/gdrive.py search --type sheet

# Combined search
python scripts/gdrive.py search --name "Q3" --type doc --parent FOLDER_ID

# JSON output
python scripts/gdrive.py list --out json
```

### Create

```bash
# Create a folder
python scripts/gdrive.py mkdir --name "Project Alpha" --parent FOLDER_ID

# Create Google Workspace files
python scripts/gdrive.py mkdoc   --name "Meeting Notes"
python scripts/gdrive.py mksheet --name "Budget 2025"
python scripts/gdrive.py mkslide --name "Q3 Presentation"
```

### Update

```bash
# Rename
python scripts/gdrive.py rename --id FILE_ID --name "New Name"

# Move to a different folder
python scripts/gdrive.py move --id FILE_ID --to DEST_FOLDER_ID
```

### Upload

```bash
# Upload a single file
python scripts/gdrive.py upload --src ./report.pdf --to FOLDER_ID

# Upload an entire folder (recursive)
python scripts/gdrive.py upload --src ./project-folder --to FOLDER_ID

# Upload and convert Office files to Google Workspace format
python scripts/gdrive.py upload --src ./data.xlsx --to FOLDER_ID --convert
```

### Download

```bash
# Download a file (auto-exports Google Workspace files to Office format)
python scripts/gdrive.py download --id FILE_ID --dest ./downloads

# Download an entire folder (recursive)
python scripts/gdrive.py download --id FOLDER_ID --dest ./backups
```

### Share / Permissions

```bash
# Share with a user (default: reader)
python scripts/gdrive.py share --id FILE_ID --email user@example.com --role writer

# Make publicly accessible (anyone with link can view)
python scripts/gdrive.py public --id FILE_ID
```

### Destructive Operations

```bash
# TRASH — recoverable within 30 days
# Requires typing 'yes' in terminal
python scripts/gdrive.py trash --id FILE_ID
python scripts/gdrive.py trash --id ID1 --id ID2 --id ID3

# PERMANENT DELETE — IRREVERSIBLE — DATA GONE FOREVER
# Requires typing the exact file name (single) or "delete N files" (bulk)
# Non-interactive mode is permanently disabled for this command
python scripts/gdrive.py delete --id FILE_ID

# View audit log of all destructive operations
python scripts/gdrive.py audit
```

### Non-interactive Trash (Scripts/CI only)

```bash
# The ONLY automation-friendly bypass — for TRASH only, never for permanent delete
# Must be set explicitly by a human in the environment
GDRIVE_CONFIRM_TRASH=yes python scripts/gdrive.py trash --id FILE_ID --confirm
```

---

## Output Format

**Markdown table (default):**
```
| Name           | Type        | Modified         | Size | Link   |
|----------------|-------------|------------------|------|--------|
| Budget 2025    | spreadsheet | 2025-03-05 10:23 | —    | [open] |
| Project Report | document    | 2025-03-01 14:11 | —    | [open] |
```

**JSON:**
```bash
python scripts/gdrive.py list --out json
```

---

## Environment Variables

`auth_setup.py` prints the exact export commands for your OS/shell after setup.
You do not need to write these manually.

| Variable | Default | Purpose |
|----------|---------|---------|
| `GDRIVE_CREDS` | `credentials.json` | Path to credentials.json — set by auth_setup.py |
| `GDRIVE_TOKEN` | `token.json` | Path to token.json — set by auth_setup.py |
| `GDRIVE_AUDIT_LOG` | `gdrive_audit.log` | Path to audit log |
| `GDRIVE_CONFIRM_TRASH` | _(unset)_ | Set to `yes` to allow non-interactive trash only |

---

## Agent Decision Tree

```
User requests a Drive operation
         |
         v
Is it READ-ONLY? (list, search, info, download)
   YES → run gdrive.py directly, no confirmation needed
   NO
         |
         v
Is it CREATE / UPDATE / UPLOAD / SHARE?
   YES → run gdrive.py directly, show result to user
   NO
         |
         v
Is it TRASH or DELETE?
   |
   TRASH  → 1) Warn user in chat, list affected items
           → 2) Get chat confirmation from user
           → 3) Run: python scripts/gdrive.py trash --id ...
           → 4) Script asks "yes" in terminal (user types it)
   |
   DELETE → 1) Warn user in chat: "THIS IS IRREVERSIBLE"
           → 2) List every file that will be permanently gone
           → 3) Get explicit chat confirmation
           → 4) Run: python scripts/gdrive.py delete --id ...
           → 5) Script asks user to type exact file name in terminal
           → NEVER run delete non-interactively under any circumstances
```

---

## Extended Reference Files

Load these on-demand only when the operation requires it:

| File | When to read |
|------|-------------|
| `references/file-crud.md` | batchUpdate patterns for Docs/Sheets/Slides content editing |
| `references/query-syntax.md` | Complex search queries, pagination, query operators |
| `references/mime-types.md` | MIME types and export formats for all file types |
| `references/sharing-permissions.md` | Sharing, revoking access, transferring ownership |

---

## For Non-Bash Agents (Gemini, API-only, raw LLM)

If you cannot run bash scripts:
1. Read `references/file-crud.md` for inline Python patterns and the auth snippet
2. The **safety rules still apply** — before calling `drive.files().delete()` or
   setting `body={"trashed": True}`, you must show the user what will be affected
   and get explicit confirmation in the conversation first
3. Log the action yourself if there is no safety.py available (timestamp + file name + outcome)
