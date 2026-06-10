# Command: /storage:sync

Sync a local folder to S3-compatible storage.

## Usage

```bash
/storage:sync <folder> [remote-prefix]
```

## Arguments

- `folder` (required): Local folder path relative to project root
- `remote-prefix` (optional): Remote prefix/folder name (default: folder name)

## Examples

```bash
# Sync entire assets/designs folder
/storage:sync assets/designs

# Sync to specific remote prefix
/storage:sync assets/banners campaign-2024/banners

# Dry run to preview what would be uploaded
/storage:sync assets/videos --dry-run
```

## Options

- `--dry-run`: Preview files without uploading
- `--extensions=.png,.jpg`: Filter by file extensions

## Behavior

1. Check if S3 is configured
2. Recursively scan local folder
3. Upload each file, preserving folder structure
4. Report: uploaded count, failed count, total size

## Prompt

```
Sync local folder to S3-compatible storage.

**Arguments:** $ARGUMENTS

**Steps:**
1. Parse arguments:
   - First arg = local folder
   - Second arg (optional) = remote prefix
   - Parse flags: --dry-run, --extensions=x,y
2. Load s3-client from `.claude/skills/storage/scripts/s3-client.cjs`
3. Check `isConfigured()` - if false, output config instructions and exit
4. Verify local folder exists
5. Call `sync(localFolder, remotePrefix, options)`
6. Output results:
   - Dry run: list files that would be uploaded
   - Actual: "Synced: {uploaded} files, {failed} failed"
   - List uploaded URLs

**Script Usage:**
```javascript
const s3 = require('./.claude/skills/storage/scripts/s3-client.cjs');

if (!s3.isConfigured()) {
  console.log('S3 not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET in .env');
  return;
}

const options = {
  dryRun: args.includes('--dry-run'),
  extensions: parseExtensions(args)
};

const result = await s3.sync(localFolder, remotePrefix, options);

if (options.dryRun) {
  console.log('Dry run - files that would be uploaded:');
  result.files.forEach(f => console.log(`  ${f.remote}`));
} else {
  console.log(`Synced: ${result.uploaded} files, ${result.failed} failed`);
  result.files.filter(f => f.success).forEach(f => {
    console.log(`  ${f.path} -> ${f.url}`);
  });
}
```
```
