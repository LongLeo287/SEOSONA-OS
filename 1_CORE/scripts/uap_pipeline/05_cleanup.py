import os
import sqlite3
import shutil
import time
import stat
import argparse
from pathlib import Path

QUEUE_DB_PATH = (Path(__file__).resolve().parents[3] / "3_MEMORY" / "uap_queue.db")
RESEARCH_DIR = (Path(__file__).resolve().parents[3] / "5_RESEARCH")
INGESTION_ZONE = (Path(__file__).resolve().parents[3] / "3_MEMORY" / "ingestion_zone")


def force_delete_dir(dir_path):
    # Retry mechanism for Windows File Locks
    max_retries = 3

    def remove_readonly(func, path, excinfo):
        os.chmod(path, stat.S_IWRITE)
        func(path)

    for attempt in range(max_retries):
        try:
            shutil.rmtree(dir_path, onerror=remove_readonly)
            return True
        except Exception as e:
            print(f"Cleanup attempt {attempt+1} failed for {dir_path}: {e}")
            time.sleep(2)  # Wait for Windows Defender/Indexer to release the lock

    # Final best-effort pass (no shell — avoids command-string injection on paths).
    shutil.rmtree(dir_path, ignore_errors=True)
    if Path(dir_path).exists():
        print(f"PERSISTENT LOCK: could not remove {dir_path} after {max_retries} attempts.")
        return False
    return True


def cleanup_created_repos():
    """Remove 5_RESEARCH clones for queue rows that reached CREATED, then mark COMPLETED."""
    if not QUEUE_DB_PATH.exists():
        return 0

    conn = sqlite3.connect(QUEUE_DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    # BLOCKED is included so a security-rejected repo still gets its clone reclaimed. It used to be
    # marked CREATED purely to reach this selector, which is what made a block look like a success.
    cursor.execute("SELECT * FROM queue WHERE status IN ('CREATED', 'BLOCKED')")
    created_items = cursor.fetchall()

    if not created_items:
        conn.close()
        return 0

    print(f"Found {len(created_items)} fully created items ready for cleanup.")
    cleaned = 0
    for row in created_items:
        repo_id = dict(row)['id']
        repo_dir = RESEARCH_DIR / repo_id.replace('/', '_')
        if repo_dir.exists():
            print(f"Cleaning up {repo_dir}...")
            if force_delete_dir(repo_dir):
                cleaned += 1
                print("-> Cleanup successful.")
            else:
                print(f"-> ERROR: Could not clean up {repo_dir}")
        # BLOCKED is terminal: reclaim the disk, but never promote a security rejection to
        # COMPLETED — that is precisely what made a block look like a successful ingest.
        if row["status"] != "BLOCKED":
            cursor.execute("UPDATE queue SET status = 'COMPLETED' WHERE id = ?", (repo_id,))
            conn.commit()
    conn.close()
    return cleaned


def sweep_ingestion_zone(dry_run=True):
    """Purge orphaned raw clones left in 3_MEMORY/ingestion_zone.

    Only directories that contain a nested `.git` (i.e. raw git clones) are
    removed. Hand-written files (README.md, *.md notes) and non-clone folders are
    preserved. The UAP queue lifecycle never touched this staging area, so these
    clones accumulate indefinitely without this sweep.
    """
    if not INGESTION_ZONE.exists():
        return 0

    targets = []
    for child in sorted(INGESTION_ZONE.iterdir()):
        if child.is_dir() and (child / ".git").exists():
            targets.append(child)

    if not targets:
        print("[ingestion-zone] No orphaned clones (dirs with nested .git) found.")
        return 0

    print(f"[ingestion-zone] {len(targets)} orphaned clone(s) found"
          f"{' (dry-run, nothing removed)' if dry_run else ''}:")
    removed = 0
    for d in targets:
        if dry_run:
            print(f"  would remove: {d.name}/")
        else:
            print(f"  removing: {d.name}/ ...")
            if force_delete_dir(d):
                removed += 1
    return removed


def run_cleanup(purge_ingestion=False, dry_run=False):
    cleanup_created_repos()
    if purge_ingestion:
        sweep_ingestion_zone(dry_run=dry_run)
    else:
        # Surface the leftover count even when not purging, so it isn't silently ignored.
        sweep_ingestion_zone(dry_run=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UAP Step 5: Cleanup")
    parser.add_argument("--purge-ingestion", action="store_true",
                        help="Also delete orphaned raw clones in 3_MEMORY/ingestion_zone")
    parser.add_argument("--dry-run", action="store_true",
                        help="With --purge-ingestion, only preview what would be removed")
    args = parser.parse_args()
    run_cleanup(purge_ingestion=args.purge_ingestion, dry_run=args.dry_run)
