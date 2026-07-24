# Memory Palace SOP

## Purpose

Use the SEOSONA memory layout consistently so future agents can recover context without broad scans.

## Layout

- `~/.seosona/3_MEMORY/knowledge_items/`: reusable distilled knowledge.
- `~/.seosona/3_MEMORY/projects/{namespace}/`: project-scoped decisions, audits, issues, test runs, changelog, and Knowledge Items.
- `~/.seosona/3_MEMORY/logs/`: system-level operational logs.
- `~/.seosona/3_MEMORY/errors/`: raw failures and error evidence.
- `~/.seosona/3_MEMORY/specs/`: durable specs and contracts.

## Write Rules

- Use English for system files.
- Use portable paths only.
- Store raw error text in `errors/`.
- Store reusable conclusions in `knowledge_items/`.
- Store project-specific decisions under that project's namespace.

TASK COMPLETED
