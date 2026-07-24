---
name: "report_generator"
description: "Auto-generates SEO and marketing performance reports from data connectors."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["client-lifecycle", "reporting", "seo", "analytics"]
mcp_compatible: true
---

# 🛠️ Skill: Report Generator

> **Purpose**: Automates the creation of periodic SEO/Marketing performance reports for clients. Pulls data from connectors, formats insights, and generates client-ready documents.

## 📥 Inputs & Requirements
- **Dependencies**: `scripts/connectors/` (GSC, GA4, PSI, rank_tracker), client KPI definitions
- **Input Format**: `{ "client_name": "...", "period": "weekly|monthly|quarterly", "metrics": ["rankings", "traffic", "conversions"] }`

## 🧠 Execution Steps (The Method)
1. **Data Collection**: Query relevant connectors for the reporting period.
2. **KPI Calculation**: Compare current metrics against targets (from project workspace).
3. **Trend Analysis**: Identify significant changes (ranking jumps/drops, traffic spikes).
4. **Insight Generation**: Use LLM to generate plain-language insights from data patterns.
5. **Report Assembly**:
   - Performance Summary (top-level metrics with trend arrows)
   - Detailed Analysis (per-keyword, per-page breakdowns)
   - Action Items (next period priorities)
   - Appendix (raw data tables)
6. **Output**: Markdown report + data tables in `3_MEMORY/seo_exports/{client_name}/`.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Fabricate data points. If a connector fails, mark the metric as "Data Unavailable" rather than estimating.
- **FALLBACK**: If primary connector fails, attempt backup data sources. If all fail, generate a partial report with clear annotations.

## ✅ Quality Validation Criteria (MANDATORY)
- [ ] All requested metrics are present (or explicitly marked as unavailable).
- [ ] Trend comparisons use the correct baseline period.
- [ ] Insights are specific and actionable, not generic filler.
- [ ] Report is saved to the correct client folder.

## 💻 Example Invocation
```markdown
User: "Tạo báo cáo SEO tháng 6 cho khách hàng ABC Corp"
Action: Execute `report_generator` with `{ "client_name": "ABC Corp", "period": "monthly" }`
Result: "[Monthly SEO report generated]"
```
