---
name: skill
description: Guides agents through using PyGWalker for exploratory visual data analysis in notebooks and lightweight apps: pandas/polars/data connectors, drag-and-drop charts, saved specs, Streamlit embedding, kernel computation, chart export, and privacy-safe configuration.
source: Kanaries/pygwalker
license: Apache-2.0
---

# PyGWalker Visual Analytics

Use this skill when a Python workflow needs fast exploratory data analysis with an interactive visual UI. PyGWalker is most useful when the user has a DataFrame, CSV, SQL view, or analytics export and wants to inspect distributions, build charts, filter data, or turn exploration into reusable chart specs.

## When To Use

- A user asks to explore a CSV, pandas DataFrame, analytics export, SEO export, notebook dataset, or SQL-backed table visually.
- A quick drag-and-drop data profiler or Tableau-like interface is more useful than hand-writing plots.
- A Streamlit app needs embedded visual exploration for a DataFrame.
- An analyst needs reusable chart state, chart export, or a shareable notebook artifact.
- A dataset is large enough that local browser transfer should be limited and Python-side computation should be used.

Prefer static plotting libraries when the chart design is already known and the output must be deterministic in CI or a report. Prefer BI platforms when the dashboard needs governed multi-user publishing, permissions, and scheduled refresh.

## Core Concepts

- **Interactive walker:** `pyg.walk(dataset)` turns a supported dataset into an interactive Graphic Walker UI.
- **Dataset adapters:** supports pandas, optional polars, optional PySpark, SQLAlchemy connectors, and cloud dataset references.
- **Spec:** chart configuration state can be loaded from or saved to a JSON string or file path.
- **Kernel computation:** keeps large-data operations in Python/DuckDB instead of pushing too much data to the frontend.
- **Environment adapters:** notebooks, Jupyter widgets, Streamlit, Gradio, Marimo, Reflex, and webserver-style rendering have dedicated API surfaces.
- **Privacy mode:** local config controls whether PyGWalker is offline, update-only, or event-tracking enabled.

## Privacy-First Setup

For private client data, internal SEO exports, analytics exports, or unpublished business data, set privacy to offline before opening the data:

```bash
pygwalker config --set privacy=offline
```

Rules:

- Do not store Kanaries tokens in SEOSONA system files.
- Do not enable cloud computation for private datasets unless explicitly approved.
- Keep saved specs and chart exports in the project artifact area, not in global config folders.
- Do not commit raw client data, large exports, local config files, or notebook outputs that contain private rows.
- Treat database URLs as secrets; use environment variables or secret managers.

## Notebook Pattern

```python
import pandas as pd
import pygwalker as pyg

df = pd.read_csv("dataset.csv")
walker = pyg.walk(
    df,
    spec="chart_meta.json",
    kernel_computation=True,
    show_cloud_tool=False,
)
```

Use this pattern when:

- the analyst wants drag-and-drop exploration
- chart state should be reusable
- the dataset is large enough to benefit from local kernel computation
- cloud sharing is not part of the requirement

## Streamlit Pattern

Use Streamlit when a repeatable internal app is better than an ad hoc notebook.

```python
import pandas as pd
import streamlit as st
from pygwalker.api.streamlit import StreamlitRenderer

st.set_page_config(page_title="Visual Data Explorer", layout="wide")

@st.cache_resource
def get_renderer() -> StreamlitRenderer:
    df = pd.read_csv("dataset.csv")
    return StreamlitRenderer(
        df,
        spec="gw_config.json",
        spec_io_mode="rw",
        kernel_computation=True,
    )

renderer = get_renderer()
renderer.explorer()
```

Important:

- Cache the renderer in Streamlit to avoid repeated memory-heavy initialization.
- Use `spec_io_mode="rw"` only when users should save chart configuration.
- Use stable `gid` values when rendering multiple related datasets.

## SQL Connector Pattern

Use SQLAlchemy connectors when the data should remain query-backed:

```python
from pygwalker.data_parsers.database_parser import Connector
import pygwalker as pyg

conn = Connector(
    url=os.environ["ANALYTICS_DATABASE_URL"],
    view_sql="SELECT * FROM analytics_view",
)

pyg.walk(conn, kernel_computation=True, show_cloud_tool=False)
```

Rules:

- Never inline database credentials.
- Keep `view_sql` explicit and narrow.
- Avoid `SELECT *` joins that can create duplicate column names.
- Limit the view to fields needed for exploration.

## Chart Export

After saving a chart in the UI, export it programmatically:

```python
walker.save_chart_to_file("Chart 1", "chart1.svg", save_type="svg")
png_bytes = walker.export_chart_png("Chart 1")
svg_bytes = walker.export_chart_svg("Chart 1")
```

Use exports for:

- audit screenshots
- report figures
- documentation
- before/after comparison artifacts

## SEOSONA Use Cases

- Explore SEO audit CSV exports before writing recommendations.
- Profile GSC, GA4, keyword, backlink, or crawl exports visually.
- Build quick internal visual exploration apps for client datasets.
- Export selected charts into report artifacts after human review.
- Use saved specs as repeatable analysis recipes.

## Validation Checklist

- Privacy mode matches the data sensitivity.
- `show_cloud_tool` and `cloud_computation` are disabled unless approved.
- Saved spec path is project-local and safe to commit.
- Raw data stays out of git unless it is explicitly public/sample data.
- Large datasets use kernel computation or connector-backed computation.
- Streamlit renderers are cached.
- Chart exports are reviewed for private values before publication.

## Anti-Patterns

- Opening client data while default telemetry/event mode is active.
- Committing Kanaries tokens, database URLs, generated config files, or private chart specs.
- Uploading data to cloud computation for convenience without explicit approval.
- Treating a drag-and-drop chart as final analysis without checking definitions, filters, aggregation, and sample bias.
- Using PyGWalker as a production BI permission layer.
