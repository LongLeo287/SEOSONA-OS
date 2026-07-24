# Command: /storage:list

List objects in S3-compatible storage.

## Usage

```bash
/storage:list [prefix]
```

## Arguments

- `prefix` (optional): Filter by prefix/folder

## Examples

```bash
# List all objects
/storage:list

# List objects in designs folder
/storage:list designs/

# List objects matching prefix
/storage:list campaign-2024/
```

## Output Format

```
designs/hero.png          125 KB   2024-12-26
designs/logo.svg           12 KB   2024-12-25
videos/demo.mp4          45.2 MB   2024-12-24
---
3 objects, 45.3 MB total
```

## Prompt

```
List objects in S3-compatible storage.

**Arguments:** $ARGUMENTS

**Steps:**
1. Parse optional prefix argument
2. Load s3-client from `.claude/skills/storage/scripts/s3-client.cjs`
3. Check `isConfigured()` - if false, output config instructions and exit
4. Call `list(prefix)`
5. Format output:
   - Table: key, size (human readable), last modified
   - Summary: count, total size

**Script Usage:**
```javascript
const s3 = require('./.claude/skills/storage/scripts/s3-client.cjs');

if (!s3.isConfigured()) {
  console.log('S3 not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET in .env');
  return;
}

const result = await s3.list(prefix);

if (!result.success) {
  console.log(`Error: ${result.error}`);
  return;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

let totalSize = 0;
result.objects.forEach(obj => {
  totalSize += obj.size;
  const date = new Date(obj.lastModified).toISOString().split('T')[0];
  console.log(`${obj.key.padEnd(40)} ${formatSize(obj.size).padStart(10)} ${date}`);
});

console.log('---');
console.log(`${result.objects.length} objects, ${formatSize(totalSize)} total`);
```
```
