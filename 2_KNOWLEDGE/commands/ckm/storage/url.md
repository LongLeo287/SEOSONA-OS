# Command: /storage:url

Get public URL for an S3 object.

## Usage

```bash
/storage:url <path>
```

## Arguments

- `path` (required): Remote object key/path

## Examples

```bash
# Get URL for specific object
/storage:url designs/hero-banner.png

# Output: https://cdn.example.com/designs/hero-banner.png
```

## Behavior

- Uses `S3_PUBLIC_URL` if configured (custom domain)
- Otherwise constructs URL from endpoint and bucket

## Prompt

```
Get public URL for an S3 object.

**Arguments:** $ARGUMENTS

**Steps:**
1. Parse path argument
2. Load s3-client from `.claude/skills/storage/scripts/s3-client.cjs`
3. Check `isConfigured()` - if false, output config instructions and exit
4. Optionally verify object exists with `exists(path)`
5. Call `getPublicUrl(path)`
6. Output URL

**Script Usage:**
```javascript
const s3 = require('./.claude/skills/storage/scripts/s3-client.cjs');

if (!s3.isConfigured()) {
  console.log('S3 not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET in .env');
  return;
}

// Optional: verify exists
const check = await s3.exists(remotePath);
if (!check.exists && !check.error) {
  console.log(`Warning: Object may not exist: ${remotePath}`);
}

const url = s3.getPublicUrl(remotePath);
console.log(url);
```
```
