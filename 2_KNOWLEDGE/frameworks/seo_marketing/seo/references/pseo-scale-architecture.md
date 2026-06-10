# pSEO Scale Architecture

Architecture patterns for generating and managing 100k+ programmatic SEO pages.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      pSEO Pipeline                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │  Data    │───▶│  Batch   │───▶│ Parallel │             │
│  │  Source  │    │ Chunking │    │ Generate │             │
│  └──────────┘    └──────────┘    └──────────┘             │
│       │                │                │                   │
│       │                ▼                ▼                   │
│       │          ┌──────────┐    ┌──────────┐             │
│       │          │Checkpoint│    │ Quality  │             │
│       │          │  System  │    │ Validate │             │
│       │          └──────────┘    └──────────┘             │
│       │                │                │                   │
│       ▼                ▼                ▼                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ Storage  │◀───│  Output  │◀───│  Index   │             │
│  │(DB/File) │    │  Writer  │    │Generator │             │
│  └──────────┘    └──────────┘    └──────────┘             │
│       │                                │                   │
│       └────────────────┬───────────────┘                   │
│                        ▼                                    │
│                  ┌──────────┐                              │
│                  │   CDN    │                              │
│                  │  Deploy  │                              │
│                  └──────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

## Batch Processing Strategy

### Chunk Size: 1000 Rows per Batch

**Rationale:**
- Memory efficient (prevents OOM)
- Progress visible (checkpoint every 1000)
- Retry scope limited (only reprocess 1000 on failure)
- Optimal for parallel processing

### Implementation

```javascript
class BatchProcessor {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 1000;
    this.checkpoint = new CheckpointManager();
  }

  async process(data, processor) {
    const chunks = this.createChunks(data, this.chunkSize);
    const results = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkId = `chunk_${i}`;

      // Skip if already processed
      if (this.checkpoint.isComplete(chunkId)) {
        console.log(`Skipping chunk ${i} (already complete)`);
        continue;
      }

      console.log(`Processing chunk ${i}/${chunks.length} (${chunk.length} items)`);

      try {
        const chunkResults = await processor(chunk, i);
        results.push(...chunkResults);

        // Save checkpoint
        this.checkpoint.markComplete(chunkId, chunkResults);
        console.log(`✓ Chunk ${i} complete`);
      } catch (error) {
        console.error(`✗ Chunk ${i} failed:`, error);
        this.checkpoint.markFailed(chunkId, error);
        throw error;
      }
    }

    return results;
  }

  createChunks(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
```

## Parallel Generation (4-8 Workers)

### Worker Pool Pattern

```javascript
const { Worker } = require('worker_threads');
const os = require('os');

class WorkerPool {
  constructor(workerScript, options = {}) {
    this.workerScript = workerScript;
    this.maxWorkers = options.maxWorkers || Math.min(8, os.cpus().length);
    this.workers = [];
    this.queue = [];
    this.activeJobs = 0;
  }

  async execute(tasks) {
    return new Promise((resolve, reject) => {
      const results = [];
      let completed = 0;

      // Create worker pool
      for (let i = 0; i < this.maxWorkers; i++) {
        const worker = new Worker(this.workerScript);

        worker.on('message', (result) => {
          results.push(result);
          completed++;

          // Process next task
          if (this.queue.length > 0) {
            const nextTask = this.queue.shift();
            worker.postMessage(nextTask);
          } else {
            // No more tasks, terminate worker
            worker.terminate();
          }

          // Check if all done
          if (completed === tasks.length) {
            resolve(results);
          }
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });

        this.workers.push(worker);
      }

      // Distribute initial tasks
      tasks.forEach((task, index) => {
        if (index < this.maxWorkers) {
          this.workers[index].postMessage(task);
        } else {
          this.queue.push(task);
        }
      });
    });
  }
}

// Usage
const pool = new WorkerPool('./worker-generate-page.js', { maxWorkers: 6 });

const tasks = dataChunks.map((chunk, index) => ({
  chunkId: index,
  data: chunk,
  template: templateConfig
}));

const results = await pool.execute(tasks);
```

### Worker Script Example

