#!/usr/bin/env node
/**
 * Google Analytics Config Loader
 *
 * Resolves google_client_secret.json and GA tokens from:
 * 1. Project-scope: .claude/secrets/google_client_secret.json
 * 2. Global (Unix): ~/.claude/secrets/google_client_secret.json
 * 3. Global (Windows): %USERPROFILE%\.claude\secrets\google_client_secret.json
 *
 * Also supports service account credentials:
 * 1. Project-scope: .claude/secrets/ga_service_account.json
 * 2. Global: ~/.claude/secrets/ga_service_account.json
 *
 * Cross-platform compatible (macOS, Linux, Windows)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const CLIENT_SECRET_FILENAME = 'google_client_secret.json';
const SERVICE_ACCOUNT_FILENAME = 'ga_service_account.json';
const GA_TOKEN_FILENAME = 'ga_token.json';
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
 * Get all possible paths for client secret file (priority order)
 */
function getClientSecretPaths() {
  const homeDir = getHomeDir();
  const projectRoot = getProjectRoot();

  return [
    // 1. Project-scope (highest priority)
    path.join(projectRoot, '.claude', SECRETS_DIR, CLIENT_SECRET_FILENAME),
    // 2. Global user scope
    path.join(homeDir, '.claude', SECRETS_DIR, CLIENT_SECRET_FILENAME),
  ];
}

/**
 * Get all possible paths for service account file (priority order)
 */
function getServiceAccountPaths() {
  const homeDir = getHomeDir();
  const projectRoot = getProjectRoot();

  return [
    // 1. Project-scope (highest priority)
    path.join(projectRoot, '.claude', SECRETS_DIR, SERVICE_ACCOUNT_FILENAME),
    // 2. Global user scope
    path.join(homeDir, '.claude', SECRETS_DIR, SERVICE_ACCOUNT_FILENAME),
  ];
}

/**
 * Get all possible paths for GA token file (priority order)
 */
function getTokenPaths() {
  const homeDir = getHomeDir();
  const projectRoot = getProjectRoot();

  return [
    // 1. Project-scope (highest priority)
    path.join(projectRoot, '.claude', SECRETS_DIR, GA_TOKEN_FILENAME),
    // 2. Global user scope
    path.join(homeDir, '.claude', SECRETS_DIR, GA_TOKEN_FILENAME),
  ];
}

/**
 * Load file from first available path
 * @param {string[]} paths - Array of paths to check
 * @param {string} name - Name for error messages
 * @returns {{ data: Object, path: string } | null}
 */
function loadFromPaths(paths, name) {
  for (const filePath of paths) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        return { data, path: filePath };
      }
    } catch (error) {
      if (process.env.DEBUG) {
        console.error(`[ga-config] Error reading ${filePath}: ${error.message}`);
      }
    }
  }
  return null;
}

/**
 * Load client secret for OAuth2 flow
 * @returns {{ credentials: Object, path: string } | null}
 */
function loadClientSecret() {
  const result = loadFromPaths(getClientSecretPaths(), 'client secret');
  if (result) {
    return { credentials: result.data, path: result.path };
  }
  return null;
}

/**
 * Load service account credentials
 * @returns {{ credentials: Object, path: string } | null}
 */
function loadServiceAccount() {
  const result = loadFromPaths(getServiceAccountPaths(), 'service account');
  if (result) {
    return { credentials: result.data, path: result.path };
  }
  return null;
}

/**
 * Load OAuth token
 * @returns {{ token: Object, path: string } | null}
 */
function loadToken() {
  const result = loadFromPaths(getTokenPaths(), 'token');
  if (result) {
    return { token: result.data, path: result.path };
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
  const clientSecretPaths = getClientSecretPaths();
  const serviceAccountPaths = getServiceAccountPaths();
  const tokenPaths = getTokenPaths();

  const status = {
    clientSecretFound: false,
    clientSecretPath: null,
    serviceAccountFound: false,
    serviceAccountPath: null,
    tokenFound: false,
    tokenPath: null,
    searchedPaths: {
      clientSecret: clientSecretPaths,
      serviceAccount: serviceAccountPaths,
      token: tokenPaths,
    },
  };

  for (const p of clientSecretPaths) {
    if (fs.existsSync(p)) {
      status.clientSecretFound = true;
      status.clientSecretPath = p;
      break;
    }
  }

  for (const p of serviceAccountPaths) {
    if (fs.existsSync(p)) {
      status.serviceAccountFound = true;
      status.serviceAccountPath = p;
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

/**
 * Get the best available credentials (service account preferred for automation)
 * @returns {{ type: 'service_account' | 'oauth', credentials: Object, path: string } | null}
 */
function getCredentials() {
  // First try service account (preferred for automation)
  const serviceAccount = loadServiceAccount();
  if (serviceAccount) {
    return {
      type: 'service_account',
      credentials: serviceAccount.credentials,
      path: serviceAccount.path,
    };
  }

  // Fall back to OAuth client secret
  const clientSecret = loadClientSecret();
  if (clientSecret) {
    return {
      type: 'oauth',
      credentials: clientSecret.credentials,
      path: clientSecret.path,
    };
  }

  return null;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--status')) {
    const status = getConfigStatus();
    console.log(JSON.stringify(status, null, 2));
  } else if (args.includes('--help')) {
    console.log(`
Google Analytics Config Loader

Usage:
  node ga-config-loader.cjs [options]

Options:
  --status    Show configuration status (paths checked, found files)
  --help      Show this help message

Credential files (priority order):
  1. PROJECT/.claude/secrets/ga_service_account.json (service account)
  2. ~/.claude/secrets/ga_service_account.json
  3. PROJECT/.claude/secrets/google_client_secret.json (OAuth)
  4. ~/.claude/secrets/google_client_secret.json

Token file:
  1. PROJECT/.claude/secrets/ga_token.json
  2. ~/.claude/secrets/ga_token.json
`);
  } else {
    const creds = getCredentials();
    if (creds) {
      console.log(`Found ${creds.type} credentials: ${creds.path}`);
    } else {
      console.log('No Google Analytics credentials found');
      console.log('Searched paths:');
      console.log('  Service accounts:', getServiceAccountPaths().join('\n  '));
      console.log('  Client secrets:', getClientSecretPaths().join('\n  '));
      process.exit(1);
    }
  }
}

module.exports = {
  loadClientSecret,
  loadServiceAccount,
  loadToken,
  saveToken,
  getConfigStatus,
  getClientSecretPaths,
  getServiceAccountPaths,
  getTokenPaths,
  extractOAuthCredentials,
  getCredentials,
  getHomeDir,
  getProjectRoot,
};
