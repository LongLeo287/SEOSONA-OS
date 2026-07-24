import os
import json
import uuid
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent.parent
LOG_DIR = ROOT / "3_MEMORY" / "logs"
TELEMETRY_FILE = LOG_DIR / "telemetry.jsonl"

class TelemetryBus:
    def __init__(self):
        os.makedirs(LOG_DIR, exist_ok=True)
        
    def generate_trace_id(self):
        return str(uuid.uuid4())
        
    def log_event(self, trace_id: str, agent: str, action: str, details: dict, token_estimate: int = 0, latency_ms: int = 0):
        event = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "trace_id": trace_id,
            "agent": agent,
            "action": action,
            "details": details,
            "token_estimate": token_estimate,
            "latency_ms": latency_ms
        }
        try:
            with open(TELEMETRY_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps(event, ensure_ascii=False) + "\n")
        except Exception as e:
            print(f"[Telemetry Error] {e}")

# Singleton
bus = TelemetryBus()

def log_telemetry(trace_id: str, agent: str, action: str, details: dict, token_estimate: int = 0, latency_ms: int = 0):
    bus.log_event(trace_id, agent, action, details, token_estimate, latency_ms)

def generate_trace_id():
    return bus.generate_trace_id()
