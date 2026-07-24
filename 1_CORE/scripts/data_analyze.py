"""
Data analysis layer (Polars) — fast, in-process analytics over scraper_agent output.

Wires the polars-data adoption: turns tabular data (SEO rankings, SERP results, crawl
output) into ranked/aggregated/deduped analysis without a warehouse. Lazy + streaming
handles larger-than-RAM crawls.

  from data_analyze import load, top_by, dedupe_urls
  df = load("crawl.csv")
  top_by(df, group="domain", metric="visits", n=10)

CLI:  python 1_CORE/scripts/data_analyze.py <file.csv> [group_col] [metric_col]
"""
import sys


def _pl():
    try:
        import polars as pl
        return pl
    except ImportError:
        print("[data] polars not installed — run: pip install polars")
        return None


def load(path):
    """Lazily scan a CSV/Parquet/JSON into a Polars LazyFrame (streaming-capable)."""
    pl = _pl()
    if not pl:
        return None
    if path.endswith(".parquet"):
        return pl.scan_parquet(path)
    if path.endswith(".json") or path.endswith(".ndjson"):
        return pl.scan_ndjson(path)
    return pl.scan_csv(path, ignore_errors=True)


def top_by(lf, group, metric, n=10):
    """Top-N groups by summed metric (e.g. top domains by visits)."""
    pl = _pl()
    if not pl or lf is None:
        return None
    return (lf.group_by(group)
              .agg(pl.col(metric).sum().alias(f"{metric}_total"),
                   pl.len().alias("rows"))
              .sort(f"{metric}_total", descending=True)
              .head(n)
              .collect())


def dedupe_urls(lf, url_col="url"):
    """Drop duplicate rows by URL (common after multi-source crawls)."""
    if lf is None:
        return None
    return lf.unique(subset=[url_col]).collect()


def _selftest():
    pl = _pl()
    if not pl:
        return 1
    df = pl.DataFrame({"domain": ["a.com", "a.com", "b.com"], "visits": [10, 5, 20],
                       "url": ["a.com/1", "a.com/1", "b.com/1"]}).lazy()
    t = top_by(df, "domain", "visits", 5)
    d = dedupe_urls(df)
    ok = t is not None and t.height == 2 and d is not None and d.height == 2
    print(f"[data] polars {pl.__version__} self-test: {'PASS' if ok else 'FAIL'} "
          f"(top_by groups={t.height if t is not None else 0}, deduped rows={d.height if d is not None else 0})")
    return 0 if ok else 1


if __name__ == "__main__":
    if len(sys.argv) == 1 or sys.argv[1] == "--selftest":
        raise SystemExit(_selftest())
    lf = load(sys.argv[1])
    grp = sys.argv[2] if len(sys.argv) > 2 else None
    met = sys.argv[3] if len(sys.argv) > 3 else None
    if grp and met:
        print(top_by(lf, grp, met))
    else:
        print(load(sys.argv[1]).head(10).collect() if lf is not None else "no data")
