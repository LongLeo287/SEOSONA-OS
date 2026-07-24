#!/usr/bin/env python3
"""Meta/Facebook Ads API manager — create, modify, analyze campaigns via CLI.

Usage:
  python meta-ads-manager.py report [--preset last_30d] [--level campaign]
  python meta-ads-manager.py create-campaign --name NAME --objective OBJECTIVE
  python meta-ads-manager.py create-adset --campaign-id ID --name NAME --budget BUDGET --countries US
  python meta-ads-manager.py create-ad --adset-id ID --name NAME --page-id PID --image PATH --link URL --message TEXT
  python meta-ads-manager.py pause --id ID --type campaign|adset|ad
  python meta-ads-manager.py enable --id ID --type campaign|adset|ad
  python meta-ads-manager.py update-budget --adset-id ID --budget AMOUNT
  python meta-ads-manager.py list-campaigns [--status ACTIVE|PAUSED]

Requires: pip install facebook-business
Env vars: META_APP_ID, META_APP_SECRET, META_ACCESS_TOKEN, META_AD_ACCOUNT_ID
"""

import argparse
import json
import os
import sys
from pathlib import Path

# Add centralized resolver to path
_scripts_dir = Path(__file__).parent
_claude_scripts = _scripts_dir.parents[2] / 'scripts'
if _claude_scripts.exists():
    sys.path.insert(0, str(_claude_scripts))

try:
    from resolve_env import resolve_env
    _RESOLVER = True
except ImportError:
    _RESOLVER = False
    try:
        from dotenv import load_dotenv
    except ImportError:
        load_dotenv = None


def _resolve(var_name: str) -> str:
    """Resolve env var using centralized resolver or fallback."""
    if _RESOLVER:
        return resolve_env(var_name, skill='ads-management') or ""

    # Fallback: check process env first
    val = os.getenv(var_name)
    if val:
        return val

    # Fallback: load .env files in priority order
    if load_dotenv:
        skill_dir = _scripts_dir.parent
        skills_dir = skill_dir.parent
        claude_dir = skills_dir.parent
        for env_file in [claude_dir / '.env', skills_dir / '.env', skill_dir / '.env']:
            if env_file.exists():
                load_dotenv(env_file, override=True)
        val = os.getenv(var_name)
        if val:
            return val

    return ""


def init_api():
    """Initialize Meta Ads API from env vars."""
    try:
        from facebook_business.api import FacebookAdsApi
        from facebook_business.adobjects.adaccount import AdAccount
    except ImportError:
        print("ERROR: Install facebook-business package: pip install facebook-business")
        sys.exit(1)

    app_id = _resolve("META_APP_ID")
    app_secret = _resolve("META_APP_SECRET")
    access_token = _resolve("META_ACCESS_TOKEN")
    ad_account_id = _resolve("META_AD_ACCOUNT_ID")

    if not access_token:
        print("ERROR: META_ACCESS_TOKEN env var required.")
        print("Setup: export META_APP_ID, META_APP_SECRET, META_ACCESS_TOKEN, META_AD_ACCOUNT_ID")
        sys.exit(1)

    FacebookAdsApi.init(app_id, app_secret, access_token, api_version="v21.0")

    if not ad_account_id.startswith("act_"):
        ad_account_id = f"act_{ad_account_id}"
    return AdAccount(ad_account_id)


def cmd_report(account, args):
    """Get campaign/adset/ad performance insights."""
    from facebook_business.adobjects.adsinsights import AdsInsights

    fields = [
        AdsInsights.Field.campaign_name,
        AdsInsights.Field.campaign_id,
        AdsInsights.Field.impressions,
        AdsInsights.Field.clicks,
        AdsInsights.Field.spend,
        AdsInsights.Field.ctr,
        AdsInsights.Field.cpc,
        AdsInsights.Field.reach,
        AdsInsights.Field.frequency,
        AdsInsights.Field.actions,
        AdsInsights.Field.purchase_roas,
    ]
    params = {
        "date_preset": args.preset,
        "level": args.level,
    }

    insights = account.get_insights(fields=fields, params=params)
    results = []
    for row in insights:
        # Extract conversions from actions
        conversions = 0
        if row.get("actions"):
            for action in row["actions"]:
                if action["action_type"] in ("purchase", "lead", "complete_registration"):
                    conversions += float(action.get("value", 0))

        # Extract ROAS
        roas = 0
        if row.get("purchase_roas"):
            for r in row["purchase_roas"]:
                roas = float(r.get("value", 0))

        results.append({
            "campaign_id": row.get("campaign_id", ""),
            "campaign_name": row.get("campaign_name", ""),
            "impressions": int(row.get("impressions", 0)),
            "clicks": int(row.get("clicks", 0)),
            "spend": float(row.get("spend", 0)),
            "ctr": float(row.get("ctr", 0)),
            "cpc": float(row.get("cpc", 0)),
            "reach": int(row.get("reach", 0)),
            "frequency": float(row.get("frequency", 0)),
            "conversions": conversions,
            "roas": round(roas, 2),
        })

    print(json.dumps(results, indent=2))
    return results


