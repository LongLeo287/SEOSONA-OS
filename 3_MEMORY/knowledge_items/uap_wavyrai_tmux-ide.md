# KI: wavyrai/tmux-ide

## Overview
Turn any project into a tmux-powered terminal IDE with a simple `ide.yml` config file.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 126 files across 23 directories
- **File types:** .tsx: 68, .ts: 24, .md: 9, .json: 7, .yml: 7, .js: 2, .yaml: 2

## Documentation Sections
- tmux-ide
- Install
- Quick Start
- ide.yml Format
- Commands
- Templates
- Contributor Workflow
- CI
- Open Source Project Files
- Requirements
- License

## Core Structure
```
  .gitignore
  .prettierignore
  .prettierrc.json
  .silo-mount-allowlist
  .src-allowlist
  AGENTS.md
  ARCHITECTURE.md
  CHANGELOG.md
  CLAUDE.md
  CONTRIBUTING.md
  LICENSE
  README.md
  RELEASE.md
  SECURITY.md
  bunfig.toml
  eslint.config.js
  ide.yml
  package.json
  playwright.config.ts
  playwright.smoke.config.ts
  pnpm-lock.yaml
  pnpm-workspace.yaml
  tsconfig.json
  tsconfig.widgets.json
  turbo.json
  .github/
    PULL_REQUEST_TEMPLATE.md
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
    workflows/
      ci.yml
      release.yml
      smoke.yml
  bin/
    cli.js
    cli.ts
  dashboard/
    index.html
    package.json
    tsconfig.json
    vite.config.ts
    __tests__/
      CommandPalette.test.tsx
      PlanBodyView.test.tsx
      ProblemsTab.virtualization.test.tsx
      ProjectRail.test.tsx
      TabStrip.test.tsx
      keybinds.test.ts
      project-route.test.tsx
      settings.test.tsx
      setup.test.tsx
      setup.ts
      terminal-widget.test.tsx
      widgets.test.tsx
      diffs/
        MonacoDiffsView.test.tsx
      editor/
        buffer-store-autosave.test.ts
        buffer-store.test.ts
        dispatch.test.tsx
        fileKind.test.ts
        merge-conflict.test.tsx
        tab-strip.test.tsx
        three-way-merge.test.ts
      files/
        FilesSurface.test.tsx
      git/
        BranchPicker.test.tsx
        BranchPicker.virtualization.test.tsx
        CheckRunsRail.test.tsx
        CommitDialog.test.tsx
        CommitDialog.virtualization.test.tsx
        CreatePrModal.test.tsx
      lsp/
        poll-backoff.test.ts
      monaco/
        model-path.test.ts
        model-registry.test.ts
        pool.test.ts
        registry-git.test.ts
        sticky-diff-editor.test.tsx
      pty/
        PtySession.test.ts
        TerminalSurface.keybinds.test.tsx
        TerminalSurface.test.tsx
        pure.test.ts
        registry.test.ts
        tabKeybindings.test.ts
        terminalSearch.test.ts
      search/
        SearchView.virtualization.test.tsx
        editorOpen.test.ts
        search-service.test.ts
        searchBroker.test.ts
    src/
      App.tsx
      main.tsx
      styles.css
      components/
        ActivityBar.tsx
        BranchPicker.tsx
        ChatView.tsx
        CheckRunsRail.tsx
        CommandPalette.tsx
        CommitDialog.tsx
        CreatePrModal.tsx
        DiffsView.tsx
        DirectoryPicker.tsx
        KeyboardShortcuts.tsx
        NotesBridge.tsx
     
```

## Quick Start
```bash
npm install -g tmux-ide
tmux-ide init         # Scaffold ide.yml (auto-detects your stack)
tmux-ide              # Launch the IDE
tmux-ide stop         # Kill the session
tmux-ide restart      # Stop and relaunch
tmux-ide attach       # Reattach to a running session
tmux-ide inspect      # Inspect effective config + runtime state
| Command                                            | Description                             |
| -------------------------------------------------- | --------------------------------------- |
| `tmux-ide`                                         | Launch IDE from `ide.yml`               |
```

## Agent Configuration

--- AGENTS.md ---
# tmux-ide

A CLI tool that turns any project into a tmux-powered terminal IDE using a simple `ide.yml` config file.

## Quick Start

```bash
tmux-ide              # Launch IDE from ide.yml
tmux-ide init         # Scaffold ide.yml (auto-detects stack)
tmux-ide inspect      # Show resolved config + live tmux state
tmux-ide stop         # Kill session
tmux-ide attach       # Reattach to running session
```

## ide.yml Format

```yaml
name: project-name # tmux session name

before: pnpm install # optional pre-launch hook

rows:
  - size: 70% # row height percentage
    panes:
      - title: Claude 1 # pane border label
        command: claude # command to run (optional)
        size: 50% # pane width percentage (optional)
        dir: apps/web # per-pane working directory (optional)
        focus: true # initial focus (optional)
        env: # environment variables (optional)
          PORT: 3000

  - panes:
      - title: Dev Server
        command: pnpm dev
      - title: Shell

team: # optional agent team config
  name: my-team

theme: # optional color overrides
  accent: colour75
  border: colour238
  bg: colour235
  fg: colour248
```

### Agent Team Pane Fields

```yaml
panes:
  - title: Lead
    command: claude
    role: lead # optional layout metadata: "lead" or "teammate"
    focus: true
  - title: Frontend
    command: claude
    role: teammate
    task: "Work on components" # suggested task text for your prompts
```

### Orchestrator Config

```yaml
orchestrator:
  enabled: true
  auto_dispatch: true # auto-assign tasks to idle agents
  dispatch_mode: tasks # "tasks" or "goals"
  poll_interval: 5000 # ms between ticks
  stall_timeout: 300000 # ms before nudging idle agent
  max_concurrent_agents: 10
  worktree_root: .worktrees/ # git worktree per task
  master_pane: Master # lead pane excluded from dispatch
  before_run: pnpm install # hook before task starts
  after_run: pnpm lint # hook after task completes
  cleanup_on_done: false # remove worktree after c

--- CLAUDE.md ---
# tmux-ide

A CLI tool that turns any project into a tmux-powered terminal IDE using a simple `ide.yml` config file.

## Quick Start

```bash
tmux-ide              # Launch IDE from ide.yml
tmux-ide init         # Scaffold ide.yml (auto-detects stack)
tmux-ide inspect      # Show resolved config + live tmux state
tmux-ide stop         # Kill session
tmux-ide attach       # Reattach to running session
```

## ide.yml Format

```yaml
name: project-name # tmux

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
