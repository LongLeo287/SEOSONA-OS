# KI: tw93/kami

## Overview
Kami (紙, かみ) means paper in Japanese: the surface where a finished idea lands. AI can produce documents better than most humans do manually. The missing piece is not capability but constraint: without a design system, every session drifts into generic gray and inconsistent layouts.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 126 files across 22 directories
- **File types:** .html: 59, .png: 15, .pdf: 9, .md: 8, .json: 5, .example: 5, .txt: 3

## Documentation Sections
- Why
- See it
- Landing Pages
- Usage
- Design
- Travel
- Background
- Support

## Core Structure
```
  .gitignore
  AGENTS.md
  CHEATSHEET.md
  CLAUDE.md
  LICENSE
  README.md
  SKILL.md
  VERSION
  index-en.html
  index-ja.html
  index-ko.html
  index-tw.html
  index-zh.html
  index.html
  llms.txt
  robots.txt
  sitemap.xml
  styles.css
  vercel.json
  .agents/
    plugins/
      marketplace.json
  .claude/
    launch.json
  .claude-plugin/
    marketplace.json
  .github/
    FUNDING.yml
    workflows/
      check.yml
      release.yml
  assets/
    demos/
      demo-agent-slides.html
      demo-agent-slides.pdf
      demo-agent-slides.png
      demo-changelog.html
      demo-changelog.pdf
      demo-changelog.png
      demo-kaku.html
      demo-kaku.pdf
      demo-kaku.png
      demo-letter.html
      demo-letter.pdf
      demo-letter.png
      demo-mole-clean.jpg
      demo-mole.html
      demo-mole.pdf
      demo-mole.png
      demo-musk-resume.html
      demo-musk-resume.pdf
      demo-musk-resume.png
      demo-resume-ko.html
      demo-resume-ko.pdf
      demo-resume-ko.png
      demo-tesla.html
      demo-tesla.pdf
      demo-tesla.png
      demo-waza.html
      demo-waza.pdf
      demo-waza.png
      images/
        kaku-action.jpg
        kaku-hero.jpg
    diagrams/
      architecture.html
      bar-chart.html
      candlestick.html
      class.html
      donut-chart.html
      er.html
      flowchart.html
      layer-stack.html
      line-chart.html
      quadrant.html
      sequence.html
      state-machine.html
      swimlane.html
      timeline.html
      tree.html
      venn.html
      waterfall.html
      src/
        class.mmd
        er.mmd
        sequence.mmd
    fonts/
      JetBrainsMono.woff2
      LICENSE-SourceHanSerifK.txt
      SourceHanSerifKR-Medium.otf
      SourceHanSerifKR-Regular.otf
      TsangerJinKai02-W04.ttf
      TsangerJinKai02-W05.ttf
    illustrations/
      travel-3d-representations.png
      travel-spatialvla.png
      travel-tesla-optimus.png
    images/
      logo.svg
    showcase/
      kami-landing.png
      luo-landing.png
      mole-landing.png
    templates/
      changelog-en.html
      changelog-ko.html
      changelog.html
      equity-report-en.html
      equity-report-ko.html
      equity-report.html
      landing-page-en.html
      landing-page-ko.html
      landing-page-llms-full.txt.example
      landing-page-llms.txt.example
      landing-page-robots.txt.example
      landing-page-sitemap.xml.example
      landing-page-vercel.json.example
      landing-page.html
      letter-en.html
      letter
```

## Quick Start
```bash
npx skills add tw93/kami -a claude-code -g -y
/plugin marketplace add tw93/kami
/plugin install kami@kami
codex plugin marketplace add tw93/kami
codex plugin add kami@kami
npx skills add tw93/kami -a '*' -g -y
npx skills update kami -g -y
```

## Agent Configuration

--- AGENTS.md ---
# Kami Agent Guide

> Personal/global agent rules may live outside this repository. This file records Kami-specific repository maps, Working Rules, Current Risk Areas, Verification, Release Flow, and Fonts.

## Project

Kami is a document-generation skill and template system. It ships editorial HTML templates, reference guides, demo assets, and a packaged skill archive.

## Repository Map

- `SKILL.md` - skill routing and operating rules.
- `CHEATSHEET.md` - quick design reference.
- `CLAUDE.md` - Claude-specific notes pointing to AGENTS.md.
- `references/` - design, writing, diagram, and production guidance.
- `references/design.md`, `writing.md`, `production.md`, `diagrams.md` - full specs.
- `references/resume-writing.md` - resume-specific bullet/project framing rules.
- `references/anti-patterns.md` - six-category checklist for reviewing drafts.
- `references/mermaid.md` - Mermaid diagram support: the two render paths (PDF vs browser) and the authoring pipeline.
- `references/mermaid-theme.json` - canonical Kami↔beautiful-mermaid color/font theme (kept in sync with `tokens.json`).
- `references/tokens.json` - canonical color tokens (drift-checked by `scripts/tokens.py`).
- `references/checks_thresholds.json` - rhythm / density / orphan check thresholds (loaded by `scripts/checks.py`).
- `references/brand-profile.md` and `references/brand.example.md` - optional brand profile behavior and public example.
- `.claude-plugin/marketplace.json` - Claude Code plugin marketplace metadata.
- `.agents/plugins/marketplace.json` - **generated** Codex repo marketplace. Points Codex at `plugins/kami`; never hand-edit.
- `plugins/kami/` - **generated** Codex plugin tree. Mirrors the lightweight skill package under `plugins/kami/skills/kami/`; edit source files and run `python3 scripts/build_metadata.py`.
- `assets/templates/` - document templates including browser-only landing page variants.
- `scripts/highlight.py` - Pygments-based syntax highlighting for code blocks at build 

--- CLAUDE.md ---
# Kami

Document-generation skill and template system. Editorial HTML templates + PDF/PPTX/PNG build pipeline.

## 启动前

- 个人/全局规则可放在仓库外；本文件只记录 Kami 项目内的 Claude Code 入口和维护规则。
- 仓库地图、Working Rules、Current Risk Areas、Verification Details、Release Flow、Fonts 全在 `AGENTS.md`。
- 模板设计规范看 `references/design.md`，写作规范看 `references/writing.md`，反模式 checklist 看 `references/anti-patterns.md`。

## 常用命令

```bash
python3 scripts/build.py                   # 构建所有目标
python3 scr

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
