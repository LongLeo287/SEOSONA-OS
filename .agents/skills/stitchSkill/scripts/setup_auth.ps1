điều chỉnh lại plan theo comment rồi đưa tôi review tiếp# Stitch ADC Authentication Setup
# Run this script ONCE to authenticate with Google Application Default Credentials
# for the Stitch API. The token will auto-refresh indefinitely after initial login.

param(
    [string]$CredentialPath = "$env:APPDATA\gcloud\application_default_credentials.json"
)

$ErrorActionPreference = "Stop"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Stitch API - Google ADC Authentication" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
$gcloudPath = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloudPath) {
    Write-Host "ERROR: gcloud CLI is not installed." -ForegroundColor Red
    Write-Host "Install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "[1/3] Checking existing credentials..." -ForegroundColor Yellow

# Check if credentials already exist
if (Test-Path $CredentialPath) {
    Write-Host "  Found existing credentials at: $CredentialPath" -ForegroundColor Green

    # Try to get an access token to verify they work
    try {
        $null = & gcloud auth application-default print-access-token 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Credentials are VALID and working!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You're all set! No action needed." -ForegroundColor Cyan
            Write-Host ""
            exit 0
        }
    }
    catch {
        Write-Host "  Existing credentials are expired or invalid. Re-authenticating..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "[2/3] Authenticating with Google..." -ForegroundColor Yellow
Write-Host "  A browser window will open for Google login." -ForegroundColor Gray
Write-Host "  Grant access to the Stitch API scope." -ForegroundColor Gray
Write-Host ""

# Run the ADC login with the required scopes for Stitch
try {
    & gcloud auth application-default login `
        --scopes="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/generative-language"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Authentication failed." -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "ERROR: Authentication failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[3/3] Verifying credentials..." -ForegroundColor Yellow

# Verify the new credentials work
try {
    $null = & gcloud auth application-default print-access-token 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Authentication SUCCESSFUL!" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Credentials saved to: $CredentialPath" -ForegroundColor Gray
        Write-Host "  Token will auto-refresh. No need to re-run this script." -ForegroundColor Gray
        Write-Host ""
        Write-Host "=============================================" -ForegroundColor Cyan
        Write-Host "  Setup Complete - Ready to use Stitch!" -ForegroundColor Cyan
        Write-Host "=============================================" -ForegroundColor Cyan
    }
    else {
        Write-Host "  WARNING: Could not verify token. Check your setup." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "  WARNING: Could not verify token: $_" -ForegroundColor Yellow
}
