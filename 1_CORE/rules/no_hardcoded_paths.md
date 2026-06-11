# SEOSONA Rule: No Hardcoded Paths

**Priority:** CRITICAL — Violation breaks portability and is treated as a system fault.

## The Rule

**NEVER write absolute or machine-specific filesystem paths into any SEOSONA system file.**

This includes (but is not limited to): `.md` files, `.json` configs, `.yaml` configs, `.py` scripts, SOPs, workflows, agent personas, and skill files.

## What is a Violation?

Examples of **FORBIDDEN** patterns:
```
<drive>:/<install-root>/3_MEMORY
<drive>:\Users\<person>\...
<home>/<person>/seosona/...
<mac-home>/<person>/projects/...
```

## What to Use Instead

There are three approved portable path patterns:

### 1. `${SEOSONA_ROOT}` — Environment Variable Anchor (Configs & Scripts)
Use in JSON/YAML config files and Python scripts.
```json
"${SEOSONA_ROOT}/3_MEMORY"
"${SEOSONA_ROOT}/2_KNOWLEDGE/raw_data"
```
Resolved at runtime from the `SEOSONA_ROOT` variable in the machine's `.env` file (see `1_CONFIG/.env.example`).

### 2. `~/.seosona/` — Symlink Anchor (Markdown references)
Use in `.md` documentation files when referencing OS-level paths.
```markdown
Read the SOUL at `~/.seosona/1_CORE/SOUL.md`
```
The `~/.seosona` symlink is created once during `seosona setup` and always points to the real OS directory.

### 3. Relative Paths — Best Default (Markdown & Workflows)
Whenever you are inside the OS workspace, use paths relative to the SEOSONA OS root.
```markdown
See: `2_KNOWLEDGE/SKILLS_ROUTER.md`
Output goes to: `3_MEMORY/seo_exports/<domain>/`
```

## Enforcement

This rule is encoded as **Protocol Rule #7** in `1_CORE/SOUL.md`. It is enforced by cognitive security checks referenced in `1_CORE/rules/security_regex_rules.md`.