```javascript
// worker-generate-page.js
const { parentPort } = require('worker_threads');
const Nunjucks = require('nunjucks');

parentPort.on('message', async (task) => {
  try {
    const pages = [];

    for (const row of task.data) {
      // Generate page from template
      const html = Nunjucks.renderString(task.template, row);

      pages.push({
        url: generateUrl(row),
        content: html,
        metadata: extractMetadata(row)
      });
    }

    // Return results
    parentPort.postMessage({
      chunkId: task.chunkId,
      pages,
      success: true
    });
  } catch (error) {
    parentPort.postMessage({
      chunkId: task.chunkId,
      error: error.message,
      success: false
    });
  }
});

function generateUrl(data) {
  return `/${data.service}/${data.city}-${data.state}/`
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function extractMetadata(data) {
  return {
    title: `${data.service} in ${data.city}, ${data.state}`,
    description: `Find ${data.service} in ${data.city}...`,
    keywords: [data.service, data.city, data.state]
  };
}
```

## Checkpoint/Resume System

### Checkpoint Manager

```javascript
const fs = require('fs');
const path = require('path');

class CheckpointManager {
  constructor(checkpointDir = './checkpoints') {
    this.checkpointDir = checkpointDir;
    this.checkpointFile = path.join(checkpointDir, 'progress.json');
    this.state = this.load();
  }

  load() {
    if (fs.existsSync(this.checkpointFile)) {
      return JSON.parse(fs.readFileSync(this.checkpointFile, 'utf8'));
    }
    return {
      completed: [],
      failed: [],
      lastUpdate: null
    };
  }

  save() {
    fs.mkdirSync(this.checkpointDir, { recursive: true });
    fs.writeFileSync(
      this.checkpointFile,
      JSON.stringify(this.state, null, 2)
    );
  }

  isComplete(chunkId) {
    return this.state.completed.includes(chunkId);
  }

  markComplete(chunkId, results) {
    if (!this.state.completed.includes(chunkId)) {
      this.state.completed.push(chunkId);
    }

    // Save chunk results to disk
    const chunkFile = path.join(this.checkpointDir, `${chunkId}.json`);
    fs.writeFileSync(chunkFile, JSON.stringify(results, null, 2));

    this.state.lastUpdate = new Date().toISOString();
    this.save();
  }

  markFailed(chunkId, error) {
    this.state.failed.push({
      chunkId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    this.save();
  }

  reset() {
    this.state = {
      completed: [],
      failed: [],
      lastUpdate: null
    };
    this.save();
  }

  getProgress() {
    return {
      completed: this.state.completed.length,
      failed: this.state.failed.length,
      lastUpdate: this.state.lastUpdate
    };
  }

  resume(totalChunks) {
    const remaining = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunkId = `chunk_${i}`;
      if (!this.isComplete(chunkId)) {
        remaining.push(i);
      }
    }
    return remaining;
  }
}
```

## Performance Benchmarks

### Target: 100 Pages/Minute

**Breakdown:**
- Template rendering: ~0.1s per page
- Quality validation: ~0.05s per page
- File write: ~0.01s per page
- Total: ~0.16s per page = 375 pages/min (single thread)

**With 6 Workers:**
- Theoretical: 375 × 6 = 2,250 pages/min
- Actual (overhead): ~1,500 pages/min
- 100k pages: ~67 minutes

### Benchmark Script

```javascript
class PerformanceBenchmark {
  async run(pageCount, workerCount) {
    const startTime = Date.now();

    console.log(`Starting benchmark: ${pageCount} pages, ${workerCount} workers`);

    const generator = new PSEOGenerator({
      workerCount,
      chunkSize: 1000
    });

    const results = await generator.generate(this.getSampleData(pageCount));

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // seconds
    const pagesPerSecond = pageCount / duration;
    const pagesPerMinute = pagesPerSecond * 60;

    return {
      pageCount,
      workerCount,
      duration,
      pagesPerSecond,
      pagesPerMinute,
      totalSize: this.calculateSize(results),
      avgPageSize: this.calculateSize(results) / pageCount
    };
  }

  getSampleData(count) {
    const cities = ['Austin', 'Miami', 'Seattle', 'Denver'];
    const services = ['Plumber', 'Electrician', 'HVAC', 'Roofer'];

    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        city: cities[i % cities.length],
        state: 'TX',
        service: services[i % services.length],
        rating: 4.5,
        reviewCount: 100
      });
    }
    return data;
  }

  calculateSize(results) {
    return results.reduce((total, page) => {
      return total + Buffer.byteLength(page.content, 'utf8');
    }, 0);
  }
}

// Run benchmark
(async () => {
  const benchmark = new PerformanceBenchmark();

  const tests = [
    { pages: 1000, workers: 1 },
    { pages: 1000, workers: 4 },
    { pages: 1000, workers: 8 },
    { pages: 10000, workers: 6 }
  ];

  for (const test of tests) {
    const result = await benchmark.run(test.pages, test.workers);
    console.log(result);
  }
})();
```

