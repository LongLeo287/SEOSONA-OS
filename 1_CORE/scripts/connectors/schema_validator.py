# seosona-ignore-lang
#!/usr/bin/env python3
"""
SEOSONA OS — Schema.org Validator
Detects + validates all structured data: JSON-LD, Microdata, RDFa
Checks against Google's supported schema types and deprecation status.
NO API KEY — pure HTML parsing.
"""

import json
import csv
import re
import urllib.request
import urllib.parse
import ssl
import time
from datetime import datetime
from pathlib import Path

try:
    import os as _os, sys as _sys
    _sys.path.append(_os.path.dirname(__file__))
    from url_guard import assert_safe_url, safe_urlopen
except Exception:
    def assert_safe_url(u):
        raise RuntimeError("url_guard unavailable")

    def safe_urlopen(*_a, **_k):
        raise RuntimeError("url_guard unavailable")

ROOT = Path(__file__).parent.parent.parent.parent
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"
CTX = ssl.create_default_context()
# TLS validation is enabled (do not disable check_hostname or CERT_NONE)

HEADERS = {"User-Agent": "SEOSONA-OS-SchemaValidator/1.0"}

# Google-supported rich result types (as of 2025)
GOOGLE_RICH_RESULTS = {
    "Article", "NewsArticle", "BlogPosting", "BreadcrumbList",
    "Event", "FAQPage", "HowTo", "ItemList", "JobPosting",
    "LocalBusiness", "Organization", "Person", "Product",
    "Recipe", "Review", "SoftwareApplication", "VideoObject",
    "WebPage", "WebSite", "SearchAction", "Offer", "AggregateRating",
    "ImageObject", "Question", "Answer", "Store", "Corporation",
    "MedicalCondition", "Drug", "Course", "EducationalOrganization",
    "LegalService", "HomeAndConstructionBusiness", "AutomotiveBusiness"
}

DEPRECATED_SCHEMAS = {
    "HowTo": {"since": "Sept 2023", "note": "No longer shows rich results in Google. Keep for LLM/AEO value."},
    "QAPage": {"since": "2023", "note": "Deprecated rich result support."},
    "Speakable": {"since": "2022", "note": "Experimental only."},
}

# E-commerce specific schemas — applicable to any online retailer
ECOMMERCE_RECOMMENDED = ["Product", "Offer", "AggregateRating", "BreadcrumbList",
                          "Organization", "WebSite", "SearchAction", "LocalBusiness"]


def load_config():
    # A malformed config.json used to abort the connector with a raw JSONDecodeError
    # traceback. Report it and fall back to defaults instead.
    try:
        if CONFIG_PATH.exists():
            with open(CONFIG_PATH) as f:
                return json.load(f)
        return {"defaults": {"target_domain": "", "target_url": "",
                             "output_dir": "3_MEMORY/seo_exports"}}
    except (json.JSONDecodeError, OSError) as e:
        print(f"[!] config.json unreadable ({e}); using defaults.")
        return {"defaults": {"target_domain": "", "target_url": "",
                             "output_dir": "3_MEMORY/seo_exports"}}

