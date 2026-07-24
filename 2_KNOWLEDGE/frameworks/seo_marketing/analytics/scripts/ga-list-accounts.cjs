#!/usr/bin/env node
/**
 * GA4 Account & Property Lister
 *
 * Lists all accessible GA4 accounts and properties using Admin API.
 *
 * Usage:
 *   node ga-list-accounts.cjs [options]
 *
 * Options:
 *   --accounts     List accounts only
 *   --properties   List properties only
 *   --json         Output as JSON
 *   --help         Show help
 *
 * Requires: @google-analytics/admin
 * Credentials: GOOGLE_APPLICATION_CREDENTIALS or .claude/secrets/ga_service_account.json
 */

const { AnalyticsAdminServiceClient } = require('@google-analytics/admin');
const { google } = require('googleapis');
const configLoader = require('./ga-config-loader.cjs');

/**
 * Create OAuth2 client from saved token
 */
function createOAuth2Client() {
  const clientSecretResult = configLoader.loadClientSecret();
  const tokenResult = configLoader.loadToken();

  if (!clientSecretResult || !tokenResult) {
    return null;
  }

  const credentials = configLoader.extractOAuthCredentials(clientSecretResult.credentials);
  const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0]
  );
  oauth2Client.setCredentials(tokenResult.token);
  return oauth2Client;
}

async function listAccounts(client) {
  const accounts = [];
  const request = {};

  // Use auto-pagination
  const iterable = client.listAccountsAsync(request);
  for await (const account of iterable) {
    accounts.push({
      name: account.name,
      displayName: account.displayName,
      regionCode: account.regionCode || 'N/A',
      createTime: account.createTime?.seconds
        ? new Date(account.createTime.seconds * 1000).toISOString()
        : 'N/A',
    });
  }

  return accounts;
}

async function listProperties(client, accountFilter = null) {
  const properties = [];

  // Build filter
  let filter = '';
  if (accountFilter) {
    filter = `parent:${accountFilter}`;
  }

  const request = filter ? { filter } : {};

  try {
    const iterable = client.listPropertiesAsync(request);
    for await (const property of iterable) {
      properties.push({
        name: property.name,
        displayName: property.displayName,
        propertyType: property.propertyType,
        timeZone: property.timeZone,
        currencyCode: property.currencyCode,
        industryCategory: property.industryCategory || 'N/A',
        createTime: property.createTime?.seconds
          ? new Date(property.createTime.seconds * 1000).toISOString()
          : 'N/A',
        parent: property.parent,
      });
    }
  } catch (error) {
    if (error.code === 3 && !accountFilter) {
      // INVALID_ARGUMENT - need to specify parent filter
      // Try listing properties for each account
      const accounts = await listAccounts(client);
      for (const account of accounts) {
        const accountProps = await listProperties(client, account.name);
        properties.push(...accountProps);
      }
    } else {
      throw error;
    }
  }

  return properties;
}

async function listAccountSummaries(client) {
  const summaries = [];

  const iterable = client.listAccountSummariesAsync({});
  for await (const summary of iterable) {
    summaries.push({
      name: summary.name,
      account: summary.account,
      displayName: summary.displayName,
      propertySummaries: summary.propertySummaries?.map((p) => ({
        property: p.property,
        displayName: p.displayName,
        propertyType: p.propertyType,
      })),
    });
  }

  return summaries;
}

function printAccounts(accounts) {
  console.log('\n=== GA4 Accounts ===\n');
  if (accounts.length === 0) {
    console.log('No accounts found.');
    return;
  }

  accounts.forEach((account) => {
    console.log(`Account: ${account.name}`);
    console.log(`  Display Name: ${account.displayName}`);
    console.log(`  Region: ${account.regionCode}`);
    console.log(`  Created: ${account.createTime}`);
    console.log('');
  });
}

function printProperties(properties) {
  console.log('\n=== GA4 Properties ===\n');
  if (properties.length === 0) {
    console.log('No properties found.');
    return;
  }

  properties.forEach((prop) => {
    console.log(`Property: ${prop.name}`);
    console.log(`  Display Name: ${prop.displayName}`);
    console.log(`  Type: ${prop.propertyType}`);
    console.log(`  Timezone: ${prop.timeZone}`);
    console.log(`  Currency: ${prop.currencyCode}`);
    console.log(`  Industry: ${prop.industryCategory}`);
    console.log(`  Parent: ${prop.parent}`);
    console.log('');
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
GA4 Account & Property Lister

Usage:
  node ga-list-accounts.cjs [options]

Options:
  --accounts     List accounts only
  --properties   List properties only
  --summaries    List account summaries (quick overview)
  --json         Output as JSON
  --help         Show this help

Examples:
  node ga-list-accounts.cjs                 # List all accounts and properties
  node ga-list-accounts.cjs --accounts      # List accounts only
  node ga-list-accounts.cjs --properties    # List properties only
  node ga-list-accounts.cjs --json          # Output as JSON
`);
    return;
  }

  // Check credentials
  const status = configLoader.getConfigStatus();
  const hasServiceAccount = status.serviceAccountFound || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const hasOAuthToken = status.tokenFound && status.clientSecretFound;

  if (!hasServiceAccount && !hasOAuthToken) {
    console.error('Error: No credentials found.');
    console.error('Options:');
    console.error('  1. Run: node ga-auth-setup.cjs (OAuth flow)');
    console.error('  2. Place ga_service_account.json in .claude/secrets/');
    process.exit(1);
  }

  const showJson = args.includes('--json');
  const showAccountsOnly = args.includes('--accounts');
  const showPropertiesOnly = args.includes('--properties');
  const showSummaries = args.includes('--summaries');

  try {
    let client;

    if (hasServiceAccount) {
      // Use service account
      if (status.serviceAccountFound && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = status.serviceAccountPath;
      }
      if (!showJson) console.log(`Using service account credentials`);
      client = new AnalyticsAdminServiceClient();
    } else {
      // Use OAuth token
      const authClient = createOAuth2Client();
      if (!authClient) {
        console.error('Error: Failed to create OAuth client');
        process.exit(1);
      }
      if (!showJson) console.log(`Using OAuth credentials from: ${status.tokenPath}`);
      client = new AnalyticsAdminServiceClient({ authClient });
    }

    if (showSummaries) {
      const summaries = await listAccountSummaries(client);
      if (showJson) {
        console.log(JSON.stringify(summaries, null, 2));
      } else {
        console.log('\n=== GA4 Account Summaries ===\n');
        summaries.forEach((s) => {
          console.log(`${s.displayName} (${s.account})`);
          s.propertySummaries?.forEach((p) => {
            console.log(`  └─ ${p.displayName} (${p.property}) [${p.propertyType}]`);
          });
          console.log('');
        });
      }
      return;
    }

    const result = {};

    if (!showPropertiesOnly) {
      result.accounts = await listAccounts(client);
    }

    if (!showAccountsOnly) {
      result.properties = await listProperties(client);
    }

    if (showJson) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result.accounts) {
        printAccounts(result.accounts);
      }
      if (result.properties) {
        printProperties(result.properties);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 7) {
      console.error('\nPermission denied. Ensure service account has access to GA4 properties.');
    } else if (error.code === 16) {
      console.error('\nAuthentication failed. Check your credentials.');
    }
    process.exit(1);
  }
}

main();
