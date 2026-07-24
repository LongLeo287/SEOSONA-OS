#!/usr/bin/env python3
"""
auth_setup.py — One-time OAuth2 setup for Google Drive Manager Skill.
Run this FIRST before any other script.

Usage:
    python scripts/auth_setup.py               # interactive setup (ask for paths)
    python scripts/auth_setup.py --check       # verify existing token
    python scripts/auth_setup.py --revoke      # delete token (force re-auth)
    python scripts/auth_setup.py --show-env    # show current env var values
"""

import os
import sys
import platform
import argparse
from pathlib import Path

# ─── OS Detection ─────────────────────────────────────────────────────────────

def detect_os() -> str:
    """Returns: 'linux', 'mac', 'windows'"""
    system = platform.system().lower()
    if system == "darwin":   return "mac"
    if system == "windows":  return "windows"
    return "linux"

OS = detect_os()

# ─── Shell profile detection (Linux/Mac) ─────────────────────────────────────

def detect_shell_profile() -> str:
    """Detect the most likely shell profile file to persist env vars."""
    shell = os.environ.get("SHELL", "").lower()
    home  = Path.home()
    if "zsh" in shell:
        return str(home / ".zshrc")
    if "fish" in shell:
        return str(home / ".config" / "fish" / "config.fish")
    return str(home / ".bashrc")   # default fallback

# ─── Env var export instructions ─────────────────────────────────────────────

def env_instructions(creds_path: str, token_path: str) -> dict:
    """
    Returns OS-specific instructions to export GDRIVE_CREDS and GDRIVE_TOKEN.
    Covers: Linux (bash/zsh/fish), macOS (bash/zsh/fish), Windows (CMD, PowerShell).
    """
    abs_creds = str(Path(creds_path).resolve())
    abs_token = str(Path(token_path).resolve())

    if OS in ("linux", "mac"):
        profile = detect_shell_profile()
        is_fish = "fish" in profile

        if is_fish:
            session_cmd = (
                f'set -x GDRIVE_CREDS "{abs_creds}"\n'
                f'set -x GDRIVE_TOKEN "{abs_token}"'
            )
            persist_cmd = (
                f'set -Ux GDRIVE_CREDS "{abs_creds}"\n'
                f'set -Ux GDRIVE_TOKEN "{abs_token}"'
            )
        else:
            session_cmd = (
                f'export GDRIVE_CREDS="{abs_creds}"\n'
                f'export GDRIVE_TOKEN="{abs_token}"'
            )
            persist_cmd = (
                f'echo \'export GDRIVE_CREDS="{abs_creds}"\' >> {profile}\n'
                f'echo \'export GDRIVE_TOKEN="{abs_token}"\' >> {profile}\n'
                f'source {profile}'
            )

        return {
            "os":           OS,
            "shell":        "fish" if is_fish else os.environ.get("SHELL", "bash"),
            "profile":      profile,
            "session":      session_cmd,
            "persist":      persist_cmd,
            "note": (
                f"'session' sets for the current terminal only.\n"
                f"'persist' writes to {profile} and sources it (permanent)."
            ),
        }

    else:  # Windows
        session_cmd_ps  = (
            f'$env:GDRIVE_CREDS = "{abs_creds}"\n'
            f'$env:GDRIVE_TOKEN = "{abs_token}"'
        )
        persist_cmd_ps  = (
            f'[System.Environment]::SetEnvironmentVariable("GDRIVE_CREDS", "{abs_creds}", "User")\n'
            f'[System.Environment]::SetEnvironmentVariable("GDRIVE_TOKEN", "{abs_token}", "User")'
        )
        session_cmd_cmd = (
            f'set GDRIVE_CREDS={abs_creds}\n'
            f'set GDRIVE_TOKEN={abs_token}'
        )
        persist_cmd_cmd = (
            f'setx GDRIVE_CREDS "{abs_creds}"\n'
            f'setx GDRIVE_TOKEN "{abs_token}"'
        )
        return {
            "os":                 "windows",
            "powershell_session": session_cmd_ps,
            "powershell_persist": persist_cmd_ps,
            "cmd_session":        session_cmd_cmd,
            "cmd_persist":        persist_cmd_cmd,
            "note": (
                "PowerShell persist uses SetEnvironmentVariable (User scope) — permanent.\n"
                "CMD setx is permanent but requires reopening the terminal to take effect."
            ),
        }


