"""
SKILL.md Spec Validator — conform the library to the Agent Skills spec.

Wires the agent-skills-spec adoption (anthropics/skills ./spec is the format authority):
every SKILL.md the router loads should have valid YAML frontmatter with at least a
`name` and a `description`. Malformed skills route badly or break ingestion. This catches
them.

  python 1_CORE/scripts/skill_spec_validate.py            # validate default roots
  python 1_CORE/scripts/skill_spec_validate.py <path>     # validate a path
  npm run skills:validate

Exit code = number of invalid skills (0 = all conform), so it can gate CI.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_ROOTS = ["2_KNOWLEDGE/frameworks", ".agents/skills"]
REQUIRED = ("name", "description")


def _frontmatter(text):
    """Return the frontmatter dict (shallow) or None if absent/malformed."""
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    fm = {}
    for line in text[3:end].splitlines():
        line = line.rstrip()
        if not line or line[0] in " \t#" or ":" not in line:
            continue
        k, _, v = line.partition(":")
        fm[k.strip()] = v.strip().strip('"').strip("'")
    return fm


def validate_file(p: Path):
    """Return a list of problems for one SKILL.md (empty = valid)."""
    try:
        text = p.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return [f"unreadable: {e}"]
    fm = _frontmatter(text)
    if fm is None:
        return ["missing/malformed YAML frontmatter"]
    problems = []
    for key in REQUIRED:
        if not fm.get(key):
            problems.append(f"missing '{key}'")
    if fm.get("description") and len(fm["description"]) < 20:
        problems.append("description too short (<20 chars) — weak routing")
    return problems


def main(argv):
    roots = argv or [r for r in DEFAULT_ROOTS if (ROOT / r).exists()]
    files = []
    for r in roots:
        base = (ROOT / r) if not Path(r).is_absolute() else Path(r)
        files += list(base.rglob("SKILL.md"))
    invalid = []
    for f in files:
        probs = validate_file(f)
        if probs:
            invalid.append((f, probs))
    print(f"[skill-spec] checked {len(files)} SKILL.md across {len(roots)} root(s).")
    if not invalid:
        print("[skill-spec] all conform to the Agent Skills spec (name + description present).")
        return 0
    print(f"[skill-spec] {len(invalid)} non-conforming:")
    for f, probs in invalid[:60]:
        rel = f.relative_to(ROOT)
        print(f"  {rel}  -> {', '.join(probs)}")
    if len(invalid) > 60:
        print(f"  ... and {len(invalid) - 60} more.")
    return len(invalid)


if __name__ == "__main__":
    sys.exit(min(255, main(sys.argv[1:])))
