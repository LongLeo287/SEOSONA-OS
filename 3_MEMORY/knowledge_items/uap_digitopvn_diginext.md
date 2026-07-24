# KI: digitopvn/diginext

## Overview
Repository with 660 files across 130 directories. Primary language: TypeScript (423 files).

## Tech Stack (from code)
- TypeScript (423 files)
- JavaScript (60 files)
- Shell (13 files)
- **Total:** 660 files, 130 directories
- **File types:** .ts: 423, .js: 60, .html: 37, .png: 19, .yaml: 17, .svg: 13, .sh: 13, .md: 12

## Public API / Exports
- `conf` from `src/index.ts`
- `processCLI` from `src/index.ts`
- `AIService` from `src\services\AIService.ts`
- `ApiKeyUserService` from `src\services\ApiKeyUserService.ts`
- `AppService` from `src\services\AppService.ts`
- `DEFAULT_PAGE_SIZE` from `src\services\BaseService.ts`
- `BuildService` from `src\services\BuildService.ts`
- `CloudDatabaseBackupService` from `src\services\CloudDatabaseBackupService.ts`
- `DatabaseConnectionInfo` from `src\services\CloudDatabaseService.ts`
- `DatabaseBackupParams` from `src\services\CloudDatabaseService.ts`
- `DatabaseRestoreParams` from `src\services\CloudDatabaseService.ts`
- `CloudDatabaseService` from `src\services\CloudDatabaseService.ts`
- `CloudProviderService` from `src\services\CloudProviderService.ts`
- `CloudStorageService` from `src\services\CloudStorageService.ts`
- `ClusterService` from `src\services\ClusterService.ts`
- `ContainerRegistryService` from `src\services\ContainerRegistryService.ts`
- `DeployEnvironmentApp` from `src\services\DeployEnvironmentService.ts`
- `KubeDeploymentOnCluster` from `src\services\DeployEnvironmentService.ts`
- `DeployEnvironmentService` from `src\services\DeployEnvironmentService.ts`
- `EnvVarService` from `src\services\EnvVarService.ts`
- `FrameworkService` from `src\services\FrameworkService.ts`

## Imports Detected in Source
- `@/app.config`
- `@/config`
- `@/controllers`
- `@/entities`
- `@/interfaces`
- `@/modules`
- `@/plugins`
- `@/server`
- `class-validator`
- `configstore`
- `dayjs`
- `diginext-utils`
- `fs`
- `lodash`
- `mongoose`
- `path`
- `yargs`

## File Structure
```
  .babelrc.js
  .dependency-cruiser.js
  .dockerignore
  .env.example
  .eslintignore
  .eslintrc
  .gitignore
  .npmignore
  .prettierignore
  .prettierrc.json
  05-podman-fuse-device-plugin.yaml
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  DEVELOPER.md
  Dockerfile
  Dockerfile.bak
  Dockerfile.base
  Dockerfile.dev
  Dockerfile.podman
  Dockerfile.prerelease
  FAQ.md
  LICENSE
  bun.lockb
  commitlint.config.js
  demo.png
  deployment.docker.example.yaml
  deployment.podman.example.yaml
  development-plan.md
  diginext.code-workspace
  docker-compose.dev.example.yaml
  docker-compose.example.yaml
  docker-compose.mongo.example.yaml
  docker-compose.mongors.example.yaml
  docker-compose.podman.dev.example.yaml
  docker-compose.podman.example.yaml
  dx-banner.png
  jest.config.js
  lint-staged.config.js
  package.json
  pnpm-lock.yaml
  readme.md
  repomix-output.xml
  skaffold.yaml
  tsconfig.jest.json
  tsconfig.json
  tsoa.json
  binaries/
    buildx-v0.9.1.linux-amd64
    buildx-v0.9.1.linux-arm64
  docs/
    config.md
    create-user-workspace-flow.png
    deploy-production-flow.png
    deploy_and_build_flow.png
    deployment-strategy-v2.excalidraw
    diginext-deploy-button.png
    diginext-deploy-button.svg
    diginext-webhook_notification_system-workflow.png
    diginext_logo.svg
    diginext_logo_black_purple.svg
    diginext_logo_white.svg
    diginext_logo_white_purple.svg
    docs.md
    dx-architecture.png
    momo-button.png
    readme-tbu.md
    why-podman.md
  podman/
    cleanup.sh
    containers/
      containers.conf
      registries.conf
      storage.conf
      registries.conf.d/
        shortnames.conf
  public/
    404.html
    apple-touch-icon.png
    diginext-icon-red.png
    diginext-icon-red.svg
    favicon-16x16.png
    favicon-32x32.png
    favicon-red.ico
    favicon.ico
    index.html
    robots.txt
    sitemap-0.xml
    sitemap.xml
    404/
      index.html
    _next/
      static/
        W0b5zZbhLmkYLYlQm85M-/
        
```

