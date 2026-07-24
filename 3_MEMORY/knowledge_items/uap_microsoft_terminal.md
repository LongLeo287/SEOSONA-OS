# KI: microsoft/terminal

## Overview
- [Installing and running Windows Terminal](#installing-and-running-windows-terminal) - [Microsoft Store \[Recommended\]](#microsoft-store-recommended) - [Other install methods](#other-install-methods) - [Via GitHub](#via-github) - [Via Windows Package Manager CLI (aka winget)](#via-windows-package-manager-cli-aka-winget) - [Via Chocolatey (unofficial)](#via-chocolatey-unofficial) - [Via Scoop (unofficial)](#via-scoop-unofficial) - [Installing Windows Terminal Canary](#installing-windows-terminal-canary) - [Terminal \& Console Overview](#terminal--console-overview) - [Windows Terminal](#windows-terminal) - [The Windows Console Host](#the-windows-console-host) - [Shared Components](#shared-components) - [Creating the new Windows Terminal](#creating-the-new-windows-terminal) - [Resources](#r

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 121 files across 26 directories
- **File types:** .md: 24, .txt: 16, .h: 15, .json: 12, .dll: 12, .yml: 8, .cmake: 8

## Documentation Sections
- Welcome to the Windows Terminal, Console and Command-Line repo
- Installing and running Windows Terminal
- Microsoft Store [Recommended]
- Other install methods
- NOTE: If you are using PowerShell 7+, please run
- Import-Module Appx -UseWindowsPowerShell
- before using Add-AppxPackage.
- Installing Windows Terminal Canary
- Terminal & Console Overview
- Windows Terminal
- The Windows Console Host
- Shared Components
- Creating the new Windows Terminal
- Resources

## Core Structure
```
  .clang-format
  .editorconfig
  .git-blame-ignore-revs
  .gitattributes
  .gitignore
  .vsconfig
  .wt.json
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Directory.Build.props
  Directory.Build.targets
  LICENSE
  NOTICE.md
  NuGet.Config
  OpenConsole.slnx
  README.md
  SECURITY.md
  SUPPORT.md
  Scratch.sln
  XamlStyler.json
  common.openconsole.props
  conhost.slnf
  consolegit2gitfilters.json
  custom.props
  dirs
  vcpkg.json
  .config/
    configuration.vsEnterprise.winget
    configuration.vsProfessional.winget
    configuration.winget
    dotnet-tools.json
  .github/
    PULL_REQUEST_TEMPLATE.md
    ISSUE_TEMPLATE/
      Bug_Report.yml
      Feature_Request.yml
      config.yml
    actions/
      spelling/
        README.md
        advice.md
        candidate.patterns
        config.json
        excludes.txt
        line_forbidden.patterns
        reject.txt
        allow/
          README.md
          allow.txt
          apis.txt
          chinese.txt
          colors.txt
          fonts.txt
          japanese.txt
          math.txt
          microsoft.txt
          names.txt
        expect/
          README.md
          alphabet.txt
          expect.txt
          web.txt
        patterns/
          README.md
          patterns.txt
    linters/
      .markdown-lint.yml
    policies/
      resourceManagement.yml
    workflows/
      addToProject.yml
      spelling2.yml
      winget.yml
  .nuget/
    packages.config
  .vscode/
    extensions.json
    launch.json
    settings.json
    tasks.json
  dep/
    Console/
      ConIoSrv.h
      conapi.h
      condrv.h
      conmsgl1.h
      conmsgl2.h
      conmsgl3.h
      csrmsg.h
      ntcon.h
      ntcsrdll.h
      ntcsrmsg.h
      ntlpcapi.h
      winconp.h
    NT/
      ntioapi_x.h
    Win32K/
      winuserp.h
    WinAppDriver/
      EULA.rtf
      Microsoft.Win32.Primitives.dll
      Microsoft.Win32.Registry.dll
      MitaBroker.dll
      MitaLite.Foundation.dll
      MitaLite.Localization.dll
      MitaLite.UIAutomationAdapter.dll
      MitaLite.UIAutomationClient.dll
      Newtonsoft.Json.dll
      Readme.txt
      System.Diagnostics.Process.dll
      System.Threading.Thread.dll
      WinAppDriver.exe
      WinAppDriverCore.dll
      cpprest140_2_8.dll
    nuget/
      nuget.exe
      packages.config
    telemetry/
      ProjectTelemetry.h
    vcpkg-overlay-ports/
      fmt/
        0001-When-using-MSVC-x86-to-compile-v12.0.0-or-v12.1.0-co.patch
        portfile.cmake
        usage
        vcpkg.json

```

## Quick Start
```bash
> [!NOTE]
> If you install Terminal manually:
>
> * You may need to install the [VC++ v14 Desktop Framework Package](https://docs.microsoft.com/troubleshoot/cpp/c-runtime-packages-desktop-bridge#how-to-install-and-update-desktop-framework-packages).
>   This should only be necessary on older builds of Windows 10 and only if you get an error about missing framework packages.
> * Terminal will not auto-update when new builds are released so you will need
>   to regularly install the latest Terminal release to receive all the latest
>   fixes and improvements!
[winget](https://github.com/microsoft/winget-cli) users can download and install
the latest Terminal release by installing the `Microsoft.WindowsTerminal`
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Terminal Contributor's Guide

Below is our guidance for how to report issues, propose new features, and submit contributions via Pull Requests (PRs).

## Open Development Workflow

The Windows Terminal team is VERY active in this GitHub Repo. In fact, we live in it all day long and carry out all our development in the open!

When the team finds issues we file them in the repo. When we propose new ideas or think-up new features, we file new feature requests. When we work on fixes or features, we create branches and work on those improvements. And when PRs are reviewed, we review in public - including all the good, the bad, and the ugly parts.

The point of doing all this work in public is to ensure that we are holding ourselves to a high degree of transparency, and so that the community sees that we apply the same processes and hold ourselves to the same quality-bar as we do to community-submitted issues and PRs. We also want to make sure that we expose our team culture and "tribal knowledge" that is inherent in any closely-knit team, which often contains considerable value to those new to the project who are trying to figure out "why the heck does this thing look/work like this???"

### Repo Bot

The team triages new issues several times a week. During triage, the team uses labels to categorize, manage, and drive the project workflow.

We employ [a bot engine](./doc/bot.md) to help us automate common processes within our workflow.

We drive the bot by tagging issues with specific labels which cause the bot engine to close issues, merge branches, etc. This bot engine helps us keep the repo clean by automating the process of notifying appropriate parties if/when information/follow-up is needed, and closing stale issues/PRs after reminders have remained unanswered for several days.

Therefore, if you do file issues, or create PRs, please keep an eye on your GitHub notifications. If you do not respond to requests for information, your issues/PRs may be closed automati


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
