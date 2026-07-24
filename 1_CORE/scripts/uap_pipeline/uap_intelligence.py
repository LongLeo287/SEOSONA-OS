"""
UAP intelligence layer — dedup/version, overlap→best-of-breed, and UAP self-improvement.

Three checks the creator consults per repo, all evidence-based (no fabrication):

1. check_duplicate  — has this repo already been ingested (into OS KI/skills/frameworks or a
   project namespace)? If so, is the incoming clone NEWER (by commit SHA) than what we recorded?
   -> CURRENT (skip), UPDATE (re-ingest), or NEW.

2. pick_champion    — does this repo's function already have a champion? Compare the incoming
   repo's signal (fit score + visits/priority) against the recorded champion. Winner becomes the
   champion; the other is recorded as a "learn-from" reference so its best ideas aren't lost.

3. is_uap_relevant  — does this repo itself improve the UAP (repo-ingestion / code-analysis /
   classification / knowledge-extraction)? If so, flag it so the run pauses to upgrade UAP.
"""

import json
import subprocess
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[3]
KI_DIR = _ROOT / "3_MEMORY" / "knowledge_items"
SKILLS_DIR = _ROOT / ".agents" / "skills"
FRAMEWORKS_DIR = _ROOT / "2_KNOWLEDGE" / "frameworks"
PROJECTS_MEM = _ROOT / "3_MEMORY" / "projects"
VERSION_DB = _ROOT / "3_MEMORY" / "uap_versions.json"
CHAMPION_DB = _ROOT / "3_MEMORY" / "uap_function_champions.json"

# A repo is UAP-relevant if its evidence matches these (then it can upgrade the pipeline itself).
_UAP_TOKENS = [
    "repo-ingest", "repo_ingest", "code-analysis", "code_analysis", "ast", "tree-sitter",
    "knowledge-extract", "knowledge_extract", "repomix", "gitingest", "repo2", "codebase",
    "classifier", "embedding-index", "sourcegraph", "ctags", "call-graph", "dependency-graph",
]


def _load(db):
    if db.exists():
        try:
            return json.loads(db.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def _save(db, data):
    db.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _clone_head(repo_dir):
    """Latest commit SHA of the freshly cloned repo (evidence of its version)."""
    try:
        r = subprocess.run(["git", "-C", str(repo_dir), "rev-parse", "HEAD"],
                           capture_output=True, text=True)
        return r.stdout.strip() if r.returncode == 0 else ""
    except Exception:
        return ""


def _already_ingested_paths(safe_name):
    """Where this repo already exists across OS + project namespaces (evidence of a dup)."""
    hits = []
    if (KI_DIR / f"uap_{safe_name}.md").exists():
        hits.append(KI_DIR / f"uap_{safe_name}.md")
    for fw in FRAMEWORKS_DIR.rglob(f"uap_{safe_name}.md"):
        hits.append(fw)
    for ns in PROJECTS_MEM.glob("*/knowledge_items/"):
        p = ns / f"uap_{safe_name}.md"
        if p.exists():
            hits.append(p)
    return hits


def check_duplicate(repo_id, safe_name, repo_dir):
    """Return dedup decision with evidence: {status: NEW|CURRENT|UPDATE, head, prev, paths}."""
    versions = _load(VERSION_DB)
    prev = versions.get(repo_id, {}).get("head", "")
    head = _clone_head(repo_dir)
    paths = [str(p.relative_to(_ROOT)) for p in _already_ingested_paths(safe_name)]

    if not paths and not prev:
        status = "NEW"
    elif prev and head and prev == head:
        status = "CURRENT"          # already have the exact same commit — skip re-ingest
    else:
        status = "UPDATE"           # exists but the clone is a different/newer commit
    return {"status": status, "head": head, "prev": prev, "paths": paths}


def record_version(repo_id, head):
    versions = _load(VERSION_DB)
    versions[repo_id] = {"head": head}
    _save(VERSION_DB, versions)


def pick_champion(function, repo_id, fit_score, priority=0):
    """Best-of-breed per function. Returns {is_champion, prev_champion, action}.
    action: CHAMPION (new best) | LEARN_FROM (keep existing champ, mine this one for ideas)."""
    champs = _load(CHAMPION_DB)
    cur = champs.get(function)
    signal = fit_score + int(priority or 0) / 10.0  # fit dominates; priority breaks ties
    if cur is None or signal > cur.get("signal", -1):
        champs[function] = {"repo": repo_id, "signal": signal, "fit": fit_score, "priority": priority}
        _save(CHAMPION_DB, champs)
        return {"is_champion": True, "prev_champion": (cur or {}).get("repo"), "action": "CHAMPION"}
    return {"is_champion": False, "prev_champion": cur.get("repo"), "action": "LEARN_FROM"}


def is_uap_relevant(audit_data):
    """Does this repo itself improve the UAP? Match evidence tokens. Returns matched tokens."""
    blob_parts = []
    for fpath, content in (audit_data.get("source_files", {}) or {}).items():
        blob_parts.append(fpath.lower())
    for line in (audit_data.get("tree", []) or []):
        blob_parts.append(line.lower())
    blob = "\n".join(blob_parts)
    return [t for t in _UAP_TOKENS if t in blob]


if __name__ == "__main__":
    print("champions:", _load(CHAMPION_DB))
    print("versions tracked:", len(_load(VERSION_DB)))
