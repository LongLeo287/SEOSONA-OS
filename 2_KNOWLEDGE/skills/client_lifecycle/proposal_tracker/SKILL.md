---
name: "proposal_tracker"
description: "Tracks client engagement with proposals — views, time spent, page-by-page analytics using Papermark patterns."
version: "1.0.0"
tags: ["client-lifecycle", "proposal", "analytics", "engagement-tracking"]
---

# Skill: Proposal Tracker

## Execution Steps
1. Generate a trackable link for the proposal document.
2. Monitor: views, unique visitors, time per page, scroll depth, downloads.
3. Alert: Notify when client opens the proposal for the first time.
4. Analyze: Identify which sections the client spent most time on.
5. Report: Engagement summary to inform follow-up strategy.

## Integration
- Works with `proposal_generator` skill output
- Informs `client-success-manager` agent follow-up timing
- Data feeds into `sales-workflow` for lead scoring

## Quality Validation
- [ ] Tracking link generates correctly
- [ ] View events captured with timestamps
- [ ] Privacy-compliant (no excessive data collection)
