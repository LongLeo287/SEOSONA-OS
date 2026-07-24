Scaffold a new skill for the affiliate-skills repo.

Ask the user for:
1. Skill name (kebab-case, verb-noun format)
2. Which stage? (research, content, blog, landing, distribution)
3. Brief description of what it does

Then:
1. Create `skills/{stage}/[skill-name]/SKILL.md` from `template/SKILL.md`
2. Create `skills/{stage}/[skill-name]/references/` directory
3. Copy `LICENSE` to `skills/{stage}/[skill-name]/LICENSE.txt`
3. Fill in the template with the user's input
4. Remind the user to write at least 2 examples and test with 3 prompts before PR
