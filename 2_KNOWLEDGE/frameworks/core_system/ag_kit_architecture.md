# SEOSONA Kit (AG-Kit) Architecture

**Source**: `vudovn/ag-kit`
**Status**: Core Integration (Sub-agent Coordination Workflow)

AG-Kit introduces specialized Design Patterns tailored for complex Multi-Agent systems. Within SEOSONA, AG-Kit serves as the Orchestrator brain, dynamically dividing and managing system resources.

---

## 1. Coordinator Mode

Typically, when executing a complex task, agents run on a "Sequential Retries" pattern (Attempt -> Fail -> Retry). This bloats the context memory and causes the Agent to suffer from Cognitive Overload.

**Coordinator Mode solves this by:**
1. An `Orchestrator Agent` analyzes the Task.
2. It breaks the Task down into isolated Sub-tasks.
3. It spawns Sub-agents to work in **Parallel**.
4. Once the Sub-agents complete their tasks, the `Orchestrator` aggregates the results and synthesizes the final Output.
*Benefits*: Massive token reduction; the Agent does not confuse root code with debugging code.

---

## 2. Context Compression

Similar to the Headroom Compression Engine, AG-Kit automatically compresses context after every working session.
- Instead of forcing the LLM to read 50 pages of error logs, AG-Kit triggers a `Micro-compaction` loop.
- This loop summarizes the log: "Attempted Axios but hit CORS error. Switched to Fetch API and succeeded."
- The Context Window remains pristine, clean, and concise at all times.

---

## 3. Persistent Memory Taxonomy

To prevent the agent from re-explaining the core principles of a project in every new Session, AG-Kit introduces the `MEMORY.md` taxonomy structure:

| Memory Type | Loading Frequency | Purpose |
|---|---|---|
| **Core Directives** | Always (System Prompt) | Survival rules (e.g., Never drop a Production Database). |
| **Project Guidelines** | On Demand (Conditional) | Specific Code conventions, Tech Stack choices, and architecture decisions for a specific project. |
| **State Tracking** | Continuous Read/Write | Tracking TODO lists, Unresolved Bugs, Work-in-Progress state. |
| **Knowledge Base** | Retrieval (Search) | System documentation, Knowledge Items (KIs). |

---

## 4. Conditional Skill Loading

Never cram the entire `.agents/skills` directory into the System Prompt.
- AG-Kit leverages **Slash Commands** (`/plan`, `/brainstorm`) or **Regex Triggers** to conditionally load only the required Skills.
- Example: If the user chats about "Design", the system detects the keyword and only loads `UI_UX_Skill.md` into temporary memory. This saves 80% of unnecessary Token overhead.

