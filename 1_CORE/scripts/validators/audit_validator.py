#!/usr/bin/env python3
"""
SEOSONA OS V5 — Audit Validator

Validates all connector outputs for a given domain after an audit run.
Each connector has specific validation rules (expected columns, minimum rows, etc.).
Results are saved as a JSON report and printed as a summary table.
"""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Optional

from base_validator import (
    ValidationResult,
    ValidationStatus,
    validate_csv_output,
    read_csv_safe,
    is_marker_row,
)


# ── Per-Connector Validation Rules ──────────────────────────────────────────

CONNECTOR_RULES = {
    "psi": {
        "pattern": "cwv_report_*.csv",
        "required_columns": ["strategy", "performance_score"],
        "min_rows": 1,
        "label": "PageSpeed / CWV",
    },
    "keywords": {
        "pattern": "keyword_research_*_autocomplete.csv",
        "required_columns": ["keyword"],
        "min_rows": 5,
        "label": "Keyword Research",
    },
    "serp_competitor": {
        "pattern": "serp_competitor_*.csv",
        "required_columns": ["competitor_domain"],
        "min_rows": 1,
        "label": "SERP Competitor",
    },
    "backlinks": {
        "pattern": "backlink_report_*.csv",
        "required_columns": ["source_domain", "target_domain"],
        "min_rows": 1,
        "label": "Backlinks",
    },
    "gsc": {
        "pattern": "gsc_report_*.csv",
        "required_columns": ["query", "clicks", "impressions"],
        "min_rows": 1,
        "label": "Google Search Console",
    },
    "ga4": {
        "pattern": "ga4_report_*.csv",
        "required_columns": ["metric_type"],
        "min_rows": 1,
        "label": "Google Analytics 4",
    },
    "technical": {
        "pattern": "technical_seo_*.csv",
        "required_columns": ["url", "status"],
        "min_rows": 1,
        "label": "Technical SEO",
    },
    "schema": {
        "pattern": "schema_report_*.csv",
        "required_columns": ["url", "schema_types"],
        "min_rows": 1,
        "label": "Schema Validation",
    },
    "eeat": {
        "pattern": "eeat_report_*.csv",
        "required_columns": ["url"],
        "min_rows": 1,
        "label": "E-E-A-T Analysis",
    },
    "aeo": {
        "pattern": "aeo_readiness_*.csv",
        "required_columns": ["url"],
        "min_rows": 1,
        "label": "AEO / AI Search",
    },
}


def latest_file(directory: Path, pattern: str) -> Optional[Path]:
    """Find the most recently modified file matching a glob pattern."""
    files = sorted(directory.glob(pattern), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def validate_audit(domain: str, export_dir: Path = None) -> dict:
    """
    Validate all connector outputs for a domain.

    Returns a dict with:
    - overall_status: "passed" | "warning" | "failed"
    - overall_confidence: "high" | "medium" | "low"
    - connectors: dict of connector_name → ValidationResult
    - summary: printable summary string
    """
    if export_dir is None:
        root = Path(__file__).resolve().parents[3]
        export_dir = root / "3_MEMORY" / "seo_exports" / domain

    results = {}
    for name, rules in CONNECTOR_RULES.items():
        file_path = latest_file(export_dir, rules["pattern"])
        result = validate_csv_output(
            connector_name=rules["label"],
            file_path=file_path,
            required_columns=rules.get("required_columns"),
            min_rows=rules.get("min_rows", 1),
        )
        results[name] = result

    # Compute overall status
    statuses = [r.status for r in results.values()]
    if any(s == ValidationStatus.FAILED for s in statuses):
        overall_status = "failed"
        overall_confidence = "low"
    elif any(s == ValidationStatus.WARNING for s in statuses):
        overall_status = "warning"
        overall_confidence = "medium"
    elif all(s == ValidationStatus.PASSED for s in statuses):
        overall_status = "passed"
        overall_confidence = "high"
    else:
        overall_status = "partial"
        overall_confidence = "medium"

    # Count stats
    passed_count = sum(1 for s in statuses if s == ValidationStatus.PASSED)
    warning_count = sum(1 for s in statuses if s == ValidationStatus.WARNING)
    failed_count = sum(1 for s in statuses if s == ValidationStatus.FAILED)
    skipped_count = sum(1 for s in statuses if s == ValidationStatus.SKIPPED)

    # Build summary
    lines = [
        "",
        "=" * 65,
        "🔍 AUDIT VALIDATION REPORT",
        "=" * 65,
        f"   Domain: {domain}",
        f"   Time:   {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"   Status: {overall_status.upper()} (confidence: {overall_confidence})",
        f"   Passed: {passed_count} | Warning: {warning_count} | Failed: {failed_count} | Skipped: {skipped_count}",
        "-" * 65,
    ]
    for name, result in results.items():
        lines.append(result.summary_line())

    # Show detailed issues
    all_issues = []
    for name, result in results.items():
        for issue in result.issues:
            all_issues.append((result.connector, issue))

    if all_issues:
        lines.append("-" * 65)
        lines.append("   ISSUES:")
        for connector, issue in all_issues:
            icon = "🔴" if issue.severity == "error" else "🟡" if issue.severity == "warning" else "ℹ️"
            lines.append(f"   {icon} [{issue.code}] {connector}: {issue.message}")

    lines.append("=" * 65)
    summary = "\n".join(lines)

    # Save validation report as JSON
    report = {
        "domain": domain,
        "validated_at": datetime.now().isoformat(),
        "overall_status": overall_status,
        "overall_confidence": overall_confidence,
        "stats": {
            "passed": passed_count,
            "warning": warning_count,
            "failed": failed_count,
            "skipped": skipped_count,
        },
        "connectors": {name: r.to_dict() for name, r in results.items()},
    }
    report_path = export_dir / f"validation_report_{domain}.json"
    export_dir.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    return {
        "overall_status": overall_status,
        "overall_confidence": overall_confidence,
        "results": results,
        "summary": summary,
        "report_path": str(report_path),
    }


def print_validation_report(domain: str, export_dir: Path = None):
    """Run validation and print the summary."""
    report = validate_audit(domain, export_dir)
    print(report["summary"])
    print(f"\n   📄 Full report saved: {report['report_path']}")
    return report


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Validate SEOSONA audit outputs")
    parser.add_argument("--domain", required=True)
    args = parser.parse_args()
    print_validation_report(args.domain)
