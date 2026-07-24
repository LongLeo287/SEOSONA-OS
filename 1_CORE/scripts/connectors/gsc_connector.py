#!/usr/bin/env python3
"""
SEOSONA OS — Google Search Console Connector
Pulls: clicks, impressions, CTR, position, AI Overviews, URL inspection
Free API — no cost. Requires: Google Cloud Service Account + GSC verified property
"""

import json
import csv
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# ── Dependency check ─────────────────────────────────────────────────────────
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
except ImportError:
    print("❌ Missing: google-api-python-client")
    print("   Run: pip install google-api-python-client google-auth")
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent.parent.parent  # SEOSONA OS root
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

def load_config():
    if not CONFIG_PATH.exists():
        print(f"❌ Config not found: {CONFIG_PATH}")
        print(f"   Copy config_template.json → config.json and fill in values")
        sys.exit(1)
    with open(CONFIG_PATH) as f:
        return json.load(f)

def get_gsc_service(config):
    from secrets_manager import get_secret
    sa_path = get_secret("GOOGLE_APPLICATION_CREDENTIALS")
    if not sa_path or not Path(sa_path).exists():
        print(f"❌ Service account not found: {sa_path}")
        print("   Set GOOGLE_APPLICATION_CREDENTIALS in 1_CONFIG/.env")
        sys.exit(1)
    creds = service_account.Credentials.from_service_account_file(
        str(sa_path), scopes=SCOPES
    )
    return build("searchconsole", "v1", credentials=creds)

def get_webmaster_service(config):
    from secrets_manager import get_secret
    sa_path = get_secret("GOOGLE_APPLICATION_CREDENTIALS")
    if not sa_path or not Path(sa_path).exists():
        print(f"❌ Service account not found: {sa_path}")
        print("   Set GOOGLE_APPLICATION_CREDENTIALS in 1_CONFIG/.env")
        sys.exit(1)
    creds = service_account.Credentials.from_service_account_file(
        str(sa_path), scopes=SCOPES
    )
    return build("webmasters", "v3", credentials=creds)

# ── Core Queries ──────────────────────────────────────────────────────────────

def fetch_search_performance(webmaster_svc, site_url, days=90, max_rows=5000):
    """Pull queries: clicks, impressions, CTR, position (with pagination)"""
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    print(f"📡 Fetching Search Performance ({days} days, up to {max_rows} rows)...")
    all_rows = []
    start_row = 0
    chunk_size = 1000

    while len(all_rows) < max_rows:
        body = {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": ["query", "page"],
            "rowLimit": min(chunk_size, max_rows - len(all_rows)),
            "startRow": start_row,
            "orderBy": [{"fieldName": "clicks", "sortOrder": "DESCENDING"}]
        }
        response = webmaster_svc.searchanalytics().query(
            siteUrl=site_url, body=body
        ).execute()
        rows = response.get("rows", [])
        if not rows:
            break
        
        all_rows.extend(rows)
        start_row += len(rows)
        
        if len(rows) < chunk_size:
            break

    print(f"   ✅ Got {len(all_rows)} rows")
    return all_rows, start_date, end_date

def fetch_ctr_opportunities(webmaster_svc, site_url, days=90):
    """Find pages with HIGH impressions but LOW CTR < 3%"""
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    print("📡 Fetching CTR Opportunities (impressions>100, CTR<3%)...")
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["query", "page"],
        "rowLimit": 1000,
        "orderBy": [{"fieldName": "impressions", "sortOrder": "DESCENDING"}],
        "dimensionFilterGroups": [{
            "filters": [{
                "dimension": "query",
                "operator": "notContains",
                "expression": "brand"  # exclude pure brand queries
            }]
        }]
    }
    response = webmaster_svc.searchanalytics().query(
        siteUrl=site_url, body=body
    ).execute()
    all_rows = response.get("rows", [])

    # Filter: impressions > 100 AND CTR < 3%
    opportunities = [
        r for r in all_rows
        if r.get("impressions", 0) > 100 and r.get("ctr", 1) < 0.03
    ]
    print(f"   ✅ Found {len(opportunities)} CTR opportunities")
    return opportunities

def fetch_position_quickwins(webmaster_svc, site_url, days=90):
    """Find keywords ranking 4-20 with good impressions — easiest to push to top 3"""
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    print("📡 Fetching Position 4-20 Quick Wins...")
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["query"],
        "rowLimit": 1000,
        "orderBy": [{"fieldName": "impressions", "sortOrder": "DESCENDING"}]
    }
    response = webmaster_svc.searchanalytics().query(
        siteUrl=site_url, body=body
    ).execute()
    all_rows = response.get("rows", [])

    # Filter: position 4-20 AND impressions > 50
    quickwins = [
        r for r in all_rows
        if 4 <= r.get("position", 0) <= 20 and r.get("impressions", 0) > 50
    ]
    quickwins.sort(key=lambda x: x.get("impressions", 0), reverse=True)
    print(f"   ✅ Found {len(quickwins)} quick-win keywords")
    return quickwins

