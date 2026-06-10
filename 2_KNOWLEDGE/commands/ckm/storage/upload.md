# Command: /storage:upload

Upload a single asset to S3-compatible storage.

## Usage

```bash
/storage:upload <path>
```

## Arguments

- `path` (required): Local file path relative to project root

## Examples

```bash
# Upload single image
/storage:upload assets/designs/hero-banner.png

# Upload to specific remote path
/storage:upload assets/videos/demo.mp4 videos/demo.mp4
```

## Behavior

1. Check if S3 is configured (env vars present)
2. If not configured: output message, no error
3. If configured: upload file, return public URL

## Required Environment Variables

```bash
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=xxxxx
S3_SECRET_ACCESS_KEY=xxxxx
S3_BUCKET=my-assets
S3_PUBLIC_URL=https://cdn.example.com  # optional
```

## Prompt

```
Upload the specified file to S3-compatible storage.

**Arguments:** $ARGUMENTS

**Steps:**
1. Parse the path argument (first arg = local path, optional second arg = remote path)
2. Load s3-client from `.claude/skills/storage/scripts/s3-client.cjs`
3. Check `isConfigured()` - if false, output "S3 not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET in .env" and exit
4. Verify local file exists
5. If no remote path provided, use local path relative to project root
6. Call `upload(localPath, remotePath)`
7. Output result:
   - Success: "Uploaded: {remotePath}\nURL: {url}"
   - Failure: "Upload failed: {error}"

**Script Usage:**
```javascript
const s3 = require('./.claude/skills/storage/scripts/s3-client.cjs');

if (!s3.isConfigured()) {
  console.log('S3 not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET in .env');
  return;
}

const result = await s3.upload(localPath, remotePath);
if (result.success) {
  console.log(`Uploaded: ${remotePath}`);
  console.log(`URL: ${result.url}`);
} else {
  console.log(`Upload failed: ${result.error}`);
}
```
```
