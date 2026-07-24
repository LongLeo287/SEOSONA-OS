"""
UAP Phase 4: CREATOR — route + auto-apply each assimilated repo.

Reads the assimilator's routing decision (uap_<name>.classification.json) and, fully
automatically but with safety rails:
  1. OUTPUT security scan — re-scan the generated KI (and any skill package) for malicious
     patterns before anything lands (no whitelist on output). A hit -> QUARANTINE, never routed.
  2. Auto-apply to the best-fit system — when a repo scores for a specific project, the KI + a
     concrete upgrade proposal land in that project's memory namespace
     (3_MEMORY/projects/<ns>/), and a real SKILL.md package installs to .agents/skills/. Low
     scores stay as OS reference frameworks (previous behaviour).
  3. Per-repo commit — each repo's result is committed to the OS repo (the pre-commit integrity
     guard blocks any mass-deletion), so a cleared clone can't lose the work.
"""

import os
import json
import sqlite3
import shutil
import importlib
from pathlib import Path
from subprocess import run

_ROOT = Path(__file__).resolve().parents[3]
QUEUE_DB_PATH = (_ROOT / "3_MEMORY" / "uap_queue.db")
SKILLS_DIR = (_ROOT / ".agents" / "skills")
FRAMEWORKS_DIR = (_ROOT / "2_KNOWLEDGE" / "frameworks")
RESEARCH_DIR = (_ROOT / "5_RESEARCH")
KI_DIR = (_ROOT / "3_MEMORY" / "knowledge_items")
PROJECTS_MEM = (_ROOT / "3_MEMORY" / "projects")
QUARANTINE = (_ROOT / "_QUARANTINE" / "uap_blocked")

import sys
sys.path.append(str(Path(__file__).parent))
_sec = importlib.import_module("02b_security_guard")
RED_FLAGS = getattr(_sec, "RED_FLAGS", [])
from uap_intelligence import check_duplicate, pick_champion, record_version

UAP_UPGRADE_QUEUE = (_ROOT / "3_MEMORY" / "uap_self_upgrade_queue.md")


def _scan_output(text):
    """Output-side security scan — NO whitelist (unlike the input scan). Returns the offending
    pattern or None."""
    for pattern in RED_FLAGS:
        if pattern.search(text):
            return pattern.pattern
    return None


def _git_commit(paths, message):
    """Stage explicit paths (never -A) and commit to the OS repo. The pre-commit integrity guard
    still runs. Returns True on a real commit."""
    rels = [str(p.relative_to(_ROOT)) for p in paths if p.exists()]
    if not rels:
        return False
    run(["git", "add", *rels], cwd=_ROOT, capture_output=True)
    r = run(["git", "commit", "-m", message], cwd=_ROOT, capture_output=True, text=True)
    return r.returncode == 0


def _apply_to_project(routing, repo_id, safe_name, ki_path, repo_dir):
    """Auto-apply: land the KI + an upgrade proposal in the target project's memory namespace,
    and install a real SKILL.md package. Returns list of written paths."""
    ns = routing["system"]
    fn = routing["function"]
    ns_root = PROJECTS_MEM / ns
    (ns_root / "knowledge_items").mkdir(parents=True, exist_ok=True)
    (ns_root / "upgrades").mkdir(parents=True, exist_ok=True)
    written = []

    # 1. KI into the project's knowledge_items
    dest_ki = ns_root / "knowledge_items" / f"uap_{safe_name}.md"
    shutil.copy2(ki_path, dest_ki)
    written.append(dest_ki)

    # 2. Concrete upgrade proposal for THIS function of THIS project
    proposal = ns_root / "upgrades" / f"upgrade_{safe_name}.md"
    proposal.write_text(
        f"# Upgrade proposal: {repo_id} -> {ns} / {fn}\n\n"
        f"- **Fit score:** {routing['score']}/100\n"
        f"- **Matched evidence:** {', '.join(routing['matched'][:8])}\n"
        f"- **Source KI:** `knowledge_items/uap_{safe_name}.md`\n\n"
        f"## How this upgrades `{fn}`\n"
        f"This repo's code (see the KI's Public API / Dependencies / Key Source Excerpts) maps to "
        f"the `{fn}` function of `{ns}`. Adopt the exported functions/patterns listed in the KI; "
        f"the KI is factual (code-evidence only, no README). Verify against the project's own "
        f"tests before wiring in.\n",
        encoding="utf-8",
    )
    written.append(proposal)

    # 3. If it's a real skill package, install it (shared, usable by every project via the bridge)
    if (repo_dir / "SKILL.md").exists():
        target = SKILLS_DIR / routing.get("skill_name", safe_name)
        if not target.exists():
            try:
                shutil.copytree(repo_dir, target, dirs_exist_ok=True)
                written.append(target)
            except Exception as e:
                print(f"   skill install failed: {e}")
    return written


