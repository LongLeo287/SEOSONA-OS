---
name: skillspector
description: "Security scanner for AI agent skills (NVIDIA SkillSpector, Apache-2.0, local). Detects 68 vulnerability patterns across 17 categories — prompt injection, data exfiltration, memory poisoning, MCP tool poisoning, supply-chain CVEs (OSV.dev), behavioral AST/taint analysis, YARA. Use to audit the SKILL.md library and especially the _TIER_3_BLACKLIST quarantine: objective, auditable basis for what stays blacklisted vs cleared. Wired as 1_CORE/scripts/skill_security_scan.py + npm run skills:security."
license: Apache-2.0
metadata:
  type: security-gate
  source: https://github.com/NVIDIA/SkillSpector
  wired_into: 1_CORE/scripts/skill_security_scan.py
---

# NVIDIA SkillSpector — skill security gate

(Corrected 2026-06-25 — the prior note mislabeled this as a capability evaluator. It is a
**security scanner for agent skills**, not a capability matrix tool.)

## What it does
Static + behavioral security analysis of agent "skills": 68 vuln patterns / 17 categories
incl. prompt injection, data exfiltration, **memory poisoning**, **MCP tool poisoning**,
supply-chain CVEs via OSV.dev, AST/taint tracking, and YARA rules. Local-first.

## How SEOSONA OS uses it
SEOSONA OS has ~294 `SKILL.md` and a `_TIER_3_BLACKLIST` of dual-use security skills that
need objective hygiene (see the GitHub-hygiene cleanup). Run the scanner as a gate:

```bash
npm run skills:security          # scan _TIER_3_BLACKLIST + .agents/skills (default)
python 1_CORE/scripts/skill_security_scan.py <path>   # scan a specific path
```
Install (one-time): `uv tool install skillspector`. The runner is non-blocking — if the
tool isn't installed it prints the install hint and skips, so it never breaks a build.

## Why it matters here
- `memory poisoning` detection ↔ the 3_MEMORY dedup/reflection work (`memory_reflect.py`).
- `MCP tool poisoning` ↔ the multi-agent harness + MCP skills.
- Gives the `_TIER_3_BLACKLIST` an auditable keep-vs-clear basis instead of manual judgement.

## ✅ Operational (2026-06-25)
Installed via `uv tool install --python 3.12 git+https://github.com/NVIDIA/SkillSpector`
(not on PyPI under a bare name; needs Python 3.12 which uv provides). `npm run skills:security`
runs `skillspector scan --recursive --no-llm` (static + YARA, no API key needed). First real
run on `_TIER_3_BLACKLIST/claude-bug-bounty` flagged HIGH findings (prompt-injection YARA +
offensive-tool references) — confirming the dual-use risk. For the deeper LLM pass set
`SEOSONA_SKILLSCAN_LLM=1` + an `OPENAI_API_KEY`.
