#!/usr/bin/env python3
"""
SEOSONA OS V5 — Audit Quality Scorer

Grades the quality of an entire audit run with a composite score.
Each connector output is evaluated on multiple dimensions:
  - Data Completeness (row count vs. expected)
  - Data Freshness (file modification time)
  - Confidence Level (from validation results)
  - Marker Contamination (placeholder data ratio)

Produces:
  - Per-module quality scores (0-100)
  - Overall audit quality grade (A/B/C/D/F)
  - Actionable recommendations for improvement

Usage:
    from quality_scorer import AuditQualityScorer
    scorer = AuditQualityScorer("popmart.com")
    report = scorer.score()
    scorer.print_report(report)
"""

from __future__ import annotations

import json
import sys
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


ROOT = Path(__file__).resolve().parents[2]


# ── Expected Data Thresholds Per Connector ───────────────────────────────────

QUALITY_THRESHOLDS = {
    "psi": {
        "label": "PageSpeed / CWV",
        "pattern": "cwv_report_*.csv",
        "expected_rows": 2,
        "weight": 1.0,
        "critical": True,
    },
    "keywords": {
        "label": "Keyword Research",
        "pattern": "keyword_research_*_autocomplete.csv",
        "expected_rows": 50,
        "weight": 1.2,
        "critical": True,
    },
    "serp_competitor": {
        "label": "SERP Competitor",
        "pattern": "serp_competitor_*.csv",
        "expected_rows": 10,
        "weight": 0.8,
        "critical": False,
    },
    "backlinks": {
        "label": "Backlinks",
        "pattern": "backlink_report_*.csv",
        "expected_rows": 20,
        "weight": 0.9,
        "critical": False,
    },
    "gsc": {
        "label": "Google Search Console",
        "pattern": "gsc_report_*.csv",
        "expected_rows": 100,
        "weight": 1.5,
        "critical": True,
    },
    "ga4": {
        "label": "Google Analytics 4",
        "pattern": "ga4_report_*.csv",
        "expected_rows": 10,
        "weight": 1.0,
        "critical": False,
    },
    "technical": {
        "label": "Technical SEO",
        "pattern": "technical_seo_*.csv",
        "expected_rows": 10,
        "weight": 1.3,
        "critical": True,
    },
    "schema": {
        "label": "Schema Validation",
        "pattern": "schema_report_*.csv",
        "expected_rows": 5,
        "weight": 0.8,
        "critical": False,
    },
    "eeat": {
        "label": "E-E-A-T Analysis",
        "pattern": "eeat_report_*.csv",
        "expected_rows": 10,
        "weight": 1.0,
        "critical": False,
    },
    "aeo": {
        "label": "AEO / AI Search",
        "pattern": "aeo_readiness_*.csv",
        "expected_rows": 5,
        "weight": 0.7,
        "critical": False,
    },
}


