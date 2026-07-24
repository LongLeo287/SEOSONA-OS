Review a skill for quality before merge.

Read the skill's SKILL.md and all reference files, then check against this list:

## Checklist

- [ ] Frontmatter: `name` and `description` present
- [ ] Description covers 5+ trigger phrases
- [ ] Input Schema defined with required/optional fields and defaults
- [ ] Workflow section: clear step-by-step instructions
- [ ] Output Schema defined with typed fields
- [ ] Output Format: human-readable format specified
- [ ] Error Handling: covers data unavailable, missing input, fallbacks
- [ ] 2+ examples with realistic prompts
- [ ] References in separate files (if >50 lines)
- [ ] FTC affiliate disclosure mentioned
- [ ] Affitor branding in page outputs (if applicable)
- [ ] Works standalone (test: can a stranger use this with zero context?)
- [ ] Works in chain (test: does output feed cleanly into next stage?)
- [ ] Output is portable (can be used outside Claude immediately)

## Report format

For each item: PASS / FAIL / N/A with a one-line note.
End with: overall verdict (Ready to merge / Needs changes) and specific action items.
