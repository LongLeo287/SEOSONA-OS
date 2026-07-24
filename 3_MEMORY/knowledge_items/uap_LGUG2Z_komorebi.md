# KI: LGUG2Z/komorebi

## Overview
![screenshot](https://user-images.githubusercontent.com/13164844/184027064-f5a6cec2-2865-4d65-a549-a1f1da589abf.png)

## Architecture & Tech Stack
- Rust
- **Total files:** 143 files across 6 directories
- **File types:** .md: 112, .json: 6, .yml: 6, .toml: 4, .lock: 2, .yaml: 2, .png: 2

## Documentation Sections
- komorebi
- Note: Students using devices enrolled in mobile device management (MDM)
- Note: Unexpected mobile device management (MDM) detection prompts
- Note: komorebi for Mac
- Overview
- Community
- Licensing for Personal Use
- Sponsorship for Personal Use
- Licensing for Commercial Use
- Installation
- Comparison With Fancy Zones
- Demonstrations
- Contribution Guidelines
- Commit hygiene
- PRs should contain only a single feature or bug fix
- Refactors to the codebase must have prior approval

## Core Structure
```
  .czrc
  .envrc
  .gitattributes
  .gitignore
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Cargo.lock
  Cargo.toml
  LICENSE.md
  PRIVACY.md
  README.md
  check_schema_docs.py
  deny.toml
  dependencies.json
  flake.lock
  flake.nix
  justfile
  komorebic.lib.ahk
  mkdocs.yml
  rust-toolchain.toml
  rustfmt.toml
  schema.asc.json
  schema.bar.json
  schema.json
  .github/
    FUNDING.yml
    dependabot.yml
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
    workflows/
      feature-check.yaml
      windows.yaml
  docs/
    design.md
    example-configurations.md
    index.md
    installation.md
    komorebi.ahk.txt
    komorebi.bar.example.json
    komorebi.example.json
    troubleshooting.md
    whkdrc.sample
    assets/
      layout-ratios_after.png
      layout-ratios_before.png
    cli/
      adjust-container-padding.md
      adjust-workspace-padding.md
      ahk-app-specific-configuration.md
      animation-duration.md
      animation-fps.md
      animation-style.md
      animation.md
      application-specific-configuration-schema.md
      bar-configuration.md
      border-colour.md
      border-implementation.md
      border-offset.md
      border-style.md
      border-width.md
      border.md
      cancel-preselect.md
      change-layout.md
      check.md
      clear-all-workspace-rules.md
      clear-named-workspace-layout-rules.md
      clear-named-workspace-rules.md
      clear-session-float-rules.md
      clear-workspace-layout-rules.md
      clear-workspace-rules.md
      close-workspace.md
      close.md
      complete-configuration.md
      configuration.md
      container-padding.md
      convert-app-specific-configuration.md
      cross-monitor-move-behaviour.md
      cycle-empty-workspace.md
      cycle-focus.md
      cycle-layout.md
      cycle-monitor.md
      cycle-move-to-monitor.md
      cycle-move-to-workspace.md
      cycle-move-workspace-to-monitor.md
      cycle-move.md
      cycle-send-to-monitor.md
      cycle-send-to-workspace.md
      cycle-stack-index.md
      cycle-stack.md
      cycle-workspace.md
      data-directory.md
      disable-autostart.md
      display-index-preference.md
      eager-focus.md
      enable-autostart.md
      enforce-workspace-rules.md
      ensure-named-workspaces.md
      ensure-workspaces.md
      fetch-app-specific-configuration.md
      flip-layout.md
      focus-last-workspace.md
      focus-monitor-at-cursor.md
      focus-monitor-
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to the Project

The project is a collection of contributions from both the project leaders and
community members. There are many ways to contribute, this can include content
in the project repositories, as well as contributing in public and private
conversation, assisting users, writing blog posts, and many other ways.

## How contributions are made

Contributions to the project primarily happen in the project source
repositories, but may also occur in other places, such as discussion forums and
public and private discourse.

## Contributing content to the Project

In order for the project leaders to manage sustained progress toward the
project goals and maintain project velocity, focus and quality, the project may
adjust the license terms over time.

Content contributed to the project must therefore be provided under
sufficiently liberal terms to allow these operations to proceed unimpeded. As
such contributions are accepted with the following understanding:

* Contributed content is licensed under the terms of the 0-BSD license
* Contributors accept the terms of the project license at the time of
  contribution

By making a contribution, you accept both the current project license terms,
and that all contributions that you have made are provided under the terms of
the 0-BSD license.

## Zero-Clause BSD

```
Permission to use, copy, modify, and/or distribute this software for  
any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL  
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES  
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE  
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY  
DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN  
AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT  
OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
