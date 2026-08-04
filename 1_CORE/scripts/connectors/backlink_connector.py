# seosona-ignore-lang
#!/usr/bin/env python3
"""
SEOSONA OS — Backlink Intelligence Connector
Sources: Open PageRank API (free) + Common Crawl (free) + Bing Webmaster (free)
No paid tools required for basic backlink profile.
"""

import json
import csv
import os
import sys
import urllib.request
import urllib.parse
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent.parent
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"

try:
    from secrets_manager import get_secret
except ImportError:
    def get_secret(key, default=""):
        return os.environ.get(key, default)

# SSRF-hardened fetch (validates the initial URL AND every redirect hop). Fail closed if the guard
# module can't be imported — refuse to fetch rather than silently fall back to raw urlopen.
try:
    from url_guard import safe_urlopen
except Exception:  # pragma: no cover - guard must be importable in a real install
    def safe_urlopen(*_a, **_k):
        raise RuntimeError("url_guard unavailable — refusing to fetch unsafely")


def is_configured(value):
    if value is None:
        return False
    text = str(value).strip()
    return bool(text) and text not in {"''", '""'} and "YOUR_" not in text and text != "USE_SECRETS_MANAGER"

def load_config():
    # A malformed config.json used to abort the connector with a raw JSONDecodeError
    # traceback. Report it and fall back to defaults instead.
    try:
        if not CONFIG_PATH.exists():
            print(f"❌ Config not found: {CONFIG_PATH}")
            sys.exit(1)
        with open(CONFIG_PATH) as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        print(f"[!] config.json unreadable ({e}); using defaults.")
        return {"defaults": {"target_domain": "", "target_url": "",
                             "output_dir": "3_MEMORY/seo_exports"}}

# ── SOURCE 1: Open PageRank (Free, no signup) ─────────────────────────────────

def fetch_open_pagerank(domains, api_key):
    """
    Free domain authority API — https://www.domainpagerank.com
    Returns: page_rank_integer (0-10), rank (global), last_updated
    No credit card, generous free tier.
    """
    print(f"📡 Open PageRank: fetching DR for {domains}...")
    if not is_configured(api_key):
        print("   ⚠️  No API key. Get free at: https://www.domainpagerank.com")
        print("   ⚠️  Returning placeholder data")
        return {d: {"page_rank_integer": "N/A", "rank": "N/A", "error": "No API key"} for d in domains}

    url = "https://openpagerank.com/api/v1.0/getPageRank"
    params = "&".join([f"domains[]={urllib.parse.quote(d)}" for d in domains])
    full_url = f"{url}?{params}"
    headers = {"API-OPR": api_key}

    try:
        req = urllib.request.Request(full_url, headers=headers)
        with safe_urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
        results = {}
        for item in data.get("response", []):
            domain = item.get("domain", "")
            results[domain] = {
                "page_rank_integer": item.get("page_rank_integer", "N/A"),
                "rank": item.get("rank", "N/A"),
                "last_updated": item.get("last_updated", "N/A")
            }
        print(f"   ✅ Got PR data for {len(results)} domains")
        return results
    except Exception as e:
        print(f"   ❌ Open PageRank error: {e}")
        return {d: {"page_rank_integer": "Error", "rank": "Error"} for d in domains}

# ── SOURCE 2: Common Crawl (Fully Free, no signup) ───────────────────────────

def fetch_common_crawl(domain, max_links=100):
    """
    Query Common Crawl index for pages linking to the domain.
    Free, no API key needed. May be slow for large domains.
    Returns: list of {url, timestamp, status, mime}
    """
    print(f"📡 Common Crawl: searching for backlinks to {domain}...")
    # Use the CC CDX API (always returns latest available index)
    cdx_url = "https://index.commoncrawl.org/collinfo.json"
    # Fall back to a known stable index if collinfo fails
    index_url = "https://index.commoncrawl.org/CC-MAIN-2025-08-index"
    try:
        with safe_urlopen(cdx_url, timeout=10) as r:
            indexes = json.loads(r.read())
            if indexes:
                index_url = indexes[0].get("cdx-api", index_url)
    except Exception:
        pass  # use fallback above
    params = urllib.parse.urlencode({
        "url": f"*.{domain}",
        "output": "json",
        "limit": max_links,
        "filter": "statuscode:200"
    })
    full_url = f"{index_url}?{params}"

    try:
        with safe_urlopen(full_url, timeout=30) as resp:
            lines = resp.read().decode().strip().split("\n")
        results = []
        for line in lines:
            try:
                results.append(json.loads(line))
            except:
                continue
        print(f"   ✅ Found {len(results)} Common Crawl entries")
        return results
    except Exception as e:
        print(f"   ⚠️  Common Crawl error: {e}")
        return []