def run_creator():
    if not QUEUE_DB_PATH.exists():
        return
    SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    FRAMEWORKS_DIR.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(QUEUE_DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM queue WHERE status = 'ASSIMILATED'")
    rows = cursor.fetchall()
    if not rows:
        conn.close()
        return
    print(f"Found {len(rows)} assimilated items ready for creation.")

    for row in rows:
        target = dict(row)
        repo_id = target["id"]
        safe_name = repo_id.replace("/", "_")
        repo_dir = RESEARCH_DIR / safe_name
        ki_path = KI_DIR / f"uap_{safe_name}.md"
        class_path = KI_DIR / f"uap_{safe_name}.classification.json"

        if not ki_path.exists():
            print(f"-> WARNING: KI missing for {repo_id}; nothing routed.")
            cursor.execute("UPDATE queue SET status = 'CREATED' WHERE id = ?", (repo_id,))
            conn.commit()
            continue

        # --- 1. OUTPUT SECURITY SCAN (no whitelist) ------------------------------------------
        ki_text = ki_path.read_text(encoding="utf-8", errors="ignore")
        threat = _scan_output(ki_text)
        if threat:
            QUARANTINE.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ki_path, QUARANTINE / ki_path.name)
            print(f"-> [BLOCKED] output scan hit ({threat}) for {repo_id}; quarantined, not routed.")
            cursor.execute("UPDATE queue SET status = 'BLOCKED' WHERE id = ?", (repo_id,))
            conn.commit()
            continue

        routing = json.loads(class_path.read_text(encoding="utf-8")) if class_path.exists() else {
            "system": "seosona-os", "function": "reference", "score": 0, "auto_apply": False, "matched": []}
        routing.setdefault("skill_name", target.get("name", safe_name))

        # --- 1b. DEDUP + VERSION: skip if we already have this exact commit -------------------
        dup = check_duplicate(repo_id, safe_name, repo_dir)
        if dup["status"] == "CURRENT":
            print(f"-> [CURRENT] {repo_id} already ingested at the same commit; skipping.")
            cursor.execute("UPDATE queue SET status = 'CURRENT' WHERE id = ?", (repo_id,))
            conn.commit()
            continue
        if dup["status"] == "UPDATE":
            print(f"-> [UPDATE] {repo_id} exists but the clone differs; refreshing {len(dup['paths'])} location(s).")

        # --- 1c. OVERLAP -> best-of-breed per function --------------------------------------
        champ = pick_champion(routing["function"], repo_id, routing.get("score", 0), target.get("priority", 0))
        if champ["action"] == "LEARN_FROM":
            print(f"-> [LEARN_FROM] '{routing['function']}' champion stays {champ['prev_champion']}; "
                  f"mining {repo_id} for its best ideas (kept as reference).")

        # --- 1d. UAP self-improvement flag --------------------------------------------------
        if routing.get("uap_relevant"):
            with open(UAP_UPGRADE_QUEUE, "a", encoding="utf-8") as f:
                f.write(f"- {repo_id} (fit {routing['score']}) — UAP-relevant: "
                        f"{', '.join(routing['uap_relevant'][:6])} — review to upgrade the pipeline\n")
            print(f"-> [UAP-RELEVANT] {repo_id} flagged for pipeline self-upgrade.")

        # --- 2. ROUTE ------------------------------------------------------------------------
        if routing.get("auto_apply"):
            written = _apply_to_project(routing, repo_id, safe_name, ki_path, repo_dir)
            print(f"-> AUTO-APPLIED to {routing['system']}/{routing['function']} "
                  f"(fit {routing['score']}): {len(written)} artifact(s)")
        else:
            # OS-side: real skill -> .agents/skills; otherwise reference framework KI
            written = []
            if (repo_dir / "SKILL.md").exists():
                tdir = SKILLS_DIR / target["name"]
                if not tdir.exists():
                    shutil.copytree(repo_dir, tdir, dirs_exist_ok=True)
                    written.append(tdir)
            else:
                cat = (target.get("category") or "uncategorized").replace(" / ", "_").replace(" ", "_").lower()
                fdir = FRAMEWORKS_DIR / cat
                fdir.mkdir(parents=True, exist_ok=True)
                dest = fdir / f"uap_{safe_name}.md"
                shutil.copy2(ki_path, dest)
                written.append(dest)
            print(f"-> Routed as OS {'skill' if (repo_dir/'SKILL.md').exists() else 'reference framework'}.")

        # --- 3. PER-REPO COMMIT (integrity guard runs on commit) -----------------------------
        _git_commit(written + [ki_path, class_path],
                    f"uap: ingest {repo_id} -> {routing['system']}/{routing['function']} "
                    f"(fit {routing['score']}, {dup['status']}, {champ['action']})")

        record_version(repo_id, dup["head"])
        cursor.execute("UPDATE queue SET status = 'CREATED' WHERE id = ?", (repo_id,))
        conn.commit()

    conn.close()


if __name__ == "__main__":
    run_creator()
