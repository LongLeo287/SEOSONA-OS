---
name: "proposal_generator"
description: "Auto-generates client proposals from briefs using SEOSONA service catalog and C.B.O methodology."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["client-lifecycle", "proposal", "sales", "copywriting"]
mcp_compatible: true
---

# 🛠️ Skill: Proposal Generator

> **Purpose**: Transforms client briefs into professional proposals aligned with SEOSONA service catalog and C.B.O methodology.

## 📥 Inputs & Requirements
- **Dependencies**: `seosona-service-catalog.md`, `seosona-cbo-methodology.md`, client brief
- **Input Format**: `{ "client_name": "...", "industry": "...", "services": ["SEO", "Ads"], "budget_range": "...", "goals": "..." }`

## 🧠 Execution Steps (The Method)
1. **Brief Analysis**: Extract scope, constraints, and success criteria.
2. **Service Matching**: Map client needs to SEOSONA service catalog entries.
3. **Proposal Structure**:
   - Executive Summary (why SEOSONA, client-specific value proposition)
   - Methodology (C.B.O framework explanation)
   - Service Scope & Deliverables (detailed per-service breakdown)
   - Timeline (phased approach with milestones)
   - Investment (pricing tiers with ROI projections)
   - Terms & Next Steps
4. **Competitive Differentiation**: Auto-inject C.B.O methodology as unique selling point.
5. **Output**: Clean Markdown proposal + optional slide outline.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Invent case studies or fake metrics. Only reference verified SEOSONA data.
- **DO NOT**: Commit to specific pricing without CEO-approved rate card.

## ✅ Quality Validation Criteria (MANDATORY)
- [ ] Proposal follows the standard 6-section structure.
- [ ] C.B.O methodology is referenced and explained.
- [ ] All pricing uses ranges or "to be discussed" if no rate card provided.
- [ ] Output is in professional, client-ready language (Vietnamese).

## 💻 Example Invocation
```markdown
User: "Tạo proposal cho khách hàng XYZ, ngành bất động sản, cần SEO + Google Ads"
Action: Execute `proposal_generator`
Result: "[Proposal document generated in Markdown]"
```
