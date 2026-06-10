# Karpathy Coding Standards

Behavioral coding guidelines to minimize LLM complexity and bugs.

## 1. Think Before Coding
* Explicitly state assumptions. Ask if confused.
* Present multiple implementations/tradeoffs. Never choose silently.
* Propose simpler, cleaner alternatives when warranted.

## 2. Simplicity First
* Write the minimum code required to solve the problem.
* Avoid speculative abstractions or features that were not requested.
* If 200 lines can be written as 50, rewrite it.

## 3. Surgical Changes
* Edit only what you must.
* Do not reformulate adjacent code, style, or comments outside task scope.
* Match local style and naming conventions exactly.

## 4. Goal-Driven Execution
* Establish quantitative success criteria before editing code.
* Define step-by-step plans: `[Step] -> verify: [check]`.