## Quality Validation per Batch

```javascript
class BatchQualityValidator {
  validate(pages) {
    const report = {
      total: pages.length,
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: []
    };

    pages.forEach(page => {
      const validation = this.validatePage(page);

      if (validation.failed.length > 0) {
        report.failed++;
        report.issues.push({
          url: page.url,
          errors: validation.failed
        });
      } else if (validation.warnings.length > 0) {
        report.warnings++;
        report.issues.push({
          url: page.url,
          warnings: validation.warnings
        });
      } else {
        report.passed++;
      }
    });

    return report;
  }

  validatePage(page) {
    const checks = {
      passed: [],
      failed: [],
      warnings: []
    };

    // Word count
    const wordCount = page.content.split(/\s+/).length;
    if (wordCount < 300) {
      checks.failed.push(`Word count too low: ${wordCount}`);
    } else {
      checks.passed.push('Word count OK');
    }

    // Title length
    const titleMatch = page.content.match(/<title>(.+?)<\/title>/);
    if (titleMatch) {
      const titleLength = titleMatch[1].length;
      if (titleLength < 30 || titleLength > 60) {
        checks.warnings.push(`Title length: ${titleLength} (ideal: 50-60)`);
      }
    } else {
      checks.failed.push('Missing title tag');
    }

    // Meta description
    const metaMatch = page.content.match(/meta name="description" content="(.+?)"/);
    if (!metaMatch) {
      checks.failed.push('Missing meta description');
    }

    // H1 tag
    const h1Count = (page.content.match(/<h1/g) || []).length;
    if (h1Count !== 1) {
      checks.failed.push(`H1 count: ${h1Count} (should be 1)`);
    }

    return checks;
  }
}
```

## Storage: Database vs File System

### File System (Recommended for <100k pages)

