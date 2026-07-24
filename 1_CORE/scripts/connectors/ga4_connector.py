# seosona-ignore-lang
#!/usr/bin/env python3
"""
SEOSONA OS — Google Analytics 4 Connector
Pulls: Sessions, Users, Bounce Rate, Channels, Top Pages, Conversions
Free API — reuses same GCP Service Account as GSC connector.
GA4 Data API: https://developers.google.com/analytics/devguides/reporting/data/v1
"""

import json
import csv
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent.parent
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"
SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]

try:
    from google.oauth2 import service_account
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        RunReportRequest, Dimension, Metric, DateRange, OrderBy, FilterExpression, Filter
    )
except ImportError:
    print("❌ Missing: google-analytics-data")
    print("   Run: pip install google-analytics-data google-auth")
    sys.exit(1)

def load_config():
    if not CONFIG_PATH.exists():
        print(f"❌ Config not found. Copy config_template.json → config.json")
        sys.exit(1)
    with open(CONFIG_PATH) as f:
        return json.load(f)

def get_ga4_client(config):
    from secrets_manager import get_secret
    sa_path = get_secret("GOOGLE_APPLICATION_CREDENTIALS")
    if not sa_path or not Path(sa_path).exists():
        print(f"❌ Service account not found: {sa_path}")
        print("   Set GOOGLE_APPLICATION_CREDENTIALS in 1_CONFIG/.env")
        sys.exit(1)
    creds = service_account.Credentials.from_service_account_file(
        str(sa_path), scopes=SCOPES
    )
    return BetaAnalyticsDataClient(credentials=creds)

def get_property_id(config):
    from secrets_manager import get_secret
    prop = get_secret("GA4_PROPERTY_ID") or config.get("ga4", {}).get("property_id", "")
    if not prop or prop in {"''", '""'} or prop == "YOUR_GA4_PROPERTY_ID":
        print("❌ GA4 Property ID not set in config.json")
        print("   Add: 'ga4': {'property_id': '123456789'}")
        print("   Find it: analytics.google.com → Admin → Property Settings → Property ID")
        sys.exit(1)
    return f"properties/{prop}" if not prop.startswith("properties/") else prop

# ── Core Queries ──────────────────────────────────────────────────────────────

def run_report_with_retry(client, request, max_retries=3):
    from google.api_core.exceptions import ResourceExhausted, RetryError
    for attempt in range(max_retries):
        try:
            return client.run_report(request)
        except (ResourceExhausted, RetryError) as e:
            if attempt == max_retries - 1:
                print(f"   ❌ GA4 Quota Error after {max_retries} attempts: {e}")
                raise
            wait = 2 ** attempt
            print(f"   ⚠️ GA4 Quota Error (429). Retrying in {wait}s...")
            time.sleep(wait)
        except Exception as e:
            raise


def fetch_overview(client, property_id, days=90):
    """Total sessions, users, pageviews, engagement rate"""
    print(f"📡 GA4: Fetching overview ({days} days)...")
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    request = RunReportRequest(
        property=property_id,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="screenPageViews"),
            Metric(name="engagementRate"),
            Metric(name="averageSessionDuration"),
            Metric(name="bounceRate"),
            Metric(name="conversions"),
            Metric(name="newUsers"),
        ]
    )
    response = run_report_with_retry(client, request)
    row = response.rows[0] if response.rows else None
    if not row:
        return {}

    vals = [v.value for v in row.metric_values]
    result = {
        "sessions": int(float(vals[0])),
        "total_users": int(float(vals[1])),
        "pageviews": int(float(vals[2])),
        "engagement_rate": float(vals[3]),
        "avg_session_duration_s": float(vals[4]),
        "bounce_rate": float(vals[5]),
        "conversions": int(float(vals[6])),
        "new_users": int(float(vals[7])),
        "date_range": f"{start} to {end}"
    }
    print(f"   ✅ Sessions: {result['sessions']:,} | Users: {result['total_users']:,}")
    return result

def fetch_channels(client, property_id, days=90):
    """Traffic by channel: Organic, Direct, Social, Referral, Email, Paid"""
    print(f"📡 GA4: Fetching channel breakdown...")
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    request = RunReportRequest(
        property=property_id,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[Dimension(name="sessionDefaultChannelGrouping")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="conversions"),
            Metric(name="engagementRate"),
        ],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)]
    )
    response = run_report_with_retry(client, request)
    channels = []
    for row in response.rows:
        channels.append({
            "channel": row.dimension_values[0].value,
            "sessions": int(float(row.metric_values[0].value)),
            "users": int(float(row.metric_values[1].value)),
            "conversions": int(float(row.metric_values[2].value)),
            "engagement_rate": float(row.metric_values[3].value),
        })
    print(f"   ✅ Got {len(channels)} channels")
    return channels

