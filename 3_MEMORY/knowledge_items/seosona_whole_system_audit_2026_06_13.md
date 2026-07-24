---
type: knowledge_item
domain: seosona_os_governance
status: active
created_at: 2026-06-13
sources:
  - 3_MEMORY/projects/seosona-os/audits/2026-06-13-whole-system-audit.md
  - 3_MEMORY/issues/seosona_full_audit_issue_backlog_2026-06-13.md
---

# KI: SEOSONA Whole-System Audit - 2026-06-13

## Operational Lesson

SEOSONA status gates should distinguish private support artifacts from complete SEO domain export folders. A folder under `3_MEMORY/seo_exports/` is a domain audit only when it contains at least one required SEO export marker.

## Safety Lesson

Local preview, Kanban, CLI dashboard, and MCP server examples must default to `127.0.0.1`. Use `0.0.0.0` only when the user explicitly authorizes LAN or remote exposure.

## Portability Lesson

System docs and workflow examples must use repo-relative paths, `~/.seosona`, or `${SEOSONA_ROOT}`. Do not preserve machine-specific examples such as a physical drive root in operational SEOSONA-owned docs.

## Future Audit Heuristic

When scanning for secrets, hardcoded paths, unsafe eval, or public binds, classify findings into:

- Active runtime code
- SEOSONA-owned operational docs
- Ingested external reference payloads
- Tests and fixtures
- Private ignored memory

Fix active runtime and SEOSONA-owned operational docs directly. Put ingested reference and fixture noise into the backlog unless it is reachable by a SEOSONA workflow.
