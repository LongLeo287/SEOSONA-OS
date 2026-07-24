import os
import time
import shutil
from pathlib import Path
import sys

_ROOT = Path(__file__).resolve().parents[3]

# Import Security Guard from UAP
sys.path.append(str(_ROOT / "1_CORE" / "scripts" / "uap_pipeline"))
def _fail_closed_scan(path, _reason="security_guard unavailable"):
    # Fail CLOSED: if the malware scanner can't load, do NOT silently accept files —
    # treat them as unsafe so nothing slips through unscanned.
    print(f"🛑 [SECURITY] {_reason}; failing closed — rejecting {path} (unscanned).")
    return True  # True == threat/unsafe -> caller must block

try:
    from importlib import import_module
    security_guard = import_module("02b_security_guard")
    scan_file_for_threats = getattr(security_guard, "scan_file_for_threats", None) or _fail_closed_scan
except Exception as _e:
    print(f"🛑 [SECURITY] Failed to import security_guard ({_e}). Intake will fail closed.")
    scan_file_for_threats = _fail_closed_scan

AGENT_INBOX = (_ROOT / ".agents" / "INBOX")
ECOSYSTEM_DIR = (_ROOT / ".agents" / "skills")

class OAPGateway:
    """
    OAP Intake Protocol Gateway.
    Any AI-generated module/skill (like skill-creator-ultra) cannot be 
    directly placed into the ecosystem. They must be thrown into the INBOX.
    This Gateway will scan for malware using security_guard. If safe, it will 
    be moved to TIER 2. Otherwise, it will be destroyed.
    """
    def __init__(self):
        AGENT_INBOX.mkdir(parents=True, exist_ok=True)
        self.target_dir = ECOSYSTEM_DIR / "_TIER_2_LAZY_LOAD"
        self.target_dir.mkdir(parents=True, exist_ok=True)

    def scan_inbox(self):
        files = list(AGENT_INBOX.glob("*.*"))
        if not files:
            return
            
        print(f"[OAP Gateway] Scanning {len(files)} file(s) in INBOX...")
        for file in files:
            is_malicious = scan_file_for_threats(str(file))
            if is_malicious:
                print(f"[OAP Gateway] ❌ REJECTED: Detected malware/Anti-pattern in {file.name}. Destroyed.")
                try:
                    os.remove(file)
                except Exception:
                    pass
            else:
                dest = self.target_dir / file.name
                shutil.move(str(file), str(dest))
                print(f"[OAP Gateway] ✅ ACCEPTED: {file.name} successfully merged into TIER 2.")

    def run(self):
        print("Starting OAP Gateway Intake (Zero-Trust Queue)...")
        while True:
            self.scan_inbox()
            time.sleep(10)

if __name__ == "__main__":
    gateway = OAPGateway()
    gateway.run()
