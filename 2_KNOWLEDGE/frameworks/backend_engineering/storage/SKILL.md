---
name: ckm:storage
description: S3-compatible object storage integration for marketing assets. Works with Cloudflare R2, AWS S3, MinIO, Backblaze B2, DigitalOcean Spaces.
metadata:
  author: claudekit
  version: "1.0.0"
---

# Storage Skill

S3-compatible object storage integration for marketing assets. Works with Cloudflare R2, AWS S3, MinIO, Backblaze B2, DigitalOcean Spaces.

## When to Use

- Upload generated assets (images, videos, slides) to cloud storage
- Sync local asset folders to remote bucket
- Get public URLs for sharing/embedding
- List remote assets

## Configuration

Required env vars in user's `.env`:
```bash
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=xxxxx
S3_SECRET_ACCESS_KEY=xxxxx
S3_BUCKET=my-assets
S3_REGION=auto                        # optional, default: auto
S3_PUBLIC_URL=https://cdn.example.com # optional, custom domain
```

## Scripts

### s3-client.cjs
S3-compatible client for storage operations.

```javascript
const s3 = require('./scripts/s3-client.cjs');

// Check if configured
if (!s3.isConfigured()) {
  console.log('S3 not configured, using local storage only');
}

// Upload
const result = await s3.upload('./assets/image.png', 'designs/image.png');
// { success: true, url: 'https://...' }

// Download
await s3.download('designs/image.png', './local/image.png');

// List
const { objects } = await s3.list('designs/');

// Get URL
const url = s3.getPublicUrl('designs/image.png');

// Delete
await s3.remove('designs/old-image.png');
```

## Fallback Behavior

If S3 not configured:
- `isConfigured()` returns `false`
- All operations return graceful errors
- No exceptions thrown
- Commands output local paths only

## Provider Examples

| Provider | Endpoint |
|----------|----------|
| Cloudflare R2 | `https://<account>.r2.cloudflarestorage.com` |
| AWS S3 | `https://s3.<region>.amazonaws.com` |
| MinIO | `http://localhost:9000` |
| Backblaze B2 | `https://s3.<region>.backblazeb2.com` |
| DigitalOcean | `https://<region>.digitaloceanspaces.com` |

## Installation

Install AWS SDK in your project root (required for S3 operations):
```bash
npm install @aws-sdk/client-s3
```

Without SDK installed, all operations gracefully return `{success: false, error: 'S3 not configured'}`.

## Security

- Credentials only in `.env` (gitignored)
- Never logged or exposed
- Use bucket-scoped tokens (least privilege)
