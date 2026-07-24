---
name: "visual_data_explorer"
description: "Creates interactive data visualizations from CSV/DataFrame using PyGWalker patterns for SEO analytics and client reporting."
version: "1.0.0"
tags: ["data-visualization", "analytics", "charts", "reporting", "pygwalker"]
---

# Skill: Visual Data Explorer

## Execution Steps
1. Accept data source: CSV file, DataFrame, or connector output (GSC, GA4, rank_tracker).
2. Auto-detect column types: categorical, numeric, temporal, geographic.
3. Suggest visualizations based on data shape (bar charts for categories, line charts for time series, scatter for correlations).
4. Generate interactive charts with filters, aggregations, and drill-down.
5. Export: HTML widget (embeddable in reports) or static PNG for documents.

## Chart Types Supported
- Line charts (traffic trends over time)
- Bar charts (keyword ranking distribution)
- Scatter plots (click-through rate vs position)
- Heatmaps (content performance matrix)
- Geo maps (traffic by location for local SEO)
- Funnel charts (conversion funnel analysis)

## Integration
- Uses output from `scripts/connectors/` as data source
- Feeds into `report_generator` skill for client reports
- Powers `dashboard_generator_v4.py` custom visualizations

## Quality Validation
- [ ] Charts accurately represent the underlying data
- [ ] Labels and legends are clear and complete
- [ ] Interactive elements function correctly
