# KI: soxoj/maigret

## Overview
**Maigret** collects a dossier on a person **by username only**, checking for accounts on a huge number of sites and gathering all the available information from web pages. No API keys required. **[AI profiling (demo)](#ai-analysis)**.

## Architecture & Tech Stack
- Python
- **Total files:** 126 files across 19 directories
- **File types:** .py: 36, .rst: 16, .po: 16, .md: 12, .yml: 8, .png: 7, .json: 5

## Core Capabilities
- Supports 3,000+ sites ([see full list](https://github.com/soxoj/maigret/blob/main/sites.md)). A default run checks the 500 highest-ranked sites by traffic; pass `-a` to scan everything, or `--tags` to narrow by category/country.
- Embeddable in Python projects — import `maigret` and run searches programmatically (see [library usage](https://maigret.readthedocs.io/en/latest/library-usage.html)).
- [Extracts](https://github.com/soxoj/socid_extractor) all available information about the account owner from profile pages and site APIs, including links to other accounts.
- Performs recursive search using discovered usernames and other IDs.
- Allows filtering by tags (site categories, countries).
- Detects and partially bypasses blocks, censorship, and CAPTCHA.
- Fetches an [auto-updated site database](https://maigret.readthedocs.io/en/latest/settings.html#database-auto-update) from GitHub each run (once per 24 hours), and falls back to the built-in database if offline.
- Works with Tor and I2P websites; able to check domains.
- Ships with a [web interface](#web-interface) for browsing results as a graph and downloading reports in every format from a single page.
- Optional [AI analysis mode](#ai-analysis) (`--ai`) that turns raw findings into a short investigation summary using an OpenAI-compatible API.

For the complete feature list, see the [features documentation](https://maigret.readthedocs.io/en/latest/features.html).

### Used by

Professional OSINT and social-media analysis tools built on Maigret:

<a href="https://github.com/SocialLinks-IO/sociallinks-api"><img height="60" alt="Social Links API" src="https://github.com/user-attachments/assets/789747b2-d7a0-4d4e-8868-ffc4427df660"></a>
<a href="https://sociallinks.io/products/sl-crimewall"><img height="60" alt="Social Links Crimewall" src="https://github.com/user-attachments/assets/0b18f06c-2f38-477b-b946-1be1a632a9d1"></a>
<a href="https://usersearch.ai/"><img height="60" alt="UserSearch" src="https://github.com

## Documentation Sections
- Maigret
- Sponsors
- Contents
- In one minute
- Main features
- Used by
- Demo
- Video
- Reports
- Installation
- Windows
- Cloud Shells
- Local installation (pip)
- install from pypi
- usage
- From source
- or clone and install manually
- build and install
- usage
- Docker
- official image (CLI)
- CLI usage
- Web UI (open http://localhost:5000)
- Web UI on a custom port
- manual build

## Core Structure
```
  .dockerignore
  .gitignore
  .readthedocs.yaml
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Dockerfile
  Installer.bat
  LICENSE
  Makefile
  README.md
  README.zh-CN.md
  TROUBLESHOOTING.md
  cloudshell-tutorial.md
  example.ipynb
  opensuse.txt
  poetry.lock
  pyproject.toml
  pytest.ini
  sites.md
  snapcraft.yaml
  wizard.py
  .githooks/
    pre-commit
  .github/
    FUNDING.yml
    dependabot.yml
    ISSUE_TEMPLATE/
      add-a-site.md
      bug.md
      report-false-result.md
    workflows/
      build-docker-image.yml
      codeql-analysis.yml
      pyinstaller.yml
      python-package.yml
      python-publish.yml
      update-site-data.yml
  docs/
    Makefile
    make.bat
    requirements.txt
    source/
      command-line-options.rst
      conf.py
      development.rst
      faq.rst
      features.rst
      index.rst
      installation.rst
      library-usage.rst
      maigret_screenshot.png
      philosophy.rst
      quick-start.rst
      settings.rst
      supported-identifier-types.rst
      tags.rst
      tor-and-proxies.rst
      usage-examples.rst
      locale/
        zh_CN/
          LC_MESSAGES/
            command-line-options.po
            development.po
            faq.po
            features.po
            index.po
            installation.po
            library-usage.po
            philosophy.po
            quick-start.po
            settings.po
            supported-identifier-types.po
            tags.po
            tor-and-proxies.po
            usage-examples.po
            use-cases/
              crypto.po
              scientists.po
      use-cases/
        crypto.rst
        scientists.rst
  maigret/
    __init__.py
    __main__.py
    __version__.py
    activation.py
    ai.py
    checking.py
    db_updater.py
    error_detection.py
    errors.py
    executors.py
    maigret.py
    notify.py
    permutator.py
    report.py
    result.py
    settings.py
    sites.py
    submit.py
    utils.py
    resources/
      ai_prompt.txt
      data.json
      db_meta.json
      settings.json
      simple_report.tpl
      simple_report_pdf.css
      simple_report_pdf.tpl
    web/
      app.py
      static/
        maigret.png
      templates/
        base.html
        index.html
        results.html
        status.html
  pyinstaller/
    maigret_standalone.py
    maigret_standalone.spec
    requirements.txt
  static/
    chat_gitter.svg
    maigret.png
    recursive_search.md
    recursive_search.svg
    report_alexaimepho
```

## Quick Start
```bash
pip install maigret
maigret YOUR_USERNAME
Video guide: https://youtu.be/qIgwTZOmMmM.
<a id="cloud-shells"></a>
Run Maigret in the browser via cloud shells or Jupyter notebooks:
<a href="https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/soxoj/maigret&tutorial=cloudshell-tutorial.md"><img src="https://user-images.githubusercontent.com/27065646/92304704-8d146d80-ef80-11ea-8c29-0deaabb1c702.png" alt="Open in Cloud Shell" height="50"></a>
<a href="https://repl.it/github/soxoj/maigret"><img src="https://replit.com/badge/github/soxoj/maigret" alt="Run on Replit" height="50"></a>
<a href="https://colab.research.google.com/gist/soxoj/879b51bc3b2f8b695abb054090645000/maigret-collab.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" height="45"></a>
<a href="https://mybinder.org/v2/gist/soxoj/9d65c2f4d3bec5dd25949197ea73cf3a/HEAD"><img src="https://mybinder.org/badge_logo.svg" alt="Open In Binder" height="45"></a>
Two image variants are published:
```

## Agent Configuration

--- CONTRIBUTING.md ---
# How to contribute

Hey! I'm really glad you're reading this. Maigret contains a lot of sites, and it is very hard to keep all the sites operational. That's why any fix is important.

## Code of Conduct

Please read and follow the [Code of Conduct](CODE_OF_CONDUCT.md) to foster a welcoming and inclusive community.

## Local setup

Install Maigret with development dependencies via [Poetry](https://python-poetry.org/):

```bash
git clone https://github.com/soxoj/maigret && cd maigret
poetry install --with dev
```

Activate the repo's git hooks **once after cloning**:

```bash
git config --local core.hooksPath .githooks/
```

The pre-commit hook does two things every time you commit changes that touch the site database:

- regenerates the database signature `maigret/resources/db_meta.json` (used to detect compatible auto-updates), and
- regenerates `sites.md` (the human-readable list of supported sites with per-engine statistics).

It also auto-stages the regenerated files so they land in the same commit as your edits. **Always run `git commit` from inside the repo so the hook can fire** — without it, your PR will land with a stale signature and a stale `sites.md`, and database auto-update will misbehave for users on your branch.

## How to contribute

There are two main ways to help.

### 1. Add a new site

**Beginner.** Use the `--submit` mode — Maigret takes a single existing-account URL, auto-detects the site engine, picks `presenseStrs` / `absenceStrs`, and offers to add the entry:

```bash
maigret --submit https://example.com/users/alice
```

`--submit` works well when the site has clean status codes and no anti-bot protection. It will *not* discover a public JSON API (`urlProbe`), classify protection (`tls_fingerprint`, `cf_js_challenge`, `ip_reputation`, ...), or recognise SPA / soft-404 pages. For those, fall back to manual editing.

**Advanced.** Edit `maigret/resources/data.json` by hand — see *Editing `data.json` safely* below. There is also an `add-a-site


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
