#!/usr/bin/env python3
"""
SEOSONA OS -- Setup Health Check
Checks which APIs are configured and tests each connection.
Run this at any time to see exactly what is working.

Usage:
    python 1_CORE/scripts/setup_check.py
"""
import json
import sys
import urllib.request
import ssl
import os
from pathlib import Path

# Fix Windows console encoding
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if sys.platform == "win32":
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).parent.parent.parent
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"
ENV_PATH = ROOT / "1_CONFIG" / ".env"

# Secure SSL context — uses the system's trusted CA store.
# NEVER disable check_hostname or set CERT_NONE for production API calls.
CTX = ssl.create_default_context()

def load_env_file():
    if not ENV_PATH.exists():
        return
    with open(ENV_PATH, encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def env_value(key, default=""):
    return os.environ.get(key, default).strip()


def is_configured(value):
    if value is None:
        return False
    text = str(value).strip()
    return bool(text) and text not in {"''", '""'} and "YOUR_" not in text and text != "USE_SECRETS_MANAGER"


def resolve_local_path(value):
    path = Path(value)
    return path if path.is_absolute() else ROOT / path


load_env_file()

# ---- Output helpers (ASCII-safe) ----------------------------------------
def ok(msg):   print(f"  [OK] {msg}")
def warn(msg): print(f"  [!!] {msg}")
def err(msg):  print(f"  [XX] {msg}")
def info(msg): print(f"       --> {msg}")
def header(n, title): print(f"\n[{n}] {title}")
def sep(): print("=" * 62)

# ---- Checks -----------------------------------------------------------------

def check_internet():
    header(1, "Internet connectivity")
    try:
        req = urllib.request.Request(
            "https://www.google.com",
            headers={"User-Agent": "SEOSONA-SetupCheck/1.0"}
        )
        urllib.request.urlopen(req, timeout=8, context=CTX)
        ok("Internet connection OK")
        return True
    except Exception as e:
        err(f"No internet: {e}")
        return False


def check_python_packages():
    header(2, "Python packages")
    required = {
        "google.oauth2":         ("google-auth",               "Required for GSC + GA4"),
        "googleapiclient":       ("google-api-python-client",  "Required for GSC"),
        "google.analytics.data": ("google-analytics-data",     "Required for GA4"),
    }
    all_ok = True
    for module, (package, desc) in required.items():
        try:
            __import__(module)
            ok(f"{package} -- installed")
        except ImportError:
            warn(f"{package} -- NOT installed ({desc})")
            info(f"Install: pip install {package}")
            all_ok = False
    return all_ok


def check_config():
    header(3, "Configuration file (config.json)")
    if not CONFIG_PATH.exists():
        err(f"config.json not found: {CONFIG_PATH}")
        info("Run: Copy-Item 3_MEMORY\\specs\\config_template.json 3_MEMORY\\specs\\config.json")
        return None
    ok(f"config.json found: {CONFIG_PATH}")
    try:
        with open(CONFIG_PATH, encoding="utf-8") as f:
            config = json.load(f)
        ok(f"Target domain: {config.get('defaults', {}).get('target_domain', '?')}")
        return config
    except Exception as e:
        err(f"config.json is not valid JSON: {e}")
        return None


def check_pagespeed(config):
    header(4, "PageSpeed Insights API (Core Web Vitals)")
    if not config:
        err("No config -- skipping")
        return False

    key = env_value("PAGESPEED_API_KEY") or config.get("google_apis", {}).get("pagespeed_api_key", "")
    if not is_configured(key):
        warn("GCP API Key not configured")
        info("Setup (5 min):")
        print("       1. https://console.cloud.google.com")
        print("       2. APIs & Services > Library > 'PageSpeed Insights API' > Enable")
        print("       3. Credentials > Create Credentials > API Key > copy key")
        print("       4. Set PAGESPEED_API_KEY in 1_CONFIG/.env")
        return False

    domain = config.get("defaults", {}).get("target_domain", "example.com")
    url = (f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
           f"?url=https://{domain}&key={key}&strategy=mobile")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "SEOSONA/1.0"})
        with urllib.request.urlopen(req, timeout=20, context=CTX) as resp:
            data = json.loads(resp.read())
            score = (data.get("lighthouseResult", {})
                        .get("categories", {})
                        .get("performance", {})
                        .get("score", 0))
            ok(f"PageSpeed API working -- Performance score: {int(score*100)}/100")
            return True
    except Exception as e:
        err_str = str(e)
        if "400" in err_str or "403" in err_str:
            err(f"API Key invalid or quota exceeded: {e}")
        else:
            err(f"PageSpeed API error: {e}")
        return False


