# KI: scikit-learn/scikit-learn

## Overview
.. |GitHubActions| image:: https://github.com/scikit-learn/scikit-learn/actions/workflows/unit-tests.yml/badge.svg?
   :target: https://github.com/scikit-learn/scikit-learn/actions/workflows/unit-tests.yml?query=branch%3Amain

## Architecture & Tech Stack
- Python
- **Total files:** 132 files across 14 directories
- **File types:** .py: 64, .yml: 35, .sh: 8, .md: 5, .gitignore: 3, .txt: 3, .json: 3

## Core Structure
```
  .codecov.yml
  .coveragerc
  .git-blame-ignore-revs
  .gitattributes
  .gitignore
  .mailmap
  .pre-commit-config.yaml
  AGENTS.md
  CITATION.cff
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  COPYING
  Makefile
  README.rst
  SECURITY.md
  meson.build
  pyproject.toml
  .binder/
    postBuild
    requirements.txt
    runtime.txt
  .circleci/
    config.yml
  .devcontainer/
    devcontainer.json
    setup.sh
  .github/
    FUNDING.yml
    PULL_REQUEST_TEMPLATE.md
    dependabot.yml
    labeler-file-extensions.yml
    labeler-module.yml
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      doc_improvement.yml
      feature_request.yml
    scripts/
      add_or_remove_no_pr_warning.py
      label_title_regex.py
    workflows/
      artifact-redirector.yml
      autoclose-comment.yml
      autoclose-schedule.yml
      bot-lint-comment.yml
      check-changelog.yml
      check-sdist.yml
      codeql.yml
      codespell.yml
      cuda-ci.yml
      cuda-label-remover.yml
      emscripten.yml
      label-blank-issue.yml
      labeler-module.yml
      labeler-title-regex.yml
      lint.yml
      needs-decision.yml
      not-ready-for-pr-warning.yml
      publish_pypi.yml
      unit-tests.yml
      update-lock-files.yml
      update_tracking_issue.yml
      welcome-first-time-contributor.yml
      wheels.yml
  .spin/
    cmds.py
  asv_benchmarks/
    .gitignore
    asv.conf.json
    benchmarks/
      __init__.py
      cluster.py
      common.py
      config.json
      datasets.py
      decomposition.py
      ensemble.py
      linear_model.py
      manifold.py
      metrics.py
      model_selection.py
      neighbors.py
      svm.py
      utils.py
  benchmarks/
    .gitignore
    bench_20newsgroups.py
    bench_covertype.py
    bench_feature_expansions.py
    bench_glm.py
    bench_glmnet.py
    bench_hist_gradient_boosting.py
    bench_hist_gradient_boosting_adult.py
    bench_hist_gradient_boosting_categorical_only.py
    bench_hist_gradient_boosting_higgsboson.py
    bench_hist_gradient_boosting_threading.py
    bench_isolation_forest.py
    bench_isolation_forest_predict.py
    bench_isotonic.py
    bench_kernel_pca_solvers_time_vs_n_components.py
    bench_kernel_pca_solvers_time_vs_n_samples.py
    bench_lasso.py
    bench_lof.py
    bench_mnist.py
    bench_online_ocsvm.py
    bench_pca_solvers.py
    bench_plot_fastkmeans.py
    bench_plot_hierarchical.py
    bench_plot_incremental_pca.py
    bench_plot_lasso_path.py
    bench_plot_neighbors.py
    ben
```

## Agent Configuration

--- AGENTS.md ---
# AGENTS Instruction

This file contains additional guidance for AI agents and other AI editors.

## **REQUIRED: AI/Agent Disclosure**

**Every summary, pull request description, or work description MUST include this disclosure:**

**If human review has *not yet* occurred (use this initially):**
> This pull request includes code written with the assistance of AI.
> The code has **not yet been reviewed** by a human.

This is a **mandatory requirement**, not optional. Include it at the end of every summary you generate.

---

## Generated Summaries

When generating a summary of your work, consider these points:

- Describe the "why" of the changes, why the proposed solution is the right one.
- Highlight areas of the proposed changes that require careful review.
- Reduce the verbosity of your comments, more text and detail is not always better. Avoid flattery, avoid stating the obvious, avoid filler phrases, prefer technical clarity over marketing tone.


--- CONTRIBUTING.md ---

Contributing to scikit-learn
============================

The latest contributing guide is available in the repository at
`doc/developers/contributing.rst`, or online at:

https://scikit-learn.org/dev/developers/contributing.html

There are many ways to contribute to scikit-learn. Improving the
documentation is no less important than improving the code of the library
itself. If you find a typo in the documentation, or have made improvements, do
not hesitate to create a GitHub issue or preferably submit a GitHub pull request.

There are many other ways to help. In particular [improving, triaging, and
investigating issues](https://github.com/scikit-learn/scikit-learn/issues),
and [reviewing other developers' pull
requests](https://scikit-learn.org/dev/developers/contributing.html#code-review-guidelines)
are very valuable contributions that decrease the burden on the project
maintainers.

Another way to contribute is to report issues you're facing, and give a "thumbs
up" on issues that others reported and that are relevant to you. It also helps
us if you spread the word: reference the project from your blog and articles,
link to it from your website, or simply star it in GitHub to say "I use it".

Note that communications on all channels should respect our
[Code of Conduct](./CODE_OF_CONDUCT.md).

Quick links
-----------

* [Submitting a bug report or feature request](https://scikit-learn.org/dev/developers/contributing.html#submitting-a-bug-report-or-a-feature-reque

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
