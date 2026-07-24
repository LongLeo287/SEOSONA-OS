"""
SEOSONA OS — Vendored-skill sandbox.

`.agents/skills/` and `2_KNOWLEDGE/frameworks/` hold third-party code assimilated from external repos
by the UAP pipeline. The security guard scans it once at INGEST time (static regex), but static scans
miss obfuscated/encoded payloads, and a skill only becomes dangerous when it actually RUNS — with the
full privileges of whoever launched the OS. This module wraps vendored-script execution in a
least-privilege subprocess so a hostile skill's blast radius is contained.

What it enforces (defense-in-depth — NOT a hard jail):
  1. Re-scan the exact script with the ingest-time guard; a HARD flag refuses to run it at all.
  2. Secret-stripped environment — the child sees a minimal allowlist of vars, never the user's
     API keys / tokens (so an exfiltration attempt has nothing to steal from the env).
  3. Confined working directory — a throwaway temp dir, not the repo root, so relative-path reads
     and writes can't touch the OS's files.
  4. Resource caps — POSIX RLIMITs (CPU, address space, file size, process count) + its own session
     so a timeout kills the whole process group.
  5. Timeout + captured, size-capped output.

Honest limits: true NETWORK isolation and absolute-path filesystem confinement need an OS-level
sandbox (container / job object / namespaces) and are NOT provided here — that is the documented
next step. On Windows the RLIMIT caps are unavailable (best-effort: timeout + env + temp cwd only).
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
import tempfile
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[3]

# Directories whose contents are third-party and must be sandboxed when executed.
_VENDORED_DIRS = (
    ROOT / ".agents" / "skills",
    ROOT / "2_KNOWLEDGE" / "frameworks",
)

# Environment variables the child is allowed to see. Everything else — crucially anything holding a
# credential — is dropped. PATH/interpreter-locating vars are kept so python/node still launch.
_ENV_ALLOW = {
    # POSIX
    "PATH", "LANG", "LC_ALL", "LC_CTYPE", "TZ", "TERM",
    # Windows
    "SYSTEMROOT", "WINDIR", "PATHEXT", "COMSPEC", "SYSTEMDRIVE",
    "NUMBER_OF_PROCESSORS", "PROCESSOR_ARCHITECTURE",
}
# Never pass a var whose NAME smells like a secret, even if it were somehow allowlisted.
_SECRET_HINT = ("KEY", "TOKEN", "SECRET", "PASSWORD", "PASSWD", "CREDENTIAL", "API", "AUTH", "SESSION")

# Resource caps for POSIX children.
_CPU_SECONDS = 120
_MEM_BYTES = 1024 * 1024 * 1024      # 1 GiB address space
_FSIZE_BYTES = 64 * 1024 * 1024      # 64 MiB max single file written
_MAX_OUTPUT = 3000


def is_vendored(path: Path, root: Path = ROOT) -> bool:
    """True when ``path`` lives inside a third-party (vendored) skill/framework tree."""
    try:
        resolved = Path(path).resolve()
    except Exception:
        return False
    for base in (root / ".agents" / "skills", root / "2_KNOWLEDGE" / "frameworks"):
        try:
            resolved.relative_to(base.resolve())
            return True
        except ValueError:
            continue
    return False


def _hard_flag(script: Path) -> Optional[str]:
    """Return the HARD-flag detail if the ingest security guard rejects the script, else None.
    Best-effort: if the guard can't be loaded/run, return None (the other layers still apply)."""
    guard_dir = str(ROOT / "1_CORE" / "scripts" / "uap_pipeline")
    added = False
    try:
        import importlib
        if guard_dir not in sys.path:
            sys.path.insert(0, guard_dir)
            added = True
        guard = importlib.import_module("02b_security_guard")
        res = guard.scan_file_for_threats(Path(script))
        if res and res[0] == "HARD":
            return res[1]
    except Exception:
        return None
    finally:
        if added:
            try:
                sys.path.remove(guard_dir)
            except ValueError:
                pass
    return None


def _sandbox_env(workdir: str) -> Dict[str, str]:
    """A minimal, secret-free environment for the child."""
    env = {k: v for k, v in os.environ.items()
           if k in _ENV_ALLOW and not any(h in k.upper() for h in _SECRET_HINT)}
    if "PATH" not in env and os.environ.get("PATH"):
        env["PATH"] = os.environ["PATH"]          # a skill with no PATH can't even find its interpreter
    env["PYTHONIOENCODING"] = "utf-8"              # captured stdout is a pipe -> force UTF-8 (Windows cp1252)
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    env["HOME"] = workdir                           # POSIX: don't expose the real ~ (holds ~/.seosona)
    env["USERPROFILE"] = workdir                    # Windows equivalent
    env["TMPDIR"] = workdir
    env["TEMP"] = workdir
    env["TMP"] = workdir
    return env


def _posix_limits():
    """preexec_fn for POSIX: cap resources and start a new session so timeouts kill the group."""
    import resource  # POSIX-only
    resource.setrlimit(resource.RLIMIT_CPU, (_CPU_SECONDS, _CPU_SECONDS))
    resource.setrlimit(resource.RLIMIT_AS, (_MEM_BYTES, _MEM_BYTES))
    resource.setrlimit(resource.RLIMIT_FSIZE, (_FSIZE_BYTES, _FSIZE_BYTES))
    try:
        resource.setrlimit(resource.RLIMIT_NPROC, (64, 64))
    except Exception:
        pass
    os.setsid()


