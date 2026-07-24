# KI: Kanaries/pygwalker

## Overview
PyGWalker is a Python library that simplifies data analysis and visualization workflows by turning pandas, polars, and pyarrow table data into interactive visual interfaces. It offers a variety of features that make it a powerful tool for data exploration: - ##### Interactive Data Exploration: - Drag-and-drop interface for easy visualization creation. - Real-time updates as you make changes to the visualization. - Ability to zoom, pan, and filter the data. - ##### Data Cleaning and Transformation: - Visual data cleaning tools to identify and remove outliers or inconsistencies. - Ability to create new variables and features based on existing data. - ##### Advanced Visualization Capabilities: - Support for various chart types (bar charts, line charts, scatter plots, etc.). - Customization op

## Architecture & Tech Stack
- Python
- **Total files:** 120 files across 29 directories
- **File types:** .py: 35, .tsx: 27, .md: 18, .ts: 16, .json: 4, .gitignore: 3, .yml: 3

## Documentation Sections
- Features
- Getting Started
- Setup pygwalker
- pip
- Conda-forge
- Use pygwalker in Jupyter Notebook
- Quick Start
- Better Practices
- Example in local notebook
- Example in cloud notebook
- Programmatic Export of Charts
- edit the chart in the UI and click the save button
- Use pygwalker in Streamlit
- Adjust the width of the Streamlit page
- Add Title
- You should cache your pygwalker renderer, if you don't want your memory to

## Core Structure
```
  .gitignore
  .gitmodules
  .pylintrc
  CITATION.cff
  CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  MANIFEST.in
  README.md
  environment.yml
  pyproject.toml
  .github/
    ISSUE_TEMPLATE/
      any-questions-topics-you-want-to-share.md
      bug_report.md
      feature_request.md
    workflows/
      auto-ci.yml
      publish.yml
  app/
    .gitignore
    components.json
    index.html
    package.json
    playwright.config.ts
    postcss.config.js
    tailwind.config.js
    tsconfig.json
    vite.config.ts
    yarn.lock
    src/
      index.css
      index.tsx
      components/
        options.tsx
        codeExportModal/
          index.tsx
          usePythonCode.ts
        initModal/
          index.tsx
        preview/
          index.tsx
        runcellBanner/
          index.tsx
        ui/
          badge.tsx
          button.tsx
          checkbox.tsx
          dialog.tsx
          input.tsx
          label.tsx
          select.tsx
          tabs.tsx
          toggle-group.tsx
          toggle.tsx
        uploadChartModal/
          index.tsx
        uploadSpecModal/
          index.tsx
      dataSource/
        index.tsx
      interfaces/
        index.ts
      lib/
        dslToWorkflow.ts
        utils.ts
        vegaToDsl.ts
      notify/
        index.tsx
      store/
        common.ts
        communication.ts
        context.ts
      tools/
        exportDataframe.tsx
        exportTool.tsx
        openDesktop.tsx
        runcellTool.tsx
        saveTool.tsx
      utils/
        communication.tsx
        context.tsx
        formatSpec.ts
        save.ts
        theme.ts
        tracker.ts
        userConfig.ts
    tests/
      gwalker-smoke.spec.ts
  bin/
    pygwalker_command.py
  docs/
    CONTRIBUTING.md
    DEVELOPMENT.md
    README.de.md
    README.es.md
    README.fr.md
    README.ja.md
    README.ko.md
    README.ru.md
    README.tr.md
    README.zh.md
    image.png
  examples/
    README.md
    component_demo.ipynb
    dash_demo.py
    gradio_demo.py
    gw_config.json
    html_demo.py
    jupyter_demo.ipynb
    marimo_demo.py
    streamlit_demo.py
    web_server_demo.py
    reflex_demo/
      .gitignore
      README.md
      __init__.py
      rxconfig.py
      app/
        __init__.py
        app.py
  pygwalker/
    __init__.py
    _constants.py
    _typing.py
    errors.py
    py.typed
    spec.py
    api/
      __init__.py
      _walker_reuse.py
      adapter.py
      anywidget.py
      component.py
      gradio.py
      html.py
  
```

## Quick Start
```bash
pip install pygwalker
conda install -c conda-forge pygwalker
mamba install -c conda-forge pygwalker
You can use pygwalker without breaking your existing workflow. For example, you can call up PyGWalker with the dataframe loaded in this way:
![](https://docs-us.oss-us-west-1.aliyuncs.com/img/pygwalker/travel-ani-0-light.gif)
That's it. Now you have an interactive UI to analyze and visualize data with simple drag-and-drop operations.
![](https://docs-us.oss-us-west-1.aliyuncs.com/img/pygwalker/travel-ani-1-light.gif)
Cool things you can do with PyGwalker:
+ You can change the mark type into others to make different charts, for example, a line chart:
![graphic walker line chart](https://user-images.githubusercontent.com/8137814/221894699-b9623304-4eb1-4051-b29d-ca4a913fb7c7.png)
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to PyGWalker

The contributor workflow lives in [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

Start there for the supported local setup, including:

- Python editable installs and test commands.
- Frontend dependency installation, builds, type checks, and Playwright smoke tests.
- Optional local Graphic Walker source builds through `app`'s `dev:preinstall` script.
- Vite dev-server setup for JupyterLab hot reload.
- CI and package-build expectations.

Keeping the detailed guide under `docs/` lets the development notes and
troubleshooting page link to one maintained source of truth.



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
