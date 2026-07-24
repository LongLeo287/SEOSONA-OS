"""
Skill Security Scan — wire NVIDIA SkillSpector as a hygiene gate over the SKILL library.

SkillSpector (github.com/NVIDIA/SkillSpector, Apache-2.0) scans agent "skills" for 68
vulnerability patterns across 17 categories (prompt injection, data exfiltration, memory
poisoning, MCP tool poisoning, supply-chain CVEs, behavioral AST/taint, YARA). SEOSONA OS
has ~22k SKILL.md + a _TIER_3_BLACKLIST quarantine that needs objective hygiene.

This runner invokes SkillSpector if installed; otherwise it prints the install command
and exits cleanly (never blocks a build by itself). By DEFAULT it scans the high-risk
quarantine + the active agent skills, not all 22k (pass a path to override).

  python 1_CORE/scripts/skill_security_scan.py                 # scan default targets
  python 1_CORE/scripts/skill_security_scan.py <path>          # scan a specific path
Install:  uv tool install skillspector   (or: pipx install skillspector)
"""
import os
import sys
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_TARGETS = [
    ".agents/skills/_TIER_3_BLACKLIST",   # dual-use / quarantined — highest risk
    ".agents/skills",                      # active agent skills
]


def _resolve_runner():
    """Return the command prefix to run skillspector if installed (PATH or the uv-tool dir).
    Install: uv tool install --python 3.12 git+https://github.com/NVIDIA/SkillSpector
    (it's not on PyPI under a bare name; install from the NVIDIA repo)."""
    onpath = shutil.which("skillspector")
    if onpath:
        return [onpath]
    for cand in (Path.home() / ".local" / "bin" / "skillspector",
                 Path.home() / ".local" / "bin" / "skillspector.exe"):
        if cand.exists():
            return [str(cand)]
    return None


def main(argv):
    targets = argv or [t for t in DEFAULT_TARGETS if (ROOT / t).exists()]
    runner = _resolve_runner()
    if not runner:
        print("[skill-scan] SkillSpector not found. Install it:")
        print("    uv tool install skillspector    (or: pipx install skillspector)")
        print("[skill-scan] Then re-run. Skipping scan (non-blocking).")
        return 0
    rc_total = 0
    for t in targets:
        path = (ROOT / t) if not Path(t).is_absolute() else Path(t)
        if not path.exists():
            print(f"[skill-scan] target not found, skipping: {t}")
            continue
        print(f"[skill-scan] scanning {t} (static + YARA) ...")
        # --no-llm: static + YARA checks, no API key needed. --recursive: whole tree.
        # Set OPENAI_API_KEY (or provider key) + drop --no-llm for the deeper LLM pass.
        extra = [] if os.environ.get("SEOSONA_SKILLSCAN_LLM") else ["--no-llm"]
        try:
            rc = subprocess.run(runner + ["scan", "--recursive", *extra, str(path)]).returncode
            rc_total = rc_total or rc
        except FileNotFoundError:
            print("[skill-scan] runner vanished mid-run; install skillspector.")
            return 0
        except Exception as e:
            print(f"[skill-scan] scan failed for {t}: {e}")
    print(f"[skill-scan] done (highest exit code: {rc_total}).")
    return rc_total


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