def fetch_top_pages(webmaster_svc, site_url, days=90, row_limit=50):
    """Top pages by clicks"""
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    print("📡 Fetching Top Pages by Clicks...")
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["page"],
        "rowLimit": row_limit,
        "orderBy": [{"fieldName": "clicks", "sortOrder": "DESCENDING"}]
    }
    response = webmaster_svc.searchanalytics().query(
        siteUrl=site_url, body=body
    ).execute()
    rows = response.get("rows", [])
    print(f"   ✅ Got {len(rows)} top pages")
    return rows

def fetch_ai_overviews(webmaster_svc, site_url, days=90):
    """Queries appearing in AI Overviews"""
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    print("📡 Fetching AI Overview queries...")
    try:
        body = {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": ["query"],
            "searchType": "AI_OVERVIEWS",
            "rowLimit": 50
        }
        response = webmaster_svc.searchanalytics().query(
            siteUrl=site_url, body=body
        ).execute()
        rows = response.get("rows", [])
        print(f"   ✅ Got {len(rows)} AI Overview queries")
        return rows
    except Exception as e:
        print(f"   ⚠️  AI Overviews not available (may need GSC to have data first): {e}")
        return []

def fetch_sitemaps(webmaster_svc, site_url):
    """Check sitemap status"""
    print("📡 Fetching Sitemap status...")
    try:
        response = webmaster_svc.sitemaps().list(siteUrl=site_url).execute()
        sitemaps = response.get("sitemap", [])
        print(f"   ✅ Found {len(sitemaps)} sitemaps")
        return sitemaps
    except Exception as e:
        print(f"   ⚠️  Could not fetch sitemaps: {e}")
        return []

# ── Output Writers ────────────────────────────────────────────────────────────

def write_gsc_csv(domain, date_str, perf_rows, start_date, end_date, output_dir):
    """Write to gsc_report_{domain}_{date}.csv"""
    output_path = Path(output_dir) / domain / f"gsc_report_{domain}_{date_str}.csv"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["metric_type", "page_url", "query", "clicks",
                         "impressions", "ctr_percent", "avg_position", "date_range", "notes"])
        for row in perf_rows:
            keys = row.get("keys", ["", ""])
            query = keys[0] if len(keys) > 0 else ""
            page = keys[1] if len(keys) > 1 else ""
            writer.writerow([
                "query_performance",
                page,
                query,
                row.get("clicks", 0),
                row.get("impressions", 0),
                f"{row.get('ctr', 0)*100:.2f}",
                f"{row.get('position', 0):.1f}",
                f"{start_date} to {end_date}",
                ""
            ])
    print(f"   💾 Saved: {output_path}")
    return str(output_path)

def write_full_report(domain, date_str, perf_rows, ctr_opps, quickwins,
                      top_pages, ai_rows, sitemaps, start_date, end_date, output_dir):
    """Write human-readable GSC report MD + rank_tracking CSV"""
    # ── Rank tracking CSV ──
    rank_path = Path(output_dir) / domain / f"rank_tracking_{domain}_{date_str}.csv"
    with open(rank_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["keyword", "tracked_url", "current_position",
                         "clicks", "impressions", "ctr_percent",
                         "search_engine", "market", "date_tracked",
                         "serp_features_present", "notes"])
        for row in perf_rows[:200]:  # top 200 keywords
            keys = row.get("keys", ["", ""])
            query = keys[0] if len(keys) > 0 else ""
            page = keys[1] if len(keys) > 1 else ""
            writer.writerow([
                query, page,
                f"{row.get('position', 0):.1f}",
                row.get("clicks", 0),
                row.get("impressions", 0),
                f"{row.get('ctr', 0)*100:.2f}",
                "Google", "vn", date_str, "", ""
            ])
    print(f"   💾 Saved rank tracking: {rank_path}")

    # ── Summary stats ──
    total_clicks = sum(r.get("clicks", 0) for r in perf_rows)
    total_impressions = sum(r.get("impressions", 0) for r in perf_rows)
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    positions = [r.get("position", 0) for r in perf_rows if r.get("position", 0) > 0]
    avg_position = sum(positions) / len(positions) if positions else 0

    top3 = [r for r in perf_rows if r.get("position", 0) <= 3]
    top10 = [r for r in perf_rows if r.get("position", 0) <= 10]
    top20 = [r for r in perf_rows if r.get("position", 0) <= 20]

    # ── Markdown report ──
    report_path = Path(output_dir) / domain / f"gsc_full_report_{domain}_{date_str}.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(f"""# Google Search Console Report — {domain}
> Period: {start_date} → {end_date} | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')} | SEOSONA OS

---

## 📊 Performance Summary

| Metric | Value |
|--------|-------|
| Total Clicks | {total_clicks:,} |
| Total Impressions | {total_impressions:,} |
| Average CTR | {avg_ctr:.2f}% |
| Average Position | {avg_position:.1f} |
| Keywords Top 3 | {len(top3)} |
| Keywords Top 10 | {len(top10)} |
| Keywords Top 20 | {len(top20)} |
| Total Keywords tracked | {len(perf_rows)} |

