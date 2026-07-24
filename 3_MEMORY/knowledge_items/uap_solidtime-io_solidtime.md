# KI: solidtime-io/solidtime

## Overview
solidtime is a modern open-source time tracking application for Freelancers and Agencies.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 120 files across 23 directories
- **File types:** .php: 67, .yml: 20, .json: 9, .md: 6, .js: 4, .ts: 2, .editorconfig: 1

## Core Capabilities
- Time tracking: Track your time with a modern and easy-to-use interface
 - Projects: Create and manage projects and assign project members
 - Tasks: Create and manage tasks and assign tasks to projects
 - Clients: Create and manage clients and assign clients to projects
 - Billable rates: Set billable rates for projects, project members, organization members and organizations 
 - Multiple organizations: Create and manage multiple organizations with one account
 - Roles and permissions: Create and manage organizations
 - Import: Import your time tracking data from other time tracking applications (Supported: Toggl, Clockify, Timeentry CSV)

## Documentation Sections
- solidtime - The modern Open-Source TimeTracker
- Features
- Self Hosting
- Issues & Feature Requests
- Contributing
- Security
- License

## Core Structure
```
  .editorconfig
  .env.ci
  .env.example
  .env.production
  .gitattributes
  .gitignore
  .npmrc
  .prettierignore
  .prettierrc.json
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE.md
  README.md
  SECURITY.md
  artisan
  components.json
  composer.json
  composer.lock
  docker-compose.yml
  eslint.config.mjs
  jsconfig.json
  openapi.json
  package-lock.json
  package.json
  phpstan.neon
  phpunit.xml
  pint.json
  playwright.config.ts
  postcss.config.js
  tailwind.config.js
  tsconfig.json
  vite-module-loader.js
  vite.config.js
  vitest.config.ts
  .github/
    FUNDING.yml
    PULL_REQUEST_TEMPLATE.md
    dependabot.yml
    ISSUE_TEMPLATE/
      1_bug_report.yml
      config.yml
    workflows/
      build-onpremise.yml
      build-private.yml
      build-public.yml
      generate-api-docs.yml
      npm-build.yml
      npm-format-check.yml
      npm-lint.yml
      npm-publish-api.yml
      npm-publish-ui.yml
      npm-test-unit.yml
      npm-typecheck.yml
      phpstan.yml
      phpunit.yml
      pint.yml
      playwright.yml
  app/
    Actions/
      Fortify/
        CreateNewUser.php
        PasswordValidationRules.php
        ResetUserPassword.php
        UpdateUserPassword.php
        UpdateUserProfileInformation.php
    Console/
      Kernel.php
      Commands/
        Admin/
          OrganizationDeleteCommand.php
          UserCreateCommand.php
          UserVerifyCommand.php
        Auth/
          AuthSendReminderForExpiringApiTokensCommand.php
        Correction/
          CorrectionPlaceholderMembersCommand.php
        Report/
          ReportSetExpiredToPrivateCommand.php
        SelfHost/
          SelfHostCheckForUpdateCommand.php
          SelfHostDatabaseConsistency.php
          SelfHostGenerateKeysCommand.php
          SelfHostTelemetryCommand.php
        Test/
          TestEmailCommand.php
          TestJobCommand.php
          TestOutputCommand.php
        TimeEntry/
          TimeEntrySendStillRunningMailsCommand.php
    Enums/
      CurrencyFormat.php
      DateFormat.php
      ExportFormat.php
      IntervalFormat.php
      NumberFormat.php
      Role.php
      TimeEntryAggregationType.php
      TimeEntryAggregationTypeInterval.php
      TimeEntryRoundingType.php
      TimeFormat.php
      Weekday.php
    Events/
      AfterCreateOrganization.php
      BeforeOrganizationDeletion.php
      DatabaseSeederAfterSeed.php
      DatabaseSeederBeforeDelete.php
      MemberAdded.php
      MemberAdding.php
      MemberMadeToPlaceholder
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to solidtime

Contributions are greatly apprecited, please make sure to read the rules and vision for solidtime before contributing. 

## Rules

### Issues for Bugs, Discussions for Feature requests

In order to keep the issues of the repository clean we decided to only use them for bugs. Feature Requests and enhancement are handled in discussions. This also helps us to see which feature requests are popular as they can be upvoted. 

### Only work on approved issues

To respect your time and help us manage contributions effectively, please open an issue or start a discussion and wait for approval before submitting a pull request (PR). This does not apply to tiny fixes or changes however, please keep in mind that we might not merge PRs for various reasons. 

### Contributor License Agreement

You'll also notice that we’ve set up a [Contributor License Agreement (CLA)](https://cla-assistant.io/solidtime-io/solidtime), which must be signed before any PR can be merged. Don’t worry - the process is quick and only takes a few clicks.

We want to be transparent about why we require the CLA and what it means for your contributions and the codebase. That’s why we’ve written a few paragraphs below outlining our plans and vision for solidtime in the **Vision** part of this document. 

### Prevent Duplicate Work

Before you submit a new PR, make sure that none exists already. If you plan to work on an issue, make sure to let us and others know by commenting on the issue/discussion. 

### Give context

Tell us what you thinking was behind the decisions you made while drafting the PR. Treat the PR itself as documentation for everyone who wants to go back and understand why certain decisions were made. 

### Summarize your PR

Please make sure to include a short summary at the top of your PR to make it easy for us to quickly check what the PR is about, without looking at the code changes. 

### Use Github Keywords and Auto-Link Issues

Use phrases like "Closes #123"


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
