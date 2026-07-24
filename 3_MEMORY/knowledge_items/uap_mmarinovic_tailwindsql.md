# KI: mmarinovic/tailwindsql

## Overview
Like TailwindCSS, but for SQL queries in React Server Components

## Tech Stack (from code)
- TypeScript (8 files)
- TypeScript (React) (7 files)
- JavaScript (4 files)
- **Total:** 28 files, 11 directories
- **File types:** .ts: 8, .tsx: 7, .js: 4, .json: 3, .md: 2, .gitignore: 1, .url: 1, .css: 1

## Public API / Exports
- `parseClassName` from `src/lib/index.ts`
- `parseClassNames` from `src/lib/index.ts`
- `type QueryConfig` from `src/lib/index.ts`
- `buildQuery` from `src/lib/index.ts`
- `type BuiltQuery` from `src/lib/index.ts`
- `default` from `src/lib/index.ts`
- `parseClassName` from `src\lib\index.ts`
- `parseClassNames` from `src\lib\index.ts`
- `type QueryConfig` from `src\lib\index.ts`
- `buildQuery` from `src\lib\index.ts`
- `type BuiltQuery` from `src\lib\index.ts`
- `default` from `src\lib\index.ts`
- `JoinConfig` from `src\lib\parser.ts`
- `QueryConfig` from `src\lib\parser.ts`
- `parseClassName` from `src\lib\parser.ts`
- `parseClassNames` from `src\lib\parser.ts`
- `BuiltQuery` from `src\lib\query-builder.ts`
- `buildQuery` from `src\lib\query-builder.ts`

## Dependencies
### Dependencies (from package.json)
- `better-sqlite3`: ^11.6.0
- `next`: ^14.2.18
- `react`: ^18.3.1
- `react-dom`: ^18.3.1

### Dev Dependencies
- `@types/better-sqlite3`: ^7.6.11
- `@types/node`: ^22.10.1
- `@types/react`: ^18.3.12
- `@types/react-dom`: ^18.3.1
- `autoprefixer`: ^10.4.20
- `postcss`: ^8.4.49
- `tailwindcss`: ^3.4.16
- `tsx`: ^4.19.2
- `typescript`: ^5.7.2

## Imports Detected in Source
- `better-sqlite3`
- `fs`
- `path`

## Available Commands
- `npm run dev` -- `next dev`
- `npm run build` -- `npm run seed:check && next build`
- `npm run start` -- `next start`
- `npm run seed` -- `tsx src/seed.ts`
- `npm run seed:check` -- `node scripts/check-db.js`

## File Structure
```
  .gitignore
  README.md
  next.config.js
  package-lock.json
  package.json
  postcss.config.js
  repository.url
  tailwind.config.js
  tsconfig.json
  .cursor/
    commands/
      remove-code-slop.md
  scripts/
    check-db.js
  src/
    seed.ts
    app/
      globals.css
      icon.svg
      layout.tsx
      page.tsx
      api/
        query/
          route.ts
        schema/
          route.ts
    components/
      DB.tsx
      DatabaseExplorer.tsx
      Example.tsx
      Join.tsx
      Playground.tsx
      index.ts
    lib/
      db.ts
      index.ts
      parser.ts
      query-builder.ts
```

## Key Source Excerpts
### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server components (default in App Router)
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
};

module.exports = nextConfig;



```

### src/lib/index.ts
```typescript
// TailwindSQL - Like TailwindCSS, but for SQL queries
export { parseClassName, parseClassNames, type QueryConfig } from './parser';
export { buildQuery, type BuiltQuery } from './query-builder';
export { default as db } from './db';



```

### src\lib\db.ts
```typescript
import Database from 'better-sqlite3';
import path from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

let dbInstance: InstanceType<typeof Database> | null = null;

function getDb(): InstanceType<typeof Database> {
  if (!dbInstance) {
    // On Vercel, the filesystem is read-only except /tmp
    // We need to check if we're on Vercel and copy the DB to /tmp if needed
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
    const originalDbPath = path.join(process.cwd(), 'tailwindsql.db');
    
    let dbPath: string;
    
    if (isVercel) {
      // On Vercel, use /tmp for writable database
      dbPath = '/tmp/tailwindsql.db';
      
      // Copy from project root to /tmp if it exists and /tmp version doesn't
      if (existsSync(originalDbPath) && !existsSync(dbPath)) {
        try {
          console.log('Copying database from', originalDbPath, 'to', dbPath);
          // Read the entire file and write to /tmp
          const dbBuffer = readFileSync(originalDbPath);
          writeFileSync(dbPath, dbBuffer);
          // Also copy WAL and SHM files if they exist
          const walPath = originalDbPath + '-wal';
          const shmPath = originalDbPath + '-shm';
          if (existsSync(walPath)) {
            writeFileSync('/tmp/tailwindsql.db-wal', readFileSync(walPath));
          }
          if (existsSync(shmPath)) {
            writeFileSync('/tmp/tailwindsql.db-shm', readFileSync(shmPath));
          }
          conso
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `component` · **Fit:** 33/100 · **Auto-apply:** True
- **Evidence:** `component`
- **All scores:** {'seosona-os': 24, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
