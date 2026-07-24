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
                    conn.execute(
                        "UPDATE queue SET status='FAILED' "
                        "WHERE status IN ('CLONED','AUDITED','ASSIMILATED')"
                    )
                    conn.commit()
                    conn.close()
                    print("    -> in-flight repo marked FAILED; continuing the batch.")
                except Exception as e2:
                    print(f"    -> could not mark FAILED: {e2}")
        
        print(f"\n[Loop {loop_count} completed. Sleeping 2 seconds before next item...]")
        time.sleep(2)
        
    print("\n=== DAEMON RUN COMPLETE ===")

if __name__ == "__main__":
    run_pipeline(max_loops=50) # Process in batches of 50