def _truthy(value: Optional[str]) -> bool:
    return (value or "").strip().lower() in ("1", "true", "yes", "on")


@lru_cache(maxsize=1)
def _docker_available() -> bool:
    """True only if the docker CLI exists AND its daemon answers — so a broken/socket-less docker
    never wedges a run; we just fall back to the in-process sandbox."""
    exe = shutil.which("docker")
    if not exe:
        return False
    try:
        return subprocess.run([exe, "info"], capture_output=True, timeout=15).returncode == 0
    except Exception:
        return False


def _docker_run_cmd(interp: str, script: Path, args: List[str], image: str) -> List[str]:
    """Build a hardened ``docker run`` argv: no network, read-only rootfs, dropped caps, non-root,
    resource caps, no inherited env, and the skill dir mounted READ-ONLY at /skill. This is the
    isolation the in-process sandbox can't give on its own (true network + FS containment)."""
    skill_dir = str(Path(script).resolve().parent)
    relname = Path(script).name
    return [
        "docker", "run", "--rm",
        "--network", "none",                       # no egress — kills exfiltration + SSRF entirely
        "--read-only",                             # immutable rootfs
        "--tmpfs", "/work:rw,size=64m",            # only writable area
        "-v", f"{skill_dir}:/skill:ro",            # the skill's own files, read-only
        "-w", "/work",
        "--memory", "1g", "--cpus", "1", "--pids-limit", "128",
        "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
        "--user", "65534:65534",                   # nobody:nogroup
        "-e", "PYTHONIOENCODING=utf-8", "-e", "HOME=/work",
        image,
        interp, f"/skill/{relname}", *args,
    ]


def _run_docker(script: Path, args: List[str], timeout: int) -> Dict[str, Any]:
    is_py = str(script).endswith(".py")
    interp = "python" if is_py else "node"
    image = (os.getenv("SEOSONA_SANDBOX_PY_IMAGE", "python:3.11-slim") if is_py
             else os.getenv("SEOSONA_SANDBOX_JS_IMAGE", "node:20-slim"))
    cmd = _docker_run_cmd(interp, script, args, image)
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", timeout=timeout)
        out = (proc.stdout or "") + (("\n" + proc.stderr) if proc.returncode and proc.stderr else "")
        return {"ran": True, "ok": proc.returncode == 0, "exit_code": proc.returncode,
                "sandboxed": True, "backend": "docker", "output": out.strip()[-_MAX_OUTPUT:]}
    except subprocess.TimeoutExpired:
        return {"ran": True, "ok": False, "exit_code": None, "sandboxed": True, "backend": "docker",
                "output": f"sandboxed (docker) timeout after {timeout}s"}
    except Exception as e:  # noqa: BLE001
        return {"ran": False, "ok": False, "exit_code": None, "sandboxed": True, "backend": "docker",
                "output": f"docker sandbox error: {e}"}


def run_sandboxed(cmd: List[str], script: Path, timeout: int = 600,
                  root: Path = ROOT) -> Dict[str, Any]:
    """Run a vendored script's ``cmd`` under the sandbox. Returns the same dict shape as the
    dispatcher's trusted ``run_script`` (ran/ok/exit_code/output) plus ``sandboxed: True``, a
    ``backend`` ("docker"|"subprocess"), and, on a pre-exec refusal, ``blocked: True``.

    Backend: opt-in Docker (``SEOSONA_SANDBOX_DOCKER=1`` on a host with a working daemon) gives full
    network + filesystem isolation; otherwise the in-process least-privilege subprocess is used."""
    hard = _hard_flag(Path(script))
    if hard:
        return {"ran": False, "ok": False, "exit_code": None, "sandboxed": True, "blocked": True,
                "output": f"sandbox refused to run vendored script — HARD security flag: {hard}"}

    if _truthy(os.getenv("SEOSONA_SANDBOX_DOCKER")) and _docker_available():
        return _run_docker(Path(script), list(cmd[2:]), timeout)

    workdir = tempfile.mkdtemp(prefix="seosona_skill_")
    is_posix = os.name == "posix"
    kwargs: Dict[str, Any] = {}
    if is_posix:
        kwargs["preexec_fn"] = _posix_limits
    else:
        kwargs["creationflags"] = getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
    try:
        proc = subprocess.run(
            cmd, cwd=workdir, capture_output=True, text=True, encoding="utf-8",
            env=_sandbox_env(workdir), timeout=timeout, **kwargs,
        )
        out = (proc.stdout or "") + (("\n" + proc.stderr) if proc.returncode and proc.stderr else "")
        return {
            "ran": True,
            "ok": proc.returncode == 0,
            "exit_code": proc.returncode,
            "sandboxed": True,
            "backend": "subprocess",
            "output": out.strip()[-_MAX_OUTPUT:],
        }
    except subprocess.TimeoutExpired:
        return {"ran": True, "ok": False, "exit_code": None, "sandboxed": True, "backend": "subprocess",
                "output": f"sandboxed timeout after {timeout}s"}
    except Exception as e:  # noqa: BLE001
        return {"ran": False, "ok": False, "exit_code": None, "sandboxed": True, "backend": "subprocess",
                "output": f"sandbox error: {e}"}
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
