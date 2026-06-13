#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const seosonaRoot = process.env.SEOSONA_ROOT || join(homedir(), '.seosona');
const connector = join(seosonaRoot, '1_CORE', 'scripts', 'project_connector.js');
const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [connector, ...args], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
