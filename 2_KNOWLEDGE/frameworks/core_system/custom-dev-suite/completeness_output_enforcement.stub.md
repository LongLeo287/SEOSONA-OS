# STUB: Completeness Output Enforcement

> **This is a placeholder.** The real file (`completeness_output_enforcement.md`) is private
> and excluded from the public repo via `.gitignore`.
>
> **To populate this skill locally:**
> 1. Define your personal completeness rules for AI output (no truncation, no "etc.", full code blocks)
> 2. Run the UAP ingestion workflow: `1_CORE/workflows/knowledge_ingestion_workflow.md`
> 3. Save as `completeness_output_enforcement.md` (without `.stub`)

## What this skill should contain

Rules that enforce AI agents to never truncate output:

- Never use `// ... rest of code`, `# TODO`, or similar placeholders
- Always output complete, runnable code blocks
- Never summarize when full content was requested
- Always complete the current task before asking for follow-ups
- Output verification checklist before finishing

## Reference Sources

- Inspired by: [Simon Willison on LLM output completeness](https://simonwillison.net)
- Anti-pattern examples from AI coding tools truncating large files
