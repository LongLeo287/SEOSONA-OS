# KI: microsoft/BotFramework-Emulator

## Overview
**Bot Framework Emulator being retired in favor of Agents Playground**

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 125 files across 24 directories
- **File types:** .ts: 68, .js: 13, .json: 13, .md: 10, .babelrc: 2, .gitignore: 2, .yml: 2

## Documentation Sections
- ARCHIVE NOTICE:
- ![Bot Framework Emulator](./docs/media/BotFrameworkEmulator_header.png)
- [Find out what's new with Bot Framework](https://github.com/Microsoft/botframework/blob/main/whats-new.md#whats-new)
- Bot Framework Emulator
- Download
- Supported platforms
- Documentation
- Feedback
- Related
- Nightly builds
- Contributing
- Reporting Security Issues

## Core Structure
```
  .babelrc
  .editorconfig
  .eslintrc.js
  .eslintrc.react.js
  .gitattributes
  .gitignore
  .node-version
  .prettierrc
  .travis.yml
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE.txt
  PRIVACY.md
  README.md
  SECURITY.md
  ThirdPartyNotices.txt
  babel-jest-config.js
  copyright.js
  credScanSuppressions.json
  credScanTargetFolders.tsv
  credScanTargetFoldersWindows.tsv
  env.js
  lerna.json
  package-lock.json
  package.json
  static-analysis-pipeline.yml
  testSetup.js
  tsconfig.json
  .config/
    tsaoptions.json
  .github/
    CODEOWNERS
    ISSUE_TEMPLATE/
      bug.md
      feature-request.md
      question.md
    workflows/
      ci.yaml
      pack.yaml
  .vscode/
    launch.json
  content/
    CHANNELS.md
  docs/
    media/
      BotFrameworkEmulator_header.png
  jestMocks/
    electronRemoteMock.js
    monacoEditorMock.js
    styleMock.js
    svgMock.js
  packages/
    app/
      .vscode/
        launch.json
        settings.json
      client/
        .babelrc
        .eslintignore
        .eslintrc.js
        .gitignore
        package.json
        tsconfig.json
        webpack.config.js
        .vscode/
          launch.json
        mocks/
          conversationQueueMocks.js
        public/
          manifest.json
        src/
          constants.ts
          extensions.ts
          hyperlinkHandler.spec.ts
          hyperlinkHandler.ts
          index.html
          index.tsx
          interceptError.spec.ts
          interceptError.ts
          interceptHyperlink.spec.ts
          interceptHyperlink.ts
          notificationManager.ts
          registerServiceWorker.ts
          shared.ts
          splash.html
          style.d.ts
          vendors.ts
          commands/
            botCommands.spec.ts
            botCommands.ts
            electronCommands.spec.ts
            electronCommands.ts
            emulatorCommands.spec.ts
            emulatorCommands.ts
            fileCommands.spec.ts
            fileCommands.ts
            index.ts
            miscCommands.spec.ts
            miscCommands.ts
            notificationCommands.spec.ts
            notificationCommands.ts
            settingsCommands.spec.ts
            settingsCommands.ts
            uiCommands.spec.ts
            uiCommands.ts
          platform/
            log/
              logService.spec.ts
              logService.ts
          state/
            index.ts
            store.ts
            helpers/
              botHelpers.spec.ts
        
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing

There are many ways to contribute to the Bot Framework Emulator project: reporting issues, submitting pull requests, and creating suggestions.

## Submitting Issues

The Bot Framework Emulator project tracks issues and feature requests using [GitHub issue tracker](https://github.com/Microsoft/BotFramework-Emulator/issues).

### Before Submitting an Issue

First, please do a search in open issues to see if the issue or feature request has already been filed. If there is an existing issue, add your comments to that issue.

If your issue is a question, consider [asking it on Stack Overflow](https://stackoverflow.com/questions/ask?tags=botframework) using the tag `botframework`.

### Writing Great Issues and Suggestions
* Provide reproducible steps, what the result of the steps was, and what you would have expected to happen.
* Always file a single bug or feature request per issue. Do not list multiple bugs or requests in the same issue.
* Do not add your issue as a comment to an existing issue unless it's for the identical input. Many issues look similar, but have different causes.
* Include a screenshot or animated GIF.

Don't feel bad if we can't reproduce the issue and ask you for more information!

***

## How to build from source

### Clone the repo

```
git clone https://github.com/Microsoft/BotFramework-Emulator.git
```

### Navigate to the project
```
cd BotFramework-Emulator
```

### Install global dependencies

> **NOTE:** Due to the version of Electron that the Emulator uses, it's recommended to use **Node v16.13.2** or above when building the project from source.
>
> **npm version 7.0.0** or greater is also required.

```
npm i -g lerna@6.1.0
```

>The Emulator (on Linux) leverages a library that uses `libsecret` so you may need to install it before running `npm install`.
>
>  Depending on your distribution, you will need to run the following command:
>
>  Debian/Ubuntu: `sudo apt-get install libsecret-1-dev`
>
>  Red Hat-based: `sudo yum in


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
