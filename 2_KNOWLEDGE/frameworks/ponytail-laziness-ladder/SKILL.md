---
name: ponytail-laziness-ladder
description: "Code-frugality skill (DietrichGebert/ponytail, MIT, 55k★) — a 'laziness ladder' that makes an agent reuse/extend/skip code instead of generating verbose new code. Use to cut output bloat on coding tasks: reported ~54% less code, ~20% lower cost, ~27% lower latency. Drop-in agent skill, directly on-domain for SEOSONA OS's agent runtime."
license: MIT
metadata:
  type: agent-skill
  source: https://github.com/DietrichGebert/ponytail
---

# ponytail — the laziness ladder (less code, lower cost)

[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT, 55.6k★, active).
A skill that enforces a "laziness ladder": before writing new code, an agent should prefer
to (1) reuse an existing function, (2) extend it, (3) configure rather than code, and only
then (4) write minimal new code. Reported impact: ~54% less generated code, ~20% lower cost,
~27% lower latency.

## Why adopt for SEOSONA OS
The OS runs agents that generate code; output bloat = cost + review burden. ponytail is a
ready agent skill that directly curbs that — exactly the kind of harness-quality win the
deer-flow/looper patterns aim at, but packaged as an installable skill.

## Integration action
1. Install the skill into `.agents/skills/` (`npx skills add` or copy the SKILL.md + assets),
   then `python 1_CORE/scripts/core/plugin_manager.py` to route it.
2. Run it through `npm run skills:security` + `npm run skills:validate` first (OS hygiene).
3. Apply it as a default behavior in the coding-agent dispatch so generation defaults to
   reuse-first. Pairs with `context_compressor.py` (fewer tokens) and `fastcode-navigation`
   (find the existing code to reuse).
