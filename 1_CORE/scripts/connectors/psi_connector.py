#!/usr/bin/env python3
"""
SEOSONA OS — PageSpeed Insights + CrUX Connector
Pulls: Core Web Vitals (LCP, INP, CLS), Performance Score, Mobile/Desktop
Free API — no cost. Only needs a GCP API Key.
"""

import json
import csv
import sys
import os
import urllib.request
import urllib.parse
from datetime import datetime
from pathlib import Path

# Windows console UTF-8 fix — env var only (no wrapper to avoid subprocess I/O errors)
import os
os.environ.setdefault("PYTHONIOENCODING", "utf-8")

ROOT = Path(__file__).parent.parent.parent.parent
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"
sys.path.insert(0, str(ROOT / "scripts"))

# SSRF-hardened fetch (validates the initial URL AND every redirect hop). Fail closed if the guard
# module can't be imported.
try:
    from url_guard import safe_urlopen
except Exception:  # pragma: no cover
    def safe_urlopen(*_a, **_k):
        raise RuntimeError("url_guard unavailable — refusing to fetch unsafely")

def load_config():
    # A malformed config.json used to abort the connector with a raw JSONDecodeError
    # traceback. Report it and fall back to defaults instead.
    try:
        if not CONFIG_PATH.exists():
            return {"defaults": {"target_domain": "", "target_url": "", "output_dir": "3_MEMORY/seo_exports"}}
        with open(CONFIG_PATH) as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        print(f"[!] config.json unreadable ({e}); using defaults.")
        return {"defaults": {"target_domain": "", "target_url": "",
                             "output_dir": "3_MEMORY/seo_exports"}}

def fetch_psi(url, strategy, api_key):
    """Call PageSpeed Insights API — free"""
    endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = urllib.parse.urlencode({
        "url": url,
        "strategy": strategy,
        "key": api_key,
        "category": "performance"
    })
    full_url = f"{endpoint}?{params}"
    print(f"   [PSI] {strategy.upper()}: {url}")
    try:
        with safe_urlopen(full_url, timeout=50) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"   [XX] PSI error ({strategy}): {e}")
        return None

def extract_cwv(data, strategy):
    """Extract Core Web Vitals from PSI response"""
    if not data:
        return {}

    cats = data.get("lighthouseResult", {}).get("categories", {})
    perf_score = cats.get("performance", {}).get("score", 0)

    audits = data.get("lighthouseResult", {}).get("audits", {})

    def get_metric(key):
        audit = audits.get(key, {})
        return {
            "value": audit.get("numericValue", 0),
            "display": audit.get("displayValue", "N/A"),
            "score": audit.get("score", 0)
        }

    # Field data (real user CrUX)
    field = data.get("loadingExperience", {}).get("metrics", {})
    def get_field(key):
        m = field.get(key, {})
        return {
            "p75": m.get("percentile", 0),
            "category": m.get("category", "UNKNOWN")
        }

    return {
        "strategy": strategy,
        "performance_score": round(perf_score * 100),
        "lcp": get_metric("largest-contentful-paint"),
        "fcp": get_metric("first-contentful-paint"),
        "cls": get_metric("cumulative-layout-shift"),
        "tbt": get_metric("total-blocking-time"),
        "speed_index": get_metric("speed-index"),
        # Real user field data (CrUX)
        "field_lcp": get_field("LARGEST_CONTENTFUL_PAINT_MS"),
        "field_cls": get_field("CUMULATIVE_LAYOUT_SHIFT_SCORE"),
        "field_inp": get_field("INTERACTION_TO_NEXT_PAINT"),
        "field_fcp": get_field("FIRST_CONTENTFUL_PAINT_MS"),
    }

def score_to_label(score):
    if score >= 90: return "🟢 Good"
    if score >= 50: return "🟡 Needs Improvement"
    return "🔴 Poor"

def cwv_to_label(category):
    labels = {"FAST": "🟢 Good", "AVERAGE": "🟡 Moderate", "SLOW": "🔴 Poor", "UNKNOWN": "⚪ No data"}
    return labels.get(category, "⚪ No data")