```javascript
class FileSystemStorage {
  constructor(outputDir = './dist') {
    this.outputDir = outputDir;
  }

  async savePage(page) {
    const filePath = path.join(this.outputDir, page.url, 'index.html');

    // Create directory
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    // Write HTML
    await fs.promises.writeFile(filePath, page.content);

    return filePath;
  }

  async saveBatch(pages) {
    const promises = pages.map(page => this.savePage(page));
    return Promise.all(promises);
  }

  async generateSitemap(pages) {
    const urls = pages.map(page => ({
      url: `https://example.com${page.url}`,
      lastmod: new Date().toISOString().split('T')[0]
    }));

    const xml = this.buildSitemapXML(urls);
    await fs.promises.writeFile(
      path.join(this.outputDir, 'sitemap.xml'),
      xml
    );
  }

  buildSitemapXML(urls) {
    const entries = urls.map(url => `
  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
  }
}
```

### Database (Recommended for >100k pages)

```javascript
// Using SQLite for example
const sqlite3 = require('sqlite3');
const { promisify } = require('util');

class DatabaseStorage {
  constructor(dbPath = './pages.db') {
    this.db = new sqlite3.Database(dbPath);
    this.run = promisify(this.db.run.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
    this.init();
  }

  async init() {
    await this.run(`
      CREATE TABLE IF NOT EXISTS pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT UNIQUE,
        title TEXT,
        content TEXT,
        meta_description TEXT,
        word_count INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE INDEX IF NOT EXISTS idx_url ON pages(url)
    `);
  }

  async savePage(page) {
    const wordCount = page.content.split(/\s+/).length;

    await this.run(`
      INSERT OR REPLACE INTO pages (url, title, content, meta_description, word_count)
      VALUES (?, ?, ?, ?, ?)
    `, [page.url, page.title, page.content, page.metaDescription, wordCount]);
  }

  async saveBatch(pages) {
    // Use transaction for batch insert
    await this.run('BEGIN TRANSACTION');

    try {
      for (const page of pages) {
        await this.savePage(page);
      }
      await this.run('COMMIT');
    } catch (error) {
      await this.run('ROLLBACK');
      throw error;
    }
  }

  async getPageCount() {
    const result = await this.all('SELECT COUNT(*) as count FROM pages');
    return result[0].count;
  }

  async exportToFiles(outputDir) {
    const pages = await this.all('SELECT * FROM pages');

    for (const page of pages) {
      const filePath = path.join(outputDir, page.url, 'index.html');
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, page.content);
    }
  }
}
```

## CDN/Caching Strategy

### Cache Headers

```javascript
class CDNOptimizer {
  static getCacheHeaders(pageType) {
    const headers = {
      // Static pages: cache for 1 day
      static: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'CDN-Cache-Control': 'max-age=604800', // 1 week on CDN
        'Vary': 'Accept-Encoding'
      },

      // Dynamic pages: shorter cache
      dynamic: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'CDN-Cache-Control': 'max-age=86400',
        'Vary': 'Accept-Encoding'
      }
    };

    return headers[pageType] || headers.static;
  }

  static generatePreloadHints(page) {
    // Generate resource hints for critical assets
    return `
      <link rel="preconnect" href="https://cdn.example.com">
      <link rel="dns-prefetch" href="https://analytics.example.com">
      <link rel="preload" href="/styles/critical.css" as="style">
    `;
  }
}
```

### Deployment Script

```javascript
// deploy-to-cdn.js
const AWS = require('aws-sdk');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

class CDNDeployer {
  constructor() {
    this.s3 = new AWS.S3();
    this.bucket = process.env.S3_BUCKET;
  }

  async deploy(distDir) {
    const files = glob.sync('**/*', { cwd: distDir, nodir: true });

    console.log(`Deploying ${files.length} files to S3...`);

    const uploads = files.map(file => this.uploadFile(distDir, file));

    await Promise.all(uploads);

    console.log('✓ Deployment complete');

    // Invalidate CloudFront cache
    await this.invalidateCache();
  }

  async uploadFile(distDir, file) {
    const filePath = path.join(distDir, file);
    const content = fs.readFileSync(filePath);

    const params = {
      Bucket: this.bucket,
      Key: file,
      Body: content,
      ContentType: this.getContentType(file),
      CacheControl: 'public, max-age=86400'
    };

    return this.s3.putObject(params).promise();
  }

  getContentType(file) {
    const ext = path.extname(file);
    const types = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.xml': 'application/xml'
    };
    return types[ext] || 'application/octet-stream';
  }

  async invalidateCache() {
    const cloudfront = new AWS.CloudFront();

    await cloudfront.createInvalidation({
      DistributionId: process.env.CLOUDFRONT_DIST_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: ['/*']
        }
      }
    }).promise();

    console.log('✓ CloudFront cache invalidated');
  }
}
```

## Complete Pipeline Example

```javascript
// main.js - Complete pSEO generation pipeline
const { BatchProcessor } = require('./batch-processor');
const { WorkerPool } = require('./worker-pool');
const { CheckpointManager } = require('./checkpoint-manager');
const { FileSystemStorage } = require('./storage');
const { BatchQualityValidator } = require('./validator');

async function generatePSEOSite(dataFile, config) {
  console.log('Starting pSEO generation...');

  // Load data
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  console.log(`Loaded ${data.length} data rows`);

  // Initialize components
  const checkpoint = new CheckpointManager('./checkpoints');
  const storage = new FileSystemStorage('./dist');
  const validator = new BatchQualityValidator();

  // Batch processor
  const processor = new BatchProcessor({ chunkSize: 1000 });

  const allPages = await processor.process(data, async (chunk, chunkIndex) => {
    console.log(`Processing chunk ${chunkIndex}...`);

    // Parallel generation with workers
    const pool = new WorkerPool('./worker.js', { maxWorkers: 6 });
    const pages = await pool.execute(chunk.map(row => ({ data: row, template: config.template })));

    // Validate batch quality
    const validation = validator.validate(pages);
    console.log(`Quality: ${validation.passed}/${validation.total} passed`);

    if (validation.failed > validation.total * 0.1) {
      throw new Error(`Too many failures: ${validation.failed}/${validation.total}`);
    }

    // Save to storage
    await storage.saveBatch(pages);

    return pages;
  });

  // Generate sitemap
  await storage.generateSitemap(allPages);

  console.log(`✓ Generated ${allPages.length} pages`);
  console.log('✓ Sitemap created');

  return allPages;
}

// Run
generatePSEOSite('./data/cities.json', {
  template: fs.readFileSync('./templates/location.html', 'utf8')
});
```

## Scaling Summary

| Pages | Workers | Time | Storage | Strategy |
|-------|---------|------|---------|----------|
| 1k | 1 | 3 min | File | Single process |
| 10k | 4 | 10 min | File | Worker pool |
| 100k | 6 | 67 min | DB | Batch + checkpoint |
| 1M+ | 8 | 11 hrs | DB + CDN | Distributed workers |
