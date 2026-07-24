# WORKFLOW: Sprint Planning

**Purpose:** Structure internal work into focused 2-week sprints for predictable delivery and accountability.

**Trigger:** Start of every 2-week cycle or when a new project phase begins.

## SPRINT CEREMONY

### 1. Sprint Planning (Day 1, Monday)
- Review backlog items from `3_MEMORY/projects/{project}/backlog.md`.
- Prioritize by impact (P0 > P1 > P2) and effort (S/M/L/XL).
- Select items for this sprint (capacity = team size × 10 story points).
- Assign owners. Create sprint board at `3_MEMORY/projects/{project}/sprint_{number}.md`.

### 2. Daily Standups (Every working day, 15 min)
- What did I complete yesterday?
- What am I working on today?
- Any blockers?
- Update sprint board status (To Do → In Progress → Review → Done).

### 3. Mid-Sprint Check (Day 5, Friday)
- Review progress against sprint goal.
- If behind: Re-prioritize or descope lower-priority items.
- If ahead: Pull items from backlog.

### 4. Sprint Review (Day 10, Friday)
- Demo completed work to stakeholders.
- Collect feedback.
- Update client on progress (flash report).

### 5. Sprint Retrospective (Day 10, after Review)
- What went well?
- What didn't go well?
- What can we improve?
- Document action items in `3_MEMORY/logs/retro_{date}.md`.

## SPRINT BOARD FORMAT
```markdown
# Sprint {N} — {Start Date} to {End Date}

## Sprint Goal: {One-sentence goal}

### To Do
- [ ] [P0] Task description (@owner, S)

### In Progress
- [/] [P1] Task description (@owner, M)

### Review
- [/] [P1] Task description (@owner, L)

### Done
- [x] [P0] Task description (@owner, S)
```
