---
name: "client_onboarding_automation"
description: "Automates the SEOSONA 10-step client deployment process from Brief to Kickoff."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["client-lifecycle", "onboarding", "automation", "project-management"]
mcp_compatible: true
---

# 🛠️ Skill: Client Onboarding Automation

> **Purpose**: Digitalizes and automates the SEOSONA 10-step client deployment process. Ensures no step is skipped, all deliverables are tracked, and the client experience is consistent.

## 📥 Inputs & Requirements
- **Dependencies**: Client brief document (text/PDF), `seosona-service-catalog.md`
- **Input Format**: `{ "client_name": "...", "brief": "...", "service_type": "SEO|Ads|Training|Bundle" }`

## 🧠 Execution Steps (The Method)
1. **Brief Parsing**: Extract client industry, goals, budget, timeline, and key contacts from the brief.
2. **Project Workspace Setup**: Create a project folder at `3_MEMORY/projects/{client_name}/` with standardized subfolders (briefs/, reports/, deliverables/).
3. **KPI Definition**: Based on service type, auto-generate KPI templates (e.g., SEO → ranking targets, traffic growth; Ads → ROAS, CPA).
4. **Timeline Generation**: Create a Gantt-style markdown timeline based on the 10-step process.
5. **Stakeholder Mapping**: Document all key contacts and communication channels.
6. **Checklist Generation**: Generate a per-step checklist for the project manager to follow.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Auto-commit to any pricing or contractual terms. Financial decisions require explicit CEO approval.
- **FALLBACK**: If the brief is incomplete, generate a "Brief Completion Questionnaire" for the client.

## ✅ Quality Validation Criteria (MANDATORY)
- [ ] Project folder structure created at `3_MEMORY/projects/{client_name}/`.
- [ ] All 10 steps from the service catalog are represented in the checklist.
- [ ] KPIs are measurable and time-bound.
- [ ] No placeholder text in any generated document.

## 💻 Example Invocation
```markdown
User: "Onboard khách hàng mới: ABC Corp, dịch vụ SEO Tổng Thể, ngân sách 30tr/tháng"
Action: Execute `client_onboarding_automation`
Result: "[Project workspace + timeline + KPIs + checklist created]"
```
