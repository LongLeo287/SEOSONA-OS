"""
SEOSONA OS Episodic Memory.
Tracks user preferences, behavioral feedback, and past mistakes to 
personalize the OS experience over time.
"""

import os
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent.parent.parent
EPISODIC_DIR = ROOT / "3_MEMORY" / "episodic"
PREFS_FILE = EPISODIC_DIR / "user_preferences.jsonl"

def _ensure_init():
    EPISODIC_DIR.mkdir(parents=True, exist_ok=True)

def record_preference(category: str, preference: str, context: str = ""):
    """Save a user preference or lesson learned."""
    _ensure_init()
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "category": category,
        "preference": preference,
        "context": context
    }
    try:
        with open(PREFS_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        print(f"[Episodic Memory] Recorded: {preference}")
    except Exception as e:
        print(f"[Episodic Memory] Failed to record: {e}")

def retrieve_preferences(limit: int = 10) -> list:
    """Fetch the most recent user preferences."""
    _ensure_init()
    if not PREFS_FILE.exists():
        return []
        
    prefs = []
    try:
        with open(PREFS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    prefs.append(json.loads(line))
    except Exception:
        pass
        
    # Return latest N preferences
    return prefs[-limit:] if limit else prefs
    
def get_activation_context() -> str:
    """Format preferences for the activation gate context."""
    prefs = retrieve_preferences()
    if not prefs:
        return "No specific user preferences recorded yet."
        
    lines = ["[USER PREFERENCES & PAST LESSONS]"]
    for p in prefs:
        lines.append(f"- [{p['category'].upper()}] {p['preference']}")
    return "\n".join(lines)
