#!/usr/bin/env python3
"""
safety.py — MANDATORY SAFETY GUARDRAILS FOR GOOGLE DRIVE OPERATIONS.

██████████████████████████████████████████████████████████████████████████
  CRITICAL: THIS MODULE GOVERNS ALL DESTRUCTIVE OPERATIONS ON GOOGLE DRIVE.
  NO AI AGENT, SCRIPT, OR AUTOMATED PROCESS MAY BYPASS THESE CHECKS.
  EVERY DELETE / TRASH / PERMANENT-DELETE MUST PASS THROUGH THIS MODULE.
  VIOLATION = DATA LOSS. THERE IS NO UNDO FOR PERMANENT DELETION.
██████████████████████████████████████████████████████████████████████████

Rules enforced by this module:
  1. TRASH requires explicit user confirmation (typed "yes" or --confirm flag)
  2. PERMANENT DELETE requires typed confirmation of the exact file/folder name
  3. BULK operations (>1 item) require COUNT confirmation ("delete 5 files")
  4. NO AI may call _execute_trash() or _execute_permanent_delete() directly —
     they must go through confirm_trash() or confirm_permanent_delete()
  5. All destructive actions are logged to gdrive_audit.log with timestamp
"""

import sys
import os
import json
import logging
from datetime import datetime, timezone

AUDIT_LOG = os.environ.get("GDRIVE_AUDIT_LOG", "gdrive_audit.log")

# ─── Audit Logger ─────────────────────────────────────────────────────────────

