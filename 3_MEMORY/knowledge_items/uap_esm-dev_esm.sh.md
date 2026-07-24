# KI: esm-dev/esm.sh

## Overview
A _no-build_ JavaScript CDN for modern web development.

## Architecture & Tech Stack
- Go
- **Total files:** 131 files across 16 directories
- **File types:** .mjs: 89, .go: 19, .md: 11, .yml: 5, .editorconfig: 1, .gitignore: 1, .jsonc: 1

## Documentation Sections
- esm.sh
- How to Use
- Supported Registries
- Transforming `.ts(x)`/`.vue`/`.svelte` on the Fly
- Specifying Dependencies
- Aliasing Dependencies
- Bundling Strategy
- Tree Shaking
- Development Build
- ESBuild Options
- CSS-In-JS
- Web Worker
- Using Import Maps
- Escape Hatch: Raw Source Files
- Using `esm.sh/tsx`

## Core Structure
```
  .editorconfig
  .gitignore
  AGENTS.md
  CHANGELOG-CLI.md
  CHANGELOG-SERVER.md
  CONTRIBUTING.md
  Dockerfile
  HOSTING.md
  LICENSE
  Makefile
  README.md
  config.example.jsonc
  go.mod
  go.sum
  main.go
  .github/
    FUNDING.yml
    ISSUE_TEMPLATE/
      failing-import-in-browser.md
      failing-import-in-deno.md
    workflows/
      release-cli.yml
      release-server.yml
      stage.yml
      test.yml
  cli/
    README.md
    cli.go
    command_add.go
    command_tidy.go
    utils.go
    version.go
    npm/
      README.md
      install.mjs
      package.json
      bin/
        esm.sh
  internal/
    app_dir/
      app_dir.go
    deno/
      deno.go
    fetch/
      fetch.go
    importmap/
      importmap.go
      importmap_test.go
      meta.go
      scope.go
    jsonc/
      jsonc.go
    mime/
      mime.go
    npm/
      npm.go
      npm_test.go
      package_json.go
    npm_replacements/
      build.go
      src/
        README.md
        array-buffer-byte-length.mjs
        array-every.mjs
        array-includes.mjs
        array-map.mjs
        array.from.mjs
        array.of.mjs
        array.prototype.at.mjs
        array.prototype.concat.mjs
        array.prototype.copywithin.mjs
        array.prototype.entries.mjs
        array.prototype.every.mjs
        array.prototype.fill.mjs
        array.prototype.filter.mjs
        array.prototype.find.mjs
        array.prototype.findindex.mjs
        array.prototype.findlast.mjs
        array.prototype.findlastindex.mjs
        array.prototype.flat.mjs
        array.prototype.flatmap.mjs
        array.prototype.foreach.mjs
        array.prototype.includes.mjs
        array.prototype.indexof.mjs
        array.prototype.join.mjs
        array.prototype.keys.mjs
        array.prototype.lastindexof.mjs
        array.prototype.map.mjs
        array.prototype.push.mjs
        array.prototype.reduce.mjs
        array.prototype.reduceright.mjs
        array.prototype.slice.mjs
        array.prototype.some.mjs
        array.prototype.splice.mjs
        array.prototype.toreversed.mjs
        array.prototype.tosorted.mjs
        array.prototype.tospliced.mjs
        array.prototype.unshift.mjs
        array.prototype.values.mjs
        array.prototype.with.mjs
        arraybuffer.prototype.slice.mjs
        call-bind.mjs
        clone-regexp.mjs
        concat-map.mjs
        data-view-buffer.mjs
        data-view-byte-length.mjs
        data-view-byte-offset.mjs
        deep-extend.mjs
        defaults.
```

## Quick Start
```bash
With [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap), you can even use bare import specifiers instead of URLs:
> More usages about import maps can be found in the [**Using Import Maps**](#using-import-maps) section.
- **[NPM](https://npmjs.com)**:
- **[JSR](https://jsr.io)** (starts with `/jsr/`):
- **[GitHub](https://github.com)** (starts with `/gh/`):
- **[pkg.pr.new](https://pkg.pr.new)** (starts with `/pr/` or `/pkg.pr.new/`):
```

## Agent Configuration

--- AGENTS.md ---
# esm.sh

A _no-build_ JavaScript CDN for modern web development.

## Project Structure

- `cli/`: Command-line interface (releases as the npm `esm.sh` CLI).
- `internal/`: Shared Go packages reused by both the server and the CLI—NPM resolution, storage, build helpers, and related utilities.
- `server/`: Main HTTP service: request handling, bundling, and CDN behavior.
- `test/`: Deno-based integration suites; each subdirectory exercises imports against a running server (`test/.template` is the scaffold for new cases).
- `web/`: Landing site and docs: static assets plus Go handlers that serve them alongside the CDN.

## Running the Server in Debug Mode

```bash
make run/server
```

Then you can import modules from `http://localhost:8080/<package>[@<version>][/<path>][?<query>]` in browser/Deno.

More usage examples can be found in the [README](./README.md).

## Running Server Integration Tests

We use [Deno](https://deno.land) to run all the integration testing cases. Make sure you have Deno installed on your computer.

```bash
# Run all tests
make test/server

# Run a specific test
make test/server dir=react-18
```

To add a new integration test case, copy the [test/.template](./test/.template) directory and rename it to your case name.

```bash
# copy the testing template
cp -r test/.template test/test-case-name
# edit the test code
vi test/test-case-name/test.ts
# run the test
make test/server dir=test-case-name
```

## CDN

The project has been deployed to https://esm.sh.

- https://esm.sh/status.json: CDN status.
- https://esm.sh/<package>[@<version>][/<path>][?<query>]: CDN URL for the package.


--- CONTRIBUTING.md ---
# Contributing to esm.sh

Welcome, and thank you for taking time in contributing to esm.sh project!

## Development Setup

You will need [Golang](https://golang.org/)(1.22+) and [Deno](https://deno.land)(1.45+) installed on a macOS or Linux-based machine.

1. Fork this repository to your own GitHub account.
2. Clone the repository to your local device.
3. Create a new branch (`git checkout -b BRANCH_NAME`).
4. Change code then run tests
5. Push your branch to GitHub after **all tests passed**.
6. Make a [pull request](https://github.com/esm-dev/esm.sh/pulls).
7. Merge to master branch by our maintainers.

## Configration

Create a `config.json` file in the project root directory following the example below:

```jsonc
// config.json
{
  "port": 8080,
  "workDir": ".esmd",
  "npmRegistry": "https://registry.npmjs.org/"

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
