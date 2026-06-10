#!/usr/bin/env python3
"""
SEOSONA OS -- Rank Tracker Connector
Reads GSC data (query_performance rows) and builds position history,
tracking movers/shakers, opportunities (pos 4-20), and top wins.

Input:  GSC CSV files in 3_MEMORY/seo_exports/{domain}/
Output: rank_tracking_{domain}_{date}.csv + .md

Usage:
    python scripts/connectors/rank_tracker.py --domain example.com
"""
import csv, json, re, sys, os, argparse
from datetime import datetime
from pathlib import Path
from collections import defaultdict

os.environ.setdefault("PYTHONIOENCODING", "utf-8")
ROOT = Path(__file__).parent.parent.parent.parent


def load_gsc_data(domain: str) -> list:
    out = ROOT / "3_MEMORY" / "seo_exports" / domain
    rows = []
    for f in sorted(out.glob("gsc_report_*.csv"), reverse=True):
        try:
            with open(f, encoding="utf-8") as fh:
                for row in csv.DictReader(fh):
                    if row.get("metric_type") == "query_performance":
                        rows.append(row)
        except Exception:
            continue
        if rows:
            break
    return rows


def categorize_keywords(rows: list) -> dict:
    """Bucket keywords by position range"""
    buckets = {"top3": [], "page1_rest": [], "page2": [], "page3plus": []}
    for r in rows:
        try:
            pos = float(r.get("position", r.get("value_3", 99) or 99))
        except (ValueError, TypeError):
            pos = 99
        try:
            clicks = int(float(r.get("clicks", r.get("value_1", 0) or 0)))
            impressions = int(float(r.get("impressions", r.get("value_2", 0) or 0)))
            ctr = float(r.get("ctr", r.get("value_4", 0) or 0))
        except (ValueError, TypeError):
            clicks = impressions = 0
            ctr = 0.0
        kw = r.get("keyword", r.get("dimension_1", ""))
        page = r.get("page", r.get("dimension_2", ""))
        entry = {
            "keyword": kw, "page": page,
            "position": round(pos, 1), "clicks": clicks,
            "impressions": impressions, "ctr": round(ctr * 100, 2)
        }
        if pos <= 3:
            buckets["top3"].append(entry)
        elif pos <= 10:
            buckets["page1_rest"].append(entry)
        elif pos <= 20:
            buckets["page2"].append(entry)
        else:
            buckets["page3plus"].append(entry)
    return buckets


def find_quick_wins(rows: list) -> list:
    """Position 4-20 with high impressions — easiest to push to page 1"""
    wins = []
    for r in rows:
        try:
            pos = float(r.get("position", r.get("value_3", 99) or 99))
            impressions = int(float(r.get("impressions", r.get("value_2", 0) or 0)))
            clicks = int(float(r.get("clicks", r.get("value_1", 0) or 0)))
        except (ValueError, TypeError):
            continue
        if 4 <= pos <= 20 and impressions > 50:
            kw = r.get("keyword", r.get("dimension_1", ""))
            page = r.get("page", r.get("dimension_2", ""))
            expected_ctr = 0.05 if pos <= 10 else 0.02
            traffic_potential = int(impressions * (0.25 - expected_ctr))
            wins.append({
                "keyword": kw, "page": page[:60],
                "current_position": round(pos, 1),
                "impressions": impressions, "clicks": clicks,
                "traffic_potential": max(0, traffic_potential),
                "priority": "P0" if pos <= 6 and impressions > 200 else "P1"
            })
    return sorted(wins, key=lambda x: x["traffic_potential"], reverse=True)[:30]


def run(domain=None):
    config_path = ROOT / "3_MEMORY" / "specs" / "config.json"
    if config_path.exists():
        with open(config_path, encoding="utf-8") as f:
            config = json.load(f)
        if not domain:
            domain = config["defaults"]["target_domain"]
    if not domain:
        print("[XX] No domain specified and no config.json found.")
        print("     Run: python scripts/connectors/rank_tracker.py --domain yourdomain.com")
        return

    print(f"\n[RANK] SEOSONA Rank Tracker -- {domain}")
    rows = load_gsc_data(domain)

    if not rows:
        print("[!!] No GSC data found. Setup GSC first.")
        print("     Once GSC is connected, run: python scripts/connectors/gsc_connector.py")
        # Write empty report so dashboard doesn't break
        out = ROOT / "3_MEMORY" / "seo_exports" / domain
        out.mkdir(parents=True, exist_ok=True)
        date_str = datetime.now().strftime("%Y-%m-%d")
        with open(out / f"rank_tracking_{domain}_{date_str}.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["keyword", "page", "position", "clicks", "impressions", "ctr", "priority", "date"])
        return

    print(f"   [OK] Loaded {len(rows)} keyword rows from GSC data")
    date_str = datetime.now().strftime("%Y-%m-%d")
    out = ROOT / "3_MEMORY" / "seo_exports" / domain
    out.mkdir(parents=True, exist_ok=True)

    buckets = categorize_keywords(rows)
    quick_wins = find_quick_wins(rows)

    # CSV output
    csv_path = out / f"rank_tracking_{domain}_{date_str}.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["keyword", "page", "position", "clicks", "impressions", "ctr", "bucket", "priority", "date"])
        for bucket, entries in buckets.items():
            for e in entries:
                priority = "P0" if bucket == "top3" else "P1" if bucket == "page1_rest" else "P2"
                w.writerow([e["keyword"], e["page"], e["position"], e["clicks"],
                             e["impressions"], e["ctr"], bucket, priority, date_str])

    # MD output
    md_path = out / f"rank_tracking_{domain}_{date_str}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Rank Tracking Report -- {domain}\n")
        f.write(f"> Date: {date_str} | Source: GSC | SEOSONA OS\n\n---\n\n")
        f.write(f"## Position Distribution\n\n")
        f.write(f"| Range | Keywords | % |\n|-------|---------|---|\n")
        total = sum(len(v) for v in buckets.values())
        for b, entries in buckets.items():
            pct = round(len(entries)/max(total,1)*100, 1)
            label = {"top3":"#1-3 (Top)","page1_rest":"#4-10 (Page 1)","page2":"#11-20 (Page 2)","page3plus":"#21+ (Beyond)"}.get(b,b)
            f.write(f"| {label} | {len(entries)} | {pct}% |\n")

        f.write(f"\n## Quick Wins (Position 4-20, High Impressions)\n\n")
        f.write("| Keyword | Position | Impressions | Traffic Gain | Priority |\n")
        f.write("|---------|----------|-------------|--------------|----------|\n")
        for w_item in quick_wins[:15]:
            f.write(f"| {w_item['keyword']} | {w_item['current_position']} | "
                    f"{w_item['impressions']} | +{w_item['traffic_potential']} | {w_item['priority']} |\n")

    print(f"[OK] Rank tracking CSV: {csv_path}")
    print(f"[OK] Rank tracking MD:  {md_path}")
    print(f"[OK] Rank tracking done! Quick wins: {len(quick_wins)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--domain", default=None)
    args = parser.parse_args()
    run(domain=args.domain)
