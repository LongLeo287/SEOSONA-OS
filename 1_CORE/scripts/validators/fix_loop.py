#!/usr/bin/env python3
"""
SEOSONA OS V5 — Fix Loop Engine

Implements retry-with-backoff and fallback strategies for connector execution.
When a connector fails or produces low-quality output, the fix loop:
1. Diagnoses the failure (network, auth, rate-limit, data quality)
2. Applies the appropriate fix strategy (retry, backoff, fallback)
3. Logs all attempts to fix_loop_log.json for observability

Usage:
    from fix_loop import run_with_fix_loop
    result = run_with_fix_loop("psi_connector", psi_connector.run, domain="example.com")
"""

from __future__ import annotations

import json
import time
import traceback
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Callable, Any, Optional


ROOT = Path(__file__).resolve().parents[3]
FIX_LOG_PATH = ROOT / "3_MEMORY" / "errors" / "fix_loop_log.json"


class FailureType:
    NETWORK = "network"
    AUTH = "auth"
    RATE_LIMIT = "rate_limit"
    DATA_QUALITY = "data_quality"
    UNKNOWN = "unknown"
    TIMEOUT = "timeout"


@dataclass
class FixAttempt:
    """A single retry/fix attempt."""
    attempt_number: int
    strategy: str  # "retry", "backoff", "fallback"
    success: bool
    error: Optional[str] = None
    duration_ms: int = 0
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class FixLoopResult:
    """Result of a fix loop execution."""
    connector: str
    success: bool
    total_attempts: int
    failure_type: Optional[str] = None
    final_error: Optional[str] = None
    attempts: list = field(default_factory=list)
    started_at: str = field(default_factory=lambda: datetime.now().isoformat())
    completed_at: str = ""

    def to_dict(self) -> dict:
        d = asdict(self)
        d["attempts"] = [a.to_dict() if isinstance(a, FixAttempt) else a for a in self.attempts]
        return d


def diagnose_failure(error: Exception) -> str:
    """Classify an exception into a failure type."""
    error_str = str(error).lower()
    error_type = type(error).__name__.lower()

    if any(w in error_str for w in ["connection", "timeout", "dns", "unreachable", "network"]):
        return FailureType.NETWORK
    if any(w in error_str for w in ["401", "403", "forbidden", "unauthorized", "credentials", "api_key"]):
        return FailureType.AUTH
    if any(w in error_str for w in ["429", "rate", "quota", "throttle", "too many"]):
        return FailureType.RATE_LIMIT
    if any(w in error_str for w in ["timeout", "timed out"]):
        return FailureType.TIMEOUT
    if any(w in error_str for w in ["marker", "not_configured", "empty", "no data"]):
        return FailureType.DATA_QUALITY
    return FailureType.UNKNOWN


def get_backoff_seconds(attempt: int, failure_type: str) -> float:
    """Calculate backoff delay based on attempt number and failure type."""
    base_delays = {
        FailureType.RATE_LIMIT: 10.0,
        FailureType.NETWORK: 3.0,
        FailureType.TIMEOUT: 5.0,
        FailureType.AUTH: 0,  # No retry for auth failures
        FailureType.DATA_QUALITY: 1.0,
        FailureType.UNKNOWN: 2.0,
    }
    base = base_delays.get(failure_type, 2.0)
    # Exponential backoff with cap at 60 seconds
    return min(base * (2 ** (attempt - 1)), 60.0)


def get_max_retries(failure_type: str) -> int:
    """Determine maximum retries based on failure type."""
    retry_map = {
        FailureType.NETWORK: 3,
        FailureType.RATE_LIMIT: 2,
        FailureType.TIMEOUT: 2,
        FailureType.AUTH: 0,       # Don't retry auth failures
        FailureType.DATA_QUALITY: 1,
        FailureType.UNKNOWN: 1,
    }
    return retry_map.get(failure_type, 1)


def log_fix_loop_result(result: FixLoopResult):
    """Append fix loop result to the persistent log file."""
    FIX_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    log_data = []
    if FIX_LOG_PATH.exists():
        try:
            log_data = json.loads(FIX_LOG_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, ValueError):
            log_data = []

    log_data.append(result.to_dict())

    # Keep only last 500 entries to prevent unbounded growth
    if len(log_data) > 500:
        log_data = log_data[-500:]

    FIX_LOG_PATH.write_text(json.dumps(log_data, indent=2, ensure_ascii=False), encoding="utf-8")


def run_with_fix_loop(
    connector_name: str,
    run_fn: Callable[..., Any],
    max_retries: int = None,
    **kwargs,
) -> FixLoopResult:
    """
    Execute a connector function with automatic retry and fix loop.

    Args:
        connector_name: Human-readable name for logging
        run_fn: The connector's run() function
        max_retries: Override max retries (auto-detected from failure type if None)
        **kwargs: Arguments to pass to run_fn

    Returns:
        FixLoopResult with success/failure status and attempt history
    """
    result = FixLoopResult(connector=connector_name, success=False, total_attempts=0)
    last_error = None
    failure_type = FailureType.UNKNOWN

    # First attempt
    for attempt_num in range(1, 5):  # Absolute max of 4 attempts
        start_ms = int(time.time() * 1000)

        try:
            run_fn(**kwargs)
            duration = int(time.time() * 1000) - start_ms
            result.attempts.append(FixAttempt(
                attempt_number=attempt_num,
                strategy="initial" if attempt_num == 1 else "retry",
                success=True,
                duration_ms=duration,
            ))
            result.success = True
            result.total_attempts = attempt_num
            break

        except (Exception, SystemExit) as e:
            duration = int(time.time() * 1000) - start_ms
            last_error = str(e)
            failure_type = diagnose_failure(e)

            result.attempts.append(FixAttempt(
                attempt_number=attempt_num,
                strategy="initial" if attempt_num == 1 else "retry",
                success=False,
                error=last_error,
                duration_ms=duration,
            ))
            result.total_attempts = attempt_num
            result.failure_type = failure_type

            # Check if we should retry
            allowed_retries = max_retries if max_retries is not None else get_max_retries(failure_type)
            if attempt_num > allowed_retries:
                break

            # Apply backoff
            backoff = get_backoff_seconds(attempt_num, failure_type)
            if backoff > 0:
                print(f"   ⏳ {connector_name}: {failure_type} failure. Retrying in {backoff:.0f}s... (attempt {attempt_num + 1})")
                time.sleep(backoff)

    if not result.success:
        result.final_error = last_error

    result.completed_at = datetime.now().isoformat()

    # Log to persistent file
    try:
        log_fix_loop_result(result)
    except Exception:
        pass  # Don't let logging failures break the audit

    return result