## Key Source Excerpts
### src/index.ts
```typescript
#! /usr/bin/env node

// import Configstore from "configstore";
import { log, logError, logWarn } from "diginext-utils/dist/xconsole/log";
import yargs from "yargs";

import { execConfig } from "@/config/config";
import type { InputOptions } from "@/interfaces/InputOptions";
import { execAnalytics } from "@/modules/analytics";
import createApp from "@/modules/apps/new-app";
import transferRepo from "@/modules/apps/transferRepo";
import { execCDN } from "@/modules/cdn";
import { cliAuthenticate, cliLogin, cliLogout, parseCliOptions, showProfile } from "@/modules/cli";
import { execDatabase } from "@/modules/db";
import * as deploy from "@/modules/deploy";
import { execDomain } from "@/modules/domains/execDomain";
import { execGit, generateSSH } from "@/modules/git";
import { execPipeline } from "@/modules/pipeline";
import CustomProvider, { execCustomProvider } from "@/modules/providers/custom";
import DigitalOcean, { execDigitalOcean } from "@/modules/providers/digitalocean";
import GCloud, { execGoogleCloud } from "@/modules/providers/gcloud";
import { execRegistry } from "@/modules/registry";
import { execServer } from "@/modules/server";
import generateSnippet from "@/modules/snippets/generateSnippet";
import { currentVersion } from "@/plugins";

import { execAI } from "./modules/ai/exec-ai";
import { execInitApp } from "./modules/apps/init-app";
import { viewAppLogs } from "./modules/apps/view-logs";
import { requestBuild } from "./modules/build/request-build";
import { s
```

### src\services\ActivityService.ts
```typescript
import type { IActivity } from "@/entities/Activity";
import { activitySchema } from "@/entities/Activity";
import type { Ownership } from "@/interfaces/SystemTypes";

import BaseService from "./BaseService";

export default class ActivityService extends BaseService<IActivity> {
	constructor(ownership?: Ownership) {
		super(activitySchema, ownership);
	}
}

```

### src\services\AIService.ts
```typescript
import { existsSync, writeFileSync } from "fs";
import path from "path";

import type { IUser, IWorkspace } from "@/entities";
import type { InputOptions } from "@/interfaces";
import type { Ownership } from "@/interfaces/SystemTypes";
import type { AIDto } from "@/modules/ai/openrouter-api";
import { aiApi } from "@/modules/ai/openrouter-api";
import { getFolderStructure } from "@/plugins/fs-extra";
import { extractTextBetweenBackticks } from "@/plugins/string";

export class AIService {
	/**
	 * Current login user
	 */
	user?: IUser;

	/**
	 * Current active workspace
	 */
	workspace?: IWorkspace;

	/**
	 * Current owner & workspace
	 */
	ownership?: Ownership;

	constructor(ownership?: Ownership) {
		this.ownership = ownership;
	}

	async generateDockerfileByDirectoryStructure(structure: string, options?: Pick<InputOptions, "isDebugging">) {
		if (!structure) throw new Error(`Directory structure (string) is required.`);

		// ask AI to generate a Dockerfile:
		let askMessage = `Act as a code generator tool, based on this directory structure: ${structure}`;
		askMessage += `\nGenerate content of a Dockerfile satisfied these conditions:`;
		// askMessage += "\n- Use single-stage build when you think this is a static html project";
		askMessage += "\n- Use multi-stage if this is a Javascript, TypeScript, Node.js, Rust, Python or Go lang project";
		// askMessage += "\n- In each build stage, pick the right base image with optimal latest tag";
		askMessage += "\n- Use latest ta
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
