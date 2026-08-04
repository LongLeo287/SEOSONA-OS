# seosona-ignore-lang
#!/usr/bin/env python3
"""
SEOSONA OS — Keyword Research Connector
Sources: Google Autocomplete (free) + Google PAA scraper + Reddit (free)
Zero cost. No API keys required.
"""

import json
import csv
import sys
import urllib.request
import urllib.parse
import time
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent.parent
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"

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
            print(f"[XX] Config not found: {CONFIG_PATH}")
            print("     Copy 3_MEMORY/specs/config_template.json -> config.json and fill in values")
            sys.exit(1)
        with open(CONFIG_PATH, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        print(f"[!] config.json unreadable ({e}); using defaults.")
        return {"defaults": {"target_domain": "", "target_url": "",
                             "output_dir": "3_MEMORY/seo_exports"}}

# ── Google Autocomplete ───────────────────────────────────────────────────────

def google_autocomplete(query, lang="vi", country="vn"):
    """Completely free — no API key needed"""
    url = f"https://suggestqueries.google.com/complete/search?client=firefox&q={urllib.parse.quote(query)}&hl={lang}&gl={country}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with safe_urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        return data[1] if len(data) > 1 else []
    except Exception as e:
        return []

def expand_with_alphabet(seed, lang="vi"):
    """Expand seed keyword with A-Z modifiers → long-tail discovery"""
    print(f"   📡 Autocomplete expansion: '{seed}'")
    all_suggestions = set()

    # Direct seed
    for s in google_autocomplete(seed, lang):
        all_suggestions.add(s)
    time.sleep(0.3)

    # Seed + question words (high-value for AEO)
    question_prefixes = ["cách", "làm sao", "tại sao", "có nên", "loại nào tốt", "nên chọn",
                         "bao nhiêu tiền", "mua ở đâu", "so sánh", "vs", "review", "tốt nhất"]
    for prefix in question_prefixes:
        query = f"{seed} {prefix}"
        for s in google_autocomplete(query, lang):
            all_suggestions.add(s)
        time.sleep(0.2)

    # Alphabet modifiers for deepest expansion
    for char in "abcđghklmnopqrstuv":
        query = f"{seed} {char}"
        for s in google_autocomplete(query, lang):
            all_suggestions.add(s)
        time.sleep(0.15)

    print(f"   ✅ Got {len(all_suggestions)} keyword suggestions")
    return list(all_suggestions)

def classify_intent(keyword):
    """Simple intent classification based on keyword signals"""
    kw = keyword.lower()
    transactional = ["mua", "giá", "rẻ", "khuyến mãi", "sale", "shop", "order",
                     "buy", "price", "cheap", "discount", "store"]
    informational = ["là gì", "cách", "hướng dẫn", "tại sao", "như thế nào",
                     "what is", "how to", "why", "guide", "tutorial"]
    commercial = ["tốt nhất", "review", "đánh giá", "so sánh", "vs", "nên chọn",
                  "best", "top", "compare", "alternative", "recommend"]
    navigational = ["pgi", "website", "địa chỉ", "hotline", "official"]

    for t in transactional:
        if t in kw: return "Transactional"
    for c in commercial:
        if c in kw: return "Commercial"
    for i in informational:
        if i in kw: return "Informational"
    for n in navigational:
        if n in kw: return "Navigational"
    return "Mixed"

def estimate_priority(keyword, intent, domain_keywords=None):
    """Priority heuristic based on intent and keyword signals"""
    kw = keyword.lower()
    if domain_keywords:
        for dk in domain_keywords:
            if dk.lower() in kw and intent == "Transactional":
                return "P0"
    if intent == "Transactional": return "P1"
    if intent == "Commercial": return "P1"
    if intent == "Informational": return "P2"
    return "P3"

def run(seeds=None, domain=None):
    config = load_config()
    if not domain:
        domain = config["defaults"]["target_domain"]

    # Default seeds: pulled from config.json "defaults.seed_keywords" if present,
    # else use generic cross-domain defaults that cover most e-commerce niches.
    if not seeds:
        seeds = config.get("defaults", {}).get("seed_keywords", [
            "sản phẩm chính hãng", "mua online", "so sánh giá",
            "review sản phẩm", "khách hàng đánh giá",
            "best product", "top rated", "how to choose",
        ])

    domain_brands = config.get("defaults", {}).get("brand_keywords", [])

    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = ROOT / config["defaults"]["output_dir"] / domain
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n🚀 SEOSONA Keyword Research — {domain}")
    print(f"   Seeds: {len(seeds)} keywords\n")

    all_keywords = {}

    for seed in seeds:
        print(f"\n🔍 Expanding: '{seed}'")
        suggestions = expand_with_alphabet(seed)
        for kw in suggestions:
            if kw not in all_keywords:
                intent = classify_intent(kw)
                priority = estimate_priority(kw, intent, domain_brands)
                all_keywords[kw] = {
                    "keyword": kw,
                    "seed": seed,
                    "intent": intent,
                    "priority": priority,
                    "est_volume": "Est: Unknown (use GSC for real data)",
                    "difficulty": "Unknown",
                    "content_gap_note": f"Expanded from: {seed}"
                }

    print(f"\n📊 Total unique keywords discovered: {len(all_keywords)}")

    # Sort by priority
    priority_order = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}
    sorted_kws = sorted(all_keywords.values(),
                        key=lambda x: priority_order.get(x["priority"], 4))

    # Write CSV
    csv_path = output_dir / f"keyword_research_{domain}_{date_str}_autocomplete.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["keyword", "group", "intent", "est_volume_month",
                         "difficulty", "priority", "current_rank",
                         "content_gap_note", "seed_keyword"])
        for kw in sorted_kws:
            writer.writerow([
                kw["keyword"], kw["seed"], kw["intent"],
                kw["est_volume"], kw["difficulty"], kw["priority"],
                "Unknown (connect GSC)", kw["content_gap_note"], kw["seed"]
            ])
    print(f"💾 Saved keyword CSV: {csv_path}")

    # Write summary MD
    by_intent = {}
    for kw in sorted_kws:
        intent = kw["intent"]
        by_intent.setdefault(intent, []).append(kw["keyword"])

    by_priority = {}
    for kw in sorted_kws:
        p = kw["priority"]
        by_priority.setdefault(p, []).append(kw["keyword"])

    md_path = output_dir / f"keyword_research_{domain}_{date_str}_autocomplete.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Keyword Research Report — {domain}\n")
        f.write(f"> Source: Google Autocomplete (Free) | Date: {date_str} | SEOSONA OS\n")
        f.write(f"> Total keywords: {len(all_keywords)} | Seeds: {len(seeds)}\n\n---\n\n")

        f.write("## Summary by Priority\n\n")
        for p in ["P0", "P1", "P2", "P3"]:
            kws = by_priority.get(p, [])
            f.write(f"**{p}:** {len(kws)} keywords\n")
        f.write("\n---\n\n")

        f.write("## Summary by Intent\n\n")
        f.write("| Intent | Count | Examples |\n|--------|-------|----------|\n")
        for intent, kws in by_intent.items():
            examples = ", ".join(kws[:3])
            f.write(f"| {intent} | {len(kws)} | {examples}... |\n")

        f.write("\n---\n\n## P0 — Immediate Action Keywords\n\n")
        for kw in by_priority.get("P0", [])[:20]:
            f.write(f"- `{kw}`\n")

        f.write("\n## P1 — High Priority Keywords (Top 30)\n\n")
        for kw in by_priority.get("P1", [])[:30]:
            f.write(f"- `{kw}`\n")

        f.write("\n## Transactional Keywords (Top 20 — Highest Converting)\n\n")
        for kw in by_intent.get("Transactional", [])[:20]:
            f.write(f"- `{kw}`\n")

        f.write("\n## Informational / AEO Keywords (Top 20 — Blog Content)\n\n")
        for kw in by_intent.get("Informational", [])[:20]:
            f.write(f"- `{kw}`\n")

        f.write(f"\n---\n*SEOSONA OS — seo_keyword_research skill | Source: Google Autocomplete (free)*\n")
        f.write(f"*Note: Volume data requires GSC (real data) or Google Ads Keyword Planner*\n")

    print(f"💾 Saved keyword MD: {md_path}")
    print(f"\n✅ Keyword research complete!")
    print(f"   P0: {len(by_priority.get('P0',[]))} | P1: {len(by_priority.get('P1',[]))}")
    print(f"   Transactional: {len(by_intent.get('Transactional',[]))} | Informational: {len(by_intent.get('Informational',[]))}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Keyword Research Connector")
    parser.add_argument("--domain", default=None)
    parser.add_argument("--seeds", nargs="+", default=None, help="Seed keywords")
    args = parser.parse_args()
    run(seeds=args.seeds, domain=args.domain)
