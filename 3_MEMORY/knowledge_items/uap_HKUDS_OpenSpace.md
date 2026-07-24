# KI: HKUDS/OpenSpace

## Overview
Package: openspace

## Tech Stack (from code)
- Python (166 files)
- TypeScript (79 files)
- TypeScript (React) (17 files)
- JavaScript (4 files)
- Shell (3 files)
- **Total:** 863 files, 335 directories
- **File types:** .md: 274, .skill_id: 262, .py: 166, .ts: 79, .tsx: 17, .png: 16, .json: 16, .gif: 5

## Dependencies

### Python Dependencies (from requirements.txt)
- `litellm>=1.70.0,<1.82.7  # pinned to avoid PYSEC-2026-2 supply-chain compromise (1.82.7/1.82.8 were malicious)`
- `python-dotenv>=1.0.0`
- `openai>=1.0.0`
- `jsonschema>=4.25.0`
- `mcp>=1.0.0`
- `anthropic>=0.71.0`
- `pillow>=12.0.0`
- `numpy>=1.24.0`
- `colorama>=0.4.6`
- `flask>=3.1.0`
- `pyautogui>=0.9.54`
- `pydantic>=2.12.0`
- `requests>=2.32.0`

## File Structure
```
  .gitignore
  COMMUNICATION.md
  LICENSE
  README.md
  README_CN.md
  pyproject.toml
  requirements.txt
  assets/
    add_custom_panel.png
    benchmark_income.png
    benchmark_kpi.png
    benchmark_quality_tokens.png
    benchmark_skill_taxonomy.png
    benchmark_task_showcase.png
    cli-typing.gif
    command_palette.png
    framework.png
    frontend_1.gif
    frontend_2.gif
    frontend_3.gif
    frontend_4.gif
    logo.png
    manga.png
    manga_v1.png
    my_daily_monitor_dark.png
    my_daily_monitor_evograph.png
    my_daily_monitor_light.png
    settings_api_keys.png
    settings_preferences.png
  frontend/
    .env.example
    README.md
    index.html
    package-lock.json
    package.json
    postcss.config.js
    tailwind.config.js
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
    public/
      openspace_icon.webp
    src/
      App.tsx
      index.css
      main.tsx
      vite-env.d.ts
      api/
        client.ts
        index.ts
        overview.ts
        skills.ts
        types.ts
        workflows.ts
      components/
        EmptyState.tsx
        ErrorBoundary.tsx
        LineageGraph.tsx
        MetricCard.tsx
        ProgressBar.tsx
        skill-detail/
          DiffViewer.tsx
          SkillEvolutionGraph.tsx
          SkillVersionDrawer.tsx
          SkillVersionFilterBar.tsx
      hooks/
        useSkillEvolutionGraphData.ts
      i18n/
        en.json
        index.ts
        zh.json
      layouts/
        MainLayout.tsx
      pages/
        DashboardPage.tsx
        SkillDetailPage.tsx
        SkillsPage.tsx
        WorkflowDetailPage.tsx
        WorkflowsPage.tsx
      utils/
        diffParser.ts
        format.ts
        skillClasses.ts
  gdpval_bench/
    README.md
    __init__.py
    __main__.py
    calc_subset_performance.py
    config.json
    requirements-eval.txt
    run_benchmark.py
    task_loader.py
    tasks_50.json
    tasks_50_full.jsonl
    token_tracker.py
    .openspace/
      openspace.db
    skills/

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
