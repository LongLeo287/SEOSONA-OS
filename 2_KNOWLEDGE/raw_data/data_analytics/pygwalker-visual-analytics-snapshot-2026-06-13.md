---
type: raw_reference_snapshot
status: distilled
created_at: 2026-06-13
source: https://github.com/Kanaries/pygwalker
source_commit: 0f14ef0
license: Apache-2.0
---

# PyGWalker Visual Analytics Snapshot

This snapshot captures the reusable SEOSONA value from `Kanaries/pygwalker`. The repository was reviewed as a static research input and was not vendored into SEOSONA OS.

## Repository Profile

- Repository: `Kanaries/pygwalker`
- Purpose: Python library for exploratory visual data analysis.
- Default branch reviewed: `main`
- Reviewed commit: `0f14ef0`
- License: Apache-2.0
- Public signal at review time: about 15.8k stars, 870 forks, and active updates in June 2026.

## Extracted Value

PyGWalker turns DataFrames and data connectors into an interactive Graphic Walker UI. It is useful for fast exploratory analysis where the user needs to inspect fields, build charts, filter data, and save chart state without first writing plotting code.

## Useful Interfaces

- `pygwalker.walk(dataset)`: interactive exploration in notebooks.
- `pygwalker.render(dataset, spec)`: render a saved chart spec.
- `pygwalker.table(dataset)`: table-first exploration.
- `pygwalker.to_html(...)`: HTML rendering path.
- `pygwalker.api.streamlit.StreamlitRenderer`: Streamlit embedding.
- `pygwalker.data_parsers.database_parser.Connector`: SQLAlchemy-backed view exploration.

## Dataset Support

The package centers on pandas and can adapt optional polars, PySpark, SQLAlchemy connectors, and cloud dataset identifiers when the relevant dependencies and runtime are present.

## Operational Patterns

### Notebook EDA

Use `pyg.walk(df, spec="chart_meta.json", kernel_computation=True, show_cloud_tool=False)` for private local exploration where chart state should be reusable.

### Streamlit Visual Explorer

Use `StreamlitRenderer` with `st.cache_resource` to avoid expensive repeated renderer creation. Use `spec_io_mode="rw"` only when the app should persist chart edits.

### SQL-Backed Exploration

Use `Connector` with an environment-provided SQLAlchemy URL and a narrow `view_sql`. Avoid inline credentials and ambiguous `SELECT *` joins that create duplicate columns.

### Chart Export

Saved UI charts can be exported to SVG, PNG, or HTML. Exported charts are useful for reports, audits, and documentation after checking that no private values are exposed.

## Privacy Notes

PyGWalker has a user config with privacy modes:

- `offline`: no network/API requests from PyGWalker.
- `update-only`: update checks only.
- `events`: product event telemetry mode.

SEOSONA should default to `offline` for client, private, SEO, GA4, GSC, keyword, crawl, backlink, and unpublished business datasets. Kanaries tokens and generated local config files must not be committed.

## SEOSONA Integration Decision

Created `frameworks/productivity/pygwalker_visual_analytics/` as a reusable skill for visual analytics and data exploration. This belongs in productivity because it is an analyst workflow accelerator across SEO, marketing, research, and data engineering contexts.
