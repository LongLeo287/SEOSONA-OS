# Kit Builder Best Practices

## Universal Principles

### YAGNI - KISS - DRY
- **YAGNI**: Don't build it until needed
- **KISS**: Simplest solution that works
- **DRY**: Extract patterns, not copy-paste

### Token Efficiency
- Files <100 lines
- Progressive disclosure
- Index → Reference pattern

### Naming Conventions
- lowercase-hyphenated
- Descriptive (LLMs read names)
- Consistent across project

## Component Selection

| Need | Build |
|------|-------|
| Domain knowledge | Skill |
| Autonomous handler | Agent |
| User action | Command |
| Process definition | Workflow |

## Marketing Kit Patterns

### Content Pipeline
```
Command → Agent → Skills → Output
/write:blog → content-creator → copywriting, seo → assets/articles/
```

### Campaign Pipeline
```
/campaign → campaign-manager → [email-wizard, social-media-manager] → multi-channel
```

## Anti-Patterns

### Don't
- Create skill for one-time task
- Duplicate info across files
- Write documentation instead of instructions
- Make agents too generic

### Do
- Combine related patterns into skill
- Reference, don't duplicate
- Focus on "how to do" not "what is"
- Make agents specific to trigger

## Testing Components

### Skill
1. Trigger in conversation
2. Verify activation
3. Test references load
4. Run scripts manually

### Agent
1. Trigger via Task tool
2. Verify skill activation
3. Check output quality
4. Test edge cases

### Command
1. Run /command
2. Verify workflow executes
3. Check outputs created
4. Test with/without args

## Maintenance

### When to Update
- New patterns discovered
- User feedback received
- Related components changed
- Better approach found

### Version Control
- Commit meaningful changes
- Document breaking changes
- Test before push

## Checklist

### New Skill
- [ ] SKILL.md <100 lines
- [ ] References split logically
- [ ] Scripts have tests
- [ ] Description triggers activation
- [ ] Agent integration noted

### New Agent
- [ ] Examples in description
- [ ] Skills to activate noted
- [ ] Output format defined
- [ ] Asset paths specified
- [ ] Model appropriate

### New Command
- [ ] Arguments documented
- [ ] Skills activated
- [ ] Token indicator set
- [ ] Workflow clear
- [ ] Error handling

### New Workflow
- [ ] Phases defined
- [ ] Agents assigned
- [ ] Quality gates set
- [ ] Outputs specified
- [ ] Decision trees clear
