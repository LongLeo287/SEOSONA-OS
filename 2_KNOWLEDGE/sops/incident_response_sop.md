# SOP: Incident Response Protocol

_Version 1.0 | Created: 2026-06-17_

## Purpose
Standardized emergency response procedure when a client website is hacked, defaced, experiencing downtime, or suffering a critical SEO penalty.

## Severity Levels
| Level | Description | Response Time |
|---|---|---|
| **P0 — Critical** | Website down, hacked, or data breach | < 30 minutes |
| **P1 — High** | Major ranking drop (>50%), manual penalty | < 2 hours |
| **P2 — Medium** | Partial functionality loss, moderate ranking drop | < 8 hours |
| **P3 — Low** | Minor issues, cosmetic bugs | < 24 hours |

## Response Procedure

### Step 1: Triage (First 15 minutes)
- [ ] Identify the incident type (hack, downtime, penalty, data loss).
- [ ] Assess severity level (P0-P3).
- [ ] Notify the CEO and assigned project manager immediately for P0/P1.

### Step 2: Containment (First 30 minutes for P0)
- [ ] For hack/malware: Take the site offline or enable maintenance mode.
- [ ] For downtime: Check hosting provider status page.
- [ ] For penalty: Screenshot the GSC notification and preserve evidence.
- [ ] Create incident log at `3_MEMORY/errors/incident_{date}_{client}.md`.

### Step 3: Investigation
- [ ] Security scan (if hack): Run `security-auditor` agent.
- [ ] Technical audit (if downtime): Check DNS, SSL, server logs.
- [ ] SEO forensics (if penalty): Run `claude_seo_framework` 5-phase audit.
- [ ] Document root cause in incident log.

### Step 4: Resolution
- [ ] Apply fix and verify.
- [ ] Restore from backup if necessary.
- [ ] For penalties: Submit reconsideration request to Google.
- [ ] Re-run verification checks.

### Step 5: Post-Mortem
- [ ] Write post-mortem report (What happened, why, how we fixed it, how we prevent it).
- [ ] Update relevant SOPs or security rules if a systemic gap is found.
- [ ] Communicate resolution to client with a timeline of events.
