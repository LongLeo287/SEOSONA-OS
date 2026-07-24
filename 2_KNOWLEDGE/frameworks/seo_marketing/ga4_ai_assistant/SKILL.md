---
name: skill
description: Guides agents through setting up a Google Analytics 4 AI assistant with preflight checks, OS-aware install logic, gcloud authentication, API enablement, Python GA4 client setup, validation queries, dashboard/report generation, and platform-specific error recovery. Use when a user wants plain-English GA4 analysis or a reusable analytics connector setup.
---

# GA4 AI Assistant

## Overview

This skill turns GA4 access into a repeatable assistant workflow. It favors preflight checks, user-owned authentication, and a small validated analysis script before any dashboard or recommendation work.

## When To Use

- The user wants to ask plain-English questions about GA4 traffic.
- A SEOSONA workflow needs GA4 as a data source.
- A connector setup should be adapted to another API with similar auth/install needs.

Do not use this when the user only needs static analytics advice without live data access.

## Workflow

1. Preflight.
   - Check Python availability.
   - Check `gcloud`.
   - Check existing project configuration.
   - Check whether a prior GA workspace exists.
   - Skip steps that are already complete.

2. Detect OS and package manager.
   - macOS: prefer Homebrew.
   - Linux: prefer native package manager plus official Google Cloud SDK install path.
   - Windows: prefer `winget`, then Chocolatey, then Scoop, then manual install.
   - On Windows, use CMD when package manager output capture is unreliable.

3. Authenticate.
   - Use `gcloud init` if no project is configured.
   - Enable `analyticsdata.googleapis.com` and `analyticsadmin.googleapis.com`.
   - Use application-default auth with readonly analytics and cloud-platform scopes.
   - Treat browser/OAuth approval as user-owned.

4. Create an isolated Python environment.
   - Use a local venv.
   - Install `google-analytics-data` and `google-analytics-admin`.
   - Add UTF-8 output handling for Windows scripts.

5. Validate with a minimal script.
   - List accessible accounts and properties.
   - Run a small date-range report.
   - Print property IDs and sample dimensions/metrics.

6. Analyze.
   - Ask the user's business question.
   - Retrieve the minimum data required.
   - Correct false assumptions when data contradicts the question.
   - Explain methodology and limitations.

7. Generate optional dashboard/report.
   - Only after validation succeeds.
   - Include daily users, source/medium, geography, events, and conversion-oriented slices when relevant.

## Error Recovery

- PowerShell output issues: reload PATH or switch to CMD.
- gcloud execution policy issues: set current-user execution policy.
- API method signature changes: prefer request-object calls for newer clients.
- Unicode console errors: force UTF-8 output or avoid emoji in scripts.
- Missing property access: ask the user to verify GA4 permissions.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "Install everything first." | Preflight avoids breaking existing setups and saves time. |
| "The agent can complete OAuth alone." | Browser auth is user-owned and must be narrated clearly. |
| "Build the dashboard before testing access." | Dashboards are downstream of verified API access. |
| "One OS path is enough." | Connector setup must be portable across macOS, Linux, and Windows. |

## Verification

- [ ] Existing tools and setup were checked first.
- [ ] Required APIs are enabled.
- [ ] Authentication succeeded with user consent.
- [ ] A minimal GA4 query returned data.
- [ ] Any dashboard/report cites the queried date range and property.
