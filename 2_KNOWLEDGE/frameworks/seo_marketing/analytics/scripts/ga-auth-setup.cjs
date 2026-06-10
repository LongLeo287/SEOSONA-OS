#!/usr/bin/env node
/**
 * GA4 OAuth Authentication Setup
 *
 * Interactive OAuth2 flow for user authentication (alternative to service accounts).
 * Use this when service accounts aren't available or for user-level access.
 *
 * Usage:
 *   node ga-auth-setup.cjs [options]
 *
 * Options:
 *   --scope=global    Save token globally (~/.claude/secrets/)
 *   --scope=project   Save token to project (.claude/secrets/)
 *   --status          Check current auth status
 *   --help            Show help
 *
 * Requires: googleapis
 * Credentials: google_client_secret.json in .claude/secrets/
 */

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const { exec } = require('child_process');
const configLoader = require('./ga-config-loader.cjs');

// Cross-platform browser open (since 'open' package is ESM-only)
function openBrowser(url) {
  const platform = process.platform;
  let cmd;
  if (platform === 'darwin') {
    cmd = `open "${url}"`;
  } else if (platform === 'win32') {
    cmd = `start "" "${url}"`;
  } else {
    cmd = `xdg-open "${url}"`;
  }
  return new Promise((resolve) => {
    exec(cmd, (err) => resolve(!err));
  });
}

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/analytics.edit',
];

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

async function startAuthFlow(clientSecret, scope) {
  const credentials = configLoader.extractOAuthCredentials(clientSecret);

  const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    REDIRECT_URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\nOpening browser for authentication...');
  console.log('If browser does not open, visit this URL:\n');
  console.log(authUrl);
  console.log('');

  // Start local server to receive callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const queryParams = url.parse(req.url, true).query;

        if (queryParams.code) {
          // Exchange code for tokens
          const { tokens } = await oauth2Client.getToken(queryParams.code);
          oauth2Client.setCredentials(tokens);

          // Save tokens
          const tokenPath = configLoader.saveToken(tokens, scope);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head><title>GA4 Authentication</title></head>
              <body style="font-family: system-ui; padding: 40px; text-align: center;">
                <h1>Authentication Successful!</h1>
                <p>You can close this window.</p>
                <p style="color: #666;">Token saved to: ${tokenPath}</p>
              </body>
            </html>
          `);

          server.close();
          resolve({ tokens, path: tokenPath });
        } else if (queryParams.error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head><title>GA4 Authentication Error</title></head>
              <body style="font-family: system-ui; padding: 40px; text-align: center;">
                <h1>Authentication Failed</h1>
                <p>Error: ${queryParams.error}</p>
              </body>
            </html>
          `);

          server.close();
          reject(new Error(queryParams.error));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>GA4 Authentication Error</title></head>
            <body style="font-family: system-ui; padding: 40px; text-align: center;">
              <h1>Authentication Failed</h1>
              <p>Error: ${error.message}</p>
            </body>
          </html>
        `);

        server.close();
        reject(error);
      }
    });

    server.listen(PORT, () => {
      console.log(`Waiting for OAuth callback on port ${PORT}...`);

      // Try to open browser
      openBrowser(authUrl).then((success) => {
        if (!success) console.log('Could not open browser automatically.');
      });
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authentication timeout (5 minutes)'));
    }, 5 * 60 * 1000);
  });
}

function showStatus() {
  const status = configLoader.getConfigStatus();

  console.log('\n=== GA4 Authentication Status ===\n');

  // Client Secret
  if (status.clientSecretFound) {
    console.log(`Client Secret: Found`);
    console.log(`  Path: ${status.clientSecretPath}`);
  } else {
    console.log(`Client Secret: Not found`);
    console.log(`  Searched:`);
    status.searchedPaths.clientSecret.forEach((p) => console.log(`    - ${p}`));
  }

  // Service Account
  console.log('');
  if (status.serviceAccountFound) {
    console.log(`Service Account: Found`);
    console.log(`  Path: ${status.serviceAccountPath}`);
  } else {
    console.log(`Service Account: Not found`);
    console.log(`  Searched:`);
    status.searchedPaths.serviceAccount.forEach((p) => console.log(`    - ${p}`));
  }

  // Token
  console.log('');
  if (status.tokenFound) {
    console.log(`OAuth Token: Found`);
    console.log(`  Path: ${status.tokenPath}`);

    // Check token expiry
    const tokenData = configLoader.loadToken();
    if (tokenData && tokenData.token.expiry_date) {
      const expiry = new Date(tokenData.token.expiry_date);
      const now = new Date();
      if (expiry > now) {
        console.log(`  Expires: ${expiry.toISOString()}`);
        console.log(`  Status: Valid`);
      } else {
        console.log(`  Expired: ${expiry.toISOString()}`);
        console.log(`  Status: Needs refresh (run auth again)`);
      }
    }
  } else {
    console.log(`OAuth Token: Not found`);
    console.log(`  Searched:`);
    status.searchedPaths.token.forEach((p) => console.log(`    - ${p}`));
  }

  // Recommendation
  console.log('\n=== Recommendation ===\n');
  if (status.serviceAccountFound) {
    console.log('Use service account credentials (recommended for automation).');
    console.log(`Set: export GOOGLE_APPLICATION_CREDENTIALS="${status.serviceAccountPath}"`);
  } else if (status.clientSecretFound && status.tokenFound) {
    console.log('OAuth credentials are configured and ready.');
  } else if (status.clientSecretFound) {
    console.log('Run: node ga-auth-setup.cjs');
    console.log('To complete OAuth authentication flow.');
  } else {
    console.log('No credentials found. Options:');
    console.log('1. Create a service account and save to .claude/secrets/ga_service_account.json');
    console.log('2. Download OAuth client secret to .claude/secrets/google_client_secret.json');
  }
}

function showHelp() {
  console.log(`
GA4 OAuth Authentication Setup

Usage:
  node ga-auth-setup.cjs [options]

Options:
  --scope=global    Save token to ~/.claude/secrets/
  --scope=project   Save token to .claude/secrets/ (default)
  --status          Check current auth status
  --help            Show this help

Prerequisites:
  1. Create OAuth 2.0 credentials in Google Cloud Console
  2. Download client secret JSON file
  3. Place in .claude/secrets/google_client_secret.json

Note: For automated/server-side use, service accounts are recommended.
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    showHelp();
    return;
  }

  if (args.includes('--status')) {
    showStatus();
    return;
  }

  // Determine scope
  let scope = 'project';
  const scopeArg = args.find((a) => a.startsWith('--scope='));
  if (scopeArg) {
    scope = scopeArg.split('=')[1];
    if (!['global', 'project'].includes(scope)) {
      console.error('Error: --scope must be "global" or "project"');
      process.exit(1);
    }
  }

  // Load client secret
  const clientSecretResult = configLoader.loadClientSecret();
  if (!clientSecretResult) {
    console.error('Error: No client secret found.');
    console.error('Place google_client_secret.json in:');
    configLoader.getClientSecretPaths().forEach((p) => console.error(`  - ${p}`));
    process.exit(1);
  }

  console.log(`Using client secret: ${clientSecretResult.path}`);

  try {
    const result = await startAuthFlow(clientSecretResult.credentials, scope);
    console.log('\nAuthentication successful!');
    console.log(`Token saved to: ${result.path}`);
  } catch (error) {
    console.error('\nAuthentication failed:', error.message);
    process.exit(1);
  }
}

main();
