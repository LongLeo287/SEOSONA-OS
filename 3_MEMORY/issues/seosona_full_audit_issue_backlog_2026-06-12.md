---
created: 2026-06-12
scope: seosona_os_full_audit_plus_omniclaw_delta
status: active
---

# SEOSONA OS Audit Issue Backlog

## Fixed In This Pass

| ID | Severity | Area | Issue | Resolution |
|---|---:|---|---|---|
| AUD-001 | High | Portability | `srt_cleaner.py` used a machine-specific SRT source path. | Replaced with `SEOSONA_SRT_DIR` or `3_MEMORY/ingestion_zone/srt`. |
| AUD-002 | High | Security | `media_optimizer.py` used `eval()` to parse ffprobe frame rates. | Replaced with `fractions.Fraction` parsing. |
| AUD-003 | Medium | Localhost perimeter | Preview and kanban commands bound local servers to `0.0.0.0`. | Changed defaults to `127.0.0.1` and documented explicit authorization for network access. |
| AUD-004 | Medium | Knowledge assimilation | Existing OmniClaw skill only captured the 8-daemon idea. | Expanded it into an operational governance pattern with receipt, blackboard, gate, and promotion rules. |

## Open Issues

| ID | Severity | Area | Finding | Recommended Action |
|---|---:|---|---|---|
| AUD-005 | High | Developer environment | PowerShell profile attempts to run a missing machine-specific `seosona-init.ps1`, producing noise during shell startup. | Update the user-level profile to use `~/.seosona` or guard the call with `Test-Path`. This is outside the repo and was not committed. |
| AUD-006 | Medium | Documentation encoding | Several legacy markdown files render mojibake characters in terminal output. | Add a UTF-8 normalization/encoding audit utility and fix docs in batches to avoid noisy diffs. |
| AUD-007 | Medium | Reference docs | Imported reference and test files contain example absolute paths and `0.0.0.0` snippets. | Tag external reference snapshots as examples or normalize only active SEOSONA commands. |
| AUD-008 | Medium | Secret-scan precision | Placeholder keys in `.env.example` and docs can trigger broad grep scans. | Add a first-party secret scanner that distinguishes placeholders, docs, and real credentials using `1_CORE/rules/security_regex_rules.md`. |
| AUD-009 | Medium | External repo execution | OmniClaw contains many third-party skill snapshots and install scripts with recursive delete patterns. | Keep OmniClaw as a pattern source only; do not execute its payload scripts without per-file review. |
| AUD-010 | Low | System maps | `MASTER_INDEX.md` counts may drift from live router output as new API catalogs/KIs are added. | Generate index counts from the capability bridge or add a drift checker. |

## Validation Snapshot

- `npm run status:all` passed before changes.
- OmniClaw source reviewed at commit `79bb980`.
- Current fixes require final validation after this backlog is committed.

TASK COMPLETED
