#!/usr/bin/env python3
"""Report readiness for SEOSONA OS free and free-tier API integrations."""

from __future__ import annotations

import argparse
import importlib
import json
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CATALOG_PATH = ROOT / "1_CONFIG" / "free_api_catalog.json"
ENV_PATH = ROOT / "1_CONFIG" / ".env"
REQUIREMENTS_PATH = ROOT / "1_CORE" / "scripts" / "requirements-free-apis.txt"


def load_env() -> None:
    if not ENV_PATH.exists():
        return
    for raw in ENV_PATH.read_text(encoding="utf-8", errors="replace").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def is_configured(value: str | None) -> bool:
    if value is None:
        return False
    text = str(value).strip()
    if not text or text in {"''", '""'}:
        return False
    blocked = ("YOUR_", "your-", "sk-...", "AIzaSy...", "github_pat_...")
    return not any(marker in text for marker in blocked)


def module_ok(module: str) -> bool:
    try:
        importlib.import_module(module)
        return True
    except ImportError:
        return False


def install_dependencies() -> int:
    if not REQUIREMENTS_PATH.exists():
        print(f"[FAIL] Missing requirements file: {REQUIREMENTS_PATH.relative_to(ROOT)}")
        return 1
    cmd = [sys.executable, "-m", "pip", "install", "-r", str(REQUIREMENTS_PATH)]
    print("[INFO] Installing free API dependencies from requirements-free-apis.txt")
    return subprocess.call(cmd, cwd=ROOT)


def env_status(api: dict) -> tuple[str, list[str]]:
    env_names = api.get("env", [])
    if not env_names:
        return "ready", []

    configured = [name for name in env_names if is_configured(os.environ.get(name))]
    auth = api.get("auth", "")

    if auth in {"none", "optional_api_key"}:
        return "ready" if configured or auth == "none" else "ready_optional_key_missing", []
    if auth == "service_account":
        has_property = "GA4_PROPERTY_ID" not in env_names or "GA4_PROPERTY_ID" in configured
        has_credentials = (
            "GOOGLE_APPLICATION_CREDENTIALS" not in env_names
            and "GOOGLE_SERVICE_ACCOUNT_JSON_BASE64" not in env_names
        ) or any(
            name in configured
            for name in ("GOOGLE_APPLICATION_CREDENTIALS", "GOOGLE_SERVICE_ACCOUNT_JSON_BASE64")
        )
        missing = []
        if not has_property:
            missing.append("GA4_PROPERTY_ID")
        if not has_credentials:
            missing.append("GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_JSON_BASE64")
        return ("ready" if not missing else "needs_key", missing)

    missing = [name for name in env_names if name not in configured]
    return ("ready" if not missing else "needs_key", missing)


def print_report(strict: bool = False) -> int:
    load_env()
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))

    failures = 0
    ready = 0
    print("SEOSONA OS free API status")
    print(f"Catalog: {CATALOG_PATH.relative_to(ROOT)}")
    print("")

    for api in catalog["apis"]:
        modules = api.get("python_modules", [])
        missing_modules = [module for module in modules if not module_ok(module)]
        status, missing_env = env_status(api)

        if missing_modules:
            line_status = "MISSING_DEPS"
            failures += 1
        elif status == "needs_key":
            line_status = "NEEDS_FREE_KEY"
            if strict:
                failures += 1
        else:
            line_status = "READY"
            ready += 1

        print(f"[{line_status}] {api['label']} ({api['cost_model']})")
        if api.get("connectors"):
            print(f"  connectors: {', '.join(api['connectors'])}")
        if missing_modules:
            print(f"  install modules: {', '.join(missing_modules)}")
        if missing_env:
            print(f"  set env: {', '.join(missing_env)}")
        if status == "ready_optional_key_missing":
            print(f"  optional env: {', '.join(api.get('env', []))}")
        print(f"  setup: {api['setup_url']}")

    print("")
    print(f"Ready APIs: {ready}/{len(catalog['apis'])}")
    if failures:
        print(f"Blocking issues: {failures}")
        return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Check SEOSONA OS free API readiness.")
    parser.add_argument("--install-deps", action="store_true", help="Install Python packages used by free API connectors.")
    parser.add_argument("--strict", action="store_true", help="Treat missing free-tier keys as failures.")
    args = parser.parse_args()

    if args.install_deps:
        code = install_dependencies()
        if code != 0:
            return code
    return print_report(strict=args.strict)


if __name__ == "__main__":
    raise SystemExit(main())
