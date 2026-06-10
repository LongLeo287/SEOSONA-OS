#!/usr/bin/env python3
"""
SEOSONA OS SEO Dashboard v4.

Operational dashboard generator using SEOSONA audit exports as inputs.
Design goals:
- Decision-first SEO command center, not a decorative report.
- Responsive desktop/tablet/mobile UX with motion and interactive controls.
- Safe HTML output: all external/data values are escaped before rendering.
- Clear source readiness and falsifiable action plan.
"""

from __future__ import annotations

import argparse
import csv
import html
import json
import re
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        return {"defaults": {"target_domain": "example.com", "output_dir": "3_MEMORY/seo_exports"}}
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def clean_domain(domain: str) -> str:
    domain = (domain or "").strip()
    if not re.fullmatch(r"[A-Za-z0-9.-]{1,253}", domain):
        raise ValueError(f"Unsafe domain value: {domain!r}")
    return domain


def esc(value) -> str:
    return html.escape("" if value is None else str(value), quote=True)


def read_csv(path: Path | None) -> list[dict]:
    if not path or not path.exists():
        return []
    for encoding in ("utf-8-sig", "utf-8", "cp1258", "cp1252"):
        try:
            with path.open(newline="", encoding=encoding) as f:
                return list(csv.DictReader(f))
        except UnicodeDecodeError:
            continue
    return []


