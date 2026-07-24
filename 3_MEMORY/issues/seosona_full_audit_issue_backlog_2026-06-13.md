# SEOSONA OS Full Audit Backlog - 2026-06-13

## Closed In This Pass

- Fixed `audit_check.js` so support-only folders under `3_MEMORY/seo_exports/` no longer fail SEO export completeness gates.
- Changed local preview and Kanban guidance to default to `127.0.0.1`.
- Changed the Firecrawl MCP server payload to default to `127.0.0.1` with explicit environment overrides.
- Removed machine-specific `D:\SEOSONA OS` examples from SEO Workspace delivery docs.

## Open Follow-Ups

1. Harden Chrome DevTools `evaluate.js`.
   - Current state: trusted-input developer helper uses `eval(script)` in page context.
   - Proposed action: document trusted-input-only use, add an explicit `--allow-eval` flag, or provide safer task-specific helpers for common page reads.

2. Add a structured allowlist for path/security scans.
   - Current state: broad scans produce reference/test noise from ingested payloads.
   - Proposed action: create a repo-local audit allowlist that separates active runtime code, SEOSONA-owned docs, ingested references, fixtures, and private memory.

3. Add an external-reference hardening note for `21st_sdk`.
   - Current state: the ingested snapshot contains public-bind and open-CIDR deployment examples.
   - Proposed action: add a SEOSONA wrapper note stating that all extracted deployment recipes must be re-hardened before use.

4. Review quality scorer output destination.
   - Current state: quality reports can live under `3_MEMORY/seo_exports/<name>/`, which is private and ignored, but this can look like a domain folder.
   - Proposed action: consider moving future quality reports to `3_MEMORY/projects/<namespace>/audits/quality/` or `3_MEMORY/quality_reports/`.

5. Clean encoding drift in older Vietnamese SEO Workspace docs.
   - Current state: several legacy docs contain mojibake but still pass language policy because they are localized domain knowledge.
   - Proposed action: normalize encoding during a dedicated content cleanup pass rather than mixing it into safety hardening.

## Tracking

Create or update a GitHub issue after the audited commit is pushed. Attach the validation summary and this backlog.