def fetch_top_pages(client, property_id, days=90, limit=50):
    """Top pages by sessions"""
    print(f"📡 GA4: Fetching top {limit} pages...")
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    request = RunReportRequest(
        property=property_id,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[
            Dimension(name="pagePath"),
            Dimension(name="pageTitle"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="screenPageViews"),
            Metric(name="engagementRate"),
            Metric(name="averageSessionDuration"),
            Metric(name="bounceRate"),
        ],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=limit
    )
    response = run_report_with_retry(client, request)
    pages = []
    for row in response.rows:
        pages.append({
            "path": row.dimension_values[0].value,
            "title": row.dimension_values[1].value,
            "sessions": int(float(row.metric_values[0].value)),
            "pageviews": int(float(row.metric_values[1].value)),
            "engagement_rate": float(row.metric_values[2].value),
            "avg_duration_s": float(row.metric_values[3].value),
            "bounce_rate": float(row.metric_values[4].value),
        })
    print(f"   ✅ Got {len(pages)} top pages")
    return pages

def fetch_organic_only(client, property_id, days=90):
    """Organic search sessions specifically — correlation with GSC"""
    print(f"📡 GA4: Fetching organic search sessions...")
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    request = RunReportRequest(
        property=property_id,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[
            Dimension(name="pagePath"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="conversions"),
        ],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="sessionDefaultChannelGrouping",
                string_filter=Filter.StringFilter(value="Organic Search")
            )
        ),
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=100
    )
    response = run_report_with_retry(client, request)
    pages = []
    for row in response.rows:
        pages.append({
            "path": row.dimension_values[0].value,
            "organic_sessions": int(float(row.metric_values[0].value)),
            "organic_users": int(float(row.metric_values[1].value)),
            "conversions": int(float(row.metric_values[2].value)),
        })
    print(f"   ✅ Got {len(pages)} organic landing pages")
    return pages

def fetch_weekly_trend(client, property_id, weeks=12):
    """Week-by-week session trend — spot traffic drops (algorithm updates)"""
    print(f"📡 GA4: Fetching {weeks}-week trend...")
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(weeks=weeks)).strftime("%Y-%m-%d")

    request = RunReportRequest(
        property=property_id,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[Dimension(name="week")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="conversions"),
        ],
        order_bys=[OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name="week"))]
    )
    response = run_report_with_retry(client, request)
    weeks_data = []
    for row in response.rows:
        weeks_data.append({
            "week": row.dimension_values[0].value,
            "sessions": int(float(row.metric_values[0].value)),
            "users": int(float(row.metric_values[1].value)),
            "conversions": int(float(row.metric_values[2].value)),
        })
    print(f"   ✅ Got {len(weeks_data)} weeks of data")
    return weeks_data

# ── Output Writers ────────────────────────────────────────────────────────────

