"""
Fetch + stage the scientific-agent-skills corpus (147 standard SKILL.md).

Wires the scientific-agent-skills adoption: clone the repo, run the security scan over it
(skills execute code — quarantine FIRST), and stage the SKILL.md for registration in the
router. Does NOT auto-register — staging + scan gate keep OS hygiene in control.

  python 1_CORE/scripts/fetch_scientific_skills.py          # clone + scan + report
  npm run skills:fetch:science

Needs git + network. Graceful: prints what to do if either is missing.
"""
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPO = "https://github.com/K-Dense-AI/scientific-agent-skills"
STAGE = ROOT / "3_MEMORY" / "ingestion_zone" / "scientific-agent-skills"


def main():
    if not shutil.which("git"):
        print("[science-skills] git not found — install git, then re-run.")
        return 1
    STAGE.parent.mkdir(parents=True, exist_ok=True)
    if not STAGE.exists():
        print(f"[science-skills] cloning {REPO} (shallow) ...")
        rc = subprocess.run(["git", "clone", "--depth", "1", REPO, str(STAGE)]).returncode
        if rc != 0:
            print("[science-skills] clone failed (network?). Skipping.")
            return rc
    else:
        print(f"[science-skills] already staged at {STAGE.relative_to(ROOT)} (git pull to refresh).")

    skills = list(STAGE.rglob("SKILL.md"))
    print(f"[science-skills] staged {len(skills)} SKILL.md.")
    # gate: security scan + spec validate before any registration
    print("[science-skills] running security scan (quarantine-first hygiene) ...")
    subprocess.run(["python", str(ROOT / "1_CORE" / "scripts" / "skill_security_scan.py"), str(STAGE)])
    print("[science-skills] running spec validation ...")
    subprocess.run(["python", str(ROOT / "1_CORE" / "scripts" / "skill_spec_validate.py"), str(STAGE)])
    print("\n[science-skills] cleared SKILL.md can now be registered into the router "
          "(copy spec-valid + scan-clean ones into 2_KNOWLEDGE/frameworks/scientific/ then regen).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
