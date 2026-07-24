# KI: plotly/plotly.js

## Overview
[Plotly.js](https://plotly.com/javascript) is a standalone JavaScript data visualization library, and it also powers the Python and R modules named `plotly` in those respective ecosystems (referred to as [Plotly.py](https://plotly.com/python) and [Plotly.R](http://plotly.com/r)).

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 134 files across 15 directories
- **File types:** .js: 61, .ttf: 23, .md: 18, .yml: 11, .json: 5, .mjs: 5, .html: 4

## Documentation Sections
- Table of contents
- Load as a node module
- Load via script tag
- The script HTML element
- Un-minified versions are also available on CDN
- MathJax
- Need to have several WebGL graphs on a page?
- Bundles
- Alternative ways to load and build plotly.js
- Documentation
- Bugs and feature requests
- Contributing
- Notable contributors
- Copyright and license
- Versioning
- Community

## Core Structure
```
  .gitignore
  .npmignore
  BUILDING.md
  CHANGELOG.md
  CITATION.cff
  CONTRIBUTING.md
  CUSTOM_BUNDLE.md
  LICENSE
  README.md
  SECURITY.md
  appveyor.yml
  biome.json
  bower.json
  code_of_conduct.md
  composer.json
  esbuild-config.js
  package-lock.json
  package.json
  .github/
    FUNDING.yml
    PULL_REQUEST_TEMPLATE.md
    SUPPORT.md
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    actions/
      run-xvfb/
        action.yml
      setup-chrome/
        action.yml
      setup-image-env/
        action.yml
      setup-workspace/
        action.yml
    fonts/
      GravitasOne_400Regular.ttf
      NotoSans-Bold.ttf
      NotoSans-Italic.ttf
      NotoSans-Regular.ttf
      NotoSansMono-Bold.ttf
      NotoSansMono-Regular.ttf
      NotoSerif-Bold.ttf
      NotoSerif-BoldItalic.ttf
      NotoSerif-Italic.ttf
      NotoSerif-Regular.ttf
      OldStandard-Bold.ttf
      OldStandard-Italic.ttf
      OldStandard-Regular.ttf
      PT_Sans-Narrow-Web-Bold.ttf
      PT_Sans-Narrow-Web-Regular.ttf
      Raleway-Bold-Italic.ttf
      Raleway-Bold.ttf
      Raleway-Regular-Italic.ttf
      Raleway-Regular.ttf
      Roboto-Bold.ttf
      Roboto-BoldItalic.ttf
      Roboto-Italic.ttf
      Roboto-Regular.ttf
      SOURCES.md
    scripts/
      check-un-geodata.mjs
      env_build.sh
      env_image.sh
      split_files.mjs
      test.sh
    workflows/
      check-draftlog.yml
      check-un-geodata.yml
      ci.yml
      publish-dist.yml
      upload-dev-build.yml
  devtools/
    dashboard_utilities.mjs
    regl_codegen/
      devtools.js
      index.html
      server.mjs
    test_dashboard/
      devtools.js
      index-mathjax3.html
      index-mathjax3chtml.html
      index.html
      perf.js
      server.mjs
      strict.js
      style.css
  draftlogs/
    7773_fix.md
    7802_change.md
    7836_fix.md
    7837_fix.md
    7838_fix.md
    README.md
  lib/
    bar.js
    barpolar.js
    box.js
    calendars.js
    candlestick.js
    carpet.js
    choropleth.js
    choroplethmap.js
    choroplethmapbox.js
    cone.js
    contour.js
    contourcarpet.js
    core.js
    densitymap.js
    densitymapbox.js
    funnel.js
    funnelarea.js
    heatmap.js
    histogram.js
    histogram2d.js
    histogram2dcontour.js
    icicle.js
    image.js
    index-basic.js
    index-cartesian.js
    index-finance.js
    index-geo.js
    index-gl2d.js
    index-gl3d.js
    index-map.js
    index-mapbox.js
    index-strict.js
    index.js
    indicator.js
    is
```

## Quick Start
```bash
npm i --save plotly.js-dist-min
You may also consider using [`plotly.js-dist`](https://www.npmjs.com/package/plotly.js-dist) if you prefer using an unminified package.
---
> In the examples below, the `Plotly` object is added to the window scope by the `script` tag. The `newPlot` method is then used to draw an interactive figure as described by `data` and `layout` into the desired `div` here named `gd`. As demonstrated in the example above, basic knowledge of HTML and [JSON](https://en.wikipedia.org/wiki/JSON) syntax is enough to get started, i.e., with or without JavaScript! To learn and build more with plotly.js, please visit the [plotly.js documentation](https://plotly.com/javascript).
Alternatively, you may consider using [native ES6 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) in the script tag.
Fastly supports Plotly.js with free CDN service. Read more at <https://www.fastly.com/open-source>.
While non-minified source files may contain characters outside UTF-8, it is recommended that you specify the `charset` when loading those bundles.
> Please note that as of v2 the "plotly-latest" outputs (e.g. https://cdn.plot.ly/plotly-latest.min.js) will no longer be updated on the CDN, and will stay at the last v1 patch v1.58.5. Therefore, to use the CDN with plotly.js v2 and higher, you must specify an exact plotly.js version.
You can load either version two or version three of MathJax files. For example:
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Plotly.js

Thanks for your interest in contributing to Plotly.js! We are actively looking for
diverse contributors, with diverse backgrounds and skills.

This document outlines the general way that changes get made to this library and by whom,
and then provides specific technical information about how to set up a development
environment for doing development and running tests.

## Code of Conduct

Please check out our [Code of Conduct](code_of_conduct.md). Don't tl:dr; it
but the general idea is to be nice.

## Plotly.js vs Plotly.py and Plotly.R

[Plotly.js](https://plotly.com/javascript) is a standalone Javascript data visualization library, and it also powers the Python and R modules named `plotly` in those respective ecosystems (referred to as [Plotly.py](https://plotly.com/python) and [Plotly.R](http://plotly.com/r), respectively, for clarity). There also exist Plotly.js-powered libraries for other languages such as Julia, Scala, Rust, .NET and even C++!

The basic architecture of Plotly.js is to accept [JSON](https://json.org/) representation of figures that adhere to the [figure schema](https://plotly.com/javascript/reference/index/) and draw interactive graphical representations of these figures in a browser. Libraries in other languages like Python and R provide idiomatic interfaces for users of those languages to create and manipulate these JSON structures, and arrange for them to be rendered in a browser context by Plotly.js. This means that in many cases, when a Python or R user wishes to add a feature to the library they know as `plotly`, the relevant changes must be implemented in Plotly.js, in this repo.

## How do changes get made to Plotly.js?

 A **new feature** is composed of additions to the schema - adding new attributes, adding entire new trace types, or just adding new values to existing attributes - along with the associated drawing code. This project has a strong commitment to backwards-compatibility,  so changing the graph


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