def print_env_instructions(creds_path: str, token_path: str):
    """Print formatted, OS-specific env var setup instructions to the terminal."""
    info = env_instructions(creds_path, token_path)
    width = 70

    print()
    print("=" * width)
    print("  ENVIRONMENT VARIABLE SETUP")
    print("=" * width)

    if OS in ("linux", "mac"):
        print(f"\n  OS      : {OS.upper()}")
        print(f"  Shell   : {info['shell']}")
        print(f"  Profile : {info['profile']}")

        print("\n  ── Current terminal session only ──")
        for line in info["session"].splitlines():
            print(f"    {line}")

        print("\n  ── Persist permanently (adds to profile + sources it) ──")
        for line in info["persist"].splitlines():
            print(f"    {line}")

        print(f"\n  Note: {info['note']}")

    else:  # Windows
        print(f"\n  OS: WINDOWS\n")
        print("  ── PowerShell — current session only ──")
        for line in info["powershell_session"].splitlines():
            print(f"    {line}")

        print("\n  ── PowerShell — persist permanently (User scope) ──")
        for line in info["powershell_persist"].splitlines():
            print(f"    {line}")

        print("\n  ── CMD — current session only ──")
        for line in info["cmd_session"].splitlines():
            print(f"    {line}")

        print("\n  ── CMD — persist permanently (setx) ──")
        for line in info["cmd_persist"].splitlines():
            print(f"    {line}")

        print(f"\n  Note: {info['note']}")

    print("=" * width)
    print()


# ─── Interactive path configuration ──────────────────────────────────────────

def ask_paths() -> tuple[str, str]:
    """
    Interactively ask the user where credentials.json is and where to save token.json.
    Suggests sensible OS-specific defaults. Returns (creds_path, token_path).
    """
    home = Path.home()

    # OS-aware defaults
    if OS == "windows":
        default_dir   = str(home / "AppData" / "Roaming" / "gdrive")
        default_creds = str(Path(default_dir) / "credentials.json")
        default_token = str(Path(default_dir) / "token.json")
    else:
        default_dir   = str(home / ".config" / "gdrive")
        default_creds = str(Path(default_dir) / "credentials.json")
        default_token = str(Path(default_dir) / "token.json")

    print()
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║           Google Drive — Credential Path Setup              ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    print()
    print(f"  Detected OS : {OS.upper()}")
    print(f"  Suggested credential directory: {default_dir}")
    print()

    # ── credentials.json ──────────────────────────────────────────────────────
    current_creds = os.environ.get("GDRIVE_CREDS", "")
    if current_creds:
        print(f"  GDRIVE_CREDS is already set: {current_creds}")
        use_existing = input("  Keep existing path? [Y/n]: ").strip().lower()
        if use_existing in ("", "y", "yes"):
            creds_path = current_creds
        else:
            creds_path = ""
    else:
        creds_path = ""

    if not creds_path:
        print(f"\n  Where is your credentials.json?")
        print(f"  Press Enter to use default: {default_creds}")
        raw = input("  Path: ").strip()
        creds_path = raw if raw else default_creds

    creds_path = str(Path(creds_path).expanduser().resolve())

    # Validate file exists
    if not Path(creds_path).exists():
        print(f"\n  [WARN] File not found: {creds_path}")
        print("  Make sure to download credentials.json from Google Cloud Console first.")
        print("  Path saved — auth will fail until the file is placed there.")
    else:
        print(f"  [OK] Found: {creds_path}")

    # ── token.json ────────────────────────────────────────────────────────────
    current_token = os.environ.get("GDRIVE_TOKEN", "")
    if current_token:
        print(f"\n  GDRIVE_TOKEN is already set: {current_token}")
        use_existing = input("  Keep existing path? [Y/n]: ").strip().lower()
        if use_existing in ("", "y", "yes"):
            token_path = current_token
        else:
            token_path = ""
    else:
        token_path = ""

    if not token_path:
        # Suggest same directory as credentials
        creds_dir    = str(Path(creds_path).parent)
        default_tok  = str(Path(creds_dir) / "token.json")
        print(f"\n  Where should token.json be saved?")
        print(f"  Press Enter to use default: {default_tok}")
        raw = input("  Path: ").strip()
        token_path = raw if raw else default_tok

    token_path = str(Path(token_path).expanduser().resolve())

    # Ensure directory exists
    token_dir = Path(token_path).parent
    token_dir.mkdir(parents=True, exist_ok=True)

    # Set permissions on the dir (Linux/Mac only)
    if OS in ("linux", "mac"):
        token_dir.chmod(0o700)
        if Path(creds_path).exists():
            Path(creds_path).chmod(0o600)

    print(f"\n  credentials.json : {creds_path}")
    print(f"  token.json       : {token_path}")

    return creds_path, token_path


