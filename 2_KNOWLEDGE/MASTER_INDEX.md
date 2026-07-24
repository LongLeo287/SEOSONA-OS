# SEOSONA OS Master Index

This file is the human-readable entrypoint for SEOSONA OS knowledge routing.

## Startup Order

1. Read `~/.seosona/1_CORE/SOUL.md` for operating boundaries.
2. Check `~/.seosona/3_MEMORY/knowledge_items/` for existing Knowledge Items before new research.
3. Use `~/.seosona/1_CORE/scripts/seosona_capability_bridge.js` for machine-readable routing.
4. Use `~/.seosona/2_KNOWLEDGE/SKILLS_ROUTER.md` as the generated semantic capability graph.
5. Check project-scoped memory under `~/.seosona/3_MEMORY/projects/{memoryNamespace}/` when a project has `seosona.project.json`.

## Core Knowledge Surfaces

| Surface | Purpose |
|---|---|
| `~/.seosona/2_KNOWLEDGE/SKILLS_ROUTER.md` | Auto-generated skill and framework routing graph. |
| `~/.seosona/2_KNOWLEDGE/frameworks/` | Durable frameworks and task-specific skills. |
| `~/.seosona/2_KNOWLEDGE/sops/` | Standard operating procedures. |
| `~/.seosona/2_KNOWLEDGE/raw_data/` | Raw ingested research and source snapshots. |
| `~/.seosona/3_MEMORY/knowledge_items/` | Distilled Knowledge Items and reusable findings. |
| `~/.seosona/3_MEMORY/projects/` | Project-scoped memory namespaces. |
| `~/.seosona/4_AGENTS/personas/` | Persona definitions and specialist roles. |

## Connected Project Namespaces

| Project | Namespace | Scope |
|---|---|---|
| SEOSONA OS | `seosona-os` | Core operating system and capability graph. |
| SEOSONA Website | `website-seosona` | Website, SEO, content, Next.js, and migration work. |
| SEOSONA UX-UI | `seosona-ux-ui` | UX/UI design system, component library, templates, and design workflows. |

SEOSONA Video is intentionally excluded from the current UX-UI and Website linking scope.

## Validation

Run the capability bridge validator after changing routing, project bindings, or core knowledge indexes:

```bash
node ~/.seosona/1_CORE/scripts/seosona_capability_bridge.js validate
```

TASK COMPLETED
