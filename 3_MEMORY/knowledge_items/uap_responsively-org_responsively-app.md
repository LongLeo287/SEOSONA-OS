# KI: responsively-org/responsively-app

## Overview
> A modified browser built using [Electron](https://www.electronjs.org/) that helps in responsive web development.
> <br>

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 124 files across 23 directories
- **File types:** .ts: 46, .png: 15, .js: 14, .md: 10, .json: 8, .yml: 7, .html: 5

## Core Capabilities
1. Mirrored User-interactions across all devices.
2. Customizable preview layout to suit all your needs.
3. One handy elements inspector for all devices in preview.
4. 30+ built-in device profiles with the option to add custom devices.
5. One-click screenshots on all your devices.
6. Hot reloading is supported for developers.

Please visit the website to learn more about the application - https://responsively.app

## Documentation Sections
- Responsively App
- Features
- Download
- Browser Extension
- Issues
- Roadmap
- Gold sponsors 🥇
- Contribute
- Get in touch
- Contributors ✨

## Core Structure
```
  .all-contributorsrc
  .gitattributes
  .gitignore
  CONTRIBUTING.md
  LICENSE
  MAINTAINERS.md
  README.md
  SECURITY.md
  dev.code-workspace
  .github/
    FUNDING.yml
    PULL_REQUEST_TEMPLATE.md
    dependabot.yml
    opencollective.yml
    stale.yml
    ISSUE_TEMPLATE/
      01-bug-report.md
      02-feature-request.md
    workflows/
      codeql-analysis.yml
      publish.yml
      test.yml
  .idea/
    .gitignore
  browser-extension/
    .gitignore
    package.json
    webpack.config.js
    .vscode/
      settings.json
    public/
      logo_128.png
      logo_16.png
      logo_48.png
      manifest.json
      popup.html
    src/
      background.js
      popup.js
      spinner.svg
  desktop-app/
    . prettierignore
    .editorconfig
    .eslintignore
    .eslintrc.js
    .gitattributes
    .gitignore
    .prettierrc
    CHANGELOG.md
    CODE_OF_CONDUCT.md
    LICENSE
    README.md
    declarations.d.ts
    package-lock.json
    package.json
    postcss.config.js
    postinstall.ts
    setupTests.ts
    tailwind.config.js
    tsconfig.json
    vitest.config.ts
    yarn.lock
    .erb/
      configs/
        .eslintrc
        webpack.config.base.ts
        webpack.config.eslint.ts
        webpack.config.main.prod.ts
        webpack.config.preload-webview.dev.ts
        webpack.config.preload.dev.ts
        webpack.config.renderer.dev.dll.ts
        webpack.config.renderer.dev.ts
        webpack.config.renderer.prod.ts
        webpack.paths.ts
      img/
        erb-banner.svg
        erb-logo.png
      mocks/
        fileMock.js
      scripts/
        .eslintrc
        check-build-exists.ts
        check-native-dep.js
        check-node-env.js
        check-port-in-use.js
        clean.js
        delete-source-maps.js
        electron-rebuild.js
        link-modules.ts
        notarize.js
    .husky/
      pre-commit
    .vscode/
      settings.json
    assets/
      assets.d.ts
      entitlements.mac.plist
      icon.png
      icon.svg
      icons/
        1024x1024.png
        128x128.png
        16x16.png
        24x24.png
        256x256.png
        32x32.png
        48x48.png
        512x512.png
        64x64.png
        96x96.png
    e2e/
      playwright.config.ts
      tsconfig.json
      fixtures/
        electron-app.ts
        pages/
          color-blindness-test.html
          color-scheme-test.html
          test-page-2.html
          test-page.html
      models/
        app.ts
      tests/
        about-dialog.spec.ts
        address-
```

## Quick Start
```bash
brew install --cask responsively
choco install responsively
winget install ResponsivelyApp
sudo rpm -i https://github.com/responsively-org/responsively-app/releases/download/v[VERSION]/Responsively-App-[VERSION].x86_64.rpm
```

## Agent Configuration

--- CONTRIBUTING.md ---

## Contributing

Contributions are welcome and always appreciated!

To begin working on an issue, simply leave a comment indicating that you're taking it on. There's no need to be officially assigned to the issue before you start.

### Before Starting
Do keep in mind before you start working on an issue / posting a PR:
- Search existing PRs related to that issue which might close them
- Confirm if other contributors are working on the same issue

### Tips & Things to Consider
- We are active in Discord and can help out if you get stuck, [join us!](https://responsively.app/join-discord)
- PRs with tests are highly appreciated
- Avoid adding third party libraries, whenever possible
- Unless you are helping out by updating dependencies, you should not be uploading your yarn.lock or updating any dependencies in your PR
- If you are unsure where to start, contact us and we will point you to a first good issue

## Run Locally
Ensure you have the following dependencies installed:
- Install `node` and `yarn`
- Configure your IDE to support ESLint and Prettier extensions.

After having above installed, proceed through the following steps to setup the codebase locally.

- Fork the project & [clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) it locally.

![fork-project](https://github.com/responsively-org/responsively-app/assets/87022870/2cae8b2a-850c-4f80-8ede-32eba622a854)

- Create a new separate branch.

```bash
git checkout -b BRANCH_NAME
```
- Go to the desktop-app directory.

```bash
cd desktop-app
```

- Run the following command to install dependencies inside the desktop-app directory.

```bash
yarn
```

- This will start the app for local development with live reloading.

```bash
yarn dev
```

## Running Tests

It is crucial to test your code before submitting a pull request. Please ensure that you can make a complete production build before you submit your code for merging.

- Build the project
```bash
yarn buil


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
