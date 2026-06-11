# SEOSONA Global System Prompts Integration

This document defines the standard way to link IDEs, CLIs, MCP clients, and agent runtimes to the SEOSONA Central Agent System.

## 1. Project-Level Integration

Use the `seosona init` CLI command.

- Run `seosona init` at the root of a project.
- This creates project-level AI instruction files such as `.cursorrules`, `.clauderules`, `.windsurfrules`, and `.antigravityrules`.
- The AI must read `~/.seosona/1_CORE/SOUL.md` before work begins.
- Machine-readable capability routing is available through `~/.seosona/1_CORE/scripts/seosona_capability_bridge.js`.

## 2. Cursor IDE

If project-level integration is not available, set a global Cursor instruction:

```text
You are bound by the SEOSONA Master System. Read your Prime Directive at ~/.seosona/1_CORE/SOUL.md before executing any prompt. Use ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js for machine-readable capability routing when available.
```

## 3. Claude Code CLI

Use a shell alias or wrapper that points to the portable anchor:

```powershell
function claude-ag {
    claude --system-prompt-file "$HOME/.seosona/1_CORE/SOUL.md" $args
}
```

For capability discovery:

```powershell
node "$HOME/.seosona/1_CORE/scripts/seosona_capability_bridge.js" manifest
node "$HOME/.seosona/1_CORE/scripts/seosona_capability_bridge.js" route "agent looping"
node "$HOME/.seosona/1_CORE/scripts/seosona_capability_bridge.js" validate
```

## 4. OpenAI Codex

Codex should receive an `AGENTS.md` block that references only portable anchors:

```text
Root: ~/.seosona
Core Rules: ~/.seosona/1_CORE/SOUL.md
Master Index: ~/.seosona/2_KNOWLEDGE/MASTER_INDEX.md
Skills: ~/.seosona/2_KNOWLEDGE/frameworks
Capability Bridge: ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js
```

## 5. Antigravity IDE

Use this global instruction:

```text
Before doing any work, read and strictly adhere to ~/.seosona/1_CORE/SOUL.md. Route capabilities through ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js when machine-readable routing is available.
```

## 6. Universal CLI / MCP Client

Any CLI, MCP client, or agent runtime can discover SEOSONA capabilities through:

```bash
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js manifest
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js route "agent looping"
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js validate
```

The bridge emits portable paths only and must be preferred over machine-specific paths.

## Portability Note

`~/.seosona` is a filesystem junction or symlink created by `seosona setup`. It always points to the active SEOSONA OS root. Persistent prompts and configs must reference this universal anchor or `${SEOSONA_ROOT}`, never the physical installation path.

TASK COMPLETED
