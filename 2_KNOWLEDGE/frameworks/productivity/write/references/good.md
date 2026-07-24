Write good creative & smart copy for this user request:
<user_request>$ARGUMENTS</user_request>

## Workflow

- If the user provides screenshots, use `ai-multimodal` skill to analyze and describe the context in detail.
- If the user provides videos, use `ai-multimodal` (`video-analysis`) skill to analyze video content.
- Activate `creativity` skill for creative direction - style selection, color psychology, tone guidance.
- Use multiple `researcher` agents in parallel to search for relevant information, then report back to main agent.
- Use `/scout:ext` (preferred) or `/scout` (fallback) slash command to search the codebase for files needed to complete the task
- Use `planner` agent to plan the copy, make sure it can satisfy the user request.
- Use `copywriter` agent to write the copy based on the plan, then report back to main agent.

### Illustration Design (Post-Writing)

After content is finalized:

1. **Design illustrations** — Invoke `/ckm:design` skill (social photos sub-skill) to create 2-3 illustrations that visually support key sections of the article. Provide the design skill with:
   - Article topic and key themes
   - Target platform/format dimensions
   - Brand context from user's `docs/brand-guidelines.md`
   - Specific sections that benefit most from visual support

2. **Verify illustrations** — Invoke `ai-multimodal` skill to analyze each generated illustration for:
   - Visual accuracy and relevance to article content
   - Text readability (no truncated/overlapping text)
   - Layout integrity (no broken elements, proper alignment)
   - Brand consistency (colors, fonts, style)
   - If errors detected: regenerate the flawed illustration with corrected parameters, then re-verify