def latest_file(directory: Path, pattern: str) -> Path | None:
    files = sorted(directory.glob(pattern), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def is_marker(rows: Iterable[dict]) -> bool:
    marker_words = {"not_configured", "repair_marker", "not_available", "credentials unavailable"}
    for row in rows:
        text = " ".join(str(v).lower() for v in row.values())
        if any(word in text for word in marker_words):
            return True
    return False


def to_int(value, default=0) -> int:
    try:
        return int(float(str(value).replace(",", "").strip()))
    except Exception:
        return default


def source_state(rows: list[dict], connected_label="Connected", pending_label="Setup required") -> tuple[str, str]:
    if not rows:
        return pending_label, "amber"
    if is_marker(rows):
        return pending_label, "amber"
    return connected_label, "green"


def priority_counts(rows: list[dict]) -> Counter:
    counts = Counter()
    for row in rows:
        p = str(row.get("priority") or row.get("severity") or "").upper()
        if "P1" in p or "CRITICAL" in p:
            counts["P1"] += 1
        elif "P2" in p or "HIGH" in p:
            counts["P2"] += 1
        elif "P3" in p or "MEDIUM" in p:
            counts["P3"] += 1
    return counts


def get_data(domain_dir: Path) -> dict:
    paths = {
        "gsc": latest_file(domain_dir, "gsc_report_*.csv"),
        "ga4": latest_file(domain_dir, "ga4_report_*.csv"),
        "technical": latest_file(domain_dir, "technical_seo_*.csv"),
        "schema": latest_file(domain_dir, "schema_report_*.csv"),
        "eeat": latest_file(domain_dir, "eeat_report_*.csv"),
        "keywords": latest_file(domain_dir, "keyword_research_*_autocomplete.csv") or latest_file(domain_dir, "keyword_research_*.csv"),
        "backlinks": latest_file(domain_dir, "backlink_report_*.csv"),
        "cwv": latest_file(domain_dir, "cwv_report_*.csv"),
        "content_gaps": latest_file(domain_dir, "content_gaps_*.csv"),
        "aeo": latest_file(domain_dir, "aeo_readiness_*.csv"),
    }
    data = {key: read_csv(path) for key, path in paths.items()}
    data["_paths"] = paths
    return data


def build_model(domain: str, data: dict) -> dict:
    tech_rows = data["technical"]
    schema_rows = data["schema"]
    keyword_rows = data["keywords"]
    cwv_rows = data["cwv"]
    gsc_rows = data["gsc"]
    ga4_rows = data["ga4"]
    backlink_rows = data["backlinks"]

    tech_issue_count = sum(to_int(r.get("issue_count", 0)) for r in tech_rows)
    schema_issue_count = sum(to_int(r.get("issue_count", 0)) for r in schema_rows)
    schema_critical = sum(1 for r in schema_rows if "critical" in str(r.get("severity", "")).lower())
    thin_pages = sum(1 for r in data["eeat"] if str(r.get("is_thin", "")).lower() in {"true", "1", "yes"})
    mobile_score = next((to_int(r.get("performance_score"), -1) for r in cwv_rows if str(r.get("strategy", "")).lower() == "mobile"), -1)
    desktop_score = next((to_int(r.get("performance_score"), -1) for r in cwv_rows if str(r.get("strategy", "")).lower() == "desktop"), -1)

    score = 100
    score -= min(tech_issue_count * 2, 18)
    score -= min(schema_critical * 10 + schema_issue_count, 24)
    score -= min(thin_pages * 5, 15)
    if mobile_score >= 0:
        score -= max(0, 60 - mobile_score)
    if is_marker(gsc_rows):
        score -= 5
    if is_marker(ga4_rows):
        score -= 5
    score = max(5, min(100, score))
    grade = "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 65 else "D" if score >= 50 else "F"

    actions = [
        {
            "priority": "P0",
            "area": "Security",
            "title": "Escape every dashboard value rendered from CSV or crawled pages",
            "verification": "Inject a script-like value in a fixture CSV and confirm the dashboard renders text, not executable HTML.",
        },
        {
            "priority": "P1",
            "area": "Reliability",
            "title": "Reject marker-only artifacts in audit status gates",
            "verification": "Run npm status with not_configured rows only; it must fail with a clear diagnostic.",
        },
        {
            "priority": "P1",
            "area": "Analytics",
            "title": "Install GA4 dependency and set GA4_PROPERTY_ID in 1_CONFIG/.env",
            "verification": "setup_check.py reports GA4 ready and ga4_report contains non-marker session rows.",
        },
        {
            "priority": "P2",
            "area": "Performance",
            "title": "Retry PageSpeed connector and stabilize mobile CWV monitoring",
            "verification": "cwv_report contains fresh mobile and desktop rows with LCP, INP, CLS fields.",
        },
        {
            "priority": "P2",
            "area": "Schema",
            "title": "Resolve critical schema issues and add missing entity fields",
            "verification": "Rich Results Test returns zero critical schema errors for the homepage.",
        },
    ]

    return {
        "domain": domain,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "score": score,
        "grade": grade,
        "tech_issue_count": tech_issue_count,
        "schema_issue_count": schema_issue_count,
        "schema_critical": schema_critical,
        "thin_pages": thin_pages,
        "keyword_count": len(keyword_rows),
        "mobile_score": mobile_score,
        "desktop_score": desktop_score,
        "sources": {
            "gsc": source_state(gsc_rows, "Connected", "Setup required"),
            "ga4": source_state(ga4_rows, "Connected", "Setup required"),
            "cwv": source_state(cwv_rows, "Measured", "Verify key"),
            "backlinks": source_state(backlink_rows, "Measured", "Setup required"),
        },
        "priority_counts": priority_counts(keyword_rows + schema_rows),
        "actions": actions,
    }


def pill(label: str, tone: str = "neutral") -> str:
    return f'<span class="pill {esc(tone)}">{esc(label)}</span>'


def metric(label: str, value: str, sub: str, tone: str) -> str:
    return f"""
      <article class="card metric {esc(tone)}">
        <div class="metric-label">{esc(label)}</div>
        <div class="metric-value">{esc(value)}</div>
        <div class="muted">{esc(sub)}</div>
      </article>"""


def rows_table(rows: list[dict], columns: list[tuple[str, str]], limit=8) -> str:
    if not rows:
        return '<div class="empty-state">No measured rows yet.</div>'
    header = "".join(f"<strong>{esc(label)}</strong>" for _, label in columns)
    body = [f'<div class="data-row muted" style="--cols:{len(columns)}">{header}</div>']
    for row in rows[:limit]:
        cells = "".join(f"<span>{esc(row.get(key, ''))}</span>" for key, _ in columns)
        body.append(f'<div class="data-row" style="--cols:{len(columns)}">{cells}</div>')
    return "\n".join(body)


def render_dashboard(domain: str, data: dict, model: dict) -> str:
    gsc_label, gsc_tone = model["sources"]["gsc"]
    ga4_label, ga4_tone = model["sources"]["ga4"]
    cwv_label, cwv_tone = model["sources"]["cwv"]
    backlink_label, backlink_tone = model["sources"]["backlinks"]
    mobile = "Pending" if model["mobile_score"] < 0 else str(model["mobile_score"])
    desktop = "Pending" if model["desktop_score"] < 0 else str(model["desktop_score"])
    actions_html = "\n".join(
        f"""
        <div class="issue-row" data-priority="{esc(a['priority'] + ' ' + a['area'])}">
          {pill(a['priority'], 'red' if a['priority'] in {'P0','P1'} else 'amber')}
          <strong>{esc(a['title'])}</strong>
          <span class="muted">{esc(a['area'])}</span>
          <small>{esc(a['verification'])}</small>
        </div>"""
        for a in model["actions"]
    )

    keyword_clusters = Counter(row.get("group", "Ungrouped") or "Ungrouped" for row in data["keywords"])
    cluster_cards = "".join(
        f'<article class="card"><h3>{esc(name)}</h3><p class="muted">{count} keyword opportunities</p></article>'
        for name, count in keyword_clusters.most_common(6)
    ) or '<div class="empty-state">No keyword clusters yet.</div>'

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SEOSONA SEO Dashboard v4 - {esc(domain)}</title>
  <style>
    :root {{ --bg:#f6f7f3; --surface:#fff; --surface-soft:#ecefe7; --ink:#18181b; --muted:#6b7280; --line:#dde2d6; --sidebar:#0a0a0a; --action:#0a0a0a; --green:#16803c; --green-soft:#e6f4ea; --amber:#b7791f; --amber-soft:#fff4d8; --red:#c24132; --red-soft:#fcedea; --blue:#2563eb; --blue-soft:#e8f0ff; --violet:#6d5bd0; --violet-soft:#f0edff; --radius:8px; --font:Poppins,Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }}
    body[data-theme=dark] {{ --bg:#11120f; --surface:#191a16; --surface-soft:#25271f; --ink:#f5f5ef; --muted:#a6aa9d; --line:#34382c; --sidebar:#080906; --action:#f5f5ef; --green-soft:#123522; --amber-soft:#38280d; --red-soft:#3d1713; --blue-soft:#142541; --violet-soft:#251f42; }}
    * {{ box-sizing:border-box; }} html {{ scroll-behavior:smooth; }} body {{ margin:0; background:var(--bg); color:var(--ink); font:14px var(--font); transition:background .25s ease,color .25s ease; }} ::selection {{ background:var(--action); color:var(--surface); }}
    .app {{ min-height:100vh; display:grid; grid-template-columns:280px minmax(0,1fr); }} main {{ width:100%; max-width:none; min-width:0; padding:32px 40px 48px; }}
    .sidebar {{ position:sticky; top:0; z-index:40; height:100vh; padding:28px 20px; background:var(--sidebar); color:#fff; transition:transform .3s ease; }} .brand {{ display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:28px; padding-bottom:24px; border-bottom:1px solid #2a2a2a; }} .brand h1 {{ margin:0 0 6px; font-size:21px; line-height:1; }} .brand p {{ margin:0; color:#a1a1aa; font-size:12px; }}
    .nav {{ display:grid; gap:8px; }} .nav a {{ min-height:36px; padding:0 12px; display:flex; align-items:center; justify-content:space-between; border-radius:6px; color:#a1a1aa; text-decoration:none; font-weight:700; transition:.18s ease; }} .nav a:hover {{ transform:translateX(2px); background:#1f1f1f; color:#fff; }} .nav a.active {{ background:#fff; color:#0a0a0a; }} .count {{ min-width:24px; height:20px; display:inline-grid; place-items:center; border-radius:999px; background:#262626; color:#d4d4d8; font-size:11px; }}
    .side-note {{ position:absolute; left:20px; right:20px; bottom:28px; padding:16px; border:1px solid #2a2a2a; border-radius:var(--radius); background:#151515; }} .side-note span {{ color:#a1a1aa; font-size:12px; line-height:1.5; }}
    .mobile-topbar {{ display:none; position:sticky; top:0; z-index:30; height:60px; padding:0 16px; align-items:center; justify-content:space-between; background:color-mix(in srgb,var(--surface) 92%,transparent); border-bottom:1px solid var(--line); backdrop-filter:blur(18px); }}
    .icon-btn {{ width:36px; height:36px; display:grid; place-items:center; padding:0; border-radius:6px; }} .icon-btn span,.icon-btn span:before,.icon-btn span:after {{ width:16px; height:2px; display:block; background:currentColor; border-radius:999px; content:""; position:relative; }} .icon-btn span:before,.icon-btn span:after {{ position:absolute; left:0; }} .icon-btn span:before {{ top:-5px; }} .icon-btn span:after {{ top:5px; }}
    .topbar {{ display:grid; grid-template-columns:minmax(520px,1fr) minmax(420px,auto); gap:24px; align-items:start; margin-bottom:24px; }} .eyebrow {{ color:var(--muted); font-size:12px; font-weight:900; margin-bottom:8px; }} h2 {{ margin:0; font-size:34px; line-height:1.14; }} h3 {{ margin:0 0 16px; font-size:16px; }} .subtitle,.muted {{ color:var(--muted); line-height:1.6; }}
    .actions,.toolbar,.ia {{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; }} .actions {{ justify-content:flex-end; }} button {{ height:36px; border:1px solid var(--line); background:var(--surface); color:var(--ink); border-radius:6px; padding:0 14px; font-weight:900; cursor:pointer; transition:.18s ease; }} button.primary {{ background:var(--action); color:var(--surface); border-color:var(--action); }} button:hover {{ transform:translateY(-1px); box-shadow:0 8px 22px rgba(24,24,27,.08); }}
    .grid {{ display:grid; gap:16px; }} .hero-grid {{ grid-template-columns:minmax(300px,.8fr) minmax(520px,1.55fr) minmax(300px,.85fr); }} .metric-grid {{ grid-template-columns:repeat(4,minmax(220px,1fr)); margin:16px 0; }} .work-grid {{ grid-template-columns:minmax(620px,1.45fr) minmax(480px,1fr); }} .subgrid-3 {{ grid-template-columns:repeat(3,minmax(260px,1fr)); }} .subgrid-2 {{ grid-template-columns:repeat(2,minmax(360px,1fr)); }}
    .card {{ background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:22px; min-width:0; transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease; }} .card:hover {{ transform:translateY(-2px); border-color:color-mix(in srgb,var(--action) 18%,var(--line)); box-shadow:0 18px 44px rgba(24,24,27,.08); }}
    .pill,.chip {{ display:inline-flex; align-items:center; border-radius:999px; font-size:12px; font-weight:900; white-space:nowrap; transition:.18s ease; }} .pill {{ height:28px; padding:0 12px; }} .chip {{ height:32px; padding:0 12px; border:1px solid var(--line); color:var(--muted); cursor:pointer; }} .chip:hover,.chip.active {{ background:var(--action); color:var(--surface); border-color:var(--action); transform:translateY(-1px); }} .green {{ background:var(--green-soft); color:var(--green); }} .amber {{ background:var(--amber-soft); color:var(--amber); }} .red {{ background:var(--red-soft); color:var(--red); }} .blue {{ background:var(--blue-soft); color:var(--blue); }} .violet {{ background:var(--violet-soft); color:var(--violet); }} .neutral {{ background:var(--surface-soft); color:var(--muted); }}
    .score-value {{ font-size:72px; line-height:.9; font-weight:1000; }} .progress {{ height:8px; border-radius:999px; background:var(--surface-soft); overflow:hidden; margin:20px 0 12px; }} .progress span {{ display:block; width:{model['score']}%; height:100%; background:var(--green); transform-origin:left; animation:grow .8s ease both; }} @keyframes grow {{ from {{ transform:scaleX(.25); opacity:.55; }} to {{ transform:scaleX(1); opacity:1; }} }}
    .metric {{ position:relative; min-height:112px; padding-left:24px; }} .metric:before {{ content:""; position:absolute; left:0; top:0; bottom:0; width:4px; border-radius:4px; background:var(--blue); }} .metric.green:before {{ background:var(--green); }} .metric.amber:before {{ background:var(--amber); }} .metric.red:before {{ background:var(--red); }} .metric.violet:before {{ background:var(--violet); }} .metric-label {{ color:var(--muted); font-size:12px; font-weight:900; margin-bottom:8px; }} .metric-value {{ font-size:30px; line-height:1; font-weight:1000; margin-bottom:8px; }}
    .source-row,.issue-row,.data-row,.check {{ display:grid; gap:12px; align-items:center; border-top:1px solid var(--line); padding:12px 0; transition:.18s ease; }} .source-row {{ grid-template-columns:150px minmax(0,1fr) auto; }} .issue-row {{ grid-template-columns:52px minmax(0,1fr) 110px; }} .issue-row small {{ grid-column:2 / -1; color:var(--muted); }} .data-row {{ grid-template-columns:repeat(var(--cols),minmax(0,1fr)); overflow-wrap:anywhere; }} .check {{ grid-template-columns:24px minmax(0,1fr) auto; }} .source-row:first-of-type,.issue-row:first-of-type,.data-row:first-of-type,.check:first-child {{ border-top:0; }} .source-row:hover,.issue-row:hover,.data-row:hover,.check:hover {{ background:color-mix(in srgb,var(--surface-soft) 42%,transparent); padding-left:8px; padding-right:8px; border-radius:6px; }}
    .empty-state {{ border:1px dashed var(--line); border-radius:var(--radius); padding:18px; background:color-mix(in srgb,var(--surface) 80%,var(--surface-soft)); color:var(--muted); line-height:1.6; }} .mini-chart {{ height:108px; display:flex; align-items:end; gap:8px; padding-top:12px; }} .mini-chart span {{ flex:1; display:block; min-height:18px; border-radius:6px 6px 0 0; background:var(--action); animation:rise .7s ease both; }} @keyframes rise {{ from {{ transform:scaleY(.2); opacity:.4; }} to {{ transform:scaleY(1); opacity:1; }} }}
    .section-page {{ margin-top:20px; scroll-margin-top:28px; }} .page-end-spacer {{ height:55vh; min-height:360px; pointer-events:none; }} .section-head {{ display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--line); }} .section-head h3 {{ font-size:18px; margin-bottom:6px; }} .dot {{ width:12px; height:12px; border-radius:999px; background:var(--amber); margin-left:6px; }} .dot.green {{ background:var(--green); }} .dot.red {{ background:var(--red); }}
    details {{ border-top:1px solid var(--line); padding:12px 0; }} summary {{ cursor:pointer; font-weight:900; list-style:none; display:flex; justify-content:space-between; gap:16px; }} summary::-webkit-details-marker {{ display:none; }} summary:after {{ content:"+"; color:var(--muted); }} details[open] summary:after {{ content:"-"; }} details p {{ margin:10px 0 0; color:var(--muted); line-height:1.6; }}
    .toast {{ position:fixed; right:24px; bottom:24px; z-index:80; background:var(--action); color:var(--surface); border-radius:8px; padding:12px 14px; box-shadow:0 18px 46px rgba(0,0,0,.18); transform:translateY(18px); opacity:0; pointer-events:none; transition:.24s ease; }} .toast.show {{ transform:translateY(0); opacity:1; }}
    .command {{ position:fixed; inset:0; z-index:90; display:none; place-items:start center; padding-top:9vh; background:rgba(10,10,10,.35); backdrop-filter:blur(12px); }} .command.open {{ display:grid; }} .command-panel {{ width:min(720px,calc(100vw - 32px)); background:var(--surface); border:1px solid var(--line); border-radius:10px; box-shadow:0 26px 80px rgba(0,0,0,.22); overflow:hidden; }} .command input {{ width:100%; height:56px; border:0; border-bottom:1px solid var(--line); padding:0 18px; font:900 15px var(--font); background:var(--surface); color:var(--ink); outline:none; }} .command-list {{ max-height:360px; overflow:auto; padding:8px; }} .command-item {{ display:flex; justify-content:space-between; gap:16px; padding:12px; border-radius:8px; cursor:pointer; }} .command-item:hover {{ background:var(--surface-soft); }}
    .bottom-nav {{ display:none; position:fixed; left:12px; right:12px; bottom:12px; z-index:35; background:color-mix(in srgb,var(--surface) 92%,transparent); border:1px solid var(--line); border-radius:10px; box-shadow:0 16px 48px rgba(24,24,27,.16); backdrop-filter:blur(18px); grid-template-columns:repeat(4,1fr); overflow:hidden; }} .bottom-nav a {{ text-decoration:none; color:var(--muted); font-weight:900; font-size:12px; padding:13px 6px; text-align:center; }} .bottom-nav a.active {{ color:var(--ink); background:var(--surface-soft); }} .scrim {{ display:none; position:fixed; inset:0; z-index:34; background:rgba(0,0,0,.36); backdrop-filter:blur(4px); }}
    @media(max-width:1240px) {{ .app {{ grid-template-columns:232px minmax(0,1fr); }} .sidebar {{ padding:24px 16px; }} .topbar {{ grid-template-columns:1fr; }} .actions {{ justify-content:flex-start; }} .hero-grid {{ grid-template-columns:1fr 1fr; }} .hero-grid>.card:last-child {{ grid-column:1/-1; }} .metric-grid {{ grid-template-columns:repeat(2,minmax(0,1fr)); }} .work-grid {{ grid-template-columns:1fr; }} main {{ padding:28px; }} }}
    @media(max-width:980px) {{ .app {{ grid-template-columns:1fr; }} .mobile-topbar {{ display:flex; }} .sidebar {{ position:fixed; left:0; top:0; width:min(304px,86vw); transform:translateX(-105%); box-shadow:20px 0 60px rgba(0,0,0,.28); }} body.nav-open .sidebar {{ transform:translateX(0); }} body.nav-open .scrim {{ display:block; }} main {{ padding:24px 18px 96px; }} .topbar,.hero-grid,.metric-grid,.work-grid,.subgrid-3,.subgrid-2 {{ grid-template-columns:1fr; }} h2 {{ font-size:26px; }} .actions {{ justify-content:stretch; }} .actions button {{ flex:1; }} .section-head {{ display:grid; }} .source-row,.issue-row,.data-row,.check {{ grid-template-columns:1fr !important; gap:8px; }} .issue-row small {{ grid-column:auto; }} .bottom-nav {{ display:grid; }} .side-note {{ position:static; margin-top:24px; }} .page-end-spacer {{ height:42vh; min-height:280px; }} }}
    @media(max-width:520px) {{ main {{ padding-left:14px; padding-right:14px; }} .card {{ padding:16px; }} .score-value {{ font-size:58px; }} button {{ width:100%; }} }}
    @media(prefers-reduced-motion:reduce) {{ *,*:before,*:after {{ animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; scroll-behavior:auto!important; }} }}
  </style>
</head>
<body>
  <header class="mobile-topbar"><button class="icon-btn" type="button" data-toggle-nav aria-label="Open navigation"><span></span></button><strong>SEOSONA SEO</strong><button class="icon-btn" type="button" data-command aria-label="Open command search"><span></span></button></header>
  <div class="scrim" data-close-nav></div>
  <div class="app">
    <aside class="sidebar">
      <div class="brand"><div><h1>SEOSONA</h1><p>SEO OS v4</p></div>{pill('LIVE', 'green')}</div>
      <nav class="nav" aria-label="Dashboard sections">
        <a class="active" href="#overview"><span>Overview</span></a><a href="#rankings"><span>Rankings</span></a><a href="#analytics"><span>Analytics</span></a><a href="#keywords"><span>Keywords</span></a><a href="#technical"><span>Technical SEO</span><span class="count">{model['tech_issue_count']}</span></a><a href="#schema"><span>Schema</span><span class="count">{model['schema_issue_count']}</span></a><a href="#authority"><span>Authority</span></a><a href="#vitals"><span>Core Web Vitals</span></a><a href="#action-plan"><span>Action Plan</span><span class="count">{len(model['actions'])}</span></a>
      </nav>
      <div class="side-note"><strong>Data readiness</strong><span>GSC: {esc(gsc_label)}. GA4: {esc(ga4_label)}. CWV: {esc(cwv_label)}. Authority: {esc(backlink_label)}.</span></div>
    </aside>
    <main>
      <section class="section-page" id="overview"><div class="topbar"><div><div class="eyebrow">SEO COMMAND CENTER</div><h2>{esc(domain)} audit workspace</h2><p class="subtitle">Decision-first dashboard generated from SEOSONA OS exports. It prioritizes source readiness, issue severity, falsifiable actions, and responsive workflows across desktop, tablet, and mobile.</p></div><div class="actions">{pill(model['grade'] + ' ' + str(model['score']), 'green' if model['score'] >= 80 else 'amber')}{pill('Private demo', 'blue')}<button type="button" data-command>Search</button><button type="button" data-theme-toggle>Theme</button><button type="button" data-toast="Report export queued">Export report</button><button type="button" class="primary" data-run>Run audit</button></div></div>
      <div class="grid hero-grid">
        <article class="card"><h3>Overall health</h3><div class="score-value">{model['score']}</div>{pill('Grade ' + model['grade'], 'green' if model['score'] >= 80 else 'amber')}<div class="progress"><span></span></div><p class="muted">Generated {esc(model['generated_at'])}. Score combines technical, schema, content, source readiness, and CWV signals.</p></article>
        <article class="card"><h3>Source readiness</h3><div class="source-row"><strong>GSC</strong><span class="muted">Queries, CTR, rankings</span>{pill(gsc_label, gsc_tone)}</div><div class="source-row"><strong>GA4</strong><span class="muted">Sessions, channels, organic pages</span>{pill(ga4_label, ga4_tone)}</div><div class="source-row"><strong>PageSpeed</strong><span class="muted">LCP, INP, CLS, Lighthouse</span>{pill(cwv_label, cwv_tone)}</div><div class="source-row"><strong>Authority</strong><span class="muted">Backlinks and competitors</span>{pill(backlink_label, backlink_tone)}</div></article>
        <article class="card"><h3>Next actions</h3>{''.join(f'<div class="issue-row">{pill(a["priority"], "red" if a["priority"] in {"P0","P1"} else "amber")}<strong>{esc(a["title"])}</strong><span class="muted">{esc(a["area"])}</span></div>' for a in model['actions'][:3])}</article>
      </div>
      <div class="grid metric-grid">{metric('Technical issues', str(model['tech_issue_count']), 'crawl/index/page checks', 'green' if model['tech_issue_count'] == 0 else 'amber')}{metric('Schema issues', str(model['schema_issue_count']), f"{model['schema_critical']} critical", 'red' if model['schema_critical'] else 'amber')}{metric('Keywords', f"{model['keyword_count']:,}", 'autocomplete opportunities', 'violet')}{metric('Mobile PSI', mobile, 'PageSpeed mobile score', 'red' if model['mobile_score'] < 60 else 'green')}</div>
      <div class="grid work-grid"><article class="card"><h3>Prioritized issue queue</h3><div class="toolbar" data-filter-group><span class="chip active" data-filter="all">All</span><span class="chip" data-filter="P0">P0</span><span class="chip" data-filter="P1">P1</span><span class="chip" data-filter="P2">P2</span><span class="chip" data-filter="Security">Security</span></div>{actions_html}</article><article class="card"><h3>Top opportunities</h3>{rows_table(data['keywords'], [('keyword','Keyword'),('priority','Priority'),('intent','Intent')], 8)}</article></div></section>
      <section class="card section-page" id="rankings"><div class="section-head"><div><h3>Rankings</h3><p class="muted">Search Console queries, CTR opportunities, quick wins, and AI overview candidates.</p></div>{pill(gsc_label, gsc_tone)}</div>{rows_table(data['gsc'], [('query','Query'),('clicks','Clicks'),('impressions','Impr.'),('avg_position','Pos.')], 8)}</section>
      <section class="card section-page" id="analytics"><div class="section-head"><div><h3>Analytics</h3><p class="muted">GA4 sessions, channels, organic landing pages, and conversion direction.</p></div>{pill(ga4_label, ga4_tone)}</div><div class="grid subgrid-2"><div>{rows_table(data['ga4'], [('metric_type','Metric'),('dimension','Dimension'),('value_1','Value')], 6)}</div><div class="mini-chart"><span style="height:34%"></span><span style="height:54%"></span><span style="height:44%"></span><span style="height:72%"></span><span style="height:61%"></span><span style="height:86%"></span></div></div></section>
      <section class="card section-page" id="keywords"><div class="section-head"><div><h3>Keywords</h3><p class="muted">Demand discovery, topical clusters, and content gaps.</p></div>{pill(f"{model['keyword_count']:,} found", 'violet')}</div><div class="grid subgrid-3">{cluster_cards}</div></section>
      <section class="card section-page" id="technical"><div class="section-head"><div><h3>Technical SEO</h3><p class="muted">Crawlability, indexability, metadata quality, canonical rules, robots, and sitemap health.</p></div>{pill(str(model['tech_issue_count']) + ' issues', 'green' if model['tech_issue_count'] == 0 else 'amber')}</div>{rows_table(data['technical'], [('url','URL'),('status','Status'),('title_len','Title'),('meta_desc_len','Meta'),('issue_count','Issues')], 8)}<details><summary>Falsifiability checks</summary><p>Run a controlled fixture with broken title, missing viewport, blocked robots, and unsafe canonical. The scanner and dashboard must surface every issue with deterministic severity.</p></details></section>
      <section class="card section-page" id="schema"><div class="section-head"><div><h3>Schema</h3><p class="muted">Structured data coverage and AI-search entity confidence.</p></div>{pill(str(model['schema_issue_count']) + ' issues', 'red' if model['schema_critical'] else 'amber')}</div>{rows_table(data['schema'], [('url','URL'),('schema_types','Types'),('severity','Severity'),('issue','Issue'),('fix','Fix')], 8)}<details><summary>Rollout sequence</summary><p>Start with Organization and WebSite, add Breadcrumb where navigation exists, then Product, FAQ, Article, LocalBusiness, and Review only where visible page content supports the markup.</p></details></section>
      <section class="card section-page" id="authority"><div class="section-head"><div><h3>Authority</h3><p class="muted">Backlink sources, brand mentions, competitor authority, and outreach targets.</p></div>{pill(backlink_label, backlink_tone)}</div>{rows_table(data['backlinks'], [('source_domain','Source'),('target_domain','Target'),('notes','Notes'),('data_source','Source type')], 8)}</section>
      <section class="card section-page" id="vitals"><div class="section-head"><div><h3>Core Web Vitals</h3><p class="muted">Mobile and desktop Lighthouse/CWV monitoring.</p></div>{pill(cwv_label, cwv_tone)}</div><div class="grid subgrid-3">{metric('Mobile', mobile, 'performance score', 'red' if model['mobile_score'] < 60 else 'green')}{metric('Desktop', desktop, 'performance score', 'amber' if model['desktop_score'] < 80 else 'green')}{metric('Thin pages', str(model['thin_pages']), 'E-E-A-T content risk', 'green' if model['thin_pages'] == 0 else 'amber')}</div>{rows_table(data['cwv'], [('strategy','Device'),('performance_score','Score'),('lcp_display','LCP'),('cls_display','CLS'),('field_inp_category','INP')], 4)}</section>
      <section class="card section-page" id="action-plan"><div class="section-head"><div><h3>Action Plan</h3><p class="muted">Execution queue grouped by severity, owner, and validation rule. Every action carries a falsifiability check.</p></div>{pill(str(len(model['actions'])) + ' open', 'red')}</div>{actions_html}</section>
      <div class="page-end-spacer" aria-hidden="true"></div>
    </main>
  </div>
  <nav class="bottom-nav" aria-label="Mobile dashboard navigation"><a class="active" href="#overview">Home</a><a href="#rankings">Rankings</a><a href="#technical">Tech</a><a href="#action-plan">Actions</a></nav>
  <div class="command" data-command-panel role="dialog" aria-modal="true" aria-label="Command search"><div class="command-panel"><input data-command-input placeholder="Search dashboard sections" autocomplete="off"><div class="command-list" data-command-list></div></div></div><div class="toast" data-toast-box></div>
  <script>
    const body=document.body,navLinks=[...document.querySelectorAll('.nav a,.bottom-nav a')],sections=['overview','rankings','analytics','keywords','technical','schema','authority','vitals','action-plan'].map(id=>document.getElementById(id)).filter(Boolean),toastBox=document.querySelector('[data-toast-box]');
    function toast(m){{toastBox.textContent=m;toastBox.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>toastBox.classList.remove('show'),2200);}}
    let navLockUntil=0;
    function setActiveNav(id){{navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===`#${{id}}`));}}
    function goToSection(id){{const target=document.getElementById(id);if(!target)return;navLockUntil=Date.now()+900;const top=target.getBoundingClientRect().top+window.scrollY-24;window.scrollTo({{top:Math.max(0,top),behavior:'smooth'}});setActiveNav(id);setTimeout(()=>setActiveNav(id),560);body.classList.remove('nav-open');}}
    document.querySelectorAll('[data-toggle-nav]').forEach(b=>b.addEventListener('click',()=>body.classList.toggle('nav-open')));document.querySelectorAll('[data-close-nav]').forEach(el=>el.addEventListener('click',()=>body.classList.remove('nav-open')));
    navLinks.forEach(link=>link.addEventListener('click',e=>{{const href=link.getAttribute('href')||'';if(href.startsWith('#')){{e.preventDefault();goToSection(href.slice(1));}}}}));
    document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{{body.dataset.theme=body.dataset.theme==='dark'?'light':'dark';toast(body.dataset.theme==='dark'?'Dark view enabled':'Light view enabled');}}));document.querySelectorAll('[data-toast]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.toast)));document.querySelectorAll('[data-run]').forEach(b=>b.addEventListener('click',()=>{{const o=b.textContent;b.textContent='Running...';b.disabled=true;setTimeout(()=>{{b.textContent=o;b.disabled=false;toast('Audit run simulated for preview');}},900);}}));
    const command=document.querySelector('[data-command-panel]'),commandInput=document.querySelector('[data-command-input]'),commandList=document.querySelector('[data-command-list]'),commands=sections.map(s=>({{id:s.id,label:s.querySelector('h2,h3')?.textContent||s.id,meta:s.id.replace('-',' ')}}));
    function renderCommands(q=''){{const query=q.trim().toLowerCase();commandList.innerHTML='';commands.filter(i=>!query||i.label.toLowerCase().includes(query)||i.meta.includes(query)).forEach(i=>{{const row=document.createElement('div');row.className='command-item';row.innerHTML=`<strong>${{i.label}}</strong><span class="muted">${{i.meta}}</span>`;row.addEventListener('click',()=>{{closeCommand();goToSection(i.id);}});commandList.appendChild(row);}});}}
    function openCommand(){{renderCommands();command.classList.add('open');setTimeout(()=>commandInput.focus(),40);}} function closeCommand(){{command.classList.remove('open');commandInput.value='';}} document.querySelectorAll('[data-command]').forEach(b=>b.addEventListener('click',openCommand));command.addEventListener('click',e=>{{if(e.target===command)closeCommand();}});commandInput.addEventListener('input',()=>renderCommands(commandInput.value));window.addEventListener('keydown',e=>{{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){{e.preventDefault();openCommand();}} if(e.key==='Escape'){{closeCommand();body.classList.remove('nav-open');}}}});
    const observer=new IntersectionObserver(entries=>{{if(Date.now()<navLockUntil)return;const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;setActiveNav(visible.target.id);}},{{rootMargin:'-18% 0px -62% 0px',threshold:[.08,.25,.5]}});sections.forEach(s=>observer.observe(s));
    document.querySelectorAll('[data-filter-group] .chip').forEach(chip=>chip.addEventListener('click',()=>{{const group=chip.closest('[data-filter-group]');group.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));chip.classList.add('active');const f=chip.dataset.filter;group.parentElement.querySelectorAll('[data-priority]').forEach(r=>r.style.display=f==='all'||r.dataset.priority.includes(f)?'grid':'none');}}));
  </script>
</body>
</html>"""


def run(domain: str | None = None, output_dir: str | None = None) -> str:
    config = load_config()
    domain = clean_domain(domain or config.get("defaults", {}).get("target_domain", "example.com"))
    output_root = ROOT / (output_dir or config.get("defaults", {}).get("output_dir", "3_MEMORY/seo_exports"))
    domain_dir = output_root / domain
    domain_dir.mkdir(parents=True, exist_ok=True)
    data = get_data(domain_dir)
    model = build_model(domain, data)
    html_out = render_dashboard(domain, data, model)
    out_path = domain_dir / f"seo_dashboard_v4_{domain}.html"
    out_path.write_text(html_out, encoding="utf-8")
    print(f"[OK] Dashboard v4 generated: {out_path}")
    return str(out_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate SEOSONA SEO Dashboard v4")
    parser.add_argument("--domain", default=None)
    parser.add_argument("--output-dir", default=None)
    args = parser.parse_args()
    run(domain=args.domain, output_dir=args.output_dir)
