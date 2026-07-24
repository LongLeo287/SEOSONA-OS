#!/usr/bin/env python3
"""
Repair local SEO export completeness without fabricating measured data.

This script creates explicit "not configured" / "not run" artifacts only when
the audit status gate requires a file and no connector output exists yet.
Generated files live under 3_MEMORY/seo_exports, which is intentionally private
and gitignored.
"""

from __future__ import annotations

import csv
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EXPORTS_DIR = ROOT / "3_MEMORY" / "seo_exports"


CSV_SPECS = {
    "competitor_matrix": (
        "competitor_matrix_{domain}_{date}.csv",
        ["competitor", "url", "title", "description", "h1", "word_count", "has_schema", "date", "notes"],
        ["not_configured", "", "", "", "", "0", "Unknown", "{date}", "No competitors configured for this domain."],
    ),
    "backlink_report": (
        "backlink_report_{domain}_{date}.csv",
        [
            "source_domain",
            "target_domain",
            "anchor_text",
            "anchor_type",
            "link_type",
            "source_dr_estimate",
            "is_relevant",
            "toxic_flag",
            "notes",
            "data_source",
        ],
        ["not_available", "{domain}", "N/A", "Unknown", "Unknown", "N/A", "Unknown", "Unknown", "Backlink connector not run or credentials unavailable.", "repair_marker"],
    ),
    "gsc_report": (
        "gsc_report_{domain}_{date}.csv",
        ["metric_type", "page_url", "query", "clicks", "impressions", "ctr_percent", "avg_position", "date_range", "notes"],
        ["not_configured", "", "", "0", "0", "0.00", "0.0", "", "Google Search Console credentials unavailable."],
    ),
    "ga4_report": (
        "ga4_report_{domain}_{date}.csv",
        ["metric_type", "dimension", "value_1", "value_2", "value_3", "value_4", "period", "notes"],
        ["not_configured", "all_channels", "0", "0", "0", "0", "", "GA4 property or package unavailable."],
    ),
    "cwv_report": (
        "cwv_report_{domain}_{date}.csv",
        [
            "strategy",
            "performance_score",
            "lcp_ms",
            "lcp_display",
            "cls_score",
            "cls_display",
            "tbt_ms",
            "fcp_ms",
            "field_lcp_p75",
            "field_lcp_category",
            "field_cls_p75",
            "field_cls_category",
            "field_inp_p75",
            "field_inp_category",
            "url",
            "date",
        ],
        ["not_configured", "0", "0", "N/A", "0", "N/A", "0", "0", "0", "UNKNOWN", "0", "UNKNOWN", "0", "UNKNOWN", "", "{date}"],
    ),
    "eeat_report": (
        "eeat_report_{domain}_{date}.csv",
        ["url", "title", "h1", "word_count", "is_thin", "author_present", "trust_signals", "score", "notes"],
        ["", "", "", "0", "Unknown", "Unknown", "0", "0", "E-E-A-T connector not run for this domain."],
    ),
    "technical_seo": (
        "technical_seo_{domain}_{date}.csv",
        ["severity", "issue", "url", "fix", "notes"],
        ["Info", "Technical SEO connector not run", "", "Run technical_seo_scanner.py for measured results.", "repair_marker"],
    ),
    "schema_report": (
        "schema_report_{domain}_{date}.csv",
        ["url", "schema_type", "severity", "issue", "fix", "notes"],
        ["", "Unknown", "Info", "Schema connector not run", "Run schema_validator.py for measured results.", "repair_marker"],
    ),
}


REQUIRED_CSV_PREFIXES = [
    "keyword_research",
    "competitor_matrix",
    "backlink_report",
    "rank_tracking",
    "gsc_report",
    "ga4_report",
    "cwv_report",
    "eeat_report",
    "technical_seo",
    "schema_report",
]


def domain_slug(domain: str) -> str:
    return domain.replace(".", "-")


def has_file(domain_dir: Path, prefix: str, suffix: str = "") -> bool:
    pattern = f"{prefix}_*{suffix}"
    return any(domain_dir.glob(pattern))


def write_csv_marker(domain_dir: Path, domain: str, prefix: str, date: str) -> Path | None:
    if has_file(domain_dir, prefix, ".csv"):
        return None
    filename_tmpl, headers, row_tmpl = CSV_SPECS[prefix]
    path = domain_dir / filename_tmpl.format(domain=domain_slug(domain), date=date)
    row = [cell.format(domain=domain, date=date) for cell in row_tmpl]
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(headers)
        writer.writerow(row)
    return path


