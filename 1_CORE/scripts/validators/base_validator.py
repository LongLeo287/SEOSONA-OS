#!/usr/bin/env python3
"""
SEOSONA OS V5 — Base Validator

Provides the ValidationResult schema and common validation utilities.
Every connector output is validated against these rules before being
accepted into the audit pipeline.
"""

from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass, field, asdict
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import List, Optional


class ValidationStatus(str, Enum):
    PASSED = "passed"
    WARNING = "warning"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass
class ValidationIssue:
    """A single validation finding."""
    severity: str  # "error", "warning", "info"
    code: str      # Machine-readable code, e.g. "MARKER_DATA"
    message: str   # Human-readable description
    field: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ValidationResult:
    """Result of validating a single connector output."""
    connector: str
    status: ValidationStatus = ValidationStatus.SKIPPED
    row_count: int = 0
    file_path: Optional[str] = None
    issues: List[ValidationIssue] = field(default_factory=list)
    confidence: str = "unknown"  # "high", "medium", "low", "unknown"
    validated_at: str = field(default_factory=lambda: datetime.now().isoformat())

    @property
    def has_errors(self) -> bool:
        return any(i.severity == "error" for i in self.issues)

    @property
    def has_warnings(self) -> bool:
        return any(i.severity == "warning" for i in self.issues)

    def add_issue(self, severity: str, code: str, message: str, field_name: str = None):
        self.issues.append(ValidationIssue(severity=severity, code=code, message=message, field=field_name))

    def compute_status(self):
        if self.has_errors:
            self.status = ValidationStatus.FAILED
            self.confidence = "low"
        elif self.has_warnings:
            self.status = ValidationStatus.WARNING
            self.confidence = "medium"
        elif self.row_count > 0:
            self.status = ValidationStatus.PASSED
            self.confidence = "high"
        else:
            self.status = ValidationStatus.SKIPPED
            self.confidence = "unknown"

    def to_dict(self) -> dict:
        return {
            "connector": self.connector,
            "status": self.status.value,
            "row_count": self.row_count,
            "file_path": self.file_path,
            "confidence": self.confidence,
            "validated_at": self.validated_at,
            "issue_count": len(self.issues),
            "issues": [i.to_dict() for i in self.issues],
        }

    def summary_line(self) -> str:
        icon = {"passed": "✅", "warning": "⚠️", "failed": "❌", "skipped": "⏭️"}
        return (
            f"   {icon.get(self.status.value, '?')} {self.connector}: "
            f"{self.status.value.upper()} ({self.row_count} rows, "
            f"confidence={self.confidence}, issues={len(self.issues)})"
        )


# ── Common Validation Utilities ─────────────────────────────────────────────

MARKER_WORDS = frozenset([
    "not_configured", "repair_marker", "not_available",
    "credentials unavailable", "no_data", "placeholder",
    "setup_required", "missing_key",
])


def is_marker_row(row: dict) -> bool:
    """Check if a CSV row contains only marker/placeholder data."""
    text = " ".join(str(v).lower().strip() for v in row.values())
    return any(word in text for word in MARKER_WORDS)


def read_csv_safe(path: Path) -> list[dict]:
    """Read a CSV file with encoding fallbacks."""
    if not path or not path.exists():
        return []
    for encoding in ("utf-8-sig", "utf-8", "cp1258", "cp1252"):
        try:
            with path.open(newline="", encoding=encoding) as f:
                return list(csv.DictReader(f))
        except UnicodeDecodeError:
            continue
    return []


def validate_csv_output(
    connector_name: str,
    file_path: Path,
    required_columns: list[str] = None,
    min_rows: int = 1,
    max_marker_ratio: float = 0.5,
) -> ValidationResult:
    """
    Universal CSV output validator.

    Checks:
    1. File exists and is readable
    2. Has at least `min_rows` data rows
    3. Required columns are present
    4. Marker data ratio is below threshold
    5. No completely empty rows
    """
    result = ValidationResult(connector=connector_name, file_path=str(file_path) if file_path else None)

    # Check 1: File existence
    if not file_path or not file_path.exists():
        result.add_issue("error", "FILE_MISSING", f"Output file not found: {file_path}")
        result.compute_status()
        return result

    # Check 2: Read file
    rows = read_csv_safe(file_path)
    result.row_count = len(rows)

    if len(rows) == 0:
        result.add_issue("error", "EMPTY_FILE", "CSV file has no data rows")
        result.compute_status()
        return result

    if len(rows) < min_rows:
        result.add_issue("warning", "LOW_ROW_COUNT",
                         f"Only {len(rows)} rows (expected at least {min_rows})")

    # Check 3: Required columns
    if required_columns and rows:
        actual_cols = set(rows[0].keys())
        missing = set(required_columns) - actual_cols
        if missing:
            result.add_issue("warning", "MISSING_COLUMNS",
                             f"Missing expected columns: {', '.join(sorted(missing))}")

    # Check 4: Marker data detection
    if rows:
        marker_count = sum(1 for r in rows if is_marker_row(r))
        marker_ratio = marker_count / len(rows)
        if marker_ratio >= 1.0:
            result.add_issue("error", "ALL_MARKERS",
                             "100% of rows are marker/placeholder data — no real data collected")
        elif marker_ratio >= max_marker_ratio:
            result.add_issue("warning", "HIGH_MARKER_RATIO",
                             f"{marker_count}/{len(rows)} rows ({marker_ratio:.0%}) are marker data")

    # Check 5: Empty value detection
    if rows:
        empty_rows = sum(1 for r in rows if all(not str(v).strip() for v in r.values()))
        if empty_rows > 0:
            result.add_issue("warning", "EMPTY_ROWS", f"{empty_rows} completely empty rows detected")

    result.compute_status()
    return result
