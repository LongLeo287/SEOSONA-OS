# KI: tailwindlabs/prettier-plugin-tailwindcss

## Overview
A [Prettier v3+](https://prettier.io/) plugin for Tailwind CSS v3.0+ that automatically sorts classes based on [our recommended class order](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted).

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 123 files across 26 directories
- **File types:** .ts: 28, .html: 26, .js: 23, .json: 19, .jsx: 6, .yml: 5, .md: 3

## Documentation Sections
- Installation
- Upgrading to v0.5.x
- Options
- Specifying your Tailwind stylesheet path (Tailwind CSS v4+)
- Specifying your Tailwind JavaScript config path (Tailwind CSS v3)
- Sorting non-standard attributes
- Using regex patterns
- Sorting classes in function calls
- Sorting classes in template literals
- Public API
- API Options
- Sorter Methods
- Using regex patterns
- Preserving whitespace
- Preserving duplicate classes
- Compatibility with other Prettier plugins

## Core Structure
```
  .gitignore
  .oxlintrc.json
  .prettierignore
  CHANGELOG.md
  LICENSE
  README.md
  knip.json
  package.json
  pnpm-lock.yaml
  prettier.config.js
  tsconfig.json
  tsdown.config.ts
  vitest.config.ts
  .github/
    FUNDING.yml
    banner.jpg
    ISSUE_TEMPLATE/
      bug-report.md
      config.yml
    workflows/
      ci.yml
      prepare-release.yml
      release.yml
  scripts/
    copy-licenses.js
    install-fixture-deps.js
    release-channel.js
    release-notes.js
  src/
    config.ts
    console.ts
    create-plugin.ts
    expiring-map.ts
    index.ts
    internal.d.ts
    options.ts
    resolve.ts
    sorter.ts
    sorting.ts
    transform.ts
    types.ts
    utils.bench.ts
    utils.test.ts
    utils.ts
    versions/
      assets.ts
      v3.ts
      v4.ts
  tests/
    fixtures.test.ts
    format.test.ts
    plugins.test.ts
    sorter.test.ts
    tests.ts
    utils.ts
    fixtures/
      package.json
      basic/
        index.html
        output.html
        prettier.config.js
        tailwind.config.js
      cjs/
        index.html
        output.html
        prettier.config.js
        tailwind.config.cjs
      custom-jsx/
        index.jsx
        output.jsx
        prettier.config.js
        tailwind.config.js
      custom-pkg-name-v3/
        config.js
        index.html
        output.html
        package-lock.json
        package.json
      custom-pkg-name-v4/
        app.css
        index.html
        output.html
        package-lock.json
        package.json
      custom-vue/
        index.vue
        output.vue
        prettier.config.js
        tailwind.config.js
      esm/
        index.html
        output.html
        prettier.config.js
        tailwind.config.mjs
      esm-explicit/
        config.mjs
        index.html
        output.html
        prettier.config.js
      monorepo/
        .prettierrc
        package-lock.json
        package.json
        package-1/
          app.css
          index.jsx
          output.jsx
          package-lock.json
          package.json
        package-2/
          index.jsx
          output.jsx
          package-lock.json
          package.json
          tailwind.config.js
      no-local-version/
        app.css
        index.html
        output.html
        package-lock.json
        package.json
      no-prettier-config/
        index.html
        output.html
        tailwind.config.js
      no-stylesheet-given/
        index.html
        output.html
      plugins/
        index.html
      
```

## Quick Start
```bash
npm install -D prettier prettier-plugin-tailwindcss
When using a JavaScript config, you can import the types for IntelliSense:
As of v0.5.x, this plugin now requires Prettier v3 and is ESM-only. This means it cannot be loaded via `require()`. For more information see our [upgrade guide](https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/207#issuecomment-1698071122).
When using Tailwind CSS v4 you must specify your CSS file entry point, which includes your theme, custom utilities, and other Tailwind configuration options. To do this, use the `tailwindStylesheet` option in your Prettier configuration.
Note that paths are resolved relative to the Prettier configuration file.
To ensure that the class sorting takes into consideration any of your project's Tailwind customizations, it needs access to your [Tailwind configuration file](https://tailwindcss.com/docs/configuration) (`tailwind.config.js`).
By default the plugin will look for this file in the same directory as your Prettier configuration file. However, if your Tailwind configuration is somewhere else, you can specify this using the `tailwindConfig` option in your Prettier configuration.
Note that paths are resolved relative to the Prettier configuration file.
If a local configuration file cannot be found the plugin will fallback to the default Tailwind configuration.
By default this plugin sorts classes in the `class` attribute, any framework-specific equivalents like `className`, `:class`, `[ngClass]`, and any Tailwind `@apply` directives.
```

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
