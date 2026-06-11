# seosona-ignore-lang
#!/usr/bin/env python3
"""
SEOSONA OS — Full Audit Orchestrator v5.0
Runs all connectors in sequence with V5 enhancements:
  - Validation Loops: Every output is validated before acceptance
  - Fix Loops: Automatic retry with backoff on ALL connectors
  - Tool Registry: Standardized connector interface

Steps:
   1.  Data Cleanup      — Removes old CSV/MD files to ensure fresh data
   2.  PSI/CWV           — PageSpeed Insights + Core Web Vitals
   3.  Keywords           — Google Autocomplete expansion
   4.  SERP Competitor    — Competitor gap analysis (needs keywords)
   5.  Backlinks          — Open PageRank + Common Crawl
   6.  GSC                — Google Search Console pull
   7.  Rank Tracker       — Position buckets and quick wins (needs GSC)
   8.  GA4                — Google Analytics 4
   9.  Technical SEO      — robots, sitemap, redirects, on-page
  10.  Schema             — JSON-LD/Microdata validation
  11.  E-E-A-T            — Trust signals, content quality
  12.  Log Analyzer       — Bot crawl patterns
  13.  AEO / AI Search    — Answer Engine Optimization Readiness
  14.  Brand Context      — Load brand guidelines for personalized reports
  15.  Content Gap        — Keywords without content (from keyword + GSC data)
  16.  Dashboard          — Premium 13-Tab HTML Dashboard
  17.  Validation Report  — Validate all outputs with confidence scoring

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


def _run_connector(label, step, module_name, run_fn_name="run", skip=False, **kwargs):
    """
    Universal connector runner with fix loop integration.
    Wraps every connector call in retry-with-backoff and failure diagnosis.
    """
    if skip:
        return
    print("\n" + "=" * 65)
    print(f"{label} STEP {step}/17")
    print("=" * 65)
    try:
        from fix_loop import run_with_fix_loop
        import importlib
        mod = importlib.import_module(module_name)
        fn = getattr(mod, run_fn_name)
        result = run_with_fix_loop(label, fn, **kwargs)
        if not result.success:
            print(f"   ❌ {label} error after {result.total_attempts} attempts: {result.final_error}")
    except (Exception, SystemExit) as e:
        print(f"   ❌ {label} error: {e}")


def clean_old_data(domain):
    print("\n" + "=" * 65)
    print("🧹 STEP 1/17: Data Cleanup (Removing Old Files)")
    print("=" * 65)
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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--domain", default=None)
    parser.add_argument("--url", default=None)
    parser.add_argument("--days", type=int, default=90)
    parser.add_argument("--max-pages", type=int, default=15)
    parser.add_argument("--seeds", nargs="+", default=None)
    parser.add_argument("--clean", action="store_true", default=True, help="Clean old data before running (default: True)")

    for c in CONNECTORS:
        parser.add_argument(f"--skip-{c.replace('_', '-')}", action="store_true")

    args = parser.parse_args()
    config = load_config_safe()
    domain = args.domain or config["defaults"]["target_domain"]
    url = args.url or config["defaults"]["target_url"]

    print("==================================================================")
    print("  SEOSONA OS -- Full Website SEO Audit v5.0 (Validation & Fix Loops)")
    print(f"  Target: {domain} | Start: {datetime.now().strftime('%H:%M:%S')}")
    print("==================================================================\n")

    start_time = datetime.now()

    # ── Step 1: Cleanup ───────────────────────────────────────────────────────
    if args.clean:
        clean_old_data(domain)

    # ── Steps 2-13: Connector Execution (all with Fix Loops) ──────────────────
    _run_connector("⚡ PSI/CWV",           "2",  "psi_connector",            skip=getattr(args, "skip_psi", False),              domain=domain, url=url)
    _run_connector("🔑 Keywords",           "3",  "keyword_connector",        skip=getattr(args, "skip_keywords", False),         seeds=args.seeds, domain=domain)
    _run_connector("🕵️  SERP Competitor",    "4",  "serp_competitor",          skip=getattr(args, "skip_serp_competitor", False),  domain=domain)
    _run_connector("🔗 Backlinks",           "5",  "backlink_connector",       skip=getattr(args, "skip_backlinks", False),        domain=domain)
    _run_connector("📊 GSC",                 "6",  "gsc_connector",            skip=getattr(args, "skip_gsc", False),              domain=domain, days=args.days)
    _run_connector("📈 Rank Tracker",        "7",  "rank_tracker",             skip=getattr(args, "skip_rank_tracker", False),     domain=domain)
    _run_connector("📈 GA4",                 "8",  "ga4_connector",            skip=getattr(args, "skip_ga4", False),              domain=domain, days=args.days)
    _run_connector("🔩 Technical SEO",       "9",  "technical_seo_scanner",    skip=getattr(args, "skip_technical", False),        domain=domain, url=url, max_pages=args.max_pages)
    _run_connector("🏷️  Schema",             "10", "schema_validator",         skip=getattr(args, "skip_schema", False),           domain=domain, url=url)
    _run_connector("🏆 E-E-A-T",             "11", "eeat_analyzer",            skip=getattr(args, "skip_eeat", False),             domain=domain, url=url, max_pages=args.max_pages)
    _run_connector("📝 Log Analyzer",        "12", "log_analyzer",             skip=getattr(args, "skip_log_analyzer", False),     domain=domain, log_file=None)
    _run_connector("🤖 AEO / AI Search",     "13", "aeo_ai_search_analyzer",   skip=getattr(args, "skip_aeo", False),              domain=domain, url=url, max_pages=args.max_pages)

    # ── Step 14: Brand Context ────────────────────────────────────────────────
    print("\n" + "=" * 65)
    print("🏷️  STEP 14/17: Brand Context")
    print("=" * 65)
    brand_context = {}
    try:
        from brand_context import load_brand_guidelines
        brand_context = load_brand_guidelines()
        if not brand_context.get("loaded"):
            print("   [INFO] No brand_guidelines.md found. Reports will use generic defaults.")
            print(f"   [HINT] Copy 3_MEMORY/specs/brand_guidelines_template.md to brand_guidelines.md")
    except ImportError:
        print("   [WARN] brand_context.py not found — skipping brand injection")

    # ── Step 15: Content Gap Analysis ─────────────────────────────────────────
    print("\n" + "=" * 65)
    print("📊 STEP 15/17: Content Gap Analysis")
    print("=" * 65)
    try:
        import csv
        out_dir = ROOT / "3_MEMORY" / "seo_exports" / domain

        kw_files = list(out_dir.glob("keyword_research_*_autocomplete.csv"))
        gsc_files = list(out_dir.glob("gsc_report_*.csv"))

        if kw_files and gsc_files:
            all_keywords = set()
            with open(kw_files[0], encoding="utf-8") as f:
                for row in csv.DictReader(f):
                    kw = row.get("keyword", "").strip().lower()
                    if kw:
                        all_keywords.add(kw)

            ranking_keywords = set()
            with open(gsc_files[0], encoding="utf-8") as f:
                for row in csv.DictReader(f):
                    kw = row.get("query", "").strip().lower()
                    if kw:
                        ranking_keywords.add(kw)

            gaps = all_keywords - ranking_keywords
            gap_file = out_dir / f"content_gap_{domain.replace('.', '-')}_{datetime.now().strftime('%Y-%m-%d')}.csv"
            with open(gap_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["keyword", "status"])
                for kw in sorted(gaps):
                    writer.writerow([kw, "no_content"])
            print(f"   [OK] Content gap analysis: {len(gaps)} keywords without content -> {gap_file.name}")
        else:
            print("   [SKIP] Need both keyword_research and gsc_report files. Run Steps 3 and 6 first.")
    except (Exception, SystemExit) as e:
        print(f"   [WARN] Content gap analysis failed: {e}")

     # ── Step 16: Dashboard ────────────────────────────────────────────────────
    _run_connector("🌐 Dashboard v4", "16", "dashboard_generator_v4", skip=False, domain=domain)

    # ── Step 17: Validation Report ────────────────────────────────────────────
    print("\n" + "=" * 65)
    print("🔍 STEP 17/18: Output Validation")
    print("=" * 65)
    validation_data = None
    try:
        from audit_validator import print_validation_report
        validation = print_validation_report(domain)
        validation_data = validation
    except Exception as e:
        print(f"   ⚠️ Validation skipped: {e}")

    # ── Step 18: Session Memory ───────────────────────────────────────────────
    print("\n" + "=" * 65)
    print("💾 STEP 18/18: Session Memory Recording")
    print("=" * 65)
    try:
        sys.path.insert(0, str(ROOT / "1_CORE" / "scripts"))
        from session_memory import SessionMemory
        memory = SessionMemory(domain)

        # Load previous session context
        latest = memory.get_latest_session()
        if latest:
            print(f"   [MEMORY] Previous session: {latest.get('date', 'N/A')} "
                  f"(status: {latest.get('metrics', {}).get('overall_status', 'N/A')})")
        else:
            print(f"   [MEMORY] First audit session for {domain}")

        # Record this session
        report_data = None
        if validation_data and isinstance(validation_data, dict):
            # Load the validation JSON report
            report_path = ROOT / "3_MEMORY" / "seo_exports" / domain / f"validation_report_{domain}.json"
            if report_path.exists():
                import json as json_mod
                report_data = json_mod.loads(report_path.read_text(encoding="utf-8"))

        session_id = memory.record_session(
            validation_report=report_data,
            notes=f"Full audit via orchestrator v5.0",
        )
        print(f"   [OK] Session recorded: {session_id}")
        print(f"   [OK] Sessions directory: 3_MEMORY/sessions/{domain.replace('.', '-')}/")
    except Exception as e:
        print(f"   ⚠️ Session memory skipped: {e}")

    elapsed = (datetime.now() - start_time).seconds
    print(f"\n✅ FULL AUDIT COMPLETE IN {elapsed // 60}m {elapsed % 60}s")
    print(f"📊 Dashboard:    3_MEMORY/seo_exports/{domain}/seo_dashboard_v4_{domain}.html")
    print(f"📋 Content gaps: 3_MEMORY/seo_exports/{domain}/content_gap_*.csv")
    print(f"🔍 Validation:   3_MEMORY/seo_exports/{domain}/validation_report_{domain}.json")
    print(f"💾 Sessions:     3_MEMORY/sessions/{domain.replace('.', '-')}/")
    if brand_context.get("name"):
        print(f"🏷️  Brand loaded: {brand_context['name']}")

    print("\n" + "=" * 65)
    print("🤖 NEXT STEP: To perform a Deep Analysis (CRO, Psychology, Funnel),")
    print("   type '/grand-audit' or 'phan tich website' in the AI chat.")
    print("=" * 65)
    print()


if __name__ == "__main__":
    main()

