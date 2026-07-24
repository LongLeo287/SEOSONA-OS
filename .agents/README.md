# .agents — Agent skills & rules

Portable agent capabilities that plug into the OS's skill router. These are consumed by AI agents at
runtime; the skills here are auto-indexed into [`2_KNOWLEDGE/SKILLS_ROUTER.md`](../2_KNOWLEDGE/SKILLS_ROUTER.md).

## Folders

| Folder | What's inside |
|---|---|
| `skills/` | 35 vendored agent skills — each a self-contained `SKILL.md` package (video editing, browser search, code review, design, marketing, meta-skill tooling, …). The router selects the relevant ones per task. |
| `rules/` | Agent guardrail rules (e.g. malware-protection, plugin-tier protocol) applied across skills. |
| `INBOX/` | Intake staging for new skills/tasks before they're vetted and wired in. |

## What's not tracked

A few genuinely-heavy, fetch-on-demand parts of individual skills are gitignored (see the root
`.gitignore`): `skills/kami/assets/` (fonts) and `skills/notebooklm-py/tests/` (VCR cassettes). The
skill code runs without them; see [SETUP.md](../SETUP.md) to fetch them if needed.
