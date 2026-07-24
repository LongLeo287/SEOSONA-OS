# KI: crisnahine/rails-ai-context

## Overview
**Your AI is guessing your Rails app. Every guess costs you time.**

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 122 files across 24 directories
- **File types:** .rb: 77, .md: 22, .yml: 10, .json: 2, .gif: 2, .tape: 2, .html: 2

## Documentation Sections
- rails-ai-context
- The problem
- Two commands. Problem gone.
- Or standalone - no Gemfile needed
- See the difference
- What stops being wrong
- Schema: does AI know what columns exist?
- Trace: find every caller of a method across the codebase
- Model: associations, scopes, callbacks, concerns - all resolved
- Controllers: action source + inherited filters + strong params in one shot
- Three ways to use it
- MCP Server (stdio)
- MCP Server (HTTP)
- config/routes.rb
- CLI
- Real-world examples
- Table: users
- PostsController#create
- Check existing view patterns
- → templates with ivars, Turbo frames, Stimulus controllers, partial locals
- See existing components + usage examples
- → ViewComponent/Phlex props, slots, previews, sidecar assets
- Get Stimulus data-attributes
- → correct HTML with dashes (not underscores) + reverse view lookup
- 38 Tools

## Core Structure
```
  .gitattributes
  .gitignore
  .rspec
  .rubocop.yml
  .ruby-version
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Gemfile
  LICENSE
  README.md
  Rakefile
  SECURITY.md
  rails-ai-context.gemspec
  server.json
  .github/
    FUNDING.yml
    PULL_REQUEST_TEMPLATE.md
    dependabot.yml
    ISSUE_TEMPLATE/
      bug_report.yml
      config.yml
      feature_request.yml
    workflows/
      ci.yml
      e2e.yml
      release.yml
  app/
    controllers/
      rails_ai_context/
        mcp_controller.rb
  config/
    routes.rb
  demo/
    demo-trace.gif
    demo-trace.tape
    demo.gif
    demo.tape
  docs/
    ARCHITECTURE.md
    CLI.md
    CONFIGURATION.md
    CUSTOM_TOOLS.md
    FAQ.md
    GUIDE.md
    INTROSPECTORS.md
    QUICKSTART.md
    RECIPES.md
    SECURITY.md
    SETUP.md
    STANDALONE.md
    TOOLS.md
    TROUBLESHOOTING.md
    _config.yml
    index.md
    social-preview.html
    _includes/
      head-custom.html
    superpowers/
      plans/
        2026-05-24-prism-ast-migration.md
  exe/
    rails-ai-context
  lib/
    rails-ai-context.rb
    rails_ai_context.rb
    generators/
      rails_ai_context/
        install/
          install_generator.rb
    rails_ai_context/
      ast_cache.rb
      confidence.rb
      configuration.rb
      doctor.rb
      engine.rb
      fingerprinter.rb
      hydration_result.rb
      instrumentation.rb
      introspector.rb
      legacy_cleanup.rb
      live_reload.rb
      mcp_config_generator.rb
      middleware.rb
      resources.rb
      safe_file.rb
      schema_hint.rb
      server.rb
      test_helper.rb
      version.rb
      vfs.rb
      watcher.rb
      cli/
        tool_runner.rb
      data/
        docs/
          index.json
      hydrators/
        controller_hydrator.rb
        hydration_formatter.rb
        schema_hint_builder.rb
        view_hydrator.rb
      introspectors/
        action_mailbox_introspector.rb
        action_text_introspector.rb
        active_storage_introspector.rb
        active_support_introspector.rb
        api_introspector.rb
        asset_pipeline_introspector.rb
        auth_introspector.rb
        autoload_introspector.rb
        component_introspector.rb
        config_introspector.rb
        connection_pool_introspector.rb
        controller_introspector.rb
        convention_introspector.rb
        credentials_introspector.rb
        database_stats_introspector.rb
        devops_introspector.rb
        engine_introspector.rb
        env_introspector.rb
   
```

## Quick Start
```bash
gem "rails-ai-context", group: :development
rails generate rails_ai_context:install
gem install rails-ai-context
cd your-rails-app
rails-ai-context init     # interactive setup
rails-ai-context serve    # start MCP server
rails 'ai:tool[schema]' table=users
rails 'ai:tool[search_code]' pattern=your_method match_type=trace
rails 'ai:tool[model_details]' model=User
rails 'ai:tool[controllers]' controller=UsersController action=create
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to rails-ai-context

Thanks for your interest in contributing! This guide covers everything you need to get started.

## Development Setup

```bash
git clone https://github.com/crisnahine/rails-ai-context.git
cd rails-ai-context
bundle install
bundle exec rspec
bundle exec rubocop --parallel
```

The test suite uses [Combustion](https://github.com/pat/combustion) to boot a minimal Rails app in `spec/internal/`. No external database required - tests run against an in-memory SQLite database.

## Project Structure

```
lib/rails_ai_context/
├── cli/               # CLI tool runner (tool_runner.rb) - executes MCP tools from rake/Thor
├── introspectors/     # 39 introspectors (schema, models, routes, etc.)
├── tools/             # 38 MCP tools with detail levels and pagination
├── serializers/       # Per-assistant formatters + shared ToolGuideHelper
├── server.rb          # MCP server setup (stdio + HTTP)
├── live_reload.rb     # MCP live reload (file watcher + cache invalidation)
├── engine.rb          # Rails Engine for auto-integration
└── configuration.rb   # User-facing config (presets, context_mode, tool_mode, limits)
```

## Adding a New Introspector

1. Create `lib/rails_ai_context/introspectors/your_introspector.rb` (auto-loaded by Zeitwerk)
2. Implement `#initialize(app)` and `#call` → returns a Hash (never raises)
3. Register it in `lib/rails_ai_context/introspector.rb` (the `INTROSPECTOR_MAP`)
4. Add the key to the appropriate preset(s) in `Configuration::PRESETS` (`:full` is the default, `:standard` for core-only)
5. Write specs in `spec/lib/rails_ai_context/your_introspector_spec.rb`

## Adding a New MCP Tool

1. Create `lib/rails_ai_context/tools/your_tool.rb` inheriting from `BaseTool` (auto-loaded by Zeitwerk)
2. Define `tool_name`, `description`, `input_schema`, and `annotations`
3. Implement `def self.call(...)` returning `text_response(string)`
4. Auto-registered - no manual list to update (BaseTool.inherited tracks it)
5. Write specs 


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
