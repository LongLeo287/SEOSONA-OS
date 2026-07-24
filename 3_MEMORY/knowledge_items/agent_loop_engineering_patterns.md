# KI: Agent Loop Engineering Patterns

_Source: [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering) | Wave 4 (2026-06-22)_

## Core Concept

Loop Engineering provides practical patterns, starters, and CLI tools for designing cost-controlled agent loops. Inspired by Addy Osmani and Boris Cherny's work on agentic coding patterns. Includes `loop-audit`, `loop-init`, and `loop-cost` CLI tools.

## Key Patterns for SEOSONA OS

### 1. Cost-Bounded Agent Loops
- **Pattern**: Set a token/cost ceiling per loop iteration; if exceeded, the loop escalates or terminates
- **Current SEOSONA**: `seosona:cost-bounded-agent-looping` skill is declared in SKILLS_ROUTER but has no implementation
- **Action**: Use loop-engineering patterns to implement the actual cost-bounding logic

### 2. Loop Audit (`loop-audit`)
- Scans agent loop code for common anti-patterns: infinite loops, missing exit conditions, escalating token usage
- **Application**: Run as a pre-commit check for any agent workflow in SEOSONA OS

### 3. Loop Initialization (`loop-init`)
- Scaffolds a new agent loop with built-in cost controls, exit conditions, and logging
- **Template structure**:
  ```
  loop/
  ├── config.json      # max_iterations, cost_ceiling, timeout
  ├── loop.py          # main loop logic
  ├── exit_checker.py  # exit condition evaluator
  └── cost_tracker.py  # token/cost accumulator
  ```

### 4. Cost Estimation (`loop-cost`)
- Pre-estimates the token cost of a loop before execution
- Uses model pricing + estimated iterations to forecast total cost
- **Application**: Integrate into the `autonomy:intake` pipeline — estimate cost before executing UAP or large workflows

## Loop Design Rules (from the repo)

1. **Always set max_iterations** — never allow unbounded loops
2. **Track cumulative cost** — not just per-iteration, but total
3. **Implement exponential backoff** — on retries, increase wait time
4. **Log every iteration** — for post-mortem analysis
5. **Exit early on diminishing returns** — if quality score plateaus, stop

## SEOSONA Integration Points

- `~/.seosona/2_KNOWLEDGE/frameworks/agentic_workflows/cost_bounded_agent_looping/` — implement the skill
- `~/.seosona/1_CORE/scripts/` — add `loop_cost_estimator.py`
- `~/.seosona/2_KNOWLEDGE/sops/` — add `agent_loop_design_sop.md`
