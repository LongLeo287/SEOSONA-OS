# KI: Skill Manager CLI Patterns

_Source: [ivanpham86/Claude-code-skill-manager](https://github.com/ivanpham86/Claude-code-skill-manager) | Wave 4 (2026-06-22)_

## Core Concept

A CLI tool for managing, installing, routing, and uninstalling Skills for Claude Code. Provides dynamic skill lifecycle management instead of static text-based routing.

## Key Patterns for SEOSONA OS

### 1. Skill Lifecycle Management
- **Install**: `skill-mgr install <skill-name>` — downloads and registers a skill
- **Uninstall**: `skill-mgr remove <skill-name>` — cleanly removes a skill
- **List**: `skill-mgr list` — shows all installed skills with metadata
- **Route**: `skill-mgr route <query>` — finds the best skill for a given query

### 2. Comparison with SEOSONA SKILLS_ROUTER

| Feature | SKILLS_ROUTER.md (Current) | Skill Manager CLI |
|---|---|---|
| Discovery | Static text file (~2.4MB) | Dynamic CLI lookup |
| Install/Remove | Manual file copy | Automated CLI |
| Routing | Text search in MASTER_INDEX | Semantic + keyword matching |
| Versioning | None | Git-based version tracking |
| Dependencies | None | Declared in skill manifest |

### 3. Skill Manifest Format
```json
{
  "name": "skill-name",
  "version": "1.0.0",
  "description": "What the skill does",
  "keywords": ["keyword1", "keyword2"],
  "dependencies": ["other-skill"],
  "entrypoint": "SKILL.md",
  "tier": "core|lazy|blacklist"
}
```

### 4. Dynamic Routing Algorithm
1. Parse user query into keywords
2. Score each skill by keyword overlap + semantic similarity
3. Return top-N matches with confidence scores
4. If confidence < threshold, suggest creating a new skill

## Actionable Takeaways

1. The `seosona_capability_bridge.js` already does keyword-based routing — this validates our approach
2. **Gap**: SEOSONA lacks install/uninstall automation. Skills are manually placed in directories
3. **Opportunity**: Build a `seosona skill` CLI subcommand that wraps install/remove/list/route
4. The manifest format could standardize our existing `SKILL.md` frontmatter

## SEOSONA Integration Points

- `~/.seosona/cli/` — add `seosona skill install/remove/list/route` commands
- `~/.seosona/1_CONFIG/schemas/` — add `skill.manifest.schema.json`
- `~/.seosona/2_KNOWLEDGE/SKILLS_ROUTER.md` — consider auto-generating from manifests
