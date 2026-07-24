import os
import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Configuration
SEOSONA_ROOT = Path(__file__).resolve().parent.parent.parent.parent
DAEMON_DIR = SEOSONA_ROOT / "1_CORE" / "scripts" / "system_daemons"
STATE_FILE = SEOSONA_ROOT / "3_MEMORY" / "errors" / "daemon_state.json"
STATE_FILE.parent.mkdir(parents=True, exist_ok=True)

DAEMONS = {
    "auto_linter": {
        "script": DAEMON_DIR / "auto_linter_daemon.py",
        "interval_hours": 0  # Run every boot
    },
    "github_sync": {
        "script": DAEMON_DIR / "github_sync_daemon.py",
        "interval_hours": 6  # Run every 6 hours
    },
    "memory_compression": {
        "script": DAEMON_DIR / "memory_compression_daemon.py",
        "interval_hours": 24 # Run every 24 hours
    },
    "eval_framework": {
        "script": DAEMON_DIR / "eval_daemon.py",
        "interval_hours": 0  # Run every boot to check eval_queue
    },
    "dreaming": {
        "script": DAEMON_DIR / "dreaming_daemon.py",
        "interval_hours": 12  # Learn from web every 12 hours
    },
    "predictive_scanner": {
        "script": DAEMON_DIR / "predictive_scanner.py",
        "interval_hours": 0  # Scan for anomalies every boot
    }
}

def load_state():
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def save_state(state):
    try:
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=4)
    except Exception:
        pass

def run_daemon(name, script_path):
    try:
        # Run sequentially but since this script is detached, it won't block the OS.
        subprocess.run([sys.executable, str(script_path)], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    state = load_state()
    now = datetime.now()
    
    for name, config in DAEMONS.items():
        if not config["script"].exists():
            continue
            
        last_run_str = state.get(name)
        should_run = False
        
        if config["interval_hours"] == 0:
            should_run = True
        elif not last_run_str:
            should_run = True
        else:
            try:
                last_run = datetime.fromisoformat(last_run_str)
                if now - last_run > timedelta(hours=config["interval_hours"]):
                    should_run = True
            except ValueError:
                should_run = True
                
        if should_run:
            success = run_daemon(name, config["script"])
            if success:
                state[name] = now.isoformat()
                save_state(state)

if __name__ == "__main__":
    main()
