# KI: tomwright/dasel

## Overview
Dasel (short for **Data-Select**) is a command-line tool and library for querying, modifying, and transforming data structures such as JSON, YAML, TOML, XML, CSV, and KDL.

## Architecture & Tech Stack
- Go
- **Total files:** 142 files across 6 directories
- **File types:** .go: 115, .yaml: 10, .md: 8, .yml: 3, .png: 2, .gitignore: 1, .jpg: 1

## Core Capabilities
* **Multi-format support**: JSON, YAML, TOML, XML, CSV, HCL, INI, KDL.
* **Unified query syntax**: Access data in any format with the same selectors.
* **Query & search**: Extract values, lists, or structures with intuitive syntax.
* **Modify in place**: Update, insert, or delete values directly in structured files.
* **Convert between formats**: Seamlessly transform data from JSON → YAML, TOML → JSON, etc.
* **Script-friendly**: Simple CLI integration for shell scripts and pipelines.
* **Library support**: Import and use in Go projects.

---

## Documentation Sections
- Dasel
- Features
- Installation
- Homebrew (macOS/Linux)
- Go Install
- Prebuilt Binaries
- None of the above?
- Shell Completion
- Bash
- Zsh
- Fish
- PowerShell
- Man Page
- Basic Usage
- Selecting Values
- Output: "baz"
- Modifying Values
- Output: "bong"
- Output:
- Output:
- Format Conversion
- Recursive Descent (`..`)
- Output:
- Search (`search`)
- Output:

## Core Structure
```
  .gitignore
  .golangci.yaml
  .pre-commit-hooks.yaml
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE
  README.md
  SECURITY.md
  api.go
  api_example_test.go
  api_test.go
  codecov.yaml
  daselbanner.jpg
  daselbanner.png
  daselgopher.png
  go.mod
  go.sum
  .github/
    FUNDING.yml
    dependabot.yml
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    workflows/
      build-dev.yaml
      build-test.yaml
      build.yaml
      bump-homebrew.yaml
      codeql-analysis.yml
      container.yaml
      golangci-lint.yaml
      test.yaml
  cmd/
    dasel/
      main.go
  execution/
    README.md
    context.go
    execute.go
    execute_all.go
    execute_all_test.go
    execute_any.go
    execute_any_test.go
    execute_array.go
    execute_array_test.go
    execute_assign.go
    execute_assign_test.go
    execute_binary.go
    execute_binary_test.go
    execute_branch.go
    execute_branch_test.go
    execute_coalesce_test.go
    execute_conditional.go
    execute_conditional_test.go
    execute_count.go
    execute_count_test.go
    execute_each.go
    execute_each_test.go
    execute_error_test.go
    execute_filter.go
    execute_filter_test.go
    execute_func.go
    execute_func_test.go
    execute_group_by.go
    execute_group_by_test.go
    execute_key_var_test.go
    execute_literal.go
    execute_literal_test.go
    execute_map.go
    execute_map_test.go
    execute_map_values.go
    execute_map_values_test.go
    execute_object.go
    execute_object_test.go
    execute_range_test.go
    execute_recursive_descent.go
    execute_recursive_descent_test.go
    execute_reduce.go
    execute_reduce_test.go
    execute_search.go
    execute_search_test.go
    execute_sort_by.go
    execute_sort_by_test.go
    execute_spread.go
    execute_spread_test.go
    execute_ternary_test.go
    execute_test.go
    execute_unary.go
    execute_unary_test.go
    execute_variable_test.go
    func.go
    func_abs.go
    func_abs_test.go
    func_add.go
    func_add_test.go
    func_avg.go
    func_avg_test.go
    func_base64.go
    func_ceil.go
    func_ceil_test.go
    func_contains.go
    func_contains_test.go
    func_ends_with.go
    func_ends_with_test.go
    func_entries.go
    func_entries_test.go
    func_first.go
    func_first_test.go
    func_flatten.go
    func_flatten_test.go
    func_floor.go
    func_floor_test.go
    func_get.go
    func_get_test.go
    func_has.go
    func_has_test.go
    func_ignore.go

```

## Quick Start
```bash
brew install dasel
go install github.com/tomwright/dasel/v3/cmd/dasel@master
source <(dasel completion bash)
source <(dasel completion zsh)
dasel completion fish | source
dasel completion powershell | Out-String | Invoke-Expression
dasel man | man -l -
echo '{"foo": {"bar": "baz"}}' | dasel -i json 'foo.bar'
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Dasel

Thank you for considering contributing to Dasel! Contributions of all kinds are welcome — whether it's fixing bugs, improving documentation, or adding new features.

## How to Contribute

### 1. Reporting Issues

* Check the [issue tracker](https://github.com/TomWright/dasel/issues) to see if your issue has already been reported.
* If not, open a new issue with a clear description. Please include:

    * Steps to reproduce (if it's a bug)
    * Expected vs actual behavior
    * Versions of Dasel, Go, and your OS

### 2. Suggesting Features

* Open a [discussion](https://github.com/TomWright/dasel/discussions) if you'd like feedback before implementing.
* If the idea is well-defined, create an issue describing the use case and possible syntax.

### 3. Submitting Pull Requests

1. Fork the repository and clone your fork.
2. Create a new branch for your work:

   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes and add tests if relevant.
4. Run the test suite to ensure nothing is broken:

   ```bash
   go test ./...
   ```
5. Commit your changes with a clear message:

   ```bash
   git commit -m "Add support for XYZ selector"
   ```
6. Push your branch and open a Pull Request.

### 4. Code Style

* Follow Go best practices and conventions.
* Keep code simple and readable.
* Add comments for complex logic.

### 5. Documentation

* Ensure documentation requirements are listed on your PR so docs site can be updated.
* Ensure examples are clear and consistent with the style of existing docs.

### 6. Communication

* Be respectful and constructive in discussions.
* Aim to keep contributions focused and incremental.

---

## Getting Help

If you have questions, feel free to:

* Start a [discussion](https://github.com/TomWright/dasel/discussions)
* Ask in an open issue related to your question

We appreciate your contribution and for helping improve Dasel!



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
