---
name: skill
description: Select the right mental model before analysis, planning, debugging, strategy, risk review, product design, or decision-making. Use when a task is ambiguous, high-stakes, cross-functional, or benefits from structured reasoning.
argument-hint: "[problem, decision, risk, or strategy question]"
metadata:
  author: seosona
  version: "1.0.0"
---

# Thinking Model Router

Use this skill before complex analysis so the system chooses the right reasoning frame instead of applying generic thinking.

## Core Rule

Pick one to three models. Do not use all models at once unless the task is high-stakes and explicitly needs a multi-model review.

## Dispatch Table

| Situation | Use |
|---|---|
| Need to rebuild from fundamentals | First principles |
| Need to inspect downstream effects | Second-order thinking |
| Need to avoid failure | Inversion or pre-mortem |
| Need structured decision analysis | Kepner-Tregoe |
| Need to know whether to move fast | Reversibility |
| Need to prioritize scarce resources | Opportunity cost |
| Need to update beliefs from weak evidence | Bayesian thinking |
| Need to reduce biased judgment | Debiasing or steel-manning |
| Need a good-enough decision under constraints | Bounded rationality |
| Need to clarify vague requirements | Socratic questioning |
| Need to reason under uncertainty | Probabilistic thinking |
| Need to understand components and side effects | Systems thinking |
| Need to find reinforcing or balancing dynamics | Feedback loops |
| Need to detect recurring organizational patterns | System archetypes |
| Need fast action under changing conditions | OODA |
| Need high-impact intervention | Leverage points |
| Need bottleneck optimization | Theory of Constraints |
| Need to classify complexity | Cynefin |
| Need simpler explanations | Occam's Razor |
| Need to separate metrics from reality | Map-territory |
| Need to decide what to own or escalate | Circle of competence |
| Need to resolve a contradiction | TRIZ |
| Need root-cause analysis | Five Whys Plus |
| Need testable debugging | Scientific method |
| Need edge-case exploration | Thought experiment |
| Need rough sizing | Fermi estimation |
| Need risk buffer | Margin of safety |
| Need durable method selection | Lindy effect |
| Need improvement by removal | Via negativa |
| Need to attack the plan before launch | Red team |
| Need product/customer clarity | Jobs to Be Done |
| Need to start from available resources | Effectuation |
| Need model choice itself | Model selection or model combination |

## Workflow

1. Classify the task:
   - decision, debugging, strategy, product, risk, system, estimation, or discovery.
2. Select one to three models from the dispatch table.
3. State why each selected model fits.
4. Apply the models in a useful order:
   - discovery models first,
   - decision models second,
   - risk models before execution,
   - verification models at the end.
5. Convert the output into an action, test, artifact, or decision record.

## Recommended Combinations

- AI transformation: Cynefin, Systems Thinking, Theory of Constraints, Pre-mortem.
- Debugging: Scientific Method, Five Whys Plus, Occam's Razor.
- Product design: Jobs to Be Done, Map-territory, Red Team.
- Architecture choice: Reversibility, Lindy Effect, Margin of Safety.
- Marketing strategy: Opportunity Cost, Second-order Thinking, Bayesian Thinking.
- Workflow automation: Theory of Constraints, Via Negativa, Effectuation.

## Falsifiability Checks

Every model must produce a checkable claim:

- What observation would prove this wrong?
- What is the cheapest test?
- What evidence would change the decision?
- What output will show that the model helped?

## Anti-Patterns

- Listing many models without applying them.
- Using a model because it sounds impressive.
- Skipping evidence after a model produces a conclusion.
- Treating dashboard metrics, reports, or AI output as reality without checking ground truth.

## Portability Contract

This skill must be usable from any connected IDE, CLI, MCP client, or agent runtime through SEOSONA OS portable routing.

- Discover through `2_KNOWLEDGE/SKILLS_ROUTER.md` or `1_CORE/scripts/seosona_capability_bridge.js`.
- Reference system files with `~/.seosona`, `${SEOSONA_ROOT}`, or relative paths.
- Do not depend on the physical installation path or the environment that originally ingested the source material.

TASK COMPLETED
