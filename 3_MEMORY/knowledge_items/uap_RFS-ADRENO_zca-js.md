# KI: RFS-ADRENO/zca-js

## Overview
> [!NOTE]
> This is an unofficial Zalo API for personal account. It work by simulating the browser to interact with Zalo Web.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 138 files across 10 directories
- **File types:** .ts: 112, .md: 14, .json: 4, .js: 3, .gitignore: 1, .npmignore: 1, .prettierrc: 1
- **Key dependencies:** crypto-js, form-data, json-bigint, pako, semver, spark-md5, tough-cookie, ws
- **Dev dependencies:** @eslint/js, @rollup/plugin-typescript, @types/bun, @types/crypto-js, @types/json-bigint, @types/node, @types/pako, @types/semver
- **Keywords:** chatbot, zalo, api

## Documentation Sections
- ZCA-JS
- Table of Contents
- Installation
- Migrate to V2
- Documentation
- Basic Usages
- Login
- Listen for new messages
- Send a message
- Get/Send a sticker
- Example
- Projects & Useful Resources
- Contributing
- License
- **Support Us**

## Available Commands
- `npm run prebuild` -- bun run scripts/buildAPI.js
- `npm run build:clean` -- rimraf dist
- `npm run build:esm` -- tsc
- `npm run build:cjs` -- rollup -c rollup.config.js
- `npm run build` -- bun run build:clean && bun run build:esm && bun run build:cjs
- `npm run test:feat` -- bun run test/feat.ts
- `npm run prettier` -- prettier --write .
- `npm run lint` -- eslint .
- `npm run lint:fix` -- eslint . --fix
- `npm run prepare` -- husky

## Core Structure
```
  .gitignore
  .npmignore
  .prettierrc
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  bun.lock
  eslint.config.js
  index.d.ts
  package-lock.json
  package.json
  rollup.config.js
  tsconfig.json
  .github/
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.md
      ci_cd.md
      conduct.md
      feature_request.md
      help-wanted_request.md
      performance.md
      question.md
      security.md
      testing.md
    workflows/
      lint.yml
  .husky/
    pre-commit
  .vscode/
    settings.json
  examples/
    echobot.ts
    login.ts
  scripts/
    buildAPI.js
  src/
    apis.ts
    context.ts
    index.ts
    update.ts
    utils.ts
    zalo.ts
    Errors/
      ZaloApiError.ts
      ZaloApiLoginQRAborted.ts
      ZaloApiLoginQRDeclined.ts
      ZaloApiMissingImageMetadataGetter.ts
      index.ts
    apis/
      acceptFriendRequest.ts
      addGroupBlockedMember.ts
      addGroupDeputy.ts
      addPollOptions.ts
      addQuickMessage.ts
      addReaction.ts
      addUnreadMark.ts
      addUserToGroup.ts
      blockUser.ts
      blockViewFeed.ts
      changeAccountAvatar.ts
      changeFriendAlias.ts
      changeGroupAvatar.ts
      changeGroupName.ts
      changeGroupOwner.ts
      createAutoReply.ts
      createCatalog.ts
      createGroup.ts
      createNote.ts
      createPoll.ts
      createProductCatalog.ts
      createReminder.ts
      custom.ts
      deleteAutoReply.ts
      deleteAvatar.ts
      deleteCatalog.ts
      deleteChat.ts
      deleteGroupInviteBox.ts
      deleteMessage.ts
      deleteProductCatalog.ts
      disableGroupLink.ts
      disperseGroup.ts
      editNote.ts
      editReminder.ts
      enableGroupLink.ts
      fetchAccountInfo.ts
      findUser.ts
      findUserByUsername.ts
      forwardMessage.ts
      getAliasList.ts
      getAllFriends.ts
      getAllGroups.ts
      getArchivedChatList.ts
      getAutoDeleteChat.ts
      getAutoReplyList.ts
      getAvatarList.ts
      getAvatarUrlProfile.ts
      getBizAccount.ts
      getCatalogList.ts
      getCloseFriends.ts
      getContext.ts
      getCookie.ts
      getFriendBoardList.ts
      getFriendOnlines.ts
      getFriendRecommendations.ts
      getFriendRequestStatus.ts
      getFullAvatar.ts
      getGroupBlockedMember.ts
      getGroupChatHistory.ts
      getGroupInfo.ts
      getGroupInviteBoxInfo.ts
      getGroupInviteBoxList.ts
      getGroupLinkDetail.ts
      getGroupLinkInfo.ts
      getGroupMembersInfo.ts
      get
```

## Quick Start
```bash
bun add zca-js # or npm install zca-js
bun add sharp # or npm install sharp
---
See [API Documentation](https://zca-js.tdung.com) for more details.
---
> [!IMPORTANT]
> Only one web listener can run per account at a time. If you open Zalo in the browser while the listener is active, the listener will be automatically stopped.
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to zca-js

Thank you for your interest in contributing to zca-js! This project is maintained by the community and we welcome all contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Security Guidelines](#security-guidelines)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide by these rules.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Bun (recommended) or npm
- Git

### Fork and Clone

1. Fork this repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/zca-js.git
   cd zca-js
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/RFS-ADRENO/zca-js.git
   ```

## Development Setup

### Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### Build Project

```bash
# Build both ESM and CJS
bun run build

# Build ESM only
bun run build:esm

# Build CJS only
bun run build:cjs
```

### Run Tests

```bash
# Run feature tests
bun run test:feat

# Run specific test file
bun run test/test.ts
```

### Code Formatting

```bash
# Format code with Prettier
bun run prettier
```

## How to Contribute

### Types of Contributions

We welcome the following types of contributions:

- 🐛 **Bug Reports**: Report bugs and issues
- ✨ **Feature Requests**: Suggest new features
- 🔧 **Code Contributions**: Fix bugs and add features
- 📚 **Documentation**: Improve docs and examples
- 🧪 **Tests**: Add or improve tests
- 🔒 **Security**: Report security vulnerabilities
- 🌐 


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
