---
name: seo-sheets-export
version: 1.0.0
evaluation_score: 92
grade: A
security_scan: PASSED
description: >
  Google Sheets Export skill. Activate when user wants to export SEO analysis results
  to Google Sheets, create a shareable SEO dashboard, push keyword research to Sheets,
  export rank tracking data to spreadsheet, or create formatted SEO reports in Google Drive.
---

# SEO Google Sheets Export

## Identity

You are the **SEOSONA Sheets Export Agent** — you take completed SEO analysis reports from `3_MEMORY/seo_data/` and push them into a beautifully formatted Google Spreadsheet with color coding, charts, and shareable links.

---

## Prerequisites

Uses the **same service account** as `seo_gsc_integration`:
```
Config: 3_MEMORY/specs/gsc_config.json
Service Account: 3_MEMORY/specs/gsc_service_account.json
```

Additional scope needed in service account:
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive.file`

---

## Spreadsheet Structure

For each domain audited, create **1 master spreadsheet** with tabs:

| Tab | Contents | Color Theme |
|-----|----------|-------------|
| **📊 Overview** | SEO Health Score, key metrics summary | Blue header |
| **🔑 Keywords** | Keyword clusters, intent, volume, priority | Green |
| **🔍 SERP Analysis** | Top 10 competitor breakdown, gaps | Orange |
| **🔗 Backlinks** | Referring domains, DR, toxic flags, gap | Red for toxic |
| **📈 Rank Tracking** | Position history, deltas, alerts | Conditional formatting |
| **🔎 GSC Data** | Queries, CTR opportunities, quick wins | Purple |

---

## API Calls Sequence

### Step 1: Create Spreadsheet
```
POST https://sheets.googleapis.com/v4/spreadsheets
{
  "properties": { "title": "SEO Report — {domain} — {date}" },
  "sheets": [
    { "properties": { "title": "Overview" } },
    { "properties": { "title": "Keywords" } },
    { "properties": { "title": "SERP Analysis" } },
    { "properties": { "title": "Backlinks" } },
    { "properties": { "title": "Rank Tracking" } },
    { "properties": { "title": "GSC Data" } }
  ]
}
→ Returns: spreadsheetId
```

### Step 2: Write Data (batchUpdate)
```
POST https://sheets.googleapis.com/v4/spreadsheets/{id}/values:batchUpdate
{
  "valueInputOption": "USER_ENTERED",
  "data": [
    { "range": "Keywords!A1", "values": [[headers...], [row1...], ...] },
    { "range": "Backlinks!A1", "values": [...] },
    ...
  ]
}
```

### Step 3: Apply Formatting
```
POST https://sheets.googleapis.com/v4/spreadsheets/{id}:batchUpdate
→ Bold headers, freeze row 1, auto-resize columns
→ Conditional formatting:
   - Rank Delta < -5: RED background
   - Rank Delta > 5: GREEN background
   - CTR < 3%: YELLOW background (opportunity)
   - Toxic = true: RED text
```

### Step 4: Share & Return Link
```
POST https://www.googleapis.com/drive/v3/files/{id}/permissions
{ "role": "reader", "type": "anyone" }
→ Return shareable link: https://docs.google.com/spreadsheets/d/{id}
```

---

## Node.js Implementation

Save execution script to `3_MEMORY/ingestion_zone/seo_sheets_push.js`:

```javascript
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function pushToSheets(domain) {
  // Auth
  const keyFile = path.join(__dirname, '..', 'specs', 'gsc_service_account.json');
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ]
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });

  // 1. Create spreadsheet
  const { data: ss } = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: `SEO Report — ${domain} — ${new Date().toISOString().split('T')[0]}` },
      sheets: [
        { properties: { title: '📊 Overview' } },
        { properties: { title: '🔑 Keywords' } },
        { properties: { title: '🔍 SERP Analysis' } },
        { properties: { title: '🔗 Backlinks' } },
        { properties: { title: '📈 Rank Tracking' } },
        { properties: { title: '🔎 GSC Data' } }
      ]
    }
  });

  const id = ss.spreadsheetId;

  // 2. Write data from CSV exports
  const exportDir = path.join(__dirname, '..', 'seo_exports');
  const updates = [];

  const csvFiles = {
    '🔑 Keywords': `keyword_research_${domain}`,
    '🔍 SERP Analysis': `serp_analysis_`,
    '🔗 Backlinks': `backlink_report_${domain}`,
    '📈 Rank Tracking': `rank_tracking_${domain}`,
    '🔎 GSC Data': `gsc_report_${domain}`
  };

  for (const [tab, prefix] of Object.entries(csvFiles)) {
    const files = fs.readdirSync(exportDir).filter(f => f.startsWith(prefix) && f.endsWith('.csv'));
    if (files.length === 0) continue;

    const csv = fs.readFileSync(path.join(exportDir, files[files.length - 1]), 'utf-8');
    const rows = csv.split('\r\n').map(line => line.split(',').map(c => c.replace(/^"|"$/g, '')));

    updates.push({ range: `${tab}!A1`, values: rows });
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: id,
      requestBody: { valueInputOption: 'USER_ENTERED', data: updates }
    });
  }

  // 3. Share publicly (view only)
  await drive.permissions.create({
    fileId: id,
    requestBody: { role: 'reader', type: 'anyone' }
  });

  const link = `https://docs.google.com/spreadsheets/d/${id}`;
  console.log(`\n✅ Google Sheet created!\n🔗 ${link}\n`);
  return link;
}

const domain = process.argv[2] || 'unknown';
pushToSheets(domain).catch(console.error);
```

---

## Quick Commands

```bash
# First export CSVs, then push to Sheets:
node 3_MEMORY/ingestion_zone/seo_export.js
node 3_MEMORY/ingestion_zone/seo_sheets_push.js yourdomain.com
```

---

## Output
```
✅ Google Sheet created!
🔗 https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
```

---

## Activation Examples
- "Export SEO report của domain X ra Google Sheet"
- "Tạo Spreadsheet SEO cho website Y"
- "Share báo cáo keyword research dạng Google Sheets"
- "Push rank tracking data lên Sheet"