def parse_common_crawl_backlinks(cc_data, target_domain):
    """
    From Common Crawl CDX data, extract domains that link to target.
    This is a simplified version — for deeper analysis use WARC files.
    """
    referring_domains = {}
    for entry in cc_data:
        url = entry.get("url", "")
        # Extract domain from URL
        try:
            domain = url.split("/")[2] if "/" in url else url
            domain = domain.replace("www.", "")
            if domain != target_domain and domain not in referring_domains:
                referring_domains[domain] = {
                    "url": url,
                    "timestamp": entry.get("timestamp", ""),
                    "status": entry.get("status", ""),
                    "mime": entry.get("mime", ""),
                    "source": "Common Crawl"
                }
        except:
            continue
    return referring_domains

# ── SOURCE 3: Bing Webmaster Tools API (Free, verified domain only) ──────────

def fetch_bing_backlinks(domain, api_key, max_links=100):
    """
    Bing Webmaster Tools API — free for verified domains.
    Returns referring domains and inbound links.
    Signup: https://www.bing.com/webmasters → Settings → API Access
    """
    print(f"📡 Bing Webmaster: fetching links for {domain}...")
    if not is_configured(api_key):
        print("   ⚠️  No Bing API key. Get free at: bing.com/webmasters → Settings → API Access")
        return []

    url = f"https://ssl.bing.com/webmaster/api.svc/json/GetLinksToUrl"
    params = urllib.parse.urlencode({
        "siteUrl": f"https://{domain}/",
        "pageUrl": f"https://{domain}/",
        "apikey": api_key
    })
    full_url = f"{url}?{params}"

    try:
        with safe_urlopen(full_url, timeout=15) as resp:
            data = json.loads(resp.read())
        links = data.get("d", {}).get("InLinks", [])
        print(f"   ✅ Got {len(links)} Bing links")
        return links
    except Exception as e:
        print(f"   ⚠️  Bing Webmaster error: {e}")
        return []

# ── SOURCE 4: Google Autocomplete (Free, no key) ─────────────────────────────

def check_brand_mentions(brand, keywords=None):
    """Use Google Autocomplete to find brand+keyword associations"""
    if not keywords:
        keywords = ["review", "chính hãng", "uy tín", "có tốt không", "so sánh"]
    print(f"📡 Checking brand mentions for: {brand}")
    results = {}
    for kw in keywords:
        query = f"{brand} {kw}"
        url = f"https://suggestqueries.google.com/complete/search?client=firefox&q={urllib.parse.quote(query)}&hl=vi"
        try:
            with safe_urlopen(url, timeout=10) as resp:
                data = json.loads(resp.read())
            suggestions = data[1] if len(data) > 1 else []
            results[query] = suggestions
        except Exception as e:
            results[query] = []
    print(f"   ✅ Got brand mention data for {len(keywords)} queries")
    return results

# ── Output ────────────────────────────────────────────────────────────────────

