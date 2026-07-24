# WORKFLOW: QA Review Pipeline

**Purpose:** Quality assurance gate that every deliverable must pass before reaching the client or going live.

**Trigger:** Any deliverable marked as "Ready for Review" in the sprint board.

## QA STAGES

### Stage 1: Self-Review (Owner, 10 min)
The creator must self-check before submitting:
- [ ] Meets the original task requirements.
- [ ] No placeholder text or TODO markers.
- [ ] Follows the relevant SOP (content → `content_review_sop`, code → `deployment_checklist_sop`).

### Stage 2: Peer Review (Assigned Reviewer, 30 min)
A different team member or agent reviews:
- [ ] **Code deliverables**: Run `code-reviewer` agent. Check for code quality, security, and performance.
- [ ] **Content deliverables**: Run `content-reviewer` agent. Check for accuracy, SEO, and brand voice.
- [ ] **Design deliverables**: Run `ui-ux-designer` agent. Check for consistency, responsiveness, accessibility.

### Stage 3: Automated Checks (System, 5 min)
- [ ] Run `security_regex_rules.md` scan (no secrets exposed).
- [ ] Run `quality_scorer.py` (score must be ≥ 7/10).
- [ ] Run PageSpeed check if applicable (score ≥ 80).
- [ ] Run schema validation if applicable.

### Stage 4: Approval Decision
| Outcome | Action |
|---|---|
| ✅ **Approved** | Move to "Done". Proceed to deployment/delivery. |
| 🔄 **Needs Revision** | Return to "In Progress" with specific feedback. |
| ❌ **Rejected** | Move to backlog for redesign. Escalate to project lead. |

### Stage 5: Documentation
- [ ] Log the review outcome in `3_MEMORY/logs/qa_{date}_{deliverable}.md`.
- [ ] If rejected, document the reason for future reference.
