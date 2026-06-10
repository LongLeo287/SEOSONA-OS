# SOP: Context Cleaning & Optimization

**Skill Reference:** `2_KNOWLEDGE/sops/context_cleaning_optimization.md`

## 1. PURPOSE
This protocol ensures the Context Window remains optimized and prevents Context Overflow caused by garbage data, excessive whitespace, or bloated compiler error logs.

## 2. CLEANING RULES
- **Token Efficiency:** When loading data from `.aaak` files or physical memory, extract only the focal points and essential parameters.
- **Compiler Log Truncation:** If a compiler error log exceeds 50 lines, retain only the first 20 lines (containing the core error cause) and the last 10 lines (conclusion). Strip out all irrelevant stack traces.
- **Whitespace Pruning:** Maintain basic indentation structure, but strictly remove redundant empty lines when passing data into Prompts.
- **Placeholder Elimination:** The use of placeholders (e.g., `// rest of code...`) is strictly prohibited. Output code must be complete, but avoid repeating irrelevant or unmodified modules.

## 3. LOG OPTIMIZATION
- Overly long chat histories must be synthesized using a Fan-out background agent.
- Overwrite old state logs with compressed summaries instead of keeping the full conversational transcript.
