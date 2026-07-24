---
description: 💡💡 Customer persona management
argument-hint: [action]
---

Create and manage customer personas.

<action>$ARGUMENTS</action>

## Actions
- `create` - Create new persona
- `analyze` - Analyze audience data
- `update [name]` - Update existing persona
- `list` - List all personas

## Workflow

1. **Parse Action** from `$ARGUMENTS`

2. **Create Workflow**
   - Use `lead-qualifier` agent for persona definition
   - Gather via `AskUserQuestion`:
     - Demographics (age, role, industry)
     - Pain points and challenges
     - Goals and motivations
     - Buying behavior
     - Preferred channels
   - Use `researcher` agent for market validation
   - Activate `content-marketing` skill

3. **Analyze Workflow**
   - Use `lead-qualifier` agent for audience analysis
   - Use `analytics-analyst` for behavior data
   - Identify segments and patterns
   - Generate insights report

4. **Update Workflow**
   - Load existing persona
   - Incorporate new data
   - Validate changes

5. **Output**
   - ICP Profiles → `assets/leads/icp-profiles/{persona}.md`

## Agents Used
- `lead-qualifier` - Audience analysis
- `researcher` - Market research

## Skills Used
- `content-marketing` - Persona frameworks
- `assets-organizing` - Standardized output paths

## Output
- ICP Profiles → `assets/leads/icp-profiles/{persona}.md`

## Examples
```
/persona create
/persona analyze
/persona update "Tech Startup Founder"
/persona list
```
