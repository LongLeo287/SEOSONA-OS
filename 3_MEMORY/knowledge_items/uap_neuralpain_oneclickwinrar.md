# KI: neuralpain/oneclickwinrar

## Overview
> [!NOTE] > For one-time use, copy and paste the related one-line commands into a **PowerShell** terminal, respond to the necessary prompts and wait for the process to complete. > > For more functionality, click the highlighted names to download the script and [configure](#configuration) it.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 65 files across 14 directories
- **File types:** .ps1: 43, .png: 4, .lnk: 4, .md: 3, .sh: 2, .exe: 2, .gitattributes: 1

## Core Capabilities
- Install and license any available version of WinRAR for both 32-bit and 64-bit architectures
- Automatically download and install the latest English WinRAR (64-bit) installer
- Optionally download a specific version of WinRAR and/or preserve the installer[^3] for future installations
- Status updates via Windows toast notifications[^4]
- Create custom licenses for your personal use[^5]
- Remove WinRAR licenses (for whatever reason)
- Uninstall WinRAR

### Script comparison table

|                   | oneclickrar | installrar | licenserar | unlicenserar |
| ----------------- | :---------: | :--------: | :--------: | :----------: |
| installation      |      ✓      |     ✓      |     ✗      |      ✗       |
| licensing         |      ✓      |     ✗      |     ✓      |      ✗       |
| check for updates |      ✓      |     ✓      |     ✗      |      ✗       |
| overwriting       |      ✓      |     ✗      |     ✓      |      ✗       |
| download-only     |      ✓      |     ✗      |     ✗      |      ✗       |
| un-licensing      |      ✓      |     ✗      |     ✗      |      ✓       |
| uninstall         |      ✓      |     ✗      |     ✗      |      ✓       |
| make you happy    |      ✓      |     ✓      |     ✓      |      ✓       |

> [!NOTE]
> `oneclickwinrar` will not overwrite existing licenses unless explicitly instructed to do so.

## Documentation Sections
- Contents
- Development plans
- Other plans
- What's included?
- [oneclickrar.cmd][oneclick] _(recommended for most users)_
- [installrar.cmd][install]
- [licenserar.cmd][license]
- [unlicenserar.cmd][unlicense]
- Features
- Script comparison table
- Benefits
- Limitations
- How to use
- Basic usage
- Advanced usage
- Configuration

## Core Structure
```
  .gitattributes
  .gitignore
  CHANGELOG
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  README.md
  README.txt
  VERSION
  build.sh
  installrar.ps1
  licenserar.ps1
  oneclickrar.ps1
  release.sh
  unlicenserar.ps1
  .github/
    stale.yml
  assets/
    oneclickwinrar-github-thumb.png
    images/
      oneclickwinrar-header.jpg
      oneclickwinrar-header.png
      oneclickwinrar-header.webp
      oneclickwinrar-header@2x.png
      oneclickwinrar@2x.png
  bin/
    README
    winrar-keygen/
      LICENSE
      winrar-keygen-x64.exe
      winrar-keygen-x86.exe
  src/
    includes/
      common/
        Confirm-QueryResult.ps1
        Defaults.ps1
        Format-Text.ps1
        Locations.ps1
        Logging.ps1
        New-Toast.ps1
        Select-WinrarInstallation.ps1
        Stop-OcwrOperation.ps1
        Title.ps1
        version_format.ps1
      core/
        Get-LanguageName.ps1
        installation.ps1
        licensing.ps1
        uninstallation.ps1
        unlicensing.ps1
        updates.ps1
        oneclick/
          Find-ScriptNamePosition.ps1
          Resolve-DownloadConfiguration.ps1
          Resolve-OperationMode.ps1
          Resolve-SpecialCode.ps1
          Set-ConfigurationFromData.ps1
          Set-OcwrOperationMode.ps1
      messages/
        messages_installrar.ps1
        messages_licenserar.ps1
        messages_oneclickrar.ps1
        messages_shared.ps1
        messages_unlicenserar.ps1
      patches/
        licenserar_license_error.ps1
        licenserar_license_precheck.ps1
        oneclickrar_installation_set_location.ps1
        oneclickrar_license_error.ps1
        oneclickrar_license_precheck.ps1
        status_codes.ps1
        winrar_language_list.ps1
        winrar_version_list.ps1
    templates/
      batch_header.cmd
      installrar.template.ps1
      licenserar.template.ps1
      oneclickrar.template.ps1
      unlicenserar.template.ps1
  tests/
    Uninstall WinRAR (32-bit).lnk
    Uninstall WinRAR.lnk
    WinRAR (32-bit).lnk
    WinRAR.lnk
```

## Quick Start
```bash
>                WinRAR - What's new in the latest version
>
>
>  Version 7.22
>
>  1. Deleting from solid archives reverted to pre-7.20 state to finalize
>     the fix in WinRAR 7.21 and avoid potential checksum errors.
>
>
>  Version 7.21
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to oneclickwinrar

We welcome contributions from the community! Whether you're fixing a bug,
improving the documentation, or proposing a new feature, your help is
appreciated. Please follow these guidelines to make the contribution process as
smooth as possible.

## How to Contribute

1. **Fork the Repository**: Start by forking the repository. This allows you to
   make changes without affecting the original project.

2. **Clone Your Fork**: Clone your fork to your local machine to start working
   on the changes.

3. **Create a New Branch**: For each new feature or fix, create a new branch.
   Branch names should be descriptive and reflect the change being made.

4. **Make Your Changes**: Implement your changes, adhering to the existing
   coding style as much as possible.

5. **Test Your Changes**: Ensure your changes do not break existing
   functionality. If possible, add tests to cover the new functionality or
   fixes.

6. **Commit Your Changes**: Make sure your commit messages are clear and follow
   best practices. Each commit should represent a logical change.

7. **Push to Your Fork**: Push your changes to your fork on GitHub.

8. **Submit a Pull Request**: Go to the original repository and submit a pull
   request from your fork. Provide a clear description of the changes and any
   other relevant information.

## Reporting Issues

If you find a bug or have a suggestion for improving the script, please use the
GitHub Issues section to report it. Include as much detail as possible, such as:

- A clear and descriptive title
- A detailed description of the issue or suggestion
- Steps to reproduce the issue (if applicable)
- Possible solutions or ideas you have in mind

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all
contributors. By participating in this project, you agree to abide by our
[Code of Conduct][coc].

## Questions or Comments?

If you have any questions or comments about contributing


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
