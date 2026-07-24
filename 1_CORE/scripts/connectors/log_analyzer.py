#!/usr/bin/env python3
"""
SEOSONA OS -- Log File Analyzer
Parses web server access logs (Apache/Nginx/Cloudflare/Shopify)
to identify: Googlebot crawl patterns, crawl budget waste,
404s Google sees, most/least crawled pages, crawl frequency.

Input:  Raw access log file (access.log, access.log.gz, or CSV export)
Output: log_analysis_{domain}_{date}.csv + .md report

Usage:
    python scripts/connectors/log_analyzer.py --domain example.com --log /path/to/access.log
    python scripts/connectors/log_analyzer.py --domain example.com --log access.log --format nginx
    python scripts/connectors/log_analyzer.py --domain example.com --log cloudflare_export.csv --format cloudflare
"""

import csv
import re
import sys
import os
import gzip
import argparse
from collections import defaultdict, Counter
from datetime import datetime
from pathlib import Path

os.environ.setdefault("PYTHONIOENCODING", "utf-8")

ROOT = Path(__file__).parent.parent.parent.parent

# --- Log format patterns ---
LOG_FORMATS = {
    "nginx": (
        r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] '
        r'"(?P<method>\S+) (?P<path>\S+) \S+" '
        r'(?P<status>\d{3}) (?P<size>\S+) '
        r'"(?P<referer>[^"]*)" "(?P<ua>[^"]*)"'
    ),
    "apache": (
        r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] '
        r'"(?P<method>\S+) (?P<path>\S+) \S+" '
        r'(?P<status>\d{3}) (?P<size>\S+)'
    ),
    "cloudflare": None,  # CSV format — handled separately
    "shopify": None,      # JSON/CSV format
}

# Googlebot user-agent patterns
GOOGLEBOT_PATTERNS = [
    "Googlebot/", "Googlebot-Image/", "Googlebot-News/",
    "Googlebot-Video/", "Google-InspectionTool/", "Google-Site-Verification/"
]

# Crawl budget wasters
BUDGET_WASTERS = [
    r'\?.*sort=', r'\?.*filter=', r'\?.*page=\d+',
    r'/cart', r'/checkout', r'/account', r'/login', r'/logout',
    r'/search\?', r'\?utm_', r'\?fbclid=', r'\?ref=',
    r'\.jpg$', r'\.png$', r'\.gif$', r'\.css$', r'\.js$',
]


def is_googlebot(ua: str) -> bool:
    return any(p.lower() in ua.lower() for p in GOOGLEBOT_PATTERNS)


def is_budget_waster(path: str) -> str:
    for pattern in BUDGET_WASTERS:
        if re.search(pattern, path, re.IGNORECASE):
            return pattern.strip(r'\?.*')
    return ""


def parse_nginx_apache(log_path: Path, fmt: str) -> list:
    pattern = re.compile(LOG_FORMATS[fmt])
    records = []
    opener = gzip.open if str(log_path).endswith(".gz") else open
    mode = "rt"
    with opener(log_path, mode, encoding="utf-8", errors="replace") as f:
        for i, line in enumerate(f):
            m = pattern.match(line.strip())
            if not m:
                continue
            records.append({
                "ip":     m.group("ip"),
                "time":   m.group("time"),
                "method": m.group("method"),
                "path":   m.group("path"),
                "status": m.group("status"),
                "ua":     m.group("ua") if "ua" in pattern.groupindex else "",
            })
            if i % 100000 == 0 and i > 0:
                print(f"   Parsed {i:,} lines...")
    return records


