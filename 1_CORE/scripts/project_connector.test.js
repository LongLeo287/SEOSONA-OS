#!/usr/bin/env node

const assert = require('assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { doctor, init, validateManifestShape } = require('./project_connector');

function makeTempProject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'seosona-project-'));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({
    name: 'demo-project',
    scripts: {
      build: 'next build',
      typecheck: 'tsc --noEmit',
      'seosona:doctor': 'node scripts/seosona-project.mjs doctor',
    },
    dependencies: {
      next: 'latest',
      react: 'latest',
    },
    devDependencies: {
      typescript: 'latest',
    },
  }, null, 2));
  fs.writeFileSync(path.join(root, 'tsconfig.json'), '{}\n');
  fs.mkdirSync(path.join(root, 'scripts'));
  fs.writeFileSync(path.join(root, 'scripts', 'seosona-project.mjs'), 'import os from "node:os";\n');
  execFileSync('git', ['init'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['remote', 'add', 'origin', 'https://github.com/example/demo-project.git'], { cwd: root, stdio: 'ignore' });
  return root;
}

const projectRoot = makeTempProject();
const initResult = init(projectRoot, true);
assert.strictEqual(initResult.ok, true);
assert.ok(fs.existsSync(path.join(projectRoot, 'seosona.project.json')));
assert.ok(fs.existsSync(path.join(projectRoot, 'AGENTS.md')));

const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, 'seosona.project.json'), 'utf8'));
assert.deepStrictEqual(validateManifestShape(manifest), []);
assert.strictEqual(manifest.osRoot, '~/.seosona');

const result = doctor(projectRoot);
assert.strictEqual(result.ok, true, JSON.stringify(result.findings, null, 2));
assert.strictEqual(result.status, 'connected');

const memoryRoot = path.resolve(__dirname, '..', '..', '3_MEMORY', 'projects', manifest.memoryNamespace);
fs.rmSync(memoryRoot, { recursive: true, force: true });
fs.rmSync(projectRoot, { recursive: true, force: true });

console.log('project_connector tests passed');
