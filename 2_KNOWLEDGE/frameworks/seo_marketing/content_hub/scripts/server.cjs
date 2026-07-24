#!/usr/bin/env node
/**
 * Content Hub Server
 * Browser-based asset gallery for ClaudeKit Marketing
 */

const http = require('http');
const path = require('path');
const { exec } = require('child_process');

const { findAvailablePort, DEFAULT_PORT } = require('./lib/port-finder.cjs');
const { writePidFile, stopAllServers, setupShutdownHandlers } = require('./lib/process-mgr.cjs');
const { createRouter } = require('./lib/router.cjs');
const { scan } = require('./lib/scanner.cjs');
const { getBrandContext } = require('./lib/brand-context.cjs');

// Paths
const SKILL_DIR = path.resolve(__dirname, '..');
const PROJECT_ROOT = process.cwd();
const ASSETS_DIR = path.join(PROJECT_ROOT, 'assets');
const MANIFEST_PATH = path.join(PROJECT_ROOT, '.assets', 'manifest.json');
const SKILL_ASSETS_DIR = path.join(SKILL_DIR, 'assets');
const TEMPLATE_PATH = path.join(SKILL_ASSETS_DIR, 'template.html');

// Cache
let manifestCache = null;
let brandCache = null;

/**
 * Get manifest (cached)
 */
async function getManifest() {
  if (!manifestCache) {
    manifestCache = scan(ASSETS_DIR, MANIFEST_PATH, { update: true });
  }
  return manifestCache;
}

/**
 * Get brand context (cached)
 */
async function getBrand() {
  if (!brandCache) {
    brandCache = getBrandContext(PROJECT_ROOT);
  }
  return brandCache;
}

/**
 * Rescan assets and clear cache
 */
async function rescan() {
  manifestCache = null;
  brandCache = null;
  return getManifest();
}

/**
 * Open URL in browser
 */
function openBrowser(url) {
  const platform = process.platform;
  const cmd = platform === 'darwin' ? 'open' :
              platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${cmd} ${url}`);
}

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    stop: args.includes('--stop'),
    open: args.includes('--open') || !args.includes('--no-open'),
    port: parseInt(args.find(a => a.startsWith('--port='))?.split('=')[1]) || null,
    scan: args.includes('--scan')
  };
}

/**
 * Main
 */
async function main() {
  const args = parseArgs();

  // Stop command
  if (args.stop) {
    const stopped = stopAllServers();
    console.log(stopped > 0
      ? `Stopped ${stopped} Content Hub server(s)`
      : 'No Content Hub servers running');
    return;
  }

  // Scan only
  if (args.scan) {
    const manifest = scan(ASSETS_DIR, MANIFEST_PATH, { update: true });
    console.log(`Scanned ${manifest.totalAssets} assets`);
    return;
  }

  // Find port
  const port = args.port || await findAvailablePort(DEFAULT_PORT);

  // Create router
  const router = createRouter({
    assetsDir: ASSETS_DIR,
    skillAssetsDir: SKILL_ASSETS_DIR,
    templatePath: TEMPLATE_PATH,
    getManifest,
    getBrandContext: getBrand,
    rescan
  });

  // Create server
  const server = http.createServer(router);

  server.listen(port, () => {
    writePidFile(port, process.pid);
    setupShutdownHandlers(port, () => server.close());

    const url = `http://localhost:${port}/hub`;
    console.log(`Content Hub running at ${url}`);

    if (args.open) {
      openBrowser(url);
    }
  });

  server.on('error', (err) => {
    console.error('Server error:', err.message);
    process.exit(1);
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