---

## 🎯 CTR Opportunities — Fix Title/Meta (High Impressions, Low CTR)

*Pages getting seen but not clicked — rewrite title + meta description*

| Query | Page | Impressions | CTR | Avg Position | Action |
|-------|------|-------------|-----|--------------|--------|
""")
        for r in ctr_opps[:20]:
            keys = r.get("keys", ["", ""])
            f.write(f"| {keys[0] if keys else ''} | {keys[1] if len(keys)>1 else ''} | "
                    f"{r.get('impressions',0):,} | {r.get('ctr',0)*100:.1f}% | "
                    f"{r.get('position',0):.0f} | Rewrite title/meta |\n")

        f.write(f"""
---

## ⚡ Quick Win Keywords — Position 4-20 (Push to Top 3)

*Already ranking — small content/link push could move to top 3*

| Keyword | Position | Impressions | Clicks | Est. CTR Gain if Top 3 |
|---------|----------|-------------|--------|----------------------|
""")
        for r in quickwins[:25]:
            keys = r.get("keys", [""])
            current_ctr = r.get("ctr", 0) * 100
            est_gain = max(0, 10 - current_ctr)  # rough estimate
            f.write(f"| {keys[0]} | {r.get('position',0):.0f} | "
                    f"{r.get('impressions',0):,} | {r.get('clicks',0)} | "
                    f"+{est_gain:.1f}% |\n")

        f.write(f"""
---

## 📄 Top Pages by Clicks

| Page | Clicks | Impressions | CTR | Avg Position |
|------|--------|-------------|-----|--------------|
""")
        for r in top_pages[:20]:
            keys = r.get("keys", [""])
            f.write(f"| {keys[0]} | {r.get('clicks',0)} | "
                    f"{r.get('impressions',0):,} | {r.get('ctr',0)*100:.1f}% | "
                    f"{r.get('position',0):.0f} |\n")

        if ai_rows:
            f.write(f"""
---

## 🤖 AI Overview Queries

| Query | Impressions | Clicks | CTR |
|-------|-------------|--------|-----|
""")
            for r in ai_rows:
                keys = r.get("keys", [""])
                f.write(f"| {keys[0]} | {r.get('impressions',0):,} | "
                        f"{r.get('clicks',0)} | {r.get('ctr',0)*100:.1f}% |\n")

        if sitemaps:
            f.write(f"""
---

## 🗺️ Sitemaps Status

| Sitemap URL | Last Downloaded | Warnings | Errors |
|-------------|----------------|----------|--------|
""")
            for sm in sitemaps:
                f.write(f"| {sm.get('path','')} | {sm.get('lastDownloaded','N/A')[:10]} | "
                        f"{sm.get('warnings',0)} | {sm.get('errors',0)} |\n")

        f.write(f"""
---

*Report generated by SEOSONA OS — seo_gsc_integration skill*
*Data source: Google Search Console API (free)*
""")
    print(f"   💾 Saved full report: {report_path}")

# ── Main ──────────────────────────────────────────────────────────────────────

def run(domain=None, days=90):
    config = load_config()
    if not domain:
        domain = config["defaults"]["target_domain"]

    site_url = f"sc-domain:{domain}"
    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = ROOT / config["defaults"]["output_dir"]

    print(f"\n🚀 SEOSONA GSC Connector — {domain}")
    print(f"   Period: Last {days} days | Site: {site_url}\n")

    webmaster_svc = get_webmaster_service(config)

    # Fetch all data
    perf_rows, start_date, end_date = fetch_search_performance(webmaster_svc, site_url, days)
    ctr_opps = fetch_ctr_opportunities(webmaster_svc, site_url, days)
    quickwins = fetch_position_quickwins(webmaster_svc, site_url, days)
    top_pages = fetch_top_pages(webmaster_svc, site_url, days)
    ai_rows = fetch_ai_overviews(webmaster_svc, site_url, days)
    sitemaps = fetch_sitemaps(webmaster_svc, site_url)

    # Write outputs
    print(f"\n💾 Writing output files to: {output_dir}/{domain}/")
    write_gsc_csv(domain, date_str, perf_rows, start_date, end_date, output_dir)
    write_full_report(domain, date_str, perf_rows, ctr_opps, quickwins,
                      top_pages, ai_rows, sitemaps, start_date, end_date, output_dir)

    print(f"\n✅ GSC pull complete!")
    print(f"   CTR opportunities found: {len(ctr_opps)}")
    print(f"   Quick-win keywords: {len(quickwins)}")
    print(f"   Top pages tracked: {len(top_pages)}")
    print(f"   AI Overview queries: {len(ai_rows)}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA GSC Connector")
    parser.add_argument("--domain", default=None, help="Target domain (e.g. example.com)")
    parser.add_argument("--days", type=int, default=90, help="Lookback days (default: 90)")
    args = parser.parse_args()
    run(domain=args.domain, days=args.days)
