---
name: "effect_ts_patterns"
description: "Functional programming patterns using Effect-TS for robust error handling, concurrency, and composable service architecture."
version: "1.0.0"
tags: ["typescript", "effect-ts", "functional-programming", "error-handling", "architecture"]
---

# Skill: Effect-TS Patterns

## Core Patterns
1. **Effect<A, E, R>**: Typed effects with success (A), error (E), and requirements (R) channels.
2. **Service Pattern**: Define services as interfaces, provide implementations via Layers.
3. **Error Channel**: Type-safe error handling — no uncaught exceptions.
4. **Concurrency**: Structured concurrency with fibers, scopes, and cancellation.
5. **Composition**: pipe() and flow() for composable transformations.

## When to Use
- Building reliable API services that need typed error handling
- Complex async workflows with proper cancellation
- Dependency injection without frameworks
- Stream processing (large data pipelines)

## Integration
- Used by `fullstack-developer` agent for TypeScript projects
- Complements `code-reviewer` agent's quality checks
- Relevant for `backend_engineering/` framework patterns

## Quality Validation
- [ ] All effects have typed error channels (no `unknown` errors)
- [ ] Services use Layer-based dependency injection
- [ ] Proper resource cleanup via Scope/finalizers
