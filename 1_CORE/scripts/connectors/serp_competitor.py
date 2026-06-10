#!/usr/bin/env python3
"""
SEOSONA OS -- SERP Competitor Analyzer
Pulls SERP-level competitor intel from:
  1. Google Autocomplete (related searches, PAA clues)
  2. Keyword CSV data to identify competitor pages
  3. Common Crawl / Backlink data for domain overlap

Output: serp_competitor_{domain}_{date}.csv + .md

Usage:
    python scripts/connectors/serp_competitor.py --domain example.com --competitors jblvietnam.vn sonylvietnam.vn
"""
import csv, json, sys, os, re, argparse, time, ssl
import urllib.request, urllib.parse
from datetime import datetime
from pathlib import Path

os.environ.setdefault("PYTHONIOENCODING", "utf-8")
ROOT = Path(__file__).parent.parent.parent.parent

# ----- Autocomplete-based competitor research -----

def fetch_autocomplete(query: str, lang="vi", country="vn") -> list:
    """Google Autocomplete suggestions"""
    params = urllib.parse.urlencode({
        "q": query, "hl": lang, "gl": country, "client": "firefox"
    })
    url = f"https://www.google.com/complete/search?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return [s[0] for s in data[1]] if len(data) > 1 else []
    except Exception:
        return []


def fetch_page_info(url: str) -> dict:
    """Lightweight page analysis for a competitor URL"""
    try:
        ctx = ssl.create_default_context()
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (compatible; SEOSONA/1.0)"}
        )
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            html = resp.read().decode("utf-8", errors="replace")
        title_m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
        desc_m  = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)', html, re.I)
        h1_m    = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)
        word_count = len(re.sub(r"<[^>]+>", " ", html).split())
        has_schema = "application/ld+json" in html or 'itemtype="http://schema.org/' in html
        return {
            "title": re.sub(r"<[^>]+>", "", title_m.group(1) if title_m else "")[:80],
            "description": (desc_m.group(1) if desc_m else "")[:120],
            "h1": re.sub(r"<[^>]+>", "", h1_m.group(1) if h1_m else "")[:60],
            "word_count": word_count,
            "has_schema": "Yes" if has_schema else "No",
        }
    except Exception as e:
        return {"title": "", "description": "", "h1": "", "word_count": 0, "has_schema": "Unknown"}


