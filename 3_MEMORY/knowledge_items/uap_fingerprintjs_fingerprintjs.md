# KI: fingerprintjs/fingerprintjs

## Overview
Browser fingerprinting library with the highest accuracy and stability

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 137 files across 12 directories
- **File types:** .ts: 99, .md: 18, .yml: 5, .json: 3, .svg: 2, .editorconfig: 1, .eslintrc: 1
- **Dev dependencies:** @fpjs-incubator/broyster, @rollup/plugin-json, @rollup/plugin-node-resolve, @rollup/plugin-terser, @rollup/plugin-typescript, @types/jasmine, @types/ua-parser-js, @typescript-eslint/eslint-plugin
- **Keywords:** fraud, fraud detection, fraud prevention, browser, identification, fingerprint, fingerprinting, browser fingerprint, device fingerprint, privacy

## Documentation Sections
- Demo
- Installation
- npm
- CDN
- Resources
- Limitations
- Accuracy
- Security
- Want higher accuracy? Upgrade to Fingerprint Identification for free
- Fingerprint Identification resources
- Migrating to v5
- Version policy
- Supported browsers
- Where to get support
- Contributing

## Available Commands
- `npm run build` -- rimraf dist && rollup -c rollup.config.ts --configPlugin "@rollup/plugin-typescr
- `npm run build:watch` -- yarn build --watch
- `npm run playground:start` -- cd playground && webpack-dev-server --mode development
- `npm run playground:build` -- cd playground && webpack --mode production
- `npm run lint` -- eslint --ext .js,.ts --ignore-path .gitignore --max-warnings 0 .
- `npm run lint:fix` -- yarn lint --fix
- `npm run test:local` -- karma start --preset local --single-run
- `npm run test:browserstack` -- karma start --preset browserstack --single-run
- `npm run test:browserstack:beta` -- karma start --preset browserstack-beta --single-run
- `npm run check:dts` -- tsc --isolatedModules --noEmit dist/fp.d.ts
- `npm run check:ssr` -- node --require './dist/fp.cjs.js' --eval '' || (echo "The distributive files can

## Core Structure
```
  .editorconfig
  .eslintrc
  .gitignore
  .npmignore
  .prettierrc
  LICENSE
  code_of_conduct.md
  contributing.md
  karma.conf.ts
  package.json
  readme.md
  rollup.config.ts
  terser.config.ts
  tsconfig.json
  tsconfig.rollupConfig.json
  yarn.lock
  .github/
    ISSUE_TEMPLATE/
      fingerprint_changes.md
      other_bug.md
      pull_request.md
    workflows/
      check_upcoming_browser_versions.yml
      codeql_analysis.yml
      demo.yml
      npm_publish.yml
      test.yml
  docs/
    api.md
    browser_support.md
    comparison.md
    content_blockers.md
    evade_ad_blockers.md
    extending.md
    licensing.md
    publishing.md
    typescript_support.md
    version_policy.md
    migration/
      v3_v5.md
      v4_v5.md
  playground/
    index.html
    index.ts
    webpack.config.ts
  resources/
    favicon.ico
    license_banner.txt
    logo_dark.svg
    logo_light.svg
    content_blocking/
      filters.ts
      get_unique_filter_selectors.ts
      insert_filter_code.ts
      make_selectors_tester.ts
      selectors_tester.ts
      utils.ts
      blocked_selectors/
        .gitkeep
  src/
    agent.test.ts
    agent.ts
    confidence.test.ts
    confidence.ts
    global.d.ts
    index.ts
    sources/
      apple_pay.test.ts
      apple_pay.ts
      architecture.test.ts
      architecture.ts
      audio.test.ts
      audio.ts
      audio_base_latency.test.ts
      audio_base_latency.ts
      canvas.test.ts
      canvas.ts
      color_depth.test.ts
      color_depth.ts
      color_gamut.test.ts
      color_gamut.ts
      contrast.test.ts
      contrast.ts
      cookies_enabled.test.ts
      cookies_enabled.ts
      cpu_class.test.ts
      cpu_class.ts
      date_time_locale.test.ts
      date_time_locale.ts
      device_memory.test.ts
      device_memory.ts
      dom_blockers.test.ts
      dom_blockers.ts
      font_preferences.test.ts
      font_preferences.ts
      fonts.test.ts
      fonts.ts
      forced_colors.test.ts
      forced_colors.ts
      hardware_concurrency.test.ts
      hardware_concurrency.ts
      hdr.test.ts
      hdr.ts
      index.ts
      indexed_db.test.ts
      indexed_db.ts
      inverted_colors.test.ts
      inverted_colors.ts
      languages.test.ts
      languages.ts
      local_storage.test.ts
      local_storage.ts
      math.test.ts
      math.ts
      monochrome.test.ts
      monochrome.ts
      open_database.test.ts
      open_database.ts
      os_cpu.test.ts
      os_cpu.ts
      pdf_viewer_enabled.test.ts
 
```

## Quick Start
```bash
npm install @fingerprintjs/fingerprintjs
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to FingerprintJS

Thanks for taking the time to contribute!
Here you can find ways to make FingerprintJS better, as well as tips and guidelines.

This project and everyone participating in it is governed by the [Code of Conduct](code_of_conduct.md).
By participating, you are expected to uphold this code.

## How you can contribute

### Contributions to the playground are not supported

Due to limited team capacity, we cannot accept and process pull requests on the playground, but feel free to report any bugs you found in the playground. 
If you want to submit a quality of life issue for the plaground, please start with a discussion first;

### Reporting an issue

If you've noticed a bug, have an idea or a question,
feel free to [create an issue](https://github.com/fingerprintjs/fingerprintjs/issues/new/choose) or [start a discussion](https://github.com/fingerprintjs/fingerprintjs/discussions/new/choose).

Before you start, please [search](https://github.com/search?q=repo%3Afingerprintjs%2Ffingerprintjs&type=code) for your topic.
There is a chance it has already been discussed.

When you create an issue, the description is pre-filled with a template text.
Please fill in the missing information carefully, it will help us solve your issue faster.
If you want to share a piece of code or the library output with us, please wrap it in a ` ``` ` block and make sure you include all the information.


### Creating a pull request

If you want to fix a bug, add a source of entropy, or make any other code contribution, please [create a pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project).

We only support accepting pull requests for the issues marked as `help wanted` (green badge).
If you noticed a problem with the library and want to fix it, please submit an issue first and discuss with our team before submitting a pull request. 
Due to limited team capacity, we cannot accept pull requests for issues that we


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