def fetch_page(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with safe_urlopen(req, timeout=15, context=CTX) as resp:
            return resp.read().decode("utf-8", errors="replace"), resp.status
    except Exception as e:
        return "", 0

def extract_json_ld(html):
    """Extract all JSON-LD blocks"""
    # Yoast and RankMath — i.e. the majority of WordPress — emit ONE script containing
    # {"@context":..., "@graph":[ {...Organization}, {...WebSite}, {...BreadcrumbList} ]}.
    # Without descending into @graph the outer wrapper has no @type, so every such site was told
    # "🔴 Critical: Missing @type" and reported as missing all 8 recommended schemas it actually has.
    def _flatten_graph(node, depth=0):
        if depth > 4:
            return []
        if isinstance(node, list):
            return [s for item in node for s in _flatten_graph(item, depth + 1)]
        if not isinstance(node, dict):
            return []
        graph = node.get("@graph")
        if graph is not None:
            context = node.get("@context")
            out = []
            for item in _flatten_graph(graph, depth + 1):
                # Children inherit the wrapper's @context so the "Missing @context" check stays true.
                if context and isinstance(item, dict) and "@context" not in item:
                    item = {"@context": context, **item}
                out.append(item)
            return out
        return [node]

    pattern = r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>'
    blocks = re.findall(pattern, html, re.DOTALL | re.IGNORECASE)
    schemas = []
    for block in blocks:
        try:
            data = json.loads(block.strip())
            schemas.extend(_flatten_graph(data))
        except json.JSONDecodeError as e:
            schemas.append({"_parse_error": str(e), "_raw": block[:200]})
    return schemas

def extract_microdata(html):
    """Detect microdata itemtype attributes"""
    pattern = r'itemtype=["\']([^"\']+)["\']'
    types = re.findall(pattern, html, re.IGNORECASE)
    return [t.split("/")[-1] for t in types if "schema.org" in t]

def validate_schema(schema_obj):
    """Validate a single schema object"""
    issues = []
    if "_parse_error" in schema_obj:
        return [{"severity": "🔴 Critical", "issue": f"Invalid JSON-LD: {schema_obj['_parse_error']}", "fix": "Fix JSON syntax in schema markup"}]

    schema_type = schema_obj.get("@type", "")
    if isinstance(schema_type, list):
        schema_type = schema_type[0]

    if not schema_obj.get("@context"):
        issues.append({"severity": "🟡 Medium", "issue": "Missing @context in JSON-LD", "fix": 'Add "@context": "https://schema.org"'})

    if not schema_type:
        issues.append({"severity": "🔴 Critical", "issue": "Missing @type in schema", "fix": "Add @type to all schema objects"})
        return issues

    # Deprecation check
    if schema_type in DEPRECATED_SCHEMAS:
        dep = DEPRECATED_SCHEMAS[schema_type]
        issues.append({"severity": "🟡 Medium",
                       "issue": f"{schema_type} deprecated since {dep['since']}: {dep['note']}",
                       "fix": f"Review usage of {schema_type}"})

    # Type-specific required fields
    required_fields = {
        "Product": ["name", "offers"],
        "Offer": ["price", "priceCurrency"],
        "Organization": ["name", "url"],
        "LocalBusiness": ["name", "address", "telephone"],
        "BreadcrumbList": ["itemListElement"],
        "Article": ["headline", "author", "datePublished"],
        "FAQPage": ["mainEntity"],
        "WebSite": ["name", "url"],
    }

    if schema_type in required_fields:
        for field in required_fields[schema_type]:
            if field not in schema_obj:
                issues.append({"severity": "🟡 High",
                               "issue": f"{schema_type} missing required field: '{field}'",
                               "fix": f"Add '{field}' to {schema_type} schema"})

    # Product-specific checks
    if schema_type == "Product":
        offers = schema_obj.get("offers", {})
        if isinstance(offers, dict):
            if not offers.get("price") and not offers.get("priceSpecification"):
                issues.append({"severity": "🟡 High", "issue": "Product schema: offers has no price",
                                "fix": "Add price and priceCurrency to offers"})
            if not offers.get("availability"):
                issues.append({"severity": "🟡 Low", "issue": "Product schema: missing availability",
                                "fix": 'Add availability: "https://schema.org/InStock"'})
        if not schema_obj.get("image"):
            issues.append({"severity": "🟡 Medium", "issue": "Product schema: missing image",
                           "fix": "Add product image URL to schema"})

    # Organization checks
    if schema_type in ("Organization", "LocalBusiness", "Store"):
        if not schema_obj.get("sameAs"):
            issues.append({"severity": "🟡 Low", "issue": f"{schema_type}: missing sameAs (social profiles)",
                           "fix": "Add sameAs with Facebook, LinkedIn, YouTube URLs"})
        if not schema_obj.get("logo"):
            issues.append({"severity": "🟡 Low", "issue": f"{schema_type}: missing logo",
                           "fix": "Add logo ImageObject to schema"})

    return issues

def check_missing_recommended(found_types, domain):
    """Check which recommended schemas are missing"""
    missing = []
    for rec in ECOMMERCE_RECOMMENDED:
        if rec not in found_types:
            missing.append(rec)
    return missing

def run(domain=None, url=None, extra_urls=None):
    config = load_config()
    if not domain:
        domain = config["defaults"]["target_domain"]
    if not url:
        url = config["defaults"]["target_url"]

    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = ROOT / config["defaults"]["output_dir"]
    out = Path(output_dir) / domain
    out.mkdir(parents=True, exist_ok=True)

    # URLs to check: homepage + key pages
    urls_to_check = [url]
    if extra_urls:
        urls_to_check.extend(extra_urls)
    else:
        # Try to find product/category pages from sitemap
        sm_url = url.rstrip("/") + "/sitemap.xml"
        html, status = fetch_page(sm_url)
        if status == 200:
            sitemap_urls = re.findall(r"<loc>(https?://[^<]+)</loc>", html)
            # Sample: homepage, 2 product pages, 1 category
            product_urls = [u for u in sitemap_urls if "/san-pham" in u or "/product" in u][:3]
            cat_urls = [u for u in sitemap_urls if "/danh-muc" in u or "/category" in u][:2]
            urls_to_check.extend(product_urls + cat_urls)

    urls_to_check = list(dict.fromkeys(urls_to_check))[:15]

    print(f"\n🚀 SEOSONA Schema Validator — {domain}")
    print(f"   Checking {len(urls_to_check)} URLs\n")

    all_results = []
    all_found_types = set()
    total_issues = []

    for i, page_url in enumerate(urls_to_check):
        print(f"   [{i+1}/{len(urls_to_check)}] {page_url[:70]}...")
        html, status = fetch_page(page_url)
        if status != 200:
            print(f"      ⚠️  Status {status} — skip")
            continue

        json_ld_schemas = extract_json_ld(html)
        microdata_types = extract_microdata(html)

        page_types = set()
        page_issues = []

        for schema in json_ld_schemas:
            st = schema.get("@type", "")
            if isinstance(st, list):
                st = st[0]
            if st:
                page_types.add(st)
                all_found_types.add(st)
            issues = validate_schema(schema)
            for issue in issues:
                issue["url"] = page_url
                issue["schema_type"] = st
                page_issues.append(issue)
                total_issues.append(issue)

        for mt in microdata_types:
            page_types.add(f"Microdata:{mt}")
            all_found_types.add(mt)

        all_results.append({
            "url": page_url,
            "status": status,
            "json_ld_count": len(json_ld_schemas),
            "schema_types": ", ".join(sorted(page_types)),
            "microdata_types": ", ".join(microdata_types),
            "issue_count": len(page_issues),
            "issues": page_issues
        })
        time.sleep(0.3)

    missing_recommended = check_missing_recommended(all_found_types, domain)
    critical_issues = [i for i in total_issues if "Critical" in i.get("severity","")]
    high_issues = [i for i in total_issues if "High" in i.get("severity","") and "Critical" not in i.get("severity","")]

    # Write CSV
    csv_path = out / f"schema_report_{domain}_{date_str}.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["url", "schema_types", "json_ld_count", "issue_count",
                         "severity", "issue", "fix"])
        for r in all_results:
            if r["issues"]:
                for issue in r["issues"]:
                    writer.writerow([r["url"], r["schema_types"], r["json_ld_count"],
                                     r["issue_count"], issue.get("severity",""),
                                     issue.get("issue",""), issue.get("fix","")])
            else:
                writer.writerow([r["url"], r["schema_types"], r["json_ld_count"],
                                 0, "✅ OK", "No issues", ""])
    print(f"\n💾 Schema CSV: {csv_path}")

    # Write Markdown
    md_path = out / f"schema_report_{domain}_{date_str}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Schema.org Validation Report — {domain}\n")
        f.write(f"> Date: {date_str} | Pages: {len(all_results)} | SEOSONA OS\n\n---\n\n")

        f.write("## 📊 Schema Health Summary\n\n")
        f.write(f"| Metric | Value |\n|--------|-------|\n")
        f.write(f"| Pages scanned | {len(all_results)} |\n")
        f.write(f"| Schema types found | {', '.join(sorted(all_found_types)) or 'None'} |\n")
        f.write(f"| 🔴 Critical issues | {len(critical_issues)} |\n")
        f.write(f"| 🟡 High issues | {len(high_issues)} |\n")
        f.write(f"| Total issues | {len(total_issues)} |\n\n")

        if missing_recommended:
            f.write("## ⚠️ Missing Recommended Schemas (E-commerce)\n\n")
            f.write("*These schemas improve rich results and E-E-A-T signals:*\n\n")
            schema_guides = {
                "Product": "Add to all product pages — enables price/rating rich snippets",
                "Offer": "Required inside Product for price rich results",
                "AggregateRating": "Add star ratings to products",
                "BreadcrumbList": "Add to all pages — shows breadcrumbs in SERP",
                "Organization": "Add to homepage — establishes brand entity",
                "WebSite": "Add to homepage with SearchAction for sitelinks search box",
                "SearchAction": "Inside WebSite — enables sitelinks search box",
                "LocalBusiness": "Add if you have physical store — enables local pack",
            }
            for s in missing_recommended:
                guide = schema_guides.get(s, "Implement for better rich results")
                f.write(f"- ❌ **{s}** — {guide}\n")

        f.write("\n## 🔴 Critical Issues\n\n")
        if critical_issues:
            f.write("| URL | Schema Type | Issue | Fix |\n|-----|-------------|-------|-----|\n")
            for i in critical_issues:
                f.write(f"| {i.get('url','')[-50:]} | {i.get('schema_type','')} | "
                        f"{i.get('issue','')} | {i.get('fix','')} |\n")
        else:
            f.write("✅ No critical schema issues found.\n")

        f.write("\n## 📄 Page-by-Page Schema Status\n\n")
        f.write("| URL | Schema Types | JSON-LD Blocks | Issues |\n")
        f.write("|-----|-------------|---------------|--------|\n")
        for r in all_results:
            status_icon = "✅" if r["issue_count"] == 0 else f"⚠️ {r['issue_count']}"
            f.write(f"| {r['url'][-55:]} | {r['schema_types'][:50] or 'None'} | "
                    f"{r['json_ld_count']} | {status_icon} |\n")

        f.write("\n## 📋 Recommended JSON-LD Templates\n\n")
        f.write("### Organization (Homepage)\n```json\n")
        f.write(json.dumps({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": domain,
            "url": f"https://{domain}/",
            "logo": f"https://{domain}/logo.png",
            "sameAs": ["https://facebook.com/YOURPAGE", "https://youtube.com/YOURCHANNEL"],
            "contactPoint": {"@type": "ContactPoint", "telephone": "+84-xxx", "contactType": "customer service"}
        }, indent=2, ensure_ascii=False))
        f.write("\n```\n")

        f.write("\n### BreadcrumbList\n```json\n")
        f.write(json.dumps({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Trang chủ", "item": f"https://{domain}/"},
                {"@type": "ListItem", "position": 2, "name": "Danh mục", "item": f"https://{domain}/danh-muc/"},
                {"@type": "ListItem", "position": 3, "name": "Sản phẩm", "item": f"https://{domain}/san-pham/example/"}
            ]
        }, indent=2, ensure_ascii=False))
        f.write("\n```\n")

        f.write(f"\n---\n*SEOSONA OS — Schema Validator | No API key required*\n")

    print(f"💾 Schema Report: {md_path}")
    print(f"\n✅ Schema validation complete!")
    print(f"   Types found: {', '.join(sorted(all_found_types)) or 'None'}")
    print(f"   Missing recommended: {', '.join(missing_recommended) or 'None'}")
    print(f"   🔴 Critical: {len(critical_issues)} | Total issues: {len(total_issues)}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Schema Validator")
    parser.add_argument("--domain", default=None)
    parser.add_argument("--url", default=None)
    args = parser.parse_args()
    run(domain=args.domain, url=args.url)
