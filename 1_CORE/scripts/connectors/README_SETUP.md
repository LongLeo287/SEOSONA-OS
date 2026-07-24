# SEOSONA OS — API Setup Guide
> Step-by-step setup for all free APIs used by SEOSONA OS connectors

---

## ⚡ QUICK START — Run immediately (no setup needed)

Technical SEO, Schema, E-E-A-T, Keywords, Log Analyzer, SERP Competitors — all run with zero API keys:
```powershell
python scripts/run_full_audit.py --domain <your_domain.com> --free-only
```

---

## 🔒 Secret Management System

SEOSONA OS uses encrypted `.vault` files to store your API keys securely. You do not edit `config.json` manually for secrets. Use the `secrets_manager.py` script to set API keys.

```powershell
# Set an API key securely
python scripts/secrets_manager.py --set <key_name> <your_api_key>

# List all stored keys (names only, values are hidden)
python scripts/secrets_manager.py --list
```

---

## 🔑 API 1: Google Cloud Platform (PageSpeed Insights + CrUX)

**Cost: FREE | Setup time: ~5 minutes**

```
1. Go to: https://console.cloud.google.com
2. Create a new project or select existing
3. Enable APIs:
   APIs & Services → Library → search "PageSpeed Insights API" → Enable
   APIs & Services → Library → search "Chrome UX Report API" → Enable
   APIs & Services → Library → search "Google Search Console API" → Enable
   APIs & Services → Library → search "Google Analytics Data API" → Enable

4. Create API Key:
   APIs & Services → Credentials → Create Credentials → API Key
   Copy the key → save via secrets manager:
   
   python scripts/secrets_manager.py --set pagespeed_api_key YOUR_KEY

5. Test:
   python scripts/connectors/psi_connector.py --domain <your_domain.com>
```

---

## 🔑 API 2: Google Search Console (GSC)

**Cost: FREE | Setup time: ~15 minutes | Requires: verified GSC property**

```
STEP 1 — Create a Service Account:
  console.cloud.google.com
  → IAM & Admin → Service Accounts → Create Service Account
  → Name: seosona-gsc
  → Role: Viewer
  → Done → Actions → Manage Keys → Add Key → JSON
  → Download JSON file → rename to: gsc_service_account.json
  → Save to: 3_MEMORY/specs/gsc_service_account.json
     (this folder is gitignored — credentials are safe ✅)

STEP 2 — Grant GSC Access to the Service Account:
  search.google.com/search-console
  → Select property: <your_domain.com>
  → Settings → Users and permissions → Add User
  → Paste: [client_email from gsc_service_account.json]
  → Permission: Full

STEP 3 — Ensure config.json points to the file:
  "gsc": {
    "service_account_path": "3_MEMORY/specs/gsc_service_account.json"
  }

STEP 4 — Test:
  python scripts/connectors/gsc_connector.py --domain <your_domain.com>
```

---

## 🔑 API 3: Google Analytics 4 (GA4)

**Cost: FREE | Setup time: ~5 minutes | Requires: same Service Account as GSC**

```
STEP 1 — Find your GA4 Property ID:
  analytics.google.com → Admin → Property Settings → Property ID
  (numbers only, e.g. 123456789)

STEP 2 — Grant access to the Service Account:
  analytics.google.com → Admin → Account Access Management → Add Users
  → Paste: [client_email from gsc_service_account.json]
  → Role: Viewer

STEP 3 — Save to config.json (not a secret):
  "ga4": {
    "property_id": "YOUR_PROPERTY_ID_HERE"
  }

STEP 4 — Test:
  python scripts/connectors/ga4_connector.py --domain <your_domain.com>
```

---

## 🔑 API 4: Open PageRank (Domain Authority)

**Cost: FREE | Setup time: ~2 minutes**

```
1. Go to: https://www.domainpagerank.com
2. Sign up (email + password)
3. Dashboard → API Key → Copy key
4. Save via secrets manager:
   python scripts/secrets_manager.py --set opr_api_key YOUR_KEY

5. Test:
   python scripts/connectors/backlink_connector.py --domain <your_domain.com>
```

---

## 🔑 API 5: Bing Webmaster Tools (Backlinks)

**Cost: FREE | Setup time: ~10 minutes | Requires: verified Bing property**

```
1. Go to: https://www.bing.com/webmasters
2. Add site → <your_domain.com> → Verify
3. Settings → API Access → Generate API Key → Copy
4. Save via secrets manager:
   python scripts/secrets_manager.py --set bing_api_key YOUR_KEY
```

---

## 📦 Install Dependencies

```powershell
# Required only for GSC + GA4 connectors (others use Python stdlib only)
pip install google-api-python-client google-auth google-analytics-data
pip install cryptography
```

---

## 🚀 Run Commands Reference

```powershell
# Run all free connectors (no API key needed)
python scripts/run_full_audit.py --domain <your_domain.com> --free-only

# Full audit (all 12 connectors + cleanup — skips unconfigured APIs gracefully)
python scripts/run_full_audit.py --domain <your_domain.com> --clean

# Skip specific connectors
python scripts/run_full_audit.py --domain <your_domain.com> --skip-gsc --skip-ga4

# Custom keyword seeds
python scripts/run_full_audit.py --only keywords --domain <your_domain.com> --seeds "bluetooth speaker" "headphone"
```

---

## 🔒 Security Notes

- `.vault` and `.masterkey` — **NEVER commit to Git** (gitignored ✅)
- `3_MEMORY/specs/config.json` — Only contains public settings, safe.
- `3_MEMORY/specs/gsc_service_account.json` — **NEVER commit to Git** (gitignored ✅)
- `3_MEMORY/seo_exports/` — **NEVER commit to Git** (gitignored ✅)
- Service Account has **READ-ONLY** access — cannot modify GSC or GA4 data.

---

## 📋 API Priority Order (recommended setup sequence)

| Priority | API | Unlocks | Time |
|----------|-----|---------|------|
| Run now | None — `--free-only` | Tech, Schema, E-E-A-T, Keywords, SERP Gap | 0 min |
| P1 | GCP API Key | PageSpeed Insights, Core Web Vitals | 5 min |
| P1 | GSC Service Account | Real rankings, CTR, Position Tracking | 15 min |
| P2 | GA4 Property ID | Sessions, channels, conversions | 5 min |
| P3 | Open PageRank Key | Domain authority score, Toxic Links | 2 min |
| P4 | Bing Webmaster Key | Additional backlink data | 10 min |

---

*SEOSONA OS — API Setup Guide | All credentials stored locally and encrypted.*
