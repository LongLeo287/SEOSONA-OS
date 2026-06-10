#!/usr/bin/env node

const { runSetup } = require('../src/globalSetup');
const { runInit } = require('../src/localInit');
const pkg = require('../package.json');

const args = process.argv.slice(2);
const command = args[0];

if (command === 'setup') {
    runSetup();
} else if (command === 'init') {
    runInit();
} else {
    console.log(`
==========================================
   SEOSONA OS - UNIVERSAL SETUP CLI
==========================================
Usage:
  seosona setup   - Run the Global IDE Scanner (Injects rules into all IDEs on the machine)
  seosona init    - Run the Local Scanner (Drops .rules files in the current project folder)

Version ${pkg.version}
`);
}
