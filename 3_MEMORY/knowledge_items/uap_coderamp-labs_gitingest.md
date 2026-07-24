# KI: coderamp-labs/gitingest

## Overview
Package: gitingest

## Tech Stack (from code)
- Python (42 files)
- JavaScript (6 files)
- **Total:** 94 files, 17 directories
- **File types:** .py: 42, .jinja: 9, .svg: 9, .js: 6, .md: 5, .txt: 4, .png: 4, .json: 3

## Dependencies

### Python Dependencies (from requirements.txt)
- `boto3>=1.28.0  # AWS SDK for S3 support`
- `click>=8.0.0`
- `fastapi[standard]>=0.109.1  # Vulnerable to https://osv.dev/vulnerability/PYSEC-2024-38`
- `httpx`
- `loguru>=0.7.0`
- `pathspec>=0.12.1`
- `prometheus-client`
- `pydantic`
- `python-dotenv`
- `sentry-sdk[fastapi]`
- `slowapi`
- `starlette>=0.40.0  # Vulnerable to https://osv.dev/vulnerability/GHSA-f96h-pmfr-66vw`
- `tiktoken>=0.7.0  # Support for o200k_base encoding`
- `uvicorn>=0.11.7  # Vulnerable to https://osv.dev/vulnerability/PYSEC-2020-150`

## File Structure
```
  .dockerignore
  .env.example
  .gitignore
  .pre-commit-config.yaml
  .release-please-manifest.json
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE
  README.md
  SECURITY.md
  compose.yml
  eslint.config.cjs
  pyproject.toml
  release-please-config.json
  renovate.json
  requirements-dev.txt
  requirements.txt
  .docker/
    minio/
      setup.sh
  docs/
    frontpage.png
  src/
    gitingest/
      __init__.py
      __main__.py
      clone.py
      config.py
      entrypoint.py
      ingestion.py
      output_formatter.py
      query_parser.py
      schemas/
        __init__.py
        cloning.py
        filesystem.py
        ingestion.py
      utils/
        __init__.py
        auth.py
        compat_func.py
        compat_typing.py
        exceptions.py
        file_utils.py
        git_utils.py
        ignore_patterns.py
        ingestion_utils.py
        logging_config.py
        notebook.py
        os_utils.py
        pattern_utils.py
        query_parser_utils.py
        timeout_wrapper.py
    server/
      __init__.py
      __main__.py
      form_types.py
      main.py
      metrics_server.py
      models.py
      query_processor.py
      routers_utils.py
      s3_utils.py
      server_config.py
      server_utils.py
      routers/
        __init__.py
        dynamic.py
        index.py
        ingest.py
      templates/
        base.jinja
        git.jinja
        index.jinja
        swagger_ui.jinja
        components/
          _macros.jinja
          footer.jinja
          git_form.jinja
          navbar.jinja
          result.jinja
          tailwind_components.html
    static/
      llms.txt
      og-image.png
      robots.txt
      favicons/
        apple-touch-icon.png
        favicon-64.png
        favicon.ico
        favicon.svg
      icons/
        chrome.svg
        discord.svg
        github.svg
        python-color.svg
        python.svg
      js/
        git.js
        git_form.js
        index.js
        navbar.
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `component` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `component`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 0}
