# KI: ljagis/luke-developer-portal

## Overview
Serverless Developer Portal for API Gateway

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 111 files across 35 directories
- **File types:** .jsx: 37, .js: 33, .md: 11, .json: 8, .png: 7, .css: 4, .sh: 2
- **Dev dependencies:** @typescript-eslint/eslint-plugin, @typescript-eslint/parser, aws-sdk, babel-eslint, eslint, eslint-config-standard, eslint-plugin-flowtype, eslint-plugin-import

## Documentation Sections
- Introduction
- Setup
- 1. Deploy using SAR
- 2. Deploy using SAM
- 3. Deploy using the development scripts
- Registering Users
- Promoting a User to an Admin
- Populate the API catalog
- Subscribable APIs
- Non-subscribable APIs
- Testing your APIs
- Before going to production
- Setup a custom domain for your Developer Portal
- Add custom content and brand the Developer Portal
- Updating to a new version
- To update a SAM deployment:
- To update a SAR deployment
- Components
- Debugging
- Tear-down

## Available Commands
- `npm run test` -- node run test
- `npm run coverage` -- node run test --coverage=true
- `npm run integ` -- node run test --integ=true
- `npm run cover` -- node run coverage
- `npm run cfn-lint` -- node run cfn-lint
- `npm run predeploy` -- ./package-app.sh
- `npm run deploy` -- ./deploy-app.sh

## Core Structure
```
  .cfnlintrc
  .eslintignore
  .eslintrc.js
  .gitattributes
  .gitignore
  .travis.yml
  BUILDING.md
  BUILDING_SAM.md
  CODEOWNERS
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  NOTICE
  README.md
  README_SAR.md
  deploy-app.sh
  package-app.sh
  package-lock.json
  package.json
  run.js
  screen-apis.png
  screen-documentation.png
  screen-home.png
  .github/
    PULL_REQUEST_TEMPLATE.md
  __tests__/
    cfn-integration-test.js
  cloudformation/
    template.yaml
  dev-portal/
    .env
    .eslintrc.js
    example-deployer.config.js
    example-dev-deployer.config.js
    jsconfig.json
    package-lock.json
    package.json
    public/
      index.html
      apigateway-js-sdk/
        README.md
        apigClient.js
        lib/
          CryptoJS/
            components/
              enc-base64.js
              hmac.js
            rollups/
              hmac-sha256.js
              sha256.js
          apiGatewayCore/
            apiGatewayClient.js
            sigV4Client.js
            simpleHttpClient.js
            utils.js
          axios/
          url-template/
            url-template.js
      custom-content/
        favicon.ico
        home-image.png
        nav-logo.png
        styles.css
        api-logos/
          default.png
        content-fragments/
          APIs.md
          GettingStarted.md
          Home.md
    src/
      index.css
      index.js
      components/
        AlertPopup.jsx
        ApiSearch.css
        ApiSearch.jsx
        ApisMenu.jsx
        Feedback.jsx
        GetSdk.jsx
        MenuLink.jsx
        MessageList.jsx
        Modal.jsx
        NavBar.jsx
        PageWithSidebar.jsx
        Register.jsx
        SwaggerUiLayout.jsx
        Usage.jsx
        Admin/
          Accounts/
            AccountsTable.jsx
            AccountsTable.module.css
            AccountsTableColumns.jsx
        Sidebar/
          Sidebar.jsx
          SidebarHeader.jsx
      pages/
        Apis.jsx
        Dashboard.jsx
        GettingStarted.jsx
        Home.jsx
        Admin/
          Admin.jsx
          ApiManagement.jsx
          SideNav.jsx
          index.js
          Accounts/
            AdminAccounts.jsx
            PendingInvites.jsx
            PendingRequests.jsx
            RegisteredAccounts.jsx
            __tests__/
              AdminAccounts.jsx
              PendingInvites.jsx
              PendingRequests.jsx
              RegisteredAccounts.jsx
        __tests__/
          Home.jsx
      services/
        acco
```

## Quick Start
```bash
sam package --template-file ./cloudformation/template.yaml \
--output-template-file ./cloudformation/packaged.yaml \
--s3-bucket YOUR_LAMBDA_ARTIFACTS_BUCKET_NAME
sam deploy --template-file ./cloudformation/packaged.yaml \
--stack-name "dev-portal" \
--s3-bucket YOUR_LAMBDA_ARTIFACTS_BUCKET_NAME \
--capabilities CAPABILITY_NAMED_IAM \
--parameter-overrides \
DevPortalSiteS3BucketName="CUSTOM_PREFIX-dev-portal-static-assets" \
ArtifactsS3BucketName="CUSTOM_PREFIX-dev-portal-artifacts" \
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing Guidelines

Thank you for your interest in contributing to our project. Whether it's a bug report, new feature, correction, or additional 
documentation, we greatly value feedback and contributions from our community.

Please read through this document before submitting any issues or pull requests to ensure we have all the necessary 
information to effectively respond to your bug report or contribution.


## Reporting Bugs/Feature Requests

We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check [existing open](https://github.com/awslabs/aws-api-gateway-developer-portal/issues), or [recently closed](https://github.com/awslabs/aws-api-gateway-developer-portal/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aclosed%20), issues to make sure somebody else hasn't already 
reported the issue. Please try to include as much information as you can. Details like these are incredibly useful:

* A reproducible test case or series of steps
* The version of our code being used
* Any modifications you've made relevant to the bug
* Anything unusual about your environment or deployment


## Contributing via Pull Requests
Contributions via pull requests are much appreciated. Before sending us a pull request, please ensure that:

1. You are working against the latest source on the *master* branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't addressed the problem already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

To send us a pull request, please:

1. Fork the repository.
2. Working off the latest version of the *master* branch, modify the source; please focus on the specific change you are contributing. If you also reformat all the code, it will be hard for us to focus on your change.
3. Ensure local tests pass.
4. Run `standard --fix` on your new code to ensure style consistency. Remember to only reformat fi


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
