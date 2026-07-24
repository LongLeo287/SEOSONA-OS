# KI: bitloops/ddd-hexagonal-cqrs-es-eda

## Overview
Complete working example of using Domain Driven Design (DDD), Hexagonal Architecture, CQRS, Event Sourcing (ES), Event Driven Architecture (EDA), Behaviour Driven Development (BDD) using TypeScript and NestJS.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 97 files across 47 directories
- **File types:** .ts: 64, .md: 8, .json: 6, .yml: 5, .sh: 3, .gitignore: 2, .js: 2

## Core Capabilities
- **Observability**
- **Realtime client events**
- **Logging**
- **Tracing**: Tracks requests that span through multiple modules/microservices
- **Easy switching between modular monolith and microservices**
- **Authentication**
- **Authorization** (Even at the repository level)
- **Automatic JWT renewal**
- **gRPC query caching** (deprecated)
- **Automatic client code generation using OpenAPI**

## Documentation Sections
- ddd-hexagonal-cqrs-es-eda
- Table of Contents
- I. Introduction
- Overview
- Todo application business requirements
- II. Technologies and Technical Features
- Technical Features
- Technologies Used - Overview
- III. Quick start - running the ToDo App
- Prerequisites
- Running the app
- IV. Design Process and Decisions
- Design Process - Event Storming
- Design Decisions
- V. Running in development mode
- A. Project Setup
- Prerequisites
- Running the app
- B. Application Validation
- Test the application is running

## Core Structure
```
  .gitignore
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  K8s.md
  LICENSE
  README.md
  SECURITY.md
  apply_k8s_files.sh
  docker-compose.yml
  start.sh
  .github/
    dependabot.yml
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    workflows/
      main.yml
  .vscode/
    launch.json
  backend/
    .dockerignore
    .eslintrc.js
    .gitignore
    .prettierignore
    .prettierrc
    .template-env
    Dockerfile
    development-steps.md
    frontend-development.docker-compose.yml
    nest-cli.json
    package.json
    protogen.sh
    server-development.docker-compose.yml
    swagger.json
    tsconfig.build.json
    tsconfig.json
    yarn.lock
    src/
      app.module.ts
      config.yaml
      logging.interceptor.ts
      main.ts
      setup-jest.js
      api/
        api.module.ts
        authentication.controller.ts
        sse.module.ts
        todo.rest.controller.ts
        todo.sse.controller.ts
        dto/
          add-todo.dto.ts
          get-all-todos.dto.ts
          modify-todo-title.dto.ts
          register.dto.ts
          update-email.dto.ts
        pub-sub-handlers/
          todo-added.integration-handler.ts
          todo-completed.integration-handler.ts
          todo-deleted.integration-handler.ts
          todo-modified-title.integration-handler.ts
          todo-uncompleted.integration-handler.ts
      bounded-contexts/
        iam/
          iam/
            iam.module.ts
            repository/
              user-write.pg.repository.ts
              user-write.repository.ts
        marketing/
          marketing/
            marketing.module.ts
            repository/
              notification-template.repository.ts
              user-write.repository.ts
            service/
              index.ts
              mock-email.service.ts
        todo/
          todo/
            todo.module.ts
            repository/
              todo-read.repository.ts
              todo-write.repository.ts
      config/
        auth.configuration.ts
        configuration.ts
      lib/
        bounded-contexts/
          iam/
            authentication/
              authentication.module.ts
              constants.ts
              application/
                command-handlers/
                  change-email.handler.ts
                  index.ts
                  log-in.handler.ts
                error-events/
                  email-not-found.integration-event.ts
                errors/
                  UserNotFoundApplicationErr
```

## Quick Start
```bash
git clone https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda.git
cd ddd-hexagonal-cqrs-es-eda
docker compose -p bitloops-todo-app up -d
git clone https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda.git
cd ddd-hexagonal-cqrs-es-eda/backend
```

## Agent Configuration

--- CONTRIBUTING.md ---
# ddd-hexagonal-cqrs-es-eda Contributor Guide

## Contributing
Thank you for your interest in contributing to Bitloops. We would love for you to contribute and help make it better! All contributions are welcome and we believe the process should be fun, enjoyable, and educational for anyone and everyone. 
Before you begin, please read our code of conduct and check existing issues. You can contribute with new issues, new docs as well as updates and tweaks, blog posts, and more.
 
## How to Start?
Firstly, we would like to invite you to our community. Join our slack group, introduce yourself and get to know the rest of the team. There is probably someone working on an issue that interests you, or has at least spent some time thinking about it. 
Reach out with questions via [Discord](https://discord.gg/cQcnRJQ256) or [@thebitloops](https://twitter.com/thebitloops) on Twitter. You can also add questions through [Bitloops' GitHub Discussions](https://github.com/bitloops/bitloops-language/discussions). If you prefer, you can also simply submit an [issue](https://github.com/bitloops/bitloops-language/issues), and a maintainer will guide you!
We strongly recommend filing an issue before working on non-trivial changes to the implementation. This lets us reach an agreement on your proposal before you put significant effort into it, and it has a much higher likelihood of being accepted.
 
### Code of Conduct
We want to keep Bitloops open and inclusive so please read and follow our [Code of Conduct](https://github.com/bitloops/bitloops-language/blob/main/CODE_OF_CONDUCT.md).
 
### How to contribute?
We recommend baby steps so you can get familiar with our contribution process. We have a list of good first issues that contain bugs and have a relatively limited scope, and therefore a great place to start. 
If you decide to fix an issue, please be sure to check the comments in case somebody is already working on it. If there hasn’t been any activity, then leave a comment stating th


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
