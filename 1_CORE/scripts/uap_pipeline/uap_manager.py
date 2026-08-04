import time
import os
import sys
import io
import sqlite3
from pathlib import Path

# Fix Windows CP1252 console encoding for Vietnamese/Unicode repo names
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Import the modules
sys.path.append(str(Path(__file__).parent))

import importlib
finder = importlib.import_module("01_finder")
auditor = importlib.import_module("02_auditor")
security_guard = importlib.import_module("02b_security_guard")
assimilator = importlib.import_module("03_assimilator")
creator = importlib.import_module("04_creator")
cleanup = importlib.import_module("05_cleanup")

ROOT = Path(__file__).resolve().parents[3]
QUEUE_DB_PATH = (Path(__file__).resolve().parents[3] / "3_MEMORY" / "uap_queue.db")

def run_pipeline(max_loops=10):
    print("=== SEOSONA UAP FULLSTACK END-TO-END DAEMON ===")
    
    print("\n--- INITIALIZING QUEUE ---")
    try:
        finder.find_targets()
    except Exception as e:
        print(f"Skipping finder: {e}")
    
    loop_count = 0
    while loop_count < max_loops:
        loop_count += 1
        print(f"\n==========================================")
        print(f"=== UAP EXECUTION LOOP {loop_count}/{max_loops} ===")
        print(f"==========================================")
        
        # Check if queue has pending items
        if QUEUE_DB_PATH.exists():
            conn = sqlite3.connect(QUEUE_DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM queue WHERE status = 'PENDING'")
            pending = cursor.fetchone()[0]
            conn.close()
            if pending == 0:
                print("No more pending items in queue. Daemon shutting down.")
                break
        
        # Process 1 item end-to-end to conserve disk space. Each phase is isolated: one bad repo
        # (e.g. a Windows-invalid filename, an encoding error) is marked FAILED and the batch
        # continues — a single repo must never crash a 900-repo run.
        phases = [
            ("PHASE 1: AUDITOR (Clone & Extract)", lambda: auditor.run_auditor(max_items=1)),
            ("PHASE 1B: SECURITY GUARD (Threat Scan)", security_guard.run_security_guard),
            ("PHASE 2: ASSIMILATOR (LLM Analysis)", assimilator.run_assimilator),
            ("PHASE 3: CREATOR (Skill Generation)", creator.run_creator),
            ("PHASE 4: CLEANUP (Disk Management)", cleanup.run_cleanup),
        ]
        for label, fn in phases:
            print(f"\n--- {label} ---")
            try:
                fn()
            except Exception as e:
                print(f"[!] {label} errored on this repo: {e}")
                try:
                    conn = sqlite3.connect(QUEUE_DB_PATH)
                    # Mark only the SINGLE oldest in-flight repo FAILED — not a blanket UPDATE that
                    # would nuke every other legitimately-mid-flight row and lose their work.
                    conn.execute(
                        "UPDATE queue SET status='FAILED', retry_count = retry_count + 1 "
                        "WHERE id = (SELECT id FROM queue "
                        "           WHERE status IN ('CLONED','AUDITED','ASSIMILATED') "
                        "           ORDER BY id LIMIT 1)"
                    )
                    conn.commit()
                    conn.close()
                    print("    -> the in-flight repo was marked FAILED; continuing the batch.")
                except Exception as e2:
                    print(f"    -> could not mark FAILED: {e2}")
        
        print(f"\n[Loop {loop_count} completed. Sleeping 2 seconds before next item...]")
        time.sleep(2)
        
    print("\n=== DAEMON RUN COMPLETE ===")

def reconcile(apply=False):
    """Find rows whose status lies about what is on disk, and requeue them.

    The manager only ever loops on PENDING, so anything left in another state is stranded forever.
    Measured on the live queue: rows sitting in CURRENT with their clones never reclaimed, and 129
    rows marked COMPLETED with no knowledge item — because 04_creator turned a missing KI into
    `status='CREATED'`, i.e. into success. Nothing anywhere compares queue state against artefacts.

    Read-only by default; pass apply=True to write the requeue.
    """
    ki_dir = ROOT / "3_MEMORY" / "knowledge_items"
    conn = sqlite3.connect(QUEUE_DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT id, status, retry_count FROM queue").fetchall()

    stranded, missing_ki = [], []
    for r in rows:
        safe = r["id"].replace("/", "_")
        has_ki = (ki_dir / f"uap_{safe}.md").exists()
        if r["status"] in ("CURRENT", "AUDITED", "ASSIMILATED", "CREATED"):
            stranded.append(r["id"])            # mid-flight, nothing will ever pick these up
        elif r["status"] == "COMPLETED" and not has_ki:
            missing_ki.append(r["id"])          # claimed done, produced nothing
        elif r["status"] == "FAILED" and r["retry_count"] < 3:
            stranded.append(r["id"])            # retries remained but nothing retries FAILED

    print(f"  stranded mid-flight / retryable FAILED : {len(stranded)}")
    print(f"  COMPLETED with no knowledge item       : {len(missing_ki)}")
    for i in (stranded + missing_ki)[:8]:
        print(f"    - {i}")
    if len(stranded) + len(missing_ki) > 8:
        print(f"    … and {len(stranded) + len(missing_ki) - 8} more")

    if apply:
        ids = stranded + missing_ki
        conn.executemany(
            "UPDATE queue SET status='PENDING', retry_count=0 WHERE id=?", [(i,) for i in ids]
        )
        conn.commit()
        print(f"  -> requeued {len(ids)} rows as PENDING")
    else:
        print("  (dry run — pass --apply to requeue)")
    conn.close()


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="SEOSONA UAP pipeline daemon")
    ap.add_argument("--reconcile", action="store_true",
                    help="report rows whose status disagrees with the artefacts on disk")
    ap.add_argument("--apply", action="store_true", help="with --reconcile, write the requeue")
    ap.add_argument("--max-loops", type=int, default=50)
    args = ap.parse_args()

    if args.reconcile:
        reconcile(apply=args.apply)
    else:
        run_pipeline(max_loops=args.max_loops)
