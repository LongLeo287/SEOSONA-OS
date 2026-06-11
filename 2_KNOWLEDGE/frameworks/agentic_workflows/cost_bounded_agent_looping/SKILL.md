---
name: seosona:cost-bounded-agent-looping
description: Run autonomous work as a controlled loop: discovery, planning, execution, verification, and iteration. Use for single-agent or fleet-agent workflows that need clear goals, bounded cost, evaluation gates, handoff conditions, and repeatable improvement.
argument-hint: "[goal, constraints, acceptance standard]"
metadata:
  author: seosona
  version: "1.0.0"
---

# Cost-Bounded Agent Looping

Use this skill when a task should run autonomously but must stay controlled, measurable, and cost-aware.

## Default Stance

Use closed looping by default. Use open looping only for short discovery phases with explicit budget and milestone gates.

## Inputs

Require or infer:

- Goal: the concrete result to produce.
- Standard: what "good enough to ship" means.
- Scope: files, systems, data, or domains involved.
- Budget: maximum iterations, time, tool calls, or exploration depth.
- Risk level: low, medium, high, or sensitive.
- Handoff condition: ship, report, ask user, or stop.

## Topology Selection

Choose a single-agent loop when:

- One specialist can own the task.
- The domain is narrow.
- Verification can be done locally.
- The output is one artifact or one small set of related artifacts.

Choose a fleet loop when:

- The task spans multiple domains.
- The output requires independent research, engineering, design, SEO, data, or security checks.
- Parallel discovery can reduce time.
- The orchestrator can define one shared acceptance standard.

## Closed vs Open Decision

Use a closed loop when:

- The task is production-facing.
- Cost matters.
- The workflow is repeatable.
- Quality standards are known.
- The system needs predictable deliverables.

Use an open loop only when:

- The problem space is genuinely unknown.
- Discovery has a capped budget.
- The loop must report at milestones.
- The output can be collapsed into a closed plan before implementation.

## Loop Procedure

### 1. Discovery

- Load relevant memory, Knowledge Items, skills, and local context.
- Identify missing data and cheapest reliable way to obtain it.
- Record constraints and assumptions.

### 2. Planning

- Break work into explicit steps.
- Define verification for each step.
- Decide whether to use single-agent or fleet execution.
- Set the iteration cap before implementation.

### 3. Execution

- Produce the deliverable, not just advice.
- Keep changes scoped to the task.
- Log decisions that change the plan.

### 4. Verification

Verify against the goal and standard using evidence:

- Tests, lint, status commands, screenshots, file checks, data checks, or manual acceptance criteria.
- For UX work: desktop, tablet, mobile, hover, focus, empty, loading, and error states.
- For SEO work: Technical, Content, Schema, GEO, and SXO checks.
- For ingestion work: source inventory, raw snapshot, KI, cleanup, router rebuild, and status.

### 5. Iteration

- Fix only the gaps found by verification.
- Re-run the smallest reliable verification.
- Stop when the acceptance standard passes or the budget is exhausted.

## Evaluation Gates

Every loop must include:

- Goal match: does the output solve the stated task?
- Standard match: does it satisfy explicit quality criteria?
- Evidence: what check proves it?
- Cost check: did the loop stay within budget?
- Handoff decision: ship, continue, ask, or stop.

## Cost Controls

- Prefer closed loops for normal budgets.
- Cap open discovery before it starts.
- Use existing local knowledge before browsing or cloning.
- Reuse existing skills and scripts before creating new ones.
- Avoid broad refactors during narrow tasks.
- Stop exploration when a reliable implementation path is known.

## Fleet Loop Rules

When orchestrating specialists:

- The orchestrator owns the goal and final quality standard.
- Specialists own scoped outputs and evidence.
- Sub-agents inherit the same security, cost, and verification rules.
- The orchestrator resolves conflicts and merges findings into one decision record.

## Output Contract

Return:

- What was done.
- What changed.
- What verification passed.
- Any residual risks or follow-up actions.
- A final handoff state.

## Portability Contract

This skill must be usable from any connected IDE, CLI, MCP client, or agent runtime through SEOSONA OS portable routing.

- Discover through `2_KNOWLEDGE/SKILLS_ROUTER.md` or `1_CORE/scripts/seosona_capability_bridge.js`.
- Reference system files with `~/.seosona`, `${SEOSONA_ROOT}`, or relative paths.
- Do not depend on the physical installation path or the environment that originally ingested the source material.

TASK COMPLETED