def check_gsc(config):
    header(5, "Google Search Console (GSC)")
    if not config:
        err("No config -- skipping")
        return False

    sa_path_str = env_value("GOOGLE_APPLICATION_CREDENTIALS") or config.get("gsc", {}).get("service_account_path", "")
    sa_b64 = env_value("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64")
    if not is_configured(sa_path_str) and not is_configured(sa_b64):
        warn("Service Account not configured")
        info("Setup (15 min):")
        print("       1. https://console.cloud.google.com")
        print("          IAM & Admin > Service Accounts > Create > download JSON")
        print("          Save credentials in 1_CONFIG/.env")
        print("       2. https://search.google.com/search-console")
        print("          Settings > Users > Add > paste service account email > Full")
        print("       3. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_JSON_BASE64")
        return False

    sa_path = resolve_local_path(sa_path_str) if is_configured(sa_path_str) else None
    if not sa_path or not sa_path.exists():
        if is_configured(sa_b64):
            ok("Service Account JSON found in 1_CONFIG/.env")
            return True
        warn(f"Service Account file not found: {sa_path}")
        info("Download JSON from GCP > save to the path above")
        return False

    try:
        with open(sa_path, encoding="utf-8") as f:
            sa_data = json.load(f)
        client_email = sa_data.get("client_email", "unknown")
        ok(f"Service Account file found -- email: {client_email}")
        try:
            from google.oauth2 import service_account
            service_account.Credentials.from_service_account_file(
                str(sa_path),
                scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
            )
            ok("GSC credentials loaded successfully -- ready to run")
            return True
        except ImportError:
            warn("google-auth not installed")
            info("Run: pip install google-auth google-api-python-client")
            return False
        except Exception as e:
            err(f"GSC credential error: {e}")
            return False
    except Exception as e:
        err(f"Cannot read Service Account file: {e}")
        return False


def check_ga4(config):
    header(6, "Google Analytics 4 (GA4)")
    if not config:
        err("No config -- skipping")
        return False

    prop_id = env_value("GA4_PROPERTY_ID") or config.get("ga4", {}).get("property_id", "")
    if not is_configured(prop_id):
        warn("GA4 Property ID not configured")
        info("Setup (5 min):")
        print("       1. https://analytics.google.com")
        print("          Admin > Property Settings > Property ID  (numbers only)")
        print("       2. Admin > Account Access Management > Add service account email > Viewer")
        print("       3. Set GA4_PROPERTY_ID in 1_CONFIG/.env")
        return False

    ok(f"GA4 Property ID: {prop_id}")
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        ok("google-analytics-data package installed -- ready to run")
        return True
    except ImportError:
        warn("google-analytics-data NOT installed")
        info("Run: pip install google-analytics-data")
        return False