def write_ga4_outputs(domain, date_str, overview, channels, top_pages,
                      organic, trend, output_dir):
    out = Path(output_dir) / domain
    out.mkdir(parents=True, exist_ok=True)

    # ── CSV ──
    csv_path = out / f"ga4_report_{domain}_{date_str}.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["metric_type", "dimension", "value_1", "value_2",
                         "value_3", "value_4", "period", "notes"])
        # Overview
        if overview:
            writer.writerow(["overview", "all_channels",
                             overview["sessions"], overview["total_users"],
                             f"{overview['engagement_rate']*100:.1f}%",
                             f"{overview['bounce_rate']*100:.1f}%",
                             overview["date_range"], "sessions|users|engagement|bounce"])
        # Channels
        for ch in channels:
            writer.writerow(["channel", ch["channel"],
                             ch["sessions"], ch["users"],
                             ch["conversions"],
                             f"{ch['engagement_rate']*100:.1f}%",
                             overview.get("date_range",""), ""])
        # Top pages
        for p in top_pages[:30]:
            writer.writerow(["top_page", p["path"],
                             p["sessions"], p["pageviews"],
                             f"{p['engagement_rate']*100:.1f}%",
                             f"{p['avg_duration_s']:.0f}s",
                             overview.get("date_range",""), p["title"][:60]])
    print(f"   💾 GA4 CSV: {csv_path}")

    # ── Markdown Report ──
    total_sessions = overview.get("sessions", 0)
    organic_sessions = next((c["sessions"] for c in channels if "Organic" in c["channel"]), 0)
    organic_pct = (organic_sessions / total_sessions * 100) if total_sessions else 0

    md_path = out / f"ga4_report_{domain}_{date_str}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Google Analytics 4 Report — {domain}\n")
        f.write(f"> Period: {overview.get('date_range','N/A')} | "
                f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')} | SEOSONA OS\n\n---\n\n")

        # KPIs
        f.write("## 📊 Key Performance Indicators\n\n")
        f.write("| Metric | Value | Health |\n|--------|-------|--------|\n")
        sess = overview.get("sessions", 0)
        eng = overview.get("engagement_rate", 0) * 100
        bounce = overview.get("bounce_rate", 0) * 100
        dur = overview.get("avg_session_duration_s", 0)
        convs = overview.get("conversions", 0)
        new_u = overview.get("new_users", 0)
        total_u = overview.get("total_users", 1)
        f.write(f"| Sessions | {sess:,} | — |\n")
        f.write(f"| Total Users | {overview.get('total_users',0):,} | — |\n")
        f.write(f"| New Users | {new_u:,} ({new_u/total_u*100:.0f}%) | — |\n")
        f.write(f"| Pageviews | {overview.get('pageviews',0):,} | — |\n")
        f.write(f"| Engagement Rate | {eng:.1f}% | {'🟢' if eng>60 else '🟡' if eng>40 else '🔴'} |\n")
        f.write(f"| Bounce Rate | {bounce:.1f}% | {'🟢' if bounce<40 else '🟡' if bounce<65 else '🔴'} |\n")
        f.write(f"| Avg Session Duration | {dur:.0f}s ({dur/60:.1f} min) | {'🟢' if dur>120 else '🟡' if dur>60 else '🔴'} |\n")
        f.write(f"| Conversions | {convs:,} | — |\n")
        f.write(f"| Organic Traffic % | {organic_pct:.1f}% | {'🟢' if organic_pct>40 else '🟡' if organic_pct>20 else '🔴'} |\n")

        # Channels
        f.write("\n## 📡 Traffic Channels\n\n")
        f.write("| Channel | Sessions | % | Users | Conversions | Engagement |\n")
        f.write("|---------|---------|---|-------|-------------|------------|\n")
        for ch in channels:
            pct = ch["sessions"] / total_sessions * 100 if total_sessions else 0
            f.write(f"| {ch['channel']} | {ch['sessions']:,} | {pct:.1f}% | "
                    f"{ch['users']:,} | {ch['conversions']:,} | "
                    f"{ch['engagement_rate']*100:.1f}% |\n")

        # Top Pages
        f.write("\n## 📄 Top Pages (by Sessions)\n\n")
        f.write("| Page | Sessions | Pageviews | Engagement | Avg Duration | Bounce |\n")
        f.write("|------|---------|-----------|------------|-------------|--------|\n")
        for p in top_pages[:20]:
            f.write(f"| {p['path'][:60]} | {p['sessions']:,} | {p['pageviews']:,} | "
                    f"{p['engagement_rate']*100:.0f}% | {p['avg_duration_s']:.0f}s | "
                    f"{p['bounce_rate']*100:.0f}% |\n")

        # Organic Pages
        if organic:
            f.write("\n## 🔍 Organic Search — Top Landing Pages\n\n")
            f.write("*Correlation với GSC clicks data để xác nhận attribution*\n\n")
            f.write("| Page | Organic Sessions | Users | Conversions |\n")
            f.write("|------|-----------------|-------|-------------|\n")
            for p in organic[:20]:
                f.write(f"| {p['path'][:60]} | {p['organic_sessions']:,} | "
                        f"{p['organic_users']:,} | {p['conversions']:,} |\n")

        # Weekly Trend
        if trend:
            f.write("\n## 📈 Weekly Trend (Sessions)\n\n")
            f.write("| Week | Sessions | Users | Conversions | Note |\n")
            f.write("|------|---------|-------|-------------|------|\n")
            prev = None
            for w in trend:
                delta = ""
                if prev:
                    diff = w["sessions"] - prev["sessions"]
                    pct = diff / prev["sessions"] * 100 if prev["sessions"] else 0
                    delta = f"{'▲' if diff>0 else '▼'} {abs(pct):.0f}%"
                f.write(f"| Week {w['week']} | {w['sessions']:,} | "
                        f"{w['users']:,} | {w['conversions']:,} | {delta} |\n")
                prev = w

        f.write(f"\n---\n*SEOSONA OS — GA4 Integration | Source: Google Analytics 4 Data API (free)*\n")

    print(f"   💾 GA4 Report: {md_path}")

def run(domain=None, days=90):
    config = load_config()
    if not domain:
        domain = config["defaults"]["target_domain"]

    property_id = get_property_id(config)
    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = ROOT / config["defaults"]["output_dir"]

    print(f"\n🚀 SEOSONA GA4 Connector — {domain}")
    print(f"   Property: {property_id} | Period: {days} days\n")

    client = get_ga4_client(config)

    overview = fetch_overview(client, property_id, days)
    channels = fetch_channels(client, property_id, days)
    top_pages = fetch_top_pages(client, property_id, days)
    organic = fetch_organic_only(client, property_id, days)
    trend = fetch_weekly_trend(client, weeks=12)

    print(f"\n💾 Writing GA4 outputs...")
    write_ga4_outputs(domain, date_str, overview, channels, top_pages,
                      organic, trend, output_dir)
    print(f"\n✅ GA4 pull complete!")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA GA4 Connector")
    parser.add_argument("--domain", default=None)
    parser.add_argument("--days", type=int, default=90)
    args = parser.parse_args()
    run(domain=args.domain, days=args.days)
