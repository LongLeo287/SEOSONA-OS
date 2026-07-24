# KI: alam00000/bentopdf

## Overview
**BentoPDF** is a powerful, privacy-first, client-side PDF toolkit that is self hostable and allows you to manipulate, edit, merge, and process PDF files directly in your browser. No server-side processing is required, ensuring your files remain secure and private.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 129 files across 17 directories
- **File types:** .md: 37, .yml: 17, .html: 14, .js: 11, .map: 9, .yaml: 8, .json: 7

## Documentation Sections
- Table of Contents
- 📢 Join Us on Discord
- 📚 Documentation
- 📜 Licensing
- AGPL Components (Pre-configured via CDN)
- ⭐ Stargazers over time
- 💖 Thank You to Our Sponsors
- ✨ Why BentoPDF?
- 🛠️ Features / Tools Supported
- Organize & Manage PDFs
- Edit & Modify PDFs

## Core Structure
```
  .dockerignore
  .env.development
  .env.example
  .gitignore
  .htaccess
  .prettierignore
  .prettierrc
  .trivyignore
  404.html
  CCLA.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Dockerfile
  Dockerfile.nonroot
  ICLA.md
  LICENSE
  README.md
  RELEASE.md
  SECURITY.md
  SIMPLE_MODE.md
  STATIC-HOSTING.md
  TRANSLATION.md
  about.html
  contact.html
  docker-compose.dev.yml
  docker-compose.yml
  entrypoint.sh
  eslint.config.mjs
  faq.html
  index.html
  licensing.html
  nginx-ipv6.sh
  nginx-noindex.sh
  nginx.conf
  package-lock.json
  package.json
  pdf-converter.html
  pdf-editor.html
  pdf-merge-split.html
  pdf-security.html
  privacy.html
  security-headers-docs.conf
  serve.json
  simple-index.html
  terms.html
  tools.html
  tsconfig.json
  unraid_bentopdf.xml
  vite.config.ts
  vitest.config.ts
  .github/
    FUNDING.yml
    cla.json
    codeql-config.yml
    dependabot.yml
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
      question.yml
    workflows/
      build-and-publish.yml
      cla.yml
      codeql.yml
      seo-audit.yml
      sponsors.yml
      static.yml
      trivy-scan.yml
      update-embedpdf-snippet.yml
  .husky/
    pre-commit
  .well-known/
    funding-manifest-urls
  chart/
    .helmignore
    Chart.yaml
    README.md
    values.yaml
    templates/
      NOTES.txt
      _helpers.tpl
      deployment.yaml
      gateway.yaml
      httproute.yaml
      ingress.yaml
      service.yaml
      tests/
        test-connection.yaml
  cloudflare/
    WASM-PROXY.md
    cors-proxy-worker.js
    wasm-proxy-worker.js
    wasm-wrangler.toml
    wrangler.toml
  docs/
    contributing.md
    getting-started.md
    index.md
    licensing.md
    .vitepress/
      config.mts
      cache/
        deps/
          @theme_index.js
          @theme_index.js.map
          _metadata.json
          chunk-BRNHR3LR.js
          chunk-BRNHR3LR.js.map
          chunk-H6MPEGKE.js
          chunk-H6MPEGKE.js.map
          package.json
          vitepress___@vue_devtools-api.js
          vitepress___@vue_devtools-api.js.map
          vitepress___@vueuse_core.js
          vitepress___@vueuse_core.js.map
          vitepress___@vueuse_integrations_useFocusTrap.js
          vitepress___@vueuse_integrations_useFocusTrap.js.map
          vitepress___mark__js_src_vanilla__js.js
          vitepress___mark__js_src_vanilla__js.js.map
          vitepress___minisearch.js
          vitepress___minisearch
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to BentoPDF

First off, thank you for considering contributing to **BentoPDF**! Your help makes this project better for everyone.

This document outlines how to contribute, report issues, and get involved in the project.

---

## Contributor License Agreement (CLA)

Before we can accept your contributions, you must sign our Contributor License Agreement (CLA). This is required because BentoPDF uses a dual licensing model:

- **AGPL-3.0** for open source use
- **Commercial license** for proprietary use

The CLA ensures we can include your contributions in both versions of the project.

### For Individual Contributors

Sign our [Individual Contributor License Agreement (ICLA)](ICLA.md). When you submit your first pull request, the CLA Assistant bot will automatically ask you to sign by commenting on the PR.

### For Corporate Contributors

If you are contributing on behalf of your employer, your organization needs to sign our [Corporate Contributor License Agreement (CCLA)](CCLA.md). Please contact us at [contact@bentopdf.com](mailto:contact@bentopdf.com) to arrange corporate CLA signing.

### What the CLA Grants

By signing the CLA, you:

- Grant us a broad copyright license to use, modify, and relicense your contributions (including for commercial use)
- Grant a patent license for any patents covering your contribution
- Represent that you have the authority to make the contribution
- Retain full copyright ownership of your contributions

---

## 1. How to Contribute

You can contribute in several ways:

- **Reporting Bugs:** If you find a bug or unexpected behavior, please open an issue. Include steps to reproduce and any relevant screenshots or logs.
- **Feature Requests:** Suggest new features or improvements by opening an issue and describing your idea clearly.
- **Code Contributions:** Submit a pull request with new features, bug fixes, or improvements.
- **Documentation:** Help improve the README, usage examples, or guides.
- **Testing:** Help t


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
