#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { runSetup } = require('../src/globalSetup');
const { runInit } = require('../src/localInit');
const pkg = require('../package.json');

const args = process.argv.slice(2);
const command = args[0];

function runProjectConnector(subcommand, extraArgs) {
    const connector = path.join(os.homedir(), ".seosona", "1_CORE", "scripts", "project_connector.js");
    if (!fs.existsSync(connector)) {
        console.error("[SEOSONA] Project connector not found. Run `seosona setup` first.");
        process.exitCode = 1;
        return;
    }
    execFileSync(process.execPath, [connector, subcommand, ...extraArgs], { stdio: "inherit" });
}

if (command === 'setup') {
    runSetup();
} else if (command === 'init') {
    runInit();
} else if (command === 'doctor') {
    runProjectConnector('doctor', args.slice(1));
} else if (command === 'sync-rules') {
    runProjectConnector('sync-rules', args.slice(1));
} else {
    console.log(`
==========================================
   SEOSONA OS - UNIVERSAL SETUP CLI
==========================================
Usage:
  seosona setup   - Run the Global IDE Scanner (Injects rules into all IDEs on the machine)
  seosona init    - Run the Local Scanner (Drops .rules files in the current project folder)
  seosona doctor  - Health report: OS-wide (lint, bridge, tests, brain) from the OS repo,
                    or the project-connector diagnosis from a connected satellite folder
  seosona sync-rules - Refresh generated project rule files

Version ${pkg.version}
`);
}
