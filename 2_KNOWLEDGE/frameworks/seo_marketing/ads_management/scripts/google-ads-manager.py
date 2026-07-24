#!/usr/bin/env python3
"""Google Ads API manager — create, modify, analyze campaigns via CLI.

Usage:
  python google-ads-manager.py report [--days 30] [--customer-id ID]
  python google-ads-manager.py create-campaign --name NAME --budget BUDGET [--customer-id ID]
  python google-ads-manager.py pause --campaign-id ID [--customer-id ID]
  python google-ads-manager.py enable --campaign-id ID [--customer-id ID]
  python google-ads-manager.py add-negative-keyword --campaign-id ID --keyword TEXT [--customer-id ID]
  python google-ads-manager.py update-budget --budget-id ID --amount AMOUNT [--customer-id ID]

Requires: pip install google-ads
Config: google-ads.yaml or env vars (GOOGLE_ADS_DEVELOPER_TOKEN, etc.)
"""

import argparse
import json
import os
import sys
import uuid
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


def load_client():
    """Load Google Ads client from yaml or env vars."""
    try:
        from google.ads.googleads.client import GoogleAdsClient
    except ImportError:
        print("ERROR: Install google-ads package: pip install google-ads")
        sys.exit(1)

    # Try yaml first, then env vars
    yaml_paths = ["google-ads.yaml", os.path.expanduser("~/.config/google-ads.yaml")]
    for path in yaml_paths:
        if os.path.exists(path):
            return GoogleAdsClient.load_from_storage(path)

    # Fall back to env vars (using centralized resolver)
    config = {
        "developer_token": _resolve("GOOGLE_ADS_DEVELOPER_TOKEN"),
        "client_id": _resolve("GOOGLE_ADS_CLIENT_ID"),
        "client_secret": _resolve("GOOGLE_ADS_CLIENT_SECRET"),
        "refresh_token": _resolve("GOOGLE_ADS_REFRESH_TOKEN"),
        "login_customer_id": _resolve("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
    }
    if not config["developer_token"]:
        print("ERROR: No google-ads.yaml found and GOOGLE_ADS_DEVELOPER_TOKEN not set.")
        print("Setup: create google-ads.yaml or set env vars (see .env.example)")
        sys.exit(1)
    return GoogleAdsClient.load_from_dict(config)


def get_customer_id(args):
    """Get customer ID from args or env."""
    cid = args.customer_id or _resolve("GOOGLE_ADS_CUSTOMER_ID")
    if not cid:
        print("ERROR: --customer-id required or set GOOGLE_ADS_CUSTOMER_ID env var")
        sys.exit(1)
    return cid.replace("-", "")


def cmd_report(client, args):
    """Get campaign performance report."""
    customer_id = get_customer_id(args)
    days = args.days
    ga_svc = client.get_service("GoogleAdsService")

    query = f"""
        SELECT
            campaign.id, campaign.name, campaign.status,
            metrics.impressions, metrics.clicks, metrics.cost_micros,
            metrics.conversions, metrics.conversions_value,
            metrics.ctr, metrics.average_cpc
        FROM campaign
        WHERE segments.date DURING LAST_{days}_DAYS
          AND campaign.status != 'REMOVED'
        ORDER BY metrics.cost_micros DESC
    """

    stream = ga_svc.search_stream(customer_id=customer_id, query=query)
    results = []
    for batch in stream:
        for row in batch.results:
            cost = row.metrics.cost_micros / 1_000_000
            conv_value = row.metrics.conversions_value
            roas = round(conv_value / cost, 2) if cost > 0 else 0
            results.append({
                "id": str(row.campaign.id),
                "name": row.campaign.name,
                "status": row.campaign.status.name,
                "impressions": row.metrics.impressions,
                "clicks": row.metrics.clicks,
                "cost": round(cost, 2),
                "conversions": round(row.metrics.conversions, 1),
                "roas": roas,
                "ctr": round(row.metrics.ctr * 100, 2),
                "avg_cpc": round(row.metrics.average_cpc / 1_000_000, 2),
            })

    print(json.dumps(results, indent=2))
    return results


def cmd_create_campaign(client, args):
    """Create a search campaign with budget."""
    customer_id = get_customer_id(args)

    # Create budget
    budget_svc = client.get_service("CampaignBudgetService")
    budget_op = client.get_type("CampaignBudgetOperation")
    b = budget_op.create
    b.name = f"Budget-{uuid.uuid4().hex[:8]}"
    b.amount_micros = int(args.budget * 1_000_000)
    b.delivery_method = client.enums.BudgetDeliveryMethodEnum.STANDARD
    budget_resp = budget_svc.mutate_campaign_budgets(
        customer_id=customer_id, operations=[budget_op]
    )
    budget_rn = budget_resp.results[0].resource_name

    # Create campaign (paused by default)
    camp_svc = client.get_service("CampaignService")
    camp_op = client.get_type("CampaignOperation")
    c = camp_op.create
    c.name = args.name
    c.status = client.enums.CampaignStatusEnum.PAUSED
    c.advertising_channel_type = client.enums.AdvertisingChannelTypeEnum.SEARCH
    c.campaign_budget = budget_rn
    c.manual_cpc.enhanced_cpc_enabled = True
    c.network_settings.target_google_search = True
    c.network_settings.target_search_network = False
    camp_resp = camp_svc.mutate_campaigns(
        customer_id=customer_id, operations=[camp_op]
    )
    campaign_rn = camp_resp.results[0].resource_name
    print(json.dumps({
        "status": "created",
        "campaign": campaign_rn,
        "budget": budget_rn,
        "daily_budget_usd": args.budget,
    }, indent=2))


def cmd_set_status(client, args, pause=True):
    """Pause or enable a campaign."""
    customer_id = get_customer_id(args)
    camp_svc = client.get_service("CampaignService")
    camp_op = client.get_type("CampaignOperation")

    # Build resource name from campaign ID
    campaign_rn = camp_svc.campaign_path(customer_id, args.campaign_id)
    c = camp_op.update
    c.resource_name = campaign_rn
    c.status = (
        client.enums.CampaignStatusEnum.PAUSED if pause
        else client.enums.CampaignStatusEnum.ENABLED
    )
    # Set update mask
    from google.api_core import protobuf_helpers
    client.copy_from(camp_op.update_mask, protobuf_helpers.field_mask(None, c._pb))

    camp_svc.mutate_campaigns(customer_id=customer_id, operations=[camp_op])
    status = "PAUSED" if pause else "ENABLED"
    print(json.dumps({"status": status, "campaign_id": args.campaign_id}))


def cmd_add_negative_keyword(client, args):
    """Add a negative keyword to a campaign."""
    customer_id = get_customer_id(args)
    camp_svc = client.get_service("CampaignService")
    criterion_svc = client.get_service("CampaignCriterionService")
    criterion_op = client.get_type("CampaignCriterionOperation")

    campaign_rn = camp_svc.campaign_path(customer_id, args.campaign_id)
    neg = criterion_op.create
    neg.campaign = campaign_rn
    neg.negative = True
    neg.keyword.text = args.keyword
    neg.keyword.match_type = client.enums.KeywordMatchTypeEnum.BROAD

    criterion_svc.mutate_campaign_criteria(
        customer_id=customer_id, operations=[criterion_op]
    )
    print(json.dumps({"status": "added", "keyword": args.keyword, "type": "negative_broad"}))


def cmd_update_budget(client, args):
    """Update a campaign budget."""
    customer_id = get_customer_id(args)
    budget_svc = client.get_service("CampaignBudgetService")
    budget_op = client.get_type("CampaignBudgetOperation")

    budget_rn = budget_svc.campaign_budget_path(customer_id, args.budget_id)
    b = budget_op.update
    b.resource_name = budget_rn
    b.amount_micros = int(args.amount * 1_000_000)

    from google.api_core import protobuf_helpers
    client.copy_from(budget_op.update_mask, protobuf_helpers.field_mask(None, b._pb))

    budget_svc.mutate_campaign_budgets(
        customer_id=customer_id, operations=[budget_op]
    )
    print(json.dumps({"status": "updated", "budget_id": args.budget_id, "daily_budget_usd": args.amount}))


def main():
    parser = argparse.ArgumentParser(description="Google Ads Manager CLI")
    parser.add_argument("--customer-id", help="Google Ads customer ID (10 digits, no hyphens)")
    sub = parser.add_subparsers(dest="command", required=True)

    # report
    rpt = sub.add_parser("report", help="Campaign performance report")
    rpt.add_argument("--days", type=int, default=30, help="Lookback days (default: 30)")

    # create-campaign
    cc = sub.add_parser("create-campaign", help="Create search campaign")
    cc.add_argument("--name", required=True, help="Campaign name")
    cc.add_argument("--budget", type=float, required=True, help="Daily budget in USD")

    # pause
    p = sub.add_parser("pause", help="Pause a campaign")
    p.add_argument("--campaign-id", required=True, help="Campaign ID")

    # enable
    e = sub.add_parser("enable", help="Enable a campaign")
    e.add_argument("--campaign-id", required=True, help="Campaign ID")

    # add-negative-keyword
    nk = sub.add_parser("add-negative-keyword", help="Add negative keyword")
    nk.add_argument("--campaign-id", required=True, help="Campaign ID")
    nk.add_argument("--keyword", required=True, help="Keyword text")

    # update-budget
    ub = sub.add_parser("update-budget", help="Update campaign budget")
    ub.add_argument("--budget-id", required=True, help="Budget ID")
    ub.add_argument("--amount", type=float, required=True, help="New daily budget in USD")

    args = parser.parse_args()
    client = load_client()

    commands = {
        "report": cmd_report,
        "create-campaign": cmd_create_campaign,
        "pause": lambda c, a: cmd_set_status(c, a, pause=True),
        "enable": lambda c, a: cmd_set_status(c, a, pause=False),
        "add-negative-keyword": cmd_add_negative_keyword,
        "update-budget": cmd_update_budget,
    }
    commands[args.command](client, args)


if __name__ == "__main__":
    main()