def cmd_create_campaign(account, args):
    """Create a campaign."""
    from facebook_business.adobjects.campaign import Campaign

    # Map common objective names to API values
    objective_map = {
        "traffic": Campaign.Objective.outcome_traffic,
        "awareness": Campaign.Objective.outcome_awareness,
        "engagement": Campaign.Objective.outcome_engagement,
        "leads": Campaign.Objective.outcome_leads,
        "sales": Campaign.Objective.outcome_sales,
        "app_promotion": Campaign.Objective.outcome_app_promotion,
    }
    objective = objective_map.get(args.objective.lower(), args.objective)

    campaign = account.create_campaign(fields=[], params={
        Campaign.Field.name: args.name,
        Campaign.Field.objective: objective,
        Campaign.Field.status: Campaign.Status.paused,
        Campaign.Field.special_ad_categories: [],
    })
    print(json.dumps({"status": "created", "campaign_id": campaign["id"], "name": args.name}))


def cmd_create_adset(account, args):
    """Create an ad set."""
    from facebook_business.adobjects.adset import AdSet

    targeting = {
        "geo_locations": {"countries": args.countries.split(",")},
    }
    if args.age_min:
        targeting["age_min"] = args.age_min
    if args.age_max:
        targeting["age_max"] = args.age_max

    adset = account.create_ad_set(fields=[], params={
        AdSet.Field.name: args.name,
        AdSet.Field.campaign_id: args.campaign_id,
        AdSet.Field.billing_event: AdSet.BillingEvent.impressions,
        AdSet.Field.optimization_goal: AdSet.OptimizationGoal.link_clicks,
        AdSet.Field.daily_budget: int(args.budget * 100),  # cents
        AdSet.Field.targeting: targeting,
        AdSet.Field.status: AdSet.Status.paused,
    })
    print(json.dumps({"status": "created", "adset_id": adset["id"], "name": args.name}))


def cmd_create_ad(account, args):
    """Create an ad with image creative."""
    from facebook_business.adobjects.adimage import AdImage
    from facebook_business.adobjects.adcreative import AdCreative
    from facebook_business.adobjects.ad import Ad

    # Upload image
    img = account.create_ad_image(fields=[], params={
        AdImage.Field.filename: args.image,
    })
    img_hash = img[AdImage.Field.hash]

    # Create creative
    creative = account.create_ad_creative(fields=[], params={
        AdCreative.Field.name: f"Creative-{args.name}",
        AdCreative.Field.object_story_spec: {
            "page_id": args.page_id,
            "link_data": {
                "image_hash": img_hash,
                "link": args.link,
                "message": args.message,
            },
        },
    })

    # Create ad
    ad = account.create_ad(fields=[], params={
        Ad.Field.name: args.name,
        Ad.Field.adset_id: args.adset_id,
        Ad.Field.creative: {"creative_id": creative["id"]},
        Ad.Field.status: Ad.Status.paused,
    })
    print(json.dumps({
        "status": "created",
        "ad_id": ad["id"],
        "creative_id": creative["id"],
        "image_hash": img_hash,
    }))


def cmd_set_status(account, args, status_value):
    """Pause or enable a campaign/adset/ad."""
    from facebook_business.adobjects.campaign import Campaign
    from facebook_business.adobjects.adset import AdSet
    from facebook_business.adobjects.ad import Ad

    obj_map = {
        "campaign": (Campaign, Campaign.Field.status),
        "adset": (AdSet, AdSet.Field.status),
        "ad": (Ad, Ad.Field.status),
    }
    cls, field = obj_map[args.type]
    obj = cls(args.id)
    obj.api_update(fields=[], params={field: status_value})
    print(json.dumps({"status": status_value, "id": args.id, "type": args.type}))


