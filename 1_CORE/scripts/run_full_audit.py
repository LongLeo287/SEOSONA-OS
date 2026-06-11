# seosona-ignore-lang
#!/usr/bin/env python3
"""
SEOSONA OS — Full Audit Orchestrator v5.0
Runs all connectors in sequence with V5 enhancements:
  - Validation Loops: Every output is validated before acceptance
  - Fix Loops: Automatic retry with backoff on failures
  - Tool Registry: Standardized connector interface

Modules:
  1.  Data Cleanup     — Removes old CSV/MD files to ensure fresh data
  2.  PSI/CWV          — PageSpeed Insights + Core Web Vitals
  3.  Keywords         — Google Autocomplete expansion
  4.  SERP Competitor  — Competitor gap analysis (needs keywords)
  5.  Backlinks        — Open PageRank + Common Crawl
  6.  GSC              — Google Search Console pull
  7.  Rank Tracker     — Position buckets and quick wins (needs GSC)
  8.  GA4              — Google Analytics 4
  9.  Technical SEO    — robots, sitemap, redirects, on-page
 10.  Schema           — JSON-LD/Microdata validation
  11.  E-E-A-T          — Trust signals, content quality
 12.  Log Analyzer     — Bot crawl patterns
 13.  AEO / AI Search  — Answer Engine Optimization Readiness (NEW V4)
 14.  Brand Context    — Load brand guidelines for personalized reports
 15.  Content Gap      — Keywords without content (from keyword + GSC data)
 16.  Dashboard        — Premium 13-Tab HTML Dashboard

Usage:
  python 1_CORE/scripts/run_full_audit.py --domain yourdomain.com --clean
  python 1_CORE/scripts/run_full_audit.py --domain yourdomain.com --skip-log-analyzer
"""

import sys, os, argparse, json, shutil
from datetime import datetime
from pathlib import Path

os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(ROOT / "1_CORE" / "scripts" / "connectors"))
sys.path.insert(0, str(ROOT / "1_CORE" / "scripts" / "validators"))

CONNECTORS = [
    "psi", "keywords", "serp_competitor", "backlinks", "gsc", 
    "rank_tracker", "ga4", "technical", "schema", "eeat", "log_analyzer", "aeo"
]

def load_config_safe():
    config_path = ROOT / "3_MEMORY" / "specs" / "config.json"
    if not config_path.exists():
        return {"defaults": {"target_domain": "", "target_url": "", "output_dir": "3_MEMORY/seo_exports"}}
    with open(config_path) as f:
        return json.load(f)

def clean_old_data(domain):
    print("\n" + "="*65)
    print("🧹 STEP 1/13: Data Cleanup (Removing Old Files)")
    print("="*65)
    out_dir = ROOT / "3_MEMORY" / "seo_exports" / domain
    if not out_dir.exists():
        print("   [OK] Directory does not exist yet. No cleanup needed.")
        return
    
    count = 0
    for f in out_dir.iterdir():
        if f.is_file() and f.suffix in [".csv", ".md", ".html", ".json"]:
            f.unlink()
            count += 1
    print(f"   [OK] Deleted {count} old data files to ensure fresh analysis.")

