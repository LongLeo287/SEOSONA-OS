# KI: NUKnightLab/juxtapose

## Overview
 JuxtaposeJS is a JavaScript library for making before/after image sliders

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- Python
-   Python deps: Flask, boto3, gunicorn, requests
- **Total files:** 100 files across 23 directories
- **File types:** .html: 24, .jpg: 14, .png: 12, .js: 11, .json: 8, .py: 7, .yml: 6
- **Dev dependencies:** adm-zip, prompt, simple-git, uglify-js
- **Keywords:** image, ui, slider, juxtapose, before, after

## Documentation Sections
- JuxtaposeJS
- Installation
- Create a Juxtapose Slider
- Modifications and Custom Behavior
- Security Information

## Available Commands
- `npm run dist` -- node tasks/dist.js
- `npm run stage` -- npm run dist && node tasks/stage.js
- `npm run stage_latest` -- npm run dist && node tasks/stage.js latest
- `npm run stage_dev` -- npm run dist && node tasks/stage.js dev

## Core Structure
```
  .gitignore
  .nvmrc
  AUTHORS
  DEVELOPER.md
  LICENSE
  README.md
  bower.json
  config.json
  env.sh.example
  example.html
  ez_setup.py
  fabfile.py
  package-lock.json
  package.json
  requirements.txt
  setuptools-15.1.zip
  deploy/
    config.common.yml
    config.prd.yml
    config.stg.yml
    playbook.deploy-repo.yml
    playbook.deploy-web.yml
    playbook.restart.yml
    templates/
      juxtapose.conf
  examples/
    dynamic-images.html
    example.html
    example_embed.html
    example_ie8.html
    js_example.html
    whitespace-fix-javascript.html
    whitespace-fix-media-queries.html
    JuxtaposeReactExample/
      README.md
      package.json
      public/
        index.html
      src/
        App.js
        index.js
        styles.css
    images/
      Sochi_11April2005.jpg
      Sochi_22Nov2013.jpg
      juxtapose-logo.psd
  juxtapose/
    css/
      juxtapose.css
    embed/
      index.html
      test.json
    js/
      juxtapose.js
  tasks/
    dist.js
    stage.js
  website/
    __init__.py
    app.py
    examples.json
    faq.json
    core/
      __init__.py
      settings.py
      wsgi.py
    static/
      css/
        juxtapose.css
        style.css
      img/
        .DS_Store
        Sochi_11April2005.jpg
        Sochi_22Nov2013.jpg
        glyphicons-halflings-white.png
        glyphicons-halflings.png
        juxtapose-gif.gif
        knight_foundation_logo.png
        knight_lab_logo.png
        mad_max_fire_after.jpg
        mad_max_fire_before.jpg
        national_science_foundation_logo.png
        northwestern_university_logo.png
        examples/
          logos/
            logo_austin_statesman.png
            logo_berliner.png
            logo_boston_globe.png
            logo_espn.jpg
            logo_fusion.png
            logo_tribune.png
          thumbs/
            thumb_berlin1945.jpg
            thumb_chicago_theater.jpg
            thumb_coin.jpg
            thumb_drought.jpg
            thumb_gaga.jpg
            thumb_illustration.png
            thumb_mayweather.jpg
            thumb_tornado.jpg
      js/
        .DS_Store
        html5shiv.js
        jxp-gif.js
        main.js
        smooth-scroll.js
        utils/
          gif.js
          gif.worker.js
          gif.worker.js.map
    templates/
      _about.html
      _demo.html
      _examples.html
      _footer.html
      _head.html
      _header.html
      _help.html
      _make.html
      _overview.html
      _storytelling_tools.html
      base.
```

## Quick Start
```bash
**Package Managers** — Juxtapose is available on both the [npm](https://www.npmjs.com/package/juxtaposejs) and [Bower](https://bower.io/) package registries. The following commands will, respectively, save Juxtapose to your package.json and bower.json requirements files.
There is also a [Meteor package](https://atmospherejs.com/kyleking/juxtapose-js) available.
The easiest way to create a Juxtapose slider is to go to to [https://juxtapose.knightlab.com][1] and use the tool to generate an embedable code snippet that you can use on any website. The tool is easy to use and requires no coding knowledge whatsoever. If you want to use JuxtaposeJS without using the embed generator, keep reading to learn about different implementation methods.
The easiest way to implement the image slider is to add this code to your markup:
Each `img` can also take additional attributes like so:
If each image has an `data-label` attribute defined, the slider will display a label on each image. If each image has a `data-credit` attribute defined, the slider will display a credit for each image.
The slider wrapper can also take some additional attributes as well to specify a few options:
Specifying a starting position with `data-startingposition` lets you focus the users attention on the part of the image where the change is most noticeable. To toggle the visibility of the labels and the credits respectively, set `data-showlabels` and `data-showcredits` to false. And to disable the animation, set `data-animate` to false.
If you are using Juxtapose in an existing responsive iFrame solution like [pym.js](https://blog.apps.npr.org/pym.js/) and don't want to use Juxtapose's built in (but faily opinionated) responsive iFrame solution, you can set `data-makeresponsive` to false.
The `JXSlider` class takes three arguments. First, is the string of the ID of the element you want to turn into a slider. Second is an array of two objects. Each object *must* have `src` defined and can optionally define a `label` and a `credit`. The third argument lets you set additional options for the image slider.
```

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
