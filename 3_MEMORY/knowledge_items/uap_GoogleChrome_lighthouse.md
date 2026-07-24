# KI: GoogleChrome/lighthouse

## Overview
> Lighthouse analyzes web apps and web pages, collecting modern performance metrics and insights on developer best practices.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 132 files across 16 directories
- **File types:** .html: 34, .js: 30, .png: 15, .yml: 10, .md: 10, .json: 9, .sh: 5

## Documentation Sections
- Lighthouse  [![GitHub Actions Status Badge](https://github.com/GoogleChrome/lighthouse/workflows/CI/badge.svg)](https://github.com/GoogleChrome/lighthouse/actions/workflows/ci.yml) [![GitHub Actions Status Badge](https://github.com/GoogleChrome/lighthouse/workflows/unit/badge.svg)](https://github.com/GoogleChrome/lighthouse/actions/workflows/unit.yml) [![GitHub Actions Status Badge](https://github.com/GoogleChrome/lighthouse/workflows/smoke/badge.svg)](https://github.com/GoogleChrome/lighthouse/actions/workflows/smoke.yml) [![Coverage Status](https://codecov.io/gh/GoogleChrome/lighthouse/branch/main/graph/badge.svg)](https://codecov.io/gh/GoogleChrome/lighthouse) [![Build tracker for Lighthouse](https://img.shields.io/badge/buildtracker-ok-blue)](https://lh-build-tracker.herokuapp.com/) [![NPM lighthouse package](https://img.shields.io/npm/v/lighthouse.svg)](https://npmjs.org/package/lighthouse)
- Using Lighthouse in Chrome DevTools
- Using the Chrome extension
- Using the Node CLI
- or use yarn:
- yarn global add lighthouse
- CLI options
- saves `./<HOST>_<DATE>.report.html`
- json output sent to stdout

## Core Structure
```
  .codecov.yml
  .cz-config.js
  .editorconfig
  .gitattributes
  .gitignore
  .mailmap
  .npmignore
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  build-tracker.config.js
  changelog-pre10.md
  changelog.md
  commitlint.config.js
  eslint-local-rules.cjs
  eslint.config.mjs
  package.json
  readme.md
  tsconfig-all.json
  tsconfig-base.json
  tsconfig.json
  types.js
  vercel.json
  yarn.lock
  .agents/
    skills/
      lighthouse-verification/
        SKILL.md
  .github/
    CODEOWNERS
    PULL_REQUEST_TEMPLATE.md
    dependabot.yml
    ISSUE_TEMPLATE/
      Feature_request.md
      Other.md
      agentic-web.md
      bug-report.yml
    scripts/
      bump-nightly-version.sh
      generate-devtools-hash.sh
      git-get-shared-history.sh
      print-devtools-relevant-commits.sh
      test-retry.sh
    workflows/
      ci.yml
      cron-weekly.yml
      devtools.yml
      markdown.links.config.json
      package-test.yml
      publish.yml
      smoke.yml
      unit.yml
  assets/
    architecture.png
    detail-type-examples.png
    example_audit.png
    example_dev_tools.png
    lh_favicon.svg
    lh_favicon_16px.png
    lh_favicon_32px.png
    lh_favicon_76px.png
    lighthouse-logo.svg
    lighthouse-logo_1024px.png
    lighthouse-logo_128px.png
    lighthouse-logo_512px.png
    flows/
      navigation.png
      navigation.svg
      snapshot.png
      snapshot.svg
      timespan.png
      timespan.svg
  cli/
    bin.js
    cli-flags.js
    index.js
    printer.js
    run.js
    sentry-prompt.js
    commands/
      commands.js
      list-audits.js
      list-locales.js
      list-trace-categories.js
    test/
      cli/
        bin-test.js
        cli-flags-test.js
        index-test.js
        printer-test.js
        run-test.js
        __snapshots__/
          cli-flags-test.js.snap
      fixtures/
        RubikBrokenFax-Regular.ttf
        badssl-iframe.html
        baseline.html
        cli-flags-path.json
        csp.html
        debugger.html
        delayed-fcp.html
        delayed-lcp.html
        esm-config.js
        form.html
        infinite-loop.html
        js-redirect.html
        lantern-data.json
        launcher-icon-100x100.png
        launcher-icon-4x.png
        legacy-javascript.html
        legacy-javascript.js
        llms.txt
        manifest.json
        max-texture-size.html
        offline-ready-sw.js
        offline-ready.html
        online-only.html
        oopif-requests-iframe.html
        oopif-requests.html
       
```

## Quick Start
```bash
npm install -g lighthouse
$ lighthouse --help
lighthouse <url> <options>
Logging:
--verbose  Displays verbose logging  [boolean] [default: false]
--quiet    Displays no progress, debug logs, or errors  [boolean] [default: false]
Configuration:
--save-assets                  Save the trace contents & devtools logs to disk  [boolean] [default: false]
--list-all-audits              Prints a list of all available audits and exits  [boolean] [default: false]
--list-trace-categories        Prints a list of all required trace categories and exits  [boolean] [default: false]
```

## Agent Configuration

--- CONTRIBUTING.md ---
# For Contributors

We'd love your help! This doc covers how to become a contributor and submit code to the project.

## Where can I start?

We tag issues that are good candidates for those new to the code with [`good first issue`](https://github.com/GoogleChrome/lighthouse/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22good+first+issue%22). We recommend you start there!

## Follow the coding style

The `.eslintrc.cjs` file defines all. We use [JSDoc](https://jsdoc.app/) with [TypeScript `checkJs`](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc). Annotations are encouraged for all contributions.

## Learn about the architecture

See [Lighthouse Architecture](./docs/architecture.md), our overview and tour of the codebase.

## Contributing a patch

If you have a contribution for our [documentation](https://developer.chrome.com/docs/lighthouse/), please submit it in the [developer.chrome.com repo](https://github.com/GoogleChrome/developer.chrome.com).

1. Submit an issue describing your proposed change.
1. The maintainers will respond to your issue promptly.
1. If your proposed change is accepted, and you haven't already done so, sign a Contributor License Agreement (see details below).
1. Fork the repo, develop and test your code changes.
1. Ensure that your code adheres to the existing style in the sample to which you are contributing.
1. Submit a pull request.

## Audit PRs

If proposing a new audit for Lighthouse, see the [new audit proposal guide](./docs/new-audits.md) and open an issue for discussion before starting.

A PR for a new audit or changing an existing audit almost always needs the following:

1. If new, add the audit to the [default config file](core/config/default-config.js) (or, rarely, one of the other config files) so Lighthouse will run it.

1. **Unit tests**: in the matching test file (e.g. tests for `core/audits/my-swell-audit.js` go in `core/test/audits/my-swell-audit-test.js`).

1


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