# ─── Scopes & Auth ────────────────────────────────────────────────────────────

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/presentations",
]


def get_credentials(creds_file: str, token_file: str):
    try:
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
    except ImportError:
        print("\n[ERROR] Missing packages. Run:")
        print("  pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client")
        sys.exit(1)

    creds = None
    if Path(token_file).exists():
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            print("[INFO] Token refreshed successfully.")
        else:
            if not Path(creds_file).exists():
                print(f"\n[ERROR] credentials.json not found at: {creds_file}")
                print("  Download from Google Cloud Console → APIs & Services → Credentials")
                print("  Create an OAuth 2.0 Client ID (Desktop App type)")
                sys.exit(1)
            flow  = InstalledAppFlow.from_client_secrets_file(creds_file, SCOPES)
            creds = flow.run_local_server(port=0)
            print("[INFO] Authentication successful.")

        with open(token_file, "w") as f:
            f.write(creds.to_json())
        if OS in ("linux", "mac"):
            Path(token_file).chmod(0o600)
        print(f"[INFO] Token saved to: {token_file}")

    return creds


def check_token(token_file: str) -> bool:
    if not Path(token_file).exists():
        print(f"[WARN] No token at: {token_file}")
        print("  Run: python scripts/auth_setup.py")
        return False
    try:
        from google.oauth2.credentials import Credentials
        from google.auth.transport.requests import Request
        creds = Credentials.from_authorized_user_file(token_file, SCOPES)
        if creds.valid:
            print("[OK] Token is valid.")
            return True
        elif creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(token_file, "w") as f:
                f.write(creds.to_json())
            print("[OK] Token was expired — refreshed successfully.")
            return True
        else:
            print("[WARN] Token invalid. Re-run auth setup.")
            return False
    except Exception as e:
        print(f"[ERROR] Token check failed: {e}")
        return False


def revoke_token(token_file: str):
    if Path(token_file).exists():
        Path(token_file).unlink()
        print(f"[INFO] Token revoked and deleted: {token_file}")
    else:
        print(f"[INFO] No token found at: {token_file}")


def show_current_env():
    creds = os.environ.get("GDRIVE_CREDS", "(not set)")
    token = os.environ.get("GDRIVE_TOKEN", "(not set)")
    print(f"\n  GDRIVE_CREDS = {creds}")
    print(f"  GDRIVE_TOKEN = {token}\n")
    if creds != "(not set)":
        exists = "✓ exists" if Path(creds).exists() else "✗ NOT FOUND"
        print(f"  credentials.json : {exists}")
    if token != "(not set)":
        exists = "✓ exists" if Path(token).exists() else "✗ not yet created (will be after auth)"
        print(f"  token.json       : {exists}")
    print()


# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Google Drive OAuth2 Setup — interactive credential path configuration",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--check",    action="store_true", help="Verify existing token")
    parser.add_argument("--revoke",   action="store_true", help="Delete token (force re-auth)")
    parser.add_argument("--show-env", action="store_true", help="Show current env var values")
    parser.add_argument("--no-auth",  action="store_true",
                        help="Configure paths and show env commands only — skip OAuth flow")
    args = parser.parse_args()

    if args.show_env:
        show_current_env()
        sys.exit(0)

    # Resolve paths — from env if set, else ask interactively
    if args.check or args.revoke:
        # For check/revoke, use env vars or defaults — no need to re-ask
        creds_path = os.environ.get("GDRIVE_CREDS", "credentials.json")
        token_path = os.environ.get("GDRIVE_TOKEN", "token.json")
    else:
        creds_path, token_path = ask_paths()
        print_env_instructions(creds_path, token_path)

    if args.revoke:
        revoke_token(token_path)
    elif args.check:
        ok = check_token(token_path)
        sys.exit(0 if ok else 1)
    elif args.no_auth:
        print("[INFO] Paths configured. Skipping OAuth flow (--no-auth).")
        print("[INFO] Run without --no-auth to complete authentication.")
    else:
        get_credentials(creds_path, token_path)
        print("\n[OK] Auth setup complete.")
        print(f"[OK] Set the env vars above so gdrive.py can find your credentials.\n")
