# KI: BartoszCichecki/LenovoLegionToolkit

## Overview
> [!IMPORTANT]
> _Archived on July 24, 2025, This project is no longer actively maintained._
> 
> Thank you to everyone who supported, used, contributed to, and shared this project. It's been an amazing journey watching it grow among Legion users.
> 
> As I no longer have time to maintain it, I’ve decided to archive the repo. Feel free to fork and continue development, if you'd like to carry it forward. All code remains available under the existing license.
> 
> For questions, issues, or maintenance, I recommend checking out forks from the community—or even starting your own!
> 
> Much love and happy coding,
>
> – Bartosz

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 134 files across 15 directories
- **File types:** .cs: 98, .yml: 8, .md: 7, .isl: 7, .csproj: 3, .DotSettings: 2, .bat: 2

## Documentation Sections
- Lenovo Legion Toolkit
- Table of Contents
- Disclaimer
- Download
- Compatibility
- Lenovo's software
- Other remarks
- Features
- Custom Mode
- RGB and lighting
- Hybrid Mode and GPU Working Modes
- Deactivate discrete NVIDIA GPU
- Overclock discrete NVIDIA GPUs

## Core Structure
```
  .gitattributes
  .gitignore
  CONTRIBUTING.md
  CONTRIBUTING_ja-JP.md
  CONTRIBUTING_zh-hans.md
  LICENSE
  LenovoLegionToolkit.sln
  LenovoLegionToolkit.sln.DotSettings
  README.md
  README_ja-JP.md
  README_zh-hans.md
  clean.bat
  crowdin.yml
  make.bat
  make_installer.iss
  .github/
    FUNDING.yml
    pull_request_template.md
    ISSUE_TEMPLATE/
      1_feature_request.yml
      2_bug_report.yml
      3_compatibility_request.yml
      config.yml
    workflows/
      build.yml
      release.yml
  InnoDependencies/
    Arabic.isl
    ChineseSimplified.isl
    ChineseTraditional.isl
    Greek.isl
    Latvian.isl
    Romanian.isl
    Vietnamese.isl
    install_dotnet.iss
  LenovoLegionToolkit.CLI/
    Flags.cs
    IpcClient.cs
    LenovoLegionToolkit.CLI.csproj
    Program.cs
  LenovoLegionToolkit.CLI.Lib/
    Constants.cs
    IpcConnectException.cs
    IpcException.cs
    IpcRequest.cs
    IpcResponse.cs
    LenovoLegionToolkit.CLI.Lib.csproj
    Extensions/
      PipeStreamExtensions.cs
  LenovoLegionToolkit.Lib/
    Enums.cs
    GlobalSuppressions.cs
    HttpClientFactory.cs
    Interfaces.cs
    IoCContainer.cs
    IoCModule.cs
    LenovoLegionToolkit.Lib.csproj
    LenovoLegionToolkit.Lib.csproj.DotSettings
    Native.cs
    NativeMethods.json
    NativeMethods.txt
    Structs.cs
    AutoListeners/
      AbstractAutoListener.cs
      GameAutoListener.cs
      IAutoListener.cs
      InstanceStartedEventAutoAutoListener.cs
      InstanceStoppedEventAutoAutoListener.cs
      ProcessAutoListener.cs
      TimeAutoListener.cs
      UserInactivityAutoListener.cs
      WiFiAutoListener.cs
    Controllers/
      AIController.cs
      DisplayBrightnessController.cs
      GPUController.cs
      GPUOverclockController.cs
      RGBKeyboardBacklightController.cs
      SmartFnLockController.cs
      SpectrumKeyboardBacklightController.cs
      WindowsPowerModeController.cs
      WindowsPowerPlanController.cs
      GodMode/
        AbstractGodModeController.cs
        GodModeController.cs
        GodModeControllerV1.cs
        GodModeControllerV2.cs
        IGodModeController.cs
      Sensors/
        AbstractSensorsController.cs
        ISensorsController.cs
        SensorsController.cs
        SensorsControllerV1.cs
        SensorsControllerV2.cs
        SensorsControllerV3.cs
    Extensions/
      AssemblyExtensions.cs
      ContainerBuilderExtensions.cs
      DateTimeExtensions.cs
      DictionaryExtensions.cs
      DisplayExtensions.cs
      DisplayPossibleS
```

## Quick Start
```bash
winget install BartoszCichecki.LenovoLegionToolkit
scoop bucket add versions
scoop bucket add extras
scoop install extras/lenovolegiontoolkit
```

## Agent Configuration

--- CONTRIBUTING.md ---
## Welcome to Lenvo Legion Toolkit contributing guide!

### Other language versions of this contributing guide:
* [简体中文版开发者指南](CONTRIBUTING_zh-hans.md)
* [日本語版の貢献ガイド](CONTRIBUTING_ja-JP.md)

Thanks for investing your time in contributing to this project! Giving the growing popularity of LLT, here are a few rules to follow to ensure that your contribution goes smoothly.

<br/>

_Due to large number of issues created, those that do not meet the criteria will be deleted without warning. Repeating offenders will be banned._

<br/>

**1. Before reporting an issue make yourself familiar with the README**

[README](https://github.com/BartoszCichecki/LenovoLegionToolkit/blob/master/README.md) is regularly updated to include answers to frequently asked questions as well as information about most common issues. Take your time to go through what is there before creating an issue or starting a discussion.

**2. Check already reported issues**

Go through [issues](https://github.com/BartoszCichecki/LenovoLegionToolkit/issues?q=is%3Aissue) that were already reported, as well as [discussions](https://github.com/BartoszCichecki/LenovoLegionToolkit/discussions?discussions_q=). Do not create duplicate issues or discussions. Even if the issue is marked as closed, you can still leave a comment there.

**3. Use English**

This makes it easier for everyone to follow the conversation.

**4. Respect scope of the project**

This is not meant to be a do-it-all type of application. The vision for the project is clear: provide a replacement of Vantage for Legion laptops. Do not request support for other types/models/etc devices.

**5. Verify your problem before creating an issue**

Make sure that a bug is really a bug in LLT - this isn't a free system troubleshooting forum. If you use modified version of Windows or your Windows is acting funny, that's on you.

**6. Describe your problem as best as you can**

Providing good description is key. Fill out all the fields of the form when creating a


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
