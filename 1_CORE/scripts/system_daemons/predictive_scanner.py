"""
SEOSONA OS Predictive Scanner (Proactive Alert System).

Scans system data (telemetry, episodic memory, knowledge items) to detect
patterns, anomalies, and staleness, then generates proactive alerts.

DISTINCT FROM episodic_memory.py:
- episodic_memory PASSIVELY STORES user preferences when explicitly called.
- predictive_scanner ACTIVELY SCANS the entire system and GENERATES alerts
  without anyone calling it. It reads telemetry, episodic, and KI data
  to predict issues before the user notices them.
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime, timedelta
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent.parent.parent
TELEMETRY_FILE = ROOT / "3_MEMORY" / "logs" / "telemetry.jsonl"
HEALING_LOG = ROOT / "3_MEMORY" / "logs" / "healing_history.jsonl"
EPISODIC_DIR = ROOT / "3_MEMORY" / "episodic"
KI_DIR = ROOT / "3_MEMORY" / "knowledge_items"
ALERTS_FILE = ROOT / "3_MEMORY" / "logs" / "predictive_alerts.jsonl"
LOG_DIR = ROOT / "3_MEMORY" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

sys.path.append(str(ROOT / "1_CORE" / "scripts"))

try:
    from core.telemetry import log_telemetry, generate_trace_id
except ImportError:
    def log_telemetry(*args, **kwargs): pass
    def generate_trace_id(): return "trace-local"


def log_msg(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{ts}] [PredictiveScanner] {msg}"
    print(formatted)


def _emit_alert(severity: str, category: str, message: str, details: dict = None):
    """Write alert to predictive_alerts.jsonl."""
    alert = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "severity": severity,
        "category": category,
        "message": message,
        "details": details or {},
    }
    try:
        with open(ALERTS_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(alert, ensure_ascii=False) + "\n")
        log_msg(f"[{severity.upper()}] {message}")
    except Exception as e:
        log_msg(f"Failed to emit alert: {e}")


def scan_crash_patterns():
    """Scan telemetry + healing logs for agents that crash frequently."""
    crash_counter = Counter()

    for log_file in [TELEMETRY_FILE, HEALING_LOG]:
        if not log_file.exists():
            continue
        try:
            with open(log_file, "r", encoding="utf-8") as f:
                for line in f:
                    if not line.strip():
                        continue
                    try:
                        entry = json.loads(line)
                        if entry.get("action") == "attempt_heal" or "FAILED" in str(entry.get("details", {})):
                            agent = entry.get("agent", entry.get("details", {}).get("script", "unknown"))
                            crash_counter[agent] += 1
                    except json.JSONDecodeError:
                        pass
        except Exception:
            pass

    for agent, count in crash_counter.most_common(5):
        if count >= 3:
            _emit_alert(
                severity="warning",
                category="crash_pattern",
                message=f"Agent '{agent}' has crashed {count} times. Consider reviewing its code.",
                details={"agent": agent, "crash_count": count},
            )


def scan_repeated_complaints():
    """Scan episodic memory for user complaining about the same thing repeatedly."""
    prefs_file = EPISODIC_DIR / "user_preferences.jsonl"
    if not prefs_file.exists():
        return

    complaint_counter = Counter()
    try:
        with open(prefs_file, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    entry = json.loads(line)
                    category = entry.get("category", "").lower()
                    pref = entry.get("preference", "")
                    key = f"{category}:{pref[:50]}"
                    complaint_counter[key] += 1
                except json.JSONDecodeError:
                    pass
    except Exception:
        pass

    for key, count in complaint_counter.most_common(5):
        if count >= 2:
            _emit_alert(
                severity="info",
                category="repeated_preference",
                message=f"User has mentioned '{key}' {count} times. This may be a persistent issue.",
                details={"preference_key": key, "mention_count": count},
            )


def scan_stale_knowledge():
    """Detect Knowledge Items that haven't been updated in over 30 days."""
    if not KI_DIR.exists():
        return

    now = datetime.now()
    stale_threshold = timedelta(days=30)
    stale_files = []

    for path in KI_DIR.rglob("*.md"):
        try:
            mtime = datetime.fromtimestamp(path.stat().st_mtime)
            age = now - mtime
            if age > stale_threshold:
                stale_files.append({
                    "file": path.name,
                    "last_modified": mtime.strftime("%Y-%m-%d"),
                    "age_days": age.days,
                })
        except Exception:
            pass

    if stale_files:
        _emit_alert(
            severity="info",
            category="stale_knowledge",
            message=f"{len(stale_files)} Knowledge Items are older than 30 days and may need updating.",
            details={"stale_files": stale_files[:10]},
        )


def scan_pending_raw_data():
    """Flag raw_data dumps that have been ingested but not yet distilled into skills.

    Detection only (no auto skill-generation — that would risk polluting the
    arsenal). Surfacing the backlog closes the ingest->awareness gap safely.
    """
    raw_dir = ROOT / "2_KNOWLEDGE" / "raw_data" / "ingested_data"
    if not raw_dir.exists():
        return
    try:
        pending = [d.name for d in raw_dir.iterdir() if d.is_dir()]
    except OSError:
        return
    if len(pending) >= 5:
        _emit_alert(
            severity="info",
            category="raw_data_backlog",
            message=f"{len(pending)} raw_data dumps await distillation into skills "
                    f"(run the UAP assimilator, then plugin_manager.py + knowledge_graph.py).",
            details={"sample": sorted(pending)[:10], "count": len(pending)},
        )


def main():
    log_msg("Starting Predictive Scan...")

    scan_crash_patterns()
    scan_repeated_complaints()
    scan_stale_knowledge()
    scan_pending_raw_data()

    # Log to telemetry
    log_telemetry(
        trace_id=generate_trace_id(),
        agent="PredictiveScanner",
        action="predictive_scan",
        details={"scans_completed": 4},
    )

    log_msg("Predictive Scan complete. Alerts saved to predictive_alerts.jsonl.")


if __name__ == "__main__":
    main()
