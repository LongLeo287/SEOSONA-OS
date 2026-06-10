# Output Standards & Quality

## Plan File Format

### YAML Frontmatter (Required for plan.md)

All `plan.md` files MUST include YAML frontmatter:

```yaml
---
title: "{Campaign/initiative title}"
description: "{One-sentence summary for preview}"
status: pending  # pending | in-progress | completed | cancelled
priority: P2     # P1 (High) | P2 (Medium) | P3 (Low)
effort: 20h      # Estimated total effort
campaign_type: product_launch  # product_launch | content | brand | lead_gen | retention
channels: [email, social, paid]
budget: $5,000   # Total budget
target_kpi: 1000 leads
created: 2025-12-16
---
```

### Auto-Population Rules

When creating plans, auto-populate:
- **title**: Extract from campaign brief
- **description**: First sentence of Overview
- **status**: Always `pending` for new plans
- **campaign_type**: Infer from objectives
- **channels**: From channel strategy
- **budget**: From resource planning
- **target_kpi**: Primary success metric

### Tag Vocabulary (Marketing)

Use these predefined tags:
- **Type**: `product_launch`, `content`, `brand`, `lead_gen`, `retention`, `event`
- **Channel**: `email`, `social`, `paid`, `seo`, `content`, `influencer`, `affiliate`
- **Stage**: `awareness`, `consideration`, `conversion`, `loyalty`

## Task Breakdown

- Transform campaign strategy into actionable tasks
- Each task independently executable with clear dependencies
- Prioritize by dependencies, timing, business impact
- Include specific asset specs and deliverables
- Provide clear success metrics per task

### Deliverable Management
List deliverables with:
- Asset type and specifications
- Channel destination
- Timeline and deadlines
- Approval requirements
- Dependencies on other deliverables

## Workflow Process

1. **Initial Analysis** → Review brand docs, understand context
2. **Research Phase** → Market, competitor, audience research
3. **Synthesis** → Analyze insights, identify opportunities
4. **Strategy Phase** → Create positioning, channel, content strategy
5. **Plan Documentation** → Write comprehensive marketing plan
6. **Review & Refine** → Ensure completeness, feasibility, alignment

## Output Requirements

### What Marketing Planners Do
- Create marketing plans ONLY (no execution)
- Provide plan file path and summary
- Self-contained plans with brand context
- Creative concepts when clarifying approach
- Multiple options with trade-offs when appropriate

### Writing Style
**IMPORTANT:** Sacrifice grammar for concision
- Focus clarity over eloquence
- Use bullets and lists
- Short sentences
- Remove unnecessary words
- Prioritize actionable info

### Unresolved Questions
**IMPORTANT:** List unresolved questions at end
- Questions needing stakeholder input
- Creative decisions requiring approval
- Budget trade-offs needing decision
- Timeline conflicts to resolve

## Quality Standards

### Strategic Alignment
- Align with brand guidelines and voice
- Consider competitive positioning
- Think through full customer journey
- Document all assumptions

### Feasibility
- Consider resource constraints
- Plan for realistic timelines
- Account for approval processes
- Design for team capabilities

### Measurability
- Clear KPIs for each initiative
- Define success benchmarks
- Plan measurement approach
- Consider attribution challenges

### Optimization
- Design for testing and iteration
- Plan contingency approaches
- Consider seasonal factors
- Allow flexibility for pivots

**Remember:** Plan quality determines campaign success. Be comprehensive, consider all marketing aspects.
