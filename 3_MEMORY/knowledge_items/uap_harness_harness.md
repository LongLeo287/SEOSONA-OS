# KI: harness/harness

## Overview
Harness Open Source is an open source development platform packed with the power of code hosting, automated DevOps pipelines, hosted development environments (Gitspaces), and artifact registries.

## Architecture & Tech Stack
- Go
- **Total files:** 121 files across 23 directories
- **File types:** .go: 99, .json: 3, .sh: 3, .http: 3, .yml: 2, .env: 2, .md: 2

## Documentation Sections
- Harness
- Overview
- Running Harness locally
- Where is Drone?
- Harness Open Source Development
- Pre-Requisites
- Build
- Run
- Docker Configuration for Pipelines
- For Rancher Desktop
- For Colima
- For Rancher Desktop
- For Colima
- Auto-Generate Harness API Client used by UI using Swagger
- Run Registry Conformance Tests
- User Interface
- REST API
- LOGIN (user: admin, pw: changeit)
- GENERATE PAT (1 YEAR VALIDITY)
- CLI
- Contributing
- License

## Core Structure
```
  .dockerignore
  .gitignore
  .golangci.yml
  .local.env
  .test.env
  CONTRIBUTING.md
  Dockerfile
  Dockerfile.uiv2
  LICENSE
  Makefile
  NOTICE
  README.md
  go.mod
  go.sum
  go.tool.mod
  go.tool.sum
  .devcontainer/
    Dockerfile
    devcontainer.json
    postCreate.sh
    postStart.sh
  .engops/
    pr_source_code_changes.sh
  .githooks/
    pre-commit
  .github/
    workflows/
      ci-lint.yml
  .testapi/
    diff.http
    http-client.env.json
    login.http
    space.http
  .vscode/
    launch.json
  app/
    pkg.go
    api/
      api.go
      auth/
        auth.go
        connector.go
        gitspace.go
        infraprovider.go
        pipeline.go
        registry.go
        repo.go
        secret.go
        service.go
        service_account.go
        space.go
        template.go
        user.go
      controller/
        tx.go
        util.go
        check/
          check_list.go
          check_recent.go
          check_recent_space.go
          check_report.go
          check_report_test.go
          controller.go
          sanitizers.go
          wire.go
        connector/
          controller.go
          create.go
          delete.go
          find.go
          test.go
          update.go
          wire.go
        execution/
          cancel.go
          controller.go
          create.go
          delete.go
          find.go
          list.go
          wire.go
        githook/
          client.go
          controller.go
          extender.go
          git.go
          post_receive.go
          pre_receive.go
          pre_receive_process.go
          pre_receive_scan_secrets.go
          print.go
          update.go
          wire.go
        gitspace/
          action.go
          controller.go
          create.go
          delete.go
          events.go
          find.go
          find_all.go
          list_all.go
          logs_stream.go
          lookup_repo.go
          update.go
          wire.go
          common/
            resource_validation.go
        infraprovider/
          controller.go
          create_config.go
          create_resources.go
          delete_config.go
          delete_resource.go
          find.go
          list.go
          list_resources.go
          wire.go
        keywordsearch/
          controller.go
          search.go
          wire.go
        lfs/
          authenticate.go
          controller.go
          download.go
          errors.go
          transfer.go
          types.go
          upload.
```

## Quick Start
```bash
docker run -d \
-p 3000:3000 \
-p 3022:3022 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /tmp/harness:/data \
--name harness \
--restart always \
harness/harness
- If your version is different than v3.21.11, run
- Get v3.21.11
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Harness

Thank you for your interest in open source contributions to Harness. Harness uses GitHub to manage open source reviews of pull requests.

* If you are a new contributor see: [Steps to Contribute](#steps-to-contribute)

* If you have a minor fix or improvement, feel free to create a pull request. Please provide necessary details in the pull request description and use a meaningful title.

* If you plan to do something more involved, first discuss your ideas by [raising an issue](https://github.com/harness/harness/issues). This will avoid unnecessary work and surely give you and us a good deal of inspiration. 

* Relevant coding style guidelines are 

    - For backend: the [Go Code Review Comments](https://code.google.com/p/go-wiki/wiki/CodeReviewComments) and the formatting and style section of Peter Bourgon's [Go: Best Practices for Production Environments](https://peter.bourgon.org/go-in-production/#formatting-and-style)
    - For frontend: [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) and [Best practices for Typescript coding](https://medium.com/@eshagarg1996/best-practices-for-typescript-coding-8b1ea98d02f8). 

* Be sure to sign off on the [CLA](https://cla-assistant.io/harness/gitness).

## Steps to Contribute

Should you wish to work on an issue, please claim it first by commenting on the GitHub issue that you want to work on. This is to prevent duplicated efforts from contributors on the same issue.

Please check the [`good-first-issue`](https://github.com/harness/harness/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) label to find issues that are good for getting started. If you have questions about one of the issues, with or without the tag, please comment on them and one of the maintainers will clarify it. For a quicker response, contact us over [slack](https://developer.harness.io/docs/open-source/support#slack).

### Local Development

Please review [Harness development](https:


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