def parse_cloudflare_csv(log_path: Path) -> list:
    """Parse Cloudflare Log Push CSV export"""
    records = []
    with open(log_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append({
                "ip":     row.get("ClientIP", ""),
                "time":   row.get("EdgeStartTimestamp", ""),
                "method": row.get("ClientRequestMethod", ""),
                "path":   row.get("ClientRequestURI", ""),
                "status": str(row.get("EdgeResponseStatus", "")),
                "ua":     row.get("ClientRequestUserAgent", ""),
            })
    return records


def analyze(records: list, domain: str) -> dict:
    """Core analysis — separates Googlebot vs all traffic"""
    googlebot = [r for r in records if is_googlebot(r.get("ua", ""))]
    all_traffic = records

    total = len(all_traffic)
    bot_total = len(googlebot)

    print(f"   Total log entries:  {total:,}")
    print(f"   Googlebot requests: {bot_total:,} ({bot_total/max(total,1)*100:.1f}%)")

    # Googlebot: crawl frequency per path
    bot_paths = Counter(r["path"] for r in googlebot)
    # Status codes Googlebot saw
    bot_status = Counter(r["status"] for r in googlebot)
    # 404s Googlebot hit
    bot_404 = [r for r in googlebot if r.get("status") == "404"]
    bot_404_paths = Counter(r["path"] for r in bot_404)
    # Crawl budget wasters
    wasters = []
    for r in googlebot:
        reason = is_budget_waster(r["path"])
        if reason:
            wasters.append({"path": r["path"], "reason": reason, "status": r["status"]})

    # Most crawled pages (Googlebot)
    most_crawled = bot_paths.most_common(50)
    # Least crawled (crawled 1x only) — potential orphans
    once_crawled = [(p, c) for p, c in bot_paths.items() if c == 1]

    return {
        "total_requests": total,
        "googlebot_requests": bot_total,
        "googlebot_pct": round(bot_total / max(total, 1) * 100, 2),
        "bot_status_codes": dict(bot_status),
        "bot_404_count": len(bot_404),
        "top_404_paths": bot_404_paths.most_common(20),
        "most_crawled": most_crawled,
        "once_crawled": once_crawled[:30],
        "budget_wasters": wasters[:50],
        "waster_count": len(wasters),
    }


def write_outputs(analysis: dict, domain: str, log_path: Path):
    date_str = datetime.now().strftime("%Y-%m-%d")
    out_dir = ROOT / "3_MEMORY" / "seo_exports" / domain
    out_dir.mkdir(parents=True, exist_ok=True)

    csv_path = out_dir / f"log_analysis_{domain}_{date_str}.csv"
    md_path  = out_dir / f"log_analysis_{domain}_{date_str}.md"

    # CSV — most crawled pages
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["path", "googlebot_crawls", "type", "date"])
        for path, count in analysis["most_crawled"]:
            wtype = "Budget Waster" if is_budget_waster(path) else "Normal"
            writer.writerow([path, count, wtype, date_str])
        for path, _ in analysis["top_404_paths"]:
            writer.writerow([path, 0, "404 Error", date_str])
    print(f"\n[OK] Log CSV: {csv_path}")

    # MD report
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Log File Analysis -- {domain}\n")
        f.write(f"> Log: {log_path.name} | Date: {date_str} | SEOSONA OS\n\n---\n\n")
        f.write(f"## Summary\n\n")
        f.write(f"| Metric | Value |\n|--------|-------|\n")
        f.write(f"| Total requests | {analysis['total_requests']:,} |\n")
        f.write(f"| Googlebot requests | {analysis['googlebot_requests']:,} ({analysis['googlebot_pct']}%) |\n")
        f.write(f"| 404s Googlebot hit | {analysis['bot_404_count']} |\n")
        f.write(f"| Crawl budget wasters | {analysis['waster_count']} |\n")
        f.write(f"\n## Googlebot Status Codes\n\n")
        f.write("| Status | Count |\n|--------|-------|\n")
        for code, cnt in sorted(analysis["bot_status_codes"].items()):
            f.write(f"| {code} | {cnt} |\n")
        f.write(f"\n## Top 404s Googlebot Sees (Fix Immediately)\n\n")
        f.write("| URL | Times Crawled |\n|-----|---------------|\n")
        for path, cnt in analysis["top_404_paths"]:
            f.write(f"| {path} | {cnt} |\n")
        f.write(f"\n## Crawl Budget Wasters (Block in robots.txt)\n\n")
        seen = set()
        f.write("| URL Pattern | Example |\n|-------------|----------|\n")
        for w in analysis["budget_wasters"]:
            if w["reason"] not in seen:
                seen.add(w["reason"])
                f.write(f"| {w['reason']} | {w['path'][:80]} |\n")
        f.write(f"\n## Most Crawled Pages\n\n")
        f.write("| URL | Crawl Count |\n|-----|-------------|\n")
        for path, cnt in analysis["most_crawled"][:20]:
            f.write(f"| {path} | {cnt} |\n")
        f.write(f"\n## Recommendations\n\n")
        if analysis["bot_404_count"] > 0:
            f.write(f"- **P0:** Fix or 301-redirect {analysis['bot_404_count']} URLs returning 404 to Googlebot\n")
        if analysis["waster_count"] > 10:
            f.write(f"- **P1:** Block {analysis['waster_count']} crawl budget wasters in robots.txt\n")
        f.write("- Review pages crawled only once -- may need better internal linking\n")
    print(f"[OK] Log Report: {md_path}")

    return csv_path, md_path


def run(domain=None, log_file=None, fmt="nginx"):
    from pathlib import Path as P
    import json

    config_path = ROOT / "3_MEMORY" / "specs" / "config.json"
    if config_path.exists():
        with open(config_path) as f:
            config = json.load(f)
        if not domain:
            domain = config["defaults"]["target_domain"]
    if not domain:
        print("[XX] No domain specified and no config.json found.")
        print("     Run: python scripts/connectors/log_analyzer.py --domain yourdomain.com --log /path/to/access.log")
        return

    if not log_file:
        print("[XX] No log file provided.")
        print("     Usage: python scripts/connectors/log_analyzer.py --log /path/to/access.log")
        print("     Tip:   Download your log from cPanel > Logs > Access Log")
        print("            or Cloudflare Analytics > Log Push")
        return

    log_path = P(log_file)
    if not log_path.exists():
        print(f"[XX] Log file not found: {log_path}")
        return

    print(f"\n[LOG] SEOSONA Log Analyzer -- {domain}")
    print(f"      File: {log_path}")
    print(f"      Format: {fmt}\n")

    if fmt in ("nginx", "apache"):
        records = parse_nginx_apache(log_path, fmt)
    elif fmt == "cloudflare":
        records = parse_cloudflare_csv(log_path)
    else:
        print(f"[XX] Unknown format: {fmt}. Use: nginx, apache, cloudflare")
        return

    if not records:
        print("[XX] No records parsed. Check log format.")
        return

    analysis = analyze(records, domain)
    write_outputs(analysis, domain, log_path)
    print(f"\n[OK] Log analysis complete!")
    print(f"     Googlebot 404s: {analysis['bot_404_count']} | Budget wasters: {analysis['waster_count']}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SEOSONA Log File Analyzer")
    parser.add_argument("--domain", default=None, help="Target domain")
    parser.add_argument("--log",    required=True, help="Path to access log file")
    parser.add_argument("--format", default="nginx", choices=["nginx", "apache", "cloudflare"],
                        help="Log format (default: nginx)")
    args = parser.parse_args()
    run(domain=args.domain, log_file=args.log, fmt=args.format)
