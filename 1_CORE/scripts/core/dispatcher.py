"""
SEOSONA OS — Unified Dispatcher.

Single execution engine shared by the activation gate and Hermes brain so the
previously-disconnected "islands" (gate / hermes / swarm) run work the same way.

Safety model (the user asked for auto-execute but NOT a foot-gun):
  - dispatch_report() only RUNS work when execute=True; otherwise it returns a
    dry-run "would run" plan. Callers gate this behind an explicit --execute flag.
  - only resources flagged safe_to_auto_execute by the capability bridge are
    eligible for auto-run.
  - only runnable scripts (.py/.js/.mjs/.cjs) under the repo are executed, via
    argv (never a shell), with a timeout and captured output.
  - markdown skills/KIs/workflows are GUIDANCE, never "executed" — they are
    returned as retrieved content for the agent to follow.
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[3]
PORTABLE_ROOT = "~/.seosona"
RUNNABLE = {".py", ".js", ".mjs", ".cjs"}
DEFAULT_TIMEOUT = 600

# Defense-in-depth: a HARD block at the execution seam, independent of the capability-bridge's
# risk classifier. Even a caller that already passed execute=True never auto-runs a script whose
# name signals an irreversible or outward-facing side effect (publishing, deletion, deploys,
# credentials, payments, remote sync). This protects direct callers of dispatch_match(), which do
# NOT re-check safeToAutoExecute. A blocked script isn't lost — it is returned for the human to run.
_SIDE_EFFECT_RE = re.compile(
    r"(push|deploy|publish|release|upload|delete|destroy|wipe|drop|remove|purge|truncate|"
    r"clear|reset|revoke|overwrite|rollback|terminate|"
    r"credential|secret|token|migrat|production|payment|charge|refund|pay|bill|transfer|grant|"
    r"send|email|sms|post|tweet|dm|slack|webhook|notify|broadcast|commit|merge|"
    r"git_push|sync_remote|force)",
    re.IGNORECASE,
)


def is_side_effecting(path: Path) -> bool:
    """True when a script's filename signals an irreversible/outward action → never auto-run."""
    return bool(_SIDE_EFFECT_RE.search(path.name))


def resolve_path(portable: str) -> Optional[Path]:
    """Resolve a ~/.seosona/... portable path (or a relative path) to an absolute path."""
    if not portable:
        return None
    rel = portable.replace(f"{PORTABLE_ROOT}/", "").replace(f"{PORTABLE_ROOT}\\", "")
    rel = rel.replace("~/.seosona/", "").replace("~/.seosona\\", "")
    candidate = (ROOT / rel).resolve()
    try:
        candidate.relative_to(ROOT.resolve())  # keep execution inside the repo
    except ValueError:
        return None
    return candidate


def run_script(path: Path, args: Optional[List[str]] = None, timeout: int = DEFAULT_TIMEOUT) -> Dict[str, Any]:
    """Run a .py/.js script via argv (no shell). Returns status/exit/output.

    Vendored (third-party) skill/framework scripts are routed through the least-privilege sandbox
    (secret-stripped env, temp cwd, resource caps, pre-exec malware re-scan); the OS's own trusted
    scripts run directly with full context. See core.skill_sandbox.
    """
    interp = sys.executable if path.suffix == ".py" else "node"
    cmd = [interp, str(path), *(args or [])]

    try:
        from skill_sandbox import is_vendored, run_sandboxed
    except ImportError:  # imported as part of the `core` package
        from .skill_sandbox import is_vendored, run_sandboxed
    if is_vendored(path):
        return run_sandboxed(cmd, path, timeout=timeout, root=ROOT)

    # Force the CHILD to write UTF-8: with captured stdout (a pipe) Python defaults to the
    # OS encoding (cp1252 on Windows), so scripts that print emoji crash with
    # UnicodeEncodeError when run here. PYTHONIOENCODING makes the child encode UTF-8.
    child_env = {**os.environ, "PYTHONIOENCODING": "utf-8"}
    try:
        proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True,
                              encoding="utf-8", env=child_env, timeout=timeout)
        out = (proc.stdout or "") + (("\n" + proc.stderr) if proc.returncode and proc.stderr else "")
        return {
            "ran": True,
            "exit_code": proc.returncode,
            "ok": proc.returncode == 0,
            "output": out.strip()[-3000:],
        }
    except subprocess.TimeoutExpired:
        return {"ran": True, "ok": False, "exit_code": None, "output": f"timeout after {timeout}s"}
    except Exception as e:  # noqa: BLE001
        return {"ran": False, "ok": False, "exit_code": None, "output": f"dispatch error: {e}"}


