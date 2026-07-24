# KI: Agent Skills Architecture Comparison

_Source: UAP Wave 3 analysis of `addyosmani/agent-skills` vs SEOSONA SKILL.md format_

## SEOSONA SKILL.md Format
- YAML Frontmatter: `name`, `description`, `version`, `author`, `tags`, `mcp_compatible`
- Sections: Inputs, Execution Steps, Guardrails, Quality Validation, Example Invocation
- Routing: Keyword-based matching via `SKILLS_ROUTER.md`
- Discovery: `plugin_manager.py` scans `2_KNOWLEDGE/frameworks/` recursively

## Addy Osmani Agent Skills Format
- Self-contained markdown files with YAML frontmatter
- Tag-based semantic routing (vs our keyword-based matching)
- Skills can reference and compose other skills (composition pattern)
- Each skill has built-in validation criteria
- Categorized by engineering domain (code review, debugging, architecture, etc.)

## Key Differences

| Dimension | SEOSONA OS | Addy Osmani |
|---|---|---|
| **Routing** | Keyword matching | Tag-based semantic |
| **Composition** | Skills are standalone | Skills can compose others |
| **Validation** | Quality Validation checklist | Built-in test cases |
| **Scope** | SEO + Marketing + Engineering | Engineering only |
| **Discovery** | `plugin_manager.py` scan | Static registry |
| **MCP Integration** | Explicit `mcp_compatible` flag | Not MCP-aware |

## Actionable Insights for SEOSONA OS
1. **Adopt composition**: Allow skills to reference other skills (e.g., `report_generator` composes `psi_connector` + `gsc_connector`).
2. **Add test cases**: Include example input/output pairs in each SKILL.md for automated validation.
3. **Hybrid routing**: Combine keyword matching with tag-based semantic similarity for better intent resolution.
