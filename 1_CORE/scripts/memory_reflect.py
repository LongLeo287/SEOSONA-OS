"""
Memory Reflection / Dedup — EverOS-inspired consolidation for 3_MEMORY/knowledge_items.

The recurring "knowledge pile" problem: the UAP ingester writes a Knowledge Item per
repo, but the same repo gets ingested under several filenames (e.g. uap_deer-flow.md +
uap_bytedance_deer-flow.md), and some KIs are byte-identical. EverOS's offline
"reflection that merges episode clusters" applied here:

  - exact dupes  : same content hash -> keep one, quarantine the rest
  - alias dupes  : different filenames that canonicalize to the same repo/topic

Read-only by default (reports). `--merge` moves the redundant copies (newest/largest
kept) into 3_MEMORY/_dedup_archive/ so nothing is lost.

  python 1_CORE/scripts/memory_reflect.py            # report
  python 1_CORE/scripts/memory_reflect.py --merge    # consolidate
"""
import sys
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
KI_DIR = ROOT / "3_MEMORY" / "knowledge_items"
ARCHIVE = ROOT / "3_MEMORY" / "_dedup_archive"


def _repo_id(name: str) -> str:
    """Full repo identity from a KI filename — keeps owner_repo (no lossy collapse)."""
    b = name[:-3] if name.endswith(".md") else name
    b = b.lower()
    for p in ("uap_", "ki_", "ingestion_"):
        if b.startswith(p):
            b = b[len(p):]
    return b.strip("-_ ")


def _is_alias(a: str, b: str) -> bool:
    """True only when one id is a path-boundary suffix of the other, e.g.
    'deer-flow' vs 'bytedance_deer-flow' (same repo, owner-prefixed). This deliberately
    does NOT match 'googleworkspace_cli' vs 'larksuite_cli' (different repos sharing a
    trailing word) or date-suffixed batch files."""
    if a == b:
        return False
    short, long = (a, b) if len(a) < len(b) else (b, a)
    # require the short id to look like a real repo name, not a bare common word/number
    if len(short) < 4 or short.isdigit() or "-" not in short and "_" not in short and len(short) < 6:
        return False
    return long.endswith("_" + short) or long.endswith("-" + short)


def _scan():
    files = sorted(KI_DIR.glob("*.md"))
    by_hash = {}
    ids = []
    for f in files:
        try:
            data = f.read_bytes()
        except Exception:
            continue
        by_hash.setdefault(hashlib.md5(data).hexdigest(), []).append(f)
        ids.append((f, _repo_id(f.name)))
    exact = {h: fs for h, fs in by_hash.items() if len(fs) > 1}
    # alias: pairwise suffix match (precise, advisory only)
    alias = {}
    for i, (fa, ida) in enumerate(ids):
        for fb, idb in ids[i + 1:]:
            if _is_alias(ida, idb):
                key = min(ida, idb, key=len)
                alias.setdefault(key, set()).update({fa, fb})
    alias = {k: sorted(v) for k, v in alias.items()}
    return files, exact, alias


def _keep(group):
    """Pick the file to keep: largest, then newest."""
    return max(group, key=lambda f: (f.stat().st_size, f.stat().st_mtime))


def main(merge=False):
    if not KI_DIR.exists():
        print(f"[reflect] no knowledge_items dir at {KI_DIR}")
        return 0
    files, exact, alias = _scan()
    redundant = set()
    print(f"[reflect] scanned {len(files)} knowledge items.")

    print(f"\n== exact-duplicate clusters: {len(exact)} ==")
    for fs in exact.values():
        keep = _keep(fs)
        for f in fs:
            if f != keep:
                redundant.add(f)
        print(f"  keep {keep.name}  | drop {[f.name for f in fs if f != keep]}")

    print(f"\n== alias clusters (same repo, owner-prefixed vs not): {len(alias)} — ADVISORY, review by hand ==")
    for c, fs in sorted(alias.items()):
        keep = _keep(fs)
        print(f"  [{c}] keep {keep.name} | alias {[f.name for f in fs if f != keep]}")
    if alias:
        print("  (alias clusters are NOT auto-merged — content may differ; merge manually if truly redundant.)")

    print(f"\n[reflect] exact-redundant files (safe to archive): {len(redundant)}")
    if merge and redundant:
        ARCHIVE.mkdir(parents=True, exist_ok=True)
        for f in sorted(redundant):
            try:
                f.rename(ARCHIVE / f.name)
            except Exception as e:
                print(f"  ! could not move {f.name}: {e}")
        print(f"[reflect] moved {len(redundant)} redundant KIs -> {ARCHIVE.relative_to(ROOT)}")
    elif redundant:
        print("[reflect] run with --merge to consolidate (redundant copies archived, not deleted).")
    return 0


if __name__ == "__main__":
    sys.exit(main(merge="--merge" in sys.argv))
