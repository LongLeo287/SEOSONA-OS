const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPOS_DIR = path.join(__dirname, '..', '..', '..', '5_RESEARCH');
const INGEST_DIR = path.join(__dirname, '..', '..', '..', '2_KNOWLEDGE', 'raw_data');

// Extensions to extract from cloned repos
const ALLOWED_EXTS = ['.md', '.mdx', '.txt', '.prompt', '.json'];
const EXCLUDED_DIRS = ['.git', 'node_modules', 'assets', 'images', 'test', 'tests', '__pycache__'];

function getTrackedUrls() {
    const urls = new Set();
    const files = fs.readdirSync(REPOS_DIR);
    
    for (const file of files) {
        if (!file.endsWith('.txt')) continue;
        const content = fs.readFileSync(path.join(REPOS_DIR, file), 'utf-8');
        const lines = content.split('\n');
        for (let line of lines) {
            line = line.trim();
            // Match https://github.com/...
            const match = line.match(/(https:\/\/github\.com\/[^\s/]+\/[^\s/]+)/);
            if (match) {
                const url = match[1];
                if (!url.toLowerCase().includes('longleo287/seosona')) {
                    urls.add(url);
                }
            }
        }
    }
    return Array.from(urls);
}

function getExistingIngestions() {
    const files = fs.readdirSync(INGEST_DIR);
    return files.map(f => f.replace('.md.aaak', '').replace('.md', '').toLowerCase());
}

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!EXCLUDED_DIRS.includes(file)) {
                walkDir(filePath, fileList);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (ALLOWED_EXTS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}

function ingestRepo(url) {
    const repoName = url.split('/').pop().toLowerCase();
    console.log(`\n===========================================`);
    console.log(`[START] Ingesting ${repoName}...`);
    
    const clonePath = path.join(REPOS_DIR, repoName);
    const outFile = path.join(INGEST_DIR, `${repoName}.md`);
    
    try {
        // Clone
        if (fs.existsSync(clonePath)) {
            fs.rmSync(clonePath, { recursive: true, force: true });
        }
        console.log(`Cloning ${url} ...`);
        execSync(`git clone --depth 1 ${url} "${clonePath}"`, { 
            stdio: 'ignore',
            env: {
                ...process.env,
                GIT_TERMINAL_PROMPT: '0',
                GCM_INTERACTIVE: 'false'
            }
        });
        
        // Extract
        const filesToExtract = walkDir(clonePath);
        let compiledContent = `# Ingested Knowledge: ${repoName}\n\n`;
        compiledContent += `Source: ${url}\n`;
        compiledContent += `Ingestion Date: ${new Date().toISOString()}\n\n`;
        
        let fileCount = 0;
        for (const f of filesToExtract) {
            try {
                const content = fs.readFileSync(f, 'utf-8');
                // Skip files that are huge (e.g. package-lock.json)
                if (content.length > 500000) continue; 
                
                const relativePath = path.relative(clonePath, f);
                compiledContent += `\n\n--- FILE: ${relativePath} ---\n\n`;
                compiledContent += content;
                fileCount++;
            } catch (e) {
                // Ignore read errors
            }
        }
        
        // Save
        fs.writeFileSync(outFile, compiledContent, 'utf-8');
        console.log(`[SUCCESS] Saved ${fileCount} documents to ${outFile}`);
        
    } catch (err) {
        console.error(`[ERROR] Failed to ingest ${repoName}:`, err.message);
    } finally {
        // Cleanup clone (UAP rule)
        if (fs.existsSync(clonePath)) {
            console.log(`Cleaning up cloned directory...`);
            // Windows friendly force delete
            try {
                execSync(`Remove-Item -Recurse -Force "${clonePath}"`, { shell: 'powershell.exe', stdio: 'ignore' });
            } catch(e) {
                try {
                    fs.rmSync(clonePath, { recursive: true, force: true });
                } catch(e2) {}
            }
        }
    }
}

async function run() {
    const trackedUrls = getTrackedUrls();
    const existing = getExistingIngestions();
    
    console.log(`Found ${trackedUrls.length} tracked URLs.`);
    console.log(`Found ${existing.length} existing ingestions.`);
    
    const pending = trackedUrls.filter(url => {
        const repoName = url.split('/').pop().toLowerCase();
        return !existing.includes(repoName);
    });
    
    console.log(`\nFound ${pending.length} missing repositories to ingest!`);
    if (pending.length === 0) {
        console.log("Everything is up to date.");
        return;
    }
    
    for (const url of pending) {
        ingestRepo(url);
    }
    
    console.log(`\n[COMPLETE] All missing repositories have been ingested.`);
}

run();
