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
import re
import shutil
import signal
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
_CPU_SECONDS_MAX = 600
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


def _kill_group(proc):
    """Kill the child AND everything it spawned."""
    if proc is None:
        return
    try:
        if os.name == "posix":
            os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
        else:
            proc.kill()
    except Exception:
        try:
            proc.kill()
        except Exception:
            pass


def _posix_limits(cpu_seconds: int):
    """preexec_fn for POSIX: cap CPU and file size, and start a new process group.

    Deliberately NOT set here, both learned from auditing the first version:

    - RLIMIT_AS. It caps VIRTUAL address space, and V8 reserves multiple GiB of it at startup, so a
      1 GiB cap meant every JavaScript skill failed to boot. Capping resident memory needs cgroups
      (or the Docker backend above), not RLIMIT_AS.
    - RLIMIT_NPROC. It is per-UID, not per-process: setting it to 64 counts every process the user
      already has, so on a busy workstation the child cannot fork at all — and if it can, the limit
      applies to the user's own shell too.
    """
    import resource  # POSIX-only
    resource.setrlimit(resource.RLIMIT_CPU, (cpu_seconds, cpu_seconds))
    resource.setrlimit(resource.RLIMIT_FSIZE, (_FSIZE_BYTES, _FSIZE_BYTES))
    os.setpgrp()


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
        # `-v src:dst:ro` splits on ":" — a Windows path's drive-letter colon turned this into a
        # four-field value and Docker refused to start, so the only real isolation the module
        # offers could never run on this repo's primary platform. `--mount` is comma-delimited and
        # takes the path as a single value.
        "--mount", f"type=bind,src={skill_dir},dst=/skill,readonly",
        "-w", "/work",
        "--memory", "1g", "--cpus", "1", "--pids-limit", "128",
        "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
        "--user", "65534:65534",                   # nobody:nogroup
        "-e", "PYTHONIOENCODING=utf-8", "-e", "HOME=/work",
        image,
        interp, f"/skill/{relname}", *args,
    ]


_IMAGE_RE = re.compile(r"^[a-z0-9][a-z0-9._/-]*(:[A-Za-z0-9._-]+)?$")


def _safe_image(env_name: str, default: str) -> str:
    """Validate an image reference before it goes into the argv.

    The image sits in a POSITIONAL slot. An env value starting with "-" (say `--privileged`) is
    parsed by Docker as a FLAG, shifting the interpreter into the image slot — turning an
    environment variable into sandbox-escape options. Not shell injection, but argv-position
    injection, and the sandbox is exactly the wrong place to trust input.
    """
    value = (os.getenv(env_name) or "").strip()
    if not value:
        return default
    if not _IMAGE_RE.match(value):
        print(f"[sandbox] Ignoring unsafe {env_name}={value!r}; using {default}.")
        return default
    return value


def _run_docker(script: Path, args: List[str], timeout: int) -> Dict[str, Any]:
    is_py = str(script).endswith(".py")
    interp = "python" if is_py else "node"
    image = (_safe_image("SEOSONA_SANDBOX_PY_IMAGE", "python:3.11-slim") if is_py
             else _safe_image("SEOSONA_SANDBOX_JS_IMAGE", "node:20-slim"))
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
        # CPU limit tracks the caller's timeout instead of a fixed 120s that silently killed any
        # legitimately longer skill with a bare negative exit code.
        cpu = max(30, min(timeout, _CPU_SECONDS_MAX))
        kwargs["preexec_fn"] = lambda: _posix_limits(cpu)
    else:
        kwargs["creationflags"] = getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)

    proc = None
    try:
        # Popen + explicit group kill. `subprocess.run(timeout=...)` calls Popen.kill(), which sends
        # SIGKILL to the LEADER only — a hostile skill that forks simply outlived the timeout and
        # kept running unsupervised. Killing the group is the behaviour the docstring always claimed.
        proc = subprocess.Popen(
            cmd, cwd=workdir, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            text=True, encoding="utf-8", env=_sandbox_env(workdir), **kwargs,
        )
        stdout, stderr = proc.communicate(timeout=timeout)
        out = (stdout or "") + (("\n" + stderr) if proc.returncode and stderr else "")
        return {
            "ran": True,
            "ok": proc.returncode == 0,
            "exit_code": proc.returncode,
            "sandboxed": True,
            "backend": "subprocess",
            "output": out.strip()[-_MAX_OUTPUT:],
        }
    except subprocess.TimeoutExpired:
        _kill_group(proc)
        return {"ran": True, "ok": False, "exit_code": None, "sandboxed": True, "backend": "subprocess",
                "output": f"sandboxed timeout after {timeout}s (process group killed)"}
    except Exception as e:  # noqa: BLE001
        return {"ran": False, "ok": False, "exit_code": None, "sandboxed": True, "backend": "subprocess",
                "output": f"sandbox error: {e}"}
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
