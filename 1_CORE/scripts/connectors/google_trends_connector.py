#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEOSONA OS — Google Trends Connector
Uses pytrends to fetch Interest Over Time data and saves it as JSON for the dashboard.
"""

import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).parent.parent.parent.parent

try:
    from pytrends.request import TrendReq
except ImportError:
    print("[ERROR] pytrends not installed. Run: pip install pytrends pandas")
    sys.exit(1)

def run(domain):
    print(f"\n🚀 SEOSONA Google Trends Connector — {domain}")
    brand = domain.split('.')[0]
    
    output_dir = ROOT / "3_MEMORY" / "seo_exports" / domain
    output_dir.mkdir(parents=True, exist_ok=True)
    json_path = output_dir / "trends_data.json"

    print(f"   📡 Fetching Trends for keyword: '{brand}' (VN, 12 months)")
    
    try:
        pytrends = TrendReq(hl='vi-VN', tz=-420) # UTC+7 is -420 minutes
        kw_list = [brand]
        pytrends.build_payload(kw_list, cat=0, timeframe='today 12-m', geo='VN', gprop='')
        df = pytrends.interest_over_time()
        
        if df.empty:
            print("   ⚠️ No data returned from Google Trends.")
            data = {"keyword": brand, "labels": [], "values": []}
        else:
            labels = df.index.strftime('%Y-%m-%d').tolist()
            values = df[brand].tolist()
            data = {"keyword": brand, "labels": labels, "values": values}
            print(f"   ✅ Fetched {len(values)} data points.")
            
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"💾 Saved Trends data: {json_path}")
        
    except Exception as e:
        print(f"   ❌ Error fetching Google Trends: {str(e)}")
        # Save empty file to avoid breaking downstream
        data = {"keyword": brand, "labels": [], "values": [], "error": str(e)}
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Google Trends API Connector")
    parser.add_argument("--domain", required=True, help="Target domain (e.g. seosona.com)")
    args = parser.parse_args()
    run(args.domain)