def check_open_pagerank(config):
    header(7, "Open PageRank API (Domain Authority)")
    if not config:
        err("No config -- skipping")
        return False

    key = env_value("OPEN_PAGERANK_KEY") or config.get("open_pagerank", {}).get("api_key", "")
    if not is_configured(key):
        warn("Open PageRank key not configured")
        info("Setup (2 min): https://www.domainpagerank.com > Sign up > Dashboard > API Key")
        info("Set OPEN_PAGERANK_KEY in 1_CONFIG/.env")
        return False

    domain = config.get("defaults", {}).get("target_domain", "example.com")
    url = f"https://openpagerank.com/api/v1.0/getPageRank?domains[]={domain}"
    try:
        req = urllib.request.Request(
            url, headers={"API-OPR": key, "User-Agent": "SEOSONA/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10, context=CTX) as resp:
            data = json.loads(resp.read())
            opr = data.get("response", [{}])[0].get("page_rank_decimal", "N/A")
            ok(f"Open PageRank API connected -- {domain} OPR score: {opr}")
            return True
    except Exception as e:
        err(f"Open PageRank error: {e}")
        return False


def check_free_connectors(config):
    header(8, "Free connectors (no API key required)")
    domain = config.get("defaults", {}).get("target_domain", "example.com") if config else "example.com"
    url = f"https://{domain}/"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "SEOSONA/1.0"})
        with urllib.request.urlopen(req, timeout=10, context=CTX) as resp:
            ok(f"Target site reachable: {url} (HTTP {resp.status})")
    except Exception as e:
        err(f"Cannot reach {url}: {e}")

    connector_dir = ROOT / "1_CORE" / "scripts" / "connectors"
    connectors = [
        "technical_seo_scanner.py",
        "schema_validator.py",
        "eeat_analyzer.py",
        "keyword_connector.py",
        "dashboard_generator_v4.py",
    ]
    for c in connectors:
        if (connector_dir / c).exists():
            ok(f"{c} -- ready")
        else:
            err(f"{c} -- MISSING (run git pull)")


def print_summary(results):
    print(f"\n{'='*62}")
    print(" SETUP SUMMARY")
    print(f"{'='*62}")

    labels = {
        "internet":      "Internet connection",
        "packages":      "Python packages (google-auth etc.)",
        "config":        "config.json",
        "pagespeed":     "PageSpeed Insights API  -- Core Web Vitals",
        "gsc":           "Google Search Console   -- rankings, CTR",
        "ga4":           "Google Analytics 4      -- sessions, channels",
        "open_pagerank": "Open PageRank           -- domain authority",
    }

    ready = [label for key, label in labels.items() if results.get(key) is True]
    not_ready = [label for key, label in labels.items() if results.get(key) is False]

    print(f"\nREADY ({len(ready)}):")
    for r in ready:
        print(f"  [OK] {r}")

    print(f"\nACTION REQUIRED ({len(not_ready)}):")
    for r in not_ready:
        print(f"  [!!] {r}")

    print(f"\nRun NOW (zero setup):")
    print(f"  python 1_CORE/scripts/run_full_audit.py --domain example.com --skip-psi --skip-gsc --skip-ga4 --skip-backlinks")
    print(f"  Runs: Technical SEO + Schema + E-E-A-T + Keywords + Dashboard\n")

    if any(results.get(k) is False for k in ["gsc","ga4","pagespeed","open_pagerank"]):
        print("To unlock additional data sources:")
        if results.get("gsc") is False:
            print("  GSC  (~15 min) -> real ranking positions, CTR, impressions, AI Overviews")
        if results.get("ga4") is False:
            print("  GA4  (~ 5 min) -> sessions, channel breakdown, conversion tracking")
        if results.get("pagespeed") is False:
            print("  PSI  (~ 5 min) -> Core Web Vitals: LCP, INP, CLS (real user data)")
        if results.get("open_pagerank") is False:
            print("  OPR  (~ 2 min) -> Domain authority score from Open PageRank")
    print()


def main():
    print(f"\n{'='*62}")
    print(" SEOSONA OS -- Setup Health Check")
    print(f"{'='*62}")
    print(f"  Config: {CONFIG_PATH}\n")

    results = {}
    results["internet"]      = check_internet()
    results["packages"]      = check_python_packages()
    config                   = check_config()
    results["config"]        = config is not None
    results["pagespeed"]     = check_pagespeed(config)
    results["gsc"]           = check_gsc(config)
    results["ga4"]           = check_ga4(config)
    results["open_pagerank"] = check_open_pagerank(config)
    check_free_connectors(config)
    print_summary(results)


if __name__ == "__main__":
    main()