def write_backlink_report(domain, date_str, pr_data, cc_links, bing_links, output_dir):
    """Write backlink_report CSV + MD"""
    output_path = Path(output_dir) / domain
    output_path.mkdir(parents=True, exist_ok=True)

    # CSV
    csv_path = output_path / f"backlink_report_{domain}_{date_str}.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["source_domain", "target_domain", "anchor_text", "anchor_type",
                         "link_type", "source_dr_estimate", "is_relevant",
                         "toxic_flag", "notes", "data_source"])

        # Common Crawl entries
        for src_domain, info in list(cc_links.items())[:50]:
            writer.writerow([
                src_domain, domain, "N/A", "Unknown",
                "Unknown", "N/A", "Unknown", "Unknown",
                f"CC timestamp: {info.get('timestamp','')[:8]}",
                "Common Crawl"
            ])

        # Bing links
        for link in bing_links[:50]:
            writer.writerow([
                link.get("Url", ""), domain,
                link.get("AnchorText", "N/A"), "Unknown",
                "Unknown", "N/A", "Unknown", "Unknown",
                "", "Bing Webmaster Tools"
            ])

    print(f"   💾 Saved backlink CSV: {csv_path}")

    # MD Report
    target_pr = pr_data.get(domain, {})
    competitor_domains = ["nguyenkim.com", "cellphones.com.vn", "saesound.com.vn"]
    md_path = output_path / f"backlink_full_report_{domain}_{date_str}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Backlink Intelligence Report — {domain}\n")
        f.write(f"> Date: {date_str} | Sources: Open PageRank + Common Crawl + Bing Webmaster | SEOSONA OS\n\n---\n\n")

        f.write(f"## Domain Profile\n\n")
        f.write(f"| Metric | {domain} | nguyenkim.com | cellphones.com.vn |\n")
        f.write(f"|--------|{'|'.join(['-'*15]*3)}|\n")

        for d in [domain] + competitor_domains[:2]:
            pr = pr_data.get(d, {})
            pr_val = pr.get('page_rank_integer', 'N/A')
            f.write(f"| Open PageRank (0-10) | {pr_val} | — | — |\n")

        f.write(f"## Common Crawl — Referring Domains Found\n\n")
        if cc_links:
            f.write(f"*{len(cc_links)} unique referring domains detected via Common Crawl index*\n\n")
            f.write("| Referring Domain | First Seen | Notes |\n")
            f.write("|-----------------|------------|-------|\n")
            for src, info in list(cc_links.items())[:30]:
                ts = info.get("timestamp", "")[:8]
                f.write(f"| {src} | {ts} | Verify manually |\n")
        else:
            f.write("*No Common Crawl data retrieved — may need to retry or check connectivity*\n")

        if bing_links:
            f.write(f"\n## Bing Webmaster — Inbound Links\n\n")
            f.write(f"*{len(bing_links)} links from Bing verified crawl*\n\n")
            f.write("| Source URL | Anchor Text |\n")
            f.write("|-----------|-------------|\n")
            for link in bing_links[:20]:
                f.write(f"| {link.get('Url','')} | {link.get('AnchorText','N/A')} |\n")

        f.write(f"\n## Recommendations\n\n")
        f.write("1. **Connect Ahrefs Webmaster Tools** (free for verified domain) for deeper backlink data\n")
        f.write("2. **Submit to Google Search Console** → Links report → export full backlink list\n")
        f.write("3. **Priority outreach targets** — tech/audio sites in VN: tinhte.vn, genk.vn, reviewlaptop.vn\n\n")
        f.write(f"\n---\n*SEOSONA OS — seo_backlink_intel skill*\n")

    print(f"   💾 Saved backlink report: {md_path}")

def run(domain=None):
    config = load_config()
    if not domain:
        domain = config["defaults"]["target_domain"]

    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = ROOT / config["defaults"]["output_dir"]
    opr_key = get_secret("OPEN_PAGERANK_KEY") or config.get("open_pagerank", {}).get("api_key", "")
    bing_key = get_secret("BING_WEBMASTER_KEY") or config.get("bing_webmaster", {}).get("api_key", "")

    print(f"\n🚀 SEOSONA Backlink Connector — {domain}\n")

    # Fetch domain authority for target + competitors
    # Competitor list can be overridden in config.json under ["defaults"]["competitors"]
    default_competitors = config.get("defaults", {}).get("competitors", [])
    domains_to_check = [domain] + default_competitors[:3]
    if len(domains_to_check) == 1:
        print("   Tip: Add \"competitors\": [\"competitor1.com\", \"competitor2.com\"] to config.json defaults")
    pr_data = fetch_open_pagerank(domains_to_check, opr_key)

    # Common Crawl — free backlinks
    cc_raw = fetch_common_crawl(domain, max_links=200)
    cc_links = parse_common_crawl_backlinks(cc_raw, domain)

    # Bing Webmaster — free for verified domain
    bing_links = fetch_bing_backlinks(domain, bing_key)

    print(f"\n💾 Writing backlink reports...")
    write_backlink_report(domain, date_str, pr_data, cc_links, bing_links, output_dir)

    # Print competitive PR comparison
    print(f"\n📊 Domain Authority Comparison (Open PageRank 0-10):")
    for d, data in pr_data.items():
        pr = data.get("page_rank_integer", "N/A")
        print(f"   {d}: {pr}/10")

    print(f"\n✅ Backlink pull complete!")
    print(f"   Referring domains (Common Crawl): {len(cc_links)}")
    print(f"   Bing links: {len(bing_links)}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Backlink Connector")
    parser.add_argument("--domain", default=None)
    args = parser.parse_args()
    run(domain=args.domain)