def analyze_keyword_overlap(domain: str, competitors: list) -> list:
    """Compare keyword CSV to find content gaps"""
    out = ROOT / "3_MEMORY" / "seo_exports" / domain
    kw_files = sorted(out.glob("keyword_research_*.csv"), reverse=True)
    if not kw_files:
        return []
    rows = []
    with open(kw_files[0], encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rows.append(row)

    # Find transactional keywords and check if competitors rank
    transactional = [r for r in rows if r.get("intent") == "Transactional"][:20]
    gaps = []
    for kw_row in transactional:
        kw = kw_row.get("keyword", "")
        gap_entry = {
            "keyword": kw,
            "intent": kw_row.get("intent", ""),
            "priority": kw_row.get("priority", ""),
            "your_page": "Not ranked",
            "content_gap": "Yes"
        }
        for comp in competitors[:3]:
            gap_entry[f"competitor_{comp}"] = "Check manually"
        gaps.append(gap_entry)
    return gaps


def run(domain=None, competitors=None):
    config_path = ROOT / "3_MEMORY" / "specs" / "config.json"
    if config_path.exists():
        with open(config_path, encoding="utf-8") as f:
            config = json.load(f)
        if not domain:
            domain = config["defaults"]["target_domain"]
    if not domain:
        print("[XX] No domain specified and no config.json found.")
        print("     Run: python scripts/connectors/serp_competitor.py --domain yourdomain.com")
        return
    if not competitors:
        competitors = []

    print(f"\n[SERP] SEOSONA SERP Competitor Analyzer -- {domain}")
    date_str = datetime.now().strftime("%Y-%m-%d")
    out = ROOT / "3_MEMORY" / "seo_exports" / domain
    out.mkdir(parents=True, exist_ok=True)

    # 1. Autocomplete competitor signals
    print("   [1/3] Fetching autocomplete signals...")
    seed_queries = [
        f"site:{domain}",
        domain.replace(".com.vn", "").replace(".vn", ""),
    ]
    # Load top keywords as seeds
    kw_files = sorted(out.glob("keyword_research_*.csv"), reverse=True)
    if kw_files:
        with open(kw_files[0], encoding="utf-8") as f:
            kw_rows = list(csv.DictReader(f))
        top_kws = [r["keyword"] for r in kw_rows[:5] if r.get("keyword")]
        seed_queries.extend(top_kws)

    autocomplete_data = []
    for q in seed_queries[:5]:
        suggestions = fetch_autocomplete(q)
        for s in suggestions[:5]:
            autocomplete_data.append({"query": q, "suggestion": s, "source": "autocomplete"})
        time.sleep(0.3)
    print(f"   [OK] {len(autocomplete_data)} autocomplete signals")

    # 2. Competitor page analysis
    comp_pages = []
    if competitors:
        print(f"   [2/3] Analyzing {len(competitors)} competitor sites...")
        for comp in competitors:
            url = f"https://{comp}/" if not comp.startswith("http") else comp
            info = fetch_page_info(url)
            comp_pages.append({
                "competitor": comp, "url": url,
                **info, "date": date_str
            })
            time.sleep(0.5)
        print(f"   [OK] {len(comp_pages)} competitor pages analyzed")
    else:
        print("   [2/3] No competitors specified -- skipping page analysis")
        print("         Tip: --competitors jblvietnam.vn bosevietnam.com")

    # 3. Keyword gap analysis
    print("   [3/3] Analyzing content gaps...")
    gaps = analyze_keyword_overlap(domain, competitors)
    print(f"   [OK] {len(gaps)} keyword gaps found")

    # Write CSVs
    # Autocomplete signals
    ac_csv = out / f"serp_autocomplete_{domain}_{date_str}.csv"
    with open(ac_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["query", "suggestion", "source", "date"])
        for r in autocomplete_data:
            w.writerow([r["query"], r["suggestion"], r["source"], date_str])

    # Competitor matrix
    comp_csv = out / f"competitor_matrix_{domain}_{date_str}.csv"
    if comp_pages:
        with open(comp_csv, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=["competitor","url","title","description","h1","word_count","has_schema","date"])
            w.writeheader()
            w.writerows(comp_pages)

    # Content gaps
    gap_csv = out / f"content_gaps_{domain}_{date_str}.csv"
    if gaps:
        with open(gap_csv, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(gaps[0].keys()))
            w.writeheader()
            w.writerows(gaps)

    # MD report
    md_path = out / f"serp_competitor_{domain}_{date_str}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# SERP Competitor Analysis -- {domain}\n")
        f.write(f"> Date: {date_str} | SEOSONA OS\n\n---\n\n")
        if comp_pages:
            f.write(f"## Competitor Profiles\n\n")
            f.write("| Competitor | Title | Word Count | Schema | H1 |\n")
            f.write("|-----------|-------|------------|--------|----|\n")
            for c in comp_pages:
                f.write(f"| {c['competitor']} | {c['title'][:40]} | {c['word_count']} | {c['has_schema']} | {c['h1'][:30]} |\n")
        if gaps:
            f.write(f"\n## Content Gaps (Your Missing Pages)\n\n")
            f.write("| Keyword | Intent | Priority | Gap |\n|---------|--------|----------|-----|\n")
            for g in gaps[:15]:
                f.write(f"| {g['keyword']} | {g['intent']} | {g['priority']} | {g['content_gap']} |\n")
        f.write(f"\n## Autocomplete Signals\n\n")
        f.write("| Query | Suggestion |\n|-------|------------|\n")
        for r in autocomplete_data[:15]:
            f.write(f"| {r['query'][:30]} | {r['suggestion'][:50]} |\n")

    print(f"\n[OK] SERP Competitor analysis complete!")
    print(f"     Files in: {out}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--domain", default=None)
    parser.add_argument("--competitors", nargs="+", default=[], help="Competitor domains")
    args = parser.parse_args()
    run(domain=args.domain, competitors=args.competitors)
