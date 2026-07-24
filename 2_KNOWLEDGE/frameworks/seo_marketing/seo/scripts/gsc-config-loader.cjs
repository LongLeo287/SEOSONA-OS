#!/usr/bin/env node
/**
 * Google Client Secret Loader
 *
 * Resolves google_client_secret.json from:
 * 1. Project-scope: .claude/secrets/google_client_secret.json
 * 2. Global (Unix): ~/.claude/secrets/google_client_secret.json
 * 3. Global (Windows): %USERPROFILE%\.claude\secrets\google_client_secret.json
 *
 * Cross-platform compatible (macOS, Linux, Windows)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_FILENAME = 'google_client_secret.json';
const TOKEN_FILENAME = 'gsc_token.json';
const SECRETS_DIR = 'secrets';

/**
 * Get home directory (cross-platform)
 */
function getHomeDir() {
  return process.env.HOME || process.env.USERPROFILE || os.homedir();
}

/**
 * Get project root (searches upward for .claude directory)
 */
function getProjectRoot() {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.claude'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

/**
 * Get all possible paths for config file (priority order)
 */
function getConfigPaths() {
  const homeDir = getHomeDir();
  const projectRoot = getProjectRoot();

  return [
    // 1. Project-scope (highest priority)
    path.join(projectRoot, '.claude', SECRETS_DIR, CONFIG_FILENAME),
    // 2. Global user scope
    path.join(homeDir, '.claude', SECRETS_DIR, CONFIG_FILENAME),
  ];
}

/**
 * Get all possible paths for token file (priority order)
 */
function getTokenPaths() {
  const homeDir = getHomeDir();
  const projectRoot = getProjectRoot();

  return [
    // 1. Project-scope (highest priority)
    path.join(projectRoot, '.claude', SECRETS_DIR, TOKEN_FILENAME),
    // 2. Global user scope
    path.join(homeDir, '.claude', SECRETS_DIR, TOKEN_FILENAME),
  ];
}

/**
 * Load client secret from first available path
 * @returns {{ credentials: Object, path: string } | null}
 */
function loadClientSecret() {
  const paths = getConfigPaths();

  for (const configPath of paths) {
    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        const credentials = JSON.parse(content);
        return { credentials, path: configPath };
      }
    } catch (error) {
      if (process.env.DEBUG) {
        console.error(`[gsc-config] Error reading ${configPath}: ${error.message}`);
      }
    }
  }

  return null;
}

/**
 * Load OAuth token from first available path
 * @returns {{ token: Object, path: string } | null}
 */
function loadToken() {
  const paths = getTokenPaths();

  for (const tokenPath of paths) {
    try {
      if (fs.existsSync(tokenPath)) {
        const content = fs.readFileSync(tokenPath, 'utf8');
        const token = JSON.parse(content);
        return { token, path: tokenPath };
      }
    } catch (error) {
      if (process.env.DEBUG) {
        console.error(`[gsc-config] Error reading ${tokenPath}: ${error.message}`);
      }
    }
  }

  return null;
}

/**
 * Save OAuth token to secrets directory
 * @param {Object} token - OAuth token object
 * @param {string} scope - 'project' or 'global'
 */
function saveToken(token, scope = 'project') {
  const paths = getTokenPaths();
  const targetPath = scope === 'project' ? paths[0] : paths[1];

  // Ensure directory exists
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(targetPath, JSON.stringify(token, null, 2));
  return targetPath;
}

/**
 * Get configuration status (for diagnostics)
 */
function getConfigStatus() {
  const configPaths = getConfigPaths();
  const tokenPaths = getTokenPaths();

  const status = {
    configFound: false,
    configPath: null,
    tokenFound: false,
    tokenPath: null,
    searchedPaths: {
      config: configPaths,
      token: tokenPaths,
    },
  };

  for (const p of configPaths) {
    if (fs.existsSync(p)) {
      status.configFound = true;
      status.configPath = p;
      break;
    }
  }

  for (const p of tokenPaths) {
    if (fs.existsSync(p)) {
      status.tokenFound = true;
      status.tokenPath = p;
      break;
    }
  }

  return status;
}

/**
 * Extract OAuth2 credentials from loaded config
 * @param {Object} credentials - Loaded credentials object
 * @returns {{ client_id: string, client_secret: string, redirect_uris: string[] }}
 */
function extractOAuthCredentials(credentials) {
  const config = credentials.installed || credentials.web;
  if (!config) {
    throw new Error('Invalid credentials format. Expected "installed" or "web" key.');
  }

  return {
    client_id: config.client_id,
    client_secret: config.client_secret,
    redirect_uris: config.redirect_uris || ['http://localhost'],
  };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--status')) {
    const status = getConfigStatus();
    console.log(JSON.stringify(status, null, 2));
  } else if (args.includes('--help')) {
    console.log(`
Google Client Secret Loader

Usage:
  node gsc-config-loader.cjs [options]

Options:
  --status    Show configuration status (paths checked, found files)
  --help      Show this help message

Searched paths (priority order):
  1. PROJECT/.claude/secrets/google_client_secret.json
  2. ~/.claude/secrets/google_client_secret.json (or %USERPROFILE% on Windows)
`);
  } else {
    const result = loadClientSecret();
    if (result) {
      console.log(`Found: ${result.path}`);
    } else {
      console.log('No google_client_secret.json found');
      console.log('Searched paths:', getConfigPaths().join('\n  '));
      process.exit(1);
    }
  }
}

module.exports = {
  loadClientSecret,
  loadToken,
  saveToken,
  getConfigStatus,
  getConfigPaths,
  getTokenPaths,
  extractOAuthCredentials,
  getHomeDir,
  getProjectRoot,
};