def run(domain=None, url=None):
    config = load_config()
    if not domain:
        domain = config["defaults"]["target_domain"]
    if not url:
        url = config["defaults"]["target_url"]

    # Load API key from 1_CONFIG/.env
    try:
        from secrets_manager import get_secret
        api_key = get_secret("PAGESPEED_API_KEY")
    except Exception:
        api_key = ""

    if not api_key:
        print("[XX] PSI API key not configured.")
        print("     Set PAGESPEED_API_KEY in 1_CONFIG/.env")
        return

    print(f"[OK] API key loaded (length: {len(api_key)} chars)")

    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = ROOT / config["defaults"]["output_dir"] / domain

    print(f"\n🚀 SEOSONA PSI Connector — {url}\n")

    mobile_raw = fetch_psi(url, "mobile", api_key)
    desktop_raw = fetch_psi(url, "desktop", api_key)

    mobile = extract_cwv(mobile_raw, "mobile")
    desktop = extract_cwv(desktop_raw, "desktop")

    # Print summary
    print(f"\n📊 RESULTS:")
    for result in [mobile, desktop]:
        s = result.get("strategy", "").upper()
        print(f"\n  [{s}] Performance Score: {result.get('performance_score', 0)}/100 "
              f"— {score_to_label(result.get('performance_score', 0))}")
        print(f"  LCP: {result['lcp']['display']} "
              f"(Real users p75: {result['field_lcp']['p75']}ms — {cwv_to_label(result['field_lcp']['category'])})")
        print(f"  CLS: {result['cls']['display']} "
              f"(Real users p75: {result['field_cls']['p75']} — {cwv_to_label(result['field_cls']['category'])})")
        print(f"  INP (Real users p75): {result['field_inp']['p75']}ms — {cwv_to_label(result['field_inp']['category'])}")

    # Write CSV
    csv_path = output_dir / f"cwv_report_{domain}_{date_str}.csv"
    output_dir.mkdir(parents=True, exist_ok=True)
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["strategy", "performance_score", "lcp_ms", "lcp_display",
                         "cls_score", "cls_display", "tbt_ms", "fcp_ms",
                         "field_lcp_p75", "field_lcp_category",
                         "field_cls_p75", "field_cls_category",
                         "field_inp_p75", "field_inp_category",
                         "url", "date"])
        for result in [mobile, desktop]:
            writer.writerow([
                result.get("strategy"),
                result.get("performance_score"),
                round(result["lcp"]["value"]),
                result["lcp"]["display"],
                result["cls"]["value"],
                result["cls"]["display"],
                round(result["tbt"]["value"]),
                round(result["fcp"]["value"]),
                result["field_lcp"]["p75"],
                result["field_lcp"]["category"],
                result["field_cls"]["p75"],
                result["field_cls"]["category"],
                result["field_inp"]["p75"],
                result["field_inp"]["category"],
                url, date_str
            ])
    print(f"\n💾 Saved CWV report: {csv_path}")

    # Write MD summary
    md_path = output_dir / f"cwv_report_{domain}_{date_str}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Core Web Vitals Report — {domain}\n")
        f.write(f"> URL: {url} | Date: {date_str} | SEOSONA OS\n\n---\n\n")
        for result in [mobile, desktop]:
            s = result.get("strategy", "").upper()
            f.write(f"## {s}\n\n")
            f.write(f"**Performance Score: {result.get('performance_score')}/100** — "
                    f"{score_to_label(result.get('performance_score', 0))}\n\n")
            f.write(f"| Metric | Lab Data | Real Users (p75) | Status |\n")
            f.write(f"|--------|----------|-----------------|--------|\n")
            f.write(f"| LCP | {result['lcp']['display']} | {result['field_lcp']['p75']}ms | "
                    f"{cwv_to_label(result['field_lcp']['category'])} |\n")
            f.write(f"| CLS | {result['cls']['display']} | {result['field_cls']['p75']} | "
                    f"{cwv_to_label(result['field_cls']['category'])} |\n")
            f.write(f"| INP | — | {result['field_inp']['p75']}ms | "
                    f"{cwv_to_label(result['field_inp']['category'])} |\n")
            f.write(f"| FCP | {result['fcp']['display']} | {result['field_fcp']['p75']}ms | "
                    f"{cwv_to_label(result['field_fcp']['category'])} |\n\n")
    print(f"💾 Saved CWV MD: {md_path}")
    print(f"\n✅ PSI/CWV pull complete!")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA PageSpeed Insights Connector")
    parser.add_argument("--domain", default=None)
    parser.add_argument("--url", default=None)
    args = parser.parse_args()
    run(domain=args.domain, url=args.url)
