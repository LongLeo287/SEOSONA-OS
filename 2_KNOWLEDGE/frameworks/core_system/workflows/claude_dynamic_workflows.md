# Claude Dynamic Workflows

**Source:** Article "A harness for every task: dynamic workflows in Claude Code" by Thariq Shihipar & Sid Bidasaria.

## 1. Core Concept
Dynamic workflows allow an AI agent to write its own execution harness "on the fly," custom-built for complex tasks like research, security analysis, agent teams, or code reviews. Instead of a single context window executing everything (which suffers from decay), dynamic workflows orchestrate multiple sub-agents with clean, isolated context windows.

## 2. Failure Modes Prevented
Using dynamic sub-agents mitigates three major context-decay issues:
1. **Agentic Laziness**: Stopping before finishing a multi-part task (e.g., stopping at 20/50 items).
2. **Self-Preferential Bias**: The tendency for an AI to prefer its own generated results when asked to verify them in the same context window.
3. **Goal Drift**: Gradual loss of fidelity to original objectives and constraints across many turns due to summarization and compaction.

## 3. The 6 Powerful Workflow Patterns
When designing system behaviors or skills, the following orchestration patterns should be used:
1. **Classify-and-Act**: A classifier agent routes the task to specific sub-agents based on the detected intent.
2. **Fan-Out-and-Synthesize**: Break a task into smaller pieces, assign one isolated sub-agent to each piece simultaneously, then merge the results using a synthesis barrier.
3. **Adversarial Verification**: For every execution sub-agent spawned, spawn a separate "Skeptic/Reviewer" sub-agent to adversarially test the output against a strict rubric.
4. **Generate-and-Filter**: Generate multiple ideas in parallel, run them through a verification filter, deduplicate, and return the survivors.
5. **Tournament**: Spawn N agents to solve the same problem using different approaches. A judging agent evaluates them pairwise until a winner emerges.
6. **Loop Until Done**: Instead of a fixed iteration count, spawn agents continuously until a deterministic stop condition is met (e.g., zero bugs remaining).

## 4. Integration into SEOSONA System
- These patterns must be adopted by the **Orchestrator Agent** when planning complex multi-step user prompts.
- When creating new Skills (`create_skill_workflow.md`), the Orchestrator should evaluate if a Fan-Out or Tournament pattern would yield better results than linear execution.