def cmd_update_budget(account, args):
    """Update ad set daily budget."""
    from facebook_business.adobjects.adset import AdSet

    adset = AdSet(args.adset_id)
    adset.api_update(fields=[], params={
        AdSet.Field.daily_budget: int(args.budget * 100),  # cents
    })
    print(json.dumps({"status": "updated", "adset_id": args.adset_id, "daily_budget_usd": args.budget}))


def cmd_list_campaigns(account, args):
    """List campaigns with optional status filter."""
    from facebook_business.adobjects.campaign import Campaign

    fields = [Campaign.Field.id, Campaign.Field.name, Campaign.Field.status,
              Campaign.Field.objective, Campaign.Field.daily_budget]
    params = {}
    if args.status:
        params["filtering"] = [{"field": "status", "operator": "EQUAL", "value": args.status.upper()}]

    campaigns = account.get_campaigns(fields=fields, params=params)
    results = []
    for c in campaigns:
        results.append({
            "id": c["id"],
            "name": c["name"],
            "status": c["status"],
            "objective": c.get("objective", ""),
            "daily_budget": float(c.get("daily_budget", 0)) / 100,
        })
    print(json.dumps(results, indent=2))


def main():
    parser = argparse.ArgumentParser(description="Meta/Facebook Ads Manager CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    # report
    rpt = sub.add_parser("report", help="Campaign performance report")
    rpt.add_argument("--preset", default="last_30d", help="Date preset (last_7d, last_30d, this_month)")
    rpt.add_argument("--level", default="campaign", help="Report level (campaign, adset, ad)")

    # create-campaign
    cc = sub.add_parser("create-campaign", help="Create campaign")
    cc.add_argument("--name", required=True)
    cc.add_argument("--objective", required=True, help="traffic|awareness|engagement|leads|sales")

    # create-adset
    cas = sub.add_parser("create-adset", help="Create ad set")
    cas.add_argument("--campaign-id", required=True)
    cas.add_argument("--name", required=True)
    cas.add_argument("--budget", type=float, required=True, help="Daily budget in USD")
    cas.add_argument("--countries", default="US", help="Comma-separated country codes")
    cas.add_argument("--age-min", type=int, default=None)
    cas.add_argument("--age-max", type=int, default=None)

    # create-ad
    ca = sub.add_parser("create-ad", help="Create ad with image")
    ca.add_argument("--adset-id", required=True)
    ca.add_argument("--name", required=True)
    ca.add_argument("--page-id", required=True, help="Facebook Page ID")
    ca.add_argument("--image", required=True, help="Path to image file")
    ca.add_argument("--link", required=True, help="Destination URL")
    ca.add_argument("--message", required=True, help="Ad primary text")

    # pause
    p = sub.add_parser("pause", help="Pause campaign/adset/ad")
    p.add_argument("--id", required=True)
    p.add_argument("--type", required=True, choices=["campaign", "adset", "ad"])

    # enable
    e = sub.add_parser("enable", help="Enable campaign/adset/ad")
    e.add_argument("--id", required=True)
    e.add_argument("--type", required=True, choices=["campaign", "adset", "ad"])

    # update-budget
    ub = sub.add_parser("update-budget", help="Update ad set budget")
    ub.add_argument("--adset-id", required=True)
    ub.add_argument("--budget", type=float, required=True, help="Daily budget in USD")

    # list-campaigns
    lc = sub.add_parser("list-campaigns", help="List campaigns")
    lc.add_argument("--status", default=None, help="Filter: ACTIVE, PAUSED")

    args = parser.parse_args()
    account = init_api()

    if args.command == "report":
        cmd_report(account, args)
    elif args.command == "create-campaign":
        cmd_create_campaign(account, args)
    elif args.command == "create-adset":
        cmd_create_adset(account, args)
    elif args.command == "create-ad":
        cmd_create_ad(account, args)
    elif args.command == "pause":
        cmd_set_status(account, args, "PAUSED")
    elif args.command == "enable":
        cmd_set_status(account, args, "ACTIVE")
    elif args.command == "update-budget":
        cmd_update_budget(account, args)
    elif args.command == "list-campaigns":
        cmd_list_campaigns(account, args)


if __name__ == "__main__":
    main()
