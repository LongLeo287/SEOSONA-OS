const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SOURCE_DIR = path.join(__dirname, '..', '..', '..', '2_KNOWLEDGE', 'raw_data', 'wave15_sources');
const DEST_AGENT_SKILLS = path.join(__dirname, '..', '..', '..', '2_KNOWLEDGE', 'frameworks', 'agent_skills');
const DEST_SHADCN = path.join(__dirname, '..', '..', '..', '2_KNOWLEDGE', 'frameworks', 'ui_and_components', 'shadcn');

if (!fs.existsSync(DEST_AGENT_SKILLS)) fs.mkdirSync(DEST_AGENT_SKILLS, { recursive: true });
if (!fs.existsSync(DEST_SHADCN)) fs.mkdirSync(DEST_SHADCN, { recursive: true });

function walkDir(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!['.git', 'node_modules', 'dist', '.next'].includes(file)) {
                walkDir(filePath, fileList);
            }
        } else {
            fileList.push(filePath);
        }
    }
    return fileList;
}

function processSkillFile(filePath, repoName) {
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath, ext);
    if (!['.ts', '.js', '.md', '.json', '.tsx'].includes(ext)) return;
    
    let content = '';
    try {
        content = fs.readFileSync(filePath, 'utf-8');
    } catch (e) { return; }
    
    if (content.length > 200000) return; // skip very large files

    let title = `${repoName} - ${basename}`;
    let description = `Ingested skill/component from ${repoName}`;

    // Simple parsing for shadcn components
    if (repoName === 'ui' && (filePath.includes('registry') || filePath.includes('components'))) {
        const destDir = path.join(DEST_SHADCN, basename);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        
        const outYaml = `---
name: "shadcn-${basename}"
description: "Shadcn UI component: ${basename}"
author: "Wave15"
---
# ${basename}
\`\`\`tsx
${content}
\`\`\`
`;
        fs.writeFileSync(path.join(destDir, 'SKILL.md'), outYaml);
        return;
    }

    // For other agent skills
    const hashId = crypto.createHash('md5').update(filePath).digest('hex').substring(0, 6);
    const destDir = path.join(DEST_AGENT_SKILLS, `${repoName}_${basename}_${hashId}`);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const outYaml = `---
name: "${repoName}_${basename}"
description: "${description}"
author: "Wave15"
---
# Source: ${repoName}/${basename}${ext}

\`\`\`${ext.substring(1)}
${content}
\`\`\`
`;
    fs.writeFileSync(path.join(destDir, 'SKILL.md'), outYaml);
}

const repos = fs.readdirSync(SOURCE_DIR);
for (const repo of repos) {
    const repoPath = path.join(SOURCE_DIR, repo);
    if (!fs.statSync(repoPath).isDirectory()) continue;
    
    console.log(`Processing repo: ${repo}...`);
    const files = walkDir(repoPath);
    for (const f of files) {
        processSkillFile(f, repo);
    }
}

console.log("Wave 15 ingestion complete.");
