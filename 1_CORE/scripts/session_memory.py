#!/usr/bin/env python3
"""
SEOSONA OS V5 — Session Memory Engine

Provides persistent memory across audit sessions with:
  - Session summaries: Each audit creates a session record
  - Cross-session learning: Compare current vs. previous audits
  - Time-decay retrieval: Recent sessions weighted higher
  - Entity tracking: Brand, competitor, keyword entities across time

Inspired by DeerFlow persistent memory and last30days-skill time-windowed recall.

Usage:
    from session_memory import SessionMemory
    memory = SessionMemory("popmart.com")
    memory.record_session(audit_results)
    history = memory.get_recent_sessions(days=30)
    diff = memory.compare_sessions(session_1_id, session_2_id)
"""

from __future__ import annotations

import json
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional


ROOT = Path(__file__).resolve().parents[2]
SESSIONS_DIR = ROOT / "3_MEMORY" / "sessions"


class SessionMemory:
    """
    Persistent memory engine for cross-session learning.

    Stores session summaries, tracks entity changes over time,
    and provides time-weighted retrieval.
    """

    def __init__(self, domain: str):
        self.domain = domain
        self._dir = SESSIONS_DIR / domain.replace(".", "-")
        self._dir.mkdir(parents=True, exist_ok=True)
        self._index_path = self._dir / "session_index.json"

    def _load_index(self) -> List[Dict]:
        """Load the session index."""
        if self._index_path.exists():
            try:
                return json.loads(self._index_path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, ValueError):
                return []
        return []

    def _save_index(self, index: List[Dict]):
        """Save the session index."""
        self._index_path.write_text(
            json.dumps(index, indent=2, ensure_ascii=False),
            encoding="utf-8"
        )

    def _generate_session_id(self) -> str:
        """Generate a unique session ID."""
        ts = datetime.now().strftime("%Y%m%d-%H%M%S")
        h = hashlib.md5(f"{self.domain}-{ts}".encode()).hexdigest()[:6]
        return f"session-{ts}-{h}"

    def record_session(
        self,
        validation_report: Optional[Dict] = None,
        metrics: Optional[Dict] = None,
        notes: str = "",
    ) -> str:
        """
        Record a new audit session.

        Args:
            validation_report: Output from audit_validator
            metrics: Key metrics to track (performance score, keyword count, etc.)
            notes: Human-readable notes about this session

        Returns:
            session_id
        """
        session_id = self._generate_session_id()
        now = datetime.now()

        # Extract key metrics from validation report
        session_metrics = metrics or {}
        if validation_report:
            session_metrics["overall_status"] = validation_report.get("overall_status", "unknown")
            session_metrics["overall_confidence"] = validation_report.get("overall_confidence", "unknown")
            stats = validation_report.get("stats", {})
            session_metrics["connectors_passed"] = stats.get("passed", 0)
            session_metrics["connectors_warning"] = stats.get("warning", 0)
            session_metrics["connectors_failed"] = stats.get("failed", 0)

            # Extract per-connector row counts
            connector_data = {}
            for name, data in validation_report.get("connectors", {}).items():
                connector_data[name] = {
                    "status": data.get("status", "unknown"),
                    "row_count": data.get("row_count", 0),
                    "confidence": data.get("confidence", "unknown"),
                }
            session_metrics["connectors"] = connector_data

        session = {
            "session_id": session_id,
            "domain": self.domain,
            "timestamp": now.isoformat(),
            "date": now.strftime("%Y-%m-%d"),
            "metrics": session_metrics,
            "notes": notes,
        }

        # Save session file
        session_path = self._dir / f"{session_id}.json"
        session_path.write_text(
            json.dumps(session, indent=2, ensure_ascii=False),
            encoding="utf-8"
        )

        # Update index
        index = self._load_index()
        index.append({
            "session_id": session_id,
            "timestamp": now.isoformat(),
            "status": session_metrics.get("overall_status", "unknown"),
        })
        self._save_index(index)

        return session_id

    def get_session(self, session_id: str) -> Optional[Dict]:
        """Load a specific session by ID."""
        path = self._dir / f"{session_id}.json"
        if not path.exists():
            return None
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return None

    def get_recent_sessions(self, days: int = 30, limit: int = 10) -> List[Dict]:
        """
        Get recent sessions with time-decay weighting.

        Sessions are sorted by recency and each gets a relevance_weight
        that decays exponentially over time.
        """
        index = self._load_index()
        cutoff = datetime.now() - timedelta(days=days)
        recent = []

        for entry in reversed(index):
            try:
                ts = datetime.fromisoformat(entry["timestamp"])
                if ts >= cutoff:
                    session = self.get_session(entry["session_id"])
                    if session:
                        # Calculate time-decay weight (1.0 for today, decays to 0.1 over `days`)
                        age_days = (datetime.now() - ts).total_seconds() / 86400
                        weight = max(0.1, 1.0 - (age_days / days) * 0.9)
                        session["relevance_weight"] = round(weight, 3)
                        recent.append(session)
            except (ValueError, KeyError):
                continue

            if len(recent) >= limit:
                break

        return recent

    def get_latest_session(self) -> Optional[Dict]:
        """Get the most recent session."""
        sessions = self.get_recent_sessions(days=365, limit=1)
        return sessions[0] if sessions else None

    def compare_sessions(self, session_id_1: str, session_id_2: str) -> Dict:
        """
        Compare two sessions to identify improvements and regressions.

        Returns a diff showing what changed between sessions.
        """
        s1 = self.get_session(session_id_1)
        s2 = self.get_session(session_id_2)

        if not s1 or not s2:
            return {"error": "One or both sessions not found"}

        diff = {
            "from_session": session_id_1,
            "to_session": session_id_2,
            "from_date": s1.get("date"),
            "to_date": s2.get("date"),
            "improvements": [],
            "regressions": [],
            "unchanged": [],
        }

        m1 = s1.get("metrics", {}).get("connectors", {})
        m2 = s2.get("metrics", {}).get("connectors", {})

        all_connectors = set(list(m1.keys()) + list(m2.keys()))
        for conn in sorted(all_connectors):
            c1 = m1.get(conn, {})
            c2 = m2.get(conn, {})

            row_diff = c2.get("row_count", 0) - c1.get("row_count", 0)
            status_change = f"{c1.get('status', 'N/A')} -> {c2.get('status', 'N/A')}"

            entry = {
                "connector": conn,
                "status_change": status_change,
                "row_count_change": row_diff,
            }

            s1_status = c1.get("status", "unknown")
            s2_status = c2.get("status", "unknown")

            status_rank = {"passed": 3, "warning": 2, "failed": 1, "skipped": 0, "unknown": 0}
            if status_rank.get(s2_status, 0) > status_rank.get(s1_status, 0):
                diff["improvements"].append(entry)
            elif status_rank.get(s2_status, 0) < status_rank.get(s1_status, 0):
                diff["regressions"].append(entry)
            else:
                diff["unchanged"].append(entry)

        return diff

    def get_learning_context(self, max_sessions: int = 3) -> str:
        """
        Generate a learning context string for AI prompts.

        Summarizes recent sessions and trends for injection into
        the orchestrator's context window.
        """
        recent = self.get_recent_sessions(days=60, limit=max_sessions)
        if not recent:
            return f"No previous audit sessions found for {self.domain}."

        lines = [
            f"## Session Memory for {self.domain}",
            f"Total sessions in last 60 days: {len(recent)}",
            "",
        ]

        for s in recent:
            metrics = s.get("metrics", {})
            lines.append(f"### {s.get('date', 'Unknown')} (weight: {s.get('relevance_weight', 'N/A')})")
            lines.append(f"- Status: {metrics.get('overall_status', 'N/A')}")
            lines.append(f"- Confidence: {metrics.get('overall_confidence', 'N/A')}")
            lines.append(f"- Passed: {metrics.get('connectors_passed', 0)} | "
                         f"Warning: {metrics.get('connectors_warning', 0)} | "
                         f"Failed: {metrics.get('connectors_failed', 0)}")
            if s.get("notes"):
                lines.append(f"- Notes: {s['notes']}")
            lines.append("")

        # Trend analysis
        if len(recent) >= 2:
            latest = recent[0].get("metrics", {})
            oldest = recent[-1].get("metrics", {})
            lines.append("### Trend")
            latest_passed = latest.get("connectors_passed", 0)
            oldest_passed = oldest.get("connectors_passed", 0)
            if latest_passed > oldest_passed:
                lines.append(f"- Improving: {oldest_passed} -> {latest_passed} connectors passing")
            elif latest_passed < oldest_passed:
                lines.append(f"- Regression: {oldest_passed} -> {latest_passed} connectors passing")
            else:
                lines.append(f"- Stable: {latest_passed} connectors passing across sessions")

        return "\n".join(lines)

    def get_stats(self) -> Dict:
        """Get session memory statistics."""
        index = self._load_index()
        return {
            "domain": self.domain,
            "total_sessions": len(index),
            "latest_session": index[-1] if index else None,
            "storage_dir": str(self._dir),
        }


# ── CLI Entry Point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Session Memory")
    parser.add_argument("--domain", required=True)
    parser.add_argument("--stats", action="store_true")
    parser.add_argument("--recent", type=int, default=None, help="Show N recent sessions")
    parser.add_argument("--context", action="store_true", help="Generate learning context")
    args = parser.parse_args()

    memory = SessionMemory(args.domain)

    if args.stats:
        print(json.dumps(memory.get_stats(), indent=2))
    elif args.recent:
        sessions = memory.get_recent_sessions(days=90, limit=args.recent)
        for s in sessions:
            print(f"  {s['date']} [{s['session_id']}] - {s['metrics'].get('overall_status', 'N/A')}")
    elif args.context:
        print(memory.get_learning_context())
    else:
        print(json.dumps(memory.get_stats(), indent=2))