def _audit(action: str, target_id: str, target_name: str, outcome: str, actor: str = "user"):
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor":     actor,
        "action":    action,
        "target_id": target_id,
        "target_name": target_name,
        "outcome":   outcome,
    }
    with open(AUDIT_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")

# ─── Warning Banner ───────────────────────────────────────────────────────────

TRASH_BANNER = """
╔══════════════════════════════════════════════════════════════════╗
║                  ⚠️  DESTRUCTIVE OPERATION WARNING  ⚠️           ║
╠══════════════════════════════════════════════════════════════════╣
║  You are about to TRASH the following item(s) on Google Drive.  ║
║  Trashed items can be restored from Trash within 30 days.       ║
╚══════════════════════════════════════════════════════════════════╝
"""

PERMANENT_BANNER = """
╔══════════════════════════════════════════════════════════════════╗
║              🚨  PERMANENT DELETION — IRREVERSIBLE  🚨           ║
╠══════════════════════════════════════════════════════════════════╣
║  You are about to PERMANENTLY DELETE item(s) from Google Drive. ║
║  THIS CANNOT BE UNDONE. THE DATA WILL BE LOST FOREVER.          ║
║  No recovery is possible after this action.                     ║
╚══════════════════════════════════════════════════════════════════╝
"""

# ─── Core Guard Functions ─────────────────────────────────────────────────────

def confirm_trash(items: list[dict], non_interactive: bool = False) -> bool:
    """
    Gate for TRASH operations. items = [{"id": "...", "name": "..."}]

    non_interactive mode (for CI/scripts):
        Set env var GDRIVE_CONFIRM_TRASH=yes  (MUST be set by human explicitly)
        Logs a warning that confirmation was bypassed non-interactively.

    Returns True only if user confirmed. Never raises — returns False on any doubt.
    """
    print(TRASH_BANNER)
    print(f"  Items to be trashed ({len(items)}):")
    for item in items:
        print(f"    • [{item['id']}] {item['name']}")

    if len(items) > 1:
        print(f"\n  ⚠️  This will trash {len(items)} items.")

    # Non-interactive mode: ONLY if human explicitly set the env var
    if non_interactive:
        env_confirm = os.environ.get("GDRIVE_CONFIRM_TRASH", "").strip().lower()
        if env_confirm == "yes":
            print("\n[WARN] Non-interactive confirmation via GDRIVE_CONFIRM_TRASH env var.")
            for item in items:
                _audit("TRASH", item["id"], item["name"], "CONFIRMED (non-interactive)")
            return True
        else:
            print("\n[BLOCKED] Non-interactive trash requires GDRIVE_CONFIRM_TRASH=yes env var.")
            print("          Set it explicitly if you intend to trash these items.")
            for item in items:
                _audit("TRASH", item["id"], item["name"], "BLOCKED (non-interactive, no env var)")
            return False

    # Interactive confirmation
    print("\n  Type 'yes' to confirm trash, anything else to cancel: ", end="", flush=True)
    try:
        answer = input().strip().lower()
    except (EOFError, KeyboardInterrupt):
        print("\n[CANCELLED] Operation cancelled.")
        for item in items:
            _audit("TRASH", item["id"], item["name"], "CANCELLED (interrupted)")
        return False

    if answer == "yes":
        for item in items:
            _audit("TRASH", item["id"], item["name"], "CONFIRMED")
        return True
    else:
        print("[CANCELLED] Trash operation cancelled. No changes made.")
        for item in items:
            _audit("TRASH", item["id"], item["name"], "CANCELLED (user declined)")
        return False


def confirm_permanent_delete(items: list[dict], non_interactive: bool = False) -> bool:
    """
    Gate for PERMANENT DELETE operations.

    For a SINGLE item: user must type the exact file/folder name.
    For MULTIPLE items: user must type the exact count ("delete 5 files").

    Non-interactive permanent deletion is NEVER allowed — not even with env vars.
    This is intentional and cannot be overridden by any flag or environment variable.
    """
    print(PERMANENT_BANNER)
    print(f"  Items to be PERMANENTLY DELETED ({len(items)}):")
    for item in items:
        print(f"    • [{item['id']}] {item['name']}")

    # Non-interactive: ALWAYS BLOCKED for permanent delete — no exceptions
    if non_interactive:
        print("\n[HARD BLOCK] Permanent deletion is NEVER allowed in non-interactive mode.")
        print("             An AI or script cannot permanently delete files without a human")
        print("             physically typing confirmation in the terminal.")
        for item in items:
            _audit("PERMANENT_DELETE", item["id"], item["name"], "HARD BLOCKED (non-interactive)")
        return False

    if len(items) == 1:
        name = items[0]["name"]
        print(f'\n  To confirm, type the exact file name: "{name}"')
        print("  > ", end="", flush=True)
        try:
            answer = input().strip()
        except (EOFError, KeyboardInterrupt):
            print("\n[CANCELLED]")
            _audit("PERMANENT_DELETE", items[0]["id"], name, "CANCELLED (interrupted)")
            return False

        if answer == name:
            _audit("PERMANENT_DELETE", items[0]["id"], name, "CONFIRMED")
            print("[CONFIRMED] Proceeding with permanent deletion...")
            return True
        else:
            print(f'[CANCELLED] Name mismatch. Expected "{name}", got "{answer}".')
            _audit("PERMANENT_DELETE", items[0]["id"], name, "CANCELLED (name mismatch)")
            return False

    else:
        count = len(items)
        expected = f"delete {count} files"
        print(f'\n  To confirm bulk deletion of {count} items, type: "{expected}"')
        print("  > ", end="", flush=True)
        try:
            answer = input().strip().lower()
        except (EOFError, KeyboardInterrupt):
            print("\n[CANCELLED]")
            for item in items:
                _audit("PERMANENT_DELETE", item["id"], item["name"], "CANCELLED (interrupted)")
            return False

        if answer == expected:
            for item in items:
                _audit("PERMANENT_DELETE", item["id"], item["name"], "CONFIRMED (bulk)")
            print("[CONFIRMED] Proceeding with permanent deletion of all items...")
            return True
        else:
            print(f'[CANCELLED] Expected "{expected}", got "{answer}".')
            for item in items:
                _audit("PERMANENT_DELETE", item["id"], item["name"], "CANCELLED (bulk mismatch)")
            return False


def view_audit_log(last_n: int = 20):
    """Print the last N audit log entries as a Markdown table."""
    if not os.path.exists(AUDIT_LOG):
        print("_No audit log found._")
        return
    with open(AUDIT_LOG) as f:
        entries = [json.loads(line) for line in f if line.strip()]
    entries = entries[-last_n:]
    print(f"| Timestamp | Action | Name | Outcome |")
    print(f"|-----------|--------|------|---------|")
    for e in entries:
        ts   = e.get("timestamp","")[:19].replace("T"," ")
        act  = e.get("action","")
        name = e.get("target_name","")
        out  = e.get("outcome","")
        print(f"| {ts} | {act} | {name} | {out} |")
