#!/usr/bin/env node
/**
 * Google Search Console OAuth2 Authentication
 *
 * Handles OAuth2 flow for Google Search Console API:
 * - Generates authorization URL
 * - Exchanges code for tokens
 * - Refreshes expired tokens
 *
 * Cross-platform compatible (macOS, Linux, Windows)
 *
 * Usage:
 *   node gsc-auth.cjs --auth          # Start OAuth flow
 *   node gsc-auth.cjs --verify        # Verify current token
 *   node gsc-auth.cjs --revoke        # Revoke token
 */

const { google } = require('googleapis');
const readline = require('readline');
const http = require('http');
const url = require('url');
const {
  loadClientSecret,
  loadToken,
  saveToken,
  extractOAuthCredentials,
  getConfigStatus,
} = require('./gsc-config-loader.cjs');

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/webmasters',
];

const LOCAL_PORT = 8085;

/**
 * Create OAuth2 client from loaded credentials
 */
function createOAuth2Client() {
  const result = loadClientSecret();
  if (!result) {
    const status = getConfigStatus();
    console.error('Error: google_client_secret.json not found');
    console.error('Searched paths:');
    status.searchedPaths.config.forEach((p) => console.error(`  - ${p}`));
    console.error('\nSetup instructions:');
    console.error('1. Go to Google Cloud Console > APIs & Services > Credentials');
    console.error('2. Create OAuth 2.0 Client ID (Desktop app)');
    console.error('3. Download JSON and save as google_client_secret.json');
    console.error('4. Place in .claude/secrets/ (project) or ~/.claude/secrets/ (global)');
    process.exit(1);
  }

  const { client_id, client_secret, redirect_uris } = extractOAuthCredentials(result.credentials);

  // Use localhost for OAuth callback
  const redirectUri = `http://localhost:${LOCAL_PORT}`;

  return new google.auth.OAuth2(client_id, client_secret, redirectUri);
}

/**
 * Start local HTTP server to receive OAuth callback
 */
function startCallbackServer(oauth2Client) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const queryString = url.parse(req.url, true).query;

      if (queryString.code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>Authentication Successful!</h1>
              <p>You can close this window and return to the terminal.</p>
            </body>
          </html>
        `);

        server.close();
        resolve(queryString.code);
      } else if (queryString.error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error: ${queryString.error}</h1>`);
        server.close();
        reject(new Error(queryString.error));
      }
    });

    server.listen(LOCAL_PORT, () => {
      console.log(`Callback server listening on port ${LOCAL_PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${LOCAL_PORT} is in use. Please close any other OAuth flows.`);
      }
      reject(err);
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Timeout waiting for OAuth callback'));
    }, 5 * 60 * 1000);
  });
}

/**
 * Prompt user for code (fallback if server doesn't work)
 */
function promptForCode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter the authorization code: ', (code) => {
      rl.close();
      resolve(code.trim());
    });
  });
}

/**
 * Run OAuth2 authentication flow
 */
async function authenticate(options = {}) {
  const oauth2Client = createOAuth2Client();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent to get refresh token
  });

  console.log('\n=== Google Search Console Authentication ===\n');
  console.log('1. Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\n2. Grant the requested permissions');
  console.log('3. You will be redirected to localhost automatically\n');

  let code;

  if (options.manual) {
    // Manual mode: user copies code
    code = await promptForCode();
  } else {
    // Auto mode: start local server
    try {
      // Open URL in default browser (cross-platform)
      const { exec } = require('child_process');
      const platform = process.platform;

      if (platform === 'darwin') {
        exec(`open "${authUrl}"`);
      } else if (platform === 'win32') {
        exec(`start "" "${authUrl}"`);
      } else {
        exec(`xdg-open "${authUrl}"`);
      }

      code = await startCallbackServer(oauth2Client);
    } catch (error) {
      console.error('Automatic callback failed. Falling back to manual mode.');
      console.error('Error:', error.message);
      code = await promptForCode();
    }
  }

  // Exchange code for tokens
  console.log('\nExchanging authorization code for tokens...');
  const { tokens } = await oauth2Client.getToken(code);

  // Save token
  const scope = options.global ? 'global' : 'project';
  const tokenPath = saveToken(tokens, scope);

  console.log(`\nAuthentication successful!`);
  console.log(`Token saved to: ${tokenPath}`);

  return tokens;
}

