import sqlite3
import urllib.request
import json
import time
import sys
from pathlib import Path
from datetime import datetime

# SEOSONA OS Config
SEOSONA_ROOT = Path(__file__).resolve().parent.parent.parent.parent
DB_PATH = SEOSONA_ROOT / "3_MEMORY" / "uap_queue.db"
LOG_DIR = SEOSONA_ROOT / "3_MEMORY" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": "SEOSONA-OS-Daemon/1.0",
    "Accept": "application/vnd.github.v3+json"
}

def log_msg(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{ts}] [GithubSyncDaemon] {msg}"
    print(formatted)
    with open(LOG_DIR / "daemons.log", "a", encoding="utf-8") as f:
        f.write(formatted + "\n")

def check_existing_repos(cursor):
    """Check existing ingested repos for new commits"""
    log_msg("Starting sync check for existing repositories...")
    cursor.execute("SELECT id, status, last_commit_hash FROM queue WHERE status IN ('COMPLETED', 'SKILLIZED')")
    repos = cursor.fetchall()
    
    for repo_id, status, last_hash in repos:
        try:
            # Get latest commit on main/master
            url = f"https://api.github.com/repos/{repo_id}/commits"
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                if data and len(data) > 0:
                    latest_commit = data[0]['sha']
                    if latest_commit != last_hash:
                        log_msg(f"Update detected for {repo_id}: {last_hash} -> {latest_commit}")
                        cursor.execute("""
                            UPDATE queue 
                            SET status = 'PENDING', last_commit_hash = ?, last_sync_time = ?
                            WHERE id = ?
                        """, (latest_commit, datetime.now().isoformat(), repo_id))
                    else:
                        log_msg(f"{repo_id} is up to date.")
        except urllib.error.HTTPError as e:
            if e.code == 403:
                log_msg(f"Rate limited by GitHub API. Halting sync for {repo_id}.")
                break
            log_msg(f"HTTP Error checking {repo_id}: {e.code}")
        except Exception as e:
            log_msg(f"Error checking {repo_id}: {str(e)}")
        
        # Rate limit protection (60/hr without token)
        time.sleep(2)

def discover_trending_repos(cursor):
    """Find trending AI/Agent repositories"""
    log_msg("Searching for trending AI repositories...")
    try:
        url = "https://api.github.com/search/repositories?q=stars:>1000+topic:agent+topic:ai&sort=stars&order=desc"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            items = data.get('items', [])
            
            for item in items[:10]: # Top 10
                repo_id = item['full_name']
                repo_name = item['name']
                repo_url = item['html_url']
                
                cursor.execute("SELECT 1 FROM queue WHERE id = ?", (repo_id,))
                if not cursor.fetchone():
                    log_msg(f"Discovered new high-value repo: {repo_id}")
                    cursor.execute("""
                        INSERT INTO queue (id, name, url, category, tier, status)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (repo_id, repo_name, repo_url, "AI/Agent", "DISCOVERED", "PENDING"))
    except urllib.error.HTTPError as e:
        if e.code == 403:
            log_msg("Rate limited by GitHub API during discovery.")
    except Exception as e:
        log_msg(f"Error discovering repos: {str(e)}")

def main():
    if not DB_PATH.exists():
        log_msg(f"Error: Database not found at {DB_PATH}")
        sys.exit(1)
        
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    check_existing_repos(cursor)
    discover_trending_repos(cursor)
    
    conn.commit()
    conn.close()
    log_msg("Daemon cycle complete.")

if __name__ == "__main__":
    main()