def dispatch_match(match: Dict[str, Any], reason: str = "", execute: bool = True,
                   timeout: int = DEFAULT_TIMEOUT) -> Dict[str, Any]:
    """Dispatch a single capability-bridge / KI match.

    Runnable script -> run it (if execute). Markdown -> return as retrieved guidance.
    """
    name = match.get("name", "resource")
    rtype = match.get("type", "resource")
    portable = match.get("portablePath", "")
    target = resolve_path(portable)

    if target and target.suffix in RUNNABLE and target.exists():
        if not execute:
            return {"action": "would_run", "name": name, "path": portable}
        if is_side_effecting(target):
            return {"action": "blocked_side_effecting", "name": name, "path": portable,
                    "note": "auto-execute refused: the script name signals an irreversible or "
                            "outward side effect. Run it manually after review."}
        result = run_script(target, timeout=timeout)
        return {"action": "ran_script", "name": name, "path": portable, **result}

    # Not executable — it's knowledge/guidance.
    return {
        "action": "retrieved_guidance",
        "name": name,
        "type": rtype,
        "path": portable,
        "note": "Knowledge/instructions for the agent to apply (not a runnable tool).",
    }


def _extract_domain(task: str) -> Optional[str]:
    # Require a real alphabetic TLD (>=2 letters) so version numbers like "2.0" or "v3.5" are not
    # mistaken for a domain and dispatched as an audit target.
    m = re.search(r"\b([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})\b", task.lower())
    return m.group(1) if m else None


def dispatch_report(report: Dict[str, Any], execute: bool = False,
                    timeout: int = DEFAULT_TIMEOUT) -> Dict[str, Any]:
    """Decide and (optionally) run the dispatchable action implied by a gate report.

    Priority:
      1. An audit task with a resolvable domain -> run_full_audit.py --domain <d>
         (the real audit orchestrator that wires all connectors with fix loops).
      2. Otherwise the top capability-bridge match that is safe_to_auto_execute.
    Returns a structured dispatch result (dry-run unless execute=True).
    """
    task = report.get("task", "")

    # 1) Audit path — the planner produced a plan; the real executor is run_full_audit.
    if report.get("auditPlan"):
        domain = _extract_domain(task)
        if domain:
            script = ROOT / "1_CORE" / "scripts" / "run_full_audit.py"
            if not execute:
                return {"action": "would_run_audit", "domain": domain,
                        "script": _portable(script)}
            result = run_script(script, ["--domain", domain], timeout=timeout)
            return {"action": "ran_audit", "domain": domain, "script": _portable(script), **result}
        return {"action": "blocked", "reason": "audit task but no domain found in request"}

    # 2) Capability-bridge path — dispatch the top SAFE match.
    for match in report.get("capabilityBridge", {}).get("matches", []):
        if match.get("safeToAutoExecute"):
            return {"action_source": "capability_bridge",
                    **dispatch_match(match, reason=task, execute=execute, timeout=timeout)}

    return {"action": "none", "reason": "no safe auto-executable action for this task"}


def _portable(path: Path) -> str:
    try:
        return f"{PORTABLE_ROOT}/{path.resolve().relative_to(ROOT.resolve()).as_posix()}"
    except ValueError:
        return str(path)
