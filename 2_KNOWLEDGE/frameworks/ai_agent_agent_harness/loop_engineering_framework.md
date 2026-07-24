# Loop Engineering: From Prompt Engineering to Agentic System Building

> Source: Knowledge Ingestion Protocol (User Provided)
> Category: AI Agent / Agent Harness
> Tags: loop-engineering, ai-agents, automation, system-design, agent-harness

---

## Executive Summary

The paradigm of interacting with AI coding agents is shifting. The traditional approach of **"Prompt → Wait → Read Result → Next Prompt"** is becoming obsolete for complex workflows.

As AI models become more capable, the highest value creation no longer lies in crafting the perfect single prompt, but in building an **automated system where AI works autonomously**. This approach is called **Loop Engineering**.

A Loop System autonomously finds work, assigns it to agents, verifies the results, records state, and decides the next step—without manual human intervention at every step.

---

## 🏗️ When to Build a Loop?

Not all tasks should be automated via loops. A Loop should only be constructed if it meets these **4 strict conditions**:

1. ✅ **Frequent Repetition**: If a task is a one-off, direct prompting is faster and cheaper.
2. ✅ **Automated Verification Mechanism**: Must have tests, type-checking, linters, or builds to objectively reject hallucinations. Without this, humans must manually review every diff.
3. ✅ **Sufficient Token Budget**: Loops consume tokens aggressively (retries, validations) regardless of success.
4. ✅ **Senior-Level Tooling**: The agent must possess tools akin to a senior engineer (log reading, reproducible error environments, autonomous code execution).

---

## 🎯 Use Case Alignment

### ✅ Suitable for Loops
- CI Failure Triage
- Dependency Updates & Migrations
- Linting Fixes at Scale
- Issue-to-Pull-Request Pipelines
- Repetitive maintenance on large codebases

### 🚫 Anti-Patterns (Do NOT use Loops)
- Teams with highly constrained AI/token budgets.
- Projects lacking Automated Testing.
- Teams currently bottlenecked at the Code Review stage. *(If human review can't keep up, loops only create infinite work queues and PR backlogs).*

---

## 🧩 The 5 Core Components of a Loop

1. **Automation**: The trigger mechanism (cron/event-based). Needs explicit stop conditions: either a fixed cycle limit or a success state verified by an independent model/agent.
2. **Worktree**: Isolated execution environments (separate directories/branches) to prevent agents from overwriting each other's work.
3. **Skill**: Context injection. A persistent file describing project context, rules, and conventions so the agent doesn't start with amnesia every run.
4. **Connector**: The bridge to external systems (GitHub, Linear/Jira, Slack). Elevates the agent from "advising" to "acting" (opening PRs, tagging tickets).
5. **Sub-agent**: Separation of concerns. One agent writes code, an *independent* agent (often a different model) reviews it. Code-writing agents suffer from extreme self-bias.

---

## 📁 The Critical Role of State Files

Agents do not retain history between isolated sessions. A **State File** is mandatory to persist:
- Completed tasks
- In-progress tasks
- Past decisions and rationales
- Learned experiences/pitfalls

*Without state, a loop restarts from zero upon failure.*

**Advanced implementations also bundle:**
- Vision Documents
- Roadmaps
- Product Goals
*(To prevent the agent from losing the "big picture" over long durations).*

---

## ⚡ Minimum Viable Loop (MVL) Architecture

A basic loop only requires:
1. `1 Automation Trigger`
2. `1 Skill File`
3. `1 State File`
4. `1 Verification Gate`

### Recommended Deployment Order (Risk Mitigation):
1. Execute manually.
2. Codify into a Skill.
3. Package into a Loop.
4. Automate on a schedule.

---

## ⚠️ Common Pitfalls & Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| **Premature Completion** | Agent hallucinates task completion while bugs remain. | Strict Independent Verification Gates. |
| **Goal Drift** | Agent slowly deviates from original requirements over many iterations. | Strong State Files and Vision Documents. |
| **Self-Review Bias** | Agents drastically overestimate the quality of their own code. | Separate Reviewer Agent. |
| **Comprehension Debt** | Loop generates code faster than humans can understand. Gap between actual code and team knowledge widens. | Enforce documentation requirements and human architecture reviews. |
| **Security Risk** | Unsafe merges, excessive permission expansion, credential leaks in logs, prompt injection via external data. | Periodic Permission Audits & Security Reviews. |

---

## 📌 Conclusion

**Loop Engineering** marks the transition from humans *prompting* AI to humans *governing* AI. The engineering value shifts to designing the decision architecture: what the agent does, when it does it, how it verifies, and how it remembers.

Start with the smallest possible loop, expand based on actual friction, and **always maintain humans as the final responsible party**. AI executes the labor; engineers own the decisions.
