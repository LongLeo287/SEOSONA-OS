# KI: Claude Plugin Standard (Official)

_Source: [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Wave 5 (2026-06-25)_

## Core Concept

Official Claude Code plugins marketplace maintained by Anthropic. Defines the standard plugin structure with `plugin.json` manifest and optional `.mcp.json` for MCP server integration.

## Plugin Structure

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json      # Plugin metadata (required)
├── .mcp.json             # MCP server config (optional)
├── CLAUDE.md             # Plugin instructions for Claude
├── hooks/                # Event hooks (optional)
└── src/                  # Plugin source code
```

## Installation

```bash
# Install from official marketplace
/plugin install {plugin-name}@claude-plugins-official

# Browse available plugins
/plugin > Discover
```

## Directory Structure

- `/plugins/` — Internal plugins developed by Anthropic
- `/external_plugins/` — Third-party plugins from partners and community

## Comparison with SEOSONA Skill Format

| Feature | Claude Plugin | SEOSONA Skill |
|---|---|---|
| Manifest | `.claude-plugin/plugin.json` | `SKILL.md` YAML frontmatter |
| MCP Config | `.mcp.json` | Inline in SKILL.md |
| Install | `/plugin install` | Manual copy to `.agents/skills/` |
| Discovery | `/plugin > Discover` | `SKILLS_ROUTER.md` text search |
| Hooks | Standard hook system | `1_CORE/hooks/` CJS hooks |
| Distribution | GitHub marketplace | Git submodules / manual |

## Key Insight

The official plugin format is lightweight and compatible with SEOSONA's approach. Our SKILL.md frontmatter maps closely to `plugin.json` fields. Consider:

1. **Dual-format support**: Generate `plugin.json` from SKILL.md frontmatter
2. **Plugin install CLI**: Wrap our existing skill routing with `/plugin install` semantics
3. **MCP integration**: `.mcp.json` pattern already used in SEOSONA's MCP configuration

## Submission Process

External plugins must meet quality and security standards. Submit via: https://clau.de/plugin-directory-submission

## SEOSONA Integration Points

- `~/.seosona/1_CONFIG/schemas/` — add `plugin.json` schema for validation
- `~/.seosona/cli/` — consider `seosona plugin` subcommand wrapping skill operations
- `.agents/skills/` — ensure skills can export dual-format (SKILL.md + plugin.json)
