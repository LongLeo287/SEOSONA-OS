import base64
import os
from pathlib import Path
try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = lambda *args, **kwargs: None

ROOT = Path(__file__).parent.parent.parent.parent
ENV_PATH = ROOT / "1_CONFIG" / ".env"
RUNTIME_SERVICE_ACCOUNT_PATH = ROOT / "1_CONFIG" / "service_account.runtime.json"

# Load environment variables
if ENV_PATH.exists():
    load_dotenv(ENV_PATH)

def get_secret(key, default=""):
    """
    Get a secret from 1_CONFIG/.env (via os.environ)
    """
    val = os.environ.get(key, default)

    if key == "GOOGLE_APPLICATION_CREDENTIALS":
        if val:
            resolved = Path(val) if os.path.isabs(val) else ROOT / val
            if resolved.exists():
                return str(resolved)

        encoded = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64", "").strip()
        if encoded:
            RUNTIME_SERVICE_ACCOUNT_PATH.write_bytes(base64.b64decode(encoded))
            # Restrict to owner read/write — this file holds a private key at rest.
            try:
                os.chmod(RUNTIME_SERVICE_ACCOUNT_PATH, 0o600)
            except OSError:
                pass  # best-effort on platforms without POSIX permissions
            return str(RUNTIME_SERVICE_ACCOUNT_PATH)
    
    # Auto-resolve relative paths for credential files
    if val and ("PATH" in key or "CREDENTIALS" in key):
        if not os.path.isabs(val):
            return str(ROOT / val)
            
    return val
