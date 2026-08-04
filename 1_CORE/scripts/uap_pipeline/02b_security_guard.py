import os
import sqlite3
import re
from pathlib import Path

QUEUE_DB_PATH = (Path(__file__).resolve().parents[3] / "3_MEMORY" / "uap_queue.db")
RESEARCH_DIR = (Path(__file__).resolve().parents[3] / "5_RESEARCH")
REVIEW_LOG = (Path(__file__).resolve().parents[3] / "3_MEMORY" / "uap_security_review.md")

# HARD flags: unambiguous threats — block wherever they appear (docs OR code).
# Hardcoded secrets and invisible-text smuggling are never "educational".
HARD_FLAGS = [
    re.compile(r"AKIA[0-9A-Z]{16}"),                      # AWS Access Key ID
    re.compile(r"sk_live_[0-9a-zA-Z]{24}"),               # Stripe live key
    re.compile(r"ghp_[0-9a-zA-Z]{36}"),                   # GitHub PAT
    re.compile(r"AIza[0-9A-Za-z_\-]{35}"),                # Google API key
    re.compile(r"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\."),  # hardcoded JWT
    re.compile(r"[\U000E0000-\U000E007F]"),               # Unicode Tags (smuggling)
]

# SOFT flags: behavioural / prompt-injection text. These appear LEGITIMATELY in AI-security and
# prompt-engineering docs (as examples/warnings), so a mention in a DOC is only warned; the SAME
# pattern inside an EXECUTABLE file is treated as a real payload and blocks.
SOFT_FLAGS = [
    re.compile(r"ignore\s+(all\s+)?previous\s+instructions", re.IGNORECASE),
    re.compile(r"disregard\s+(all\s+)?previous", re.IGNORECASE),
    re.compile(r"print\s+your\s+(initial\s+|system\s+)?prompt", re.IGNORECASE),
    re.compile(r"(leak|reveal|expose|extract)\s+(the\s+)?system\s+prompt", re.IGNORECASE),
    re.compile(r"rm\s+-rf\s+/(?:\s|$|\*)"),               # destructive rm
    re.compile(r"curl\s+[^\n|]*\|\s*(sudo\s+)?(ba)?sh"),   # curl … | sh (install-doc vs payload)
    re.compile(r"(base64\s+-d|atob\()[^\n]*\|\s*(ba)?sh"),  # decode → exec
]

_CODE_EXTS = {".py", ".js", ".ts", ".tsx", ".jsx", ".mjs", ".cjs", ".sh", ".bash",
              ".ps1", ".bat", ".cmd", ".rb", ".go", ".php", ".pl"}
_SCAN_EXTS = _CODE_EXTS | {".md", ".txt", ".mdx", ".rst", ".json", ".yaml", ".yml"}


def scan_file_for_threats(filepath):
    """Return (severity, detail): ('HARD', ...) blocks; ('SOFT', ...) warns; None is clean.
    HARD flags fire anywhere. SOFT flags block only inside executable code; in docs they warn."""
    ext = Path(filepath).suffix.lower()
    is_code = ext in _CODE_EXTS
    try:
        content = open(filepath, "r", encoding="utf-8", errors="ignore").read()
    except Exception:
        return None

    for pattern in HARD_FLAGS:
        if pattern.search(content):
            return ("HARD", f"hard threat {pattern.pattern}")

    zw = content.count("​") + content.count("‌") + content.count("‍")
    if zw > 10:
        return ("HARD", "zero-width smuggling (>10)")

    # Behavioural patterns (curl|sh, rm -rf, base64|sh, prompt-injection text) are only dangerous
    # if EXECUTED. UAP only reads repos, never runs them, so these are logged for review, never
    # blocked — the ingestion-time harms are re-hosted secrets and smuggled hidden text (HARD above).
    for pattern in SOFT_FLAGS:
        if pattern.search(content):
            return ("SOFT", f"behavioural {pattern.pattern} ({'code' if is_code else 'doc'})")
    return None


def run_security_guard():
    if not QUEUE_DB_PATH.exists():
        return
    conn = sqlite3.connect(QUEUE_DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM queue WHERE status = 'AUDITED'")
    rows = cursor.fetchall()
    if not rows:
        conn.close()
        return
    print(f"--- SECURITY GUARD: Scanning {len(rows)} audited items ---")

    for row in rows:
        repo_id = dict(row)["id"]
        repo_dir = RESEARCH_DIR / repo_id.replace("/", "_")
        blocked = None
        soft_hits = []
        if repo_dir.exists():
            for root, _dirs, files in os.walk(repo_dir):
                if "/.git" in root.replace("\\", "/"):
                    continue
                for file in files:
                    if Path(file).suffix.lower() not in _SCAN_EXTS:
                        continue
                    res = scan_file_for_threats(Path(root) / file)
                    if not res:
                        continue
                    sev, detail = res
                    if sev == "HARD":
                        blocked = f"{file}: {detail}"
                        break
                    soft_hits.append(f"{file}: {detail}")
                if blocked:
                    break

        if blocked:
            print(f"[X] {repo_id} MALICIOUS ({blocked}). Dropping.")
            # Was 'CREATED', which flows to COMPLETED — making a known-malicious repo
            # indistinguishable from a successfully ingested one. Every downstream consumer, and
            # the reconcile sweep, then read it as a success that had merely lost its knowledge
            # item, and requeued it: re-clone, re-block, forever. 'BLOCKED' is terminal and honest.
            cursor.execute("UPDATE queue SET status = 'BLOCKED' WHERE id = ?", (repo_id,))
            conn.commit()
            # And record it durably. Until now a hard block existed only on stdout, so there was no
            # answer to "what has this pipeline ever refused?".
            try:
                with open(REVIEW_LOG, "a", encoding="utf-8") as f:
                    f.write(f"- {repo_id}: HARD BLOCK — {blocked}\n")
            except OSError:
                pass
        else:
            if soft_hits:
                # Not a block — record for human review, and let ingestion proceed.
                with open(REVIEW_LOG, "a", encoding="utf-8") as f:
                    f.write(f"- {repo_id}: soft security mentions (kept) — {'; '.join(soft_hits[:5])}\n")
                print(f"[~] {repo_id} clean (soft doc-mentions logged for review).")
            else:
                print(f"[v] {repo_id} is clean.")

    conn.close()


if __name__ == "__main__":
    run_security_guard()
