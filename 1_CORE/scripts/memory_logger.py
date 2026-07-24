from pathlib import Path
import os
import json
import time
try:
    import fcntl
    _HAS_FCNTL = True
except ImportError:
    _HAS_FCNTL = False  # Windows — file locking skipped gracefully
from datetime import datetime
import argparse
import sys

sys.path.append(os.path.dirname(__file__))
try:
    from agent_governance_guardrail import sanitize_output
except ImportError:
    sanitize_output = lambda x: x

def get_transcript_path():
    """Get or create the transcript file path."""
    memory_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "3_MEMORY", "logs"))
    os.makedirs(memory_dir, exist_ok=True)
    return os.path.join(memory_dir, "transcript.jsonl")

def log_event(source, event_type, status, content, tool_calls=None):
    """Log an event to the JSONL transcript file with cross-platform file locking."""
    transcript_path = get_transcript_path()
    lock_path = transcript_path + ".lock"

    # Use a lock file to prevent TOCTOU race conditions from concurrent sub-agents
    lock_fd = open(lock_path, 'w')
    try:
        # Cross-platform: use fcntl on Unix, skip on Windows
        if _HAS_FCNTL:
            fcntl.flock(lock_fd, fcntl.LOCK_EX)

        # Count existing lines AFTER acquiring lock to get correct step_index
        step_index = 0
        if os.path.exists(transcript_path):
            with open(transcript_path, 'r', encoding='utf-8') as f:
                step_index = sum(1 for _ in f)

        # [Microsoft Agent Governance] Output Sanitization
        content = sanitize_output(content)

        # [TencentDB-Agent-Memory] Symbolic Offloading
        if len(content) > 1500:
            refs_dir = os.path.join(os.path.dirname(transcript_path), "refs")
            os.makedirs(refs_dir, exist_ok=True)
            ref_path = os.path.join(refs_dir, f"step_{step_index}.md")
            with open(ref_path, 'w', encoding='utf-8') as rf:
                rf.write(content)
            content = (
                "```mermaid\n"
                "graph LR\n"
                "    Agent((\"Agent Context\"))\n"
                f"    FS[(\"External FS\\n(refs/step_{step_index}.md)\")]\n"
                f"    Agent -. \"Recall via node_id: step_{step_index}\" .-> FS\n"
                "```"
            )

        event = {
            "step_index": step_index,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source": source,
            "type": event_type,
            "status": status,
            "content": content,
            "tool_calls": tool_calls or []
        }

        with open(transcript_path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(event) + "\n")

        # Close the episodic-memory write side: when the user states a durable
        # preference/correction, record it so the activation gate can recall it.
        # (record_preference previously had zero callers, so episodic was empty.)
        try:
            low = (content or "").lower()
            cues = ("always", "never", "prefer", "don't", "do not", "instead of",
                    "from now on", "remember", "luôn", "đừng", "thay vì", "nhớ là")
            if str(source).upper().startswith("USER") and any(c in low for c in cues):
                import sys as _sys
                _sys.path.insert(0, os.path.dirname(__file__))
                from core.episodic_memory import record_preference
                record_preference(category=str(event_type).lower(),
                                  preference=content[:300], context=str(source))
        except Exception:
            pass

        print(f"[Memory Logger] Event logged successfully at step {step_index}")
    finally:
        if _HAS_FCNTL:
            fcntl.flock(lock_fd, fcntl.LOCK_UN)
        lock_fd.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SEOSONA OS Memory Logger")
    parser.add_argument("--source", type=str, required=True, help="Source of the event (e.g., USER_EXPLICIT, MODEL, SYSTEM)")
    parser.add_argument("--type", type=str, required=True, help="Type of event (e.g., USER_INPUT, PLANNER_RESPONSE, TOOL_CALL)")
    parser.add_argument("--status", type=str, default="DONE", help="Status of the event (DONE, ERROR)")
    parser.add_argument("--content", type=str, required=True, help="The content or message to log")

    args = parser.parse_args()
    log_event(args.source, args.type, args.status, args.content)
