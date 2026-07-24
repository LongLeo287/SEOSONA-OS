---
name: progressive-disclosure-skills
description: Architecture for loading agent skills via Progressive Disclosure to save LLM context
category: agentic_workflows
tags: [agent, prompt-engineering, context-optimization, skills]
tier: _TIER_2_LAZY_LOAD
source: Tencent/WeKnora (UAP Extracted)
---

# Progressive Disclosure Agent Skills System

When building Agentic Workflows or configuring LLM System Prompts, do NOT load all available tools or instructions directly into the System Prompt. This bloats the context window, degrades reasoning, and massively increases token costs. Instead, implement the **Progressive Disclosure Strategy**.

## 1. The Progressive Disclosure Philosophy

Skills should be treated as "Instruction Manuals" that the Agent chooses to read, rather than laws forced into their initial brain. 

The architecture follows a strict 3-level lazy-load structure:

### Level 1: Metadata (System Prompt)
**Always Loaded (~100 tokens per skill)**
Inject only the absolute minimum routing metadata into the System Prompt.
- Skill Name
- Short 1-sentence description

*Example format in System Prompt:*
```text
Available Skills you can read:
- [adaptive-graph-chunking]: Advanced 3-tier document chunking for RAG pipelines.
- [claude_seo_framework]: 5-Phase SEO audit execution playbook.
```

### Level 2: Instructions (Lazy Load)
**Loaded on Demand via `read_skill` tool**
If the Agent encounters a task matching the Level 1 metadata, it must autonomously call a tool (e.g., `read_skill("adaptive-graph-chunking")`) to fetch the full markdown instructions of that specific skill.
- The `SKILL.md` file is loaded into the chat context *only* for the duration of the current task.

### Level 3: Resources & Scripts (Execution Sandbox)
**Executed on Demand**
If the Skill contains actionable Python scripts or complex templates, the Agent uses another tool (e.g., `execute_skill_script`) to run the script inside a Sandbox (Docker or local process restriction). 
- Keeps complex code and API calls entirely out of the LLM context until execution.

## 2. Skill Directory Structure

When designing new skills, follow this modular folder structure to support Progressive Disclosure:

```text
my-skill/
├── SKILL.md           # Level 1 & 2: The main instructions (with YAML frontmatter)
├── REFERENCE.md       # Level 3: Optional supplementary docs
├── templates/         # Level 3: Output templates
└── scripts/           # Level 3: Executable scripts (Python/JS)
```

## 3. SEOSONA OS Implementation Note

SEOSONA OS currently utilizes the `SKILLS_ROUTER.md` and `seosona_capability_bridge.js` to achieve a similar outcome. By formalizing this into the "Progressive Disclosure" architecture, Orchestrators can be explicitly instructed to rely on the capability bridge to read skills mid-task rather than front-loading them all during `npm run autonomy:intake`.
