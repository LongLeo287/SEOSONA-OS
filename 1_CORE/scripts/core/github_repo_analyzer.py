from pathlib import Path
import os
import sys
import json
import shutil
import subprocess
import requests
import argparse

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

INGESTION_ZONE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "3_MEMORY", "ingestion_zone")
STAR_THRESHOLD = 500

def get_repo_metadata(owner: str, repo: str) -> dict:
    url = f"https://api.github.com/repos/{owner}/{repo}"
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ [Triage] Failed to fetch metadata for {owner}/{repo}: {e}")
        return {}

def analyze_and_triage(repo_url: str):
    print(f"🔍 [Triage] Analyzing repository: {repo_url}")
    
    # Extract owner/repo
    repo_url = repo_url.rstrip("/")
    parts = repo_url.split("/")
    if len(parts) < 2:
        print("❌ [Triage] Invalid GitHub URL format.")
        return
        
    owner = parts[-2]
    repo = parts[-1]
    
    metadata = get_repo_metadata(owner, repo)
    if not metadata:
        return
        
    stars = metadata.get("stargazers_count", 0)
    print(f"⭐ [Triage] Stars: {stars}")
    
    if stars >= STAR_THRESHOLD:
        print(f"✅ [Triage] Repository meets Deep Assimilation threshold (> {STAR_THRESHOLD} stars).")
        print("📥 [Triage] Executing Deep Clone...")
        
        os.makedirs(INGESTION_ZONE, exist_ok=True)
        target_dir = os.path.join(INGESTION_ZONE, repo)
        
        if os.path.exists(target_dir):
            print(f"⚠️ [Triage] Directory {target_dir} already exists. Cleaning up...")
            shutil.rmtree(target_dir, ignore_errors=True)
            
        try:
            subprocess.run(["git", "clone", "--depth", "1", repo_url, target_dir], check=True)
            print(f"🎯 [Triage] Clone successful: {target_dir}")
            print("🚀 [Triage] Ready for DEEP ANALYSIS.")
        except subprocess.CalledProcessError as e:
            print(f"❌ [Triage] Clone failed: {e}")
    else:
        print(f"⚠️ [Triage] Repository falls below threshold (Stars < {STAR_THRESHOLD}).")
        print("ℹ️ [Triage] Recommending LIGHTWEIGHT ANALYSIS (README only).")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UAP Step 0: GitHub Repo Triage")
    parser.add_argument("--url", required=True, help="GitHub Repository URL")
    args = parser.parse_args()
    
    analyze_and_triage(args.url)
