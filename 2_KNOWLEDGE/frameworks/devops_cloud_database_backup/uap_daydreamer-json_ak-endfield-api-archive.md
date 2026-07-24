# KI: daydreamer-json/ak-endfield-api-archive

## Overview
Arknights Endfield game API response archive

## Tech Stack (from code)
- TypeScript (75 files)
- TypeScript (React) (14 files)
- **Total:** 4159 files, 3357 directories
- **File types:** .json: 2892, .png: 434, .jpg: 350, .webp: 196, .woff2: 114, .ts: 75, .otf: 32, .ttf: 28

## Dependencies
### Dependencies (from package.json)
- `@octokit/rest`: ^22.0.1
- `chalk`: ^5.6.2
- `cli-table3`: ^0.6.5
- `cookie`: ^1.1.1
- `deepmerge`: ^4.3.1
- `ky`: ^1.14.3
- `log4js`: ^6.9.1
- `luxon`: ^3.7.2
- `ora`: ^9.3.0
- `p-queue`: ^9.1.2
- `prompts`: ^2.4.2
- `qs`: ^6.15.1
- `semver`: ^7.7.4
- `uuid`: ^14.0.0
- `yaml`: ^2.8.3
- `yargs`: ^18.0.0

### Dev Dependencies
- `@biomejs/biome`: ^2.4.11
- `@tsconfig/bun`: ^1.0.10
- `@tsconfig/node24`: ^24.0.4
- `@tsconfig/recommended`: ^1.0.13
- `@tsconfig/strictest`: ^2.0.8
- `@types/bun`: latest
- `@types/luxon`: ^3.7.1
- `@types/node`: ^25.6.0
- `@types/prompts`: ^2.4.9
- `@types/qs`: ^6.15.0
- `@types/semver`: ^7.7.1
- `@types/yargs`: ^17.0.35
- `nodemon`: ^3.1.14
- `oxfmt`: ^0.26.0

## Imports Detected in Source
- `node:child_process`
- `node:path`
- `node:util`
- `yargs`

## Available Commands
- `npm run start` -- `bun src/main.ts archive && bun x oxfmt output`

## File Structure
```
  .editorconfig
  .gitignore
  .oxfmtrc.json
  LICENSE
  MEMO.md
  README.md
  biome.json
  bun.lock
  package.json
  tsconfig.json
  output/
    mirror_file_list.json
    mirror_file_list_pending.json
    mirror_file_res_list.json.zst
    mirror_file_res_list_pending.json
    mirror_file_res_patch_list.json.zst
    mirror_file_res_patch_list_pending.json
    akEndfield/
      launcher/
        game/
          1/
            all.json
            all_patch.json
            latest.json
            v1.0.13.json
            v1.0.14.json
            v1.1.9.json
            v1.2.4.json
            v1.2.5.json
            v1.3.3.json
          2/
            all.json
            all_patch.json
            latest.json
            v1.0.14.json
            v1.1.9.json
            v1.2.4.json
            v1.2.5.json
            v1.3.3.json
          6/
            all.json
            all_patch.json
            latest.json
            v1.0.13.json
            v1.0.14.json
            v1.1.9.json
            v1.2.4.json
            v1.2.5.json
            v1.3.3.json
          801/
            all.json
            all_patch.json
            latest.json
            v1.0.14.json
            v1.1.9.json
            v1.2.4.json
            v1.2.5.json
            v1.3.3.json
          802/
            all.json
            all_patch.json
            latest.json
            v1.0.14.json
            v1.1.9.json
            v1.2.4.json
            v1.2.5.json
            v1.3.3.json
        game_resources/
          1/
            Android/
              all.json
              latest.json
              v1.0.13.json
              v1.0.14.json
              v1.1.9.json
              v1.2.4.json
              v1.2.5.json
              v1.3.3.json
            PlayStation/
              all.json
              latest.json
              v1.0.13.json
              v1.0.14.json
              v1.1.9.json
              v1.2.4.json
              v1.2.5.json
              v1.3.3.json
            Win
```

## Key Source Excerpts
### src/main.ts
```typescript
#!/usr/bin/env bun

import childProcess from 'node:child_process';
import util from 'node:util';
import parseCommand from './cmd.js';
import exitUtils from './utils/exit.js';
import logger from './utils/logger.js';

async function main(): Promise<void> {
  try {
    process.platform === 'win32' ? await util.promisify(childProcess.exec)('chcp 65001') : undefined;
    await parseCommand();
  } catch (error) {
    logger.error('Unhandled error in main:', error);
    exitUtils.pressAnyKeyToExit(1);
  }
}

await main();

```

### src\cmd.ts
```typescript
import path from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import cmds from './cmds.js';
import * as TypesLogLevels from './types/LogLevels.js';
import argvUtils from './utils/argv.js';
import appConfig from './utils/config.js';
import configEmbed from './utils/configEmbed.js';
import exitUtils from './utils/exit.js';
import logger from './utils/logger.js';

if (configEmbed.VERSION_NUMBER === null) throw new Error('Embed VERSION_NUMBER is null');

function wrapHandler(handler: (argv: any) => Promise<void>) {
  return async (argv: any) => {
    try {
      await handler(argv);
      await exitUtils.exit(0);
    } catch (error) {
      logger.error('Error caught:', error);
      await exitUtils.exit(1);
    }
  };
}

async function parseCommand() {
  const yargsInstance = yargs(hideBin(process.argv));
  await yargsInstance
    .command(
      ['archive'],
      'Archive all APIs',
      (yargs) => {
        yargs.options({
          'output-dir': {
            alias: ['o'],
            desc: 'Output root directory',
            default: path.resolve('output'),
            normalize: true,
            type: 'string',
          },
        });
      },
      wrapHandler(cmds.archive),
    )
    .command(
      ['ghMirrorUpload'],
      'Upload pending large binary file to GitHub mirror',
      (yargs) => {
        yargs.options({
          'output-dir': {
            alias: ['o'],
            desc: 'Output root directory',
            default
```

### src\cmds.ts
```typescript
import archive from './cmds/archive/index.js';
import authTest from './cmds/authTest.js';
import ghMirrorUpload from './cmds/ghMirrorUpload.js';

export default {
  authTest,
  archive,
  ghMirrorUpload,
};

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
