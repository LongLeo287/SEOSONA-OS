/**
 * S3-Compatible Storage Client
 * Works with: Cloudflare R2, AWS S3, MinIO, Backblaze B2, DigitalOcean Spaces
 *
 * Required env vars:
 *   S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET
 * Optional:
 *   S3_REGION (default: auto), S3_PUBLIC_URL (custom domain)
 */

const fs = require('fs');
const path = require('path');

let S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand, HeadObjectCommand;

// Lazy load AWS SDK to avoid errors if not installed
function loadSDK() {
  if (!S3Client) {
    try {
      const sdk = require('@aws-sdk/client-s3');
      S3Client = sdk.S3Client;
      PutObjectCommand = sdk.PutObjectCommand;
      GetObjectCommand = sdk.GetObjectCommand;
      ListObjectsV2Command = sdk.ListObjectsV2Command;
      DeleteObjectCommand = sdk.DeleteObjectCommand;
      HeadObjectCommand = sdk.HeadObjectCommand;
      return true;
    } catch (e) {
      return false;
    }
  }
  return true;
}

// Get config from env - never log secrets
function getConfig() {
  return {
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION || 'auto',
    publicUrl: process.env.S3_PUBLIC_URL
  };
}

// Check if S3 is configured
function isConfigured() {
  const config = getConfig();
  return !!(config.endpoint && config.accessKeyId && config.secretAccessKey && config.bucket);
}

// Create S3 client
function createClient() {
  if (!loadSDK()) {
    return null;
  }

  const config = getConfig();
  if (!isConfigured()) {
    return null;
  }

  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    },
    forcePathStyle: true // Required for some S3-compatible providers
  });
}

// Get content type from file extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.pdf': 'application/pdf',
    '.md': 'text/markdown'
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Upload file to S3
 * @param {string} localPath - Local file path
 * @param {string} remotePath - Remote object key
 * @param {object} options - Optional: contentType, metadata
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
async function upload(localPath, remotePath, options = {}) {
  const client = createClient();
  if (!client) {
    return { success: false, error: 'S3 not configured' };
  }

  try {
    if (!fs.existsSync(localPath)) {
      return { success: false, error: `File not found: ${localPath}` };
    }

    const fileContent = fs.readFileSync(localPath);
    const config = getConfig();
    const contentType = options.contentType || getContentType(localPath);

    await client.send(new PutObjectCommand({
      Bucket: config.bucket,
      Key: remotePath,
      Body: fileContent,
      ContentType: contentType,
      Metadata: options.metadata || {}
    }));

    const url = getPublicUrl(remotePath);
    return { success: true, url };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Download file from S3
 * @param {string} remotePath - Remote object key
 * @param {string} localPath - Local file path to save
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function download(remotePath, localPath) {
  const client = createClient();
  if (!client) {
    return { success: false, error: 'S3 not configured' };
  }

  try {
    const config = getConfig();
    const response = await client.send(new GetObjectCommand({
      Bucket: config.bucket,
      Key: remotePath
    }));

    // Ensure directory exists
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Stream to file
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    fs.writeFileSync(localPath, Buffer.concat(chunks));

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * List objects in S3
 * @param {string} prefix - Optional prefix to filter
 * @param {number} maxKeys - Max objects to return (default 1000)
 * @returns {Promise<{success: boolean, objects?: Array, error?: string}>}
 */
async function list(prefix = '', maxKeys = 1000) {
  const client = createClient();
  if (!client) {
    return { success: false, error: 'S3 not configured' };
  }

  try {
    const config = getConfig();
    const response = await client.send(new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: prefix,
      MaxKeys: maxKeys
    }));

    const objects = (response.Contents || []).map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      url: getPublicUrl(obj.Key)
    }));

    return { success: true, objects };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Delete object from S3
 * @param {string} remotePath - Remote object key
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function remove(remotePath) {
  const client = createClient();
  if (!client) {
    return { success: false, error: 'S3 not configured' };
  }

  try {
    const config = getConfig();
    await client.send(new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: remotePath
    }));
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Check if object exists
 * @param {string} remotePath - Remote object key
 * @returns {Promise<{exists: boolean, size?: number, error?: string}>}
 */
async function exists(remotePath) {
  const client = createClient();
  if (!client) {
    return { exists: false, error: 'S3 not configured' };
  }

  try {
    const config = getConfig();
    const response = await client.send(new HeadObjectCommand({
      Bucket: config.bucket,
      Key: remotePath
    }));
    return { exists: true, size: response.ContentLength };
  } catch (e) {
    if (e.name === 'NotFound') {
      return { exists: false };
    }
    return { exists: false, error: e.message };
  }
}

/**
 * Get public URL for object
 * @param {string} remotePath - Remote object key
 * @returns {string}
 */
function getPublicUrl(remotePath) {
  const config = getConfig();

  if (config.publicUrl) {
    // Use custom domain
    return `${config.publicUrl.replace(/\/$/, '')}/${remotePath}`;
  }

  if (config.endpoint && config.bucket) {
    // Construct from endpoint
    const endpointUrl = new URL(config.endpoint);
    return `${endpointUrl.protocol}//${config.bucket}.${endpointUrl.host}/${remotePath}`;
  }

  return remotePath;
}

/**
 * Sync local folder to S3
 * @param {string} localFolder - Local folder path
 * @param {string} remotePrefix - Remote prefix (folder)
 * @param {object} options - Optional: extensions filter, dryRun
 * @returns {Promise<{success: boolean, uploaded: number, failed: number, files?: Array, error?: string}>}
 */
async function sync(localFolder, remotePrefix = '', options = {}) {
  if (!isConfigured()) {
    return { success: false, error: 'S3 not configured', uploaded: 0, failed: 0 };
  }

  try {
    if (!fs.existsSync(localFolder)) {
      return { success: false, error: `Folder not found: ${localFolder}`, uploaded: 0, failed: 0 };
    }

    const files = [];
    const extensions = options.extensions || null;

    // Recursively get files
    function walkDir(dir, prefix = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          walkDir(fullPath, relativePath);
        } else {
          if (!extensions || extensions.includes(path.extname(entry.name).toLowerCase())) {
            files.push({ local: fullPath, remote: relativePath });
          }
        }
      }
    }

    walkDir(localFolder);

    if (options.dryRun) {
      return {
        success: true,
        uploaded: 0,
        failed: 0,
        files: files.map(f => ({ ...f, remote: remotePrefix ? `${remotePrefix}/${f.remote}` : f.remote }))
      };
    }

    let uploaded = 0;
    let failed = 0;
    const results = [];

    for (const file of files) {
      const remotePath = remotePrefix ? `${remotePrefix}/${file.remote}` : file.remote;
      const result = await upload(file.local, remotePath);

      if (result.success) {
        uploaded++;
        results.push({ path: remotePath, url: result.url, success: true });
      } else {
        failed++;
        results.push({ path: remotePath, error: result.error, success: false });
      }
    }

    return { success: failed === 0, uploaded, failed, files: results };
  } catch (e) {
    return { success: false, error: e.message, uploaded: 0, failed: 0 };
  }
}

module.exports = {
  isConfigured,
  upload,
  download,
  list,
  remove,
  exists,
  getPublicUrl,
  sync
};