class AuditQualityScorer:
    """
    Grades audit output quality with composite scoring.
    """

    def __init__(self, domain: str):
        self.domain = domain
        self.export_dir = ROOT / "3_MEMORY" / "seo_exports" / domain

    def score(self) -> Dict:
        """
        Score the entire audit.

        Returns a report with per-module and overall scores.
        """
        module_scores = {}
        total_weighted_score = 0
        total_weight = 0
        recommendations = []

        for module_id, config in QUALITY_THRESHOLDS.items():
            score_data = self._score_module(module_id, config)
            module_scores[module_id] = score_data

            total_weighted_score += score_data["score"] * config["weight"]
            total_weight += config["weight"]

            # Generate recommendations
            if score_data["score"] < 50:
                recommendations.append({
                    "module": config["label"],
                    "severity": "critical" if config["critical"] else "warning",
                    "issue": score_data["issues"][0] if score_data["issues"] else "Low quality data",
                    "suggestion": self._get_suggestion(module_id, score_data),
                })

        # Overall score
        overall_score = round(total_weighted_score / max(total_weight, 1), 1)
        grade = self._score_to_grade(overall_score)

        # Load validation report for cross-reference
        validation = self._load_validation_report()

        report = {
            "domain": self.domain,
            "scored_at": datetime.now().isoformat(),
            "overall_score": overall_score,
            "grade": grade,
            "modules": module_scores,
            "recommendations": recommendations,
            "validation_status": validation.get("overall_status", "unknown") if validation else "unknown",
        }

        # Save report
        self._save_report(report)
        return report

    def _score_module(self, module_id: str, config: Dict) -> Dict:
        """Score a single module output."""
        pattern = config["pattern"]
        expected_rows = config["expected_rows"]

        # Find the latest matching file
        files = sorted(self.export_dir.glob(pattern), key=lambda p: p.stat().st_mtime, reverse=True) if self.export_dir.exists() else []

        result = {
            "label": config["label"],
            "score": 0,
            "file_found": False,
            "row_count": 0,
            "freshness": "stale",
            "completeness": 0.0,
            "issues": [],
        }

        if not files:
            result["issues"].append("No output file found")
            return result

        file_path = files[0]
        result["file_found"] = True

        # Freshness check
        mod_time = datetime.fromtimestamp(file_path.stat().st_mtime)
        age = datetime.now() - mod_time
        if age < timedelta(hours=1):
            freshness_score = 100
            result["freshness"] = "fresh"
        elif age < timedelta(days=1):
            freshness_score = 80
            result["freshness"] = "recent"
        elif age < timedelta(days=7):
            freshness_score = 50
            result["freshness"] = "aging"
        else:
            freshness_score = 20
            result["freshness"] = "stale"
            result["issues"].append(f"Data is {age.days} days old")

        # Row count and completeness
        try:
            import csv
            with file_path.open(newline="", encoding="utf-8-sig") as f:
                rows = list(csv.DictReader(f))
            result["row_count"] = len(rows)

            if len(rows) == 0:
                result["issues"].append("File is empty (0 rows)")
                completeness_score = 0
            elif len(rows) >= expected_rows:
                completeness_score = 100
            else:
                completeness_score = min(100, round((len(rows) / expected_rows) * 100))
                if completeness_score < 50:
                    result["issues"].append(f"Only {len(rows)}/{expected_rows} expected rows")

            result["completeness"] = completeness_score

            # Marker contamination check
            marker_words = {"not_configured", "repair_marker", "not_available", "placeholder", "no_data", "setup_required"}
            if rows:
                marker_count = 0
                for row in rows:
                    text = " ".join(str(v).lower() for v in row.values())
                    if any(w in text for w in marker_words):
                        marker_count += 1
                marker_ratio = marker_count / len(rows)
                if marker_ratio >= 0.5:
                    contamination_score = 0
                    result["issues"].append(f"{marker_ratio:.0%} marker/placeholder data")
                elif marker_ratio > 0:
                    contamination_score = max(0, round((1 - marker_ratio) * 100))
                else:
                    contamination_score = 100
            else:
                contamination_score = 0

        except Exception as e:
            completeness_score = 0
            contamination_score = 0
            result["issues"].append(f"Failed to read file: {e}")

        # Composite score: weighted average
        result["score"] = round(
            freshness_score * 0.2
            + completeness_score * 0.5
            + contamination_score * 0.3,
            1
        )

        return result

    def _score_to_grade(self, score: float) -> str:
        """Convert numeric score to letter grade."""
        if score >= 90:
            return "A"
        elif score >= 75:
            return "B"
        elif score >= 60:
            return "C"
        elif score >= 40:
            return "D"
        else:
            return "F"

    def _get_suggestion(self, module_id: str, score_data: Dict) -> str:
        """Generate actionable suggestion for a low-scoring module."""
        suggestions = {
            "psi": "Verify PageSpeed API key is configured in config.json",
            "keywords": "Add more seed keywords or check network connectivity",
            "serp_competitor": "Ensure keyword research ran first (dependency)",
            "backlinks": "Check OpenPageRank API availability",
            "gsc": "Verify Google Search Console OAuth credentials",
            "ga4": "Verify GA4 API credentials and property ID",
            "technical": "Check target URL is accessible and not blocking bots",
            "schema": "Verify target URL returns valid HTML",
            "eeat": "Ensure target site is crawlable",
            "aeo": "Check network connectivity for page fetching",
        }
        return suggestions.get(module_id, "Review connector configuration")

    def _load_validation_report(self) -> Optional[Dict]:
        """Load the validation report if available."""
        path = self.export_dir / f"validation_report_{self.domain}.json"
        if path.exists():
            try:
                return json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                pass
        return None

    def _save_report(self, report: Dict):
        """Save quality report to disk."""
        self.export_dir.mkdir(parents=True, exist_ok=True)
        path = self.export_dir / f"quality_report_{self.domain}.json"
        path.write_text(
            json.dumps(report, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

    def print_report(self, report: Dict):
        """Print a human-readable quality report."""
        grade = report["grade"]
        score = report["overall_score"]
        grade_colors = {"A": "🟢", "B": "🔵", "C": "🟡", "D": "🟠", "F": "🔴"}

        print("\n" + "=" * 65)
        print(f"📊 AUDIT QUALITY REPORT: {report['domain']}")
        print("=" * 65)
        print(f"   Overall: {grade_colors.get(grade, '?')} Grade {grade} ({score}/100)")
        print(f"   Validation: {report.get('validation_status', 'N/A')}")
        print("-" * 65)

        for mid, data in report.get("modules", {}).items():
            s = data["score"]
            icon = "✅" if s >= 75 else "⚠️" if s >= 50 else "❌"
            freshness = data.get("freshness", "?")
            print(f"   {icon} {data['label']:25s} | Score: {s:5.1f} | Rows: {data['row_count']:4d} | {freshness}")

        if report.get("recommendations"):
            print("-" * 65)
            print("   RECOMMENDATIONS:")
            for rec in report["recommendations"]:
                sev_icon = "🔴" if rec["severity"] == "critical" else "🟡"
                print(f"   {sev_icon} {rec['module']}: {rec['issue']}")
                print(f"      → {rec['suggestion']}")

        print("=" * 65)


# ── CLI Entry Point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Audit Quality Scorer")
    parser.add_argument("--domain", required=True)
    args = parser.parse_args()

    scorer = AuditQualityScorer(args.domain)
    report = scorer.score()
    scorer.print_report(report)