def run_psi(domain, url, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("⚡ STEP 2/13: PageSpeed Insights + Core Web Vitals")
    print("="*65)
    try:
        from fix_loop import run_with_fix_loop
        import psi_connector
        result = run_with_fix_loop("PSI/CWV", psi_connector.run, domain=domain, url=url)
        if not result.success:
            print(f"   ❌ PSI error after {result.total_attempts} attempts: {result.final_error}")
    except (Exception, SystemExit) as e: print(f"   ❌ PSI error: {e}")

def run_keywords(domain, seeds=None, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("🔑 STEP 3/13: Keyword Research")
    print("="*65)
    try:
        from fix_loop import run_with_fix_loop
        import keyword_connector
        result = run_with_fix_loop("Keywords", keyword_connector.run, seeds=seeds, domain=domain)
        if not result.success:
            print(f"   ❌ Keywords error after {result.total_attempts} attempts: {result.final_error}")
    except (Exception, SystemExit) as e: print(f"   ❌ Keywords error: {e}")

def run_serp_competitor(domain, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("🕵️  STEP 4/13: SERP Competitor Analyzer")
    print("="*65)
    try: import serp_competitor; serp_competitor.run(domain=domain)
    except (Exception, SystemExit) as e: print(f"   ❌ SERP Competitor error: {e}")

def run_backlinks(domain, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("🔗 STEP 5/13: Backlink Intelligence")
    print("="*65)
    try: import backlink_connector; backlink_connector.run(domain=domain)
    except (Exception, SystemExit) as e: print(f"   ❌ Backlinks error: {e}")

def run_gsc(domain, days=90, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("📊 STEP 6/13: Google Search Console")
    print("="*65)
    try: import gsc_connector; gsc_connector.run(domain=domain, days=days)
    except (Exception, SystemExit) as e: print(f"   ❌ GSC error: {e}")

def run_rank_tracker(domain, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("📈 STEP 7/13: Rank Tracker")
    print("="*65)
    try: import rank_tracker; rank_tracker.run(domain=domain)
    except (Exception, SystemExit) as e: print(f"   ❌ Rank Tracker error: {e}")

def run_ga4(domain, days=90, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("📈 STEP 8/13: Google Analytics 4")
    print("="*65)
    try: import ga4_connector; ga4_connector.run(domain=domain, days=days)
    except (Exception, SystemExit) as e: print(f"   ❌ GA4 error: {e}")

def run_technical(domain, url, max_pages=20, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("🔩 STEP 9/13: Technical SEO Deep Scan")
    print("="*65)
    try: import technical_seo_scanner; technical_seo_scanner.run(domain=domain, url=url, max_pages=max_pages)
    except (Exception, SystemExit) as e: print(f"   ❌ Technical scan error: {e}")

def run_schema(domain, url, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("🏷️  STEP 10/13: Schema.org Validation")
    print("="*65)
    try: import schema_validator; schema_validator.run(domain=domain, url=url)
    except (Exception, SystemExit) as e: print(f"   ❌ Schema error: {e}")

def run_eeat(domain, url, max_pages=25, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("🏆 STEP 11/13: E-E-A-T + Content Quality")
    print("="*65)
    try: import eeat_analyzer; eeat_analyzer.run(domain=domain, url=url, max_pages=max_pages)
    except (Exception, SystemExit) as e: print(f"   ❌ E-E-A-T error: {e}")

def run_log_analyzer(domain, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("📝 STEP 12/14: Log Analyzer (Bot Crawls)")
    print("="*65)
    try:
        import log_analyzer
        # log_file=None: analyzer will print usage hint and return gracefully
        log_analyzer.run(domain=domain, log_file=None)
    except (Exception, SystemExit) as e: print(f"   ❌ Log Analyzer error: {e}")

def run_aeo(domain, url, max_pages=10, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("🤖 STEP 13/14: AEO & AI Search Readiness")
    print("="*65)
    try: import aeo_ai_search_analyzer; aeo_ai_search_analyzer.run(domain=domain, url=url, max_pages=max_pages)
    except (Exception, SystemExit) as e: print(f"   ❌ AEO error: {e}")

def run_dashboard(domain, skip=False):
    if skip: return
    print("\n" + "="*65)
    print("🌐 STEP 13/13: Generating Premium Dashboard (v4)")
    print("="*65)
    try: import dashboard_generator_v4 as dashboard_generator; dashboard_generator.run(domain=domain)
    except (Exception, SystemExit) as e: print(f"   ❌ Dashboard error: {e}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--domain", default=None)
    parser.add_argument("--url", default=None)
    parser.add_argument("--days", type=int, default=90)
    parser.add_argument("--max-pages", type=int, default=15)
    parser.add_argument("--seeds", nargs="+", default=None)
    parser.add_argument("--clean", action="store_true", default=True, help="Clean old data before running (default: True)")
    
    for c in CONNECTORS:
        parser.add_argument(f"--skip-{c.replace('_','-')}", action="store_true")
    
    args = parser.parse_args()
    config = load_config_safe()
    domain = args.domain or config["defaults"]["target_domain"]
    url = args.url or config["defaults"]["target_url"]

    print("==================================================================")
    print("  SEOSONA OS -- Full Website SEO Audit v5.0 (with Validation & Fix Loops)")
    print(f"  Target: {domain} | Start: {datetime.now().strftime('%H:%M:%S')}")
    print("==================================================================\n")

    start_time = datetime.now()

    if args.clean:
        clean_old_data(domain)

    run_psi(domain, url, skip=getattr(args, "skip_psi", False))
    run_keywords(domain, args.seeds, skip=getattr(args, "skip_keywords", False))
    run_serp_competitor(domain, skip=getattr(args, "skip_serp_competitor", False))
    run_backlinks(domain, skip=getattr(args, "skip_backlinks", False))
    run_gsc(domain, args.days, skip=getattr(args, "skip_gsc", False))
    run_rank_tracker(domain, skip=getattr(args, "skip_rank_tracker", False))
    run_ga4(domain, args.days, skip=getattr(args, "skip_ga4", False))
    run_technical(domain, url, args.max_pages, skip=getattr(args, "skip_technical", False))
    run_schema(domain, url, skip=getattr(args, "skip_schema", False))
    run_eeat(domain, url, args.max_pages, skip=getattr(args, "skip_eeat", False))
    run_log_analyzer(domain, skip=getattr(args, "skip_log_analyzer", False))
    run_aeo(domain, url, args.max_pages, skip=getattr(args, "skip_aeo", False))

    # ── Step 14: Brand Context ────────────────────────────────────────────────
    print("\n" + "="*65)
    print("🏷️  STEP 14/16: Brand Context")
    print("="*65)
    brand_context = {}
    try:
        from brand_context import load_brand_guidelines
        brand_context = load_brand_guidelines()
        if not brand_context.get("loaded"):
            print("   [INFO] No brand_guidelines.md found. Reports will use generic defaults.")
            print(f"   [HINT] Copy 3_MEMORY/specs/brand_guidelines_template.md to brand_guidelines.md")
    except ImportError:
        print("   [WARN] brand_context.py not found — skipping brand injection")

    # ── Step 15: Content Gap Analysis ────────────────────────────────────────
    print("\n" + "="*65)
    print("📊 STEP 15/16: Content Gap Analysis")
    print("="*65)
    try:
        import csv
        import glob
        out_dir = ROOT / "3_MEMORY" / "seo_exports" / domain

        # Load keywords from autocomplete
        kw_files = list(out_dir.glob("keyword_research_*_autocomplete.csv"))
        gsc_files = list(out_dir.glob("gsc_report_*.csv"))

        if kw_files and gsc_files:
            # Get keywords from autocomplete
            all_keywords = set()
            with open(kw_files[0], encoding="utf-8") as f:
                for row in csv.DictReader(f):
                    kw = row.get("keyword", "").strip().lower()
                    if kw:
                        all_keywords.add(kw)

            # Get keywords already ranking in GSC
            ranking_keywords = set()
            with open(gsc_files[0], encoding="utf-8") as f:
                for row in csv.DictReader(f):
                    kw = row.get("query", "").strip().lower()
                    if kw:
                        ranking_keywords.add(kw)

            # Gaps = keywords found in research but NOT in GSC
            gaps = all_keywords - ranking_keywords
            gap_file = out_dir / f"content_gap_{domain.replace('.', '-')}_{datetime.now().strftime('%Y-%m-%d')}.csv"
            with open(gap_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["keyword", "status"])
                for kw in sorted(gaps):
                    writer.writerow([kw, "no_content"])
            print(f"   [OK] Content gap analysis: {len(gaps)} keywords without content → {gap_file.name}")
        else:
            print("   [SKIP] Need both keyword_research and gsc_report files. Run Steps 3 and 6 first.")
    except (Exception, SystemExit) as e:
        print(f"   [WARN] Content gap analysis failed: {e}")

    # ── Step 16: Dashboard ────────────────────────────────────────────────────
    run_dashboard(domain)

    # ── Step 17: Validation Report ────────────────────────────────────────────
    print("\n" + "="*65)
    print("🔍 STEP 17/17: Output Validation")
    print("="*65)
    try:
        from audit_validator import print_validation_report
        validation = print_validation_report(domain)
    except Exception as e:
        print(f"   ⚠️ Validation skipped: {e}")

    elapsed = (datetime.now() - start_time).seconds
    print(f"\n✅ FULL AUDIT COMPLETE IN {elapsed//60}m {elapsed%60}s")
    print(f"📊 Dashboard:    3_MEMORY/seo_exports/{domain}/seo_dashboard_v4_{domain}.html")
    print(f"📋 Content gaps: 3_MEMORY/seo_exports/{domain}/content_gap_*.csv")
    if brand_context.get("name"):
        print(f"🏷️  Brand loaded: {brand_context['name']}")
    
    print("\n" + "="*65)
    print("🤖 NEXT STEP: To perform a Deep Analysis (CRO, Psychology, Funnel),")
    print("   type '/grand-audit' or 'phân tích website' in the AI chat.")
    print("="*65)
    print()

if __name__ == "__main__":
    main()
