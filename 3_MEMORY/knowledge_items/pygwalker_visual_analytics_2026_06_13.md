---
type: knowledge_item
domain: visual_analytics
status: active
created_at: 2026-06-13
sources:
  - 2_KNOWLEDGE/raw_data/data_analytics/pygwalker_visual_analytics_snapshot_2026-06-13.md
  - 2_KNOWLEDGE/frameworks/productivity/pygwalker_visual_analytics/SKILL.md
---

# KI: PyGWalker Visual Analytics

SEOSONA ingested `Kanaries/pygwalker` as a visual analytics and exploratory data analysis workflow.

## Durable Lessons

- PyGWalker is useful when a DataFrame, CSV, SQL view, SEO export, or analytics export needs rapid visual exploration.
- Use `pyg.walk()` for notebook exploration and `StreamlitRenderer` for lightweight internal apps.
- Use saved `spec` files to make exploration repeatable.
- Use `kernel_computation=True` for larger local datasets or connector-backed workflows.
- Default to privacy `offline` for client or private data.
- Never commit Kanaries tokens, database URLs, local config files, raw private data, or chart exports that leak sensitive values.

## Active Upgrade

- `pygwalker-visual-analytics`
