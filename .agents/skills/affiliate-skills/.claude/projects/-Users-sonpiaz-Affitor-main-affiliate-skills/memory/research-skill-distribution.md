---
name: research-skill-distribution
description: Complete research on 76 distribution channels for affiliate-skills — registries, awesome lists, launch platforms, newsletters, directories
type: reference
---

Distribution strategy doc: `docs/distribution-strategy.md`

76 channels across 9 tiers:
- **Tier 1**: 8 agent skills registries (skills.sh, ClawHub, SkillsMP, LobeHub, skild.sh, skillpm, agentskills.so, antfu/skills-npm)
- **Tier 2**: 21 GitHub awesome lists (top: awesome-claude-code 28K★, awesome-openclaw-skills 38K★)
- **Tier 3**: 5 launch platforms (Show HN, Product Hunt, DevHunt, Indie Hackers, BetaList)
- **Tier 4**: 11 dev writing/community (Dev.to, Reddit subs, Hashnode, Medium, HackerNoon)
- **Tier 5**: 8 AI tool directories (Toolify, TAAFT, Futurepedia, FutureTools)
- **Tier 6**: 6 newsletters (TLDR AI 1.25M subs, Rundown 1.75M, Superhuman 1.5M)
- **Tier 7**: 7 open source discovery (GitHub Trending, AlternativeTo, SourceForge)
- **Tier 8**: 5 Discord communities
- **Tier 9**: 5 MCP registries (if wrapper built)

**Compliance gaps before launch:**
1. `version` must be top-level in SKILL.md (for ClawHub)
2. No `<>` in descriptions (for skills.sh)
3. SKILL.md < 500 lines (for skills.sh)
4. Add `tags` array (for ClawHub search)
5. Add GitHub topics to repo
