# KI: apotenza92/chrome-auto-pip

## Overview
[Chrome Web Store](https://chromewebstore.google.com/detail/automatic-picture-in-pict/dmjccoaplbldlhhljlcldhaciadfhkcj)

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 91 files across 19 directories
- **File types:** .js: 64, .html: 7, .md: 6, .json: 3, .jpg: 3, .yml: 2, .gitignore: 1
- **Dev dependencies:** @playwright/test

## Documentation Sections
- Chrome Automatic Picture-in-Picture (PiP)
- Installation
- Usage
- Default Automatic Behaviour (Fresh Install)
- Manual PiP
- Open Extension Options
- Disabled Sites
- How It Works
- Site Compatibility
- Browser Permission Gate
- Debug Logs
- Testing
- Sites Requiring User Interaction
- Requirements

## Available Commands
- `npm run test:local:static` -- node scripts/local-test/static-checks.js
- `npm run test:local` -- npm run test:local:static && playwright test --config=playwright.local.config.js
- `npm run test:local:sites` -- node scripts/local-test/run-sites.js
- `npm run test:local:helium` -- AUTO_PIP_LOCAL_BROWSER=helium AUTO_PIP_REAL_SITES=1 node scripts/local-test/run-
- `npm run test:local:cpu` -- node scripts/local-test/run-cpu.js
- `npm run test:local:all` -- npm run test:local && npm run test:local:sites && npm run test:local:cpu
- `npm run test:e2e` -- npm run test:local
- `npm run test:e2e:ui` -- playwright test --ui
- `npm run test:e2e:preupdate` -- node tmp/orchestrator/scripts/pre-update-e2e.js
- `npm run test:e2e:footage` -- node tmp/orchestrator/scripts/capture-vm-footage.js

## Core Structure
```
  .gitignore
  AGENTS.md
  CHANGELOG.md
  PRIVACY.md
  README.md
  main.js
  manifest.json
  options.html
  options.js
  package-lock.json
  package.json
  playwright.config.js
  playwright.local.config.js
  .github/
    workflows/
      backfill-releases.yml
      release.yml
  assets/
    .DS_Store
    icon.afdesign
    icon.png
    marquee-promo-tile.jpg
    screenshot.jpg
    small-promo-tile.jpg
  background/
    constants.js
    debug.js
    inject.js
    messages.js
    settings.js
    tab-switch.js
    url-rules.js
  docs/
    pre-update-e2e.md
  scripts/
    check-video.js
    disable-auto-pip.js
    exit-pip.js
    immediate-pip.js
    page-auto-pip.js
    request-playing-pip.js
    trigger-auto-pip.js
    utils.js
    lib/
      pip.js
      settings.js
      video.js
    local-test/
      local-session.js
      run-cpu.js
      run-sites.js
      static-checks.js
  tests/
    e2e/
      blocklist.spec.js
      dynamic-video.spec.js
      manual-pip.spec.js
      settings.spec.js
      tab-switch.spec.js
    fixtures/
      blank.html
      delayed-video.html
      extension-fixture.js
      high-churn-video.html
      sample-video.html
      sample.mp4
      shadow-late-ready-video.html
      site-owned-auto-pip.html
      static-server.js
  tmp/
    orchestrator/
      README.md
      guest.js
      host.js
      guest/
        chrome-session.js
        detached-launcher.js
        lib/
          artifact-writer.js
          browser-config.js
          focus-timeline.js
          helpers.js
          pip-verifier.js
          powershell.js
          stage-reset.js
          platform/
            index.js
            linux.js
            macos.js
            windows.js
        stages/
          cpu-usage-benchmark.js
          display-stack-probe.js
          dynamic-video-consistency.js
          env-probe.js
          helium-youtube-disable.js
          interactive-desktop-probe.js
          playwright-browser-probe.js
          playwright-extension-e2e.js
          real-browser-use-youtube.js
          tab-switch-visual-proof.js
          visible-real-browser-use-youtube.js
      host/
        linux-desktop-session.js
        run.js
        vm-registry.js
      scripts/
        capture-vm-footage.js
        pre-update-e2e.js
        start-tmux.sh
```

## Quick Start
```bash
npm install
npm run test:local
npm run test:local:static   # syntax, manifest references, defaults, removed-cruft checks
npm run test:local:cpu      # high-churn CPU regression benchmark
npm run test:local:all      # static + fixture E2E + site smoke + CPU benchmark
AUTO_PIP_REAL_SITES=1 npm run test:local:sites
```

## Agent Configuration

--- AGENTS.md ---
# AGENTS

This repo is a Chrome (MV3) extension. This file documents common project workflows for maintainers and automation/agents.

## Development

- Main extension code: `main.js`
- Options UI: `options.html`, `options.js`
- Content scripts: `scripts/`
- Manifest: `manifest.json`

## Tests

Local regression tests use Playwright and run directly on the host macOS desktop by default.

The deterministic local suite uses Playwright Chromium with a temporary profile and the unpacked extension side-loaded. Real website smoke tests are opt-in because network, login, ads, and site layout changes can make them non-deterministic.

```bash
npm install
npm run test:local
```

Useful local commands:

```bash
npm run test:local:static
npm run test:local:sites
AUTO_PIP_REAL_SITES=1 npm run test:local:sites
npm run test:local:helium
npm run test:local:cpu
npm run test:local:all
```

Local test artifacts are written under `tmp/local-test-artifacts/`. Temporary browser profiles are deleted after each run unless `AUTO_PIP_KEEP_PROFILE=1` is set.

## Releases (GitHub Release ZIPs)

This project publishes a downloadable ZIP asset on GitHub Releases so users can install manually via **Load unpacked**.

### How it works

- Workflow: `.github/workflows/release.yml`
- Trigger: pushing a tag that matches `v*.*.*` (example: `v1.6.3`)
- The workflow:
  1. Derives the version from the tag.
  2. Verifies `manifest.json` `version` matches the tag version.
  3. Extracts the matching section from `CHANGELOG.md` and uses it as the GitHub Release notes.
  4. Builds `chrome-auto-pip-<version>.zip` containing the extension runtime files.
  5. Creates/updates the GitHub Release and uploads the ZIP as a release asset.

### Publish a release

1. Update `manifest.json` version (and `CHANGELOG.md`).
2. Commit and push to `main`.
3. Create and push a tag:

```bash
git tag v<version>
git push origin v<version>
```

Example:

```bash
git tag v1.6.3
git push origin v1.6.3
```

After the workflow finishes, th


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