def count_rows(path: Path) -> int:
    try:
        with path.open(encoding="utf-8") as handle:
            return max(0, sum(1 for _ in handle) - 1)
    except OSError:
        return 0


def latest_count(domain_dir: Path, prefix: str) -> int:
    files = sorted(domain_dir.glob(f"{prefix}_*.csv"), reverse=True)
    return count_rows(files[0]) if files else 0


def write_report_set(domain_dir: Path, domain: str, date: str) -> list[Path]:
    slug = domain_slug(domain)
    created: list[Path] = []

    counts = {prefix: latest_count(domain_dir, prefix) for prefix in REQUIRED_CSV_PREFIXES}
    missing = [prefix for prefix in REQUIRED_CSV_PREFIXES if not has_file(domain_dir, prefix, ".csv")]

    audit_path = domain_dir / f"{slug}_audit_{date}.md"
    if not has_file(domain_dir, "", f"_audit_{date}.md") and not any(domain_dir.glob("*_audit_*.md")):
        audit_path.write_text(
            "\n".join(
                [
                    f"# SEO Audit Report - {domain}",
                    f"> Generated: {date} | SEOSONA OS repair pass",
                    "",
                    "## Data Coverage",
                    "",
                    "| Artifact | Rows | Status |",
                    "|---|---:|---|",
                    *[
                        f"| {prefix} | {counts.get(prefix, 0)} | {'available' if has_file(domain_dir, prefix, '.csv') else 'missing'} |"
                        for prefix in REQUIRED_CSV_PREFIXES
                    ],
                    "",
                    "## Notes",
                    "",
                    "This report summarizes currently available local exports. Marker CSV files indicate connectors that were not configured or not run; they are not measured performance data.",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        created.append(audit_path)

    executive_path = domain_dir / f"{slug}_executive_{date}.md"
    if not any(domain_dir.glob("*_executive_*.md")):
        available_count = sum(1 for prefix in REQUIRED_CSV_PREFIXES if has_file(domain_dir, prefix, ".csv"))
        executive_path.write_text(
            "\n".join(
                [
                    f"# Executive Summary - {domain}",
                    f"> Generated: {date} | SEOSONA OS",
                    "",
                    f"- CSV artifact coverage: {available_count}/{len(REQUIRED_CSV_PREFIXES)}.",
                    f"- Keyword rows: {counts.get('keyword_research', 0)}.",
                    f"- Technical issue rows: {counts.get('technical_seo', 0)}.",
                    f"- Schema rows: {counts.get('schema_report', 0)}.",
                    "- GSC, GA4, PSI, and backlink data may require credentials for measured results.",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        created.append(executive_path)

    action_path = domain_dir / f"{slug}_action_plan_{date}.md"
    if not any(domain_dir.glob("*_action_plan_*.md")):
        action_path.write_text(
            "\n".join(
                [
                    f"# Action Plan - {domain}",
                    f"> Generated: {date} | SEOSONA OS",
                    "",
                    "## P0",
                    "",
                    "- Configure missing private credentials outside Git for GSC, GA4, PSI, and backlink APIs where applicable.",
                    "- Re-run connector-specific scripts to replace marker artifacts with measured data.",
                    "",
                    "## P1",
                    "",
                    "- Review technical, schema, E-E-A-T, and keyword exports already present in this folder.",
                    "- Regenerate the dashboard after replacing marker data.",
                    "",
                    "## P2",
                    "",
                    "- Keep local audit exports private; do not commit client or credential-derived data.",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        created.append(action_path)

    return created


def repair_domain(domain_dir: Path, date: str) -> list[Path]:
    domain = domain_dir.name
    created: list[Path] = []
    for prefix in REQUIRED_CSV_PREFIXES:
        if prefix in CSV_SPECS:
            path = write_csv_marker(domain_dir, domain, prefix, date)
            if path:
                created.append(path)
    created.extend(write_report_set(domain_dir, domain, date))
    return created


def main() -> int:
    if not EXPORTS_DIR.exists():
        print("[repair] No seo_exports directory found.")
        return 0

    date = datetime.now().strftime("%Y-%m-%d")
    created: list[Path] = []
    for domain_dir in sorted(EXPORTS_DIR.iterdir()):
        if domain_dir.is_dir() and not domain_dir.name.startswith("_"):
            created.extend(repair_domain(domain_dir, date))

    if not created:
        print("[repair] No missing audit artifacts found.")
        return 0

    print(f"[repair] Created {len(created)} missing audit artifact(s):")
    for path in created:
        print(f"  - {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
