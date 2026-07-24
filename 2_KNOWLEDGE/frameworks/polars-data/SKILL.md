---
name: polars-data
description: "Extremely fast DataFrame / query engine (pola-rs/polars, MIT, Rust core, Python+SQL frontends) — lazy evaluation, larger-than-RAM streaming, Arrow interop. Use as the OS data/analytics layer: turn scraper_agent output (rankings, SERP, crawl results) and any tabular data into fast in-process analysis without standing up a warehouse. Drop-in Python library."
license: MIT
metadata:
  type: data-engine
  source: https://github.com/pola-rs/polars
  consumes: scraper_agent tabular output, analytics tasks
---

# Polars — the OS data/analytics layer

[pola-rs/polars](https://github.com/pola-rs/polars) (MIT, 39k★, Rust core). Fills the
data/analytics gap: the scraper_agent already produces tabular data (rankings, SERP, crawl
results), and Polars gives lazy/streaming/Arrow-native processing in-process — much faster
than pandas, no warehouse needed.

## Integration action
1. Use Polars in a data skill that consumes `scraper_agent` output → rank/aggregate/diff
   SEO metrics, dedupe crawl results, join sources.
2. Lazy + streaming handles larger-than-RAM crawls; Arrow interop feeds viz/export.
3. Programmatic + in-process → composes with agent code (preferred over CLI tools like `sq`).

```python
import polars as pl
df = pl.scan_csv("crawl.csv").filter(pl.col("status")==200).group_by("domain").len().collect()
```

> Tier-C triage adopt — the one clear win for the OS's stated analytics need (MIT, drop-in).
