# KI: tanstack/hotkeys

## Overview
> [!NOTE] > TanStack Hotkeys is alpha. We are actively developing the library and are open to feedback and contributions.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 122 files across 26 directories
- **File types:** .md: 96, .json: 7, .yml: 7, .yaml: 3, .js: 2, .cursorignore: 1, .editorconfig: 1

## Documentation Sections
- [Become a Sponsor!](https://github.com/sponsors/tannerlinsley/)
- TanStack Hotkeys
- <a href="https://tanstack.com/hotkeys">Read the docs →</a>
- Get Involved
- Partners
- Explore the TanStack Ecosystem

## Core Structure
```
  .coderabbit.yaml
  .cursorignore
  .editorconfig
  .gitignore
  .npmrc
  .nvmrc
  .prettierignore
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  README.md
  eslint.config.js
  knip.json
  nx.json
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  prettier.config.js
  tsconfig.json
  vitest.workspace.ts
  .changeset/
    config.json
  .github/
    CODEOWNERS
    FUNDING.yml
    pull_request_template.md
    renovate.json
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
    workflows/
      autofix.yml
      pr.yml
      release.yml
      zizmor.yml
  docs/
    config.json
    devtools.md
    installation.md
    overview.md
    framework/
      angular/
        quick-start.md
        guides/
          formatting-display.md
          hotkey-recording.md
          hotkeys.md
          key-state-tracking.md
          sequence-recording.md
          sequences.md
        reference/
          index.md
          functions/
            injectDefaultHotkeysOptions.md
            injectHeldKeyCodes.md
            injectHeldKeys.md
            injectHotkey.md
            injectHotkeyRecorder.md
            injectHotkeyRegistrations.md
            injectHotkeySequence.md
            injectHotkeySequenceRecorder.md
            injectHotkeySequences.md
            injectHotkeys.md
            injectHotkeysContext.md
            injectKeyHold.md
            provideHotkeys.md
          interfaces/
            AngularHotkeyRecorder.md
            AngularHotkeySequenceRecorder.md
            HotkeyRegistrationsResult.md
            HotkeysContextValue.md
            HotkeysProviderOptions.md
            InjectHotkeyDefinition.md
            InjectHotkeyOptions.md
            InjectHotkeySequenceDefinition.md
            InjectHotkeySequenceOptions.md
          variables/
            HOTKEYS_INJECTION_TOKEN.md
      lit/
        quick-start.md
        guides/
          formatting-display.md
          hotkey-recording.md
          hotkeys.md
          key-state-tracking.md
          sequence-recording.md
          sequences.md
        reference/
          index.md
          classes/
            HeldKeyCodesController.md
            HeldKeysController.md
            HotkeyController.md
            HotkeyRecorderController.md
            HotkeyRegistrationsController.md
            HotkeySequenceController.md
            HotkeySequenceRecorderController.md
            KeyHoldController.md
          functions/
            hotkey.md
            hotkeySequence.md

```

## Agent Configuration

--- CONTRIBUTING.md ---
---
title: Contributing
id: contributing
---

# Contributing

## Questions

If you have questions about implementation details, help or support, then please use our dedicated community forum at [Github Discussions](https://github.com/tanstack/hotkeys/discussions) **PLEASE NOTE:** If you choose to instead open an issue for your question, your issue will be immediately closed and redirected to the forum.

## Reporting Issues

If you have found what you think is a bug, please [file an issue](https://github.com/tanstack/hotkeys/issues/new). **PLEASE NOTE:** Issues that are identified as implementation questions or non-issues will be immediately closed and redirected to [Github Discussions](https://github.com/tanstack/hotkeys/discussions)

## Suggesting new features

If you are here to suggest a feature, first create an issue if it does not already exist. From there, we will discuss use-cases for the feature and then finally discuss how it could be implemented.

## Development

Before proceeding with development, ensure you match one of the following criteria:

- Fixing a small bug
- Fixing a larger issue that has been previously discussed and agreed-upon by maintainers
- Adding a new feature that has been previously discussed and agreed-upon by maintainers

## Development Workflow

- Fork this repository, we prefer the `feat-*` branch name style
- Ensure you have `pnpm` installed
- Install projects dependencies and linkages by running `pnpm install`
- Auto-build and auto-test files as you edit by running `pnpm dev`
- Implement your changes and tests
- To run examples, follow their individual directions. Usually this includes:
  - cd into the example directory
  - Do NOT install dependencies again or do any linking. Nx already handles this for you. Only run install from the project root.
  - Starting the dev server with `pnpm dev` or `pnpm start` (from the example directory)
- To test in your own projects:
  - Build/watch for changes with `pnpm build`/`pnpm dev`
- Docume


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
