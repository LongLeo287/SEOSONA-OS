"""
SKILL.md Spec Fixer — auto-repair the skills the validator flags.

Closes the loop on skill_spec_validate.py: for each non-conforming SKILL.md, derive a
real `description` from the skill's own content (first heading + first sentence) and
patch the frontmatter. Skills with no frontmatter get a minimal one. Conservative — only
touches frontmatter `name`/`description`, never the body.

  python 1_CORE/scripts/skill_spec_fix.py            # fix default roots
  python 1_CORE/scripts/skill_spec_fix.py <path>
"""
import sys
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "1_CORE" / "scripts"))
from skill_spec_validate import DEFAULT_ROOTS, validate_file, _frontmatter  # noqa: E402


def _derive(text, skill_name):
    """Build a description from the body: first non-heading sentence, or the H1 title."""
    body = text
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            body = text[end + 4:]
    h1 = ""
    first = ""
    for line in body.splitlines():
        s = line.strip()
        if not s:
            continue
        if s.startswith("#"):
            if not h1:
                h1 = s.lstrip("# ").strip()
            continue
        if s.startswith(("|", "-", "*", "```", ">")):
            continue
        first = s
        break
    desc = (first or h1 or skill_name.replace("_", " ").replace("-", " ")).strip()
    desc = re.sub(r"\s+", " ", desc)[:300]
    if len(desc) < 20:
        desc = f"{h1 or skill_name}: {desc}".strip()[:300]
    if len(desc) < 20:
        desc = f"Skill: {skill_name.replace('_',' ').replace('-',' ')} (capabilities and usage)."
    return desc


def fix_file(p: Path):
    text = p.read_text(encoding="utf-8", errors="ignore")
    name = p.parent.name or p.stem
    fm = _frontmatter(text)
    desc = _derive(text, name)
    if fm is None:
        # prepend a minimal frontmatter
        new = f"---\nname: {name}\ndescription: \"{desc}\"\n---\n\n{text}"
    else:
        # rebuild only the frontmatter block, preserving body + other keys
        end = text.find("\n---", 3)
        head, body = text[3:end], text[end + 4:]
        lines = [ln for ln in head.splitlines()]
        out = []
        seen_name = seen_desc = False
        for ln in lines:
            k = ln.split(":", 1)[0].strip().lower() if ":" in ln else ""
            if k == "name":
                seen_name = True
                out.append(ln if ln.split(":", 1)[1].strip() else f"name: {name}")
            elif k == "description":
                seen_desc = True
                cur = ln.split(":", 1)[1].strip().strip('"').strip("'")
                out.append(f'description: "{desc}"' if len(cur) < 20 else ln)
            else:
                out.append(ln)
        if not seen_name:
            out.insert(0, f"name: {name}")
        if not seen_desc:
            out.append(f'description: "{desc}"')
        new = "---\n" + "\n".join(out) + "\n---" + body
    if new != text:
        p.write_text(new, encoding="utf-8")
        return True
    return False


def main(argv):
    roots = argv or [r for r in DEFAULT_ROOTS if (ROOT / r).exists()]
    files = []
    for r in roots:
        base = (ROOT / r) if not Path(r).is_absolute() else Path(r)
        files += list(base.rglob("SKILL.md"))
    fixed = 0
    for f in files:
        if validate_file(f):  # only touch flagged ones
            if fix_file(f):
                fixed += 1
    print(f"[skill-fix] repaired {fixed} non-conforming SKILL.md.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
