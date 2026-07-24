# KI: tapjs/tapjs

## Overview
Do this at least once to get everything set up and ready to go:

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 113 files across 37 directories
- **File types:** .json: 49, .ts: 21, .md: 19, .yml: 6, .sh: 4, .mjs: 2, .mts: 2

## Documentation Sections
- `@tapjs`
- Dev Commands
- Contents
- Bootstrap and `skipLibCheck`

## Core Structure
```
  .gitignore
  .nxignore
  .prettierignore
  .prettierrc.json
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE.md
  README.md
  changelog.md
  nx.json
  package-lock.json
  package.json
  tsconfig.json
  typedoc-0.24.8.tgz
  typedoc.base.json
  typedoc.css
  typedoc.json
  .github/
    FUNDING.yml
    ISSUE_TEMPLATE/
      bug.yml
      config.yml
      enhancement.yml
    workflows/
      ci.yml
      typedoc.yml
  scripts/
    bootstrap.sh
    bump-changed.sh
    changed-workspaces.sh
    default-build.mjs
    default-build.mts
    default-plugins.txt
    normalize-package-json.js
    test-bootstrap.sh
    version.mjs
    version.mts
  src/
    after/
      LICENSE.md
      README.md
      package.json
      tsconfig.json
      typedoc.json
      .tshy/
        build.json
        commonjs.json
        esm.json
      src/
        index.ts
      tap-snapshots/
        test/
          index.ts.test.cjs
      test/
        import-deps.ts
        index.ts
    after-each/
      LICENSE.md
      README.md
      package.json
      tsconfig.json
      typedoc.json
      .tshy/
        build.json
        commonjs.json
        esm.json
      src/
        index.ts
      test/
        import-deps.ts
        index.ts
    asserts/
      LICENSE.md
      README.md
      map.js
      package.json
      tsconfig.json
      typedoc.json
      .tshy/
        build.json
        commonjs.json
        esm.json
      src/
        index.ts
        normalize-throws-args.ts
      test/
        import-deps.ts
        index.ts
        normalize-throws-args.ts
    before/
      LICENSE.md
      README.md
      package.json
      tsconfig.json
      typedoc.json
      .tshy/
        build.json
        commonjs.json
        esm.json
      src/
        index.ts
      tap-snapshots/
        test/
          index.ts.test.cjs
      test/
        import-deps.ts
        index.ts
    before-each/
      LICENSE.md
      README.md
      package.json
      tsconfig.json
      typedoc.json
      .tshy/
        build.json
        commonjs.json
        esm.json
      src/
        index.ts
      test/
        import-deps.ts
        index.ts
    chdir/
      LICENSE.md
      README.md
      package.json
      tsconfig.json
      typedoc.json
      .tshy/
        build.json
        commonjs.json
        esm.json
      src/
        index.ts
      test/
        import-deps.ts
        index.ts
    clock/
      LICENSE.md
      README.md
      package.json
      tsconfig.json
      typedoc.json
      .tsh
```

## Quick Start
```bash
npm run bootstrap
npm run build
npm run prepare -w src/{whatever}
npm i
npm test
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing

## Code of Conduct

[Contributor Covenant Code of Conduct 2.1](./CODE_OF_CONDUCT.md)

## Reporting Bugs

The most helpful thing you can do is create a reproducible
example showing the issue you are experiencing. If you can
provide a good reproduction case, there's a good chance that your
bug will be fixed much more quickly, because often isolating the
issue is most of the work.

It's usually a good idea in many cases to run your command with
`--reporter=tap` and/or `--debug`, to show the steps that led to
a particular issue.

In order from most to least helpful:

* A pull request that adds a failing test demonstrating the
  problem. If you do this, basically you've done 90% of the work
  of solving the problem and you are my hero.
* A small public gist or repository on GitHub with a test script
  that shows the failure, with all necessary tap configs,
  tsconfig.json settings, dependencies listed, etc. This is
  wonderful, and can usually be adapted into a test very easily.
* A real world example of a public project with a list of steps
  needed to reproduce the issue. Creating a minimal reproduction
  is sometimes challenging, and a full-sized reproduction case is
  also pretty helpful, and can be informative if you're not sure
  what exactly is going on.
* A privately shared link to a real world example showing the
  issue. Almost as good as a public repo example, but without the
  benefit of being discoverable by others experiencing the
  problem.
* A clear set of steps in the issue that explains how to trigger
  the bug, with all relevant configuration listed. Often this
  is plenty, especially if the issue is simple to reproduce.
* An explanation of what happens, what you expect, and why it
  isn't good. Expect to answer some questions about your
  configuration setup, the output of various debug commands, etc.
* A comment on an existing open issue providing any of the above.
* (Not very helpful at this point) A comment on an open issue
  that s


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