/**
 * Verify current token is valid
 */
async function verifyToken() {
  const tokenResult = loadToken();
  if (!tokenResult) {
    console.error('No token found. Run with --auth to authenticate.');
    return false;
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokenResult.token);

  try {
    // Try to get token info
    const tokenInfo = await oauth2Client.getTokenInfo(tokenResult.token.access_token);
    console.log('Token is valid');
    console.log(`  Expiry: ${new Date(tokenResult.token.expiry_date).toISOString()}`);
    console.log(`  Scopes: ${tokenInfo.scopes.join(', ')}`);
    console.log(`  Path: ${tokenResult.path}`);
    return true;
  } catch (error) {
    if (tokenResult.token.refresh_token) {
      console.log('Access token expired. Attempting refresh...');
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        saveToken(credentials);
        console.log('Token refreshed successfully');
        return true;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.message);
        return false;
      }
    }
    console.error('Token invalid and no refresh token available');
    return false;
  }
}

/**
 * Revoke current token
 */
async function revokeToken() {
  const tokenResult = loadToken();
  if (!tokenResult) {
    console.log('No token found');
    return;
  }

  const oauth2Client = createOAuth2Client();

  try {
    await oauth2Client.revokeToken(tokenResult.token.access_token);
    console.log('Token revoked successfully');

    // Delete token file
    const fs = require('fs');
    fs.unlinkSync(tokenResult.path);
    console.log(`Deleted: ${tokenResult.path}`);
  } catch (error) {
    console.error('Revoke failed:', error.message);
  }
}

/**
 * Get authenticated OAuth2 client
 * For use by other scripts
 */
async function getAuthenticatedClient() {
  const tokenResult = loadToken();
  if (!tokenResult) {
    throw new Error('No token found. Run: node gsc-auth.cjs --auth');
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokenResult.token);

  // Check if token needs refresh
  if (tokenResult.token.expiry_date && Date.now() >= tokenResult.token.expiry_date - 60000) {
    if (tokenResult.token.refresh_token) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      saveToken(credentials);
      oauth2Client.setCredentials(credentials);
    } else {
      throw new Error('Token expired and no refresh token. Run: node gsc-auth.cjs --auth');
    }
  }

  return oauth2Client;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Google Search Console Authentication

Usage:
  node gsc-auth.cjs [options]

Options:
  --auth      Start OAuth2 authentication flow
  --manual    Use manual code entry (no local server)
  --global    Save token globally instead of project-scope
  --verify    Verify current token is valid
  --revoke    Revoke current token
  --status    Show current auth status
  --help      Show this help

Examples:
  node gsc-auth.cjs --auth              # Authenticate (auto mode)
  node gsc-auth.cjs --auth --manual     # Authenticate (manual code entry)
  node gsc-auth.cjs --verify            # Check if authenticated
`);
    process.exit(0);
  }

  if (args.includes('--status')) {
    const status = getConfigStatus();
    console.log('Configuration Status:');
    console.log(JSON.stringify(status, null, 2));
    process.exit(0);
  }

  if (args.includes('--auth')) {
    authenticate({
      manual: args.includes('--manual'),
      global: args.includes('--global'),
    })
      .then(() => process.exit(0))
      .catch((err) => {
        console.error('Authentication failed:', err.message);
        process.exit(1);
      });
  } else if (args.includes('--verify')) {
    verifyToken()
      .then((valid) => process.exit(valid ? 0 : 1))
      .catch((err) => {
        console.error('Verification failed:', err.message);
        process.exit(1);
      });
  } else if (args.includes('--revoke')) {
    revokeToken()
      .then(() => process.exit(0))
      .catch((err) => {
        console.error('Revoke failed:', err.message);
        process.exit(1);
      });
  } else {
    console.log('Use --help for usage information');
    console.log('Use --auth to start authentication');
    process.exit(0);
  }
}

module.exports = {
  createOAuth2Client,
  authenticate,
  verifyToken,
  revokeToken,
  getAuthenticatedClient,
  SCOPES,
};
